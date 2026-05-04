import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERROR: Missing Supabase Environment Variables. Check Vercel Settings.");
}

export const supabase = createClient(
  supabaseUrl || "https://missing-url.supabase.co", 
  supabaseAnonKey || "missing-key"
);
