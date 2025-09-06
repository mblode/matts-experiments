import Link from "next/link";

export default function Home() {
  const blocks = [
    {
      name: "Shuffle theme",
      href: "/shuffle-theme",
      description: "Interactive card components with theme variations",
    },
    {
      name: "FAQ",
      href: "/faq",
      description: "Frequently asked questions accordion component",
    },
    {
      name: "Sheet",
      href: "/sheet",
      description: "Bottom sheet modal component",
    },
    {
      name: "Tabs",
      href: "/tabs",
      description: "Tabbed content navigation component",
    },
    {
      name: "Toast",
      href: "/toast",
      description: "Toast display component",
    },
    {
      name: "iOS cards",
      href: "/ios-cards",
      description: "iOS-style card components",
    },
    {
      name: "Dynamic island",
      href: "/dynamic-island",
      description: "Dynamic island notification component",
    },
    {
      name: "Map",
      href: "/map",
      description: "Map component",
    },
    {
      name: "Card stack",
      href: "/card-stack",
      description:
        "Card stack component for displaying collections of images in an organised grid layout.",
    },
    {
      name: "Animated button",
      href: "/animated-button",
      description: "Animated button component for interactive user actions.",
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Component Blocks</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {blocks.map((block) => (
            <Link
              key={block.href}
              href={block.href}
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
