"use client";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export const CardStackBlock = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Calculate the offset to center the cards when stacked
  // Cards are 170px wide, when stacked they take about 170px total width
  const centerOffset = (containerWidth - 170) / 2;

  return (
    <div className="bg-card border border-border rounded-3xl p-8 overflow-x-auto max-w-[1000px]">
      <div
        className="relative h-[400px] w-full pointer-events-none z-[1]"
        ref={containerRef}
      >
        <div
          className="relative w-full h-full flex items-center cursor-pointer pointer-events-auto justify-start"
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            initial={{
              x: centerOffset - 30,
              y: 0,
              rotate: -6,
              scale: 0.92,
            }}
            animate={{
              x: isOpen ? 0 : centerOffset - 60,
              y: 0,
              rotate: isOpen ? 0 : -6,
              scale: isOpen ? 1 : 0.92,
            }}
            transition={{
              duration: 0.6,
              ease: [0.165, 0.84, 0.44, 1],
            }}
            style={{ zIndex: 1 }}
            className="absolute aspect-[9/16] max-w-[170px] w-full pointer-events-auto bg-blue-500 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-[shadow,scale]"
          />

          <motion.div
            initial={{
              x: centerOffset + 30,
              y: 0,
              rotate: 6,
              scale: 0.92,
            }}
            animate={{
              x: isOpen ? 190 : centerOffset + 60,
              y: 0,
              rotate: isOpen ? 0 : 6,
              scale: isOpen ? 1 : 0.92,
            }}
            transition={{
              duration: 0.6,
              ease: [0.165, 0.84, 0.44, 1],
            }}
            style={{ zIndex: 2 }}
            className="absolute aspect-[9/16] max-w-[170px] w-full pointer-events-auto bg-green-500 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-[shadow,scale]"
          />

          <motion.div
            initial={{
              x: centerOffset,
              y: 0,
              rotate: 0,
              scale: 1,
            }}
            animate={{
              x: isOpen ? 380 : centerOffset,
              y: 0,
              rotate: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.6,
              ease: [0.165, 0.84, 0.44, 1],
            }}
            style={{ zIndex: 3 }}
            className="absolute aspect-[9/16] max-w-[170px] w-full pointer-events-auto bg-red-500 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-[shadow,scale]"
          />
        </div>
      </div>
    </div>
  );
};
