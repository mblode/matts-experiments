import { Header } from "@/components/ui/header";
import { CardStackBlock } from "./card-stack-block";

export default function Page() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <Header id="card-stack" />
        <CardStackBlock />
      </div>
    </div>
  );
}
