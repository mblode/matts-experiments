"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import mergeRefs from "merge-refs";
import { AnimatePresence, motion, useInView } from "motion/react";
import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";

const texts = [
  "Line graph",
  "Motion choreography",
  "Responsive interfaces",
  "Preface",
];

/**
 * Hook to cycle through texts automatically
 */
function useTextLoop(): [string, React.RefObject<HTMLElement | null>] {
  const [active, setActive] = useState(texts[0]);
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (!isInView) {
      return;
    }
    const interval = setInterval(() => {
      setActive((currentActive) => {
        const index = texts.indexOf(currentActive);
        const nextIndex = (index + 1) % texts.length;
        return texts[nextIndex];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isInView]);

  return [active, ref];
}

/**
 * StaggeredFadeBlock with dynamic width measurement
 */
export const StaggeredFadeBlock = () => {
  const [measureRef, bounds] = useMeasure();
  const [activeText, loopRef] = useTextLoop();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCollapse = () => {
    setIsExpanded(false);
    setTimeout(() => setIsExpanded(true), 2000);
  };

  return (
    <div className="relative">
      <div className="relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-gray-200 bg-white px-4 py-2 shadow-lg">
        {/* Container with dynamic width */}
        <motion.div
          animate={{ width: bounds.width > 0 ? bounds.width : "auto" }}
          className="flex items-center gap-3"
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 55,
          }}
        >
          {/* Content that gets measured */}
          <div
            className="flex w-fit items-center gap-3"
            ref={mergeRefs(measureRef, loopRef) as React.Ref<HTMLDivElement>}
          >
            {/* Static checkmark */}
            <div className="flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
              <CheckIcon className="size-4" />
            </div>

            {/* Animated text */}
            <div className="font-medium text-gray-900 text-sm">
              <AnimatePresence initial={false} mode="popLayout">
                <span className="inline-flex" key={activeText}>
                  {activeText.split("").map((letter, index) => (
                    <motion.span
                      animate={{
                        opacity: isExpanded ? 1 : 0.7,
                        filter: isExpanded ? "blur(0px)" : "blur(0.5px)",
                        transition: {
                          type: "spring",
                          stiffness: 350,
                          damping: 55,
                          delay: index * 0.015,
                        },
                      }}
                      className="inline-block"
                      exit={{
                        opacity: 0,
                        filter: "blur(2px)",
                        transition: {
                          type: "spring",
                          stiffness: 500,
                          damping: 55,
                        },
                      }}
                      initial={{
                        opacity: 0,
                        filter: "blur(2px)",
                      }}
                      key={index + letter + activeText}
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                  ))}
                </span>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Email section */}
        <div className="z-10 flex flex-shrink-0 items-center gap-1 text-gray-600 text-sm">
          <span className="select-none">yo@rauno.me</span>
          {isExpanded && (
            <button
              className="rounded p-0.5 transition-colors hover:bg-gray-100"
              onClick={handleCollapse}
            >
              <ChevronsUpDownIcon className="size-3 text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaggeredFadeBlock;
