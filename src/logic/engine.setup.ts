import { registerAllCardEffects } from "./cards";
import { initializeScriptingSystem } from "./ecs/systems/scripting.system";
import { startGameLoop } from "./game.engine.miniplex";

let isInitialized = false;

export async function bootstrapGame() {
  if (isInitialized) return;
  isInitialized = true;

  console.log("--- Bootstrapping Game Engine ---");

  registerAllCardEffects();
  initializeScriptingSystem();
  startGameLoop();

  console.log("--- Game Engine Bootstrapped Successfully ---");
}
