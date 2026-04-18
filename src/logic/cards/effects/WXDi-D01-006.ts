import { CardEffect, EffectContext, EffectHelper } from "../CardEffect";

export class TawilScreech extends CardEffect {
  readonly cardId = "WXDi-D01-006";

  onEnter(context: EffectContext): void {
    // Vanish target opponent SIGNI ≤8000 power (requires targeting - TODO)
    EffectHelper.log("logs.ability.tawilScreech.enter");
    EffectHelper.drawCards(1);
    // Discard a card (requires player choice - TODO)
  }
}
