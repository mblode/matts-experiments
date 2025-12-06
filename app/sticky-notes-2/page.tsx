import { Header } from "@/components/ui/header";
import { StickyNotes2Block } from "./sticky-notes-2-block";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header id="sticky-notes" />

        <div className="flex items-center justify-center">
          <StickyNotes2Block />
        </div>
      </div>
    </div>
  );
}
