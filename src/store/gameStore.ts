import { create } from "zustand";
import { createLogSlice } from "./slices/logSlice";
import { createGameSlice } from "./slices/gameSlice";
import { createUiSlice } from "./slices/uiSlice";
import { GameStore } from "./types";

const useGameStore = create<GameStore>((set, get) => ({
  worldVersion: 0,
  ...createLogSlice(set, get, {} as any),
  ...createGameSlice(set, get, {} as any),
  ...createUiSlice(set, get, {} as any),
}));

export default useGameStore;
