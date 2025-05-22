import express from 'express';
import { getAllSeasons } from '../controllers/seasonController';

const router = express.Router();

// GET /api/seasons
router.get('/', getAllSeasons);

export default router;
