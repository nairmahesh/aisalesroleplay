/*
  # Update Scores with Detailed Feedback

  ## Overview
  Adds comprehensive feedback with transcript evidence and improvement examples
  to match Hyperbound's detailed scoring system.

  ## Changes
  - Updates existing call scores with transcript evidence
  - Adds timestamps for when specific behaviors occurred
  - Includes detailed improvement examples with numbered steps

  ## Notes
  - Provides context-rich feedback for better learning
  - Includes actual transcript snippets to illustrate points
*/

DO $$
DECLARE
  demo_session_id uuid;
BEGIN
  SELECT id INTO demo_session_id FROM call_sessions WHERE id = '00000000-0000-0000-0000-000000000201';
  
  IF demo_session_id IS NOT NULL THEN
    UPDATE call_scores cs
    SET 
      transcript_evidence = CASE sc.name
        WHEN 'Permission based opener' THEN 'Rep: "Hi Marcus, thanks for taking my call. I wanted to talk about our sales enablement platform."

The rep launched directly into the pitch without asking for permission or acknowledging the prospect''s time.'
        WHEN 'Provided social proof' THEN 'Rep: "We''ve helped companies like Salesforce and HubSpot reduce their onboarding time by 50%."

Strong example of relevant social proof with quantified results from recognizable companies in the same industry.'
        WHEN 'Asked if social proof was relevant' THEN 'Rep: "We''ve helped companies like Salesforce and HubSpot reduce their onboarding time by 50%."
Prospect: "That''s interesting."

After sharing the example, the rep moved on without checking if this resonated with the prospect or if they faced similar challenges.'
        WHEN 'Active listening' THEN 'Prospect: "We''re struggling with rep ramp time and inconsistent performance across the team."
Rep: "I hear you - ramp time is critical for hitting targets. Can you tell me more about what you''re seeing with performance consistency? What''s the gap between your top and bottom performers?"

Excellent paraphrasing and follow-up questions that build on what the prospect shared.'
        WHEN 'Strong closing' THEN 'Rep: "So I''ll send you some information to review."
Prospect: "Okay, sounds good."
Rep: "Great, talk to you soon."

Weak closing - no specific next steps with dates/times, no summary of key points, and no explicit commitment obtained from the prospect.'
      END,
      timestamp = CASE sc.name
        WHEN 'Permission based opener' THEN '0:03'
        WHEN 'Provided social proof' THEN '2:15'
        WHEN 'Asked if social proof was relevant' THEN '2:22'
        WHEN 'Active listening' THEN '3:45'
        WHEN 'Strong closing' THEN '11:20'
      END,
      improvement_examples = CASE sc.name
        WHEN 'Permission based opener' THEN ARRAY[
          '"Hi Marcus, this is [Name] from [Company]. I know I''m calling out of the blue - do you have 30 seconds for me to explain why I''m reaching out?"',
          '"Hi Marcus, I hope I''m not catching you at a bad time. I wanted to reach out because I noticed [specific research]. Would you be open to a quick conversation about it?"',
          '"Hi Marcus, thanks for answering. I know your time is valuable - before I dive in, is now a good time for a brief chat, or would another time work better?"'
        ]
        WHEN 'Asked if social proof was relevant' THEN ARRAY[
          'After sharing the example: "Does that scenario sound familiar to what you''re experiencing with your team?"',
          'Check relevance: "Is reducing onboarding time by that magnitude something that would move the needle for your organization?"',
          'Invite comparison: "How does that 50% improvement compare to what you''re seeing with your current process?"',
          'Ask: "Would achieving similar results make a meaningful difference for your team''s performance?"'
        ]
        WHEN 'Strong closing' THEN ARRAY[
          'Summarize the key pain points: "So to recap, you mentioned struggling with rep ramp time, performance consistency, and hitting your Q1 targets. Is that right?"',
          'Confirm solution fit: "Based on what you''ve shared, our platform could help address these challenges by accelerating ramp time and standardizing your sales process. Does that align with what you''re looking for?"',
          'Propose specific next steps: "I''d like to set up a 30-minute demo where I can show you exactly how we''ve helped similar companies solve these issues. How does next Tuesday at 2pm look on your calendar?"',
          'Get explicit commitment: "Does that work for you? I''ll send a calendar invite right now with the meeting link."',
          'Identify blockers: "Before we hang up, is there anything that might prevent us from having that demo next Tuesday?"'
        ]
      END
    FROM scoring_criteria sc
    WHERE cs.session_id = demo_session_id
      AND cs.criteria_id = sc.id
      AND sc.name IN ('Permission based opener', 'Provided social proof', 'Asked if social proof was relevant', 'Active listening', 'Strong closing');
  END IF;
END $$;
