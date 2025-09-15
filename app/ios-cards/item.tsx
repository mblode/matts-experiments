"use client";

import { motion } from "motion/react";
import { items } from "./data";
import { X } from "lucide-react";

interface ItemProps {
  id: string;
  setSelectedId: (id: string | null) => void;
}

export function Item({ id, setSelectedId }: ItemProps) {
  const item = items.find((item) => item.id === id);
  if (!item) return null;

  const { category, title } = item;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="fixed z-[1] bg-black/80 top-0 bottom-0 left-1/2 -translate-x-1/2 w-full pointer-events-auto"
        onClick={() => setSelectedId(null)}
      />

      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center p-4 sm:p-10 pointer-events-none">
        <motion.div
          className="relative h-auto w-full max-w-[700px] mx-auto bg-ios-card-bg rounded-[20px] overflow-hidden pointer-events-auto max-h-[90vh] overflow-y-auto"
          layoutId={`card-container-${id}`}
        >
          <motion.button
            className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            onClick={() => setSelectedId(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <X className="w-5 h-5 text-white" />
          </motion.button>

          <motion.div
            className="relative h-[250px] sm:h-[420px] w-full overflow-hidden"
            layoutId={`card-image-container-${id}`}
          >
            <img
              src={item.imageUrl}
              alt={title}
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute top-4 sm:top-[30px] left-4 sm:left-[30px] max-w-[300px] z-10"
            layoutId={`title-container-${id}`}
          >
            <span className="text-white text-xs sm:text-sm uppercase">
              {category}
            </span>
            <h2 className="text-white my-1 sm:my-2 text-xl sm:text-2xl font-semibold">
              {title}
            </h2>
          </motion.div>

          <motion.div
            className="pt-6 sm:pt-10 px-4 sm:px-9 pb-6 sm:pb-9"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <p className="text-[#9d9ca1] text-base sm:text-xl leading-6 sm:leading-7">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
