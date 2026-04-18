import { world } from "./world.miniplex";
import { Entity } from "./types.miniplex";
import { Zone } from "../constants";
import shuffle from "shuffle-array";

export function getTopCardsOfDeck(amount: number): Entity[] {
  const mainDeckEntities = Array.from(
    world.with("zone").where((e) => e.zone.zone === Zone.MAIN_DECK)
  );

  mainDeckEntities.sort((a, b) => b.zone.index - a.zone.index);
  return mainDeckEntities.slice(0, amount);
}

export function reindexDeck() {
  const mainDeckEntities = Array.from(
    world.with("zone").where((e) => e.zone.zone === Zone.MAIN_DECK)
  );
  mainDeckEntities.sort((a, b) => a.zone.index - b.zone.index);
  mainDeckEntities.forEach((entity, i) => {
    entity.zone.index = i;
  });
}

export function drawInitialHand(amount: number) {
  const cardsToDraw = getTopCardsOfDeck(amount);
  cardsToDraw.forEach((entity) => {
    if (entity.zone && entity.status) {
      entity.zone.zone = Zone.HAND;
      entity.status.isFaceUp = true;
      entity.zone.index = 0;
    }
  });
  reindexDeck();
}

export function shuffleMainDeck() {
  const mainDeckEntities = Array.from(
    world.with("zone").where((e) => e.zone.zone === Zone.MAIN_DECK)
  );
  shuffle(mainDeckEntities);
  mainDeckEntities.forEach((entity, i) => {
    entity.zone.index = i;
  });
}

export function reindexLrigDeck() {
  const lrigDeckEntities = Array.from(
    world.with("zone").where((e) => e.zone.zone === Zone.LRIG_DECK)
  );
  lrigDeckEntities.sort((a, b) => a.zone.index - b.zone.index);
  lrigDeckEntities.forEach((entity, i) => {
    entity.zone.index = i;
  });
}
