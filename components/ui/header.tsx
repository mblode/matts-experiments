"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blocks } from "@/lib/blocks";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  id: keyof typeof blocks;
  className?: string;
};

export const Header = ({ id, className }: Props) => {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="mb-4 rounded text-current! hover:text-foreground!"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="size-4 text-current" />
          </Link>
        </Button>

        <h1 className="mb-4 text-4xl font-bold">{blocks[id].name}</h1>
      </div>

      <p className="text-lg text-muted-foreground">{blocks[id].description}</p>
    </div>
  );
};
