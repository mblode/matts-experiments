import { Header } from "@/components/ui/header";
import { LightingBlock } from "./lighting-block";

export default function Page() {
  return (
    <>
      <div className="relative z-10 p-8 bg-background">
        <div className="mx-auto max-w-4xl">
          <Header id="lighting" className="mb-0!" />
        </div>
      </div>

      <LightingBlock />
    </>
  );
}
