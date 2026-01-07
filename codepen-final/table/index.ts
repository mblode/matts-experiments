import * as React from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createRoot } from "react-dom/client";

type TableCellHeader = {
  type: "header";
  content: string;
  icon?: string;
  hiddenOnMobile?: boolean;
};

type TableCellUser = {
  type: "user";
  content: string;
  avatar?: boolean;
};

type TableCellText = {
  type: "text";
  content: string;
};

type TableCellBadge = {
  type: "badge";
  content: string;
  variant: "yellow" | "orange" | "blue" | "purple" | "cyan";
  hiddenOnMobile?: boolean;
};

type TableCell =
  | TableCellHeader
  | TableCellUser
  | TableCellText
  | TableCellBadge;

type TableRow = TableCell[];

type Tables = Record<string, TableRow[]>;

const buttonBase =
  "relative inline-flex h-10 items-center justify-center rounded px-4 py-2 text-sm font-semibold transition active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
const buttonDefault =
  "bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-300";
const buttonSecondary =
  "border border-slate-200 text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus-visible:outline-slate-200";

const TableBlock = () => {
  const [activeTable, setActiveTable] = useState<keyof Tables>("scale-ups");

  const animation = (row: number, column: number) => ({
    initial: { opacity: 0, y: "-100%" },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "100%" },
    transition: {
      duration: 0.5,
      delay: 0.07 * row + 0.1 * column,
      ease: [0.65, 0, 0.35, 1] as [number, number, number, number],
    },
  });

  const tables: Tables = {
    "scale-ups": [
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

  const getBadgeStyles = (variant: TableCellBadge["variant"]) => {
    const styles = {
      yellow: "border-[#FFEBAD] bg-[#FFF3CC] text-[#705500]",
      orange: "border-[#FEE0C8] bg-[#FEEEE1] text-[#753501]",
      blue: "border-[#D6E5FF] bg-[#E5EEFF] text-[#183C81]",
      purple: "border-[#E8DDFE] bg-[#F5EEFF] text-[#4711BB]",
      cyan: "border-[#C3EDF9] bg-[#DAF4FC] text-[#0A5A70]",
    };
    return styles[variant];
  };

  const renderCellContent = (
    cell: TableCell,
    rowIndex: number,
    colIndex: number
  ) => {
    switch (cell.type) {
      case "header":
        return (
          <div className="grid overflow-hidden *:col-start-1 *:row-start-1">
            <motion.div {...animation(rowIndex, colIndex)}>
              <div className="ml-1">{cell.content}</div>
            </motion.div>
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
                className={`inline-flex items-center gap-x-[1.5px] rounded-md border px-[3px] py-[2.5px] font-medium text-[8px] leading-[8px] tracking-normal lg:gap-x-1 lg:rounded-lg lg:px-[5px] lg:py-px lg:text-[12px] lg:leading-4 ${getBadgeStyles(
                  cell.variant
                )}`}
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

  const getCellClasses = (cell: TableCell, colIndex: number) => {
    const baseClasses =
      "h-full w-full flex items-center truncate border-[#EEEFF1] border-r border-b font-medium text-slate-700 gap-x-1 pt-[7px] pb-1.5 text-[10px] leading-[14px] tracking-[-0.2px] lg:gap-x-1.5 lg:pt-[10px] lg:pb-[9px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]";

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
      <div className="flex flex-wrap gap-2">
        {buttons.map((button) => {
          const active = activeTable === button.id;
          return (
            <button
              key={button.id}
              onClick={() => setActiveTable(button.id)}
              className={`${buttonBase} ${active ? buttonDefault : buttonSecondary}`}
            >
              {button.label}
            </button>
          );
        })}
      </div>

      <div className="pointer-events-none grid select-none auto-rows-[28px] grid-cols-[118px_1fr_1fr] border-[#EEEFF1] border-t border-l transition-[grid-template-columns] duration-700 [transition-timing-function:cubic-bezier(0.65,0,0.35,1)] md:grid-cols-[118px_1fr_1fr_1fr] lg:auto-rows-[40px] lg:grid-cols-[173px_1fr_1fr_1fr]">
        <AnimatePresence mode="popLayout">
          {tableData.map((row, rowIndex) => {
            const rowKey = getRowKey(row);
            return row.map((cell, colIndex) => (
              <div
                className={getCellClasses(cell, colIndex)}
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
    <div className="min-h-screen bg-white p-8 text-slate-900">
      <div className="mx-auto w-full max-w-5xl">
        <TableBlock />
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
