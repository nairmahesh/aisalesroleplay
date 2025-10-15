/*
  # Add Transcript References Array Column

  ## Overview
  Adds a column to store multiple transcript references (with timestamps and quotes)
  for each scoring criterion, similar to Hyperbound's numbered reference system.

  ## Changes
  - Add `transcript_references` JSONB column to call_scores table
  - Each reference includes: timestamp, text, and speaker

  ## Example Structure
  transcript_references: [
    {timestamp: "0:14", text: "Quote from call", speaker: "Rep"},
    {timestamp: "0:27", text: "Another quote", speaker: "Prospect"}
  ]
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'call_scores' AND column_name = 'transcript_references'
  ) THEN
    ALTER TABLE call_scores ADD COLUMN transcript_references jsonb;
  END IF;
END $$;
