import { Response } from 'express';
import { query } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

export const createCallSession = async (req: AuthRequest, res: Response) => {
  try {
    const { bot_id, is_multi_party = false } = req.body;
    const user_id = req.user?.userId;

    const result = await query(
      `INSERT INTO call_sessions (user_id, bot_id, is_multi_party, status)
       VALUES ($1, $2, $3, 'in_progress')
       RETURNING *`,
      [user_id, bot_id, is_multi_party]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create call session error:', error);
    res.status(500).json({ error: 'Failed to create call session' });
  }
};

export const getCallSessions = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.userId;
    const role = req.user?.role;

    let queryText = `
      SELECT cs.*, b.name as bot_name, b.title as bot_title,
             b.company as bot_company, u.full_name as user_name
      FROM call_sessions cs
      JOIN bots b ON cs.bot_id = b.id
      JOIN users u ON cs.user_id = u.id
    `;

    const params: any[] = [];

    if (role === 'sales_rep') {
      queryText += ' WHERE cs.user_id = $1';
      params.push(user_id);
    }

    queryText += ' ORDER BY cs.started_at DESC';

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get call sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch call sessions' });
  }
};

export const getCallSessionById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.userId;
    const role = req.user?.role;

    let queryText = `
      SELECT cs.*, b.name as bot_name, b.title as bot_title,
             b.company as bot_company, u.full_name as user_name
      FROM call_sessions cs
      JOIN bots b ON cs.bot_id = b.id
      JOIN users u ON cs.user_id = u.id
      WHERE cs.id = $1
    `;

    const params: any[] = [id];

    if (role === 'sales_rep') {
      queryText += ' AND cs.user_id = $2';
      params.push(user_id);
    }

    const result = await query(queryText, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Call session not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get call session error:', error);
    res.status(500).json({ error: 'Failed to fetch call session' });
  }
};

export const endCallSession = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.userId;

    const sessionResult = await query(
      'SELECT * FROM call_sessions WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Call session not found' });
    }

    const session = sessionResult.rows[0];
    const startTime = new Date(session.started_at);
    const endTime = new Date();
    const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    const result = await query(
      `UPDATE call_sessions
       SET ended_at = NOW(), duration_seconds = $1, status = 'completed'
       WHERE id = $2
       RETURNING *`,
      [durationSeconds, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('End call session error:', error);
    res.status(500).json({ error: 'Failed to end call session' });
  }
};

export const addTranscriptEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { session_id, speaker, message, sentiment = 'neutral' } = req.body;
    const user_id = req.user?.userId;

    const sessionResult = await query(
      'SELECT * FROM call_sessions WHERE id = $1 AND user_id = $2',
      [session_id, user_id]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Call session not found' });
    }

    const result = await query(
      `INSERT INTO call_transcripts (session_id, speaker, message, sentiment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [session_id, speaker, message, sentiment]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Add transcript error:', error);
    res.status(500).json({ error: 'Failed to add transcript entry' });
  }
};

export const getTranscript = async (req: AuthRequest, res: Response) => {
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

    const transcriptResult = await query(
      `SELECT * FROM call_transcripts
       WHERE session_id = $1
       ORDER BY timestamp ASC`,
      [session_id]
    );

    res.json(transcriptResult.rows);
  } catch (error) {
    console.error('Get transcript error:', error);
    res.status(500).json({ error: 'Failed to fetch transcript' });
  }
};
