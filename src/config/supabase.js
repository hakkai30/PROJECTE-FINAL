import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("ERROR: Missing Supabase Environment Variables. Check Vercel Settings.");
}

export const supabase = createClient(
  supabaseUrl || "https://wdazdicwhgjnnkvqgxqm.supabase.co/rest/v1/", 
  supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkYXpkaWN3aGdqbm5rdnFneHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTc3NTksImV4cCI6MjA5MzQ3Mzc1OX0.c72AoOwsyEvuk4rRQSfOOIOsF5fvrdN63XPoCl74o5A"
);
