import { atom } from 'jotai';
import { APIError } from '../../lib/api/errorHandler';
import type { IRaceWinner } from '../types/raceWinners.types';
import { getRaceWinners } from '../api/raceWinnersApi';

export const seasonRaceWinnersAtom = atom<IRaceWinner[]>([]);
export const loadingAtom = atom(false);
export const errorAtom = atom<string | null>(null);

export const fetchSeasonRaceWinnersAtom = atom(null, async (_get, set, season: string) => {
  set(loadingAtom, true);
  set(errorAtom, null);

  try {
    const races = await getRaceWinners(season);
    set(seasonRaceWinnersAtom, races);
  } catch (error) {
    if (error instanceof APIError) {
      set(errorAtom, error.message || 'Failed to fetch race winners');
    } else {
      set(errorAtom, 'Unexpected error occurred');
    }
  } finally {
    set(loadingAtom, false);
  }
});
