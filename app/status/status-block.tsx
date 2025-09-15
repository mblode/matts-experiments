"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { CircleDotDashedIcon, XIcon } from "lucide-react";
import useMeasure from "react-use-measure";

const statuses = {
  vacation: { id: "vacation", text: "On vacation", emoji: "🌴" },
  holiday: { id: "holiday", text: "On holiday", emoji: "🎉" },
  business: { id: "business", text: "On business", emoji: "💼" },
  leave: { id: "leave", text: "On leave", emoji: "👋" },
  sick: { id: "sick", text: "On sick", emoji: "🤒" },
};

export const StatusBlock = () => {
  const [ref, bounds] = useMeasure();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<keyof typeof statuses | null>(null);

  const splitText = (status ? statuses[status]?.text : "Set status")?.split("");

  return (
    <>
      <PopoverPrimitive.Root
        data-slot="popover"
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <TooltipPrimitive.Provider data-slot="tooltip-provider">
          <PopoverPrimitive.Anchor asChild>
            <motion.button
              className="relative cursor-pointer bg-muted text-foreground rounded-full px-3 py-2 overflow-hidden w-fit flex items-center justify-center select-none whitespace-nowrap"
              onClick={() => (status ? setStatus(null) : setIsOpen(true))}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <motion.div
                animate={{
                  width:
                    bounds.width > 0
                      ? bounds.width - (status ? 0 : 20)
                      : "auto",
                }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 55,
                }}
              >
                <div ref={ref} className="flex items-center gap-2 w-fit">
                  <AnimatePresence mode="popLayout">
                    {status ? (
                      <motion.div
                        key={status}
                        initial={{
                          opacity: 0,
                          scale: 0.5,
                          filter: "blur(7px)",
                        }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.5, filter: "blur(7px)" }}
                        transition={{ duration: 0.2 }}
                        className="size-4 text-base leading-4"
                      >
                        {statuses[status]?.emoji}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{
                          opacity: 0,
                          scale: 0.5,
                          filter: "blur(7px)",
                        }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.5, filter: "blur(7px)" }}
                        transition={{ duration: 0.2 }}
                      >
                        <CircleDotDashedIcon className="size-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {splitText.map((letter, index) => {
                        return (
                          <motion.div
                            initial={{ opacity: 0, filter: "blur(2px)" }}
                            animate={{
                              opacity: 1,
                              filter: "blur(0px)",
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
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 55,
                            }}
                            key={index + letter + status}
                            className="inline-block font-semibold"
                          >
                            {letter}
                            {letter === " " ? "\u00A0" : ""}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="ml-2 flex rounded-full text-background bg-muted-foreground/50 items-center justify-center size-4 transition-colors ease duration-200 hover:bg-muted-foreground"
                animate={{
                  opacity: status ? 1 : 0,
                  filter: status ? "blur(0px)" : "blur(2px)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 55,
                }}
              >
                <XIcon size={12} />
              </motion.div>
            </motion.button>
          </PopoverPrimitive.Anchor>

          <PopoverPrimitive.Portal>
            <AnimatePresence>
              <PopoverPrimitive.Content
                data-slot="popover-content"
                align="center"
                side="top"
                sideOffset={4}
                className="bg-popover text-popover-foreground z-50 origin-(--radix-popover-content-transform-origin) rounded-full border outline-hidden border-border"
                onOpenAutoFocus={(event) => {
                  event.preventDefault();
                  (event?.target as HTMLElement)?.focus();
                }}
                asChild
              >
                <motion.div
                  className="flex items-center px-1.5"
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                    y: 10,
                    filter: "blur(4px)",
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    y: 10,
                    filter: "blur(4px)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 25,
                    mass: 0.8,
                  }}
                >
                  {Object.entries(statuses).map(([id, { text, emoji }]) => (
                    <TooltipPrimitive.Root data-slot="tooltip">
                      <TooltipPrimitive.Trigger
                        data-slot="tooltip-trigger"
                        asChild
                      >
                        <motion.button
                          key={id}
                          onClick={() => setStatus(id as keyof typeof statuses)}
                          className="cursor-pointer"
                          initial={{
                            paddingLeft: 2,
                            paddingRight: 2,
                            paddingTop: 8,
                            paddingBottom: 8,
                          }}
                          whileHover={{ paddingTop: 4, paddingBottom: 12 }}
                          whileTap={{ paddingTop: 4, paddingBottom: 12 }}
                        >
                          <div className="rounded-full size-10 flex items-center justify-center bg-muted">
                            {emoji}
                          </div>
                        </motion.button>
                      </TooltipPrimitive.Trigger>

                      <TooltipPrimitive.Portal>
                        <TooltipPrimitive.Content
                          sideOffset={8}
                          data-slot="tooltip-content"
                          className="bg-muted text-muted-foreground animate-in duration-300 fade-in-0 zoom-in-95 blur-in-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:blur-out-xs data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:zoom-out-95 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-full px-3 py-1.5 text-xs text-balance"
                        >
                          {text}
                        </TooltipPrimitive.Content>
                      </TooltipPrimitive.Portal>
                    </TooltipPrimitive.Root>
                  ))}
                </motion.div>
              </PopoverPrimitive.Content>
            </AnimatePresence>
          </PopoverPrimitive.Portal>
        </TooltipPrimitive.Provider>
      </PopoverPrimitive.Root>
    </>
  );
};
