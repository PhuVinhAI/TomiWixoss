import { world } from "../world.miniplex";
import { GameEvent, GameEventPayloads } from "../../messaging/events.types";
import eventBus from "../../messaging/event.bus";
import { cardEffectRegistry } from "../../cards/CardEffectRegistry";
import { EffectContext } from "../../cards/CardEffect";

let isInitialized = false;

export function initializeScriptingSystem() {
  if (isInitialized) return;
  isInitialized = true;

  console.log("Initializing OOP Card Effect System...");
  eventBus.on(GameEvent.CARD_PLAYED, onCardPlayed);
  eventBus.on(GameEvent.CARD_DISCARDED, onCardVanished);
}

function onCardPlayed(
  payload: GameEventPayloads[GameEvent.CARD_PLAYED]
): void {
  const entity = Array.from(world.entities).find((e) => e.uuid === payload.entityUuid);
  if (!entity?.cardInfo) return;

  const context: EffectContext = {
    entityUuid: payload.entityUuid,
    cardId: payload.cardId,
    zone: payload.zone,
    zoneIndex: payload.zoneIndex,
    entity,
  };

  cardEffectRegistry.triggerOnEnter(context);
}

function onCardVanished(
  payload: GameEventPayloads[GameEvent.CARD_DISCARDED]
): void {
  const entity = Array.from(world.entities).find((e) => e.uuid === payload.entityUuid);
  if (!entity?.cardInfo) return;

  const context: EffectContext = {
    entityUuid: payload.entityUuid,
    cardId: payload.cardId,
    zone: "",
    zoneIndex: 0,
    entity,
  };

  cardEffectRegistry.triggerOnVanish(context);
}
