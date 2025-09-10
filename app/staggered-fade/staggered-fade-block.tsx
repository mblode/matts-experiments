"use client";

import * as React from "react";
import { useEffect, useState, useRef } from "react";
import useMeasure from "react-use-measure";
import { AnimatePresence, motion, useInView } from "motion/react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

const texts = [
  "Line graph",
  "Motion choreography",
  "Responsive interfaces",
  "Preface",
];

/**
 * Hook to cycle through texts automatically
 */
function useTextLoop(): [string, React.RefObject<HTMLDivElement | null>] {
  const [active, setActive] = useState(texts[0]);
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (!isInView) return;
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
 * Merge multiple refs into one
 */
function mergeRefs<T>(refs: Array<React.Ref<T> | undefined>) {
  return (value: T) => {
    refs.forEach(ref => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
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
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white shadow-lg border border-gray-200 relative overflow-hidden">
        {/* Container with dynamic width */}
        <motion.div
          className="flex items-center gap-3"
          animate={{ width: bounds.width > 0 ? bounds.width : "auto" }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 55,
          }}
        >
          {/* Content that gets measured */}
          <div
            ref={mergeRefs([measureRef, loopRef])}
            className="flex items-center gap-3 w-fit"
          >
            {/* Static checkmark */}
            <div className="rounded-full size-6 bg-green-500 text-white flex items-center justify-center flex-shrink-0">
              <CheckIcon className="size-4" />
            </div>

            {/* Animated text */}
            <div className="text-sm font-medium text-gray-900">
              <AnimatePresence mode="popLayout" initial={false}>
                <span key={activeText} className="inline-flex">
                  {activeText.split("").map((letter, index) => (
                    <motion.span
                      key={index + letter + activeText}
                      initial={{ 
                        opacity: 0, 
                        filter: "blur(2px)" 
                      }}
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
                      exit={{
                        opacity: 0,
                        filter: "blur(2px)",
                        transition: {
                          type: "spring",
                          stiffness: 500,
                          damping: 55,
                        },
                      }}
                      className="inline-block"
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
        <div className="flex items-center gap-1 text-sm text-gray-600 flex-shrink-0 z-10">
          <span className="select-none">yo@rauno.me</span>
          {isExpanded && (
            <button
              className="p-0.5 hover:bg-gray-100 rounded transition-colors"
              onClick={handleCollapse}
            >
              <ChevronsUpDownIcon className="size-3 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Dot indicator */}
      <motion.div
        className="absolute -right-2 -top-2 w-2 h-2 bg-green-500 rounded-full"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.3,
          type: "spring",
          stiffness: 350,
          damping: 55,
        }}
      />
    </div>
  );
};

export default StaggeredFadeBlock;