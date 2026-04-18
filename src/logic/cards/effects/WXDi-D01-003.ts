import { CardEffect, EffectContext, EffectHelper } from "../CardEffect";

export class AtTva extends CardEffect {
  readonly cardId = "WXDi-D01-003";

  onEnter(context: EffectContext): void {
    EffectHelper.enerCharge(2);

    const enerCards = EffectHelper.findEntitiesInZone("enerZone");
    const lastTwo = enerCards.slice(-2);
    const classes = new Set(lastTwo.map((e) => e.cardInfo?.data.class).filter(Boolean));
    if (classes.size === lastTwo.length && lastTwo.length === 2) {
      EffectHelper.enerCharge(1);
    }
  }

  onActivate(context: EffectContext, abilityIndex: number): void {
    if (abilityIndex === 0) {
      EffectHelper.log("logs.ability.atTva.action");
    }
  }
}
