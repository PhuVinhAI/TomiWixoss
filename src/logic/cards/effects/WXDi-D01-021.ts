import { CardEffect, EffectContext, EffectHelper } from "../CardEffect";

export class Polygenesis extends CardEffect {
  readonly cardId = "WXDi-D01-021";

  onActivate(context: EffectContext, abilityIndex: number): void {
    if (abilityIndex === 0) {
      // Add target green SIGNI from Ener to hand
      // If 3 Ancient Surprise LRIGs, add any SIGNI instead (requires targeting - TODO)
      EffectHelper.log("logs.ability.polygenesis.activate0");
    }
    if (abilityIndex === 1) {
      // Vanish target upped opponent SIGNI (requires targeting - TODO)
      EffectHelper.log("logs.ability.polygenesis.activate1");
    }
  }
}
