export interface SeasonChampion {
  season: string;
  driverId: string;
  givenName: string;
  familyName: string;
  wins: number;
}

export interface RaceWinner {
  round: string;
  raceName: string;
  date: string;
  winner: {
    driverId: string;
    givenName: string;
    familyName: string;
  };
}
