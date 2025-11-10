import { Header } from "@/components/ui/header";
import { SVGAnimationsBlock } from "./svg-animations-block";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header id="svg-animations" />

        <SVGAnimationsBlock />
      </div>
    </div>
  );
}
