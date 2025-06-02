interface Circuit {
  name: String;
  locality: String;
  country: String;
}

interface Winner {
  driverId: string;
  fullName: string;
  nationality: string;
  laps: string;
  time: string;
}

export interface IRaceWinner {
  season: string;
  round: string;
  raceName: string;
  date: Date | string;
  circuit: Circuit;
  winner: Winner;
  isChampionWinner: boolean;
}
