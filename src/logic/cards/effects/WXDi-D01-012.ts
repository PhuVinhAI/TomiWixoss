import { CardEffect, EffectContext, EffectHelper } from "../CardEffect";

export class Camelopar extends CardEffect {
  readonly cardId = "WXDi-D01-012";

  getConstantPowerBonus(context: EffectContext): number {
    const classCount = EffectHelper.countClassesInEner();
    return classCount >= 3 ? 4000 : 0;
  }
}
