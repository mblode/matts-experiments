import { Header } from "@/components/ui/header";
import "./styles.css";
import { MoonBlock } from "./moon-block";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#05060A] text-white relative overflow-hidden">
      <div className="relative mx-auto max-w-4xl z-10 pt-8 px-8">
        <Header id="moon" />
      </div>

      <div className="absolute inset-0">
        <MoonBlock />
      </div>
    </div>
  );
}
