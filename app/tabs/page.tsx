import TabsBlock from "@/components/block/tabs-block";
import { Header } from "@/components/ui/header";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header
          title="Tabs"
          description="Tabbed content navigation component that allows users to switch between different sections of content."
        />
        <TabsBlock />
      </div>
    </div>
  );
}
