"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Item } from "./item";
import { List } from "./list";

export const ios = () => {
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
