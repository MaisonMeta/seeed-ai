import { createClient } from '@supabase/supabase-js';

// Fallback values are provided for the sandboxed development environment.
// In a real production deployment, these MUST be set via environment variables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tlsrlqglzrfdpdxalqwh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsc3JscWdsenJmZHBkeGFscXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMzI1NDksImV4cCI6MjA3MTkwODU0OX0.9ehXWOCsgmkwraDYt-LZOVUL8DybN22J3R0N5YJvSVc';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Supabase URL or Anon Key is missing from environment variables. Using public fallback credentials.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);