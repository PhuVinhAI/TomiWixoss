import { CardEffect, EffectContext, EffectHelper } from "../CardEffect";

export class ZweiSlowLoris extends CardEffect {
  readonly cardId = "WXDi-D01-014";

  getConstantPowerBonus(context: EffectContext): number {
    const classCount = EffectHelper.countClassesInEner();
    return classCount >= 3 ? 5000 : 0;
  }

  onActivate(context: EffectContext, abilityIndex: number): void {
    if (abilityIndex === 1) {
      // Grant [Lancer] to target SIGNI with power ≥15000 (requires targeting - TODO)
      EffectHelper.log("logs.ability.zweiSlowLoris.activate");
    }
  }
}
