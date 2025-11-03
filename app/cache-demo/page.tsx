import { Suspense } from "react";
import { connection } from "next/server";
import { cacheLife } from "next/cache";
import { Header } from "@/components/ui/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Example of a cached data fetching function
async function getCachedData() {
  "use cache";
  cacheLife("hours");

  // Simulated data fetch - in a real app, this could be a database query
  await new Promise((resolve) => setTimeout(resolve, 100));

  const quotes = [
    { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { content: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { content: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  ];

  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Example of dynamic data (not cached)
async function getDynamicTime() {
  // Use connection() to mark this as runtime data
  await connection();
  return new Date().toISOString();
}

// Component that uses cached data
async function CachedQuote() {
  const quote = await getCachedData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cached Quote</CardTitle>
        <CardDescription>
          This quote is cached and will be the same for multiple requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <blockquote className="italic border-l-4 border-primary pl-4">
          "{quote.content}"
        </blockquote>
        <p className="mt-2 text-sm text-muted-foreground">— {quote.author}</p>
      </CardContent>
    </Card>
  );
}

// Component that shows dynamic data
async function DynamicTime() {
  const time = await getDynamicTime();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dynamic Time</CardTitle>
        <CardDescription>
          This time is generated on each request and wrapped in Suspense
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-lg">{time}</p>
      </CardContent>
    </Card>
  );
}

// Loading skeleton
function QuoteSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loading...</CardTitle>
        <CardDescription>Fetching cached quote...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-20 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}

function TimeSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loading...</CardTitle>
        <CardDescription>Generating dynamic time...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-8 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ refresh?: string }>;
}) {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl space-y-6">
        <Header id="cache-demo" />

        {/* Static content - always pre-rendered */}
        <Card>
          <CardHeader>
            <CardTitle>Static Content</CardTitle>
            <CardDescription>
              This card is always pre-rendered as part of the static shell
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Cache Components in Next.js 16 enables Partial Prerendering (PPR)
              by default. This page demonstrates:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Static content (this card)</li>
              <li>Cached dynamic data (quote below)</li>
              <li>Dynamic streaming content (time below)</li>
            </ul>
          </CardContent>
        </Card>

        {/* Cached dynamic content with Suspense */}
        <Suspense fallback={<QuoteSkeleton />}>
          <CachedQuote />
        </Suspense>

        {/* Dynamic content with Suspense */}
        <Suspense fallback={<TimeSkeleton />}>
          <DynamicTime />
        </Suspense>

        {/* Implementation notes */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Enable Cache Components</h3>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                {`// next.config.ts
const nextConfig = {
  cacheComponents: true,
};`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                2. Use "use cache" for cacheable data
              </h3>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                {`async function getCachedQuote() {
  "use cache";
  cacheLife("hours");
  // fetch data...
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                3. Wrap dynamic content in Suspense
              </h3>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                {`<Suspense fallback={<Loading />}>
  <DynamicComponent />
</Suspense>`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
