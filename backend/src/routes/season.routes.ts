import express from 'express';
import { getAllRaces } from '../controllers/raceController';
import { getAllSeasons } from '../controllers/seasonController';

const router = express.Router();

router.get('/', getAllSeasons);
router.get('/:season/races', getAllRaces);

export default router;
