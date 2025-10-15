import { supabase } from '../lib/supabase';

const migrationSQL = `
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can create practice rooms" ON practice_rooms;
DROP POLICY IF EXISTS "Users can update their own rooms" ON practice_rooms;
DROP POLICY IF EXISTS "Users can delete their own rooms" ON practice_rooms;

-- Create new permissive policies for anon/public access
CREATE POLICY "Anyone can create practice rooms"
  ON practice_rooms
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update practice rooms"
  ON practice_rooms
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete practice rooms"
  ON practice_rooms
  FOR DELETE
  TO anon, authenticated
  USING (true);
`;

export async function applyRLSFix() {
  try {
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { query: statement });
      if (error) {
        console.error('SQL Error:', error);
      }
    }

    console.log('RLS policies updated successfully');
  } catch (error) {
    console.error('Migration error:', error);
  }
}

// Auto-run on import in development
if (import.meta.env.DEV) {
  console.log('Attempting to apply RLS fix...');
  applyRLSFix();
}
