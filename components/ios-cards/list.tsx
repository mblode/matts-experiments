"use client";

import { items } from "./data";
import { Card } from "./card";

interface ListProps {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export function List({ selectedId, setSelectedId }: ListProps) {
  return (
    <ul className="flex flex-wrap content-start list-none p-0 m-0">
      {items.map((card, index) => {
        const isLarge = index % 4 === 0 || index % 4 === 3;
        return (
          <Card
            key={card.id}
            {...card}
            isSelected={card.id === selectedId}
            isLarge={isLarge}
            setSelectedId={setSelectedId}
          />
        );
      })}
    </ul>
  );
}
