import { Header } from "@/components/ui/header";
import { DocumentShadowBlock } from "./document-shadow-block";

export default function Page() {
  return (
    <>
      <div className="relative z-[100] bg-background p-8">
        <div className="mx-auto max-w-4xl">
          <Header id="document-shadow" />
        </div>
      </div>
      <DocumentShadowBlock />
    </>
  );
}
