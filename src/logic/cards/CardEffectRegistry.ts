import { CardEffect, EffectContext } from "./CardEffect";

class CardEffectRegistry {
  private effects = new Map<string, CardEffect>();

  register(effect: CardEffect): void {
    this.effects.set(effect.cardId, effect);
  }

  getEffect(cardId: string): CardEffect | undefined {
    return this.effects.get(cardId);
  }

  triggerOnEnter(context: EffectContext): void {
    const effect = this.effects.get(context.cardId);
    if (effect?.onEnter) {
      console.log(
        `%c[EFFECT] ${context.cardId} onEnter triggered`,
        "color: #9B59B6"
      );
      effect.onEnter(context);
    }
  }

  triggerOnAttack(context: EffectContext): void {
    const effect = this.effects.get(context.cardId);
    if (effect?.onAttack) {
      console.log(
        `%c[EFFECT] ${context.cardId} onAttack triggered`,
        "color: #E74C3C"
      );
      effect.onAttack(context);
    }
  }

  triggerOnVanish(context: EffectContext): void {
    const effect = this.effects.get(context.cardId);
    if (effect?.onVanish) {
      console.log(
        `%c[EFFECT] ${context.cardId} onVanish triggered`,
        "color: #3498DB"
      );
      effect.onVanish(context);
    }
  }

  triggerOnActivate(context: EffectContext, abilityIndex: number): void {
    const effect = this.effects.get(context.cardId);
    if (effect?.onActivate) {
      console.log(
        `%c[EFFECT] ${context.cardId} onActivate[${abilityIndex}] triggered`,
        "color: #2ECC71"
      );
      effect.onActivate(context, abilityIndex);
    }
  }

  getConstantPowerBonus(context: EffectContext): number {
    const effect = this.effects.get(context.cardId);
    return effect?.getConstantPowerBonus?.(context) ?? 0;
  }
}

export const cardEffectRegistry = new CardEffectRegistry();
