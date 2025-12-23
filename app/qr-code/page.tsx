"use client";
import { QRCodeBlock } from "./qr-code-block";
import { Header } from "@/components/ui/header";

export default function Page() {
  return (
    <>
      <div className="p-8 bg-background">
        <div className="mx-auto max-w-4xl">
          <Header id="qr-code" className="mb-4" />
          <a
            href="https://github.com/mblode/beautiful-qr-code"
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            Beautiful QR Code on GitHub
          </a>
        </div>
      </div>

      <QRCodeBlock />
    </>
  );
}
