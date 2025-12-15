"use client";

import { forwardRef } from "react";
import type { BlockData } from "./block";
import { CardInner } from "./card-inner";

interface DragOverlayCardProps {
  block: BlockData;
}

export const DragOverlayCard = forwardRef<HTMLDivElement, DragOverlayCardProps>(
  ({ block }, ref) => {
    return (
      <div
        ref={ref}
        data-overlay-card
        className="rounded-xl border border-border bg-white p-4 transition-shadow"
        style={{
          cursor: "grabbing",
        }}
      >
        <CardInner block={block} />
      </div>
    );
  },
);

DragOverlayCard.displayName = "DragOverlayCard";
