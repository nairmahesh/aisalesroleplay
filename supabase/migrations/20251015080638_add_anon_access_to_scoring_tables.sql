/*
  # Add anonymous access to scoring tables for demo

  1. Changes
    - Add policies to allow anonymous (unauthenticated) users to read scoring_criteria
    - Add policies to allow anonymous users to read call_scores
    - This enables the demo to work without actual authentication

  2. Security Note
    - These policies are suitable for demo/development environments
    - In production, you should implement proper authentication
*/

-- Allow anonymous users to view scoring criteria
CREATE POLICY "Anonymous users can view scoring criteria"
  ON scoring_criteria
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to view call scores
CREATE POLICY "Anonymous users can view call scores"
  ON call_scores
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to view call analytics
DROP POLICY IF EXISTS "Users can view their own call analytics" ON call_analytics;
CREATE POLICY "Users can view call analytics"
  ON call_analytics
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Allow anonymous users to view call sessions
DROP POLICY IF EXISTS "Users can view their own call sessions" ON call_sessions;
CREATE POLICY "Users can view call sessions"
  ON call_sessions
  FOR SELECT
  TO authenticated, anon
  USING (true);
