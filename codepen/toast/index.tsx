// CodePen packages: @radix-ui/react-slot@^1.2.4, class-variance-authority@^0.7.1, clsx@^2.1.1, motion@^12.23.26, react-dom@19.2.3, react@19.2.3, tailwind-merge@^3.4.0

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { createContext, forwardRef, type ButtonHTMLAttributes, useLayoutEffect, useRef, useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createRoot } from "react-dom/client";

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

interface DynamicIslandContextType {
  state: string;
  setState: (state: string) => void;
}

const ToastLoadingContext = createContext<DynamicIslandContextType>({
  state: "idle",
  setState: () => undefined,
});

function PendingView() {
  return (
    <div className="flex h-[48px] items-center justify-center gap-2.5 rounded-full bg-[#E5F3FF] px-5">
      <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center">
        <svg
          className="animate-spin"
          fill="none"
          height="20"
          viewBox="0 0 20 20"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Loading</title>
          <circle
            cx="10"
            cy="10"
            r="7"
            stroke="#4EAFFF"
            strokeDasharray="32"
            strokeDashoffset="8"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </svg>
      </div>
      <span className="whitespace-nowrap font-semibold text-[#4EAFFF] text-base">
        Loading...
      </span>
    </div>
  );
}

function ErrorView() {
  return (
    <div className="flex h-[48px] items-center justify-center gap-2.5 rounded-full bg-[#FFE4E3] px-5">
      <motion.div
        animate={{
          x: [0, -3, 2.5, -2, 1.5, -1, 0],
        }}
        className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center"
        initial={{ x: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.35,
          ease: "easeInOut",
        }}
      >
        <svg
          fill="none"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Error</title>
          <path
            clipRule="evenodd"
            d="M8.6026 4.07088C10.1677 1.5532 13.8318 1.5532 15.3969 4.07088L21.4996 13.8884C23.156 16.5529 21.2399 20.0001 18.1025 20.0001H5.89699C2.75962 20.0001 0.843525 16.5529 2.49985 13.8884L8.6026 4.07088ZM12 8C12.5523 8 13 8.44771 13 9V12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12V9C11 8.44771 11.4477 8 12 8ZM10.75 15C10.75 14.3096 11.3096 13.75 12 13.75C12.6904 13.75 13.25 14.3096 13.25 15C13.25 15.6904 12.6904 16.25 12 16.25C11.3096 16.25 10.75 15.6904 10.75 15Z"
            fill="#FF403F"
            fillRule="evenodd"
          />
        </svg>
      </motion.div>
      <span className="whitespace-nowrap font-semibold text-[#FF403F] text-base">
        Error occurred
      </span>
    </div>
  );
}

function SuccessView() {
  return (
    <div className="flex h-[48px] items-center justify-center gap-2.5 rounded-full bg-[#DBF4DE] px-5">
      <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center">
        <svg
          fill="none"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Success</title>
          <path
            clipRule="evenodd"
            d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.774 10.1333C16.1237 9.70582 16.0607 9.0758 15.6332 8.72607C15.2058 8.37635 14.5758 8.43935 14.226 8.86679L10.4258 13.5116L9.20711 12.2929C8.81658 11.9024 8.18342 11.9024 7.79289 12.2929C7.40237 12.6834 7.40237 13.3166 7.79289 13.7071L9.79289 15.7071C9.99267 15.9069 10.2676 16.0129 10.5498 15.9988C10.832 15.9847 11.095 15.8519 11.274 15.6333L15.774 10.1333Z"
            fill="#35C759"
            fillRule="evenodd"
          />
        </svg>
      </div>
      <span className="whitespace-nowrap font-semibold text-[#35C759] text-base">
        Success!
      </span>
    </div>
  );
}

interface TransitionVariant {
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  y?: number;
}

