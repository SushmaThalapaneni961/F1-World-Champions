export interface Champion {
  driverId?: string;
  givenName: string;
  familyName: string;
  fullName: string;
  nationality: string;
  laps?: string;
  time?: string;
}

export interface ISeason {
  season: string;
  champion?: Champion | null;
}