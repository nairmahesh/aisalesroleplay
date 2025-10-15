/*
  # Fix Practice Rooms RLS Policy

  1. Changes
    - Drop restrictive INSERT policy for practice_rooms
    - Add more permissive policy allowing anon/public to create rooms
    - Update UPDATE and DELETE policies to work with demo mode
    - This supports demo mode without real authentication

  2. Security
    - Allow anonymous users to create, update, and delete rooms
    - Suitable for demo/development environment
*/

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
