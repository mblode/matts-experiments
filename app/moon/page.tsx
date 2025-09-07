import { Header } from "@/components/ui/header";
import "./styles.css";
import { MoonBlock } from "./moon-block";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header id="moon" />
        <MoonBlock />
      </div>
    </div>
  );
}
