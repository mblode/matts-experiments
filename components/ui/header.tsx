"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blocks } from "@/lib/blocks";
import Link from "next/link";

type Props = {
  id: keyof typeof blocks;
};

export const Header = ({ id }: Props) => {
  return (
    <div className="mb-8">
      <Button variant="ghost" size="icon" className="mb-4" asChild>
        <Link href="/">
          <ArrowLeft className="size-4" />
        </Link>
      </Button>

      <h1 className="mb-4 text-4xl font-bold">{blocks[id].name}</h1>
      <p className="text-lg text-muted-foreground">{blocks[id].description}</p>
    </div>
  );
};
