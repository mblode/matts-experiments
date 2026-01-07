// CodePen packages: @radix-ui/react-slot@^1.2.4, class-variance-authority@^0.7.1, clsx@^2.1.1, lucide-react@^0.562.0, react-dom@19.2.3, react@19.2.3, tailwind-merge@^3.4.0

import * as React from "react";
import { SVGProps, forwardRef, type ButtonHTMLAttributes } from "react";
import { ArrowUpRightIcon } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
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

const NextImage = Image;

interface Props {
  locationLabel?: string;
  title?: string;
}

const AbsoluteMapLabel = ({ locationLabel, title }: Props) => {
  let mainText: string | null = null;
  let subText: string | null = null;

  if (locationLabel) {
    const locationLabelParts = locationLabel
      .split(",")
      .map((item) => item.trim());

    if (locationLabelParts.length > 3) {
      // When address is complete, display place or street level / region
      const [, regionLevel, , placeLevel] = locationLabelParts.reverse();
      mainText = placeLevel;
      subText = regionLevel;
    } else if (locationLabelParts.length === 3) {
      const [streetLevel, regionLevel] = locationLabelParts;
      mainText = streetLevel;
      subText = regionLevel;
    } else if (locationLabelParts.length === 2) {
      const [regionLevel, countryLevel] = locationLabelParts;
      mainText = regionLevel;
      subText = countryLevel;
    } else {
      const [countryLevel] = locationLabelParts;
      mainText = countryLevel;
      subText = "";
    }
  }

  return (
    <div className="absolute bottom-0 left-0 flex w-full flex-col items-start justify-start bg-linear-to-b from-transparent to-black/60 p-4">
      {(title || mainText) && (
        <span className="page-heading line-clamp-2 text-lg text-white!">
          {title || mainText}
        </span>
      )}

      {subText && <span className="text-white">{subText}</span>}
    </div>
  );
};

interface Props {
  size: number;
  pulsating: boolean;
}

const CustomMapDot = ({ size, pulsating }: Props) => {
  return (
    <div
      className="relative h-full w-full"
      style={{ width: size, height: size }}
    >
      {pulsating && (
        <div
          className="absolute top-1/2 left-1/2 h-3 w-3 rounded-full bg-[#679BFF] opacity-20"
          style={{
            animation: "pulse-map 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
      )}
      <div className="relative flex h-full w-full items-center justify-center rounded-full bg-white shadow-xl">
        <div className="absolute inset-[3px] rounded-full bg-[#679BFF]" />
        <div className="absolute inset-[3px] rounded-full border border-white/20" />
        <div className="absolute inset-[5px] rounded-full bg-[#679BFF]" />
      </div>
    </div>
  );
};

const CustomMapDotRadar = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      aria-label="Map location indicator"
      fill="none"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Map location indicator</title>
      <g transform="translate(200,200)">
        <circle className="drop-shadow-lg" cx={0} cy={0} fill="#fff" r={50} />
        <circle
          className="drop-shadow-sm"
          cx={0}
          cy={0}
          fill="#147aff"
          r={36}
        />
        <circle cx={0} cy={0} id="map-radar" r={30} />
      </g>
    </svg>
  );
};

interface Props {
  size?: number;
  strokeWidth?: number;
}

