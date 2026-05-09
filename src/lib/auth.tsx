import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { supabase } from "./supabase";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  createdAt: string;
  walletAddress?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  signUp: async () => ({ success: false }),
  signIn: async () => ({ success: false }),
  signOut: async () => { },
});

function mapSupabaseUser(user: any): AuthUser {
  return {
    id: user.id,
    name: user.user_metadata?.full_name || user.email || "Usuario",
    email: user.email || "",
    role: user.user_metadata?.role || "student",
    createdAt: user.created_at || new Date().toISOString(),
    walletAddress: user.user_metadata?.wallet_address ?? undefined,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { disconnect } = useWallet();

  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error obteniendo sesión:", error.message);
        setUser(null);
        setIsLoading(false);
        return;
      }

      if (data.session?.user) {
        setUser(mapSupabaseUser(data.session.user));
      } else {
        setUser(null);
      }

      setIsLoading(false);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              role: "student",
            },
          },
        });

        if (error) return { success: false, error: error.message };

        // ✅ Insertar perfil automáticamente
        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            name,
            role: "student",
            steam_balance: 0,
            courses_completed: 0,
            certificates: 0,
          });

          setUser(mapSupabaseUser(data.user));
        }

        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error inesperado al registrarse";
        return { success: false, error: message };
      }
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (data.user) {
        setUser(mapSupabaseUser(data.user));
      }

      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error inesperado al iniciar sesión";

      return {
        success: false,
        error: message,
      };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await disconnect();
    } catch {
      // wallet may not be connected
    }
    // Clear the wallet adapter's stored selection so the next user starts clean
    localStorage.removeItem('walletName');
    await supabase.auth.signOut();
    setUser(null);
  }, [disconnect]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}