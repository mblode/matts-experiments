import { AnimatePresence, motion } from "motion/react";
import React, { createContext, forwardRef, memo, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createRoot } from "react-dom/client";
const Image = ({ fill, style, ...props }) => {
  const mergedStyle = fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style } : style;
  return /* @__PURE__ */ React.createElement("img", { style: mergedStyle, ...props });
};
const Spinner = ({ size = 48, strokeWidth = 2 }) => {
  return /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center" }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      "aria-label": "Loading spinner",
      height: size,
      role: "img",
      stroke: "currentColor",
      viewBox: "0 0 40 40",
      width: size,
      xmlns: "http://www.w3.org/2000/svg"
    },
    /* @__PURE__ */ React.createElement(
      "g",
      {
        fill: "none",
        fillRule: "evenodd",
        strokeWidth,
        transform: "translate(2 2)"
      },
      /* @__PURE__ */ React.createElement("circle", { cx: 18, cy: 18, r: 18, strokeOpacity: 0.3 }),
      /* @__PURE__ */ React.createElement("path", { d: "M36 18c0-9.94-8.06-18-18-18" }, /* @__PURE__ */ React.createElement(
        "animateTransform",
        {
          attributeName: "transform",
          dur: "1s",
          from: "0 18 18",
          repeatCount: "indefinite",
          to: "360 18 18",
          type: "rotate"
        }
      ))
    )
  ));
};
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
const secondaryNavbarClassName = "hover:bg-gray-200 active:bg-gray-300 dark:border-gray-700 dark:hover:bg-gray-750 dark:active:bg-gray-700";
const buttonVariants = cva(
  "relative inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap font-bold font-sans text-base transition-[color,background-color,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground hover:bg-gray-700 active:bg-gray-800 dark:active:bg-gray-200 dark:hover:bg-gray-100",
        secondary: "border border-gray-200 text-foreground hover:bg-gray-100 active:bg-gray-200 dark:border-gray-700 dark:active:bg-gray-700 dark:hover:bg-gray-700",
        muted: "border border-gray-100 bg-gray-100 text-foreground hover:border-gray-200 hover:bg-gray-200 active:border-gray-300 active:bg-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:active:border-gray-600 dark:active:bg-gray-600 dark:hover:border-gray-700 dark:hover:bg-gray-700",
        ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:active:bg-gray-700 dark:hover:bg-gray-800",
        input: "border border-input bg-input font-normal! text-base text-foreground focus:border-ring focus:border-ring focus:outline-hidden focus:ring-2 focus:ring-ring/15 focus:ring-offset-1 focus:ring-offset-background",
        link: "border border-transparent text-primary underline-offset-4 hover:underline",
        destructive: "border-red-600 bg-red-500 text-white hover:bg-red-600 active:bg-red-700 dark:bg-red-500 dark:active:bg-red-300 dark:hover:bg-red-400",
        destructiveSecondary: "border border-red-200 text-red-600 hover:bg-red-100 active:bg-red-200 dark:border-red-700 dark:text-red-300 dark:active:bg-red-800 dark:hover:bg-red-900",
        success: "border-green-600 bg-green-500 text-white hover:bg-green-600 active:bg-green-700 dark:bg-green-500 dark:active:bg-green-300 dark:hover:bg-green-400",
        successSecondary: "border border-green-200 text-green-600 hover:bg-green-100 active:bg-green-200 dark:border-green-700 dark:text-green-300 dark:active:bg-green-800 dark:hover:bg-green-900",
        warning: "border-yellow-600 bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 dark:bg-yellow-500 dark:active:bg-yellow-300 dark:hover:bg-yellow-400",
        warningSecondary: "border border-yellow-200 text-yellow-600 hover:bg-yellow-100 active:bg-yellow-200 dark:border-yellow-700 dark:text-yellow-300 dark:active:bg-yellow-800 dark:hover:bg-yellow-900",
        info: "border-blue-600 bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-500 dark:active:bg-blue-300 dark:hover:bg-blue-400",
        infoSecondary: "border border-blue-200 text-blue-600 hover:bg-blue-100 active:bg-blue-200 dark:border-blue-700 dark:text-blue-300 dark:active:bg-blue-800 dark:hover:bg-blue-900",
        blockPrimary: "border-page-primary-button bg-page-primary-button-background font-page-body! font-page-primary-button-weight text-page-primary-button-text shadow-page-primary-button backdrop-blur-page-primary-button hover:opacity-80",
        blockSecondary: "border-page-secondary-button bg-page-secondary-button-background font-page-body! font-page-secondary-button-weight text-page-secondary-button-text shadow-page-secondary-button backdrop-blur-page-secondary-button hover:opacity-80"
      },
      size: {
        lg: "h-12 rounded px-6 py-3",
        default: "h-10 rounded px-4 py-2",
        sm: "h-9 rounded px-4 py-2 text-sm",
        xs: "h-[30px] rounded px-2 text-xs",
        icon: "size-9",
        block: "h-12 shrink-0 rounded-page-widget-block px-4 py-2 text-base",
        blockSm: "h-8 shrink-0 rounded-page-widget-block px-4 py-2 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = forwardRef(
  ({ className, variant, size, loading, asChild = false, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    if (loading) {
      const { children, ...restProps } = props;
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          className: cn(
            buttonVariants({ variant, size, className }),
            "cursor-wait"
          ),
          disabled: true,
          ref,
          ...restProps
        },
        /* @__PURE__ */ React.createElement(
          "span",
          {
            className: "invisible opacity-0",
            "data-testid": "button-is-loading-children"
          },
          children
        ),
        /* @__PURE__ */ React.createElement(
          "span",
          {
            className: "absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2",
            "data-testid": "button-is-loading"
          },
          /* @__PURE__ */ React.createElement(Spinner, { size: 20, strokeWidth: 4 })
        )
      );
    }
    return /* @__PURE__ */ React.createElement(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        disabled,
        ref,
        ...props
      }
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
  onClick
}) => {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      className: cn("truncate", buttonVariants({ variant, size, className }), {
        "cursor-wait": loading,
        "pointer-events-none opacity-50": disabled || loading
      }),
      disabled: disabled || loading,
      onClick: loading ? void 0 : onClick,
      style,
      type: "button"
    },
    loading ? /* @__PURE__ */ React.createElement(
      "span",
      {
        className: "invisible opacity-0",
        "data-testid": "button-is-loading-children"
      },
      children
    ) : children,
    loading && /* @__PURE__ */ React.createElement(
      "span",
      {
        className: "absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2",
        "data-testid": "button-is-loading"
      },
      /* @__PURE__ */ React.createElement(Spinner, { size: 20, strokeWidth: 4 })
    )
  );
};
const DynamicIslandContext = createContext({
  state: "idle",
  setState: () => void 0
});
const springTransition = {
  type: "spring",
  bounce: 0.35
};
const useDynamicIsland = () => useContext(DynamicIslandContext);
const AudioBar = memo(function AudioBar2({
  baseLength = 50,
  paused
}) {
  const [animating, setAnimating] = useState(true);
  useEffect(() => {
    if (paused) {
      setAnimating(false);
    } else {
      const timer = setTimeout(() => {
        setAnimating(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [paused]);
  const generateHeights = (base) => {
    const heights = [];
    for (let i = 0; i < 5; i++) {
      heights.push(
        (Math.floor(Math.random() * 24) - 24) / 2 + base / 100 * 24
      );
    }
    heights.push(heights[0]);
    return heights;
  };
  let heightValue = baseLength / 5;
  if (paused) {
    heightValue = 1;
  } else if (animating) {
    heightValue = generateHeights(baseLength);
  }
  const transitionConfig = paused || !animating ? {
    duration: 0.3
  } : {
    duration: 1.1,
    ease: [0.42, 0, 0.58, 1],
    times: [0.2, 0.3, 0.5, 0.7, 1.1, 1.3, 1.7],
    repeat: Number.POSITIVE_INFINITY
  };
  return /* @__PURE__ */ React.createElement(
    motion.div,
    {
      animate: {
        height: heightValue
      },
      className: "col-span-1 mx-auto my-auto h-6 w-[1.25px] scale-125 rounded-full bg-gradient-to-t from-[#675470] to-[#395978]",
      transition: transitionConfig
    }
  );
});
function Timer({ className, paused }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (paused) {
          return prev;
        }
        return prev === 60 ? 0 : prev + 1;
      });
    }, 1e3);
    return () => clearInterval(interval);
  }, [paused]);
  const digits = seconds.toString().padStart(2, "0").split("");
  const digitSlots = [
    { slot: "tens", value: digits[0] ?? "0" },
    { slot: "ones", value: digits[1] ?? "0" }
  ];
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: cn("relative overflow-hidden whitespace-nowrap", className)
    },
    "0:",
    /* @__PURE__ */ React.createElement(AnimatePresence, { initial: false, mode: "popLayout" }, digitSlots.map(({ slot, value }) => /* @__PURE__ */ React.createElement(
      motion.div,
      {
        animate: {
          y: "0",
          filter: "blur(0px)",
          opacity: 1
        },
        className: "inline-block tabular-nums",
        exit: {
          y: "-12px",
          filter: "blur(2px)",
          opacity: 0
        },
        initial: {
          y: "12px",
          filter: "blur(2px)",
          opacity: 0
        },
        key: `${slot}-${value}`,
        transition: springTransition
      },
      value
    )))
  );
}
function PlayPauseButton({ initial, active, isActive }) {
  return /* @__PURE__ */ React.createElement(AnimatePresence, { initial: false, mode: "wait" }, isActive ? /* @__PURE__ */ React.createElement(
    motion.div,
    {
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.5 },
      initial: { opacity: 0, scale: 0.5 },
      key: "play",
      transition: { duration: 0.1, bounce: 0.4 }
    },
    active
  ) : /* @__PURE__ */ React.createElement(
    motion.div,
    {
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.5 },
      initial: { opacity: 0, scale: 0.5 },
      key: "pause",
      transition: { duration: 0.1, bounce: 0.4 }
    },
    initial
  ));
}
function TimerView() {
  const { setState } = useDynamicIsland();
  const [paused, setPaused] = useState(false);
  return /* @__PURE__ */ React.createElement("div", { className: "flex w-full items-center gap-2 p-4 py-3" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      "aria-label": "Pause timer",
      className: "flex h-10 w-10 items-center justify-center rounded-full bg-[#5A3C07] transition-colors hover:bg-[#694608]",
      onClick: () => setPaused((prev) => !prev),
      type: "button"
    },
    /* @__PURE__ */ React.createElement(
      PlayPauseButton,
      {
        active: /* @__PURE__ */ React.createElement(
          "svg",
          {
            className: "h-4 w-4 fill-current text-[#FDB000]",
            fill: "none",
            viewBox: "0 0 12 14",
            xmlns: "http://www.w3.org/2000/svg"
          },
          /* @__PURE__ */ React.createElement("title", null, "Play"),
          /* @__PURE__ */ React.createElement("path", { d: "M0.9375 13.2422C1.25 13.2422 1.51562 13.1172 1.82812 12.9375L10.9375 7.67188C11.5859 7.28906 11.8125 7.03906 11.8125 6.625C11.8125 6.21094 11.5859 5.96094 10.9375 5.58594L1.82812 0.3125C1.51562 0.132812 1.25 0.015625 0.9375 0.015625C0.359375 0.015625 0 0.453125 0 1.13281V12.1172C0 12.7969 0.359375 13.2422 0.9375 13.2422Z" })
        ),
        initial: /* @__PURE__ */ React.createElement(
          "svg",
          {
            className: "h-4 w-4 fill-current text-[#FDB000]",
            fill: "none",
            viewBox: "0 0 10 13",
            xmlns: "http://www.w3.org/2000/svg"
          },
          /* @__PURE__ */ React.createElement("title", null, "Pause"),
          /* @__PURE__ */ React.createElement("path", { d: "M1.03906 12.7266H2.82031C3.5 12.7266 3.85938 12.3672 3.85938 11.6797V1.03906C3.85938 0.328125 3.5 0 2.82031 0H1.03906C0.359375 0 0 0.359375 0 1.03906V11.6797C0 12.3672 0.359375 12.7266 1.03906 12.7266ZM6.71875 12.7266H8.49219C9.17969 12.7266 9.53125 12.3672 9.53125 11.6797V1.03906C9.53125 0.328125 9.17969 0 8.49219 0H6.71875C6.03125 0 5.67188 0.359375 5.67188 1.03906V11.6797C5.67188 12.3672 6.03125 12.7266 6.71875 12.7266Z" })
        ),
        isActive: paused
      }
    )
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      "aria-label": "Exit",
      className: "mr-12 flex h-10 w-10 items-center justify-center rounded-full bg-[#3C3D3C] text-white transition-colors hover:bg-[#4A4B4A]",
      onClick: () => setState("idle"),
      type: "button"
    },
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "h-6 w-6",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg"
      },
      /* @__PURE__ */ React.createElement("title", null, "Close"),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          d: "M6 18L18 6M6 6l12 12",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      )
    )
  ), /* @__PURE__ */ React.createElement("div", { className: "flex items-baseline gap-1.5 text-[#FDB000]" }, /* @__PURE__ */ React.createElement("span", { className: "font-semibold text-sm leading-none" }, "Timer"), /* @__PURE__ */ React.createElement(Timer, { className: "w-[64px] font-light text-3xl", paused })));
}
function IdleView() {
  return /* @__PURE__ */ React.createElement("div", { className: "h-[28px]" });
}
function RingModeView() {
  const [isSilent, setIsSilent] = useState(false);
  const [isInitial, setIsInitial] = useState(true);
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsInitial(false);
        setIsSilent((prev) => !prev);
      },
      isInitial ? 1e3 : 2e3
    );
    return () => clearTimeout(timer);
  }, [isInitial]);
  return /* @__PURE__ */ React.createElement(
    motion.div,
    {
      animate: { width: isSilent ? 148 : 128 },
      className: "relative flex h-[28px] items-center justify-between px-2.5",
      initial: { width: 128 },
      transition: { type: "spring", bounce: 0.5 }
    },
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        animate: {
          width: isSilent ? 40 : 0,
          opacity: isSilent ? 1 : 0,
          filter: isSilent ? "blur(0px)" : "blur(4px)"
        },
        className: "absolute left-[5px] h-[18px] w-12 cursor-pointer rounded-full bg-[#FD4F30]",
        initial: { width: 0, opacity: 0, filter: "blur(4px)" },
        transition: springTransition
      }
    ),
    /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "relative h-[12.75px] w-[11.25px]",
        onClick: () => setIsSilent((prev) => !prev),
        type: "button"
      },
      /* @__PURE__ */ React.createElement(
        motion.svg,
        {
          animate: {
            rotate: isSilent ? [0, -15, 5, -2, 0] : [0, 20, -15, 12.5, -10, 10, -7.5, 7.5, -5, 5, 0],
            x: isSilent ? 8.5 : 0
          },
          className: "absolute inset-0",
          fill: "none",
          height: "12.75",
          initial: false,
          viewBox: "0 0 15 17",
          width: "11.25",
          xmlns: "http://www.w3.org/2000/svg"
        },
        /* @__PURE__ */ React.createElement("title", null, "Bell"),
        /* @__PURE__ */ React.createElement(
          "path",
          {
            d: "M1.17969 13.3125H13.5625C14.2969 13.3125 14.7422 12.9375 14.7422 12.3672C14.7422 11.5859 13.9453 10.8828 13.2734 10.1875C12.7578 9.64844 12.6172 8.53906 12.5547 7.64062C12.5 4.64062 11.7031 2.57812 9.625 1.82812C9.32812 0.804688 8.52344 0 7.36719 0C6.21875 0 5.40625 0.804688 5.11719 1.82812C3.03906 2.57812 2.24219 4.64062 2.1875 7.64062C2.125 8.53906 1.98438 9.64844 1.46875 10.1875C0.789062 10.8828 0 11.5859 0 12.3672C0 12.9375 0.4375 13.3125 1.17969 13.3125ZM7.36719 16.4453C8.69531 16.4453 9.66406 15.4766 9.76562 14.3828H4.97656C5.07812 15.4766 6.04688 16.4453 7.36719 16.4453Z",
            fill: "white"
          }
        )
      ),
      /* @__PURE__ */ React.createElement(
        motion.div,
        {
          animate: {
            rotate: isSilent ? [0, -15, 5, -2, 0] : [0, 20, -15, 12.5, -10, 10, -7.5, 7.5, -5, 5, 0],
            x: isSilent ? 8.5 : 0
          },
          className: "absolute inset-0"
        },
        /* @__PURE__ */ React.createElement(motion.div, { className: "h-5 translate-x-[5.25px] -translate-y-[5px] rotate-[-40deg] overflow-hidden" }, /* @__PURE__ */ React.createElement(
          motion.div,
          {
            animate: { height: isSilent ? 16 : 0 },
            className: "w-fit rounded-full",
            transition: {
              ease: "easeInOut",
              duration: isSilent ? 0.125 : 0.05,
              delay: isSilent ? 0.15 : 0
            }
          },
          /* @__PURE__ */ React.createElement("div", { className: "flex h-full w-[3px] items-center justify-center rounded-full bg-[#FD4F30]" }, /* @__PURE__ */ React.createElement("div", { className: "h-full w-[0.75px] rounded-full bg-white" }))
        ))
      )
    ),
    /* @__PURE__ */ React.createElement("div", { className: "relative flex w-[32px] items-center" }, /* @__PURE__ */ React.createElement(
      motion.span,
      {
        animate: isSilent ? { opacity: 0, scale: 0.25, filter: "blur(4px)" } : {},
        className: "ml-auto font-medium text-white text-xs"
      },
      "Ring"
    ), /* @__PURE__ */ React.createElement(
      motion.span,
      {
        animate: isSilent ? { opacity: 1, scale: 1, filter: "blur(0)" } : { opacity: 0, scale: 0.25, filter: "blur(4px)" },
        className: "absolute font-medium text-[#FD4F30] text-xs"
      },
      "Silent"
    ))
  );
}
function ListeningView() {
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (paused) {
          return prev;
        }
        if (prev === 214) {
          return 0;
        }
        return prev + 1;
      });
    }, 1e3);
    return () => clearInterval(interval);
  }, [paused]);
  const formatTime = () => {
    const secs = `0${seconds % 60}`.slice(-2);
    const mins = `${Math.floor(seconds / 60)}`;
    const formattedMins = `0${Number(mins) % 60}`.slice(-2);
    return `${formattedMins}:${secs}`;
  };
  return /* @__PURE__ */ React.createElement("div", { className: "w-[316px] p-[18px]" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(
    Image,
    {
      alt: "Anniversary's album cover",
      className: "rounded-lg",
      height: 52,
      src: "https://placehold.co/100x100",
      width: 52
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1 pr-12" }, /* @__PURE__ */ React.createElement("span", { className: "whitespace-nowrap font-medium text-sm text-white leading-none" }, "Timeless Interlude"), /* @__PURE__ */ React.createElement("span", { className: "text-gray-400 text-sm leading-none" }, "Bryson Tiller")), /* @__PURE__ */ React.createElement("div", { className: "grid h-full grid-cols-11 justify-center gap-[2px] bg-transparent" }, /* @__PURE__ */ React.createElement(AudioBar, { baseLength: 50, paused }), /* @__PURE__ */ React.createElement(AudioBar, { baseLength: 60, paused }), /* @__PURE__ */ React.createElement(AudioBar, { baseLength: 70, paused }), /* @__PURE__ */ React.createElement(AudioBar, { baseLength: 90, paused }), /* @__PURE__ */ React.createElement(AudioBar, { baseLength: 80, paused }), /* @__PURE__ */ React.createElement(AudioBar, { baseLength: 90, paused }), /* @__PURE__ */ React.createElement(AudioBar, { baseLength: 70, paused }), /* @__PURE__ */ React.createElement(AudioBar, { baseLength: 60, paused }), /* @__PURE__ */ React.createElement(AudioBar, { baseLength: 50, paused }))), /* @__PURE__ */ React.createElement("div", { className: "mt-3 flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-gray-400 text-xs tabular-nums transition-colors" }, formatTime()), /* @__PURE__ */ React.createElement("div", { className: "relative h-[3px] flex-grow overflow-hidden rounded-full bg-[#2C2C29]" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      animate: { x: `${seconds / 214 * 100 - 99}%` },
      className: "absolute top-0 bottom-0 left-0 w-full bg-gray-400",
      initial: { x: "-100%" },
      transition: { duration: 1, ease: "linear" }
    }
  )), /* @__PURE__ */ React.createElement("span", { className: "text-gray-400 text-xs tabular-nums transition-colors" }, "3:34")), /* @__PURE__ */ React.createElement("div", { className: "mt-3 flex items-center justify-center gap-4 pb-1" }, /* @__PURE__ */ React.createElement("button", { type: "button" }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      fill: "none",
      height: "13",
      viewBox: "0 0 22 13",
      width: "22",
      xmlns: "http://www.w3.org/2000/svg"
    },
    /* @__PURE__ */ React.createElement("title", null, "Previous"),
    /* @__PURE__ */ React.createElement(
      "path",
      {
        d: "M9.64844 12.2891C10.2578 12.2891 10.7734 11.8203 10.7734 10.9531V1.35156C10.7734 0.484375 10.2578 0.015625 9.64844 0.015625C9.32812 0.015625 9.07031 0.117188 8.75 0.304688L0.789062 4.99219C0.234375 5.32031 0 5.70312 0 6.14844C0 6.60156 0.234375 6.98438 0.789062 7.3125L8.75 12C9.0625 12.1875 9.32812 12.2891 9.64844 12.2891ZM20.3828 12.2891C20.9922 12.2891 21.5078 11.8203 21.5078 10.9531V1.35156C21.5078 0.484375 20.9922 0.015625 20.3828 0.015625C20.0625 0.015625 19.8047 0.117188 19.4844 0.304688L11.5234 4.99219C10.9688 5.32031 10.7344 5.70312 10.7344 6.14844C10.7344 6.60156 10.9688 6.98438 11.5234 7.3125L19.4844 12C19.7969 12.1875 20.0625 12.2891 20.3828 12.2891Z",
        fill: "white"
      }
    )
  )), /* @__PURE__ */ React.createElement("button", { onClick: () => setPaused((prev) => !prev), type: "button" }, /* @__PURE__ */ React.createElement(
    PlayPauseButton,
    {
      active: /* @__PURE__ */ React.createElement(
        "svg",
        {
          className: "h-5 w-5 fill-current text-white",
          fill: "none",
          viewBox: "0 0 12 14",
          xmlns: "http://www.w3.org/2000/svg"
        },
        /* @__PURE__ */ React.createElement("title", null, "Play"),
        /* @__PURE__ */ React.createElement("path", { d: "M0.9375 13.2422C1.25 13.2422 1.51562 13.1172 1.82812 12.9375L10.9375 7.67188C11.5859 7.28906 11.8125 7.03906 11.8125 6.625C11.8125 6.21094 11.5859 5.96094 10.9375 5.58594L1.82812 0.3125C1.51562 0.132812 1.25 0.015625 0.9375 0.015625C0.359375 0.015625 0 0.453125 0 1.13281V12.1172C0 12.7969 0.359375 13.2422 0.9375 13.2422Z" })
      ),
      initial: /* @__PURE__ */ React.createElement(
        "svg",
        {
          className: "h-5 w-5 fill-current text-white",
          fill: "none",
          viewBox: "0 0 10 13",
          xmlns: "http://www.w3.org/2000/svg"
        },
        /* @__PURE__ */ React.createElement("title", null, "Pause"),
        /* @__PURE__ */ React.createElement("path", { d: "M1.03906 12.7266H2.82031C3.5 12.7266 3.85938 12.3672 3.85938 11.6797V1.03906C3.85938 0.328125 3.5 0 2.82031 0H1.03906C0.359375 0 0 0.359375 0 1.03906V11.6797C0 12.3672 0.359375 12.7266 1.03906 12.7266ZM6.71875 12.7266H8.49219C9.17969 12.7266 9.53125 12.3672 9.53125 11.6797V1.03906C9.53125 0.328125 9.17969 0 8.49219 0H6.71875C6.03125 0 5.67188 0.359375 5.67188 1.03906V11.6797C5.67188 12.3672 6.03125 12.7266 6.71875 12.7266Z" })
      ),
      isActive: paused
    }
  )), /* @__PURE__ */ React.createElement("button", { type: "button" }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      fill: "none",
      height: "13",
      viewBox: "0 0 22 13",
      width: "22",
      xmlns: "http://www.w3.org/2000/svg"
    },
    /* @__PURE__ */ React.createElement("title", null, "Next"),
    /* @__PURE__ */ React.createElement(
      "path",
      {
        d: "M1.125 12.2891C1.44531 12.2891 1.71094 12.1875 2.02344 12L9.98438 7.3125C10.5391 6.98438 10.7812 6.60156 10.7812 6.14844C10.7812 5.70312 10.5391 5.32031 9.98438 4.99219L2.02344 0.304688C1.70312 0.117188 1.44531 0.015625 1.125 0.015625C0.515625 0.015625 0 0.484375 0 1.35156V10.9531C0 11.8203 0.515625 12.2891 1.125 12.2891ZM11.8594 12.2891C12.1797 12.2891 12.4453 12.1875 12.7578 12L20.7266 7.3125C21.2734 6.98438 21.5156 6.60156 21.5156 6.14844C21.5156 5.70312 21.2734 5.32031 20.7266 4.99219L12.7578 0.304688C12.4453 0.117188 12.1797 0.015625 11.8594 0.015625C11.25 0.015625 10.7344 0.484375 10.7344 1.35156V10.9531C10.7344 11.8203 11.25 12.2891 11.8594 12.2891Z",
        fill: "white"
      }
    )
  ))));
}
const transitionVariants = {
  "ring-mode-idle": { scale: 0.9, scaleX: 0.9 },
  "timer-ring-mode": { scale: 0.7, y: -7.5 },
  "ring-mode-timer": { scale: 1.4, y: 7.5 },
  "timer-listenning": { scaleY: 1.1, y: 7.5 },
  "listenning-ring-mode": { scale: 0.65, y: -32 },
  "ring-mode-listenning": { scale: 1.5, y: 12.5 },
  "timer-idle": { scale: 0.7, y: -7.5 },
  "listenning-timer": { scaleY: 0.9, y: -12 },
  "listenning-idle": { scale: 0.4, y: -36 }
};
const exitVariants = {
  exit: (custom = {}) => ({
    ...custom,
    opacity: [1, 0],
    filter: "blur(5px)"
  })
};
const DynamicIslandBlock = () => {
  const [state, setState] = useState("idle");
  const [transition, setTransition] = useState();
  const [bounceValue, setBounceValue] = useState(1);
  const [previousHeight, setPreviousHeight] = useState(28);
  const contentRef = useRef(null);
  function renderContent() {
    switch (state) {
      case "timer":
        return /* @__PURE__ */ React.createElement(TimerView, null);
      case "listenning":
        return /* @__PURE__ */ React.createElement(ListeningView, null);
      case "ring-mode":
        return /* @__PURE__ */ React.createElement(RingModeView, null);
      default:
        return /* @__PURE__ */ React.createElement(IdleView, null);
    }
  }
  useLayoutEffect(() => {
    const element = contentRef.current;
    if (element) {
      const { height } = element.getBoundingClientRect();
      const heightDifference = Math.abs(height - previousHeight);
      const ratio = heightDifference / 100;
      let bounce = height < previousHeight ? 0.35 - 0.3 * ratio : 0.3 + 0.3 * ratio;
      bounce = Math.min(Math.max(bounce, 0.3), 0.35);
      if (heightDifference < 20) {
        bounce = 0.5;
      }
      setPreviousHeight(height);
      setBounceValue(bounce);
    }
  }, [previousHeight]);
  const handleStateChange = (newState) => {
    const transitionKey = `${state}-${newState}`;
    setTransition(transitionVariants[transitionKey]);
    setState(newState);
  };
  return /* @__PURE__ */ React.createElement(DynamicIslandContext.Provider, { value: { state, setState } }, /* @__PURE__ */ React.createElement("div", { className: "flex h-[400px] w-full items-center justify-center bg-gray-100" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      className: "min-w-[100px] overflow-hidden rounded-full bg-black",
      layout: true,
      style: { borderRadius: "32px" },
      transition: {
        type: "spring",
        bounce: bounceValue
      }
    },
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        animate: {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          originX: 0.5,
          originY: 0.5,
          transition: { delay: 0.05 }
        },
        initial: {
          scale: 0.9,
          opacity: 0,
          filter: "blur(5px)",
          originX: 0.5,
          originY: 0.5
        },
        key: state,
        ref: contentRef,
        transition: {
          type: "spring",
          bounce: bounceValue
        }
      },
      renderContent()
    )
  ), /* @__PURE__ */ React.createElement("div", { className: "pointer-events-none absolute top-0 left-1/2 flex h-[200px] w-[300px] -translate-x-1/2 items-start justify-center opacity-0" }, /* @__PURE__ */ React.createElement(
    AnimatePresence,
    {
      custom: transition,
      initial: false,
      mode: "popLayout"
    },
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        exit: "exit",
        initial: { opacity: 0 },
        key: `${state}second`,
        variants: exitVariants
      },
      renderContent()
    )
  ))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(Button, { onClick: () => handleStateChange("idle") }, "Idle"), /* @__PURE__ */ React.createElement(Button, { onClick: () => handleStateChange("ring-mode") }, "Ring Mode"), /* @__PURE__ */ React.createElement(Button, { onClick: () => handleStateChange("timer") }, "Timer"), /* @__PURE__ */ React.createElement(Button, { onClick: () => handleStateChange("listenning") }, "Listening")))));
};
function App() {
  return /* @__PURE__ */ React.createElement(DynamicIslandBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
