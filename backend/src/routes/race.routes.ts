import express from 'express';
import { getAllRaces } from '../controllers/raceController';

const router = express.Router({ mergeParams: true });

router.get('/', getAllRaces);

export default router;
