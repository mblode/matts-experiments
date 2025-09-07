"use client";
import { motion } from "motion/react";
import { useState } from "react";

export const CardStackBlock = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-card border border-border rounded-3xl p-8 overflow-x-auto max-w-[1000px]">
      <motion.div 
        className="relative h-[400px] w-full pointer-events-none z-[1]"
        layout
      >
        <motion.div
          className="relative w-full h-full flex items-center cursor-pointer pointer-events-auto"
          onClick={() => setIsOpen(!isOpen)}
          layout
          style={{ 
            justifyContent: isOpen ? "flex-start" : "center"
          }}
        >
          <motion.div
            layout
            animate={{
              rotate: isOpen ? 0 : -6,
              scale: isOpen ? 1 : 0.92,
              x: isOpen ? 0 : -30,
            }}
            transition={{
              duration: 0.6,
              ease: [0.165, 0.84, 0.44, 1],
            }}
            style={{ zIndex: 1 }}
            className="aspect-[9/16] max-w-[170px] w-full pointer-events-auto bg-blue-500 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-[shadow,scale]"
          />

          <motion.div
            layout
            animate={{
              rotate: isOpen ? 0 : 6,
              scale: isOpen ? 1 : 0.92,
              x: isOpen ? 0 : 30,
              marginLeft: isOpen ? 20 : -140,
            }}
            transition={{
              duration: 0.6,
              ease: [0.165, 0.84, 0.44, 1],
            }}
            style={{ zIndex: 2 }}
            className="aspect-[9/16] max-w-[170px] w-full pointer-events-auto bg-green-500 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-[shadow,scale]"
          />

          <motion.div
            layout
            animate={{
              rotate: 0,
              scale: 1,
              marginLeft: isOpen ? 20 : -140,
            }}
            transition={{
              duration: 0.6,
              ease: [0.165, 0.84, 0.44, 1],
            }}
            style={{ zIndex: 3 }}
            className="aspect-[9/16] max-w-[170px] w-full pointer-events-auto bg-red-500 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-[shadow,scale]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
