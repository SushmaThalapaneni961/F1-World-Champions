import { Champion } from "./season.types";

export interface Circuit {
    name?: string;
    locality?: string;
    country?: string;
};

export interface IRace {
  season: string;
  round: string;
  raceName: string;
  date: string;
  circuit?: Circuit;
  winner: Champion;
}
