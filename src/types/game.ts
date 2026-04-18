import { GamePhase } from "@/logic/constants";

export const TURN_PHASES: GamePhase[] = [
  "up",
  "draw",
  "ener",
  "grow",
  "main",
  "attack",
  "end",
];

export type CardType = "LRIG" | "ASSIST LRIG" | "SIGNI" | "PIECE" | "SPELL";

export type CardColor =
  | "Green"
  | "Red"
  | "Blue"
  | "White"
  | "Black"
  | "Colorless";

export interface CardCost {
  [color: string]: number;
}

export interface CardAbility {
  type: "Action" | "Auto" | "Enter" | "Const" | "Guard" | "Use Conditions";
  timing?: GamePhase[];
  cost?: CardCost;
  description: string;
  turnLimit?: number;
}

export interface CardData {
  id: string;
  name: string;
  type: CardType;
  level?: number;
  limit?: number | string;
  power?: number;
  colors: CardColor[];
  lrigType?: string;
  team?: string;
  class?: string;
  growCost?: CardCost;
  cost?: CardCost;
  abilities?: CardAbility[];
  hasBurstIcon?: boolean;
  imageUrl: string;
  backType: "MAIN" | "LRIG" | "PIECE";
  isHorizontal?: boolean;
}

export interface CardInstance extends CardData {
  uuid: string;
  isFaceUp: boolean;
  isDowned: boolean;
  owner: "player" | "ai";
  underneathCards?: CardInstance[];
}

export type ZoneKey =
  | "mainDeck"
  | "lrigDeck"
  | "hand"
  | "signiZone"
  | "lrigZone"
  | "lifeCloth"
  | "enerZone"
  | "trash"
  | "lrigTrash"
  | "checkZone"
  | "underneath";
