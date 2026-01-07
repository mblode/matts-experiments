// CodePen packages: clsx@^2.1.1, react-dom@19.2.3, react@19.2.3, tailwind-merge@^3.4.0

import * as React from "react";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createRoot } from "react-dom/client";

type ImageShimProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
};
const Image = ({ fill, style, ...props }: ImageShimProps) => {
  const mergedStyle = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style }
    : style;
  return <img style={mergedStyle} {...props} />;
};

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

const AlbumBlock = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <button
      aria-pressed={isPlaying}
      className="relative aspect-square w-full max-w-[400px] overflow-hidden rounded-[40px] bg-gray-400 p-0 text-left shadow-2xl"
      onClick={() => setIsPlaying(!isPlaying)}
      type="button"
    >
      <div className="absolute bottom-8 flex w-full flex-col justify-center text-center text-foreground">
        <h1 className="font-bold text-base">Bridge Over Troubled Water</h1>
        <h2 className="text-sm">Simon & Garfunkel</h2>
      </div>

      <div
        className={cn(
          "relative z-[10] aspect-square w-full overflow-hidden object-cover shadow-xl transition-all duration-1000",
          {
            "translate-y-0 rounded-none": isPlaying,
            "animation-album-spin -translate-y-1/2 rounded-[999px]": !isPlaying,
          }
        )}
      >
        <Image
          alt="Album cover"
          className="object-cover"
          fill
          sizes="(max-width: 400px) 100vw, 400px"
          src="./assets/album.png"
        />
        <div
          className={cn(
            "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-opacity duration-1000",
            {
              "opacity-0": isPlaying,
            }
          )}
        >
          <div className="absolute z-[10] size-12 rounded-full bg-gray-400" />
          <div className="absolute z-[9] size-14 rounded-full bg-gray-100" />
          <div className="absolute z-[8] size-20 rounded-full bg-gray-400" />
          <div className="absolute z-[7] size-[94px] rounded-full bg-gray-500" />
          <div className="absolute z-[6] size-24 rounded-full bg-white" />
        </div>
      </div>
    </button>
  );
};

function App() {
  return (
    <AlbumBlock />
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
