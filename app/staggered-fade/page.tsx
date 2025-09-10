import { Header } from "@/components/ui/header";
import { StaggeredFadeBlock } from "./staggered-fade-block";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header id="staggered-fade" />
        <StaggeredFadeBlock />
      </div>
    </div>
  );
}
