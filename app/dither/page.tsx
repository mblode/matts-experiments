import { Header } from "@/components/ui/header";
import { DitherBlock } from "./dither-block";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#333319] text-white relative overflow-hidden">
      <div className="relative mx-auto max-w-4xl z-10 pt-8 px-8">
        <Header id="dither" />
      </div>

      <div className="absolute inset-0">
        <DitherBlock />
      </div>
    </div>
  );
}
