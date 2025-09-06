import { IosCardsBlock } from "@/components/block/ios-cards-block";
import { Header } from "@/components/ui/header";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header
          title="iOS Cards"
          description="iOS-style card components with smooth animations and native iOS design patterns."
        />
        <IosCardsBlock />
      </div>
    </div>
  );
}
