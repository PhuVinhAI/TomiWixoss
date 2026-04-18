import { world, globalEntity } from "./ecs/world.miniplex";
import { Entity, PlayerActionPayload } from "./ecs/types.miniplex";
import { TURN_PHASES } from "@/types/game";
import { checkCost } from "@/logic/payment";
import { CardInstance } from "@/types/game";
import { GameEvent } from "./messaging/events.types";
import eventBus from "./messaging/event.bus";
import { getValidGrowOptions } from "./ecs/selectors.miniplex";
import {
  getTopCardsOfDeck,
  reindexDeck,
  drawInitialHand,
  shuffleMainDeck,
  reindexLrigDeck,
} from "./ecs/utils.miniplex";
import { GamePhase, Zone, CardType } from "@/logic/constants";
import i18n from "@/i18n";
import useGameStore from "@/store/gameStore";

function findEntity(uuid: string): Entity | undefined {
  return Array.from(world.with("uuid")).find((e: Entity) => e.uuid === uuid);
}

export function chargeEnerAction(entityUuid: string) {
  const { globalState, sideEffectQueue } = globalEntity;

  if (globalState?.phase !== GamePhase.ENER || globalState.actionTakenInPhase) {
    sideEffectQueue?.queue.push({
      type: "LOG",
      key: "logs.invalidPhase",
      logType: "info",
    });
    return;
  }

  const entityToCharge = findEntity(entityUuid);

  if (
    !entityToCharge ||
    !entityToCharge.zone ||
    !entityToCharge.status ||
    !entityToCharge.cardInfo
  ) {
    return;
  }

  const sourceKey = entityToCharge.zone.zone === Zone.HAND ? "hand" : "field";
  const sourceText = i18n.t(`logs.enerChargeSource.${sourceKey}`);

  entityToCharge.zone.zone = Zone.ENER_ZONE;
  entityToCharge.status.isFaceUp = true;
  globalState.actionTakenInPhase = true;

  sideEffectQueue?.queue.push({
    type: "LOG",
    key: "logs.enerCharge",
    payload: {
      source: sourceText,
      cardName: entityToCharge.cardInfo.data.name,
    },
    logType: "action",
  });
}

export function discardCardAction(entityUuid: string) {
  const { sideEffectQueue } = globalEntity;

  const entityToDiscard = findEntity(entityUuid);

  if (
    !entityToDiscard ||
    !entityToDiscard.zone ||
    !entityToDiscard.status ||
    !entityToDiscard.cardInfo
  ) {
    return;
  }

  const trashEntities = world
    .with("zone")
    .where((e: Entity) => e.zone?.zone === Zone.TRASH);
  const currentTrashSize = Array.from(trashEntities).length;

  entityToDiscard.zone.zone = Zone.TRASH;
  entityToDiscard.zone.index = currentTrashSize;

  sideEffectQueue?.queue.push({
    type: "LOG",
    key: "logs.discard",
    payload: { cardName: entityToDiscard.cardInfo.data.name },
    logType: "action",
  });

  eventBus.dispatch(GameEvent.CARD_DISCARDED, {
    entityUuid: entityToDiscard.uuid,
    cardId: entityToDiscard.cardInfo.data.id,
  });

  let handCount = 0;
  for (const e of world.with("zone")) {
    if (e.zone?.zone === Zone.HAND) {
      handCount++;
    }
  }
  if (handCount <= 6) {
    sideEffectQueue?.queue.push({
      type: "UPDATE_UI_FLAG",
      flag: "mustDiscard",
      value: false,
    });
  }
}

export function advancePhaseAction() {
  const { globalState, sideEffectQueue } = globalEntity;
  if (!globalState) return;

  const currentPhase = globalState.phase;
  const currentIndex = TURN_PHASES.indexOf(currentPhase);
  let nextIndex = currentIndex + 1;

  if (nextIndex >= TURN_PHASES.length) {
    nextIndex = 0;
    globalState.turn += 1;
  }

  const nextPhase = TURN_PHASES[nextIndex];
  globalState.phase = nextPhase;
  globalState.actionTakenInPhase = false;

  sideEffectQueue?.queue.push({
    type: "LOG",
    key: "logs.phaseChange",
    payload: {
      turn: globalState.turn,
      phase: nextPhase.charAt(0).toUpperCase() + nextPhase.slice(1),
    },
    logType: "system",
  });
}

export function updateMulliganSelectionAction(entityUuid: string) {
  const { globalState } = globalEntity;

  if (globalState?.phase !== GamePhase.MULLIGAN) {
    return;
  }

  const currentSelection = globalState.mulliganSelection || [];
  const isSelected = currentSelection.includes(entityUuid);

  if (isSelected) {
    globalState.mulliganSelection = currentSelection.filter(
      (uuid) => uuid !== entityUuid
    );
  } else {
    globalState.mulliganSelection = [...currentSelection, entityUuid];
  }

  useGameStore.getState().incrementWorldVersion();
}