const Spinner = ({ size = 48, strokeWidth = 2 }: Props) => {
  return (
    <div className="flex items-center justify-center">
      <svg
        aria-label="Loading spinner"
        height={size}
        role="img"
        stroke="currentColor"
        viewBox="0 0 40 40"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          fill="none"
          fillRule="evenodd"
          strokeWidth={strokeWidth}
          transform="translate(2 2)"
        >
          <circle cx={18} cy={18} r={18} strokeOpacity={0.3} />
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              dur="1s"
              from="0 18 18"
              repeatCount="indefinite"
              to="360 18 18"
              type="rotate"
            />
          </path>
        </g>
      </svg>
    </div>
  );
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

const secondaryNavbarClassName =
  "hover:bg-gray-200 active:bg-gray-300 dark:border-gray-700 dark:hover:bg-gray-750 dark:active:bg-gray-700";

const buttonVariants = cva(
  "relative inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap font-bold font-sans text-base transition-[color,background-color,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground hover:bg-gray-700 active:bg-gray-800 dark:active:bg-gray-200 dark:hover:bg-gray-100",
        secondary:
          "border border-gray-200 text-foreground hover:bg-gray-100 active:bg-gray-200 dark:border-gray-700 dark:active:bg-gray-700 dark:hover:bg-gray-700",
        muted:
          "border border-gray-100 bg-gray-100 text-foreground hover:border-gray-200 hover:bg-gray-200 active:border-gray-300 active:bg-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:active:border-gray-600 dark:active:bg-gray-600 dark:hover:border-gray-700 dark:hover:bg-gray-700",
        ghost:
          "text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:active:bg-gray-700 dark:hover:bg-gray-800",
        input:
          "border border-input bg-input font-normal! text-base text-foreground focus:border-ring focus:border-ring focus:outline-hidden focus:ring-2 focus:ring-ring/15 focus:ring-offset-1 focus:ring-offset-background",
        link: "border border-transparent text-primary underline-offset-4 hover:underline",
        destructive:
          "border-red-600 bg-red-500 text-white hover:bg-red-600 active:bg-red-700 dark:bg-red-500 dark:active:bg-red-300 dark:hover:bg-red-400",
        destructiveSecondary:
          "border border-red-200 text-red-600 hover:bg-red-100 active:bg-red-200 dark:border-red-700 dark:text-red-300 dark:active:bg-red-800 dark:hover:bg-red-900",
        success:
          "border-green-600 bg-green-500 text-white hover:bg-green-600 active:bg-green-700 dark:bg-green-500 dark:active:bg-green-300 dark:hover:bg-green-400",
        successSecondary:
          "border border-green-200 text-green-600 hover:bg-green-100 active:bg-green-200 dark:border-green-700 dark:text-green-300 dark:active:bg-green-800 dark:hover:bg-green-900",
        warning:
          "border-yellow-600 bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 dark:bg-yellow-500 dark:active:bg-yellow-300 dark:hover:bg-yellow-400",
        warningSecondary:
          "border border-yellow-200 text-yellow-600 hover:bg-yellow-100 active:bg-yellow-200 dark:border-yellow-700 dark:text-yellow-300 dark:active:bg-yellow-800 dark:hover:bg-yellow-900",
        info: "border-blue-600 bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-500 dark:active:bg-blue-300 dark:hover:bg-blue-400",
        infoSecondary:
          "border border-blue-200 text-blue-600 hover:bg-blue-100 active:bg-blue-200 dark:border-blue-700 dark:text-blue-300 dark:active:bg-blue-800 dark:hover:bg-blue-900",
        blockPrimary:
          "border-page-primary-button bg-page-primary-button-background font-page-body! font-page-primary-button-weight text-page-primary-button-text shadow-page-primary-button backdrop-blur-page-primary-button hover:opacity-80",
        blockSecondary:
          "border-page-secondary-button bg-page-secondary-button-background font-page-body! font-page-secondary-button-weight text-page-secondary-button-text shadow-page-secondary-button backdrop-blur-page-secondary-button hover:opacity-80",
      },
      size: {
        lg: "h-12 rounded px-6 py-3",
        default: "h-10 rounded px-4 py-2",
        sm: "h-9 rounded px-4 py-2 text-sm",
        xs: "h-[30px] rounded px-2 text-xs",
        icon: "size-9",
        block: "h-12 shrink-0 rounded-page-widget-block px-4 py-2 text-base",
        blockSm: "h-8 shrink-0 rounded-page-widget-block px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, asChild = false, disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    if (loading) {
      const { children, ...restProps } = props;

      return (
        <button
          className={cn(
            buttonVariants({ variant, size, className }),
            "cursor-wait"
          )}
          disabled={true}
          ref={ref}
          {...restProps}
        >
          <span
            className="invisible opacity-0"
            data-testid="button-is-loading-children"
          >
            {children}
          </span>

          <span
            className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2"
            data-testid="button-is-loading"
          >
            <Spinner size={20} strokeWidth={4} />
          </span>
        </button>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const ButtonDiv = ({
  className,
  variant,
  size,
  loading,
  children,
  style,
  disabled,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={cn("truncate", buttonVariants({ variant, size, className }), {
        "cursor-wait": loading,
        "pointer-events-none opacity-50": disabled || loading,
      })}
      disabled={disabled || loading}
      onClick={loading ? undefined : onClick}
      style={style}
      type="button"
    >
      {loading ? (
        <span
          className="invisible opacity-0"
          data-testid="button-is-loading-children"
        >
          {children}
        </span>
      ) : (
        children
      )}

      {loading && (
        <span
          className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2"
          data-testid="button-is-loading"
        >
          <Spinner size={20} strokeWidth={4} />
        </span>
      )}
    </button>
  );
};

interface Props {
  lng: number;
  lat: number;
  size: "small" | "medium" | "large";
}

const GetDirectionsButton = ({ lng, lat, size }: Props) => {
  const handleGetDirections = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <Button
      className={cn(
        `relative before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:bg-page-background before:content-[''] after:absolute after:inset-0 after:z-[2] after:rounded-[inherit] after:bg-[var(--page-widget-background)] after:content-['']`,
        {
          "h-auto! p-1!": size === "small",
        }
      )}
      onClick={handleGetDirections}
    >
      {size !== "small" && <span className="z-[3]">Directions</span>}
      <ArrowUpRightIcon
        className={cn("z-[3] size-4", {
          "ml-2": size !== "small",
        })}
      />
    </Button>
  );
};

const MapBlock = () => {
  const lat = -37.894_456_515_024_59;
  const lng = 145.030_400_046_927_2;
  const zoom = 8;

  const WIDTH = 400;
  const HEIGHT = 400;

  return (
    <a
      className="relative block w-full max-w-[400px] overflow-hidden rounded-3xl bg-white"
      href="https://www.google.com/maps/place/Melbourne+VIC/data=!4m2!3m1!1s0x6ad646b5d2ba4df7:0x4045675218ccd90?sa=X&ved=1t:242&ictx=111"
      rel="noopener"
      style={{
        height: HEIGHT,
      }}
      target="_blank"
    >
      {/* Map Image */}
      <NextImage
        alt="Melbourne"
        className="size-full object-cover"
        height={HEIGHT}
        src={`https://api.mapbox.com/styles/v1/matthewblode/clix8w21k00ux01qi5r472wau/static/${lng},${lat},${zoom},0/${WIDTH}x${HEIGHT}@2x?access_token=pk.eyJ1IjoibWF0dGhld2Jsb2RlIiwiYSI6ImNsaXg4dXZnODA0c3Uzc2wyNmNncTlibzkifQ.s4oJ2Ha9_yYNFf7vGOXvXg&logo=false&attribution=false`}
        width={WIDTH}
      />

      {/* Title, Address Labels */}
      <AbsoluteMapLabel title="Melbourne" />

      {/* Fixed Map Pin Icon */}
      <div className="absolute top-1/2 left-1/2 flex size-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <CustomMapDot pulsating={true} size={28} />
      </div>

      {/* Get Directions Button */}
      <div className="absolute top-0 right-0 flex p-4">
        <GetDirectionsButton lat={lat} lng={lng} size="large" />
      </div>
    </a>
  );
};

function App() {
  return (
    <MapBlock />
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
