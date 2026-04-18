import { CardEffect, EffectContext, EffectHelper } from "../CardEffect";

export class SenNoRikyu extends CardEffect {
  readonly cardId = "WXDi-D01-013";

  onEnter(context: EffectContext): void {
    EffectHelper.enerCharge(3);
  }
}
