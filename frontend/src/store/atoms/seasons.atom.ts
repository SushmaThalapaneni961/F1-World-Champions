import { atom } from 'jotai';
import { APIError } from '../../lib/api/errorHandler';
import { getSeasons } from '../api/seasonsApi';
import type { ISeason } from '../types/season.types';

export const seasonsAtom = atom<ISeason[]>([]);
export const loadingAtom = atom(false);
export const errorAtom = atom<string | null>(null);

export const fetchSeasonsAtom = atom(null, async (_get, set) => {
  set(loadingAtom, true);
  set(errorAtom, null);

  try {
    const seasons = await getSeasons();
    set(seasonsAtom, seasons);
  } catch (error) {
    if (error instanceof APIError) {
      set(errorAtom, error.message || 'Failed to fetch seasons');
    } else {
      set(errorAtom, 'Unexpected error occurred');
    }
  } finally {
    set(loadingAtom, false);
  }
});
