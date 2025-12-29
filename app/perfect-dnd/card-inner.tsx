"use client";

import { GripVertical } from "lucide-react";
import type { BlockData } from "./block";
import type { ReactNode } from "react";

interface CardInnerProps {
  block: BlockData;
  actions?: ReactNode;
}

export function CardInner({ block, actions }: CardInnerProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
        <GripVertical className="h-4 w-4 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-900 truncate">{block.title}</div>
        {block.type === "link" && block.url && (
          <div className="text-sm text-slate-500 truncate">{block.url}</div>
        )}
      </div>
      {actions}
    </div>
  );
}
