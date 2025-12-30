import { TabsBlock } from "@/app/tabs/tabs-block";
import { Header } from "@/components/ui/header";

export default function Page() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <Header id="tabs" />
        <TabsBlock />
      </div>
    </div>
  );
}
