import { StateCreator } from "zustand";
import { GameStore } from "../types";
import {
  initiatePlayerAction,
  cancelPlayerActionInECS,
} from "@/logic/actions.miniplex";

export interface UiSlice {
  isZoneViewerOpen: GameStore["isZoneViewerOpen"];
  viewingLrigDeckForGrow: GameStore["viewingLrigDeckForGrow"];
  initiatePlaceSigni: (cardUuid: string) => void;
  cancelPlayerAction: () => void;
  openZoneViewer: GameStore["openZoneViewer"];
  closeZoneViewer: GameStore["closeZoneViewer"];
  openLrigDeckViewerForAssist: GameStore["openLrigDeckViewerForAssist"];
  mustDiscard: GameStore["mustDiscard"];
  setMustDiscard: GameStore["setMustDiscard"];
}

export const createUiSlice: StateCreator<GameStore, [], [], UiSlice> = (
  set
) => ({
  isZoneViewerOpen: false,
  viewingLrigDeckForGrow: null,
  mustDiscard: false,

  initiatePlaceSigni: (cardUuid) => {
    initiatePlayerAction({ type: "place_signi", cardUuid });
  },
  cancelPlayerAction: () => {
    cancelPlayerActionInECS();
  },

  openZoneViewer: () => set((state) => ({ ...state, isZoneViewerOpen: true })),
  closeZoneViewer: () =>
    set((state) => ({
      ...state,
      isZoneViewerOpen: false,
      viewingLrigDeckForGrow: null,
    })),

  openLrigDeckViewerForAssist: (zoneIndex) => {
    set((state) => ({
      ...state,
      isZoneViewerOpen: true,
      viewingLrigDeckForGrow: { forAssistIndex: zoneIndex },
    }));
  },
  setMustDiscard: (mustDiscard) => set((state) => ({ ...state, mustDiscard })),
});
