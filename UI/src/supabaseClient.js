import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://bkqboaktmxvmcphvaaan.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcWJvYWt0bXh2bWNwaHZhYWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzE5MzksImV4cCI6MjA3NTc0NzkzOX0.5MvF2YMKHAmY3CIRzPZuHpLyNY12KAnoZLCe4XFByCs'

export const supabase = createClient(supabaseUrl, supabaseKey)