import useGameStore from "@/store/gameStore";
import { globalEntity } from "./ecs/world.miniplex";
import { upSystem } from "./ecs/systems/up.system.miniplex";
import { autoPhaseSystem } from "./ecs/systems/autoPhase.system.miniplex";
import { drawSystem } from "./ecs/systems/draw.system.miniplex";
import { endPhaseSystem } from "./ecs/systems/endPhase.system.miniplex";

let animationFrameId: number;

const loopSystems = [
  upSystem,
  drawSystem,
  endPhaseSystem,
  autoPhaseSystem,
];

function gameLoop() {
  let worldHasChanged = false;

  for (const system of loopSystems) {
    system();
  }

  const { sideEffectQueue } = globalEntity;
  if (sideEffectQueue && sideEffectQueue.queue.length > 0) {
    worldHasChanged = true;

    const { addLog, setMustDiscard, openZoneViewer, closeZoneViewer } =
      useGameStore.getState();

    sideEffectQueue.queue.forEach((effect) => {
      switch (effect.type) {
        case "LOG": {
          const { type, logType, ...logData } = effect;
          addLog({ ...logData, type: logType });
          break;
        }
        case "UPDATE_UI_FLAG":
          if (effect.flag === "mustDiscard") {
            setMustDiscard(effect.value);
          }
          if (effect.flag === "isZoneViewerOpen") {
            if (effect.value) {
              openZoneViewer();
            } else {
              closeZoneViewer();
            }
          }
          break;
      }
    });

    sideEffectQueue.queue = [];
  }

  if (worldHasChanged) {
    useGameStore.getState().incrementWorldVersion();
  }

  animationFrameId = requestAnimationFrame(gameLoop);
}

export function startGameLoop() {
  console.log("Starting Miniplex Game Loop...");
  cancelAnimationFrame(animationFrameId);
  gameLoop();
}
