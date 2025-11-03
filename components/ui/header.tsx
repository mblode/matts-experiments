"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blocks } from "@/lib/blocks";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type Props = {
  id: keyof typeof blocks;
  className?: string;
};

export const Header = ({ id, className }: Props) => {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="mb-4 rounded text-current! hover:text-foreground!"
          onClick={handleBack}
        >
          <ArrowLeft className="size-4 text-current" />
        </Button>

        <h1 className="mb-4 text-4xl font-bold">{blocks[id].name}</h1>
      </div>

      <p className="text-lg text-muted-foreground">{blocks[id].description}</p>
    </div>
  );
};
