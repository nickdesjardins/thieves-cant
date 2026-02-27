// Shared type definitions for Thieves' Cant data

export interface DictionaryEntry {
  term: string;
  definition: string;
  category?: string;
}

export interface ArgotEntry {
  term: string;
  definition: string;
  category?: string;
}

export interface HoboSymbol {
  name: string;
  meaning: string;
  nameFr?: string;
  meaningFr?: string;
  symbol: string;
  category: string;
}
