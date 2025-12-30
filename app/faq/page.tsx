import { Header } from "@/components/ui/header";
import { FaqBlock } from "./faq-block";

export default function Page() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <Header id="faq" />
        <FaqBlock />
      </div>
    </div>
  );
}
