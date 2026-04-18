import { CardEffect, EffectContext, EffectHelper } from "../CardEffect";

export class Tobiel extends CardEffect {
  readonly cardId = "WXDi-D01-015";

  onAttack(context: EffectContext): void {
    // Another target SIGNI +5000 power (requires targeting - TODO)
    EffectHelper.log("logs.ability.tobiel.autoAttack");
  }

  onEnter(context: EffectContext): void {
    // Discard 2: Draw 2 (requires discard choice - TODO)
    EffectHelper.log("logs.ability.tobiel.enter");
  }

  onActivate(context: EffectContext, abilityIndex: number): void {
    if (abilityIndex === 2) {
      // Choose: 1. Vanish upped opponent SIGNI, or 2. Draw a card
      // Requires choice + targeting (TODO)
      EffectHelper.log("logs.ability.tobiel.activate");
    }
  }
}
