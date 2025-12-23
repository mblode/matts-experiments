"use client";

import { EditorPage } from "./dnd-kit-page";
import { StoreProvider } from "./stores/store";
import { Header } from "@/components/ui/header";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header id="dnd" className="mb-4" />
        <a
          href="https://github.com/mblode/perfect-dnd"
          target="_blank"
          rel="noreferrer"
          className="link"
        >
          Perfect DnD on GitHub
        </a>
        <StoreProvider>
          <EditorPage />
        </StoreProvider>
      </div>
    </div>
  );
}
