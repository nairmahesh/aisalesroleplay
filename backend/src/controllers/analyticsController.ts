import { Response } from 'express';
import { query } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

export const createAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const {
      session_id,
      user_talk_percentage = 0,
      bot_talk_percentage = 0,
      user_sentiment_score = 0,
      bot_sentiment_score = 0,
      evaluation_framework = 'BANT',
      framework_score = 0,
      budget_identified = false,
      authority_identified = false,
      need_identified = false,
      timeline_identified = false,
      key_points = [],
      strengths = [],
      improvements = [],
      total_score = 0,
      max_score = 100,
      overall_feedback = '',
    } = req.body;

    const user_id = req.user?.userId;

    const sessionResult = await query(
      'SELECT * FROM call_sessions WHERE id = $1 AND user_id = $2',
      [session_id, user_id]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Call session not found' });
    }

    const result = await query(
      `INSERT INTO call_analytics (
        session_id, user_talk_percentage, bot_talk_percentage,
        user_sentiment_score, bot_sentiment_score, evaluation_framework,
        framework_score, budget_identified, authority_identified,
        need_identified, timeline_identified, key_points, strengths,
        improvements, total_score, max_score, overall_feedback
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        session_id, user_talk_percentage, bot_talk_percentage,
        user_sentiment_score, bot_sentiment_score, evaluation_framework,
        framework_score, budget_identified, authority_identified,
        need_identified, timeline_identified, key_points, strengths,
        improvements, total_score, max_score, overall_feedback
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create analytics error:', error);
    res.status(500).json({ error: 'Failed to create analytics' });
  }
};

export const getAnalyticsBySessionId = async (req: AuthRequest, res: Response) => {
  try {
    const { session_id } = req.params;
    const user_id = req.user?.userId;
    const role = req.user?.role;

    let sessionQuery = 'SELECT * FROM call_sessions WHERE id = $1';
    const params: any[] = [session_id];

    if (role === 'sales_rep') {
      sessionQuery += ' AND user_id = $2';
      params.push(user_id);
    }

    const sessionResult = await query(sessionQuery, params);

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Call session not found' });
    }

    const result = await query(
      'SELECT * FROM call_analytics WHERE session_id = $1',
      [session_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Analytics not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

export const getScoringCriteria = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM scoring_criteria ORDER BY order_index ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get scoring criteria error:', error);
    res.status(500).json({ error: 'Failed to fetch scoring criteria' });
  }
};

export const createCallScore = async (req: AuthRequest, res: Response) => {
  try {
    const {
      session_id,
      criteria_id,
      score,
      passed,
      feedback,
      transcript_evidence,
      timestamp,
      improvement_examples = [],
      transcript_references = [],
    } = req.body;

    const user_id = req.user?.userId;

    const sessionResult = await query(
      'SELECT * FROM call_sessions WHERE id = $1 AND user_id = $2',
      [session_id, user_id]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Call session not found' });
    }

    const result = await query(
      `INSERT INTO call_scores (
        session_id, criteria_id, score, passed, feedback,
        transcript_evidence, timestamp, improvement_examples,
        transcript_references
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (session_id, criteria_id)
      DO UPDATE SET
        score = EXCLUDED.score,
        passed = EXCLUDED.passed,
        feedback = EXCLUDED.feedback,
        transcript_evidence = EXCLUDED.transcript_evidence,
        timestamp = EXCLUDED.timestamp,
        improvement_examples = EXCLUDED.improvement_examples,
        transcript_references = EXCLUDED.transcript_references
      RETURNING *`,
      [
        session_id, criteria_id, score, passed, feedback,
        transcript_evidence, timestamp, improvement_examples,
        JSON.stringify(transcript_references)
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create call score error:', error);
    res.status(500).json({ error: 'Failed to create call score' });
  }
};

export const getCallScores = async (req: AuthRequest, res: Response) => {
  try {
    const { session_id } = req.params;
    const user_id = req.user?.userId;
    const role = req.user?.role;

    let sessionQuery = 'SELECT * FROM call_sessions WHERE id = $1';
    const params: any[] = [session_id];

    if (role === 'sales_rep') {
      sessionQuery += ' AND user_id = $2';
      params.push(user_id);
    }

    const sessionResult = await query(sessionQuery, params);

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Call session not found' });
    }

    const result = await query(
      `SELECT cs.*, sc.name as criteria_name, sc.description as criteria_description,
              sc.max_score as criteria_max_score, sc.category
       FROM call_scores cs
       JOIN scoring_criteria sc ON cs.criteria_id = sc.id
       WHERE cs.session_id = $1
       ORDER BY sc.order_index ASC`,
      [session_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get call scores error:', error);
    res.status(500).json({ error: 'Failed to fetch call scores' });
  }
};
