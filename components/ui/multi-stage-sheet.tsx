"use client";

import {
  AlertTriangle,
  Ban,
  Eye,
  Grid3x3,
  Lock,
  ScanFace,
  Shield,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { Drawer } from "vaul";

interface MultiStageSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

// Custom hook to measure element height
function useMeasure() {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(ref.current);
      setHeight(ref.current.getBoundingClientRect().height);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  return [ref, height] as const;
}

// Animation variants matching Vaul's style
const contentVariants = {
  initial: {
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  hidden: (custom: string) => {
    const base = {
      opacity: 0,
      scale: 0.96,
    };

    // Faster exit for remove stage
    if (custom === "remove") {
      return {
        ...base,
        transition: {
          ease: [0.26, 0.08, 0.25, 1] as [number, number, number, number],
          duration: 0.15,
        },
      };
    }

    return base;
  },
};

export function MultiStageSheet({
  open: controlledOpen,
  onOpenChange,
  trigger,
}: MultiStageSheetProps) {
  const [stage, setStage] = useState<"default" | "phrase" | "key" | "remove">(
    "default"
  );
  const [localOpen, setLocalOpen] = useState(false);
  const [contentRef, contentHeight] = useMeasure();

  // Use controlled open if provided, otherwise use local state
  const isOpen = controlledOpen !== undefined ? controlledOpen : localOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setLocalOpen(newOpen);
    }
    onOpenChange?.(newOpen);

    // Reset stage after closing animation
    if (!newOpen) {
      setTimeout(() => setStage("default"), 300);
    }
  };

  // Calculate height based on stage
  const getHeight = () => {
    switch (stage) {
      case "default":
        return 290;
      case "remove":
        return 312;
      case "phrase":
        return 465;
      case "key":
        return 441;
      default:
        return contentHeight || 500;
    }
  };

  const handleStageChange = (newStage: typeof stage) => {
    setStage(newStage);
  };

  return (
    <Drawer.Root
      modal={true}
      onOpenChange={handleOpenChange}
      open={isOpen}
      shouldScaleBackground
    >
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}

      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 bg-black/30"
          style={{ zIndex: 9998 }}
        />
        <Drawer.Content asChild>
          <motion.div
            animate={{
              height: getHeight(),
              transition: {
                duration: 0.27,
                ease: [0.25, 1, 0.5, 1],
              },
            }}
            className="fixed inset-x-4 bottom-4 mx-auto max-w-[361px] overflow-hidden rounded-[36px] bg-white outline-none md:mx-auto md:w-full"
            initial={false}
            style={{ zIndex: 9999 }}
          >
            <div className="px-6 pt-2.5 pb-6" ref={contentRef}>
              {/* Close button */}
              <Drawer.Close asChild>
                <motion.button
                  animate={{
                    top: stage === "default" ? 28 : 32,
                    right: stage === "default" ? 28 : 32,
                  }}
                  aria-label="Close"
                  className="absolute z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-transform hover:bg-gray-200 focus:scale-95 active:scale-75"
                  initial={false}
                  transition={{
                    ease: [0.25, 1, 0.5, 1],
                    duration: 0.27,
                  }}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </Drawer.Close>

              {/* Content with smooth opacity/scale transitions */}
              <AnimatePresence custom={stage} initial={false} mode="popLayout">
                {stage === "default" && (
                  <motion.div
                    animate="visible"
                    exit="hidden"
                    initial="initial"
                    key="default"
                    transition={{
                      ease: [0.26, 0.08, 0.25, 1] as [
                        number,
                        number,
                        number,
                        number,
                      ],
                      duration: 0.22,
                    }}
                    variants={contentVariants}
                  >
                    <header className="mb-4 flex h-[72px] items-center border-gray-100 border-b pl-2">
                      <h2 className="font-semibold text-[19px] text-gray-900">
                        Options
                      </h2>
                    </header>

                    <div className="space-y-3">
                      <button
                        className="flex h-12 w-full items-center gap-3 rounded-2xl bg-gray-100 px-4 text-left font-semibold text-[17px] text-gray-900 transition-transform hover:bg-gray-200 focus:scale-95 active:scale-[0.98]"
                        onClick={() => handleStageChange("key")}
                        type="button"
                      >
                        <Lock className="h-5 w-5 text-gray-600" />
                        View Private Key
                      </button>

                      <button
                        className="flex h-12 w-full items-center gap-3 rounded-2xl bg-gray-100 px-4 text-left font-semibold text-[17px] text-gray-900 transition-transform hover:bg-gray-200 focus:scale-95 active:scale-[0.98]"
                        onClick={() => handleStageChange("phrase")}
                        type="button"
                      >
                        <Grid3x3 className="h-5 w-5 text-gray-600" />
                        View Recovery Phrase
                      </button>

                      <button
                        className="flex h-12 w-full items-center gap-3 rounded-2xl bg-red-50 px-4 text-left font-semibold text-[17px] text-red-500 transition-transform hover:bg-red-100 focus:scale-95 active:scale-[0.98]"
                        onClick={() => handleStageChange("remove")}
                        type="button"
                      >
                        <AlertTriangle className="h-5 w-5" />
                        Remove Wallet
                      </button>
                    </div>
                  </motion.div>
                )}

                {stage === "phrase" && (
                  <motion.div
                    animate="visible"
                    custom={stage}
                    exit="hidden"
                    initial="initial"
                    key="phrase"
                    transition={{
                      ease: [0.26, 0.08, 0.25, 1] as [
                        number,
                        number,
                        number,
                        number,
                      ],
                      duration: 0.27,
                    }}
                    variants={contentVariants}
                  >
                    <div className="px-2">
                      <header className="mt-[21px] border-gray-100 border-b pb-6">
                        <div className="mb-4 flex justify-center">
                          <Eye className="h-12 w-12 text-gray-500" />
                        </div>
                        <h2 className="font-semibold text-[22px] text-gray-900">
                          Secret Recovery Phrase
                        </h2>
                        <p className="mt-3 text-[17px] text-gray-500 leading-[24px]">
                          Your Secret Recovery Phrase is the key used to back up
                          your wallet. Keep it secret at all times.
                        </p>
                      </header>

                      <ul className="mt-6 space-y-4">
                        <li className="flex items-center gap-3 font-medium text-[15px] text-gray-600">
                          <Shield className="h-6 w-6 text-gray-400" />
                          Keep your Secret Phrase safe
                        </li>
                        <li className="flex items-center gap-3 font-medium text-[15px] text-gray-600">
                          <Grid3x3 className="h-6 w-6 text-gray-400" />
                          Don't share it with anyone else
                        </li>
                        <li className="flex items-center gap-3 font-medium text-[15px] text-gray-600">
                          <Ban className="h-6 w-6 text-gray-400" />
                          If you lose it, we can't recover it
                        </li>
                      </ul>
                    </div>

                    <div className="mt-7 flex gap-4">
                      <button
                        className="flex h-12 w-full items-center justify-center rounded-full bg-gray-100 font-semibold text-[19px] text-gray-900 transition-transform hover:bg-gray-200 focus:scale-95 active:scale-[0.98]"
                        onClick={() => handleStageChange("default")}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-500 font-semibold text-[19px] text-white transition-transform hover:bg-blue-600 focus:scale-95 active:scale-[0.98]"
                        type="button"
                      >
                        <ScanFace className="h-5 w-5" />
                        Reveal
                      </button>
                    </div>
                  </motion.div>
                )}

                {stage === "key" && (
                  <motion.div
                    animate="visible"
                    custom={stage}
                    exit="hidden"
                    initial="initial"
                    key="key"
                    transition={{
                      ease: [0.26, 0.08, 0.25, 1] as [
                        number,
                        number,
                        number,
                        number,
                      ],
                      duration: 0.27,
                    }}
                    variants={contentVariants}
                  >
                    <div className="px-2">
                      <header className="mt-[21px] border-gray-100 border-b pb-6">
                        <div className="mb-4 flex justify-center">
                          <Lock className="h-12 w-12 text-gray-500" />
                        </div>
                        <h2 className="font-semibold text-[22px] text-gray-900">
                          Private Key
                        </h2>
                        <p className="mt-3 text-[17px] text-gray-500 leading-[24px]">
                          Your Private Key is used to access your wallet. Never
                          share it with anyone.
                        </p>
                      </header>

                      <ul className="mt-6 space-y-4">
                        <li className="flex items-center gap-3 font-medium text-[15px] text-gray-600">
                          <Shield className="h-6 w-6 text-gray-400" />
                          Keep your private key secure
                        </li>
                        <li className="flex items-center gap-3 font-medium text-[15px] text-gray-600">
                          <Lock className="h-6 w-6 text-gray-400" />
                          Never share it online
                        </li>
                        <li className="flex items-center gap-3 font-medium text-[15px] text-gray-600">
                          <Ban className="h-6 w-6 text-gray-400" />
                          Store it in a safe place
                        </li>
                      </ul>
                    </div>

                    <div className="mt-7 flex gap-4">
                      <button
                        className="flex h-12 w-full items-center justify-center rounded-full bg-gray-100 font-semibold text-[19px] text-gray-900 transition-transform hover:bg-gray-200 focus:scale-95 active:scale-[0.98]"
                        onClick={() => handleStageChange("default")}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-500 font-semibold text-[19px] text-white transition-transform hover:bg-blue-600 focus:scale-95 active:scale-[0.98]"
                        type="button"
                      >
                        <Eye className="h-5 w-5" />
                        View Key
                      </button>
                    </div>
                  </motion.div>
                )}

                {stage === "remove" && (
                  <motion.div
                    animate="visible"
                    custom={stage}
                    exit="hidden"
                    initial="initial"
                    key="remove"
                    transition={{
                      ease: [0.26, 0.08, 0.25, 1] as [
                        number,
                        number,
                        number,
                        number,
                      ],
                      duration: stage === "remove" ? 0.15 : 0.27,
                    }}
                    variants={contentVariants}
                  >
                    <div className="px-2">
                      <header className="mt-[21px]">
                        <div className="mb-4 flex justify-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                          </div>
                        </div>
                        <h2 className="text-center font-semibold text-[22px] text-gray-900">
                          Are you sure?
                        </h2>
                      </header>
                      <p className="mt-3 text-center text-[17px] text-gray-500 leading-[24px]">
                        You haven't backed up your wallet yet. If you remove it,
                        you could lose access forever.
                      </p>
                    </div>

                    <div className="mt-7 flex gap-4">
                      <button
                        className="flex h-12 w-full items-center justify-center rounded-full bg-gray-100 font-semibold text-[19px] text-gray-900 transition-transform hover:bg-gray-200 focus:scale-95 active:scale-[0.98]"
                        onClick={() => handleStageChange("default")}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="flex h-12 w-full items-center justify-center rounded-full bg-red-500 font-semibold text-[19px] text-white transition-transform hover:bg-red-600 focus:scale-95 active:scale-[0.98]"
                        type="button"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
