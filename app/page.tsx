import { blocks } from "@/lib/blocks";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Experiments</h1>

        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(blocks).map(([key, block]) => (
            <Link
              key={key}
              href={`/${key}`}
              className="bg-card block rounded-lg border p-6 transition-colors hover:bg-card"
            >
              <h2 className="mb-2 text-xl font-semibold">{block.name}</h2>
              <p className="text-muted-foreground">{block.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
