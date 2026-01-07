import { Anchor as PopoverAnchor, Content as PopoverContent, Portal as PopoverPortal, Root as PopoverRoot } from "@radix-ui/react-popover";
import { Content as TooltipContent, Portal as TooltipPortal, Provider as TooltipProvider, Root as TooltipRoot, Trigger as TooltipTrigger } from "@radix-ui/react-tooltip";
import { CircleDotDashedIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { useState } from "react";
import useMeasure from "react-use-measure";
import { createRoot } from "react-dom/client";
const statuses = {
  vacation: { id: "vacation", text: "On vacation", emoji: "\u{1F334}" },
  holiday: { id: "holiday", text: "On holiday", emoji: "\u{1F389}" },
  business: { id: "business", text: "On business", emoji: "\u{1F4BC}" },
  leave: { id: "leave", text: "On leave", emoji: "\u{1F44B}" },
  sick: { id: "sick", text: "On sick", emoji: "\u{1F912}" }
};
const StatusBlock = () => {
  const [ref, bounds] = useMeasure();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const splitText = (status ? statuses[status]?.text : "Set status")?.split("");
  return /* @__PURE__ */ React.createElement(PopoverRoot, { "data-slot": "popover", onOpenChange: setIsOpen, open: isOpen }, /* @__PURE__ */ React.createElement(TooltipProvider, { "data-slot": "tooltip-provider" }, /* @__PURE__ */ React.createElement(PopoverAnchor, { asChild: true }, /* @__PURE__ */ React.createElement(
    motion.button,
    {
      className: "relative flex w-fit cursor-pointer select-none items-center justify-center overflow-hidden whitespace-nowrap rounded-full bg-muted px-3 py-2 text-foreground",
      onClick: () => status ? setStatus(null) : setIsOpen(true),
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 55
      },
      whileHover: { scale: 1.1 },
      whileTap: { scale: 0.9 }
    },
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        animate: {
          width: bounds.width > 0 ? bounds.width - (status ? 0 : 20) : "auto"
        },
        transition: {
          type: "spring",
          stiffness: 350,
          damping: 55
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex w-fit items-center gap-2", ref }, /* @__PURE__ */ React.createElement(AnimatePresence, { mode: "popLayout" }, status ? /* @__PURE__ */ React.createElement(
        motion.div,
        {
          animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
          className: "size-4 text-base leading-4",
          exit: { opacity: 0, scale: 0.5, filter: "blur(7px)" },
          key: status,
          transition: { duration: 0.2 }
        },
        statuses[status]?.emoji
      ) : /* @__PURE__ */ React.createElement(
        motion.div,
        {
          animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
          exit: { opacity: 0, scale: 0.5, filter: "blur(7px)" },
          key: "default",
          transition: { duration: 0.2 }
        },
        /* @__PURE__ */ React.createElement(CircleDotDashedIcon, { className: "size-4" })
      )), /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(AnimatePresence, { initial: false, mode: "popLayout" }, splitText.map((letter, index) => {
        return /* @__PURE__ */ React.createElement(
          motion.div,
          {
            animate: {
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                type: "spring",
                stiffness: 350,
                damping: 55,
                delay: index * 0.015
              }
            },
            className: "inline-block font-semibold",
            exit: {
              opacity: 0,
              filter: "blur(2px)",
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 55
              }
            },
            initial: { opacity: 0, filter: "blur(2px)" },
            key: index + letter + status,
            transition: {
              type: "spring",
              stiffness: 350,
              damping: 55
            }
          },
          letter,
          letter === " " ? "\xA0" : ""
        );
      }))))
    ),
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        animate: {
          opacity: status ? 1 : 0,
          filter: status ? "blur(0px)" : "blur(2px)"
        },
        className: "ease ml-2 flex size-4 items-center justify-center rounded-full bg-muted-foreground/50 text-background transition-colors duration-200 hover:bg-muted-foreground",
        initial: { opacity: 0, filter: "blur(2px)" },
        transition: {
          type: "spring",
          stiffness: 350,
          damping: 55
        }
      },
      /* @__PURE__ */ React.createElement(XIcon, { size: 12 })
    )
  )), /* @__PURE__ */ React.createElement(PopoverPortal, null, /* @__PURE__ */ React.createElement(AnimatePresence, null, /* @__PURE__ */ React.createElement(
    PopoverContent,
    {
      align: "center",
      asChild: true,
      className: "z-50 origin-(--radix-popover-content-transform-origin) rounded-full border border-border bg-popover text-popover-foreground outline-hidden",
      "data-slot": "popover-content",
      onOpenAutoFocus: (event) => {
        event.preventDefault();
        event?.target?.focus();
      },
      side: "top",
      sideOffset: 4
    },
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        animate: {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)"
        },
        className: "flex items-center px-1.5",
        exit: {
          opacity: 0,
          scale: 0.8,
          y: 10,
          filter: "blur(4px)"
        },
        initial: {
          opacity: 0,
          scale: 0.8,
          y: 10,
          filter: "blur(4px)"
        },
        transition: {
          type: "spring",
          stiffness: 350,
          damping: 55
        }
      },
      Object.entries(statuses).map(([id, { text, emoji }]) => /* @__PURE__ */ React.createElement(TooltipRoot, { "data-slot": "tooltip", key: id }, /* @__PURE__ */ React.createElement(TooltipTrigger, { asChild: true, "data-slot": "tooltip-trigger" }, /* @__PURE__ */ React.createElement(
        motion.button,
        {
          className: "cursor-pointer",
          initial: {
            paddingLeft: 2,
            paddingRight: 2,
            paddingTop: 8,
            paddingBottom: 8
          },
          key: id,
          onClick: () => setStatus(id),
          whileHover: { paddingTop: 4, paddingBottom: 12 },
          whileTap: { paddingTop: 4, paddingBottom: 12 }
        },
        /* @__PURE__ */ React.createElement("div", { className: "flex size-10 items-center justify-center rounded-full bg-muted" }, emoji)
      )), /* @__PURE__ */ React.createElement(TooltipPortal, null, /* @__PURE__ */ React.createElement(
        TooltipContent,
        {
          className: "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:zoom-out-95 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in text-balance rounded-full bg-muted px-3 py-1.5 text-muted-foreground text-xs blur-in-xs duration-300 data-[state=closed]:animate-out data-[state=closed]:blur-out-xs",
          "data-slot": "tooltip-content",
          sideOffset: 8
        },
        text
      ))))
    )
  )))));
};
function App() {
  return /* @__PURE__ */ React.createElement(StatusBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
