/*
  # Update Practice Rooms Schema for Detailed Human-to-Human Practice

  ## Overview
  Adds detailed fields to practice_rooms to capture role assignments, company details,
  and call objectives for structured human-to-human roleplay sessions.

  ## Changes
  1. Add new columns to practice_rooms:
    - `rep_name` (text) - Name of the sales rep
    - `client_name` (text) - Name of the client/prospect
    - `client_company` (text) - Client's company name
    - `client_designation` (text) - Client's job title/designation
    - `company_description` (text) - About the company
    - `call_objective` (text) - What the call aims to achieve
    - `call_cta` (text) - Call to action/desired outcome
    - `room_code` (text) - Unique code for joining room
    - `rep_user_id` (uuid) - User ID of the rep
    - `client_user_id` (uuid) - User ID of the client/partner

  2. Add index for room_code lookup

  ## Notes
  - Supports structured roleplay scenarios
  - Both participants need clear role assignments
  - Call objectives guide the practice session
*/

-- Add new columns to practice_rooms
DO $$
BEGIN
  -- Rep details
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'practice_rooms' AND column_name = 'rep_name'
  ) THEN
    ALTER TABLE practice_rooms ADD COLUMN rep_name text;
  END IF;

  -- Client/Prospect details
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'practice_rooms' AND column_name = 'client_name'
  ) THEN
    ALTER TABLE practice_rooms ADD COLUMN client_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'practice_rooms' AND column_name = 'client_company'
  ) THEN
    ALTER TABLE practice_rooms ADD COLUMN client_company text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'practice_rooms' AND column_name = 'client_designation'
  ) THEN
    ALTER TABLE practice_rooms ADD COLUMN client_designation text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'practice_rooms' AND column_name = 'company_description'
  ) THEN
    ALTER TABLE practice_rooms ADD COLUMN company_description text;
  END IF;

  -- Call details
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'practice_rooms' AND column_name = 'call_objective'
  ) THEN
    ALTER TABLE practice_rooms ADD COLUMN call_objective text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'practice_rooms' AND column_name = 'call_cta'
  ) THEN
    ALTER TABLE practice_rooms ADD COLUMN call_cta text;
  END IF;

  -- Room management
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'practice_rooms' AND column_name = 'room_code'
  ) THEN
    ALTER TABLE practice_rooms ADD COLUMN room_code text UNIQUE;
  END IF;

  -- User assignments
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'practice_rooms' AND column_name = 'rep_user_id'
  ) THEN
    ALTER TABLE practice_rooms ADD COLUMN rep_user_id uuid;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'practice_rooms' AND column_name = 'client_user_id'
  ) THEN
    ALTER TABLE practice_rooms ADD COLUMN client_user_id uuid;
  END IF;
END $$;

-- Create index for room code lookup
CREATE INDEX IF NOT EXISTS idx_practice_rooms_room_code ON practice_rooms(room_code);

-- Function to generate unique room code
CREATE OR REPLACE FUNCTION generate_room_code()
RETURNS text AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
