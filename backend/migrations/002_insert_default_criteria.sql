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
