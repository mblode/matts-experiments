import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  lng: number;
  lat: number;
  size: "small" | "medium" | "large";
}

export const GetDirectionsButton = ({ lng, lat, size }: Props) => {
  const handleGetDirections = (event: any) => {
    event.preventDefault();
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <Button
      className={cn(
        `relative before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:bg-page-background before:content-[''] after:absolute after:inset-0 after:z-[2] after:rounded-[inherit] after:bg-[var(--page-widget-background)] after:content-['']`,
        {
          "h-auto! p-1!": size === "small",
        }
      )}
      onClick={handleGetDirections}
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
