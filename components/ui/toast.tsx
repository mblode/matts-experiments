"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface DynamicIslandContextType {
  state: string;
  setState: (state: string) => void;
}

const ToastContext = createContext<DynamicIslandContextType>({
  state: "idle",
  setState: () => {},
});

const springTransition = {
  type: "spring" as const,
  bounce: 0.35,
};

const useDynamicIsland = () => useContext(ToastContext);

function PendingView() {
  return (
    <div className="flex h-[48px] items-center justify-center gap-2.5 px-5 bg-[#E5F3FF] rounded-full">
      <div className="inline-flex items-center justify-center w-5 h-5 flex-shrink-0">
        <svg
          className="animate-spin"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="10"
            cy="10"
            r="7"
            stroke="#4EAFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="32"
            strokeDashoffset="8"
          />
        </svg>
      </div>
      <span className="text-base font-semibold text-[#4EAFFF] whitespace-nowrap">Loading...</span>
    </div>
  );
}

function ErrorView() {
  return (
    <div className="flex h-[48px] items-center justify-center gap-2.5 px-5 bg-[#FFE4E3] rounded-full">
      <motion.div 
        className="inline-flex items-center justify-center w-5 h-5 flex-shrink-0"
        initial={{ rotate: 0 }}
        animate={{
          rotate: [0, -15, 12, -10, 8, -6, 4, -2, 0],
        }}
        transition={{
          delay: 0.3,
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="10" cy="10" r="9" fill="#FF403F" />
          <text
            x="10"
            y="14"
            fontSize="11"
            fill="white"
            textAnchor="middle"
            fontWeight="bold"
          >
            !
          </text>
        </svg>
      </motion.div>
      <span className="text-base font-semibold text-[#FF403F] whitespace-nowrap">Error occurred</span>
    </div>
  );
}

function SuccessView() {
  return (
    <div className="flex h-[48px] items-center justify-center gap-2.5 px-5 bg-[#DBF4DE] rounded-full">
      <div className="inline-flex items-center justify-center w-5 h-5 flex-shrink-0">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="10" cy="10" r="9" fill="#35C759" />
          <path
            d="M6 10L9 13L14 7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-base font-semibold text-[#35C759] whitespace-nowrap">Success!</span>
    </div>
  );
}

const transitionVariants: Record<string, any> = {
  "ring-mode-idle": { scale: 0.9, scaleX: 0.9 },
  "timer-ring-mode": { scale: 0.7, y: -7.5 },
  "ring-mode-timer": { scale: 1.4, y: 7.5 },
  "timer-listening": { scaleY: 1.1, y: 7.5 },
  "listening-ring-mode": { scale: 0.65, y: -32 },
  "ring-mode-listening": { scale: 1.5, y: 12.5 },
  "timer-idle": { scale: 0.7, y: -7.5 },
  "listening-timer": { scaleY: 0.9, y: -12 },
  "listening-idle": { scale: 0.4, y: -36 },
  "idle-ring-mode": { scale: 0.9, scaleX: 0.9 },
  "idle-timer": { scale: 0.7, y: -7.5 },
  "idle-listening": { scale: 0.4, y: -36 },
};

export const Toast = () => {
  const [state, setState] = useState("idle");
  const [transition, setTransition] = useState<any>();
  const [bounceValue, setBounceValue] = useState(1);
  const [previousHeight, setPreviousHeight] = useState(28);
  const contentRef = useRef<HTMLDivElement>(null);

  function renderContent() {
    switch (state) {
      case "error":
        return <ErrorView />;
      case "success":
        return <SuccessView />;
      default:
        return <PendingView />;
    }
  }

  useLayoutEffect(() => {
    const element = contentRef.current;
    if (element) {
      const { height } = element.getBoundingClientRect();
      const heightDifference = Math.abs(height - previousHeight);
      const ratio = heightDifference / 100;

      let bounce =
        height < previousHeight ? 0.35 - 0.3 * ratio : 0.3 + 0.3 * ratio;
      bounce = Math.min(Math.max(bounce, 0.3), 0.35);

      if (heightDifference < 20) {
        bounce = 0.5;
      }

      setPreviousHeight(height);
      setBounceValue(bounce);
    }
  }, [state, previousHeight]);

  const handleStateChange = (newState: string) => {
    const transitionKey = `${state}-${newState}`;
    setTransition(transitionVariants[transitionKey]);
    setState(newState);
  };

  return (
    <ToastContext.Provider value={{ state, setState }}>
      <div className="flex h-[400px] w-full items-center justify-center bg-white border border-border">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <motion.div
              layout
              transition={{
                type: "spring",
                bounce: bounceValue,
              }}
              style={{ borderRadius: "9999px" }}
              className="min-w-[100px] overflow-hidden rounded-full"
            >
              <motion.div
                ref={contentRef}
                key={state}
                transition={{
                  type: "spring",
                  bounce: bounceValue,
                }}
                initial={{
                  scale: 0.9,
                  opacity: 0,
                  originX: 0.5,
                  originY: 0.5,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  originX: 0.5,
                  originY: 0.5,
                  transition: { delay: 0.05 },
                }}
              >
                {renderContent()}
              </motion.div>
            </motion.div>

            <div className="pointer-events-none absolute left-1/2 top-0 flex h-[200px] w-[300px] -translate-x-1/2 items-start justify-center">
              <AnimatePresence mode="popLayout" custom={transition}>
                <motion.div
                  key={state + "second"}
                  initial={{ opacity: 0 }}
                  exit="exit"
                  variants={{
                    exit: (custom: any) => ({
                      ...custom,
                      opacity: [1, 0],
                    }),
                  }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => handleStateChange("pending")}>
              Pending
            </Button>
            <Button onClick={() => handleStateChange("error")}>Error</Button>
            <Button onClick={() => handleStateChange("success")}>
              Success
            </Button>
          </div>
        </div>
      </div>
    </ToastContext.Provider>
  );
};
