import { motion } from "motion/react";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
const CardStackBlock = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  const centerOffset = (containerWidth - 170) / 2;
  return /* @__PURE__ */ React.createElement("div", { className: "max-w-[1000px] overflow-x-auto rounded-3xl border border-border bg-card p-8" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "pointer-events-none relative z-[1] h-[400px] w-full",
      ref: containerRef
    },
    /* @__PURE__ */ React.createElement(
      "button",
      {
        "aria-pressed": isOpen,
        className: "pointer-events-auto relative flex h-full w-full cursor-pointer items-center justify-start border-0 bg-transparent p-0",
        onClick: () => setIsOpen(!isOpen),
        type: "button"
      },
      /* @__PURE__ */ React.createElement(
        motion.div,
        {
          animate: {
            x: isOpen ? 0 : centerOffset - 60,
            y: 0,
            rotate: isOpen ? 0 : -6,
            scale: isOpen ? 1 : 0.92
          },
          className: "pointer-events-auto absolute aspect-[9/16] w-full max-w-[170px] rounded-2xl bg-blue-500 shadow-lg transition-[shadow,scale] hover:scale-[1.02] hover:shadow-2xl",
          initial: {
            x: centerOffset - 30,
            y: 0,
            rotate: -6,
            scale: 0.92
          },
          style: { zIndex: 1 },
          transition: {
            duration: 0.6,
            ease: [0.165, 0.84, 0.44, 1]
          }
        }
      ),
      /* @__PURE__ */ React.createElement(
        motion.div,
        {
          animate: {
            x: isOpen ? 190 : centerOffset + 60,
            y: 0,
            rotate: isOpen ? 0 : 6,
            scale: isOpen ? 1 : 0.92
          },
          className: "pointer-events-auto absolute aspect-[9/16] w-full max-w-[170px] rounded-2xl bg-green-500 shadow-lg transition-[shadow,scale] hover:scale-[1.02] hover:shadow-2xl",
          initial: {
            x: centerOffset + 30,
            y: 0,
            rotate: 6,
            scale: 0.92
          },
          style: { zIndex: 2 },
          transition: {
            duration: 0.6,
            ease: [0.165, 0.84, 0.44, 1]
          }
        }
      ),
      /* @__PURE__ */ React.createElement(
        motion.div,
        {
          animate: {
            x: isOpen ? 380 : centerOffset,
            y: 0,
            rotate: 0,
            scale: 1
          },
          className: "pointer-events-auto absolute aspect-[9/16] w-full max-w-[170px] rounded-2xl bg-red-500 shadow-xl transition-[shadow,scale] hover:scale-[1.02] hover:shadow-2xl",
          initial: {
            x: centerOffset,
            y: 0,
            rotate: 0,
            scale: 1
          },
          style: { zIndex: 3 },
          transition: {
            duration: 0.6,
            ease: [0.165, 0.84, 0.44, 1]
          }
        }
      )
    )
  ));
};
function App() {
  return /* @__PURE__ */ React.createElement(CardStackBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
