import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createCallSession,
  getCallSessions,
  getCallSessionById,
  endCallSession,
  addTranscriptEntry,
  getTranscript,
} from '../controllers/callController.js';

const router = Router();

router.post('/', authenticate, createCallSession);
router.get('/', authenticate, getCallSessions);
router.get('/:id', authenticate, getCallSessionById);
router.put('/:id/end', authenticate, endCallSession);
router.post('/transcript', authenticate, addTranscriptEntry);
router.get('/:session_id/transcript', authenticate, getTranscript);

export default router;
