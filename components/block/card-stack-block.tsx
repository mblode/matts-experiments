"use client";
import { motion } from "motion/react";

export const CardStackBlock = () => {
  return (
    <div className="relative w-full max-w-[400px] px-2 pointer-events-none z-[1]">
      <div
        className="grid gap-2 place-items-center"
        style={{
          gridTemplateColumns: "repeat(7, 1fr)",
          gridTemplateRows: "1fr",
        }}
      >
        <motion.div
          initial={{
            gridColumnEnd: "span 5",
            gridColumnStart: 2,
            gridRowEnd: 2,
            gridRowStart: 1,
            scale: 1,
            // scale: 0.8,
          }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
          className="z-[1] aspect-[9/16] max-w-[170px] w-full pointer-events-auto bg-red-500 rounded-page-widget-block transition-all hover:shadow-xl hover:scale-[1.02]"
        />

        <motion.div
          initial={{
            gridColumnEnd: "span 3",
            gridColumnStart: 1,
            gridRowEnd: 2,
            gridRowStart: 1,
            // translateX: "20%",
            rotate: -4,
            scale: 0.9,
          }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
          className="aspect-[9/16] max-w-[170px] w-full pointer-events-auto bg-blue-500 rounded-page-widget-block transition-all hover:shadow-xl hover:scale-[1.02]"
        />

        <motion.div
          initial={{
            gridColumnEnd: "span 3",
            gridColumnStart: 5,
            gridRowEnd: 2,
            gridRowStart: 1,
            // translateX: "20%",
            rotate: 4,
            scale: 0.9,
          }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
          className="aspect-[9/16] max-w-[170px] w-full pointer-events-auto bg-green-500 rounded-page-widget-block transition-all hover:shadow-xl hover:scale-[1.02]"
        />
      </div>
    </div>
  );
};
