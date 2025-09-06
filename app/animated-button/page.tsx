import { AnimatedButtonBlock } from "@/components/block/animated-button";
import { Header } from "@/components/ui/header";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header title="Animated button" description="Animated button" />
        <AnimatedButtonBlock />
      </div>
    </div>
  );
}
