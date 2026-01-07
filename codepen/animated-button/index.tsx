// CodePen packages: clsx@^2.1.1, lucide-react@^0.562.0, motion@^12.23.26, react-dom@19.2.3, react@19.2.3, tailwind-merge@^3.4.0

import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import * as React from "react";
import React, { useEffect, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createRoot } from "react-dom/client";

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

interface AnimatedSubscribeButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref"> {
  subscribeStatus?: boolean;
  children: React.ReactNode;
  className?: string;
}

const AnimatedSubscribeButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedSubscribeButtonProps
>(({ subscribeStatus, onClick, className, children, ...props }, ref) => {
  const isControlled = subscribeStatus !== undefined; // controlled vs uncontrolled check
  const [isSubscribed, setIsSubscribed] = useState<boolean>(
    subscribeStatus ?? false
  );

  useEffect(() => {
    if (isControlled && subscribeStatus !== undefined) {
      setIsSubscribed(subscribeStatus);
    }
  }, [subscribeStatus, isControlled]);

  if (
    React.Children.count(children) !== 2 ||
    !React.Children.toArray(children).every(
      (child) => React.isValidElement(child) && child.type === "span"
    )
  ) {
    throw new Error(
      "AnimatedSubscribeButton expects two children, both of which must be <span> elements."
    );
  }

  const childrenArray = React.Children.toArray(children);
  const initialChild = childrenArray[0];
  const changeChild = childrenArray[1];

  return (
    <AnimatePresence mode="wait">
      {isSubscribed ? (
        <motion.button
          animate={{ opacity: 1 }}
          className={cn(
            "relative flex h-10 w-fit items-center justify-center overflow-hidden rounded-lg bg-primary px-6 text-primary-foreground",
            className
          )}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            if (!isControlled) {
              setIsSubscribed(false); // Only toggle manually if uncontrolled
            }
            onClick?.(e);
          }}
          ref={ref}
          {...props}
        >
          <motion.span
            animate={{ y: 0 }}
            className="relative flex h-full w-full items-center justify-center font-semibold"
            initial={{ y: -50 }}
            key="action"
          >
            {changeChild} {/* Use children for subscribed state */}
          </motion.span>
        </motion.button>
      ) : (
        <motion.button
          animate={{ opacity: 1 }}
          className={cn(
            "relative flex h-10 w-fit cursor-pointer items-center justify-center rounded-lg border-none bg-primary px-6 text-primary-foreground",
            className
          )}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={(e) => {
            if (!isControlled) {
              setIsSubscribed(true); // Only toggle manually if uncontrolled
            }
            onClick?.(e);
          }}
          ref={ref}
          {...props}
        >
          <motion.span
            className="relative flex items-center justify-center font-semibold"
            exit={{ x: 50, transition: { duration: 0.1 } }}
            initial={{ x: 0 }}
            key="reaction"
          >
            {initialChild} {/* Use children for unsubscribed state */}
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
});

AnimatedSubscribeButton.displayName = "AnimatedSubscribeButton";

const AnimatedButtonBlock = () => {
  return (
    <AnimatedSubscribeButton className="w-36">
      <span className="group inline-flex items-center">
        Follow
        <ChevronRightIcon className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
      <span className="group inline-flex items-center">
        <CheckIcon className="mr-2 size-4" />
        Subscribed
      </span>
    </AnimatedSubscribeButton>
  );
};

function App() {
  return (
    <AnimatedButtonBlock />
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
