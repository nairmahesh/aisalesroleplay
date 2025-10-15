/*
  # Add Transcript Evidence to Call Scores

  ## Overview
  Enhances the call_scores table to include transcript evidence, timestamps, and improvement examples
  similar to Hyperbound's detailed scoring system.

  ## Changes
  - Add `transcript_evidence` column for specific quotes from the call
  - Add `timestamp` column for when the evidence occurred
  - Add `improvement_examples` column for specific examples of what to say/do differently

  ## Notes
  - These fields provide context for why a score was given
  - Helps users understand exactly what they did right or wrong
*/

-- Add new columns to call_scores
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'call_scores' AND column_name = 'transcript_evidence'
  ) THEN
    ALTER TABLE call_scores ADD COLUMN transcript_evidence text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'call_scores' AND column_name = 'timestamp'
  ) THEN
    ALTER TABLE call_scores ADD COLUMN timestamp text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'call_scores' AND column_name = 'improvement_examples'
  ) THEN
    ALTER TABLE call_scores ADD COLUMN improvement_examples text[];
  END IF;
END $$;
