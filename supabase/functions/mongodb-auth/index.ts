import { MongoClient } from "npm:mongodb@6.8.0";
import { encode as base64Encode } from "https://deno.land/std@0.220.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function respond(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Simple JWT-like token using HMAC
async function createToken(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = { ...payload, iat: now, exp: now + 86400 * 7 }; // 7 days

  const enc = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, "");
  const payloadB64 = btoa(JSON.stringify(tokenPayload)).replace(/=/g, "");
  const data = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g, "");

  return `${data}.${sigB64}`;
}

async function verifyToken(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, sigB64] = parts;
    const data = `${headerB64}.${payloadB64}`;
    const enc = new TextEncoder();

    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigStr = atob(sigB64);
    const sigBytes = new Uint8Array(sigStr.length);
    for (let i = 0; i < sigStr.length; i++) sigBytes[i] = sigStr.charCodeAt(i);

    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(data));
    if (!valid) return null;

    const payload = JSON.parse(atob(payloadB64));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

// Hash password with PBKDF2
async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const enc = new TextEncoder();
  const actualSalt = salt || crypto.randomUUID();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode(actualSalt), iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const hashArray = Array.from(new Uint8Array(bits));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return { hash: hashHex, salt: actualSalt };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const mongoUri = Deno.env.get("MONGODB_URI");
    const jwtSecret = Deno.env.get("AUTH_JWT_SECRET") || "besteamhn-default-secret-change-me";

    if (!mongoUri) {
      return respond({ error: "MongoDB not configured" }, 500);
    }

    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db("besteamhn");
    const users = db.collection("users");

    try {
      // SIGN UP
      if (path === "signup" && req.method === "POST") {
        const { email, password, name, role } = await req.json();

        if (!email || !password || !name) {
          return respond({ error: "Email, password, and name are required" }, 400);
        }

        if (password.length < 6) {
          return respond({ error: "Password must be at least 6 characters" }, 400);
        }

        const existing = await users.findOne({ email: email.toLowerCase() });
        if (existing) {
          return respond({ error: "Email already registered" }, 409);
        }

        const { hash, salt } = await hashPassword(password);

        const newUser = {
          email: email.toLowerCase(),
          name,
          passwordHash: hash,
          passwordSalt: salt,
          role: role === "teacher" ? "teacher" : "student",
          steamBalance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await users.insertOne(newUser);

        const token = await createToken(
          { userId: result.insertedId.toString(), email: newUser.email, name: newUser.name, role: newUser.role },
          jwtSecret
        );

        return respond({
          token,
          user: {
            id: result.insertedId.toString(),
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            steamBalance: newUser.steamBalance,
          },
        });
      }

      // SIGN IN
      if (path === "signin" && req.method === "POST") {
        const { email, password } = await req.json();

        if (!email || !password) {
          return respond({ error: "Email and password are required" }, 400);
        }

        const user = await users.findOne({ email: email.toLowerCase() });
        if (!user) {
          return respond({ error: "Invalid email or password" }, 401);
        }

        const { hash } = await hashPassword(password, user.passwordSalt);
        if (hash !== user.passwordHash) {
          return respond({ error: "Invalid email or password" }, 401);
        }

        // Update last login
        await users.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });

        const token = await createToken(
          { userId: user._id.toString(), email: user.email, name: user.name, role: user.role },
          jwtSecret
        );

        return respond({
          token,
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            steamBalance: user.steamBalance || 0,
          },
        });
      }

      // VERIFY TOKEN / GET PROFILE
      if (path === "me" && req.method === "GET") {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return respond({ error: "No token provided" }, 401);
        }

        const token = authHeader.slice(7);
        const payload = await verifyToken(token, jwtSecret);
        if (!payload) {
          return respond({ error: "Invalid or expired token" }, 401);
        }

        const { ObjectId } = await import("npm:mongodb@6.8.0");
        const user = await users.findOne({ _id: new ObjectId(payload.userId as string) });
        if (!user) {
          return respond({ error: "User not found" }, 404);
        }

        return respond({
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            steamBalance: user.steamBalance || 0,
          },
        });
      }

      // LEADERBOARD
      if (path === "leaderboard" && req.method === "GET") {
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50);

        const topUsers = await users
          .find({}, { projection: { name: 1, steamBalance: 1, coursesCompleted: 1, certificates: 1 } })
          .sort({ steamBalance: -1 })
          .limit(limit)
          .toArray();

        const leaderboardData = topUsers.map((user, i) => ({
          rank: i + 1,
          name: user.name,
          avatar: (user.name as string)
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          steam: user.steamBalance || 0,
          coursesCompleted: user.coursesCompleted || 0,
          certificates: user.certificates || 0,
        }));

        return respond({ leaderboard: leaderboardData });
      }

      return respond({ error: "Not found" }, 404);
    } finally {
      await client.close();
    }
  } catch (err) {
    console.error("Auth error:", err);
    return respond({ error: "Internal server error" }, 500);
  }
});
