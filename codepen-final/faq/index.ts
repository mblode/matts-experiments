// CodePen: imports are pinned to CDN URLs to keep React on a single version.

import { Content as AccordionContentPrimitive, Header as AccordionHeader, Item as AccordionItemPrimitive, Root as AccordionRoot, Trigger as AccordionTriggerPrimitive } from "https://esm.sh/@radix-ui/react-accordion@1.2.12?deps=react@19.2.3";
import { AnimatePresence, motion, type HTMLMotionProps, type Transition } from "https://esm.sh/motion@12.23.26/react?deps=react@19.2.3";
import * as React from "https://esm.sh/react@19.2.3";
import { createContext, type ComponentProps, useContext, useEffect, useImperativeHandle, useRef, useState } from "https://esm.sh/react@19.2.3";
import { clsx, type ClassValue } from "https://esm.sh/clsx@2.1.1";
import { twMerge } from "https://esm.sh/tailwind-merge@3.4.0";
import { createRoot } from "https://esm.sh/react-dom@19.2.3/client?deps=react@19.2.3";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AccordionItemContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const AccordionItemContext = createContext<
  AccordionItemContextType | undefined
>(undefined);

const useAccordionItem = (): AccordionItemContextType => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error("useAccordionItem must be used within an AccordionItem");
  }
  return context;
};

function Accordion({ ...props }: ComponentProps<typeof AccordionRoot>) {
  return <AccordionRoot data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionItemPrimitive>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AccordionItemContext.Provider value={{ isOpen, setIsOpen }}>
      <AccordionItemPrimitive
        className={cn("border-b last:border-b-0", className)}
        data-slot="accordion-item"
        {...props}
      >
        {children}
      </AccordionItemPrimitive>
    </AccordionItemContext.Provider>
  );
}

type AccordionTriggerProps = ComponentProps<
  typeof AccordionTriggerPrimitive
> & {
  transition?: Transition;
  chevron?: boolean;
};

function AccordionTrigger({
  ref,
  className,
  children,
  transition = { type: "spring", stiffness: 150, damping: 22 },
  ...props
}: AccordionTriggerProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);
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
      attributeFilter: ["data-state"],
    });
    const initialState = node.getAttribute("data-state");
    setIsOpen(initialState === "open");
    return () => {
      observer.disconnect();
    };
  }, [setIsOpen]);

  return (
    <AccordionHeader className="flex">
      <AccordionTriggerPrimitive
        className={cn(
          "flex flex-1 cursor-pointer items-start justify-between gap-4 rounded-md py-4 text-left font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        data-slot="accordion-trigger"
        ref={triggerRef}
        {...props}
      >
        {children}
        <div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="pointer-events-none absolute h-0.5 w-4 rounded-full bg-foreground"
            transition={{ duration: 0.3, ease: [0.645, 0.045, 0.355, 1] }}
          />
          <motion.div
            animate={{ scale: isOpen ? 0 : 1, rotateZ: isOpen ? 80 : 0 }}
            className="pointer-events-none absolute h-4 w-0.5 rounded-full bg-foreground"
            style={{ transformOrigin: "center" }}
            transition={{ duration: 0.3, ease: [0.645, 0.045, 0.355, 1] }}
          />
        </div>
      </AccordionTriggerPrimitive>
    </AccordionHeader>
  );
}

type AccordionContentProps = ComponentProps<typeof AccordionContentPrimitive> &
  HTMLMotionProps<"div"> & {
    transition?: Transition;
  };

function AccordionContent({
  className,
  children,
  transition = { type: "spring", stiffness: 150, damping: 22 },
  ...props
}: AccordionContentProps) {
  const { isOpen } = useAccordionItem();

  return (
    <AnimatePresence>
      {isOpen && (
        <AccordionContentPrimitive forceMount {...props}>
          <motion.div
            animate={{ height: "auto", opacity: 1, "--mask-stop": "100%" }}
            className="overflow-hidden"
            data-slot="accordion-content"
            exit={{ height: 0, opacity: 0, "--mask-stop": "0%" }}
            initial={{ height: 0, opacity: 0, "--mask-stop": "0%" }}
            key="accordion-content"
            style={{
              maskImage:
                "linear-gradient(black var(--mask-stop), transparent var(--mask-stop))",
              WebkitMaskImage:
                "linear-gradient(black var(--mask-stop), transparent var(--mask-stop))",
            }}
            transition={transition}
            {...props}
          >
            <div className={cn("pt-0 pb-4 text-sm leading-[1.5]", className)}>
              {children}
            </div>
          </motion.div>
        </AccordionContentPrimitive>
      )}
    </AnimatePresence>
  );
}

const FaqBlock = () => {
  return (
    <Accordion collapsible type="single">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <span className="font-bold text-lg">Is it accessible?</span>
        </AccordionTrigger>
        <AccordionContent>
          Aave is a decentralised non-custodial liquidity protocol where users
          can participate as suppliers or borrowers. Suppliers provide liquidity
          to the market while earning interest, and borrowers can access
          liquidity by providing collateral that exceeds the borrowed amount..
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>
          <span className="font-bold text-lg">Is it fun?</span>
        </AccordionTrigger>
        <AccordionContent>
          Aave is a decentralised non-custodial liquidity protocol where users
          can participate as suppliers or borrowers. Suppliers provide liquidity
          to the market while earning interest, and borrowers can access
          liquidity by providing collateral that exceeds the borrowed amount..
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>
          <span className="font-bold text-lg">Is it cool?</span>
        </AccordionTrigger>
        <AccordionContent>
          Aave is a decentralised non-custodial liquidity protocol where users
          can participate as suppliers or borrowers. Suppliers provide liquidity
          to the market while earning interest, and borrowers can access
          liquidity by providing collateral that exceeds the borrowed amount..
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

function App() {
  return (
    <FaqBlock />
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
