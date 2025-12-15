"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Item } from "../ios-cards/item";
import { List } from "../ios-cards/list";

export const IosCardsBlock = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <List setSelectedId={setSelectedId} />
      <AnimatePresence>
        {selectedId && (
          <Item id={selectedId} key="item" setSelectedId={setSelectedId} />
        )}
      </AnimatePresence>
    </>
  );
};
