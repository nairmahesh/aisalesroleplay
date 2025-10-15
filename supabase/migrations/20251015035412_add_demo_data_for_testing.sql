/*
  # Add Demo Data for Testing

  ## Overview
  Creates sample data for testing the detailed scoring system including users, bots, call sessions, and analytics.

  ## Sample Data Created
  - 1 demo user (sales rep)
  - 3 sample bots with different personas
  - 3 completed call sessions with full analytics
  - Detailed scores for one session to demonstrate the scoring system

  ## Notes
  - Uses fixed UUIDs for easy reference
  - All timestamps are recent for realistic demo
  - Scores vary to show different performance levels
*/

-- Insert demo user
INSERT INTO users (id, email, full_name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo@example.com', 'Demo User', 'sales_rep')
ON CONFLICT (id) DO NOTHING;

-- Insert demo bots
INSERT INTO bots (id, name, title, company, industry, personality, call_type, avatar_initials, avatar_color, brief_profile, detailed_profile, dos, donts, created_by) VALUES
  (
    '00000000-0000-0000-0000-000000000101',
    'Marcus Johnson',
    'VP of Sales',
    'TechCorp Solutions',
    'SaaS',
    'Analytical',
    'Cold Call',
    'MJ',
    '#3B82F6',
    'VP of Sales at a mid-market SaaS company',
    'Marcus is a data-driven sales leader who values efficiency and ROI. He responds well to metrics and case studies.',
    ARRAY['Use permission-based opener', 'Reference similar customer success stories', 'Ask about current pain points'],
    ARRAY['Don''t pitch immediately', 'Don''t ignore objections', 'Don''t assume budget without asking'],
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'Sarah Chen',
    'CTO',
    'Innovation Labs',
    'Technology',
    'Skeptical',
    'Discovery Call',
    'SC',
    '#8B5CF6',
    'CTO who is cautious about new technology',
    'Sarah is technically savvy and asks tough questions. She needs to understand integration and security thoroughly.',
    ARRAY['Demonstrate technical knowledge', 'Address security concerns proactively', 'Provide technical documentation'],
    ARRAY['Don''t oversimplify technical details', 'Don''t make promises you can''t keep', 'Don''t rush the technical discussion'],
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    'David Kim',
    'Director of Operations',
    'Global Enterprises',
    'Enterprise',
    'Friendly',
    'Warm Call',
    'DK',
    '#10B981',
    'Operations director at a large enterprise',
    'David is friendly and relationship-focused. He values long-term partnerships and comprehensive solutions.',
    ARRAY['Build rapport first', 'Focus on long-term value', 'Discuss implementation support'],
    ARRAY['Don''t be too transactional', 'Don''t ignore his questions', 'Don''t pressure for quick decisions'],
    '00000000-0000-0000-0000-000000000001'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert demo call sessions
INSERT INTO call_sessions (id, user_id, bot_id, started_at, ended_at, duration_seconds, status) VALUES
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days' + INTERVAL '754 seconds',
    754,
    'completed'
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000102',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + INTERVAL '922 seconds',
    922,
    'completed'
  ),
  (
    '00000000-0000-0000-0000-000000000203',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000103',
    NOW() - INTERVAL '3 hours',
    NOW() - INTERVAL '3 hours' + INTERVAL '615 seconds',
    615,
    'completed'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert analytics for all sessions
INSERT INTO call_analytics (session_id, user_talk_percentage, bot_talk_percentage, user_sentiment_score, bot_sentiment_score, evaluation_framework, framework_score, budget_identified, authority_identified, need_identified, timeline_identified, key_points, strengths, improvements, total_score, max_score, overall_feedback) VALUES
  (
    '00000000-0000-0000-0000-000000000201',
    45,
    55,
    0.7,
    0.5,
    'BANT',
    71,
    true,
    false,
    true,
    true,
    ARRAY['Identified clear pain points', 'Discussed budget range', 'Set follow-up meeting'],
    ARRAY['Strong discovery questions', 'Good active listening', 'Effective use of social proof'],
    ARRAY['Need permission-based opener', 'Verify social proof resonance', 'Stronger closing with commitment'],
    71,
    100,
    'Overall, this was a solid discovery call with strong questioning and active listening skills. The rep did an excellent job uncovering pain points and providing relevant social proof. Key areas for improvement: (1) Start with a permission-based opener to show respect for the prospect''s time, (2) Verify that social proof examples resonate with the prospect, and (3) Close more strongly with clear next steps and explicit commitment.'
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    52,
    48,
    0.6,
    0.4,
    'MEDDIC',
    65,
    true,
    false,
    true,
    false,
    ARRAY['Technical requirements discussed', 'Security concerns addressed', 'Integration options reviewed'],
    ARRAY['Technical credibility established', 'Handled objections well'],
    ARRAY['Better opening', 'More probing questions', 'Timeline discussion needed'],
    65,
    100,
    'Good technical discussion with the CTO. You demonstrated strong product knowledge and handled security concerns effectively. To improve: open with permission-based approach, ask more discovery questions before diving into technical details, and ensure you discuss implementation timeline.'
  ),
  (
    '00000000-0000-0000-0000-000000000203',
    40,
    60,
    0.8,
    0.7,
    'SPIN',
    85,
    true,
    true,
    true,
    true,
    ARRAY['Built strong rapport', 'Identified multiple pain points', 'Discussed partnership approach'],
    ARRAY['Excellent rapport building', 'Great open-ended questions', 'Strong value proposition', 'Perfect closing'],
    ARRAY['Could dig deeper on implications'],
    85,
    100,
    'Excellent call! You built strong rapport, asked insightful questions, and closed with clear next steps. Your friendly approach matched the prospect''s personality perfectly. Only minor improvement needed: dig deeper into the business implications of their current challenges.'
  )
ON CONFLICT (session_id) DO NOTHING;

-- Insert detailed scores for the first session (the one we already added scores for)
INSERT INTO call_scores (session_id, criteria_id, score, passed, feedback)
SELECT 
  '00000000-0000-0000-0000-000000000201',
  id,
  CASE name
    WHEN 'Permission based opener' THEN 0
    WHEN 'Used research on prospect' THEN 8
    WHEN 'Provided social proof' THEN 10
    WHEN 'Asked if social proof was relevant' THEN 6
    WHEN 'SDR asked for preconception' THEN 8
    WHEN 'Active listening' THEN 9
    WHEN 'Asked open-ended questions' THEN 10
    WHEN 'Handled objections well' THEN 7
    WHEN 'Clear value proposition' THEN 8
    WHEN 'Strong closing' THEN 5
  END,
  CASE name
    WHEN 'Permission based opener' THEN false
    WHEN 'Used research on prospect' THEN true
    WHEN 'Provided social proof' THEN true
    WHEN 'Asked if social proof was relevant' THEN false
    WHEN 'SDR asked for preconception' THEN true
    WHEN 'Active listening' THEN true
    WHEN 'Asked open-ended questions' THEN true
    WHEN 'Handled objections well' THEN true
    WHEN 'Clear value proposition' THEN true
    WHEN 'Strong closing' THEN false
  END,
  CASE name
    WHEN 'Permission based opener' THEN 'After reviewing the transcript, the sales rep did not use a permission-based opener. A permission-based opener would involve asking the prospect for permission to take a moment of their time or explaining why they''re calling before launching into their pitch. The rep immediately jumped into their pitch without first acknowledging the prospect''s time and asking for permission to briefly explain why they''re calling. Example: "Hi, this is [Name]. I know you''re probably busy. Would you mind if I took just 30 seconds to explain why I''m calling today?"'
    WHEN 'Used research on prospect' THEN 'The sales rep demonstrated knowledge about the prospect by mentioning specific details about their company and industry. This shows preparation and makes the conversation more relevant and engaging.'
    WHEN 'Provided social proof' THEN 'Excellent use of social proof! The rep referenced relevant case studies and mentioned similar clients in the prospect''s industry, which helps build credibility and shows proven results.'
    WHEN 'Asked if social proof was relevant' THEN 'While the rep provided social proof, they didn''t explicitly check if it resonated with the prospect. After sharing a case study, ask "Does that scenario sound familiar?" or "Is that similar to what you''re experiencing?"'
    WHEN 'SDR asked for preconception' THEN 'Good job asking what the prospect already knows about your product. This helps understand their starting point and allows you to address any misconceptions or build on positive awareness.'
    WHEN 'Active listening' THEN 'Strong active listening demonstrated throughout the call. The rep acknowledged prospect concerns, paraphrased their responses, and built on what the prospect shared.'
    WHEN 'Asked open-ended questions' THEN 'Excellent use of open-ended questions like "What challenges are you facing?" and "How does that impact your team?" These questions encouraged detailed responses and uncovered valuable information.'
    WHEN 'Handled objections well' THEN 'The rep handled objections with empathy and provided relevant information. Could improve by acknowledging the objection more explicitly before addressing it.'
    WHEN 'Clear value proposition' THEN 'The value proposition was clear and tailored to the prospect''s specific needs mentioned during discovery. Good job connecting features to pain points.'
    WHEN 'Strong closing' THEN 'The closing could be stronger. While next steps were mentioned, there was no explicit commitment or clear summary. Better closing: summarize pain points, confirm the solution addresses needs, state specific next steps with dates, and ask for commitment.'
  END
FROM scoring_criteria
ON CONFLICT (session_id, criteria_id) DO NOTHING;
