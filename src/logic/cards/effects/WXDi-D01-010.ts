import { CardEffect, EffectContext, EffectHelper } from "../CardEffect";

export class UmrDown extends CardEffect {
  readonly cardId = "WXDi-D01-010";

  onEnter(context: EffectContext): void {
    // Down target opponent SIGNI (requires targeting - TODO)
    EffectHelper.log("logs.ability.umrDown.enter");
  }
}
