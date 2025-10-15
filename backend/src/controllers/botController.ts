import { Response } from 'express';
import { query } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

export const getAllBots = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT * FROM bots WHERE is_active = true ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get bots error:', error);
    res.status(500).json({ error: 'Failed to fetch bots' });
  }
};

export const getBotById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM bots WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get bot error:', error);
    res.status(500).json({ error: 'Failed to fetch bot' });
  }
};

export const createBot = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      title,
      company,
      industry,
      personality,
      call_type,
      language = 'English (US)',
      avatar_initials,
      avatar_color,
      brief_profile,
      detailed_profile,
      dos = [],
      donts = [],
    } = req.body;

    const result = await query(
      `INSERT INTO bots (
        name, title, company, industry, personality, call_type, language,
        avatar_initials, avatar_color, brief_profile, detailed_profile,
        dos, donts, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        name, title, company, industry, personality, call_type, language,
        avatar_initials, avatar_color, brief_profile, detailed_profile,
        dos, donts, req.user?.userId
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create bot error:', error);
    res.status(500).json({ error: 'Failed to create bot' });
  }
};

export const updateBot = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = [
      'name', 'title', 'company', 'industry', 'personality', 'call_type',
      'language', 'avatar_initials', 'avatar_color', 'brief_profile',
      'detailed_profile', 'dos', 'donts', 'is_active'
    ];

    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => updates[field])];

    const result = await query(
      `UPDATE bots SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update bot error:', error);
    res.status(500).json({ error: 'Failed to update bot' });
  }
};

export const deleteBot = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      'UPDATE bots SET is_active = false WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    res.json({ message: 'Bot deleted successfully' });
  } catch (error) {
    console.error('Delete bot error:', error);
    res.status(500).json({ error: 'Failed to delete bot' });
  }
};
