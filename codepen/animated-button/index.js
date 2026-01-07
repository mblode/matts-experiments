import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createRoot } from "react-dom/client";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function getSvgPathFromStroke(stroke) {
  if (!stroke.length) {
    return "";
  }
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );
  d.push("Z");
  return d.join(" ");
}
const imageLoader = ({
  src,
  width,
  quality
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
  cropH
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
const AnimatedSubscribeButton = React.forwardRef(({ subscribeStatus, onClick, className, children, ...props }, ref) => {
  const isControlled = subscribeStatus !== void 0;
  const [isSubscribed, setIsSubscribed] = useState(
    subscribeStatus ?? false
  );
  useEffect(() => {
    if (isControlled && subscribeStatus !== void 0) {
      setIsSubscribed(subscribeStatus);
    }
  }, [subscribeStatus, isControlled]);
  if (React.Children.count(children) !== 2 || !React.Children.toArray(children).every(
    (child) => React.isValidElement(child) && child.type === "span"
  )) {
    throw new Error(
      "AnimatedSubscribeButton expects two children, both of which must be <span> elements."
    );
  }
  const childrenArray = React.Children.toArray(children);
  const initialChild = childrenArray[0];
  const changeChild = childrenArray[1];
  return /* @__PURE__ */ React.createElement(AnimatePresence, { mode: "wait" }, isSubscribed ? /* @__PURE__ */ React.createElement(
    motion.button,
    {
      animate: { opacity: 1 },
      className: cn(
        "relative flex h-10 w-fit items-center justify-center overflow-hidden rounded-lg bg-primary px-6 text-primary-foreground",
        className
      ),
      exit: { opacity: 0 },
      initial: { opacity: 0 },
      onClick: (e) => {
        if (!isControlled) {
          setIsSubscribed(false);
        }
        onClick?.(e);
      },
      ref,
      ...props
    },
    /* @__PURE__ */ React.createElement(
      motion.span,
      {
        animate: { y: 0 },
        className: "relative flex h-full w-full items-center justify-center font-semibold",
        initial: { y: -50 },
        key: "action"
      },
      changeChild,
      " "
    )
  ) : /* @__PURE__ */ React.createElement(
    motion.button,
    {
      animate: { opacity: 1 },
      className: cn(
        "relative flex h-10 w-fit cursor-pointer items-center justify-center rounded-lg border-none bg-primary px-6 text-primary-foreground",
        className
      ),
      exit: { opacity: 0 },
      initial: { opacity: 0 },
      onClick: (e) => {
        if (!isControlled) {
          setIsSubscribed(true);
        }
        onClick?.(e);
      },
      ref,
      ...props
    },
    /* @__PURE__ */ React.createElement(
      motion.span,
      {
        className: "relative flex items-center justify-center font-semibold",
        exit: { x: 50, transition: { duration: 0.1 } },
        initial: { x: 0 },
        key: "reaction"
      },
      initialChild,
      " "
    )
  ));
});
AnimatedSubscribeButton.displayName = "AnimatedSubscribeButton";
const AnimatedButtonBlock = () => {
  return /* @__PURE__ */ React.createElement(AnimatedSubscribeButton, { className: "w-36" }, /* @__PURE__ */ React.createElement("span", { className: "group inline-flex items-center" }, "Follow", /* @__PURE__ */ React.createElement(ChevronRightIcon, { className: "ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" })), /* @__PURE__ */ React.createElement("span", { className: "group inline-flex items-center" }, /* @__PURE__ */ React.createElement(CheckIcon, { className: "mr-2 size-4" }), "Subscribed"));
};
function App() {
  return /* @__PURE__ */ React.createElement(AnimatedButtonBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
