import { LayoutGroup, motion } from "motion/react";
import * as React from "react";
import { useState } from "react";
import { createRoot } from "react-dom/client";
function DateCard({ day, isExpanded, onToggle }) {
  return /* @__PURE__ */ React.createElement(
    motion.div,
    {
      className: "w-64",
      initial: false,
      layout: true,
      transition: { layout: { duration: 0.3, ease: "easeOut" } }
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ React.createElement(
      motion.div,
      {
        animate: {
          height: isExpanded ? 160 : 64,
          backgroundColor: isExpanded ? "#001f3f" : "#ffffff"
        },
        className: "relative flex w-64 cursor-pointer items-center justify-center overflow-hidden rounded-2xl shadow-lg",
        initial: false,
        onClick: onToggle,
        transition: {
          height: { duration: 0.3, ease: "easeOut" },
          backgroundColor: { duration: 0.4, ease: "easeOut" },
          opacity: { duration: 0.2, ease: "easeOut" },
          scale: { duration: 0.15 }
        },
        whileHover: isExpanded ? {} : { scale: 1.02 },
        whileTap: { scale: 0.98 }
      },
      /* @__PURE__ */ React.createElement(
        motion.h1,
        {
          animate: {
            fontSize: isExpanded ? "5rem" : "1.5rem",
            color: isExpanded ? "#ffffff" : "#001f3f"
          },
          className: "absolute m-0 font-extrabold",
          initial: false,
          style: {
            lineHeight: 1
          },
          transition: {
            fontSize: { duration: 0.3, ease: "easeOut" },
            color: { duration: 0.15, ease: "easeOut" }
          }
        },
        day
      )
    ), /* @__PURE__ */ React.createElement(
      motion.div,
      {
        animate: {
          height: isExpanded ? 48 : 0,
          marginTop: isExpanded ? 8 : 0
        },
        className: "overflow-hidden",
        initial: { height: 0, marginTop: 0 },
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      },
      /* @__PURE__ */ React.createElement(
        motion.p,
        {
          animate: {
            opacity: isExpanded ? 1 : 0,
            y: isExpanded ? 0 : -10
          },
          className: "box-border flex h-10 w-64 cursor-pointer items-center justify-center rounded-xl bg-white p-2 text-black shadow-md",
          initial: { opacity: 0, y: -10 },
          onClick: onToggle,
          transition: {
            duration: 0.2,
            delay: isExpanded ? 0.15 : 0
          }
        },
        "Day ",
        day,
        " - Today is clear"
      )
    ))
  );
}
const ExpandBlock = () => {
  const [expandedDay, setExpandedDay] = useState();
  const days = [25, 26, 27, 28, 29];
  const handleToggle = (day) => {
    setExpandedDay(expandedDay === day ? void 0 : day);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "p-8 font-sans" }, /* @__PURE__ */ React.createElement("p", { className: "mb-8 text-center" }, "Click on any date to expand it. Click another date to switch."), /* @__PURE__ */ React.createElement(LayoutGroup, null, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      className: "flex flex-col items-center gap-4",
      initial: false,
      layout: true
    },
    days.map((day) => /* @__PURE__ */ React.createElement(
      DateCard,
      {
        day,
        isExpanded: expandedDay === day,
        key: day,
        onToggle: () => handleToggle(day)
      }
    ))
  )));
};
function App() {
  return /* @__PURE__ */ React.createElement(ExpandBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
