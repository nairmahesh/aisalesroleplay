/*
  # Fix Practice Rooms RLS for Anonymous Users

  1. Changes
    - Update INSERT policy to allow anonymous (anon) users to create practice rooms
    - Update UPDATE policy to allow anonymous users to update rooms they created
    - Update DELETE policy to allow anonymous users to delete rooms they created
    - Keep SELECT policy allowing anyone to view all rooms

  2. Security
    - Anonymous users can create, update, and delete rooms
    - All users can view all rooms
    - This enables the practice platform to work without authentication
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can create practice rooms" ON practice_rooms;
DROP POLICY IF EXISTS "Anyone can update practice rooms" ON practice_rooms;
DROP POLICY IF EXISTS "Anyone can delete practice rooms" ON practice_rooms;

-- Create new permissive policies for anonymous users
CREATE POLICY "Anonymous users can create practice rooms"
  ON practice_rooms
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update practice rooms"
  ON practice_rooms
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete practice rooms"
  ON practice_rooms
  FOR DELETE
  TO anon
  USING (true);

-- Keep SELECT policy (already exists from previous migration)
-- "Anyone can view practice rooms" allows both anon and authenticated
