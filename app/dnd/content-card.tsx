"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "@/components/ui/button";
import { useStore } from "./stores/store";
import type { BlockData } from "./block";
import { cn } from "@/lib/utils";
import { CardInner } from "./card-inner";

interface ContentCardProps {
  block: BlockData;
}

export const ContentCard = observer(({ block }: ContentCardProps) => {
  const store = useStore();

  const isSettling = store.settlingBlockId === block.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const isActiveInStore = store.activeBlockId === block.id;
  // Use store state for placeholder visibility to coordinate with our drop animation
  // isDragging from dnd-kit resets immediately, but we want to wait for animation
  const showPlaceholder = isActiveInStore || isSettling;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="mb-2">
      <button
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        style={style}
        data-sortable-item
        data-settling-target={isSettling ? block.id : undefined}
        className={cn(
          "flex w-full text-left group rounded-xl border border-border bg-white p-4 transition-shadow cursor-grab",
          {
            "bg-muted/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] z-0":
              showPlaceholder,
            "z-10": !showPlaceholder,
          },
        )}
      >
        <div
          className={cn({
            "opacity-0": showPlaceholder,
          })}
        >
          <CardInner block={block} />
        </div>
      </button>
    </div>
  );
});

ContentCard.displayName = "ContentCard";
