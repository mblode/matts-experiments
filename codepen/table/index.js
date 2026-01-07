import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { forwardRef, useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createRoot } from "react-dom/client";
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
const TableBlock = () => {
  const [activeTable, setActiveTable] = useState("scale-ups");
  function animation(row, column) {
    return {
      initial: { opacity: 0, y: "-100%" },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: "100%" },
      transition: {
        duration: 0.5,
        delay: 0.07 * row + 0.1 * column,
        ease: [0.65, 0, 0.35, 1]
      }
    };
  }
  const tables = {
    "scale-ups": [
      // Header row
      [
        { type: "header", content: "Company", icon: "user" },
        { type: "header", content: "Funding Round", icon: "id" },
        { type: "header", content: "Stage", icon: "type" },
        {
          type: "header",
          content: "Valuation",
          icon: "score",
          hiddenOnMobile: true
        }
      ],
      // Data rows
      [
        { type: "user", content: "TechCorp Inc", avatar: true },
        { type: "text", content: "Series B" },
        { type: "badge", content: "Growth", variant: "blue" },
        {
          type: "badge",
          content: "$50M",
          variant: "purple",
          hiddenOnMobile: true
        }
      ],
      [
        { type: "user", content: "DataFlow Systems", avatar: true },
        { type: "text", content: "Series C" },
        { type: "badge", content: "Expansion", variant: "orange" },
        {
          type: "badge",
          content: "$120M",
          variant: "purple",
          hiddenOnMobile: true
        }
      ],
      [
        { type: "user", content: "AI Solutions Ltd", avatar: true },
        { type: "text", content: "Series A" },
        { type: "badge", content: "Early", variant: "yellow" },
        {
          type: "badge",
          content: "$15M",
          variant: "blue",
          hiddenOnMobile: true
        }
      ]
    ],
    "saas-startups": [
      // Header row
      [
        { type: "header", content: "Startup", icon: "user" },
        { type: "header", content: "Product", icon: "id" },
        { type: "header", content: "Category", icon: "type" },
        {
          type: "header",
          content: "ARR",
          icon: "score",
          hiddenOnMobile: true
        }
      ],
      // Data rows
      [
        { type: "user", content: "CloudSync Pro", avatar: true },
        { type: "text", content: "File Management" },
        { type: "badge", content: "Productivity", variant: "blue" },
        {
          type: "badge",
          content: "$2.4M",
          variant: "purple",
          hiddenOnMobile: true
        }
      ],
      [
        { type: "user", content: "MetricsFlow", avatar: true },
        { type: "text", content: "Analytics Dashboard" },
        { type: "badge", content: "Analytics", variant: "orange" },
        {
          type: "badge",
          content: "$1.8M",
          variant: "blue",
          hiddenOnMobile: true
        }
      ],
      [
        { type: "user", content: "TeamConnect", avatar: true },
        { type: "text", content: "Communication" },
        { type: "badge", content: "Collaboration", variant: "yellow" },
        {
          type: "badge",
          content: "$850K",
          variant: "cyan",
          hiddenOnMobile: true
        }
      ]
    ],
    smbs: [
      // Header row
      [
        { type: "header", content: "Business", icon: "user" },
        { type: "header", content: "Industry", icon: "id" },
        { type: "header", content: "Size", icon: "type" },
        {
          type: "header",
          content: "Revenue",
          icon: "score",
          hiddenOnMobile: true
        }
      ],
      // Data rows
      [
        { type: "user", content: "Local Caf\xE9 Chain", avatar: true },
        { type: "text", content: "Food & Beverage" },
        { type: "badge", content: "Small", variant: "yellow" },
        {
          type: "badge",
          content: "$2.1M",
          variant: "blue",
          hiddenOnMobile: true
        }
      ],
      [
        { type: "user", content: "Design Studio LLC", avatar: true },
        { type: "text", content: "Creative Services" },
        { type: "badge", content: "Medium", variant: "orange" },
        {
          type: "badge",
          content: "$4.5M",
          variant: "purple",
          hiddenOnMobile: true
        }
      ],
      [
        { type: "user", content: "Tech Repair Co", avatar: true },
        { type: "text", content: "Technology" },
        { type: "badge", content: "Small", variant: "yellow" },
        {
          type: "badge",
          content: "$1.2M",
          variant: "cyan",
          hiddenOnMobile: true
        }
      ]
    ],
    investors: [
      // Header row
      [
        { type: "header", content: "Investor", icon: "user" },
        { type: "header", content: "Fund Size", icon: "id" },
        { type: "header", content: "Stage Focus", icon: "type" },
        {
          type: "header",
          content: "Portfolio",
          icon: "score",
          hiddenOnMobile: true
        }
      ],
      // Data rows
      [
        { type: "user", content: "Venture Capital LP", avatar: true },
        { type: "text", content: "$250M" },
        { type: "badge", content: "Series A-B", variant: "blue" },
        {
          type: "badge",
          content: "45 cos",
          variant: "purple",
          hiddenOnMobile: true
        }
      ],
      [
        { type: "user", content: "Growth Equity Fund", avatar: true },
        { type: "text", content: "$500M" },
        { type: "badge", content: "Growth", variant: "orange" },
        {
          type: "badge",
          content: "28 cos",
          variant: "blue",
          hiddenOnMobile: true
        }
      ],
      [
        { type: "user", content: "Angel Syndicate", avatar: true },
        { type: "text", content: "$50M" },
        { type: "badge", content: "Seed", variant: "yellow" },
        {
          type: "badge",
          content: "120 cos",
          variant: "cyan",
          hiddenOnMobile: true
        }
      ]
    ]
  };
  const tableData = tables[activeTable];
  const getBadgeStyles = (variant) => {
    const styles = {
      yellow: "border-[#FFEBAD] bg-[#FFF3CC] text-[#705500]",
      orange: "border-[#FEE0C8] bg-[#FEEEE1] text-[#753501]",
      blue: "border-[#D6E5FF] bg-[#E5EEFF] text-[#183C81]",
      purple: "border-[#E8DDFE] bg-[#F5EEFF] text-[#4711BB]",
      cyan: "border-[#C3EDF9] bg-[#DAF4FC] text-[#0A5A70]"
    };
    return styles[variant] || styles.blue;
  };
  const renderCellContent = (cell, rowIndex, colIndex) => {
    switch (cell.type) {
      case "header":
        if (cell.content === "Company" || cell.content === "User" || cell.content === "Startup" || cell.content === "Business" || cell.content === "Investor") {
          return /* @__PURE__ */ React.createElement("div", { className: "grid overflow-hidden *:col-start-1 *:row-start-1" }, /* @__PURE__ */ React.createElement(motion.div, { ...animation(rowIndex, colIndex) }, /* @__PURE__ */ React.createElement("div", { className: "ml-1" }, cell.content)));
        }
        if (cell.icon) {
          return /* @__PURE__ */ React.createElement("div", { className: "grid overflow-hidden *:col-start-1 *:row-start-1" }, /* @__PURE__ */ React.createElement(motion.div, { ...animation(rowIndex, colIndex) }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-x-1 lg:gap-x-1.5" }, /* @__PURE__ */ React.createElement("div", null, cell.content))));
        }
        return /* @__PURE__ */ React.createElement("div", { className: "grid overflow-hidden *:col-start-1 *:row-start-1" }, /* @__PURE__ */ React.createElement("div", null));
      case "user":
        return /* @__PURE__ */ React.createElement("div", { className: "grid overflow-hidden *:col-start-1 *:row-start-1" }, /* @__PURE__ */ React.createElement(motion.div, { ...animation(rowIndex, colIndex) }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-x-[6px]" }, /* @__PURE__ */ React.createElement("div", { className: "relative flex" }, cell.content, /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0 -left-[0.5px] h-px w-[calc(100%+1px)] rounded-full bg-[#EEEFF1]" })))));
      case "text":
        return /* @__PURE__ */ React.createElement("div", { className: "grid overflow-hidden *:col-start-1 *:row-start-1" }, /* @__PURE__ */ React.createElement(motion.div, { ...animation(rowIndex, colIndex) }, /* @__PURE__ */ React.createElement("div", null, cell.content)));
      case "badge":
        return /* @__PURE__ */ React.createElement("div", { className: "grid overflow-hidden *:col-start-1 *:row-start-1" }, /* @__PURE__ */ React.createElement(motion.div, { ...animation(rowIndex, colIndex) }, /* @__PURE__ */ React.createElement(
          "div",
          {
            className: `inline-flex items-center gap-x-[1.5px] rounded-md border px-[3px] py-[2.5px] font-medium text-[8px] leading-[8px] tracking-normal lg:gap-x-1 lg:rounded-lg lg:px-[5px] lg:py-px lg:text-[12px] lg:leading-4 ${getBadgeStyles(cell.variant)}`
          },
          cell.content
        )));
      default:
        return null;
    }
  };
  const getCellClasses = (cell, _rowIndex, colIndex) => {
    const baseClasses = "h-full w-full flex items-center truncate border-[#EEEFF1] border-r border-b font-medium text-secondary-foreground gap-x-1 pt-[7px] pb-1.5 text-[10px] leading-[14px] tracking-[-0.2px] lg:gap-x-1.5 lg:pt-[10px] lg:pb-[9px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]";
    if (colIndex === 0) {
      return `${baseClasses} pl-2.5 lg:pl-4`;
    }
    const hiddenOnMobile = (cell.type === "header" || cell.type === "badge") && cell.hiddenOnMobile;
    if (hiddenOnMobile) {
      return `${baseClasses} pl-1.5 lg:pl-2 hidden md:flex`;
    }
    return `${baseClasses} pl-1.5 lg:pl-2`;
  };
  const buttons = [
    { id: "scale-ups", label: "Scale-ups" },
    { id: "saas-startups", label: "SaaS startups" },
    { id: "smbs", label: "SMBs" },
    { id: "investors", label: "Investors" }
  ];
  const getRowKey = (row) => row.map((cell) => `${cell.type}:${cell.content}`).join("|");
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, buttons.map((button) => /* @__PURE__ */ React.createElement(
    Button,
    {
      key: button.id,
      onClick: () => setActiveTable(button.id),
      variant: activeTable === button.id ? "default" : "secondary"
    },
    button.label
  ))), /* @__PURE__ */ React.createElement("div", { className: "pointer-events-none grid select-none auto-rows-[28px] grid-cols-[118px_1fr_1fr] border-[#EEEFF1] border-t border-l transition-[grid-template-columns] duration-700 [transition-timing-function:cubic-bezier(0.65,0,0.35,1)] md:grid-cols-[118px_1fr_1fr_1fr] lg:auto-rows-[40px] lg:grid-cols-[173px_1fr_1fr_1fr]" }, /* @__PURE__ */ React.createElement(AnimatePresence, { mode: "popLayout" }, tableData.map((row, rowIndex) => {
    const rowKey = getRowKey(row);
    return row.map((cell, colIndex) => /* @__PURE__ */ React.createElement(
      "div",
      {
        className: getCellClasses(cell, rowIndex, colIndex),
        key: `${activeTable}-${rowKey}-${cell.type}-${cell.content}`
      },
      renderCellContent(cell, rowIndex, colIndex)
    ));
  }))));
};
function App() {
  return /* @__PURE__ */ React.createElement(TableBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
