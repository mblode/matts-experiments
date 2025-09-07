import { IosCardsBlock } from "@/components/block/ios-cards-block";
import { Header } from "@/components/ui/header";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header id="ios-cards" />
        <IosCardsBlock />
      </div>
    </div>
  );
}
