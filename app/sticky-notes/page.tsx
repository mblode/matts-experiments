import { Header } from "@/components/ui/header";
import { StickyNotesBlock } from "./sticky-notes-block";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header id="sticky-notes" />

        <div className="flex items-center justify-center">
          <StickyNotesBlock />
        </div>
      </div>
    </div>
  );
}
