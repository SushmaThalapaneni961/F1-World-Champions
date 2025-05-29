import express from 'express';
import { getAllRaces } from '../controllers/raceController';
import { getAllSeasons } from '../controllers/seasonController';

const router = express.Router();

router.get('/', getAllSeasons);
router.get('/:seasonId/races', getAllRaces);

export default router;
