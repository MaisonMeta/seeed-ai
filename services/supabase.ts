import { createClient } from '@supabase/supabase-js';

// In a sandboxed environment where .env variables are not available,
// we provide the real credentials to enable full functionality.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tlsrlqglzrfdpdxalqwh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsc3JscWdsenJmZHBkeGFscXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMzI1NDksImV4cCI6MjA3MTkwODU0OX0.9ehXWOCsgmkwraDYt-LZOVUL8DybN22J3R0N5YJvSVc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
