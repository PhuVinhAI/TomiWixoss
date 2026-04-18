import { cardEffectRegistry } from "./CardEffectRegistry";
import { AtNoll } from "./effects/WXDi-D01-001";
import { AtEtt } from "./effects/WXDi-D01-002";
import { AtTva } from "./effects/WXDi-D01-003";
import { AtTre } from "./effects/WXDi-D01-004";
import { TawilNoll } from "./effects/WXDi-D01-005";
import { TawilScreech } from "./effects/WXDi-D01-006";
import { TawilRainbow } from "./effects/WXDi-D01-007";
import { UmrNoll } from "./effects/WXDi-D01-008";
import { UmrDraw } from "./effects/WXDi-D01-009";
import { UmrDown } from "./effects/WXDi-D01-010";
import { HarmonicCall } from "./effects/WXDi-D01-011";
import { Camelopar } from "./effects/WXDi-D01-012";
import { SenNoRikyu } from "./effects/WXDi-D01-013";
import { ZweiSlowLoris } from "./effects/WXDi-D01-014";
import { Tobiel } from "./effects/WXDi-D01-015";
import { Assylen } from "./effects/WXDi-D01-016";
import { Atalanta } from "./effects/WXDi-D01-017";
import { WaterBuffalo } from "./effects/WXDi-D01-018";
import { Koalala } from "./effects/WXDi-D01-019";
import { Servant } from "./effects/WXDi-D01-020";
import { Polygenesis } from "./effects/WXDi-D01-021";

export function registerAllCardEffects(): void {
  cardEffectRegistry.register(new AtNoll());
  cardEffectRegistry.register(new AtEtt());
  cardEffectRegistry.register(new AtTva());
  cardEffectRegistry.register(new AtTre());
  cardEffectRegistry.register(new TawilNoll());
  cardEffectRegistry.register(new TawilScreech());
  cardEffectRegistry.register(new TawilRainbow());
  cardEffectRegistry.register(new UmrNoll());
  cardEffectRegistry.register(new UmrDraw());
  cardEffectRegistry.register(new UmrDown());
  cardEffectRegistry.register(new HarmonicCall());
  cardEffectRegistry.register(new Camelopar());
  cardEffectRegistry.register(new SenNoRikyu());
  cardEffectRegistry.register(new ZweiSlowLoris());
  cardEffectRegistry.register(new Tobiel());
  cardEffectRegistry.register(new Assylen());
  cardEffectRegistry.register(new Atalanta());
  cardEffectRegistry.register(new WaterBuffalo());
  cardEffectRegistry.register(new Koalala());
  cardEffectRegistry.register(new Servant());
  cardEffectRegistry.register(new Polygenesis());

  console.log(
    `[CardEffectRegistry] Registered ${21} card effects`
  );
}

export { cardEffectRegistry } from "./CardEffectRegistry";
export { EffectHelper } from "./CardEffect";
export type { CardEffect, EffectContext } from "./CardEffect";
