"use client";
import { motion } from "motion/react";
import { useState } from "react";

export const CardStackBlock = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full max-w-[500px] h-[320px] pointer-events-none z-[1]">
      <div
        className="relative w-full h-full flex items-center justify-center cursor-pointer pointer-events-auto"
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          initial={{
            x: -30,
            y: 0,
            rotate: -6,
            scale: 0.92,
          }}
          animate={{
            x: isOpen ? -165 : -90,
            y: 0,
            rotate: isOpen ? 0 : -6,
            scale: isOpen ? 1 : 0.92,
          }}
          transition={{
            duration: 0.6,
            ease: [0.165, 0.84, 0.44, 1],
          }}
          style={{ zIndex: 1 }}
          className="absolute aspect-[9/16] max-w-[170px] w-full pointer-events-auto bg-blue-500 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow"
        />

        <motion.div
          initial={{
            x: 30,
            y: 0,
            rotate: 6,
            scale: 0.92,
          }}
          animate={{
            x: isOpen ? 25 : 90,
            y: 0,
            rotate: isOpen ? 0 : 6,
            scale: isOpen ? 1 : 0.92,
          }}
          transition={{
            duration: 0.6,
            ease: [0.165, 0.84, 0.44, 1],
          }}
          style={{ zIndex: 2 }}
          className="absolute aspect-[9/16] max-w-[170px] w-full pointer-events-auto bg-green-500 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow"
        />

        <motion.div
          initial={{
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
          }}
          animate={{
            x: isOpen ? 215 : 0,
            y: 0,
            rotate: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
            ease: [0.165, 0.84, 0.44, 1],
          }}
          style={{ zIndex: 3 }}
          className="absolute aspect-[9/16] max-w-[170px] w-full pointer-events-auto bg-red-500 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
        />
      </div>
    </div>
  );
};
