import { createClient } from "@supabase/supabase-js";

const cleanEnv = (value: unknown) =>
  String(value ?? "")
    .trim()
    .replace(/^['"]|['"]$/g, "");

const supabaseUrl = cleanEnv(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = cleanEnv(import.meta.env.VITE_SUPABASE_ANON_KEY);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan variables de entorno de Supabase");
}

try {
  new URL(supabaseUrl);
} catch {
  throw new Error("VITE_SUPABASE_URL no es una URL valida");
}

if (/\s/.test(supabaseAnonKey)) {
  throw new Error("VITE_SUPABASE_ANON_KEY contiene espacios o saltos de linea");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
