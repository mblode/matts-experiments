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
import { Button } from "@/components/ui/button";

interface DynamicIslandContextType {
  state: string;
  setState: (state: string) => void;
}

const DynamicIslandContext = createContext<DynamicIslandContextType>({
  state: "idle",
  setState: () => {},
});

const springTransition = {
  type: "spring" as const,
  bounce: 0.35,
};

const useDynamicIsland = () => useContext(DynamicIslandContext);

interface AudioBarProps {
  baseLength?: number;
  paused: boolean;
}

const AudioBar = memo(function AudioBar({
  baseLength = 50,
  paused,
}: AudioBarProps) {
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    if (paused) {
      setAnimating(false);
    } else {
      const timer = setTimeout(() => {
        setAnimating(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [paused]);

  const generateHeights = (base: number) => {
    const heights = [];
    for (let i = 0; i < 5; i++) {
      heights.push(
        (Math.floor(Math.random() * 24) - 24) / 2 + (base / 100) * 24,
      );
    }
    heights.push(heights[0]);
    return heights;
  };

  return (
    <motion.div
      className="col-span-1 mx-auto my-auto h-6 w-[1.25px] scale-125 rounded-full bg-gradient-to-t from-[#675470] to-[#395978]"
      animate={{
        height: paused
          ? 1
          : animating
            ? generateHeights(baseLength)
            : baseLength / 5,
      }}
      transition={
        paused || !animating
          ? {
              duration: 0.3,
              ease: "easeInOut",
            }
          : {
              duration: 1.1,
              ease: "easeInOut",
              times: [0.2, 0.3, 0.5, 0.7, 1.1, 1.3, 1.7],
              repeat: 1 / 0,
            }
      }
    />
  );
});

interface TimerProps {
  className?: string;
  paused: boolean;
}

function Timer({ className, paused }: TimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (paused ? prev : prev === 60 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, paused]);

  const digits = seconds.toString().padStart(2, "0").split("");

  return (
    <div
      className={cn("relative overflow-hidden whitespace-nowrap", className)}
    >
      0:
      <AnimatePresence initial={false} mode="popLayout">
        {digits.map((digit, index) => (
          <motion.div
            key={digit + index}
            className="inline-block tabular-nums"
            initial={{
              y: "12px",
              filter: "blur(2px)",
              opacity: 0,
            }}
            animate={{
              y: "0",
              filter: "blur(0px)",
              opacity: 1,
            }}
            exit={{
              y: "-12px",
              filter: "blur(2px)",
              opacity: 0,
            }}
            transition={springTransition}
          >
            {digit}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface PlayPauseButtonProps {
  initial: React.ReactNode;
  active: React.ReactNode;
  isActive: boolean;
}

function PlayPauseButton({ initial, active, isActive }: PlayPauseButtonProps) {
  return (
    <AnimatePresence initial={false} mode="wait">
      {isActive ? (
        <motion.div
          key="play"
          initial={{ opacity: 0, scale: 0.5 }}
          exit={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.1, bounce: 0.4 }}
        >
          {active}
        </motion.div>
      ) : (
        <motion.div
          key="pause"
          initial={{ opacity: 0, scale: 0.5 }}
          exit={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.1, bounce: 0.4 }}
        >
          {initial}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TimerView() {
  const { setState } = useDynamicIsland();
  const [paused, setPaused] = useState(false);

  return (
    <div className="flex w-full items-center gap-2 p-4 py-3">
      <button
        aria-label="Pause timer"
        onClick={() => setPaused((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5A3C07] transition-colors hover:bg-[#694608]"
      >
        <PlayPauseButton
          initial={
            <svg
              viewBox="0 0 10 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 fill-current text-[#FDB000]"
            >
              <path d="M1.03906 12.7266H2.82031C3.5 12.7266 3.85938 12.3672 3.85938 11.6797V1.03906C3.85938 0.328125 3.5 0 2.82031 0H1.03906C0.359375 0 0 0.359375 0 1.03906V11.6797C0 12.3672 0.359375 12.7266 1.03906 12.7266ZM6.71875 12.7266H8.49219C9.17969 12.7266 9.53125 12.3672 9.53125 11.6797V1.03906C9.53125 0.328125 9.17969 0 8.49219 0H6.71875C6.03125 0 5.67188 0.359375 5.67188 1.03906V11.6797C5.67188 12.3672 6.03125 12.7266 6.71875 12.7266Z" />
            </svg>
          }
          active={
            <svg
              viewBox="0 0 12 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 fill-current text-[#FDB000]"
            >
              <path d="M0.9375 13.2422C1.25 13.2422 1.51562 13.1172 1.82812 12.9375L10.9375 7.67188C11.5859 7.28906 11.8125 7.03906 11.8125 6.625C11.8125 6.21094 11.5859 5.96094 10.9375 5.58594L1.82812 0.3125C1.51562 0.132812 1.25 0.015625 0.9375 0.015625C0.359375 0.015625 0 0.453125 0 1.13281V12.1172C0 12.7969 0.359375 13.2422 0.9375 13.2422Z" />
            </svg>
          }
          isActive={paused}
        />
      </button>
      <button
        aria-label="Exit"
        onClick={() => setState("idle")}
        className="mr-12 flex h-10 w-10 items-center justify-center rounded-full bg-[#3C3D3C] text-white transition-colors hover:bg-[#4A4B4A]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="flex items-baseline gap-1.5 text-[#FDB000]">
        <span className="text-sm font-semibold leading-none">Timer</span>
        <Timer paused={paused} className="w-[64px] text-3xl font-light" />
      </div>
    </div>
  );
}

function IdleView() {
  return <div className="h-[28px]" />;
}

function RingModeView() {
  const [isSilent, setIsSilent] = useState(false);
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsInitial(false);
        setIsSilent((prev) => !prev);
      },
      isInitial ? 1000 : 2000,
    );
    return () => clearTimeout(timer);
  }, [isSilent, isInitial]);

  return (
    <motion.div
      initial={{ width: 128 }}
      animate={{ width: isSilent ? 148 : 128 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className="relative flex h-[28px] items-center justify-between px-2.5"
    >
      <motion.div
        initial={{ width: 0, opacity: 0, filter: "blur(4px)" }}
        animate={{
          width: isSilent ? 40 : 0,
          opacity: isSilent ? 1 : 0,
          filter: isSilent ? "blur(0px)" : "blur(4px)",
        }}
        transition={springTransition}
        className="absolute left-[5px] h-[18px] w-12 cursor-pointer rounded-full bg-[#FD4F30]"
      />
      <button
        className="relative h-[12.75px] w-[11.25px]"
        onClick={() => setIsSilent((prev) => !prev)}
      >
        <motion.svg
          className="absolute inset-0"
          initial={false}
          animate={{
            rotate: isSilent
              ? [0, -15, 5, -2, 0]
              : [0, 20, -15, 12.5, -10, 10, -7.5, 7.5, -5, 5, 0],
            x: isSilent ? 8.5 : 0,
          }}
          width="11.25"
          height="12.75"
          viewBox="0 0 15 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.17969 13.3125H13.5625C14.2969 13.3125 14.7422 12.9375 14.7422 12.3672C14.7422 11.5859 13.9453 10.8828 13.2734 10.1875C12.7578 9.64844 12.6172 8.53906 12.5547 7.64062C12.5 4.64062 11.7031 2.57812 9.625 1.82812C9.32812 0.804688 8.52344 0 7.36719 0C6.21875 0 5.40625 0.804688 5.11719 1.82812C3.03906 2.57812 2.24219 4.64062 2.1875 7.64062C2.125 8.53906 1.98438 9.64844 1.46875 10.1875C0.789062 10.8828 0 11.5859 0 12.3672C0 12.9375 0.4375 13.3125 1.17969 13.3125ZM7.36719 16.4453C8.69531 16.4453 9.66406 15.4766 9.76562 14.3828H4.97656C5.07812 15.4766 6.04688 16.4453 7.36719 16.4453Z"
            fill="white"
          />
        </motion.svg>
        <motion.div
          className="absolute inset-0"
          animate={{
            rotate: isSilent
              ? [0, -15, 5, -2, 0]
              : [0, 20, -15, 12.5, -10, 10, -7.5, 7.5, -5, 5, 0],
            x: isSilent ? 8.5 : 0,
          }}
        >
          <motion.div className="h-5 -translate-y-[5px] translate-x-[5.25px] rotate-[-40deg] overflow-hidden">
            <motion.div
              animate={{ height: isSilent ? 16 : 0 }}
              transition={{
                ease: "easeInOut",
                duration: isSilent ? 0.125 : 0.05,
                delay: isSilent ? 0.15 : 0,
              }}
              className="w-fit rounded-full"
            >
              <div className="flex h-full w-[3px] items-center justify-center rounded-full bg-[#FD4F30]">
                <div className="h-full w-[0.75px] rounded-full bg-white" />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </button>
      <div className="relative flex w-[32px] items-center">
        <motion.span
          animate={
            isSilent ? { opacity: 0, scale: 0.25, filter: "blur(4px)" } : {}
          }
          className="ml-auto text-xs font-medium text-white"
        >
          Ring
        </motion.span>
        <motion.span
          animate={
            isSilent
              ? { opacity: 1, scale: 1, filter: "blur(0)" }
              : { opacity: 0, scale: 0.25, filter: "blur(4px)" }
          }
          className="absolute text-xs font-medium text-[#FD4F30]"
        >
          Silent
        </motion.span>
      </div>
    </motion.div>
  );
}

function ListeningView() {
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (paused) return prev;
        if (prev === 214) {
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [paused]);

  const formatTime = () => {
    const secs = `0${seconds % 60}`.slice(-2);
    const mins = `${Math.floor(seconds / 60)}`;
    const formattedMins = `0${Number(mins) % 60}`.slice(-2);
    return `${formattedMins}:${secs}`;
  };

  return (
    <div className="w-[316px] p-[18px]">
      <div className="flex items-center gap-3">
        <img
          className="rounded-lg"
          alt="Anniversary's album cover"
          src="https://placehold.co/100x100"
          width={52}
          height={52}
        />
        <div className="flex flex-col gap-1 pr-12">
          <span className="whitespace-nowrap text-sm font-medium leading-none text-white">
            Timeless Interlude
          </span>
          <span className="text-sm leading-none text-gray-400">
            Bryson Tiller
          </span>
        </div>
        <div className="grid h-full grid-cols-11 justify-center gap-[2px] bg-transparent">
          <AudioBar paused={paused} baseLength={50} />
          <AudioBar paused={paused} baseLength={60} />
          <AudioBar paused={paused} baseLength={70} />
          <AudioBar paused={paused} baseLength={90} />
          <AudioBar paused={paused} baseLength={80} />
          <AudioBar paused={paused} baseLength={90} />
          <AudioBar paused={paused} baseLength={70} />
          <AudioBar paused={paused} baseLength={60} />
          <AudioBar paused={paused} baseLength={50} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1">
        <span className="text-xs tabular-nums text-gray-400 transition-colors">
          {formatTime()}
        </span>
        <div className="relative h-[3px] flex-grow overflow-hidden rounded-full bg-[#2C2C29]">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: `${(seconds / 214) * 100 - 99}%` }}
            transition={{ duration: 1, ease: "linear" }}
            className="absolute bottom-0 left-0 top-0 w-full bg-gray-400"
          />
        </div>
        <span className="text-xs tabular-nums text-gray-400 transition-colors">
          3:34
        </span>
      </div>
      <div className="mt-3 flex items-center justify-center gap-4 pb-1">
        <button>
          <svg
            width="22"
            height="13"
            viewBox="0 0 22 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.64844 12.2891C10.2578 12.2891 10.7734 11.8203 10.7734 10.9531V1.35156C10.7734 0.484375 10.2578 0.015625 9.64844 0.015625C9.32812 0.015625 9.07031 0.117188 8.75 0.304688L0.789062 4.99219C0.234375 5.32031 0 5.70312 0 6.14844C0 6.60156 0.234375 6.98438 0.789062 7.3125L8.75 12C9.0625 12.1875 9.32812 12.2891 9.64844 12.2891ZM20.3828 12.2891C20.9922 12.2891 21.5078 11.8203 21.5078 10.9531V1.35156C21.5078 0.484375 20.9922 0.015625 20.3828 0.015625C20.0625 0.015625 19.8047 0.117188 19.4844 0.304688L11.5234 4.99219C10.9688 5.32031 10.7344 5.70312 10.7344 6.14844C10.7344 6.60156 10.9688 6.98438 11.5234 7.3125L19.4844 12C19.7969 12.1875 20.0625 12.2891 20.3828 12.2891Z"
              fill="white"
            />
          </svg>
        </button>
        <button onClick={() => setPaused((prev) => !prev)}>
          <PlayPauseButton
            initial={
              <svg
                viewBox="0 0 10 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 fill-current text-white"
              >
                <path d="M1.03906 12.7266H2.82031C3.5 12.7266 3.85938 12.3672 3.85938 11.6797V1.03906C3.85938 0.328125 3.5 0 2.82031 0H1.03906C0.359375 0 0 0.359375 0 1.03906V11.6797C0 12.3672 0.359375 12.7266 1.03906 12.7266ZM6.71875 12.7266H8.49219C9.17969 12.7266 9.53125 12.3672 9.53125 11.6797V1.03906C9.53125 0.328125 9.17969 0 8.49219 0H6.71875C6.03125 0 5.67188 0.359375 5.67188 1.03906V11.6797C5.67188 12.3672 6.03125 12.7266 6.71875 12.7266Z" />
              </svg>
            }
            active={
              <svg
                viewBox="0 0 12 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 fill-current text-white"
              >
                <path d="M0.9375 13.2422C1.25 13.2422 1.51562 13.1172 1.82812 12.9375L10.9375 7.67188C11.5859 7.28906 11.8125 7.03906 11.8125 6.625C11.8125 6.21094 11.5859 5.96094 10.9375 5.58594L1.82812 0.3125C1.51562 0.132812 1.25 0.015625 0.9375 0.015625C0.359375 0.015625 0 0.453125 0 1.13281V12.1172C0 12.7969 0.359375 13.2422 0.9375 13.2422Z" />
              </svg>
            }
            isActive={paused}
          />
        </button>
        <button>
          <svg
            width="22"
            height="13"
            viewBox="0 0 22 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.125 12.2891C1.44531 12.2891 1.71094 12.1875 2.02344 12L9.98438 7.3125C10.5391 6.98438 10.7812 6.60156 10.7812 6.14844C10.7812 5.70312 10.5391 5.32031 9.98438 4.99219L2.02344 0.304688C1.70312 0.117188 1.44531 0.015625 1.125 0.015625C0.515625 0.015625 0 0.484375 0 1.35156V10.9531C0 11.8203 0.515625 12.2891 1.125 12.2891ZM11.8594 12.2891C12.1797 12.2891 12.4453 12.1875 12.7578 12L20.7266 7.3125C21.2734 6.98438 21.5156 6.60156 21.5156 6.14844C21.5156 5.70312 21.2734 5.32031 20.7266 4.99219L12.7578 0.304688C12.4453 0.117188 12.1797 0.015625 11.8594 0.015625C11.25 0.015625 10.7344 0.484375 10.7344 1.35156V10.9531C10.7344 11.8203 11.25 12.2891 11.8594 12.2891Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

const transitionVariants: Record<string, any> = {
  "ring-mode-idle": { scale: 0.9, scaleX: 0.9 },
  "timer-ring-mode": { scale: 0.7, y: -7.5 },
  "ring-mode-timer": { scale: 1.4, y: 7.5 },
  "timer-listenning": { scaleY: 1.1, y: 7.5 },
  "listenning-ring-mode": { scale: 0.65, y: -32 },
  "ring-mode-listenning": { scale: 1.5, y: 12.5 },
  "timer-idle": { scale: 0.7, y: -7.5 },
  "listenning-timer": { scaleY: 0.9, y: -12 },
  "listenning-idle": { scale: 0.4, y: -36 },
};

const exitVariants = {
  exit: (custom: any) => ({
    ...custom,
    opacity: [1, 0],
    filter: "blur(5px)",
  }),
};

export const DynamicIslandBlock = () => {
  const [state, setState] = useState("idle");
  const [transition, setTransition] = useState<any>();
  const [bounceValue, setBounceValue] = useState(1);
  const [previousHeight, setPreviousHeight] = useState(28);
  const contentRef = useRef<HTMLDivElement>(null);

  function renderContent() {
    switch (state) {
      case "timer":
        return <TimerView />;
      case "listenning":
        return <ListeningView />;
      case "ring-mode":
        return <RingModeView />;
      default:
        return <IdleView />;
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
  }, [state]);

  const handleStateChange = (newState: string) => {
    const transitionKey = `${state}-${newState}`;
    setTransition(transitionVariants[transitionKey]);
    setState(newState);
  };

  return (
    <DynamicIslandContext.Provider value={{ state, setState }}>
      <div className="flex h-[400px] w-full items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <motion.div
              layout
              transition={{
                type: "spring",
                bounce: bounceValue,
              }}
              style={{ borderRadius: "32px" }}
              className="min-w-[100px] overflow-hidden rounded-full bg-black"
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
                  filter: "blur(5px)",
                  originX: 0.5,
                  originY: 0.5,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  filter: "blur(0px)",
                  originX: 0.5,
                  originY: 0.5,
                  transition: { delay: 0.05 },
                }}
              >
                {renderContent()}
              </motion.div>
            </motion.div>

            <div className="pointer-events-none absolute left-1/2 top-0 flex h-[200px] w-[300px] -translate-x-1/2 items-start justify-center opacity-0">
              <AnimatePresence
                initial={false}
                mode="popLayout"
                custom={transition}
              >
                <motion.div
                  key={state + "second"}
                  initial={{ opacity: 0 }}
                  exit="exit"
                  variants={exitVariants}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => handleStateChange("idle")}>Idle</Button>
            <Button onClick={() => handleStateChange("ring-mode")}>
              Ring Mode
            </Button>
            <Button onClick={() => handleStateChange("timer")}>Timer</Button>
            <Button onClick={() => handleStateChange("listenning")}>
              Listening
            </Button>
          </div>
        </div>
      </div>
    </DynamicIslandContext.Provider>
  );
};
