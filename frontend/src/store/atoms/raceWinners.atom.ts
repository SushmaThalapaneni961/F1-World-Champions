import { atom } from 'jotai';
import { APIError } from '../../lib/api/errorHandler';
import { getRacesBySeason } from '../api/raceWinnersApi';
import type { IRaceWinner } from '../types/raceWinners.types';

export const seasonRaceWinnersAtom = atom<IRaceWinner[]>([]);
export const loadingAtom = atom(false);
export const errorAtom = atom<string | null>(null);

export const fetchSeasonRaceWinnersAtom = atom(null, async (_get, set, season: string) => {
  set(loadingAtom, true);
  set(errorAtom, null);

  try {
    const races = await getRacesBySeason(season);
    console.log(races, 'response');
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
