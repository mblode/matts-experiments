import { motion } from "framer-motion";
import * as React from "react";
import { useState } from "react";
import { createRoot } from "react-dom/client";
const Image = ({ fill, style, ...props }) => {
  const mergedStyle = fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style } : style;
  return /* @__PURE__ */ React.createElement("img", { style: mergedStyle, ...props });
};
const DocumentShadowBlock = () => {
  const [diceValue, setDiceValue] = useState(5);
  const [shadowNumber, setShadowNumber] = useState(1);
  const [degree, setDegree] = useState(0);
  const [_shadows, setShadows] = useState([
    {
      top: "10%",
      left: "15%",
      width: "600px",
      height: "600px",
      color: "bg-gray-800",
      blur: "blur-[120px]"
    },
    {
      top: "40%",
      right: "20%",
      width: "500px",
      height: "500px",
      color: "bg-gray-700",
      blur: "blur-[100px]"
    },
    {
      bottom: "15%",
      left: "30%",
      width: "550px",
      height: "550px",
      color: "bg-gray-900",
      blur: "blur-[110px]"
    },
    {
      top: "60%",
      right: "40%",
      width: "450px",
      height: "450px",
      color: "bg-gray-600",
      blur: "blur-[90px]"
    }
  ]);
  const generateRandomShadows = () => {
    const colors = [
      "bg-gray-800",
      "bg-gray-700",
      "bg-gray-900",
      "bg-gray-600",
      "bg-gray-500"
    ];
    const blurs = [
      "blur-[90px]",
      "blur-[100px]",
      "blur-[110px]",
      "blur-[120px]",
      "blur-[130px]"
    ];
    const sizes = ["450px", "500px", "550px", "600px", "650px"];
    return Array.from({ length: 4 }, () => {
      const useTop = Math.random() > 0.5;
      const useLeft = Math.random() > 0.5;
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      return {
        [useTop ? "top" : "bottom"]: `${Math.floor(Math.random() * 70 + 10)}%`,
        [useLeft ? "left" : "right"]: `${Math.floor(Math.random() * 60 + 10)}%`,
        width: size,
        height: size,
        color: colors[Math.floor(Math.random() * colors.length)],
        blur: blurs[Math.floor(Math.random() * blurs.length)]
      };
    });
  };
  const rollDice = () => {
    setDegree((prev) => prev + 90);
    let newValue = 0;
    do {
      newValue = Math.floor(Math.random() * 6) + 1;
    } while (newValue === diceValue);
    const newShadowNumber = Math.floor(Math.random() * 100) + 1;
    setShadows(generateRandomShadows());
    setDiceValue(newValue);
    setShadowNumber(newShadowNumber);
  };
  const renderDots = () => {
    const dotPositions = {
      1: ["center"],
      2: ["top-left", "bottom-right"],
      3: ["top-left", "center", "bottom-right"],
      4: ["top-left", "top-right", "bottom-left", "bottom-right"],
      5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
      6: [
        "top-left",
        "top-right",
        "middle-left",
        "middle-right",
        "bottom-left",
        "bottom-right"
      ]
    };
    const positions = dotPositions[diceValue];
    return positions.map((pos, _i) => {
      let positionClasses = "";
      switch (pos) {
        case "top-left":
          positionClasses = "top-2 left-2";
          break;
        case "top-right":
          positionClasses = "top-2 right-2";
          break;
        case "center":
          positionClasses = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
          break;
        case "middle-left":
          positionClasses = "top-1/2 left-2 -translate-y-1/2";
          break;
        case "middle-right":
          positionClasses = "top-1/2 right-2 -translate-y-1/2";
          break;
        case "bottom-left":
          positionClasses = "bottom-2 left-2";
          break;
        case "bottom-right":
          positionClasses = "bottom-2 right-2";
          break;
        default:
          positionClasses = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
      }
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          className: `absolute h-2 w-2 rounded-full bg-gray-900 ${positionClasses}`,
          key: pos
        }
      );
    });
  };
  return /* @__PURE__ */ React.createElement("div", { className: "relative flex min-h-screen w-full items-center justify-center bg-[#D1D7DC] px-6 py-12" }, /* @__PURE__ */ React.createElement("div", { className: "pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden" }, /* @__PURE__ */ React.createElement(
    Image,
    {
      alt: "Shadow overlay",
      className: "object-cover opacity-20 mix-blend-multiply transition-opacity duration-1000",
      fill: true,
      priority: true,
      sizes: "100vw",
      src: `/shadows/${String(shadowNumber).padStart(3, "0")}.png`
    }
  )), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "relative z-10 aspect-[1/1.414] w-full max-w-2xl bg-[#E7EAED] p-8 font-serif after:pointer-events-none after:absolute after:inset-0 after:z-[-1] after:bg-repeat after:opacity-40 after:mix-blend-multiply after:content-[''] sm:p-12",
      style: {
        boxShadow: "var(--shadow-elevation-medium), inset -2px 2px 4px rgba(255, 255, 255, 0.5)"
      }
    },
    /* @__PURE__ */ React.createElement(
      "button",
      {
        "aria-label": "Roll dice to randomize",
        className: "absolute -top-4 -right-4 z-[100] flex size-24 cursor-pointer items-center justify-center rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900",
        onClick: rollDice,
        style: {
          boxShadow: "var(--shadow-elevation-high)"
        },
        type: "button"
      },
      /* @__PURE__ */ React.createElement("div", { className: "group relative size-12" }, /* @__PURE__ */ React.createElement(
        motion.div,
        {
          animate: { rotate: degree },
          className: "relative z-10 size-12 cursor-pointer rounded-xl bg-white",
          transition: { type: "spring", stiffness: 260, damping: 20 },
          whileTap: {
            scale: 1.03
          }
        },
        renderDots()
      ), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 size-12 rounded-xl bg-white opacity-0 blur-lg transition-all group-hover:opacity-30" }))
    ),
    /* @__PURE__ */ React.createElement("div", { className: "mb-8 flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "relative size-16" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 z-10 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 shadow-lg" }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-[-2px] left-3 h-6 w-20 rounded-[50%] bg-gray-700" }))),
    /* @__PURE__ */ React.createElement("h1", { className: "mb-2 font-bold text-3xl text-gray-900 sm:text-4xl" }, "The brightest flame casts the darkest shadow"),
    /* @__PURE__ */ React.createElement("p", { className: "mt-6 text-gray-700 leading-relaxed" }, "Shadows are a natural and often overlooked part of our daily experience. From the long silhouettes cast by trees during sunset to the fleeting forms that follow our footsteps, shadows are more than just dark shapes\u2014they are the result of light interacting with objects. This document explores the nature of shadows, their formation, cultural significance, and their applications in science and art."),
    /* @__PURE__ */ React.createElement("p", { className: "mt-4 text-gray-700 leading-relaxed" }, "A shadow is a dark area or shape produced by an object blocking the path of light. When a light source encounters an opaque object, the object prevents some of the light from passing through, casting a shadow on the surface behind it. The shape and sharpness of a shadow depend on several factors:"),
    /* @__PURE__ */ React.createElement("p", { className: "mt-4 font-semibold text-gray-700" }, "There are three main types of shadows:"),
    /* @__PURE__ */ React.createElement("ol", { className: "mt-4 space-y-3 text-gray-700" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, "1. Umbra:"), " The darkest part of a shadow where all light is blocked."), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, "2. Penumbra:"), " The lighter, outer part of a shadow where some light still reaches."), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, "3. Antumbra:"), " A less common type, seen during eclipses when the object is smaller than the light source."))
  ));
};
function App() {
  return /* @__PURE__ */ React.createElement(DocumentShadowBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
