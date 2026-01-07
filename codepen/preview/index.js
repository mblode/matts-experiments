import { LayoutGroup, motion } from "motion/react";
import * as React from "react";
import { useState } from "react";
import { createRoot } from "react-dom/client";
const Image = ({ fill, style, ...props }) => {
  const mergedStyle = fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style } : style;
  return /* @__PURE__ */ React.createElement("img", { style: mergedStyle, ...props });
};
const springConfig = {
  type: "spring",
  stiffness: 300,
  damping: 30
};
const smoothEasing = [0.43, 0.13, 0.23, 0.96];
const Card = ({ id, isExpanded, onToggle }) => {
  return /* @__PURE__ */ React.createElement(
    motion.div,
    {
      className: "w-full",
      initial: false,
      layout: "position",
      transition: springConfig
    },
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        animate: {
          height: isExpanded ? 400 : 120,
          backgroundColor: isExpanded ? "#ffffff" : "#f3f4f6"
        },
        className: "relative cursor-pointer overflow-hidden border border-border",
        initial: false,
        onClick: onToggle,
        style: {
          borderRadius: 16,
          transformOrigin: "center top",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden"
        },
        transition: {
          height: { duration: 0.5, ease: smoothEasing },
          backgroundColor: { duration: 0.5, ease: smoothEasing },
          scale: { duration: 0.15, ease: "easeOut" }
        },
        whileHover: isExpanded ? { scale: 1 } : { scale: 1.02 },
        whileTap: { scale: 0.98 }
      },
      /* @__PURE__ */ React.createElement(
        motion.div,
        {
          className: "h-full p-4",
          initial: false,
          layout: "position",
          style: {
            display: "flex",
            flexDirection: isExpanded ? "column" : "row",
            justifyContent: isExpanded ? "center" : "flex-start",
            alignItems: isExpanded ? "center" : "center"
          },
          transition: springConfig
        },
        /* @__PURE__ */ React.createElement(
          motion.div,
          {
            animate: {
              width: isExpanded ? 280 : 86,
              height: isExpanded ? 280 : 86
            },
            className: "relative select-none overflow-hidden",
            initial: false,
            layout: "position",
            style: {
              borderRadius: isExpanded ? 24 : 12,
              order: isExpanded ? 2 : 1,
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              transform: "translate3d(0, 0, 0)"
            },
            transition: {
              width: { duration: 0.5, ease: smoothEasing },
              height: { duration: 0.5, ease: smoothEasing }
            }
          },
          /* @__PURE__ */ React.createElement(
            Image,
            {
              alt: `Rabbit ${id}`,
              className: "object-cover",
              fill: true,
              sizes: isExpanded ? "280px" : "86px",
              src: "https://placehold.co/500x500"
            }
          )
        ),
        /* @__PURE__ */ React.createElement(
          motion.h1,
          {
            animate: {
              fontSize: isExpanded ? "1.5rem" : "1.125rem",
              marginLeft: isExpanded ? 0 : 16,
              marginBottom: isExpanded ? 16 : 0
            },
            className: "select-none whitespace-nowrap font-semibold",
            initial: false,
            layout: "position",
            style: {
              order: isExpanded ? 1 : 2,
              textAlign: isExpanded ? "center" : "left"
            },
            transition: {
              fontSize: { duration: 0.5, ease: smoothEasing },
              marginLeft: { duration: 0.5, ease: smoothEasing },
              marginBottom: { duration: 0.5, ease: smoothEasing }
            }
          },
          "Rabbit #",
          id
        )
      )
    )
  );
};
const PreviewBlock = () => {
  const [expandedCard, setExpandedCard] = useState();
  const rabbitIds = [1, 2, 3, 4, 5];
  const handleToggle = (id) => {
    setExpandedCard(expandedCard === id ? void 0 : id);
  };
  return /* @__PURE__ */ React.createElement(LayoutGroup, null, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      className: "flex flex-col items-center gap-3",
      initial: false,
      layout: "position",
      transition: springConfig
    },
    rabbitIds.map((id) => /* @__PURE__ */ React.createElement(
      Card,
      {
        id,
        isExpanded: expandedCard === id,
        key: id,
        onToggle: () => handleToggle(id)
      }
    ))
  ));
};
function App() {
  return /* @__PURE__ */ React.createElement(PreviewBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
