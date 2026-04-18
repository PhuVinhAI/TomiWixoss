import { CardEffect, EffectContext, EffectHelper } from "../CardEffect";
import { world } from "@/logic/ecs/world.miniplex";
import { Zone } from "@/logic/constants";

export class TawilRainbow extends CardEffect {
  readonly cardId = "WXDi-D01-007";

  onEnter(context: EffectContext): void {
    const signiOnField = Array.from(
      world.with("zone", "cardInfo").where((e) => e.zone.zone === Zone.SIGNI_ZONE)
    );

    const colorsOnField = new Set<string>();
    for (const e of signiOnField) {
      for (const color of e.cardInfo.data.colors) {
        colorsOnField.add(color);
      }
    }

    if (colorsOnField.has("Red")) {
      // Vanish target opponent SIGNI ≤10000 (requires targeting - TODO)
      EffectHelper.log("logs.ability.tawilRainbow.vanish");
    }
    if (colorsOnField.has("Blue")) {
      EffectHelper.drawCards(2);
    }
    if (colorsOnField.has("Green")) {
      EffectHelper.enerCharge(2);
    }
  }
}
