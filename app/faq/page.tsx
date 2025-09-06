import { FaqBlock } from "@/components/block/faq-block";
import { Header } from "@/components/ui/header";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header
          title="FAQ"
          description="Frequently asked questions with expandable answers. Click on any question to reveal the answer."
        />
        <FaqBlock />
      </div>
    </div>
  );
}
