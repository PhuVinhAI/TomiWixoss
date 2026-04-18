"use client";
import dynamic from "next/dynamic";
import { useState, useMemo, useRef, useEffect } from "react";
import { CardInstance } from "@/types/game";
import useGameStore from "@/store/gameStore";
import { useStore } from "zustand";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

import { world, globalEntity } from "@/logic/ecs/world.miniplex";
import { Entity } from "@/logic/ecs/types.miniplex";
import { getValidGrowOptions } from "@/logic/ecs/selectors.miniplex";
import {
  confirmLrigSelectionAction,
  growLrigAction,
  cancelPlayerActionInECS,
} from "@/logic/actions.miniplex";

import { TomiwixossSceneLoader } from "./TomiwixossSceneLoader";
import { bootstrapGame } from "@/logic/engine.setup";
import { GamePhase, Zone } from "@/logic/constants";

if (typeof window !== "undefined") {
  bootstrapGame();
}

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});
const GameController = dynamic(() => import("@/components/ui/GameController"), {
  ssr: false,
});
const Hand = dynamic(() => import("@/components/ui/Hand"), {
  ssr: false,
});
const SideCardPreview = dynamic(
  () => import("@/components/ui/SideCardPreview"),
  { ssr: false }
);
const GameLog = dynamic(() => import("@/components/ui/GameLog"), {
  ssr: false,
});
const LrigSelector = dynamic(() => import("@/components/ui/LrigSelector"), {
  ssr: false,
});
const DeckViewer = dynamic(() => import("@/components/ui/DeckViewer"), {
  ssr: false,
});
const LanguageSwitcher = dynamic(
  () => import("@/components/ui/LanguageSwitcher"),
  { ssr: false }
);

export default function ClientOnlyLoader() {
  const [selectedCard, setSelectedCard] = useState<CardInstance | null>(null);

  const worldVersion = useStore(useGameStore, (state) => state.worldVersion);
  const phase = globalEntity.globalState?.phase;
  const isZoneViewerOpen = useStore(
    useGameStore,
    (state) => state.isZoneViewerOpen
  );
  const viewingLrigDeckForGrow = useStore(
    useGameStore,
    (state) => state.viewingLrigDeckForGrow
  );
  const initializeGame = useStore(
    useGameStore,
    (state) => state.initializeGame
  );
  const closeZoneViewer = useStore(
    useGameStore,
    (state) => state.closeZoneViewer
  );
  const playerAction = globalEntity.globalState?.playerAction;

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const gameAreaRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(gameAreaRef, () => {
    if (playerAction) {
      cancelPlayerActionInECS();
    }
  });

  const lrigDeckForSelector: CardInstance[] = useMemo(() => {
    const lrigEntities = [];
    for (const entity of world.with("cardInfo", "status", "zone")) {
      if (entity.zone?.zone === Zone.LRIG_DECK) {
        lrigEntities.push(entity);
      }
    }

    return lrigEntities.map(
      (entity: Entity): CardInstance => ({
        ...entity.cardInfo!.data,
        ...entity.status!,
        uuid: entity.uuid,
        owner: entity.zone!.owner,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worldVersion]);

  const growOptions: CardInstance[] = useMemo(() => {
    if (!phase) return [];

    let zoneIndex: number;
    if (phase === GamePhase.GROW) zoneIndex = 1;
    else if (viewingLrigDeckForGrow)
      zoneIndex = viewingLrigDeckForGrow.forAssistIndex!;
    else return [];

    const validGrowEntities = getValidGrowOptions(phase, zoneIndex);

    return validGrowEntities.map(
      (entity: Entity): CardInstance => ({
        ...entity.cardInfo!.data,
        ...entity.status!,
        uuid: entity.uuid,
        owner: entity.zone!.owner,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, viewingLrigDeckForGrow, worldVersion]);

  return (
    <div ref={gameAreaRef} className="w-screen h-screen">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        <GameController />
        <Hand onCardSelect={setSelectedCard} />
        <SideCardPreview card={selectedCard} />
        <GameLog />
        <LanguageSwitcher />
      </div>

      <TomiwixossSceneLoader>
        <Scene />
      </TomiwixossSceneLoader>

      <LrigSelector
        isOpen={phase === GamePhase.SELECTING_LRIGS}
        fullLrigDeck={lrigDeckForSelector}
        onConfirm={(centerUuid, assist1Uuid, assist2Uuid) => {
          confirmLrigSelectionAction(centerUuid, [assist1Uuid, assist2Uuid]);
        }}
      />
      <DeckViewer
        context={viewingLrigDeckForGrow ? "assist_grow" : "center_grow"}
        cards={growOptions}
        isOpen={isZoneViewerOpen}
        onOpenChange={closeZoneViewer}
        onCardClick={(card) => {
          const zoneIndex =
            phase === GamePhase.GROW
              ? 1
              : viewingLrigDeckForGrow!.forAssistIndex!;
          growLrigAction(card.uuid, zoneIndex);
        }}
      />
    </div>
  );
}
