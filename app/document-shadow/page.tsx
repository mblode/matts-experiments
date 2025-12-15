import { Header } from "@/components/ui/header";
import { DocumentShadowBlock } from "./document-shadow-block";

export default function Page() {
  return (
    <>
      <div className="p-8 bg-background relative z-[100]">
        <div className="mx-auto max-w-4xl">
          <Header id="document-shadow" />
        </div>
      </div>
      <DocumentShadowBlock />
    </>
  );
}
