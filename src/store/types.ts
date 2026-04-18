export type LogType = "info" | "action" | "system" | "cost";

export interface LogEntry {
  id: string;
  key: string;
  payload?: Record<string, string | number>;
  type: LogType;
  timestamp: number;
}

export interface GameState {
  worldVersion: number;
  logs: LogEntry[];
  isZoneViewerOpen: boolean;
  viewingLrigDeckForGrow: { forAssistIndex: number | null } | null;
  mustDiscard: boolean;
}

export interface GameActions {
  addLog: (logData: Omit<LogEntry, "id" | "timestamp">) => void;
  initializeGame: () => void;
  incrementWorldVersion: () => void;
  openZoneViewer: () => void;
  closeZoneViewer: () => void;
  openLrigDeckViewerForAssist: (zoneIndex: number) => void;
  setMustDiscard: (mustDiscard: boolean) => void;
}

export interface GameStore extends GameState, GameActions {}
