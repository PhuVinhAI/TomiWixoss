import { CardEffect, EffectContext, EffectHelper } from "../CardEffect";

export class UmrDraw extends CardEffect {
  readonly cardId = "WXDi-D01-009";

  onEnter(context: EffectContext): void {
    EffectHelper.drawCards(2);
  }
}
