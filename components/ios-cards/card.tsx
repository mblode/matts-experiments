"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface CardProps {
  id: string;
  title: string;
  category: string;
  backgroundColor: string;
  isSelected: boolean;
  isLarge?: boolean;
  setSelectedId: (id: string | null) => void;
}

export function Card({
  id,
  title,
  category,
  backgroundColor,
  isSelected,
  isLarge = false,
  setSelectedId,
}: CardProps) {
  return (
    <li
      className={`relative p-6 h-[460px] ${
        isLarge ? "flex-[0_0_60%] max-w-[60%]" : "flex-[0_0_40%] max-w-[40%]"
      } 
        odd:pl-0 even:pr-0
        max-md:flex-[0_0_50%] max-md:max-w-[50%]
        max-sm:flex-[1_0_100%] max-sm:max-w-full max-sm:p-2.5 max-sm:px-0`}
    >
      <div
        className="w-full h-full relative block cursor-pointer"
        onClick={() => setSelectedId(id)}
      >
        <motion.div
          className="relative rounded-[20px] bg-ios-card-bg overflow-hidden w-full h-full"
          layoutId={`card-container-${id}`}
        >
          <motion.div
            className="absolute top-0 left-0 overflow-hidden h-[420px] w-full"
            layoutId={`card-image-container-${id}`}
          >
            <Image
              src={`https://via.placeholder.com/600x400/${backgroundColor.slice(
                1
              )}/ffffff?text=${encodeURIComponent(title)}`}
              alt={title}
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute top-4 left-4 max-w-[300px]"
            layoutId={`title-container-${id}`}
          >
            <span className="text-white text-sm uppercase">{category}</span>
            <h2 className="text-white my-2 text-xl font-semibold">{title}</h2>
          </motion.div>
        </motion.div>
      </div>
    </li>
  );
}