import { CardEffect, EffectContext, EffectHelper } from "../CardEffect";

export class Assylen extends CardEffect {
  readonly cardId = "WXDi-D01-016";

  onAttack(context: EffectContext): void {
    const basePower = context.entity.cardInfo?.data.power ?? 0;
    const bonus = this.getConstantPowerBonus?.(context) ?? 0;
    const totalPower = basePower + bonus;

    if (totalPower >= 20000) {
      // Opponent discards a card at random (TODO)
      EffectHelper.log("logs.ability.assylen.randomDiscard");
    } else if (totalPower >= 15000) {
      // Opponent discards a card (TODO)
      EffectHelper.log("logs.ability.assylen.discard");
    }
  }

  onActivate(context: EffectContext, abilityIndex: number): void {
    if (abilityIndex === 1) {
      // Down + freeze target opponent SIGNI, draw a card (requires targeting - TODO)
      EffectHelper.drawCards(1);
      EffectHelper.log("logs.ability.assylen.activate");
    }
  }
}
