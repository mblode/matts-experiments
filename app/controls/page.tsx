import { Header } from "@/components/ui/header";
import { ControlsBlock } from "./controls-block";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-8">
        <Header id="controls" />
      </div>

      <ControlsBlock />
    </div>
  );
}
