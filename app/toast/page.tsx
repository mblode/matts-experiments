"use client";
import { ToastBlock } from "@/components/block/toast-block";
import { Header } from "@/components/ui/header";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header
          title="Toast"
          description="Toast display component for showcasing commitments, guarantees, or value propositions."
        />
        <ToastBlock />
      </div>
    </div>
  );
}
