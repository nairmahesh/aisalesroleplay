import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createAnalytics,
  getAnalyticsBySessionId,
  getScoringCriteria,
  createCallScore,
  getCallScores,
} from '../controllers/analyticsController.js';

const router = Router();

router.post('/', authenticate, createAnalytics);
router.get('/session/:session_id', authenticate, getAnalyticsBySessionId);
router.get('/criteria', authenticate, getScoringCriteria);
router.post('/scores', authenticate, createCallScore);
router.get('/scores/:session_id', authenticate, getCallScores);

export default router;