export function startSetupAction() {
  const { globalState, sideEffectQueue } = globalEntity;
  if (!globalState || globalState.phase !== GamePhase.PRE_GAME) {
    return;
  }

  globalState.phase = GamePhase.SELECTING_LRIGS;

  sideEffectQueue?.queue.push({
    type: "LOG",
    key: "logs.setupStart",
    logType: "system",
  });
  sideEffectQueue?.queue.push({
    type: "LOG",
    key: "logs.selectLrigs",
    logType: "system",
  });
}

export function confirmLrigSelectionAction(
  centerUuid: string,
  assistUuids: string[]
) {
  const { globalState, sideEffectQueue } = globalEntity;
  if (!globalState || globalState.phase !== GamePhase.SELECTING_LRIGS) return;

  const lrigsToPlace = [assistUuids[0], centerUuid, assistUuids[1]];

  lrigsToPlace.forEach((uuid, index) => {
    const entity = findEntity(uuid);
    if (entity && entity.zone && entity.status) {
      entity.zone.zone = Zone.LRIG_ZONE;
      entity.zone.index = index;
      entity.status.isFaceUp = true;
    }
  });

  reindexLrigDeck();

  sideEffectQueue?.queue.push({
    type: "LOG",
    key: "logs.lrigsSelected",
    logType: "action",
  });

  drawInitialHand(5);

  globalState.phase = GamePhase.MULLIGAN;
  sideEffectQueue?.queue.push({
    type: "LOG",
    key: "logs.mulliganStart",
    logType: "system",
  });
}

export function confirmMulliganAction() {
  const { globalState, sideEffectQueue } = globalEntity;
  if (!globalState || globalState.phase !== GamePhase.MULLIGAN) return;

  const cardsToReturnUuids = globalState.mulliganSelection;
  const amountToRedraw = cardsToReturnUuids.length;

  if (amountToRedraw > 0) {
    sideEffectQueue?.queue.push({
      type: "LOG",
      key: "logs.mulligan.confirm",
      payload: { count: amountToRedraw },
      logType: "action",
    });

    cardsToReturnUuids.forEach((uuid) => {
      const entity = findEntity(uuid);
      if (entity && entity.zone && entity.status) {
        entity.zone.zone = Zone.MAIN_DECK;
        entity.status.isFaceUp = false;
      }
    });

    shuffleMainDeck();
    drawInitialHand(amountToRedraw);
  } else {
    sideEffectQueue?.queue.push({
      type: "LOG",
      key: "logs.mulligan.skip",
      logType: "info",
    });
  }

  const lifeClothEntities = getTopCardsOfDeck(7);
  lifeClothEntities.forEach((entity, index) => {
    if (entity.zone) {
      entity.zone.zone = Zone.LIFE_CLOTH;
      entity.zone.index = index;
    }
  });
  reindexDeck();
  sideEffectQueue?.queue.push({
    type: "LOG",
    key: "logs.mulligan.lifeClothSet",
    logType: "system",
  });

  globalState.mulliganSelection = [];
  globalState.phase = GamePhase.UP;
  globalState.turn = 1;
  sideEffectQueue?.queue.push({
    type: "LOG",
    key: "logs.mulligan.gameStart",
    logType: "system",
  });
}

