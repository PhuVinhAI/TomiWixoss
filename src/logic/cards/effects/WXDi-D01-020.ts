import { CardEffect, EffectContext, EffectHelper } from "../CardEffect";

export class Servant extends CardEffect {
  readonly cardId = "WXDi-D01-020";

  canGuard(): boolean {
    return true;
  }

  // Const: [Multi Ener] - handled by payment system

  onActivate(context: EffectContext, abilityIndex: number): void {
    if (abilityIndex === 2) {
      // Add target SIGNI from trash to hand (requires targeting - TODO)
      EffectHelper.log("logs.ability.servant.activate");
    }
  }
}
