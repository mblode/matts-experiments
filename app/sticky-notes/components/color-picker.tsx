"use client";

import { motion } from "motion/react";
import { useStickyNotesStore, PASTEL_COLORS } from "../store";

const colors = Object.values(PASTEL_COLORS);

export const ColorPicker = () => {
  const { currentColor, setCurrentColor } = useStickyNotesStore();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-50">
      {colors.map((color) => (
        <motion.button
          key={color}
          onClick={() => setCurrentColor(color)}
          className="w-10 h-10 rounded-full border border-black/12 shadow-md cursor-pointer"
          style={{ backgroundColor: color }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow:
              currentColor === color
                ? "0 0 0 2px rgba(0,0,0,0.3), 0 4px 6px -1px rgba(0,0,0,0.1)"
                : "0 4px 6px -1px rgba(0,0,0,0.1)",
          }}
        />
      ))}
    </div>
  );
};