export function placeSigniAction(entityUuid: string, zoneIndex: number) {
  const { globalState, sideEffectQueue } = globalEntity;
  if (globalState?.phase !== GamePhase.MAIN) {
    sideEffectQueue?.queue.push({
      type: "LOG",
      key: "logs.invalidPhase",
      logType: "info",
    });
    return;
  }

  const cardToPlay = findEntity(entityUuid);

  const lrigs = world.with("zone", "cardInfo");
  const centerLrig = Array.from(lrigs).find(
    (e) => e.zone.zone === Zone.LRIG_ZONE && e.zone.index === 1
  );

  if (!cardToPlay?.cardInfo || !centerLrig?.cardInfo) {
    return;
  }

  const lrigLevel = centerLrig.cardInfo.data.level ?? 0;
  const lrigLimit = centerLrig.cardInfo.data.limit ?? 99;
  const cardLevel = cardToPlay.cardInfo.data.level ?? 0;

  if (cardLevel > lrigLevel) {
    sideEffectQueue?.queue.push({
      type: "LOG",
      key: "logs.placeSigniError.level",
      payload: { requiredLevel: lrigLevel },
      logType: "info",
    });
    return;
  }

  const signiOnField = Array.from(
    world.with("zone", "cardInfo").where((e) => e.zone.zone === Zone.SIGNI_ZONE)
  );
  const currentTotalLevel = signiOnField.reduce(
    (sum, entity) => sum + (entity.cardInfo!.data.level ?? 0),
    0
  );

  if (currentTotalLevel + cardLevel > lrigLimit) {
    sideEffectQueue?.queue.push({
      type: "LOG",
      key: "logs.placeSigniError.limit",
      payload: { limit: lrigLimit },
      logType: "info",
    });
    return;
  }

  cardToPlay.zone!.zone = Zone.SIGNI_ZONE;
  cardToPlay.zone!.index = zoneIndex;
  cardToPlay.status!.isFaceUp = true;

  sideEffectQueue?.queue.push({
    type: "LOG",
    key: "logs.placeSigni",
    payload: {
      cardName: cardToPlay.cardInfo.data.name,
      position: zoneIndex + 1,
    },
    logType: "action",
  });

  eventBus.dispatch(GameEvent.CARD_PLAYED, {
    entityUuid: cardToPlay.uuid,
    cardId: cardToPlay.cardInfo.data.id,
    zone: Zone.SIGNI_ZONE,
    zoneIndex,
  });
}

export function growLrigAction(targetEntityUuid: string, zoneIndex: number) {
  const { globalState, sideEffectQueue } = globalEntity;
  if (!globalState) return;

  const validOptions = getValidGrowOptions(globalState.phase, zoneIndex);
  const isValidChoice = validOptions.some(
    (entity) => entity.uuid === targetEntityUuid
  );

  if (!isValidChoice) {
    sideEffectQueue?.queue.push({
      type: "LOG",
      key: "logs.growLrigError.invalid",
      logType: "info",
    });
    return;
  }

  const targetLrig = findEntity(targetEntityUuid)!;
  const currentLrig = Array.from(world.with("zone")).find(
    (e) => e.zone.zone === Zone.LRIG_ZONE && e.zone.index === zoneIndex
  )!;

  sideEffectQueue?.queue.push({
    type: "UPDATE_UI_FLAG",
    flag: "isZoneViewerOpen",
    value: false,
  });

  const enerZoneEntities = Array.from(
    world
      .with("zone", "cardInfo", "status", "uuid")
      .where((e) => e.zone.zone === Zone.ENER_ZONE)
  );
  const enerZoneCards: CardInstance[] = enerZoneEntities.map((e) => ({
    ...e.cardInfo!.data,
    ...e.status!,
    uuid: e.uuid,
    owner: e.zone!.owner,
  }));
  const cost = targetLrig.cardInfo!.data.growCost;
  const paymentResult = checkCost(cost, enerZoneCards);

  if (!paymentResult.canPay) {
    sideEffectQueue?.queue.push({
      type: "LOG",
      key: "logs.growLrigError.cost",
      logType: "info",
    });
    return;
  }

  paymentResult.paidEner.forEach((paidCard) => {
    const paidEntity = findEntity(paidCard.uuid);
    if (paidEntity) paidEntity.zone!.zone = Zone.TRASH;
  });
  if (paymentResult.paidEner.length > 0) {
    sideEffectQueue?.queue.push({
      type: "LOG",
      key: "logs.growLrigCost",
      payload: { count: paymentResult.paidEner.length },
      logType: "cost",
    });
  }

  const oldCardsStack: Entity[] = [
    currentLrig,
    ...(currentLrig.underneath?.entities ?? []),
  ];

  oldCardsStack.forEach((entity) => {
    if (entity.zone) entity.zone.zone = Zone.UNDERNEATH;
  });

  targetLrig.zone!.zone = Zone.LRIG_ZONE;
  targetLrig.zone!.index = zoneIndex;
  targetLrig.status!.isFaceUp = true;
  targetLrig.underneath = { entities: oldCardsStack };

  reindexLrigDeck();

  if (zoneIndex === 1 && globalState.phase === GamePhase.GROW) {
    globalState.actionTakenInPhase = true;
  }

  sideEffectQueue?.queue.push({
    type: "LOG",
    key: "logs.growLrig",
    payload: { cardName: targetLrig.cardInfo!.data.name },
    logType: "action",
  });
}

export function enerChargeAction(amount: number) {
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

export function initiatePlayerAction(action: PlayerActionPayload) {
  if (globalEntity.globalState) {
    globalEntity.globalState.playerAction = action;
    useGameStore.getState().incrementWorldVersion();
  }
}

export function cancelPlayerActionInECS() {
  if (globalEntity.globalState) {
    globalEntity.globalState.playerAction = null;
    useGameStore.getState().incrementWorldVersion();
  }
}
