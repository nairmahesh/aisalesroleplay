/*
  # Add Sample Scoring Data

  ## Overview
  Adds sample scoring data for the demo call session to demonstrate the detailed scoring system.

  ## Changes
  - Inserts sample call scores for the existing demo call session
  - Updates call_analytics with total score and overall feedback
  
  ## Notes
  - This uses demo data for demonstration purposes
  - Scores are based on typical sales call performance
*/

DO $$
DECLARE
  demo_session_id uuid;
  criteria_permission_opener uuid;
  criteria_research uuid;
  criteria_social_proof uuid;
  criteria_social_proof_check uuid;
  criteria_preconception uuid;
  criteria_active_listening uuid;
  criteria_open_questions uuid;
  criteria_objections uuid;
  criteria_value_prop uuid;
  criteria_closing uuid;
BEGIN
  SELECT id INTO demo_session_id FROM call_sessions LIMIT 1;
  
  IF demo_session_id IS NOT NULL THEN
    SELECT id INTO criteria_permission_opener FROM scoring_criteria WHERE name = 'Permission based opener';
    SELECT id INTO criteria_research FROM scoring_criteria WHERE name = 'Used research on prospect';
    SELECT id INTO criteria_social_proof FROM scoring_criteria WHERE name = 'Provided social proof';
    SELECT id INTO criteria_social_proof_check FROM scoring_criteria WHERE name = 'Asked if social proof was relevant';
    SELECT id INTO criteria_preconception FROM scoring_criteria WHERE name = 'SDR asked for preconception';
    SELECT id INTO criteria_active_listening FROM scoring_criteria WHERE name = 'Active listening';
    SELECT id INTO criteria_open_questions FROM scoring_criteria WHERE name = 'Asked open-ended questions';
    SELECT id INTO criteria_objections FROM scoring_criteria WHERE name = 'Handled objections well';
    SELECT id INTO criteria_value_prop FROM scoring_criteria WHERE name = 'Clear value proposition';
    SELECT id INTO criteria_closing FROM scoring_criteria WHERE name = 'Strong closing';

    INSERT INTO call_scores (session_id, criteria_id, score, passed, feedback) VALUES
      (demo_session_id, criteria_permission_opener, 0, false, 'After reviewing the transcript, the sales rep did not use a permission-based opener. A permission-based opener would involve asking the prospect for permission to take a moment of their time or explaining why they''re calling before launching into their pitch. In this call, the rep immediately jumped into their pitch without first acknowledging the prospect''s time and asking for permission to briefly explain why they''re calling. This direct approach without seeking permission can catch prospects off guard and may lead to them ending the call abruptly. Example of a better approach: "Hi, this is [Name]. I know you''re probably busy right now. Would you mind if I took just 30 seconds to explain why I''m calling today?" This shows respect for the prospect''s time and gives them control over the conversation.'),
      (demo_session_id, criteria_research, 8, true, 'The sales rep demonstrated knowledge about the prospect by mentioning specific details about their company and industry. This shows preparation and makes the conversation more relevant and engaging for the prospect.'),
      (demo_session_id, criteria_social_proof, 10, true, 'Excellent use of social proof! The rep referenced relevant case studies and mentioned similar clients in the prospect''s industry, which helps build credibility and shows proven results.'),
      (demo_session_id, criteria_social_proof_check, 6, false, 'While the rep provided social proof, they didn''t explicitly check if it resonated with the prospect. After sharing a case study or customer success story, it''s important to ask something like "Does that scenario sound familiar?" or "Is that similar to what you''re experiencing?" to ensure the example is relevant and engaging.'),
      (demo_session_id, criteria_preconception, 8, true, 'Good job asking what the prospect already knows about your product or company. This helps you understand their starting point and allows you to address any misconceptions or build on positive awareness.'),
      (demo_session_id, criteria_active_listening, 9, true, 'Strong active listening demonstrated throughout the call. The rep acknowledged prospect concerns, paraphrased their responses, and built on what the prospect shared, creating a collaborative conversation.'),
      (demo_session_id, criteria_open_questions, 10, true, 'Excellent use of open-ended questions to understand prospect needs and pain points. Questions like "What challenges are you facing?" and "How does that impact your team?" encouraged the prospect to share detailed information.'),
      (demo_session_id, criteria_objections, 7, true, 'The rep handled objections with empathy and provided relevant information. There''s room for improvement in acknowledging the objection more explicitly before addressing it (e.g., "I understand your concern about...").'),
      (demo_session_id, criteria_value_prop, 8, true, 'The value proposition was clear and tailored to the prospect''s specific needs mentioned during discovery. The rep connected product features to the pain points discussed.'),
      (demo_session_id, criteria_closing, 5, false, 'The closing could be stronger. While the rep mentioned next steps, they didn''t get explicit commitment from the prospect or clearly summarize the key points discussed. A better closing would include: summarizing pain points discussed, confirming the solution addresses their needs, clearly stating next steps with specific dates/times, and asking for explicit commitment (e.g., "Does that next step work for you?").')
    ON CONFLICT (session_id, criteria_id) DO NOTHING;

    UPDATE call_analytics
    SET 
      total_score = 71,
      max_score = 100,
      overall_feedback = 'Overall, this was a solid discovery call with strong questioning and active listening skills. The rep did an excellent job uncovering pain points and providing relevant social proof. Key areas for improvement: (1) Start with a permission-based opener to show respect for the prospect''s time, (2) Verify that social proof examples resonate with the prospect, and (3) Close more strongly with clear next steps and explicit commitment. Focus on these three areas in your next practice session.'
    WHERE session_id = demo_session_id;
  END IF;
END $$;
