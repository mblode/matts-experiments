"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ShadowShape {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width: string;
  height: string;
  color: string;
  blur: string;
}

export const DocumentShadowBlock = () => {
  const [diceValue, setDiceValue] = useState(5);
  const [shadowNumber, setShadowNumber] = useState(1);
  const [degree, setDegree] = useState(0);
  const [shadows, setShadows] = useState<ShadowShape[]>([
    {
      top: "10%",
      left: "15%",
      width: "600px",
      height: "600px",
      color: "bg-gray-800",
      blur: "blur-[120px]",
    },
    {
      top: "40%",
      right: "20%",
      width: "500px",
      height: "500px",
      color: "bg-gray-700",
      blur: "blur-[100px]",
    },
    {
      bottom: "15%",
      left: "30%",
      width: "550px",
      height: "550px",
      color: "bg-gray-900",
      blur: "blur-[110px]",
    },
    {
      top: "60%",
      right: "40%",
      width: "450px",
      height: "450px",
      color: "bg-gray-600",
      blur: "blur-[90px]",
    },
  ]);

  const generateRandomShadows = (): ShadowShape[] => {
    const colors = [
      "bg-gray-800",
      "bg-gray-700",
      "bg-gray-900",
      "bg-gray-600",
      "bg-gray-500",
    ];
    const blurs = [
      "blur-[90px]",
      "blur-[100px]",
      "blur-[110px]",
      "blur-[120px]",
      "blur-[130px]",
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
        blur: blurs[Math.floor(Math.random() * blurs.length)],
      };
    });
  };

  const rollDice = () => {
    setDegree((prev) => prev + 90);
    let newValue;
    do {
      newValue = Math.floor(Math.random() * 6) + 1;
    } while (newValue === diceValue);
    const newShadowNumber = Math.floor(Math.random() * 100) + 1;
    setShadows(generateRandomShadows());
    setDiceValue(newValue);
    setShadowNumber(newShadowNumber);
  };

  const renderDots = () => {
    const dotPositions: Record<number, string[]> = {
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
        "bottom-right",
      ],
    };

    const positions = dotPositions[diceValue];

    return positions.map((pos, i) => {
      let positionClasses = "";
      switch (pos) {
        case "top-left":
          positionClasses = "top-2 left-2";
          break;
        case "top-right":
          positionClasses = "top-2 right-2";
          break;
        case "center":
          positionClasses =
            "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
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
      }

      return (
        <div
          key={i}
          className={`absolute w-2 h-2 bg-gray-900 rounded-full ${positionClasses}`}
        />
      );
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#D1D7DC] flex items-center justify-center px-6 py-12">
      {/* Shadow Image Overlay */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50 flex items-center justify-center">
        <img
          src={`/shadows/${String(shadowNumber).padStart(3, "0")}.png`}
          alt="Shadow overlay"
          className="w-full h-full object-cover opacity-30 mix-blend-multiply transition-opacity duration-1000"
        />
      </div>

      {/* Document Card */}
      <div
        className="relative font-serif z-10 max-w-2xl w-full bg-[#E7EAED] p-8 sm:p-12 aspect-[1/1.414] after:content-[''] after:absolute after:inset-0 after:bg-repeat after:opacity-40 after:pointer-events-none after:mix-blend-multiply after:z-[-1]"
        style={{
          boxShadow:
            "-8px 4px 8px rgba(0, 0, 0, 0.25), inset 2px 2px 4px rgba(255, 255, 255, 0.5)",
        }}
      >
        {/* Sphere with Shadow */}
        <div className="mb-8 flex items-center gap-4">
          <div className="relative size-16">
            <div className="inset-0 absolute w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-full shadow-lg z-10" />
            <div className="absolute bottom-[-2px] left-3 w-20 h-6 bg-gray-700 rounded-[50%]" />
          </div>
        </div>

        {/* Dice Button */}
        <div className="absolute -top-4 -right-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl z-[100] size-24 flex items-center justify-center">
          <div className="relative group size-12">
            <motion.button
              onClick={rollDice}
              aria-label="Roll dice to randomize"
              className="cursor-pointer relative z-10 bg-white size-12 rounded-xl"
              animate={{ rotate: degree }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              whileTap={{
                scale: 1.03,
              }}
            >
              {renderDots()}
            </motion.button>

            <div className="absolute inset-0 opacity-0 bg-white blur-lg rounded-xl size-12 transition-all group-hover:opacity-30" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          The brightest flame casts the darkest shadow
        </h1>

        <p className="text-gray-700 mt-6 leading-relaxed">
          Shadows are a natural and often overlooked part of our daily
          experience. From the long silhouettes cast by trees during sunset to
          the fleeting forms that follow our footsteps, shadows are more than
          just dark shapes—they are the result of light interacting with
          objects. This document explores the nature of shadows, their
          formation, cultural significance, and their applications in science
          and art.
        </p>

        <p className="text-gray-700 mt-4 leading-relaxed">
          A shadow is a dark area or shape produced by an object blocking the
          path of light. When a light source encounters an opaque object, the
          object prevents some of the light from passing through, casting a
          shadow on the surface behind it. The shape and sharpness of a shadow
          depend on several factors:
        </p>

        <p className="text-gray-700 mt-4 font-semibold">
          There are three main types of shadows:
        </p>

        <ol className="mt-4 space-y-3 text-gray-700">
          <li>
            <span className="font-bold">1. Umbra:</span> The darkest part of a
            shadow where all light is blocked.
          </li>
          <li>
            <span className="font-bold">2. Penumbra:</span> The lighter, outer
            part of a shadow where some light still reaches.
          </li>
          <li>
            <span className="font-bold">3. Antumbra:</span> A less common type,
            seen during eclipses when the object is smaller than the light
            source.
          </li>
        </ol>
      </div>
    </div>
  );
};
