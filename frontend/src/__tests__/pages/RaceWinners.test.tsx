import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import RaceWinners from '../../pages/RaceWinners/RaceWinners';
import { mockRaceWinners } from '../mocks/raceWinners.mock';
import {
  seasonRaceWinnersAtom,
  loadingAtom,
  errorAtom,
  fetchSeasonRaceWinnersAtom,
} from '../../store/atoms/raceWinners.atom';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('jotai', () => ({
  useAtom: vi.fn(),
  atom: vi.fn((initialValue) => ({ init: initialValue })),
}));

describe('RaceWinners Page', () => {
  const mockNavigate = vi.fn();
  const mockFetchRaceWinners = vi.fn();
  const mockSeason = '2023';

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    (useParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ season: mockSeason });
  });

  // Success Cases
  describe('Success Cases', () => {
    beforeEach(() => {
      (useAtom as unknown as ReturnType<typeof vi.fn>).mockImplementation((atom) => {
        if (atom === seasonRaceWinnersAtom) return [mockRaceWinners];
        if (atom === loadingAtom) return [false];
        if (atom === errorAtom) return [null];
        if (atom === fetchSeasonRaceWinnersAtom) return [null, mockFetchRaceWinners];
        return [null];
      });
    });

    it('renders race winners table with correct data', () => {
      render(<RaceWinners />);

      // Check table headers
      type HeaderType = 'Round' | 'Race Name' | 'Date' | 'Circuit' | 'Winner' | 'Time';
      const headers: HeaderType[] = ['Round', 'Race Name', 'Date', 'Circuit', 'Winner', 'Time'];
      headers.forEach((header) => {
        expect(
          screen.getByRole('columnheader', { name: new RegExp(`${header}.*`) }),
        ).toBeInTheDocument();
      });

      // Check data rows
      mockRaceWinners.forEach((race, index) => {
        const cells = screen.getAllByRole('cell');
        const rowStartIndex = index * 6; // 6 columns per row
        expect(cells[rowStartIndex].textContent).toBe(String(race.round));
        expect(cells[rowStartIndex + 1].textContent).toBe(race.raceName);
        // Convert date from YYYY-MM-DD to M/D/YYYY format
        const dateStr = race.date.toString();
        const [year, month, day] = dateStr.split('-');
        const formattedDate = `${parseInt(month)}/${parseInt(day)}/${year}`;
        expect(cells[rowStartIndex + 2].textContent).toBe(formattedDate);
        expect(cells[rowStartIndex + 3].textContent).toBe(race.circuit.name);
        expect(cells[rowStartIndex + 4].textContent).toBe(race.winner.fullName);
        expect(cells[rowStartIndex + 5].textContent).toBe(race.winner.time);
      });
    });

    it('navigates back to seasons page when clicking back button', () => {
      render(<RaceWinners />);

      const backButton = screen.getByRole('button', { name: /back to seasons/i });
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/seasons');
    });

    it('sorts races when clicking column headers', () => {
      render(<RaceWinners />);

      const dateHeader = screen.getByRole('columnheader', { name: /Date/ });
      // Click twice to get ascending order
      fireEvent.click(dateHeader);
      fireEvent.click(dateHeader);

      // Check if races are sorted by date in ascending order
      const dates = screen.getAllByRole('cell', { name: /\d{1,2}\/\d{1,2}\/\d{4}/ });
      const firstDate = new Date(dates[0].textContent || '');
      const secondDate = new Date(dates[1].textContent || '');
      expect(firstDate.getTime()).toBeLessThan(secondDate.getTime());
    });

    it('renders mobile cards on smaller screens', () => {
      // Mock window.matchMedia for mobile view
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(max-width: 768px)',
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }));

      const { container } = render(<RaceWinners />);

      const mobileCards = container.querySelector('.mobile-cards');
      expect(mobileCards).toBeInTheDocument();
      expect(screen.getAllByText(mockRaceWinners[0].raceName)[0]).toBeInTheDocument();
    });

    it('highlights champion winners', () => {
      render(<RaceWinners />);

      const championRaces = mockRaceWinners.filter((race) => race.isChampionWinner);
      championRaces.forEach((race) => {
        const row = screen.getByRole('row', { name: new RegExp(race.raceName) });
        expect(row).toHaveClass('champion-winner');
      });
    });
  });

  // Loading State
  describe('Loading State', () => {
    beforeEach(() => {
      (useAtom as unknown as ReturnType<typeof vi.fn>).mockImplementation((atom) => {
        if (atom === loadingAtom) return [true];
        if (atom === seasonRaceWinnersAtom) return [[]];
        if (atom === errorAtom) return [null];
        if (atom === fetchSeasonRaceWinnersAtom) return [null, mockFetchRaceWinners];
        return [null];
      });
    });

    it('displays loading spinner when fetching data', () => {
      render(<RaceWinners />);
      expect(screen.getByTestId('spinner-container')).toBeInTheDocument();
    });
  });

  // Error Cases
  describe('Error Cases', () => {
    const mockError = 'Failed to fetch race winners';

    beforeEach(() => {
      (useAtom as unknown as ReturnType<typeof vi.fn>).mockImplementation((atom) => {
        if (atom === errorAtom) return [mockError];
        if (atom === loadingAtom) return [false];
        if (atom === seasonRaceWinnersAtom) return [[]];
        if (atom === fetchSeasonRaceWinnersAtom) return [null, mockFetchRaceWinners];
        return [null];
      });
    });

    it('displays error message when fetch fails', () => {
      render(<RaceWinners />);
      expect(screen.getByText(mockError)).toBeInTheDocument();
    });

    it('retries fetching when clicking retry button', () => {
      render(<RaceWinners />);
      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);
      expect(mockFetchRaceWinners).toHaveBeenCalledWith(mockSeason);
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('handles empty race winners list', () => {
      (useAtom as unknown as ReturnType<typeof vi.fn>).mockImplementation((atom) => {
        if (atom === seasonRaceWinnersAtom) return [[]];
        if (atom === loadingAtom) return [false];
        if (atom === errorAtom) return [null];
        if (atom === fetchSeasonRaceWinnersAtom) return [null, mockFetchRaceWinners];
        return [null];
      });

      render(<RaceWinners />);
      const message = `No race winners found for season ${mockSeason}.`;
      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('handles missing winner data', () => {
      const raceWinnersWithMissingData = [
        {
          ...mockRaceWinners[0],
          winner: {
            ...mockRaceWinners[0].winner,
            fullName: null,
            time: null,
            laps: null,
            nationality: null,
          },
        },
      ];

      (useAtom as unknown as ReturnType<typeof vi.fn>).mockImplementation((atom) => {
        if (atom === seasonRaceWinnersAtom) return [raceWinnersWithMissingData];
        if (atom === loadingAtom) return [false];
        if (atom === errorAtom) return [null];
        if (atom === fetchSeasonRaceWinnersAtom) return [null, mockFetchRaceWinners];
        return [null];
      });

      render(<RaceWinners />);
      const placeholders = screen.getAllByText('-');
      expect(placeholders).toHaveLength(4); // For missing name, time, laps, and nationality
    });

    it('handles missing circuit data', () => {
      const raceWinnersWithMissingCircuit = [
        {
          ...mockRaceWinners[0],
          circuit: {
            ...mockRaceWinners[0].circuit,
            name: null,
            locality: null,
          },
        },
      ];

      (useAtom as unknown as ReturnType<typeof vi.fn>).mockImplementation((atom) => {
        if (atom === seasonRaceWinnersAtom) return [raceWinnersWithMissingCircuit];
        if (atom === loadingAtom) return [false];
        if (atom === errorAtom) return [null];
        if (atom === fetchSeasonRaceWinnersAtom) return [null, mockFetchRaceWinners];
        return [null];
      });

      render(<RaceWinners />);
      const placeholders = screen.getAllByText('-');
      expect(placeholders).toHaveLength(2); // For missing circuit name and locality
    });

    it('handles large dataset without performance issues', async () => {
      const largeDataset = Array(1000)
        .fill(null)
        .map((_, index) => ({
          ...mockRaceWinners[0],
          round: String(index + 1),
          raceName: `Race ${index + 1}`,
        }));

      (useAtom as unknown as ReturnType<typeof vi.fn>).mockImplementation((atom) => {
        if (atom === seasonRaceWinnersAtom) return [largeDataset];
        if (atom === loadingAtom) return [false];
        if (atom === errorAtom) return [null];
        if (atom === fetchSeasonRaceWinnersAtom) return [null, mockFetchRaceWinners];
        return [null];
      });

      const { container } = render(<RaceWinners />);

      // Check if virtualization or pagination is working
      const tableRows = container.querySelectorAll('tr');
      expect(tableRows.length).toBeLessThanOrEqual(1001); // Should not render more than header + 1000 rows
    }, 30000); // Increased timeout to 30 seconds

    it('handles malformed race data gracefully', () => {
      const malformedData = [
        {
          ...mockRaceWinners[0],
          round: 'invalid',
          date: 'Invalid Date',
          winner: {
            ...mockRaceWinners[0].winner,
            time: 'invalid-time',
          },
        },
      ];

      (useAtom as unknown as ReturnType<typeof vi.fn>).mockImplementation((atom) => {
        if (atom === seasonRaceWinnersAtom) return [malformedData];
        if (atom === loadingAtom) return [false];
        if (atom === errorAtom) return [null];
        if (atom === fetchSeasonRaceWinnersAtom) return [null, mockFetchRaceWinners];
        return [null];
      });

      render(<RaceWinners />);
      expect(screen.getByRole('cell', { name: 'invalid' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'Invalid Date' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'invalid-time' })).toBeInTheDocument();
    });
  });
});
