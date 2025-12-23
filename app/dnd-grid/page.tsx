import { Header } from "@/components/ui/header";
import { DndGridBlock } from "./dnd-grid-block";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl p-8">
        <Header id="dnd-grid" />
        <a
          href="https://dnd-grid.com"
          target="_blank"
          rel="noreferrer"
          className="link mb-6"
        >
          Visit dnd-grid.com
        </a>
        <DndGridBlock />
      </div>
    </div>
  );
}
