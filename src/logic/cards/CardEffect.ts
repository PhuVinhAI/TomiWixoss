import { Entity } from "@/logic/ecs/types.miniplex";
import { world, globalEntity } from "@/logic/ecs/world.miniplex";
import { Zone } from "@/logic/constants";
import { getTopCardsOfDeck, reindexDeck } from "@/logic/ecs/utils.miniplex";
import { CardInstance } from "@/types/game";
import eventBus from "@/logic/messaging/event.bus";

export interface EffectContext {
  readonly entityUuid: string;
  readonly cardId: string;
  readonly zone: string;
  readonly zoneIndex: number;
  readonly entity: Entity;
}

export class EffectHelper {
  static enerCharge(amount: number): void {
    const { sideEffectQueue } = globalEntity;
    const cardsToCharge = getTopCardsOfDeck(amount);

    cardsToCharge.forEach((entity) => {
      entity.zone!.zone = Zone.ENER_ZONE;
      entity.status!.isFaceUp = true;
    });
    reindexDeck();

    sideEffectQueue?.queue.push({
      type: "LOG",
      key: "logs.enerCharged",
      payload: { count: cardsToCharge.length },
      logType: "action",
    });
  }

  static drawCards(amount: number): void {
    const { sideEffectQueue } = globalEntity;
    const cardsToDraw = getTopCardsOfDeck(amount);

    cardsToDraw.forEach((entity) => {
      if (entity.zone && entity.status) {
        entity.zone.zone = Zone.HAND;
        entity.status.isFaceUp = true;
        entity.zone.index = 0;
      }
    });
    reindexDeck();

    sideEffectQueue?.queue.push({
      type: "LOG",
      key: "logs.drawPhase.drawCards",
      payload: { count: cardsToDraw.length },
      logType: "action",
    });
  }

  static log(key: string, payload?: Record<string, string | number>): void {
    globalEntity.sideEffectQueue?.queue.push({
      type: "LOG",
      key,
      ...(payload && { payload }),
      logType: "action",
    });
  }

  static findEntitiesInZone(zoneName: string): Entity[] {
    return Array.from(
      world.with("zone", "cardInfo", "status").where((e) => e.zone.zone === zoneName)
    );
  }

  static getEnerZoneCards(): CardInstance[] {
    return EffectHelper.findEntitiesInZone(Zone.ENER_ZONE).map((e) => ({
      ...e.cardInfo!.data,
      ...e.status!,
      uuid: e.uuid,
      owner: e.zone!.owner,
    }));
  }

  static countClassesInEner(): number {
    const enerCards = EffectHelper.findEntitiesInZone(Zone.ENER_ZONE);
    const classes = new Set<string>();
    for (const e of enerCards) {
      if (e.cardInfo?.data.class) {
        classes.add(e.cardInfo.data.class);
      }
    }
    return classes.size;
  }
}

export abstract class CardEffect {
  abstract readonly cardId: string;

  onEnter?(context: EffectContext): void;
  onAttack?(context: EffectContext): void;
  onVanish?(context: EffectContext): void;
  onActivate?(context: EffectContext, abilityIndex: number): void;
  getConstantPowerBonus?(context: EffectContext): number;
  canGuard?(): boolean;
}
