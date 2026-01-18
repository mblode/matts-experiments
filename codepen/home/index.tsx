// CodePen packages: clsx@^2.1.1, react-dom@19.2.3, react@19.2.3, tailwind-merge@^3.4.0

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createRoot } from "react-dom/client";

const Link = ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
  <a href={href} {...props}>{children}</a>
);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getSvgPathFromStroke(stroke: number[][]): string {
  if (!stroke.length) {
    return "";
  }

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"] as (string | number)[]
  );

  d.push("Z");
  return d.join(" ");
}

const imageLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

const unsplashLoader = ({
  src,
  width,
  quality,
  blur,
  cropX,
  cropY,
  cropW,
  cropH,
}: {
  src: string;
  width: number;
  quality?: number;
  blur?: number;
  cropX?: number;
  cropY?: number;
  cropW?: number;
  cropH?: number;
}) => {
  const params = new URLSearchParams();
  params.set("w", width.toString());
  if (quality) {
    params.set("q", quality.toString());
  }
  if (blur) {
    params.set("blur", blur.toString());
  }
  if (cropX) {
    params.set("rect", `${cropX},${cropY},${cropW},${cropH}`);
  }

  return `${src}?${params.toString()}`;
};

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground",
        className
      )}
      data-slot="card"
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      data-slot="card-header"
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("font-semibold leading-none", className)}
      data-slot="card-title"
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="card-description"
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      data-slot="card-action"
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("px-6", className)}
      data-slot="card-content"
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      data-slot="card-footer"
      {...props}
    />
  );
}

const blocks: Record<
  string,
  { name: string; description: string; hidden?: boolean }
> = {
  "animated-button": {
    name: "Animated subscribe button",
    description:
      "Toggle button that smoothly transitions between follow and subscribed states",
  },
  "shuffle-theme": {
    name: "Theme shuffler",
    description:
      "Scroll-animated cards with multiple themed colour schemes and backgrounds",
  },
  faq: {
    name: "FAQ accordion",
    description: "Expandable FAQ section with smooth accordion animations",
  },
  sheet: {
    name: "Bottom sheet",
    description: "Multi-stage draggable modal with swipe gestures",
  },
  tabs: {
    name: "Tab navigation",
    description: "Tabbed interface for organising content into sections",
  },
  toast: {
    name: "Toast notifications",
    description:
      "Temporary notification pop-ups with customisable styles and animations",
  },
  "ios-cards": {
    name: "iOS-style cards",
    description: "iOS-inspired cards with smooth transitions",
  },
  "dynamic-island": {
    name: "Dynamic island",
    description:
      "iPhone-style dynamic island with expandable states and morphing animations",
  },
  map: {
    name: "Interactive map",
    description:
      "Mapbox-powered map with custom markers and navigation controls",
  },
  "card-stack": {
    name: "Stacked cards",
    description: "Three-card stack that expands into a grid layout on click",
  },
  expand: {
    name: "Expandable date cards",
    description: "Date cards that expand to reveal additional details on click",
  },
  preview: {
    name: "Preview block",
    description: "Preview component that expands to show more content",
  },
  sky: {
    name: "Sky",
    description:
      "Scroll-driven sky gradient transitioning through sunrise, day, sunset, and night with animated stars",
  },
  album: {
    name: "Album",
    description:
      "Interactive vinyl record player that toggles between spinning record and album cover",
  },
  moon: {
    name: "Moon",
    description: "3D moon with accurate lunar phases and NASA textures",
  },
  "staggered-fade": {
    name: "Staggered fade",
    description: "Auto-cycling text with letter-by-letter fade animations",
  },
  status: {
    name: "Status",
    description: "Popover menu to set user status with animated emoji icons",
  },
  table: {
    name: "Table",
    description:
      "Animated data table with category toggle and staggered cell animations",
  },
  lighting: {
    name: "Lighting",
    description:
      "3D window scene with mouse-controlled light beams, parallax depth, and organic noise animations",
  },
  "password-strength": {
    name: "Password strength",
    description:
      "Password input with animated 3-bar strength metre and colour-coded feedback",
  },
  controls: {
    name: "Controls",
    description: "Design system playground with colour and layout controls",
  },
  dither: {
    name: "Dither",
    description:
      "3D asteroid shooter game with Obra Dinn-style dithering effects",
  },
  "timed-undo": {
    name: "Timed undo",
    description:
      "Delete account button with animated countdown timer and undo functionality",
  },
  // "svg-animations": {
  //   name: "SVG animations",
  //   description: "Morphing SVG shapes with spring animations and color transitions",
  // },
  "document-shadow": {
    name: "Document shadow",
    description:
      "Document card with ambient shadow overlay and interactive dice button",
  },
  "qr-code": {
    name: "QR code generator",
    description:
      "Customisable QR code generator with OKLCH colour picker and downloadable SVG/PNG output",
  },
  "sticky-notes": {
    name: "Sticky notes",
    description: "Sticky notes with animated page turning",
    hidden: true,
  },
  markers: {
    name: "Article markers",
    description:
      "Scroll progress bar with chapter indicators and highlight bookmarks",
  },
  "perfect-dnd": {
    name: "Perfect drag and drop",
    description: "Sortable list with spring physics drag animations",
  },
  "dnd-grid": {
    name: "Dnd grid",
    description: "Resizable drag-and-drop grid layout using dnd-grid",
  },
};

function Page() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 font-bold text-4xl">Matt's experiments</h1>

        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(blocks)
            .filter(([, block]) => !block.hidden)
            .reverse()
            .map(([key, block]) => (
              <Link className="flex w-full" href={`/${key}`} key={key}>
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>{block.name}</CardTitle>

                    <CardDescription>{block.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
        </div>

        <footer className="mt-8 border-border border-t px-4 py-8 text-center">
          <div className="text-sm">
            © 2025{" "}
            <a
              className="text-foreground underline-offset-2 hover:underline"
              href="https://matthewblode.com"
              rel="noopener"
              target="_blank"
            >
              Matthew Blode
            </a>
            {" · "}
            <a
              className="text-foreground underline-offset-2 hover:underline"
              href="https://github.com/mblode/matts-experiments"
              rel="noopener"
              target="_blank"
            >
              View Source
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <Page />
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
