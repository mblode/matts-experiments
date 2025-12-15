"use client";
import { QRCodeBlock } from "./qr-code-block";
import { Header } from "@/components/ui/header";

export default function Page() {
  return (
    <>
      <div className="p-8 bg-background">
        <div className="mx-auto max-w-4xl">
          <Header id="qr-code" />
        </div>
      </div>

      <QRCodeBlock />
    </>
  );
}
