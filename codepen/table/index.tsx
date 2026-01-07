// CodePen packages: @radix-ui/react-slot@^1.2.4, class-variance-authority@^0.7.1, clsx@^2.1.1, motion@^12.23.26, react-dom@19.2.3, react@19.2.3, tailwind-merge@^3.4.0

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { forwardRef, type ButtonHTMLAttributes, useState } from "react";
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

interface TableCellHeader {
  type: "header";
  content: string;
  icon?: string;
  hiddenOnMobile?: boolean;
}

interface TableCellUser {
  type: "user";
  content: string;
  avatar?: boolean;
}

interface TableCellText {
  type: "text";
  content: string;
}

interface TableCellBadge {
  type: "badge";
  content: string;
  variant: string;
  hiddenOnMobile?: boolean;
}

type TableCell =
  | TableCellHeader
  | TableCellUser
  | TableCellText
  | TableCellBadge;
type TableRow = TableCell[];
type Tables = Record<string, TableRow[]>;

const TableBlock = () => {
  const [activeTable, setActiveTable] = useState<keyof Tables>("scale-ups");
  function animation(row: number, column: number) {
    return {
      initial: { opacity: 0, y: "-100%" },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: "100%" },
      transition: {
        duration: 0.5,
        delay: 0.07 * row + 0.1 * column,
        ease: [0.65, 0, 0.35, 1] as [number, number, number, number],
      },
    };
  }

  const tables: Tables = {
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
          hiddenOnMobile: true,
        },
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
          hiddenOnMobile: true,
        },
      ],
      [
        { type: "user", content: "DataFlow Systems", avatar: true },
        { type: "text", content: "Series C" },
        { type: "badge", content: "Expansion", variant: "orange" },
        {
          type: "badge",
          content: "$120M",
          variant: "purple",
          hiddenOnMobile: true,
        },
      ],
      [
        { type: "user", content: "AI Solutions Ltd", avatar: true },
        { type: "text", content: "Series A" },
        { type: "badge", content: "Early", variant: "yellow" },
        {
          type: "badge",
          content: "$15M",
          variant: "blue",
          hiddenOnMobile: true,
        },
      ],
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
          hiddenOnMobile: true,
        },
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
          hiddenOnMobile: true,
        },
      ],
      [
        { type: "user", content: "MetricsFlow", avatar: true },
        { type: "text", content: "Analytics Dashboard" },
        { type: "badge", content: "Analytics", variant: "orange" },
        {
          type: "badge",
          content: "$1.8M",
          variant: "blue",
          hiddenOnMobile: true,
        },
      ],
      [
        { type: "user", content: "TeamConnect", avatar: true },
        { type: "text", content: "Communication" },
        { type: "badge", content: "Collaboration", variant: "yellow" },
        {
          type: "badge",
          content: "$850K",
          variant: "cyan",
          hiddenOnMobile: true,
        },
      ],
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
          hiddenOnMobile: true,
        },
      ],
      // Data rows
      [
        { type: "user", content: "Local Café Chain", avatar: true },
        { type: "text", content: "Food & Beverage" },
        { type: "badge", content: "Small", variant: "yellow" },
        {
          type: "badge",
          content: "$2.1M",
          variant: "blue",
          hiddenOnMobile: true,
        },
      ],
      [
        { type: "user", content: "Design Studio LLC", avatar: true },
        { type: "text", content: "Creative Services" },
        { type: "badge", content: "Medium", variant: "orange" },
        {
          type: "badge",
          content: "$4.5M",
          variant: "purple",
          hiddenOnMobile: true,
        },
      ],
      [
        { type: "user", content: "Tech Repair Co", avatar: true },
        { type: "text", content: "Technology" },
        { type: "badge", content: "Small", variant: "yellow" },
        {
          type: "badge",
          content: "$1.2M",
          variant: "cyan",
          hiddenOnMobile: true,
        },
      ],
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
          hiddenOnMobile: true,
        },
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
          hiddenOnMobile: true,
        },
      ],
      [
        { type: "user", content: "Growth Equity Fund", avatar: true },
        { type: "text", content: "$500M" },
        { type: "badge", content: "Growth", variant: "orange" },
        {
          type: "badge",
          content: "28 cos",
          variant: "blue",
          hiddenOnMobile: true,
        },
      ],
      [
        { type: "user", content: "Angel Syndicate", avatar: true },
        { type: "text", content: "$50M" },
        { type: "badge", content: "Seed", variant: "yellow" },
        {
          type: "badge",
          content: "120 cos",
          variant: "cyan",
          hiddenOnMobile: true,
        },
      ],
    ],
  };

  const tableData = tables[activeTable];

  const getBadgeStyles = (variant: string) => {
    const styles = {
      yellow: "border-[#FFEBAD] bg-[#FFF3CC] text-[#705500]",
      orange: "border-[#FEE0C8] bg-[#FEEEE1] text-[#753501]",
      blue: "border-[#D6E5FF] bg-[#E5EEFF] text-[#183C81]",
      purple: "border-[#E8DDFE] bg-[#F5EEFF] text-[#4711BB]",
      cyan: "border-[#C3EDF9] bg-[#DAF4FC] text-[#0A5A70]",
    };
    return styles[variant as keyof typeof styles] || styles.blue;
  };

  const renderCellContent = (
    cell: TableCell,
    rowIndex: number,
    colIndex: number
  ) => {
    switch (cell.type) {
      case "header":
        if (
          cell.content === "Company" ||
          cell.content === "User" ||
          cell.content === "Startup" ||
          cell.content === "Business" ||
          cell.content === "Investor"
        ) {
          return (
            <div className="grid overflow-hidden *:col-start-1 *:row-start-1">
              <motion.div {...animation(rowIndex, colIndex)}>
                <div className="ml-1">{cell.content}</div>
              </motion.div>
            </div>
          );
        }
        if (cell.icon) {
          return (
            <div className="grid overflow-hidden *:col-start-1 *:row-start-1">
              <motion.div {...animation(rowIndex, colIndex)}>
                <div className="flex items-center gap-x-1 lg:gap-x-1.5">
                  <div>{cell.content}</div>
                </div>
              </motion.div>
            </div>
          );
        }
        return (
          <div className="grid overflow-hidden *:col-start-1 *:row-start-1">
            <div />
          </div>
        );

      case "user":
        return (
          <div className="grid overflow-hidden *:col-start-1 *:row-start-1">
            <motion.div {...animation(rowIndex, colIndex)}>
              <div className="flex items-center gap-x-[6px]">
                <div className="relative flex">
                  {cell.content}
                  <div className="absolute bottom-0 -left-[0.5px] h-px w-[calc(100%+1px)] rounded-full bg-[#EEEFF1]" />
                </div>
              </div>
            </motion.div>
          </div>
        );

      case "text":
        return (
          <div className="grid overflow-hidden *:col-start-1 *:row-start-1">
            <motion.div {...animation(rowIndex, colIndex)}>
              <div>{cell.content}</div>
            </motion.div>
          </div>
        );

      case "badge":
        return (
          <div className="grid overflow-hidden *:col-start-1 *:row-start-1">
            <motion.div {...animation(rowIndex, colIndex)}>
              <div
                className={`inline-flex items-center gap-x-[1.5px] rounded-md border px-[3px] py-[2.5px] font-medium text-[8px] leading-[8px] tracking-normal lg:gap-x-1 lg:rounded-lg lg:px-[5px] lg:py-px lg:text-[12px] lg:leading-4 ${getBadgeStyles(cell.variant)}`}
              >
                {cell.content}
              </div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  const getCellClasses = (
    cell: TableCell,
    _rowIndex: number,
    colIndex: number
  ) => {
    const baseClasses =
      "h-full w-full flex items-center truncate border-[#EEEFF1] border-r border-b font-medium text-secondary-foreground gap-x-1 pt-[7px] pb-1.5 text-[10px] leading-[14px] tracking-[-0.2px] lg:gap-x-1.5 lg:pt-[10px] lg:pb-[9px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]";

    if (colIndex === 0) {
      return `${baseClasses} pl-2.5 lg:pl-4`;
    }

    const hiddenOnMobile =
      (cell.type === "header" || cell.type === "badge") && cell.hiddenOnMobile;

    if (hiddenOnMobile) {
      return `${baseClasses} pl-1.5 lg:pl-2 hidden md:flex`;
    }

    return `${baseClasses} pl-1.5 lg:pl-2`;
  };

  const buttons: Array<{ id: keyof Tables; label: string }> = [
    { id: "scale-ups", label: "Scale-ups" },
    { id: "saas-startups", label: "SaaS startups" },
    { id: "smbs", label: "SMBs" },
    { id: "investors", label: "Investors" },
  ];

  const getRowKey = (row: TableRow) =>
    row.map((cell) => `${cell.type}:${cell.content}`).join("|");

  return (
    <div className="space-y-6">
      {/* Toggle Buttons */}
      <div className="flex flex-wrap gap-2">
        {buttons.map((button) => (
          <Button
            key={button.id}
            onClick={() => setActiveTable(button.id)}
            variant={activeTable === button.id ? "default" : "secondary"}
          >
            {button.label}
          </Button>
        ))}
      </div>

      {/* Table */}
      <div className="pointer-events-none grid select-none auto-rows-[28px] grid-cols-[118px_1fr_1fr] border-[#EEEFF1] border-t border-l transition-[grid-template-columns] duration-700 [transition-timing-function:cubic-bezier(0.65,0,0.35,1)] md:grid-cols-[118px_1fr_1fr_1fr] lg:auto-rows-[40px] lg:grid-cols-[173px_1fr_1fr_1fr]">
        <AnimatePresence mode="popLayout">
          {tableData.map((row, rowIndex) => {
            const rowKey = getRowKey(row);
            return row.map((cell, colIndex) => (
              <div
                className={getCellClasses(cell, rowIndex, colIndex)}
                key={`${activeTable}-${rowKey}-${cell.type}-${cell.content}`}
              >
                {renderCellContent(cell, rowIndex, colIndex)}
              </div>
            ));
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

function App() {
  return (
    <TableBlock />
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
