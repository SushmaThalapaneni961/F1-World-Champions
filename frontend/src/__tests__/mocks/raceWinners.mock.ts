import { IRaceWinner } from '../../store/types/raceWinners.types';

export const mockRaceWinners: IRaceWinner[] = [
  {
    season: '2023',
    round: '1',
    raceName: 'Bahrain Grand Prix',
    date: '2023-03-05',
    circuit: {
      name: 'Bahrain International Circuit',
      country: 'Bahrain',
      locality: 'Sakhir',
    },
    winner: {
      driverId: 'max_verstappen',
      fullName: 'Max Verstappen',
      nationality: 'Dutch',
      time: '1:33:56.736',
      laps: '57',
    },
    isChampionWinner: true,
  },
  {
    season: '2023',
    round: '2',
    raceName: 'Saudi Arabian Grand Prix',
    date: '2023-03-19',
    circuit: {
      name: 'Jeddah Corniche Circuit',
      country: 'Saudi Arabia',
      locality: 'Jeddah',
    },
    winner: {
      driverId: 'perez',
      fullName: 'Sergio Perez',
      nationality: 'Mexican',
      time: '1:21:14.894',
      laps: '50',
    },
    isChampionWinner: false,
  },
  {
    season: '2023',
    round: '3',
    raceName: 'Australian Grand Prix',
    date: '2023-04-02',
    circuit: {
      name: 'Albert Park Circuit',
      country: 'Australia',
      locality: 'Melbourne',
    },
    winner: {
      driverId: 'max_verstappen',
      fullName: 'Max Verstappen',
      nationality: 'Dutch',
      time: '2:32:38.371',
      laps: '58',
    },
    isChampionWinner: true,
  },
];
