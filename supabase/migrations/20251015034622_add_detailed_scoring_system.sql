/*
  # Add Detailed Scoring System

  ## Overview
  Implements a comprehensive, criteria-based scoring system similar to Hyperbound's detailed call analysis.
  Each call is evaluated against multiple specific criteria with individual scores and feedback.

  ## New Tables
  
  1. **scoring_criteria**
     - `id` (uuid, primary key) - Unique criteria identifier
     - `name` (text) - Name of the criteria (e.g., "Permission based opener")
     - `description` (text) - What this criteria evaluates
     - `max_score` (integer) - Maximum points for this criteria
     - `category` (text) - Category like "opening", "discovery", "closing"
     - `order_index` (integer) - Display order
     - `created_at` (timestamptz)
  
  2. **call_scores**
     - `id` (uuid, primary key) - Unique score record
     - `session_id` (uuid, foreign key to call_sessions)
     - `criteria_id` (uuid, foreign key to scoring_criteria)
     - `score` (integer) - Points earned for this criteria
     - `passed` (boolean) - Whether criteria was met
     - `feedback` (text) - Detailed feedback explaining the score
     - `created_at` (timestamptz)

  ## Changes to Existing Tables
  - Add `total_score` column to call_analytics
  - Add `max_score` column to call_analytics
  - Add `overall_feedback` column to call_analytics

  ## Security
  - Enable RLS on new tables
  - Users can view their own call scores
  - Admins/managers can view all scores

  ## Sample Data
  - Insert 10 default scoring criteria covering all aspects of a sales call
*/

-- Create scoring_criteria table
CREATE TABLE IF NOT EXISTS scoring_criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  max_score integer NOT NULL DEFAULT 10,
  category text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create call_scores table
CREATE TABLE IF NOT EXISTS call_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES call_sessions(id) ON DELETE CASCADE,
  criteria_id uuid NOT NULL REFERENCES scoring_criteria(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  passed boolean NOT NULL DEFAULT false,
  feedback text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, criteria_id)
);

-- Add scoring columns to call_analytics table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'call_analytics' AND column_name = 'total_score'
  ) THEN
    ALTER TABLE call_analytics ADD COLUMN total_score integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'call_analytics' AND column_name = 'max_score'
  ) THEN
    ALTER TABLE call_analytics ADD COLUMN max_score integer DEFAULT 100;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'call_analytics' AND column_name = 'overall_feedback'
  ) THEN
    ALTER TABLE call_analytics ADD COLUMN overall_feedback text;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE scoring_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_scores ENABLE ROW LEVEL SECURITY;

-- Policies for scoring_criteria (readable by all authenticated users)
CREATE POLICY "Authenticated users can view scoring criteria"
  ON scoring_criteria FOR SELECT
  TO authenticated
  USING (true);

-- Policies for call_scores
CREATE POLICY "Users can view scores for their own calls"
  ON call_scores FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM call_sessions
      WHERE call_sessions.id = call_scores.session_id
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

CREATE POLICY "System can insert call scores"
  ON call_scores FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM call_sessions
      WHERE call_sessions.id = call_scores.session_id
      AND call_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "System can update call scores"
  ON call_scores FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM call_sessions
      WHERE call_sessions.id = call_scores.session_id
      AND call_sessions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM call_sessions
      WHERE call_sessions.id = call_scores.session_id
      AND call_sessions.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_call_scores_session_id ON call_scores(session_id);
CREATE INDEX IF NOT EXISTS idx_call_scores_criteria_id ON call_scores(criteria_id);

-- Insert default scoring criteria
INSERT INTO scoring_criteria (name, description, max_score, category, order_index) VALUES
  ('Permission based opener', 'Used a permission-based opener to respect prospect time and set clear expectations for the call', 10, 'opening', 1),
  ('Used research on prospect', 'Demonstrated prior knowledge about the prospect or their company through research', 10, 'opening', 2),
  ('Provided social proof', 'Referenced relevant case studies, customer success stories, or similar clients in their industry', 10, 'discovery', 3),
  ('Asked if social proof was relevant', 'Checked whether the social proof resonated with the prospect rather than assuming it did', 10, 'discovery', 4),
  ('SDR asked for preconception', 'Asked what the prospect already knows or thinks about the product/company before pitching', 10, 'discovery', 5),
  ('Active listening', 'Demonstrated active listening by acknowledging prospect concerns and building on their responses', 10, 'discovery', 6),
  ('Asked open-ended questions', 'Used open-ended discovery questions to understand prospect needs and pain points', 10, 'discovery', 7),
  ('Handled objections well', 'Addressed prospect objections with empathy, acknowledgment, and relevant information', 10, 'handling', 8),
  ('Clear value proposition', 'Articulated a clear and compelling value proposition tailored to the prospect''s specific needs', 10, 'value', 9),
  ('Strong closing', 'Ended the call with clear next steps, summarized key points, and confirmed prospect commitment', 10, 'closing', 10)
ON CONFLICT DO NOTHING;
