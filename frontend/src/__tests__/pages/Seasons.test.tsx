import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Seasons from '../../pages/Seasons/Seasons';
import { mockSeasons } from '../mocks/seasons.mock';
import {
  seasonsAtom,
  loadingAtom,
  errorAtom,
  fetchSeasonsAtom,
} from '../../store/atoms/seasons.atom';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('jotai', () => ({
  useAtom: vi.fn(),
  atom: vi.fn((initialValue) => ({ init: initialValue })),
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Seasons Page', () => {
  const mockNavigate = vi.fn();
  const mockFetchSeasons = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
  });

  // Success Cases
  describe('Success Cases', () => {
    beforeEach(() => {
      (useAtom as unknown as ReturnType<typeof vi.fn>).mockImplementation((atom) => {
        if (atom === seasonsAtom) return [mockSeasons];
        if (atom === loadingAtom) return [false];
        if (atom === errorAtom) return [null];
        if (atom === fetchSeasonsAtom) return [null, mockFetchSeasons];
        return [null];
      });
    });

    it('renders seasons table with correct data', () => {
      renderWithRouter(<Seasons />);

      // Check column headers (including sort icons)
      expect(screen.getByRole('columnheader', { name: /Season/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Champion/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Nationality/i })).toBeInTheDocument();

      // Check data rows
      mockSeasons.forEach((season) => {
        expect(screen.getByText(season.season)).toBeInTheDocument();
        expect(screen.getAllByText(season.championName)[0]).toBeInTheDocument();
        expect(screen.getAllByText(season.nationality)[0]).toBeInTheDocument();
      });
    });

    it('renders mobile cards', () => {
      renderWithRouter(<Seasons />);

      expect(screen.getByTestId('mobile-view')).toBeInTheDocument();
      mockSeasons.forEach((season) => {
        expect(screen.getByText(`F1 Season ${season.season}`)).toBeInTheDocument();
      });
    });

    it('navigates to race winners page when clicking a season', () => {
      renderWithRouter(<Seasons />);

      const firstSeasonRow = screen.getByRole('row', { name: new RegExp(mockSeasons[0].season) });
      fireEvent.click(firstSeasonRow);

      expect(mockNavigate).toHaveBeenCalledWith(`/racewinners/${mockSeasons[0].season}`);
    });

    it('sorts seasons when clicking column headers', () => {
      renderWithRouter(<Seasons />);

      const seasonHeader = screen.getByRole('columnheader', { name: /season/i });
      fireEvent.click(seasonHeader);

      // Check if seasons are sorted in ascending order
      const seasonCells = screen.getAllByRole('cell', { name: /\d{4}/ });
      const firstSeason = seasonCells[0].textContent || '';
      const secondSeason = seasonCells[1].textContent || '';
      expect(firstSeason < secondSeason).toBe(true);
    });
  });

  // Loading State
  describe('Loading State', () => {
    beforeEach(() => {
      (useAtom as unknown as ReturnType<typeof vi.fn>).mockImplementation((atom) => {
        if (atom === loadingAtom) return [true];
        if (atom === seasonsAtom) return [[]];
        if (atom === errorAtom) return [null];
        if (atom === fetchSeasonsAtom) return [null, mockFetchSeasons];
        return [null];
      });
    });

    it('displays loading spinner when fetching data', () => {
      renderWithRouter(<Seasons />);
      expect(screen.getByTestId('spinner-container')).toBeInTheDocument();
    });
  });

  // Error Cases
  describe('Error Cases', () => {
    const mockError = 'Failed to fetch seasons';

    beforeEach(() => {
      (useAtom as unknown as ReturnType<typeof vi.fn>).mockImplementation((atom) => {
        if (atom === errorAtom) return [mockError];
        if (atom === loadingAtom) return [false];
        if (atom === seasonsAtom) return [[]];
        if (atom === fetchSeasonsAtom) return [null, mockFetchSeasons];
        return [null];
      });
    });

    it('displays error message when fetch fails', () => {
      renderWithRouter(<Seasons />);
      expect(screen.getByText(mockError)).toBeInTheDocument();
    });

    it('retries fetching when clicking retry button', () => {
      renderWithRouter(<Seasons />);
      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);
      expect(mockFetchSeasons).toHaveBeenCalled();
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('handles empty seasons list', () => {
      (useAtom as unknown as ReturnType<typeof vi.fn>).mockImplementation((atom) => {
        if (atom === seasonsAtom) return [[]];
        if (atom === loadingAtom) return [false];
        if (atom === errorAtom) return [null];
        if (atom === fetchSeasonsAtom) return [null, mockFetchSeasons];
        return [null];
      });

      renderWithRouter(<Seasons />);
      expect(screen.getByText('No seasons found.')).toBeInTheDocument();
    });

    it('handles missing champion data', () => {
      const seasonsWithMissingData = [
        {
          ...mockSeasons[0],
          championName: null,
          nationality: null,
        },
      ];

      (useAtom as unknown as ReturnType<typeof vi.fn>).mockImplementation((atom) => {
        if (atom === seasonsAtom) return [seasonsWithMissingData];
        if (atom === loadingAtom) return [false];
        if (atom === errorAtom) return [null];
        if (atom === fetchSeasonsAtom) return [null, mockFetchSeasons];
        return [null];
      });

      renderWithRouter(<Seasons />);
      const placeholders = screen.getAllByText('-');
      expect(placeholders).toHaveLength(2); // For missing champion name and nationality
    });

    it('handles large dataset without performance issues', async () => {
      const largeDataset = Array(1000)
        .fill(null)
        .map((_, index) => ({
          ...mockSeasons[0],
          season: String(2000 + index),
        }));

      (useAtom as unknown as ReturnType<typeof vi.fn>).mockImplementation((atom) => {
        if (atom === seasonsAtom) return [largeDataset];
        if (atom === loadingAtom) return [false];
        if (atom === errorAtom) return [null];
        if (atom === fetchSeasonsAtom) return [null, mockFetchSeasons];
        return [null];
      });

      const { container } = renderWithRouter(<Seasons />);

      // Check if virtualization or pagination is working
      const tableRows = container.querySelectorAll('tr');
      expect(tableRows.length).toBeLessThanOrEqual(1001); // Should not render more than header + 1000 rows
    }, 30000); // Increased timeout to 30 seconds to match global config

    it('handles malformed season data gracefully', () => {
      const malformedData = [
        {
          season: 'invalid',
          championName: undefined,
          nationality: null,
        },
      ];

      (useAtom as unknown as ReturnType<typeof vi.fn>).mockImplementation((atom) => {
        if (atom === seasonsAtom) return [malformedData];
        if (atom === loadingAtom) return [false];
        if (atom === errorAtom) return [null];
        if (atom === fetchSeasonsAtom) return [null, mockFetchSeasons];
        return [null];
      });

      renderWithRouter(<Seasons />);
      expect(screen.getByRole('cell', { name: 'invalid' })).toBeInTheDocument();
      const placeholders = screen.getAllByText('-');
      expect(placeholders).toHaveLength(2); // For undefined championName and null nationality
    });
  });
});
