import { CardEffect, EffectContext, EffectHelper } from "../CardEffect";

export class Atalanta extends CardEffect {
  readonly cardId = "WXDi-D01-017";

  onEnter(context: EffectContext): void {
    // Cost: Put 3 SIGNIs with different classes from Ener to trash
    // Then vanish target opponent SIGNI ≥8000 (requires targeting + cost - TODO)
    EffectHelper.log("logs.ability.atalanta.enter");
  }
}
