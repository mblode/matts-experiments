import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRightIcon } from "lucide-react";

type Props = {
  lng: number;
  lat: number;
  size: "small" | "medium" | "large";
};

export const GetDirectionsButton = ({ lng, lat, size }: Props) => {
  const handleGetDirections = (event: any) => {
    event.preventDefault();
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank",
    );
  };

  return (
    <Button
      onClick={handleGetDirections}
      className={cn(
        `relative before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:bg-page-background before:z-[1] after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:bg-[var(--page-widget-background)] after:z-[2]`,
        {
          "p-1! h-auto!": size === "small",
        },
      )}
    >
      {size !== "small" && <span className="z-[3]">Directions</span>}
      <ArrowUpRightIcon
        className={cn("z-[3] size-4", {
          "ml-2": size !== "small",
        })}
      />
    </Button>
  );
};
