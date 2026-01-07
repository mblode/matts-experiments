import { Content as AccordionContentPrimitive, Header as AccordionHeader, Item as AccordionItemPrimitive, Root as AccordionRoot, Trigger as AccordionTriggerPrimitive } from "@radix-ui/react-accordion";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { createContext, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createRoot } from "react-dom/client";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function getSvgPathFromStroke(stroke) {
  if (!stroke.length) {
    return "";
  }
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );
  d.push("Z");
  return d.join(" ");
}
const imageLoader = ({
  src,
  width,
  quality
}) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};
const unsplashLoader = ({
  src,
  width,
  quality,
  blur,
  cropX,
  cropY,
  cropW,
  cropH
}) => {
  const params = new URLSearchParams();
  params.set("w", width.toString());
  if (quality) {
    params.set("q", quality.toString());
  }
  if (blur) {
    params.set("blur", blur.toString());
  }
  if (cropX) {
    params.set("rect", `${cropX},${cropY},${cropW},${cropH}`);
  }
  return `${src}?${params.toString()}`;
};
const AccordionItemContext = createContext(void 0);
const useAccordionItem = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error("useAccordionItem must be used within an AccordionItem");
  }
  return context;
};
function Accordion({ ...props }) {
  return /* @__PURE__ */ React.createElement(AccordionRoot, { "data-slot": "accordion", ...props });
}
function AccordionItem({
  className,
  children,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  return /* @__PURE__ */ React.createElement(AccordionItemContext.Provider, { value: { isOpen, setIsOpen } }, /* @__PURE__ */ React.createElement(
    AccordionItemPrimitive,
    {
      className: cn("border-b last:border-b-0", className),
      "data-slot": "accordion-item",
      ...props
    },
    children
  ));
}
function AccordionTrigger({
  ref,
  className,
  children,
  transition = { type: "spring", stiffness: 150, damping: 22 },
  ...props
}) {
  const triggerRef = useRef(null);
  useImperativeHandle(ref, () => triggerRef.current);
  const { isOpen, setIsOpen } = useAccordionItem();
  useEffect(() => {
    const node = triggerRef.current;
    if (!node) {
      return;
    }
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.attributeName === "data-state") {
          const currentState = node.getAttribute("data-state");
          setIsOpen(currentState === "open");
        }
      }
    });
    observer.observe(node, {
      attributes: true,
      attributeFilter: ["data-state"]
    });
    const initialState = node.getAttribute("data-state");
    setIsOpen(initialState === "open");
    return () => {
      observer.disconnect();
    };
  }, [setIsOpen]);
  return /* @__PURE__ */ React.createElement(AccordionHeader, { className: "flex" }, /* @__PURE__ */ React.createElement(
    AccordionTriggerPrimitive,
    {
      className: cn(
        "flex flex-1 cursor-pointer items-start justify-between gap-4 rounded-md py-4 text-left font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        className
      ),
      "data-slot": "accordion-trigger",
      ref: triggerRef,
      ...props
    },
    children,
    /* @__PURE__ */ React.createElement("div", { className: "relative flex h-4 w-4 shrink-0 items-center justify-center" }, /* @__PURE__ */ React.createElement(
      motion.div,
      {
        animate: { rotate: isOpen ? 180 : 0 },
        className: "pointer-events-none absolute h-0.5 w-4 rounded-full bg-foreground",
        transition: { duration: 0.3, ease: [0.645, 0.045, 0.355, 1] }
      }
    ), /* @__PURE__ */ React.createElement(
      motion.div,
      {
        animate: { scale: isOpen ? 0 : 1, rotateZ: isOpen ? 80 : 0 },
        className: "pointer-events-none absolute h-4 w-0.5 rounded-full bg-foreground",
        style: { transformOrigin: "center" },
        transition: { duration: 0.3, ease: [0.645, 0.045, 0.355, 1] }
      }
    ))
  ));
}
function AccordionContent({
  className,
  children,
  transition = { type: "spring", stiffness: 150, damping: 22 },
  ...props
}) {
  const { isOpen } = useAccordionItem();
  return /* @__PURE__ */ React.createElement(AnimatePresence, null, isOpen && /* @__PURE__ */ React.createElement(AccordionContentPrimitive, { forceMount: true, ...props }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      animate: { height: "auto", opacity: 1, "--mask-stop": "100%" },
      className: "overflow-hidden",
      "data-slot": "accordion-content",
      exit: { height: 0, opacity: 0, "--mask-stop": "0%" },
      initial: { height: 0, opacity: 0, "--mask-stop": "0%" },
      key: "accordion-content",
      style: {
        maskImage: "linear-gradient(black var(--mask-stop), transparent var(--mask-stop))",
        WebkitMaskImage: "linear-gradient(black var(--mask-stop), transparent var(--mask-stop))"
      },
      transition,
      ...props
    },
    /* @__PURE__ */ React.createElement("div", { className: cn("pt-0 pb-4 text-sm leading-[1.5]", className) }, children)
  )));
}
const FaqBlock = () => {
  return /* @__PURE__ */ React.createElement(Accordion, { collapsible: true, type: "single" }, /* @__PURE__ */ React.createElement(AccordionItem, { value: "item-1" }, /* @__PURE__ */ React.createElement(AccordionTrigger, null, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-lg" }, "Is it accessible?")), /* @__PURE__ */ React.createElement(AccordionContent, null, "Aave is a decentralised non-custodial liquidity protocol where users can participate as suppliers or borrowers. Suppliers provide liquidity to the market while earning interest, and borrowers can access liquidity by providing collateral that exceeds the borrowed amount..")), /* @__PURE__ */ React.createElement(AccordionItem, { value: "item-2" }, /* @__PURE__ */ React.createElement(AccordionTrigger, null, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-lg" }, "Is it fun?")), /* @__PURE__ */ React.createElement(AccordionContent, null, "Aave is a decentralised non-custodial liquidity protocol where users can participate as suppliers or borrowers. Suppliers provide liquidity to the market while earning interest, and borrowers can access liquidity by providing collateral that exceeds the borrowed amount..")), /* @__PURE__ */ React.createElement(AccordionItem, { value: "item-3" }, /* @__PURE__ */ React.createElement(AccordionTrigger, null, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-lg" }, "Is it cool?")), /* @__PURE__ */ React.createElement(AccordionContent, null, "Aave is a decentralised non-custodial liquidity protocol where users can participate as suppliers or borrowers. Suppliers provide liquidity to the market while earning interest, and borrowers can access liquidity by providing collateral that exceeds the borrowed amount..")));
};
function App() {
  return /* @__PURE__ */ React.createElement(FaqBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
