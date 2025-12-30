import { Header } from "@/components/ui/header";
import { StickyNotes2Block } from "./sticky-notes-2-block";

export default function Page() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <Header id="sticky-notes" />

        <div className="flex items-center justify-center">
          <StickyNotes2Block />
        </div>
      </div>
    </div>
  );
}