const transitionVariants: Record<string, TransitionVariant> = {
  "ring-mode-idle": { scale: 0.9, scaleX: 0.9 },
  "timer-ring-mode": { scale: 0.7, y: -7.5 },
  "ring-mode-timer": { scale: 1.4, y: 7.5 },
  "timer-listening": { scaleY: 1.1, y: 7.5 },
  "listening-ring-mode": { scale: 0.65, y: -32 },
  "ring-mode-listening": { scale: 1.5, y: 12.5 },
  "timer-idle": { scale: 0.7, y: -7.5 },
  "listening-timer": { scaleY: 0.9, y: -12 },
  "listening-idle": { scale: 0.4, y: -36 },
  "idle-ring-mode": { scale: 0.9, scaleX: 0.9 },
  "idle-timer": { scale: 0.7, y: -7.5 },
  "idle-listening": { scale: 0.4, y: -36 },
};

const ToastLoading = () => {
  const [state, setState] = useState("idle");
  const [transition, setTransition] = useState<TransitionVariant>();
  const [bounceValue, setBounceValue] = useState(1);
  const [previousHeight, setPreviousHeight] = useState(28);
  const contentRef = useRef<HTMLDivElement>(null);

  function renderContent() {
    switch (state) {
      case "error":
        return <ErrorView />;
      case "success":
        return <SuccessView />;
      default:
        return <PendingView />;
    }
  }

  useLayoutEffect(() => {
    const element = contentRef.current;
    if (element) {
      const { height } = element.getBoundingClientRect();
      const heightDifference = Math.abs(height - previousHeight);
      const ratio = heightDifference / 100;

      let bounce =
        height < previousHeight ? 0.35 - 0.3 * ratio : 0.3 + 0.3 * ratio;
      bounce = Math.min(Math.max(bounce, 0.3), 0.35);

      if (heightDifference < 20) {
        bounce = 0.5;
      }

      setPreviousHeight(height);
      setBounceValue(bounce);
    }
  }, [previousHeight]);

  const handleStateChange = (newState: string) => {
    const transitionKey = `${state}-${newState}`;
    setTransition(transitionVariants[transitionKey]);
    setState(newState);
  };

  return (
    <ToastLoadingContext.Provider value={{ state, setState }}>
      <div className="flex h-[400px] w-full items-center justify-center border border-border bg-white">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <motion.div
              className="min-w-[100px] overflow-hidden rounded-full"
              layout
              style={{ borderRadius: "9999px" }}
              transition={{
                type: "spring",
                bounce: bounceValue,
              }}
            >
              <motion.div
                animate={{
                  scale: 1,
                  opacity: 1,
                  originX: 0.5,
                  originY: 0.5,
                  transition: { delay: 0.05 },
                }}
                initial={{
                  scale: 0.9,
                  opacity: 0,
                  originX: 0.5,
                  originY: 0.5,
                }}
                key={state}
                ref={contentRef}
                transition={{
                  type: "spring",
                  bounce: bounceValue,
                }}
              >
                {renderContent()}
              </motion.div>
            </motion.div>

            <div className="pointer-events-none absolute top-0 left-1/2 flex h-[200px] w-[300px] -translate-x-1/2 items-start justify-center">
              <AnimatePresence custom={transition} mode="popLayout">
                <motion.div
                  exit="exit"
                  initial={{ opacity: 0 }}
                  key={`${state}second`}
                  variants={{
                    exit: (custom: TransitionVariant | undefined) => ({
                      ...(custom ?? {}),
                      opacity: [1, 0],
                    }),
                  }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => handleStateChange("pending")}>
              Pending
            </Button>
            <Button onClick={() => handleStateChange("error")}>Error</Button>
            <Button onClick={() => handleStateChange("success")}>
              Success
            </Button>
          </div>
        </div>
      </div>
    </ToastLoadingContext.Provider>
  );
};

const ToastBlock = () => {
  return (
    <div>
      <ToastLoading />
    </div>
  );
};

function App() {
  return (
    <ToastBlock />
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
