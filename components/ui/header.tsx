"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { blocks } from "@/lib/blocks";

type Props = {
  id: keyof typeof blocks;
};

export const Header = ({ id }: Props) => {
  const router = useRouter();

  return (
    <div className="mb-8">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <h1 className="mb-4 text-4xl font-bold">{blocks[id].name}</h1>
      <p className="text-lg text-muted-foreground">{blocks[id].description}</p>
    </div>
  );
};
