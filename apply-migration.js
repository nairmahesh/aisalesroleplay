import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://kxhzkudsutyezstrqxbd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4aHprdWRzdXR5ZXpzdHJxeGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTc4MjAsImV4cCI6MjA3NTk3MzgyMH0.U47FQ3B5Rjv5R19MM_I6fapZuUeGaaTzFvwzC-uvuds';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    const sql = readFileSync('./supabase/migrations/20251015140000_fix_practice_rooms_rls.sql', 'utf8');

    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.error('Migration error:', error);
    } else {
      console.log('Migration applied successfully');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

applyMigration();
