import express from 'express';
import { getAllSeasons } from '../controllers/seasonController';

const router = express.Router();

router.get('/', getAllSeasons);

export default router;
