"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { items } from "./data";

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
        className="fixed z-[1] bg-black/80 top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[990px] pointer-events-auto"
        onClick={() => setSelectedId(null)}
      />
      
      <div className="fixed top-0 left-0 right-0 z-10 p-10 max-sm:p-0 pointer-events-none">
        <motion.div 
          className="h-auto max-w-[700px] mx-auto bg-ios-card-bg rounded-[20px] overflow-hidden pointer-events-auto"
          layoutId={`card-container-${id}`}
        >
          <motion.div
            className="relative h-[420px] w-full overflow-hidden"
            layoutId={`card-image-container-${id}`}
          >
            <Image
              src={`https://via.placeholder.com/800x600/${item.backgroundColor.slice(1)}/ffffff?text=${encodeURIComponent(title)}`}
              alt={title}
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <motion.div
            className="absolute top-[30px] left-[30px] max-w-[300px] z-10"
            layoutId={`title-container-${id}`}
          >
            <span className="text-white text-sm uppercase">{category}</span>
            <h2 className="text-white my-2 text-2xl font-semibold">{title}</h2>
          </motion.div>
          
          <motion.div 
            className="pt-10 px-9 pb-9"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <p className="text-[#9d9ca1] text-xl leading-7">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}