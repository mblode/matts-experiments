import { MarkersBlock } from "@/app/markers/markers-block";
import { Header } from "@/components/ui/header";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-8 py-8">
        <Header id="markers" />
        <MarkersBlock />
      </div>
    </div>
  );
}
