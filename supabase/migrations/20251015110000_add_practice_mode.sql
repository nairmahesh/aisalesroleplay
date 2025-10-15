/*
  # Add Practice Mode to Call Sessions

  ## Changes
  1. Add `practice_mode` column to call_sessions table
     - Values: 'ai_roleplay', 'human_roleplay', 'self_practice'
     - Default: 'ai_roleplay' for backward compatibility

  2. Add `feedback_enabled` column to track if feedback should be provided
     - Self-practice mode won't have feedback
     - Other modes will have feedback enabled

  ## Notes
  - AI Roleplay: Interactive conversation with AI bot (current default behavior)
  - Human Roleplay: Practice with a colleague or manager playing the prospect
  - Self Practice: Record pitch and get feedback from AI or colleagues
*/

-- Add practice_mode column to call_sessions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'call_sessions' AND column_name = 'practice_mode'
  ) THEN
    ALTER TABLE call_sessions
    ADD COLUMN practice_mode text DEFAULT 'ai_roleplay'
    CHECK (practice_mode IN ('ai_roleplay', 'human_roleplay', 'self_practice'));
  END IF;
END $$;

-- Add feedback_enabled column to call_sessions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'call_sessions' AND column_name = 'feedback_enabled'
  ) THEN
    ALTER TABLE call_sessions
    ADD COLUMN feedback_enabled boolean DEFAULT true;
  END IF;
END $$;

-- Create index for filtering by practice mode
CREATE INDEX IF NOT EXISTS idx_call_sessions_practice_mode ON call_sessions(practice_mode);
