import { StateCreator } from "zustand";
import { GameStore } from "../types";
import { CardData } from "@/types/game";
import shuffle from "shuffle-array";
import { addCardImageUrlsToPreload } from "@/data/assetPreloader";
import { world, globalEntity } from "@/logic/ecs/world.miniplex";
import { Entity } from "@/logic/ecs/types.miniplex";
import { v4 as uuidv4 } from "uuid";
import { Zone, GamePhase } from "@/logic/constants";
import i18n from "@/i18n";

export interface GameSlice {
  initializeGame: () => void;
  incrementWorldVersion: () => void;
}

export const createGameSlice: StateCreator<GameStore, [], [], GameSlice> = (
  set,
  get
) => ({
  initializeGame: async () => {
    const response = await fetch("/data/decks/diva-debut-deck.json");
    const fullDeckData: CardData[] = await response.json();

    const currentLang = i18n.language;
    const uniqueCardIds = [...new Set(fullDeckData.map((c) => c.id))];
    const translationEntries = await Promise.allSettled(
      uniqueCardIds.map(async (id) => {
        const res = await fetch(`/locales/${currentLang}/cards/${id}.json`);
        if (!res.ok) return null;
        return { id, data: await res.json() };
      })
    );
    const cardTranslations: Record<string, any> = {};
    for (const entry of translationEntries) {
      if (entry.status === "fulfilled" && entry.value) {
        cardTranslations[entry.value.id] = entry.value.data;
      }
    }

    const translatedDeckData = fullDeckData.map((card) => {
      const translation = cardTranslations[card.id];
      if (translation) {
        const newCard = { ...card };
        newCard.name = translation.name || card.name;
        newCard.class = translation.class || card.class;
        if (translation.abilities && Array.isArray(translation.abilities)) {
          newCard.abilities =
            card.abilities?.map((ability, index) => ({
              ...ability,
              description:
                translation.abilities[index]?.description ||
                ability.description,
            })) || [];
        }
        return newCard;
      }
      return card;
    });

    const imageUrls = translatedDeckData.map((card) => card.imageUrl);
    addCardImageUrlsToPreload(imageUrls);

    const mainDeckData = translatedDeckData
      .filter((c) => c.backType === "MAIN")
      .flatMap((c) => Array(4).fill(c))
      .slice(0, 40);
    const lrigDeckData = translatedDeckData.filter(
      (c) => c.backType === "LRIG" || c.backType === "PIECE"
    );

    world.clear();

    const createCardEntity = (
      cardData: CardData,
      zoneName: typeof Zone[keyof typeof Zone],
      index: number
    ): Entity => ({
      uuid: uuidv4(),
      cardInfo: { data: cardData },
      status: { isFaceUp: false, isDowned: false },
      zone: { owner: "player", zone: zoneName, index },
    });

    shuffle(mainDeckData);
    mainDeckData.forEach((card, index) => {
      world.add(createCardEntity(card, Zone.MAIN_DECK, index));
    });

    lrigDeckData.forEach((card, index) => {
      world.add(createCardEntity(card, Zone.LRIG_DECK, index));
    });

    const { globalEntity: ge } = await import("@/logic/ecs/world.miniplex");
    ge.globalState!.phase = GamePhase.PRE_GAME;
    world.add(ge);

    console.log(
      `Miniplex World hydrated with translated data for language: ${currentLang}`
    );
    get().incrementWorldVersion();
  },

  incrementWorldVersion: () => {
    set((state) => ({ worldVersion: state.worldVersion + 1 }));
  },
});
