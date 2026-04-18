import { CardEffect, EffectContext, EffectHelper } from "../CardEffect";

export class HarmonicCall extends CardEffect {
  readonly cardId = "WXDi-D01-011";

  onActivate(context: EffectContext, abilityIndex: number): void {
    // Complex PIECE effect: look top 8, place SIGNIs, grant keywords
    // Requires targeting + field check + keyword system (TODO)
    EffectHelper.log("logs.ability.harmonicCall.activate");
  }
}
