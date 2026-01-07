import { motion, useScroll, useTransform } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createRoot } from "react-dom/client";
const Link = ({ href, children, ...props }) => /* @__PURE__ */ React.createElement("a", { href, ...props }, children);
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
const blocks = {
  "animated-button": {
    name: "Animated subscribe button",
    description: "Toggle button that smoothly transitions between follow and subscribed states"
  },
  "shuffle-theme": {
    name: "Theme shuffler",
    description: "Scroll-animated cards with multiple themed colour schemes and backgrounds"
  },
  faq: {
    name: "FAQ accordion",
    description: "Expandable FAQ section with smooth accordion animations"
  },
  sheet: {
    name: "Bottom sheet",
    description: "Multi-stage draggable modal with swipe gestures"
  },
  tabs: {
    name: "Tab navigation",
    description: "Tabbed interface for organising content into sections"
  },
  toast: {
    name: "Toast notifications",
    description: "Temporary notification pop-ups with customisable styles and animations"
  },
  "ios-cards": {
    name: "iOS-style cards",
    description: "iOS-inspired cards with smooth transitions"
  },
  "dynamic-island": {
    name: "Dynamic island",
    description: "iPhone-style dynamic island with expandable states and morphing animations"
  },
  map: {
    name: "Interactive map",
    description: "Mapbox-powered map with custom markers and navigation controls"
  },
  "card-stack": {
    name: "Stacked cards",
    description: "Three-card stack that expands into a grid layout on click"
  },
  expand: {
    name: "Expandable date cards",
    description: "Date cards that expand to reveal additional details on click"
  },
  preview: {
    name: "Preview block",
    description: "Preview component that expands to show more content"
  },
  sky: {
    name: "Sky",
    description: "Scroll-driven sky gradient transitioning through sunrise, day, sunset, and night with animated stars"
  },
  album: {
    name: "Album",
    description: "Interactive vinyl record player that toggles between spinning record and album cover"
  },
  moon: {
    name: "Moon",
    description: "3D moon with accurate lunar phases and NASA textures"
  },
  "staggered-fade": {
    name: "Staggered fade",
    description: "Auto-cycling text with letter-by-letter fade animations"
  },
  status: {
    name: "Status",
    description: "Popover menu to set user status with animated emoji icons"
  },
  table: {
    name: "Table",
    description: "Animated data table with category toggle and staggered cell animations"
  },
  lighting: {
    name: "Lighting",
    description: "3D window scene with mouse-controlled light beams, parallax depth, and organic noise animations"
  },
  "password-strength": {
    name: "Password strength",
    description: "Password input with animated 3-bar strength metre and colour-coded feedback"
  },
  controls: {
    name: "Controls",
    description: "Design system playground with colour and layout controls"
  },
  dither: {
    name: "Dither",
    description: "3D asteroid shooter game with Obra Dinn-style dithering effects"
  },
  "timed-undo": {
    name: "Timed undo",
    description: "Delete account button with animated countdown timer and undo functionality"
  },
  // "svg-animations": {
  //   name: "SVG animations",
  //   description: "Morphing SVG shapes with spring animations and color transitions",
  // },
  "document-shadow": {
    name: "Document shadow",
    description: "Document card with ambient shadow overlay and interactive dice button"
  },
  "qr-code": {
    name: "QR code generator",
    description: "Customisable QR code generator with OKLCH colour picker and downloadable SVG/PNG output"
  },
  "sticky-notes": {
    name: "Sticky notes",
    description: "Sticky notes with animated page turning",
    hidden: true
  },
  markers: {
    name: "Article markers",
    description: "Scroll progress bar with chapter indicators and highlight bookmarks"
  },
  "perfect-dnd": {
    name: "Perfect drag and drop",
    description: "Sortable list with spring physics drag animations"
  },
  "dnd-grid": {
    name: "Dnd grid",
    description: "Resizable drag-and-drop grid layout using dnd-grid"
  }
};
const Header = ({ id, className }) => {
  return /* @__PURE__ */ React.createElement("div", { className: cn("mb-8", className) }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      asChild: true,
      className: "mb-4 rounded text-current! hover:text-foreground!",
      size: "icon",
      variant: "ghost"
    },
    /* @__PURE__ */ React.createElement(Link, { href: "/" }, /* @__PURE__ */ React.createElement(ArrowLeft, { className: "size-4 text-current" }))
  ), /* @__PURE__ */ React.createElement("h1", { className: "mb-4 font-bold text-4xl" }, blocks[id].name)), /* @__PURE__ */ React.createElement("p", { className: "text-lg text-muted-foreground" }, blocks[id].description));
};
const getRandomStartPoint = () => {
  const side = Math.floor(Math.random() * 4);
  const offset = Math.random() * window.innerWidth;
  switch (side) {
    case 0:
      return { x: offset, y: 0, angle: 45 };
    case 1:
      return { x: window.innerWidth, y: offset, angle: 135 };
    case 2:
      return { x: offset, y: window.innerHeight, angle: 225 };
    case 3:
      return { x: 0, y: offset, angle: 315 };
    default:
      return { x: 0, y: 0, angle: 45 };
  }
};
const ShootingStars = ({
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1200,
  maxDelay = 4200,
  starColor = "#fff",
  trailColor = "#fff",
  starWidth = 10,
  starHeight = 1,
  className
}) => {
  const [star, setStar] = useState(null);
  const svgRef = useRef(null);
  useEffect(() => {
    const createStar = () => {
      const { x, y, angle } = getRandomStartPoint();
      const newStar = {
        id: Date.now(),
        x,
        y,
        angle,
        scale: 1,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        distance: 0
      };
      setStar(newStar);
      const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
      setTimeout(createStar, randomDelay);
    };
    createStar();
  }, [minSpeed, maxSpeed, minDelay, maxDelay]);
  useEffect(() => {
    const moveStar = () => {
      if (star) {
        setStar((prevStar) => {
          if (!prevStar) {
            return null;
          }
          const newX = prevStar.x + prevStar.speed * Math.cos(prevStar.angle * Math.PI / 180);
          const newY = prevStar.y + prevStar.speed * Math.sin(prevStar.angle * Math.PI / 180);
          const newDistance = prevStar.distance + prevStar.speed;
          const newScale = 1 + newDistance / 100;
          if (newX < -20 || newX > window.innerWidth + 20 || newY < -20 || newY > window.innerHeight + 20) {
            return null;
          }
          return {
            ...prevStar,
            x: newX,
            y: newY,
            distance: newDistance,
            scale: newScale
          };
        });
      }
    };
    const animationFrame = requestAnimationFrame(moveStar);
    return () => cancelAnimationFrame(animationFrame);
  }, [star]);
  return /* @__PURE__ */ React.createElement(
    "svg",
    {
      className: cn("absolute inset-0 h-full w-full", className),
      ref: svgRef
    },
    /* @__PURE__ */ React.createElement("title", null, "Shooting stars"),
    star && /* @__PURE__ */ React.createElement(
      "rect",
      {
        fill: "url(#gradient)",
        height: starHeight,
        key: star.id,
        transform: `rotate(${star.angle}, ${star.x + starWidth * star.scale / 2}, ${star.y + starHeight / 2})`,
        width: starWidth * star.scale,
        x: star.x,
        y: star.y
      }
    ),
    /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "gradient", x1: "0%", x2: "100%", y1: "0%", y2: "100%" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", style: { stopColor: trailColor, stopOpacity: 0 } }), /* @__PURE__ */ React.createElement(
      "stop",
      {
        offset: "100%",
        style: { stopColor: starColor, stopOpacity: 1 }
      }
    )))
  );
};
const SkyBlock = () => {
  const { scrollYProgress } = useScroll();
  const bgGradient = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [
      "linear-gradient(rgb(0, 144, 245), rgb(230, 214, 221), rgb(234, 176, 69))",
      "linear-gradient(rgb(30, 84, 200), rgb(91, 143, 230), rgb(189, 216, 254))",
      "linear-gradient(rgb(46, 70, 112), rgb(205, 177, 175), rgb(204, 126, 101))",
      "linear-gradient(rgb(6, 22, 31), rgb(0, 73, 104), rgb(75, 148, 161))"
    ]
  );
  const cloudsGradient = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [
      "linear-gradient(rgb(205, 206, 208), rgb(255, 231, 230))",
      "linear-gradient(rgb(255, 255, 255), rgb(248, 248, 255))",
      "linear-gradient(rgb(254, 130, 143), rgb(230, 150, 130))",
      "linear-gradient(rgb(33, 62, 80), rgb(49, 84, 106))"
    ]
  );
  const starsOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 0, 0.933345, 1]
  );
  const starsY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [-50, -36.0824, -13.9901, -4.08733]
  );
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "relative z-10 bg-background p-8" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-4xl" }, /* @__PURE__ */ React.createElement(Header, { className: "mb-0!", id: "sky" }), /* @__PURE__ */ React.createElement(
    "a",
    {
      className: "link",
      href: "https://matthewblode.com",
      rel: "noreferrer",
      target: "_blank"
    },
    "See a realworld example"
  ))), /* @__PURE__ */ React.createElement("div", { className: "relative z-10 bg-noise" }, /* @__PURE__ */ React.createElement("section", { className: "relative flex min-h-[100lvh] items-center justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto flex max-w-[900px] flex-col items-center justify-center text-center" }, /* @__PURE__ */ React.createElement("h1", { className: "text-6xl md:text-8xl" }, "Sunrise"))), /* @__PURE__ */ React.createElement("section", { className: "relative flex min-h-[100lvh] items-center justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto flex max-w-[900px] flex-col items-center justify-center text-center" }, /* @__PURE__ */ React.createElement("h1", { className: "text-6xl md:text-8xl" }, "Day"))), /* @__PURE__ */ React.createElement("section", { className: "relative flex min-h-[100lvh] items-center justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto flex max-w-[900px] flex-col items-center justify-center text-center" }, /* @__PURE__ */ React.createElement("h1", { className: "text-6xl md:text-8xl" }, "Sunset"))), /* @__PURE__ */ React.createElement("section", { className: "relative flex min-h-[100lvh] items-center justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto flex max-w-[900px] flex-col items-center justify-center text-center" }, /* @__PURE__ */ React.createElement("h1", { className: "text-6xl md:text-8xl" }, "Night")))), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      className: "fixed inset-0 z-0",
      id: "home-footer-bg-gradient",
      style: { background: bgGradient }
    }
  ), /* @__PURE__ */ React.createElement("footer", { className: "fixed inset-0", id: "contact" }, /* @__PURE__ */ React.createElement(ShootingStars, null), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      className: "absolute inset-0",
      id: "home-footer-clouds-gradient",
      style: {
        mask: 'url("./assets/footer-clouds.png") center/cover no-repeat',
        WebkitMask: 'url("./assets/footer-clouds.png") center/cover no-repeat',
        background: cloudsGradient
      }
    }
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      className: "absolute inset-0 -bottom-120 bg-repeat",
      id: "home-footer-stars",
      style: {
        backgroundImage: 'url("./assets/footer-stars.png")',
        opacity: starsOpacity,
        y: starsY
      }
    }
  )));
};
function App() {
  return /* @__PURE__ */ React.createElement(SkyBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
