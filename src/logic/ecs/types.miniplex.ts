import { CardData, ZoneKey } from "@/types/game";
import { GamePhase } from "@/logic/constants";
import { LogType } from "@/store/types";

export type CardInfo = { data: CardData };

export type Status = { isFaceUp: boolean; isDowned: boolean };

export type Zone = { owner: "player" | "ai"; zone: ZoneKey; index: number };

export type Underneath = { entities: Entity[] };

export type SideEffect =
  | {
      type: "LOG";
      key: string;
      payload?: Record<string, string | number>;
      logType: LogType;
    }
  | {
      type: "UPDATE_UI_FLAG";
      flag: "mustDiscard" | "isZoneViewerOpen";
      value: boolean;
    };

export type PlayerActionPayload = { type: "place_signi"; cardUuid: string };

export type GlobalState = {
  phase: GamePhase;
  turn: number;
  actionTakenInPhase: boolean;
  mulliganSelection: string[];
  playerAction: PlayerActionPayload | null;
};

export type SideEffectQueue = {
  queue: SideEffect[];
};

export type Entity = {
  uuid: string;
  cardInfo?: CardInfo;
  status?: Status;
  zone?: Zone;
  underneath?: Underneath;
  isGlobal?: true;
  globalState?: GlobalState;
  sideEffectQueue?: SideEffectQueue;
};
