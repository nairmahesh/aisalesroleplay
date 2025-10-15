/*
  # Add Employees and External Invite System

  ## Overview
  Adds employee management and external invite capabilities for practice rooms.
  Includes admin permission controls for allowing external participants.

  ## Changes
  1. Create employees table for internal team members
  2. Add settings table for admin configuration
  3. Update practice_rooms with external invite fields
  4. Add RLS policies for employee and settings access

  ## New Tables
  - `employees` - Internal team members who can be selected for practice
    - `id` (uuid, primary key)
    - `name` (text) - Employee full name
    - `email` (text) - Employee email
    - `role` (text) - Employee role/title
    - `is_active` (boolean) - Active status

  - `settings` - System-wide configuration
    - `id` (uuid, primary key)
    - `key` (text) - Setting key (e.g., 'allow_external_invites')
    - `value` (jsonb) - Setting value
    - `updated_by` (uuid) - User who last updated

  ## Room Updates
  - `allow_external` (boolean) - Allow external participant
  - `external_invite_token` (text) - Unique token for external access
  - `external_participant_name` (text) - Name of external participant
*/

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add external invite fields to practice_rooms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'practice_rooms' AND column_name = 'allow_external'
  ) THEN
    ALTER TABLE practice_rooms ADD COLUMN allow_external boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'practice_rooms' AND column_name = 'external_invite_token'
  ) THEN
    ALTER TABLE practice_rooms ADD COLUMN external_invite_token text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'practice_rooms' AND column_name = 'external_participant_name'
  ) THEN
    ALTER TABLE practice_rooms ADD COLUMN external_participant_name text;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employees
CREATE POLICY "Anyone can view active employees"
  ON employees FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all employees"
  ON employees FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for settings
CREATE POLICY "Anyone can read settings"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default settings
INSERT INTO settings (key, value)
VALUES ('allow_external_invites', '{"enabled": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Function to generate external invite token
CREATE OR REPLACE FUNCTION generate_external_invite_token()
RETURNS text AS $$
DECLARE
  chars text := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..32 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_employees_active ON employees(is_active);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_practice_rooms_external_token ON practice_rooms(external_invite_token);

-- Insert sample employees
INSERT INTO employees (name, email, role, is_active)
VALUES
  ('John Smith', 'john.smith@company.com', 'Sales Manager', true),
  ('Sarah Johnson', 'sarah.j@company.com', 'Senior Sales Rep', true),
  ('Mike Chen', 'mike.chen@company.com', 'Account Executive', true),
  ('Emily Rodriguez', 'emily.r@company.com', 'Sales Director', true),
  ('David Park', 'david.park@company.com', 'BDR', true)
ON CONFLICT (email) DO NOTHING;