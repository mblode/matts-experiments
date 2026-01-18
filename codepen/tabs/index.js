import { BarChart3, Receipt, Users, Wallet } from "lucide-react";
import { Content as TabsContentPrimitive, List as TabsListPrimitive, Root as TabsRoot, Trigger as TabsTriggerPrimitive } from "@radix-ui/react-tabs";
import mergeRefs from "merge-refs";
import * as React from "react";
import { Children, cloneElement, forwardRef, isValidElement, useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createRoot } from "react-dom/client";
function useTabObserver({ onActiveTabChange } = {}) {
  const [mounted, setMounted] = useState(false);
  const listRef = useRef(null);
  const onActiveTabChangeRef = useRef(onActiveTabChange);
  useEffect(() => {
    onActiveTabChangeRef.current = onActiveTabChange;
  }, [onActiveTabChange]);
  const handleUpdate = useCallback(() => {
    if (listRef.current) {
      const tabs = listRef.current.querySelectorAll('[role="tab"]');
      tabs.forEach((el, i) => {
        if (el.getAttribute("data-state") === "active") {
          onActiveTabChangeRef.current?.(i, el);
        }
      });
    }
  }, []);
  useEffect(() => {
    setMounted(true);
    const resizeObserver = new ResizeObserver(handleUpdate);
    const mutationObserver = new MutationObserver(handleUpdate);
    if (listRef.current) {
      resizeObserver.observe(listRef.current);
      mutationObserver.observe(listRef.current, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }
    handleUpdate();
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [handleUpdate]);
  return { mounted, listRef };
}
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
const Tabs = TabsRoot;
const TabsList = forwardRef(
  ({ className, floatingBgClassName, variant = "default", children, ...props }, ref) => {
    const [lineStyle, setLineStyle] = useState({ width: 0, left: 0 });
    const [hasInitialized, setHasInitialized] = useState(false);
    const { mounted, listRef } = useTabObserver({
      onActiveTabChange: (_, activeTab) => {
        const { offsetWidth: width, offsetLeft: left } = activeTab;
        setLineStyle({ width, left });
        if (!hasInitialized && width > 0) {
          setHasInitialized(true);
        }
      }
    });
    const containerRef = useRef(null);
    useEffect(() => {
      if (variant === "clip-path" && mounted && containerRef.current) {
        const { width, left } = lineStyle;
        const container = containerRef.current;
        if (width > 0) {
          const clipLeft = left;
          const clipRight = left + width;
          container.style.clipPath = `inset(0 ${Number(100 - clipRight / container.offsetWidth * 100).toFixed(0)}% 0 ${Number(clipLeft / container.offsetWidth * 100).toFixed(0)}% round 17px)`;
        }
      }
    }, [lineStyle, mounted, variant]);
    if (variant === "clip-path") {
      return /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("div", { className: "relative inline-block min-w-max" }, /* @__PURE__ */ React.createElement(
        TabsListPrimitive,
        {
          className: cn(
            "relative inline-flex items-center justify-start gap-2",
            className
          ),
          ref: mergeRefs(ref, listRef),
          ...props
        },
        children
      ), /* @__PURE__ */ React.createElement(
        "div",
        {
          "aria-hidden": true,
          className: cn(
            "pointer-events-none absolute inset-0 z-10 overflow-hidden transition-[clip-path] duration-1000 ease-in-out",
            !(mounted && hasInitialized) && "opacity-0"
          ),
          ref: containerRef,
          style: {
            clipPath: hasInitialized ? void 0 : "inset(0px 100% 0px 0% round 17px)"
          }
        },
        /* @__PURE__ */ React.createElement(
          TabsListPrimitive,
          {
            className: cn(
              "inline-flex items-center justify-start gap-2",
              floatingBgClassName || "bg-blue-500",
              className
            )
          },
          Children.map(children, (child) => {
            if (!isValidElement(child)) {
              return child;
            }
            const element = child;
            return cloneElement(element, {
              className: cn(
                element.props.className,
                "text-primary-foreground data-[state=active]:text-primary-foreground"
              ),
              tabIndex: -1,
              "aria-hidden": true
            });
          })
        )
      )));
    }
    return /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement(
      TabsListPrimitive,
      {
        className: cn(
          "relative isolate inline-flex h-10 min-w-max items-center justify-start rounded-xl bg-card p-1 text-muted-foreground",
          className
        ),
        ref: mergeRefs(ref, listRef),
        ...props
      },
      children,
      /* @__PURE__ */ React.createElement(
        "div",
        {
          "aria-hidden": "true",
          className: cn(
            "absolute inset-y-1 left-0 -z-10 rounded-lg bg-background shadow-sm transition-all duration-300",
            {
              "opacity-0": !(mounted && hasInitialized),
              "opacity-100": mounted && hasInitialized
            },
            floatingBgClassName
          ),
          style: {
            transform: `translateX(${lineStyle.left}px)`,
            width: `${lineStyle.width}px`,
            transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)"
          }
        }
      )
    ));
  }
);
TabsList.displayName = TabsListPrimitive.displayName;
const TabsTrigger = forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ React.createElement(
  TabsTriggerPrimitive,
  {
    className: cn(
      "inline-flex flex-shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 font-medium text-sm ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground",
      className
    ),
    ref,
    ...props
  }
));
TabsTrigger.displayName = TabsTriggerPrimitive.displayName;
const TabsContent = forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ React.createElement(
  TabsContentPrimitive,
  {
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ref,
    ...props
  }
));
TabsContent.displayName = TabsContentPrimitive.displayName;
const TabsBlock = () => {
  return /* @__PURE__ */ React.createElement("div", { className: "mx-auto w-full" }, /* @__PURE__ */ React.createElement(Tabs, { className: "w-full", defaultValue: "payments" }, /* @__PURE__ */ React.createElement("div", { className: "w-full overflow-x-auto" }, /* @__PURE__ */ React.createElement(
    TabsList,
    {
      className: "w-full",
      floatingBgClassName: "bg-blue-500",
      variant: "clip-path"
    },
    TABS.map((tab) => /* @__PURE__ */ React.createElement(
      TabsTrigger,
      {
        className: "flex flex-shrink-0 items-center gap-2 rounded-full px-4",
        key: tab.value,
        value: tab.value
      },
      tab.icon,
      /* @__PURE__ */ React.createElement("span", null, tab.name)
    ))
  )), TABS.map((tab) => /* @__PURE__ */ React.createElement(
    TabsContent,
    {
      className: "mt-6 rounded-3xl border border-border py-8 text-center",
      key: tab.value,
      value: tab.value
    },
    /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Content for ", tab.name)
  ))));
};
const TABS = [
  {
    name: "Payments",
    value: "payments",
    icon: /* @__PURE__ */ React.createElement(Wallet, { className: "h-4 w-4" })
  },
  {
    name: "Balances",
    value: "balances",
    icon: /* @__PURE__ */ React.createElement(BarChart3, { className: "h-4 w-4" })
  },
  {
    name: "Customers",
    value: "customers",
    icon: /* @__PURE__ */ React.createElement(Users, { className: "h-4 w-4" })
  },
  {
    name: "Billing",
    value: "billing",
    icon: /* @__PURE__ */ React.createElement(Receipt, { className: "h-4 w-4" })
  }
];
function App() {
  return /* @__PURE__ */ React.createElement(TabsBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
