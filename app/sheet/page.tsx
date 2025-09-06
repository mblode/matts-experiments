import { SheetBlock } from "@/components/block/sheet-block";
import { Header } from "@/components/ui/header";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header
          title="Sheet"
          description="Bottom sheet modal component that slides up from the bottom of the screen. Useful for displaying additional content or actions."
        />
        <SheetBlock />
      </div>
    </div>
  );
}
