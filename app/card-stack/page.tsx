import { CardStackBlock } from "@/components/block/card-stack-block";
import { Header } from "@/components/ui/header";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header
          title="Card stack"
          description="Card stack component for displaying collections of images in an organized grid layout."
        />
        <CardStackBlock />
      </div>
    </div>
  );
}
