import { ExpandBlock } from "@/components/block/expand-block";
import { Header } from "@/components/ui/header";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header title="Expand" description="Expand list" />
        <ExpandBlock />
      </div>
    </div>
  );
}
