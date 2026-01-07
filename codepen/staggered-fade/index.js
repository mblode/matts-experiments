import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import mergeRefs from "merge-refs";
import { AnimatePresence, motion, useInView } from "motion/react";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";
import { createRoot } from "react-dom/client";
const texts = [
  "Line graph",
  "Motion choreography",
  "Responsive interfaces",
  "Preface"
];
function useTextLoop() {
  const [active, setActive] = useState(texts[0]);
  const ref = useRef(null);
  const isInView = useInView(ref);
  useEffect(() => {
    if (!isInView) {
      return;
    }
    const interval = setInterval(() => {
      setActive((currentActive) => {
        const index = texts.indexOf(currentActive);
        const nextIndex = (index + 1) % texts.length;
        return texts[nextIndex];
      });
    }, 2e3);
    return () => clearInterval(interval);
  }, [isInView]);
  return [active, ref];
}
const StaggeredFadeBlock = () => {
  const [measureRef, bounds] = useMeasure();
  const [activeText, loopRef] = useTextLoop();
  const [isExpanded, setIsExpanded] = useState(true);
  const handleCollapse = () => {
    setIsExpanded(false);
    setTimeout(() => setIsExpanded(true), 2e3);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement("div", { className: "relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-gray-200 bg-white px-4 py-2 shadow-lg" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      animate: { width: bounds.width > 0 ? bounds.width : "auto" },
      className: "flex items-center gap-3",
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 55
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "flex w-fit items-center gap-3",
        ref: mergeRefs(measureRef, loopRef)
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-white" }, /* @__PURE__ */ React.createElement(CheckIcon, { className: "size-4" })),
      /* @__PURE__ */ React.createElement("div", { className: "font-medium text-gray-900 text-sm" }, /* @__PURE__ */ React.createElement(AnimatePresence, { initial: false, mode: "popLayout" }, /* @__PURE__ */ React.createElement("span", { className: "inline-flex", key: activeText }, activeText.split("").map((letter, index) => /* @__PURE__ */ React.createElement(
        motion.span,
        {
          animate: {
            opacity: isExpanded ? 1 : 0.7,
            filter: isExpanded ? "blur(0px)" : "blur(0.5px)",
            transition: {
              type: "spring",
              stiffness: 350,
              damping: 55,
              delay: index * 0.015
            }
          },
          className: "inline-block",
          exit: {
            opacity: 0,
            filter: "blur(2px)",
            transition: {
              type: "spring",
              stiffness: 500,
              damping: 55
            }
          },
          initial: {
            opacity: 0,
            filter: "blur(2px)"
          },
          key: index + letter + activeText
        },
        letter === " " ? "\xA0" : letter
      )))))
    )
  ), /* @__PURE__ */ React.createElement("div", { className: "z-10 flex flex-shrink-0 items-center gap-1 text-gray-600 text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "select-none" }, "yo@rauno.me"), isExpanded && /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "rounded p-0.5 transition-colors hover:bg-gray-100",
      onClick: handleCollapse,
      type: "button"
    },
    /* @__PURE__ */ React.createElement(ChevronsUpDownIcon, { className: "size-3 text-gray-400" })
  ))));
};
StaggeredFadeBlock;
function App() {
  return /* @__PURE__ */ React.createElement(StaggeredFadeBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
