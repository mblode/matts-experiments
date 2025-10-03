import { Header } from "@/components/ui/header";
import { CommutingBlock } from "./commuting-block";

export default function Page() {
  return (
    <>
      <div className="relative z-10 p-8 bg-background">
        <div className="mx-auto max-w-4xl">
          <Header id="commuting" className="mb-0!" />
        </div>
      </div>

      <CommutingBlock />
    </>
  );
}
