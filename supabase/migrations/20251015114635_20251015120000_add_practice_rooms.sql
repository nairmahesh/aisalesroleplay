/*
  # Add Practice Rooms for Human-to-Human Practice

  ## Overview
  Creates a new `practice_rooms` table to support human-to-human roleplay sessions
  where sales reps can practice with colleagues or managers in real-time.

  ## Changes
  1. New Tables
    - `practice_rooms`
      - `id` (uuid, primary key)
      - `name` (text) - Room name/title
      - `created_by` (uuid) - User who created the room
      - `status` (text) - 'waiting', 'active', 'completed'
      - `participants_count` (integer) - Number of current participants
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `practice_rooms` table
    - Add policies for authenticated users to:
      - View all rooms
      - Create new rooms
      - Update rooms they created

  ## Notes
  - Human-to-human practice allows real-time collaboration
  - Rooms support multiple participants for group practice scenarios
  - Status tracks room lifecycle from waiting to completion
*/

-- Create practice_rooms table
CREATE TABLE IF NOT EXISTS practice_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed')),
  participants_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE practice_rooms ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view practice rooms"
  ON practice_rooms FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create practice rooms"
  ON practice_rooms FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own rooms"
  ON practice_rooms FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete their own rooms"
  ON practice_rooms FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_practice_rooms_status ON practice_rooms(status);
CREATE INDEX IF NOT EXISTS idx_practice_rooms_created_by ON practice_rooms(created_by);
CREATE INDEX IF NOT EXISTS idx_practice_rooms_created_at ON practice_rooms(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_practice_room_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS practice_rooms_updated_at ON practice_rooms;
CREATE TRIGGER practice_rooms_updated_at
  BEFORE UPDATE ON practice_rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_practice_room_updated_at();