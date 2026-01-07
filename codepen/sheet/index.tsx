// CodePen packages: @radix-ui/react-slot@^1.2.4, class-variance-authority@^0.7.1, clsx@^2.1.1, lucide-react@^0.562.0, motion@^12.23.26, react-dom@19.2.3, react@19.2.3, tailwind-merge@^3.4.0, vaul@^1.1.2

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import React, { forwardRef, type ButtonHTMLAttributes, useLayoutEffect, useRef, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AlertTriangle, Ban, Eye, Grid3x3, Lock, ScanFace, Shield, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Drawer } from "vaul";
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

interface MultiStageSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

// Custom hook to measure element height
function useMeasure() {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(ref.current);
      setHeight(ref.current.getBoundingClientRect().height);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  return [ref, height] as const;
}

// Animation variants matching Vaul's style
const contentVariants = {
  initial: {
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  hidden: (custom: string) => {
    const base = {
      opacity: 0,
      scale: 0.96,
    };

    // Faster exit for remove stage
    if (custom === "remove") {
      return {
        ...base,
        transition: {
          ease: [0.26, 0.08, 0.25, 1] as [number, number, number, number],
          duration: 0.15,
        },
      };
    }

    return base;
  },
};

function MultiStageSheet({
  open: controlledOpen,
  onOpenChange,
  trigger,
}: MultiStageSheetProps) {
  const [stage, setStage] = useState<"default" | "phrase" | "key" | "remove">(
    "default"
  );
  const [localOpen, setLocalOpen] = useState(false);
  const [contentRef, contentHeight] = useMeasure();

  // Use controlled open if provided, otherwise use local state
  const isOpen = controlledOpen !== undefined ? controlledOpen : localOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setLocalOpen(newOpen);
    }
    onOpenChange?.(newOpen);

    // Reset stage after closing animation
    if (!newOpen) {
      setTimeout(() => setStage("default"), 300);
    }
  };

  // Calculate height based on stage
  const getHeight = () => {
    switch (stage) {
      case "default":
        return 290;
      case "remove":
        return 312;
      case "phrase":
        return 465;
      case "key":
        return 441;
      default:
        return contentHeight || 500;
    }
  };

  const handleStageChange = (newStage: typeof stage) => {
    setStage(newStage);
  };

  return (
    <Drawer.Root
      modal={true}
      onOpenChange={handleOpenChange}
      open={isOpen}
      shouldScaleBackground
    >
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}

      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 bg-black/30"
          style={{ zIndex: 9998 }}
        />
        <Drawer.Content asChild>
          <motion.div
            animate={{
              height: getHeight(),
              transition: {
                duration: 0.27,
                ease: [0.25, 1, 0.5, 1],
              },
            }}
            className="fixed inset-x-4 bottom-4 mx-auto max-w-[361px] overflow-hidden rounded-[36px] bg-white outline-none md:mx-auto md:w-full"
            initial={false}
            style={{ zIndex: 9999 }}
          >
            <div className="px-6 pt-2.5 pb-6" ref={contentRef}>
              {/* Close button */}
              <Drawer.Close asChild>
                <motion.button
                  animate={{
                    top: stage === "default" ? 28 : 32,
                    right: stage === "default" ? 28 : 32,
                  }}
                  aria-label="Close"
                  className="absolute z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-transform hover:bg-gray-200 focus:scale-95 active:scale-75"
                  initial={false}
                  transition={{
                    ease: [0.25, 1, 0.5, 1],
                    duration: 0.27,
                  }}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </Drawer.Close>

              {/* Content with smooth opacity/scale transitions */}
              <AnimatePresence custom={stage} initial={false} mode="popLayout">
                {stage === "default" && (
                  <motion.div
                    animate="visible"
                    exit="hidden"
                    initial="initial"
                    key="default"
                    transition={{
                      ease: [0.26, 0.08, 0.25, 1] as [
                        number,
                        number,
                        number,
                        number,
                      ],
                      duration: 0.22,
                    }}
                    variants={contentVariants}
                  >
                    <header className="mb-4 flex h-[72px] items-center border-gray-100 border-b pl-2">
                      <h2 className="font-semibold text-[19px] text-gray-900">
                        Options
                      </h2>
                    </header>

                    <div className="space-y-3">
                      <button
                        className="flex h-12 w-full items-center gap-3 rounded-2xl bg-gray-100 px-4 text-left font-semibold text-[17px] text-gray-900 transition-transform hover:bg-gray-200 focus:scale-95 active:scale-[0.98]"
                        onClick={() => handleStageChange("key")}
                        type="button"
                      >
                        <Lock className="h-5 w-5 text-gray-600" />
                        View Private Key
                      </button>

                      <button
                        className="flex h-12 w-full items-center gap-3 rounded-2xl bg-gray-100 px-4 text-left font-semibold text-[17px] text-gray-900 transition-transform hover:bg-gray-200 focus:scale-95 active:scale-[0.98]"
                        onClick={() => handleStageChange("phrase")}
                        type="button"
                      >
                        <Grid3x3 className="h-5 w-5 text-gray-600" />
                        View Recovery Phrase
                      </button>

                      <button
                        className="flex h-12 w-full items-center gap-3 rounded-2xl bg-red-50 px-4 text-left font-semibold text-[17px] text-red-500 transition-transform hover:bg-red-100 focus:scale-95 active:scale-[0.98]"
                        onClick={() => handleStageChange("remove")}
                        type="button"
                      >
                        <AlertTriangle className="h-5 w-5" />
                        Remove Wallet
                      </button>
                    </div>
                  </motion.div>
                )}

                {stage === "phrase" && (
                  <motion.div
                    animate="visible"
                    custom={stage}
                    exit="hidden"
                    initial="initial"
                    key="phrase"
                    transition={{
                      ease: [0.26, 0.08, 0.25, 1] as [
                        number,
                        number,
                        number,
                        number,
                      ],
                      duration: 0.27,
                    }}
                    variants={contentVariants}
                  >
                    <div className="px-2">
                      <header className="mt-[21px] border-gray-100 border-b pb-6">
                        <div className="mb-4 flex justify-center">
                          <Eye className="h-12 w-12 text-gray-500" />
                        </div>
                        <h2 className="font-semibold text-[22px] text-gray-900">
                          Secret Recovery Phrase
                        </h2>
                        <p className="mt-3 text-[17px] text-gray-500 leading-[24px]">
                          Your Secret Recovery Phrase is the key used to back up
                          your wallet. Keep it secret at all times.
                        </p>
                      </header>

                      <ul className="mt-6 space-y-4">
                        <li className="flex items-center gap-3 font-medium text-[15px] text-gray-600">
                          <Shield className="h-6 w-6 text-gray-400" />
                          Keep your Secret Phrase safe
                        </li>
                        <li className="flex items-center gap-3 font-medium text-[15px] text-gray-600">
                          <Grid3x3 className="h-6 w-6 text-gray-400" />
                          Don't share it with anyone else
                        </li>
                        <li className="flex items-center gap-3 font-medium text-[15px] text-gray-600">
                          <Ban className="h-6 w-6 text-gray-400" />
                          If you lose it, we can't recover it
                        </li>
                      </ul>
                    </div>

                    <div className="mt-7 flex gap-4">
                      <button
                        className="flex h-12 w-full items-center justify-center rounded-full bg-gray-100 font-semibold text-[19px] text-gray-900 transition-transform hover:bg-gray-200 focus:scale-95 active:scale-[0.98]"
                        onClick={() => handleStageChange("default")}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-500 font-semibold text-[19px] text-white transition-transform hover:bg-blue-600 focus:scale-95 active:scale-[0.98]"
                        type="button"
                      >
                        <ScanFace className="h-5 w-5" />
                        Reveal
                      </button>
                    </div>
                  </motion.div>
                )}

                {stage === "key" && (
                  <motion.div
                    animate="visible"
                    custom={stage}
                    exit="hidden"
                    initial="initial"
                    key="key"
                    transition={{
                      ease: [0.26, 0.08, 0.25, 1] as [
                        number,
                        number,
                        number,
                        number,
                      ],
                      duration: 0.27,
                    }}
                    variants={contentVariants}
                  >
                    <div className="px-2">
                      <header className="mt-[21px] border-gray-100 border-b pb-6">
                        <div className="mb-4 flex justify-center">
                          <Lock className="h-12 w-12 text-gray-500" />
                        </div>
                        <h2 className="font-semibold text-[22px] text-gray-900">
                          Private Key
                        </h2>
                        <p className="mt-3 text-[17px] text-gray-500 leading-[24px]">
                          Your Private Key is used to access your wallet. Never
                          share it with anyone.
                        </p>
                      </header>

                      <ul className="mt-6 space-y-4">
                        <li className="flex items-center gap-3 font-medium text-[15px] text-gray-600">
                          <Shield className="h-6 w-6 text-gray-400" />
                          Keep your private key secure
                        </li>
                        <li className="flex items-center gap-3 font-medium text-[15px] text-gray-600">
                          <Lock className="h-6 w-6 text-gray-400" />
                          Never share it online
                        </li>
                        <li className="flex items-center gap-3 font-medium text-[15px] text-gray-600">
                          <Ban className="h-6 w-6 text-gray-400" />
                          Store it in a safe place
                        </li>
                      </ul>
                    </div>

                    <div className="mt-7 flex gap-4">
                      <button
                        className="flex h-12 w-full items-center justify-center rounded-full bg-gray-100 font-semibold text-[19px] text-gray-900 transition-transform hover:bg-gray-200 focus:scale-95 active:scale-[0.98]"
                        onClick={() => handleStageChange("default")}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-500 font-semibold text-[19px] text-white transition-transform hover:bg-blue-600 focus:scale-95 active:scale-[0.98]"
                        type="button"
                      >
                        <Eye className="h-5 w-5" />
                        View Key
                      </button>
                    </div>
                  </motion.div>
                )}

                {stage === "remove" && (
                  <motion.div
                    animate="visible"
                    custom={stage}
                    exit="hidden"
                    initial="initial"
                    key="remove"
                    transition={{
                      ease: [0.26, 0.08, 0.25, 1] as [
                        number,
                        number,
                        number,
                        number,
                      ],
                      duration: stage === "remove" ? 0.15 : 0.27,
                    }}
                    variants={contentVariants}
                  >
                    <div className="px-2">
                      <header className="mt-[21px]">
                        <div className="mb-4 flex justify-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                          </div>
                        </div>
                        <h2 className="text-center font-semibold text-[22px] text-gray-900">
                          Are you sure?
                        </h2>
                      </header>
                      <p className="mt-3 text-center text-[17px] text-gray-500 leading-[24px]">
                        You haven't backed up your wallet yet. If you remove it,
                        you could lose access forever.
                      </p>
                    </div>

                    <div className="mt-7 flex gap-4">
                      <button
                        className="flex h-12 w-full items-center justify-center rounded-full bg-gray-100 font-semibold text-[19px] text-gray-900 transition-transform hover:bg-gray-200 focus:scale-95 active:scale-[0.98]"
                        onClick={() => handleStageChange("default")}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="flex h-12 w-full items-center justify-center rounded-full bg-red-500 font-semibold text-[19px] text-white transition-transform hover:bg-red-600 focus:scale-95 active:scale-[0.98]"
                        type="button"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

const SheetBlock = () => {
  return (
    <div className="my-4">
      <MultiStageSheet trigger={<Button>Open multi-stage sheet</Button>} />
    </div>
  );
};

function App() {
  return (
    <SheetBlock />
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
