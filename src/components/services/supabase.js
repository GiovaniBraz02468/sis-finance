import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://cmyvbssneypotxubxnxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNteXZic3NuZXlwb3R4dWJ4bnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyMjA2MTksImV4cCI6MjA1Mjc5NjYxOX0.S2HIOdu3A7URTXkFLBhqBqbiZjEmQEmsJwt18Gd1nyc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// Função para verificar se o usuário está logado
export const getUser = () => supabase.auth.user();