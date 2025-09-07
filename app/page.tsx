import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { blocks } from "@/lib/blocks";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-center">
          Matt's experiments
        </h1>

        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(blocks).map(([key, block]) => (
            <Link key={key} href={`/${key}`} className="flex w-full">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>{block.name}</CardTitle>

                  <CardDescription>{block.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <footer className="mt-8 py-8 px-4 border-t border-border text-center">
          <div className="text-sm">
            © {new Date().getFullYear()}{" "}
            <a
              target="_blank"
              href="https://matthewblode.com"
              className="hover:underline underline-offset-2 text-foreground"
            >
              Matthew Blode
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
