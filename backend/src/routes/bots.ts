import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import {
  getAllBots,
  getBotById,
  createBot,
  updateBot,
  deleteBot,
} from '../controllers/botController.js';

const router = Router();

router.get('/', authenticate, getAllBots);
router.get('/:id', authenticate, getBotById);
router.post('/', authenticate, requireRole('manager', 'admin'), createBot);
router.put('/:id', authenticate, requireRole('manager', 'admin'), updateBot);
router.delete('/:id', authenticate, requireRole('manager', 'admin'), deleteBot);

export default router;
