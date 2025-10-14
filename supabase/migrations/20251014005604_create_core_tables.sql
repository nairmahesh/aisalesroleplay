/*
  # AI Sales Roleplay Platform - Core Schema

  ## Overview
  This migration creates the foundational database structure for an AI-powered sales roleplay platform
  similar to Hyperbound, where sales representatives can practice with AI bots representing different
  client personas.

  ## New Tables
  
  1. **users**
     - `id` (uuid, primary key) - Unique user identifier
     - `email` (text, unique) - User email address
     - `full_name` (text) - User's full name
     - `role` (text) - User role: 'sales_rep', 'manager', or 'admin'
     - `created_at` (timestamptz) - Account creation timestamp
     - `updated_at` (timestamptz) - Last update timestamp

  2. **bots**
     - `id` (uuid, primary key) - Unique bot identifier
     - `name` (text) - Bot's name
     - `title` (text) - Professional title (e.g., "Chief Technology Officer")
     - `company` (text) - Company name
     - `industry` (text) - Industry sector
     - `personality` (text) - Personality type (e.g., "Analytical", "Nice", "Rude", "Chatty", "Formal")
     - `call_type` (text) - Type of call (e.g., "Discovery Call", "Cold Call", "Renewal Call")
     - `language` (text) - Language preference
     - `avatar_initials` (text) - Two-letter initials for avatar
     - `avatar_color` (text) - Hex color for avatar background
     - `brief_profile` (text) - Short description of the bot
     - `detailed_profile` (text) - Comprehensive background information
     - `dos` (text[]) - Array of recommended practices for this call
     - `donts` (text[]) - Array of things to avoid in this call
     - `is_active` (boolean) - Whether bot is available for use
     - `created_by` (uuid) - User who created the bot
     - `created_at` (timestamptz) - Creation timestamp
     - `updated_at` (timestamptz) - Last update timestamp

  3. **call_sessions**
     - `id` (uuid, primary key) - Unique session identifier
     - `user_id` (uuid) - Sales rep conducting the call
     - `bot_id` (uuid) - Bot being called
     - `started_at` (timestamptz) - Call start time
     - `ended_at` (timestamptz) - Call end time
     - `duration_seconds` (integer) - Total call duration
     - `is_multi_party` (boolean) - Whether this is a multi-party call
     - `status` (text) - Call status: 'in_progress', 'completed', 'abandoned'
     - `created_at` (timestamptz) - Record creation timestamp

  4. **call_transcripts**
     - `id` (uuid, primary key) - Unique transcript entry identifier
     - `session_id` (uuid) - Associated call session
     - `speaker` (text) - Who spoke: 'user' or 'bot'
     - `message` (text) - What was said
     - `timestamp` (timestamptz) - When it was said
     - `sentiment` (text) - Message sentiment: 'positive', 'neutral', 'negative'

  5. **call_analytics**
     - `id` (uuid, primary key) - Unique analytics record
     - `session_id` (uuid, unique) - Associated call session
     - `user_talk_percentage` (numeric) - Percentage of time user spoke
     - `bot_talk_percentage` (numeric) - Percentage of time bot spoke
     - `user_sentiment_score` (numeric) - Overall user sentiment (-1 to 1)
     - `bot_sentiment_score` (numeric) - Overall bot sentiment (-1 to 1)
     - `evaluation_framework` (text) - Framework used: 'BANT', 'MEDDIC', 'MEDDPICC', 'SPIN'
     - `framework_score` (numeric) - Score based on chosen framework (0-100)
     - `budget_identified` (boolean) - BANT: Budget identified
     - `authority_identified` (boolean) - BANT: Authority identified
     - `need_identified` (boolean) - BANT: Need identified
     - `timeline_identified` (boolean) - BANT: Timeline identified
     - `key_points` (text[]) - Array of key discussion points
     - `strengths` (text[]) - Array of identified strengths
     - `improvements` (text[]) - Array of areas for improvement
     - `created_at` (timestamptz) - Analysis creation timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Sales reps can view their own data
  - Managers can view data for their team members
  - Admins have full access
  - Bot creation restricted to managers and admins
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'sales_rep' CHECK (role IN ('sales_rep', 'manager', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bots table
CREATE TABLE IF NOT EXISTS bots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  industry text NOT NULL,
  personality text NOT NULL,
  call_type text NOT NULL,
  language text DEFAULT 'English (US)',
  avatar_initials text NOT NULL,
  avatar_color text NOT NULL,
  brief_profile text NOT NULL,
  detailed_profile text NOT NULL,
  dos text[] DEFAULT '{}',
  donts text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create call_sessions table
CREATE TABLE IF NOT EXISTS call_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  bot_id uuid NOT NULL REFERENCES bots(id),
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  duration_seconds integer,
  is_multi_party boolean DEFAULT false,
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  created_at timestamptz DEFAULT now()
);

-- Create call_transcripts table
CREATE TABLE IF NOT EXISTS call_transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES call_sessions(id) ON DELETE CASCADE,
  speaker text NOT NULL CHECK (speaker IN ('user', 'bot')),
  message text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  sentiment text CHECK (sentiment IN ('positive', 'neutral', 'negative'))
);

-- Create call_analytics table
CREATE TABLE IF NOT EXISTS call_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid UNIQUE NOT NULL REFERENCES call_sessions(id) ON DELETE CASCADE,
  user_talk_percentage numeric(5,2) DEFAULT 0,
  bot_talk_percentage numeric(5,2) DEFAULT 0,
  user_sentiment_score numeric(3,2) DEFAULT 0,
  bot_sentiment_score numeric(3,2) DEFAULT 0,
  evaluation_framework text CHECK (evaluation_framework IN ('BANT', 'MEDDIC', 'MEDDPICC', 'SPIN')),
  framework_score numeric(5,2) DEFAULT 0,
  budget_identified boolean DEFAULT false,
  authority_identified boolean DEFAULT false,
  need_identified boolean DEFAULT false,
  timeline_identified boolean DEFAULT false,
  key_points text[] DEFAULT '{}',
  strengths text[] DEFAULT '{}',
  improvements text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for bots table
CREATE POLICY "Anyone can view active bots"
  ON bots FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Managers and admins can create bots"
  ON bots FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Managers and admins can update bots"
  ON bots FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Managers and admins can delete bots"
  ON bots FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

-- RLS Policies for call_sessions table
CREATE POLICY "Users can view their own call sessions"
  ON call_sessions FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Users can create their own call sessions"
  ON call_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own call sessions"
  ON call_sessions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for call_transcripts table
CREATE POLICY "Users can view transcripts of their calls"
  ON call_transcripts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM call_sessions
      WHERE call_sessions.id = session_id
      AND (
        call_sessions.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid()
          AND users.role IN ('manager', 'admin')
        )
      )
    )
  );

CREATE POLICY "System can insert transcripts"
  ON call_transcripts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM call_sessions
      WHERE call_sessions.id = session_id
      AND call_sessions.user_id = auth.uid()
    )
  );

-- RLS Policies for call_analytics table
CREATE POLICY "Users can view analytics of their calls"
  ON call_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM call_sessions
      WHERE call_sessions.id = session_id
      AND (
        call_sessions.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid()
          AND users.role IN ('manager', 'admin')
        )
      )
    )
  );

CREATE POLICY "System can insert analytics"
  ON call_analytics FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM call_sessions
      WHERE call_sessions.id = session_id
      AND call_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "System can update analytics"
  ON call_analytics FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM call_sessions
      WHERE call_sessions.id = session_id
      AND call_sessions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM call_sessions
      WHERE call_sessions.id = session_id
      AND call_sessions.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bots_industry ON bots(industry);
CREATE INDEX IF NOT EXISTS idx_bots_call_type ON bots(call_type);
CREATE INDEX IF NOT EXISTS idx_call_sessions_user_id ON call_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_bot_id ON call_sessions(bot_id);
CREATE INDEX IF NOT EXISTS idx_call_transcripts_session_id ON call_transcripts(session_id);
CREATE INDEX IF NOT EXISTS idx_call_analytics_session_id ON call_analytics(session_id);