"use client";
import { ToastBlock } from "@/components/block/toast-block";
import { Header } from "@/components/ui/header";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header id="toast" />
        <ToastBlock />
      </div>
    </div>
  );
}
