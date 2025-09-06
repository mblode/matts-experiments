import { DynamicIslandBlock } from "@/components/block/dynamic-island-block";
import { Header } from "@/components/ui/header";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header
          title="Dynamic Island"
          description="Dynamic island notification component inspired by iOS, providing contextual information and interactions."
        />
        <DynamicIslandBlock />
      </div>
    </div>
  );
}
