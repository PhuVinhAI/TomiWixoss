import { World } from "miniplex";
import { Entity } from "./types.miniplex";

export const world = new World<Entity>();

export const globalEntity: Entity = {
  uuid: "global",
  isGlobal: true,
  globalState: {
    phase: "pre_game",
    turn: 0,
    actionTakenInPhase: false,
    mulliganSelection: [],
    playerAction: null,
  },
  sideEffectQueue: {
    queue: [],
  },
};

world.add(globalEntity);
