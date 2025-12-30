import { Header } from "@/components/ui/header";
import { DndGridBlock } from "./dnd-grid-block";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl p-8">
        <Header id="dnd-grid" />
        <a
          className="link mb-6"
          href="https://dnd-grid.com"
          rel="noreferrer"
          target="_blank"
        >
          Visit dnd-grid.com
        </a>
        <DndGridBlock />
      </div>
    </div>
  );
}
