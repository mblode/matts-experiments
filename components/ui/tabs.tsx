"use client";
import {
  Content as TabsContentPrimitive,
  List as TabsListPrimitive,
  Root as TabsRoot,
  Trigger as TabsTriggerPrimitive,
} from "@radix-ui/react-tabs";
import mergeRefs from "merge-refs";
import {
  Children,
  type ComponentPropsWithoutRef,
  cloneElement,
  type ElementRef,
  forwardRef,
  isValidElement,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";

import { useTabObserver } from "@/hooks/use-tab-observer";
import { cn } from "@/lib/utils";

const Tabs = TabsRoot;

const TabsList = forwardRef<
  ElementRef<typeof TabsListPrimitive>,
  ComponentPropsWithoutRef<typeof TabsListPrimitive> & {
    floatingBgClassName?: string;
    variant?: "default" | "clip-path";
  }
>(
  (
    { className, floatingBgClassName, variant = "default", children, ...props },
    ref
  ) => {
    const [lineStyle, setLineStyle] = useState({ width: 0, left: 0 });
    const [hasInitialized, setHasInitialized] = useState(false);
    const { mounted, listRef } = useTabObserver({
      onActiveTabChange: (_, activeTab) => {
        const { offsetWidth: width, offsetLeft: left } = activeTab;
        setLineStyle({ width, left });
        if (!hasInitialized && width > 0) {
          setHasInitialized(true);
        }
      },
    });

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (variant === "clip-path" && mounted && containerRef.current) {
        const { width, left } = lineStyle;
        const container = containerRef.current;
        if (width > 0) {
          const clipLeft = left;
          const clipRight = left + width;
          container.style.clipPath = `inset(0 ${Number(100 - (clipRight / container.offsetWidth) * 100).toFixed(0)}% 0 ${Number((clipLeft / container.offsetWidth) * 100).toFixed(0)}% round 17px)`;
        }
      }
    }, [lineStyle, mounted, variant]);

    if (variant === "clip-path") {
      return (
        <div className="overflow-x-auto">
          <div className="relative inline-block min-w-max">
            <TabsListPrimitive
              className={cn(
                "relative inline-flex items-center justify-start gap-2",
                className
              )}
              ref={mergeRefs(ref, listRef)}
              {...props}
            >
              {children}
            </TabsListPrimitive>

            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0 z-10 overflow-hidden transition-[clip-path] duration-1000 ease-in-out",
                !(mounted && hasInitialized) && "opacity-0"
              )}
              ref={containerRef}
              style={{
                clipPath: hasInitialized
                  ? undefined
                  : "inset(0px 100% 0px 0% round 17px)",
              }}
            >
              <TabsListPrimitive
                className={cn(
                  "inline-flex items-center justify-start gap-2",
                  floatingBgClassName || "bg-blue-500",
                  className
                )}
              >
                {Children.map(children, (child) => {
                  if (!isValidElement(child)) {
                    return child;
                  }
                  const element = child as ReactElement;
                  return cloneElement(element, {
                    className: cn(
                      (element.props as { className?: string }).className,
                      "text-primary-foreground data-[state=active]:text-primary-foreground"
                    ),
                    tabIndex: -1,
                    "aria-hidden": true,
                  } as Partial<typeof element.props>);
                })}
              </TabsListPrimitive>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <TabsListPrimitive
          className={cn(
            "relative isolate inline-flex h-10 min-w-max items-center justify-start rounded-xl bg-card p-1 text-muted-foreground",
            className
          )}
          ref={mergeRefs(ref, listRef)}
          {...props}
        >
          {children}
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-y-1 left-0 -z-10 rounded-lg bg-background shadow-sm transition-all duration-300",
              {
                "opacity-0": !(mounted && hasInitialized),
                "opacity-100": mounted && hasInitialized,
              },
              floatingBgClassName
            )}
            style={{
              transform: `translateX(${lineStyle.left}px)`,
              width: `${lineStyle.width}px`,
              transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
            }}
          />
        </TabsListPrimitive>
      </div>
    );
  }
);
TabsList.displayName = TabsListPrimitive.displayName;

const TabsTrigger = forwardRef<
  ElementRef<typeof TabsTriggerPrimitive>,
  ComponentPropsWithoutRef<typeof TabsTriggerPrimitive>
>(({ className, ...props }, ref) => (
  <TabsTriggerPrimitive
    className={cn(
      "inline-flex flex-shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 font-medium text-sm ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground",
      className
    )}
    ref={ref}
    {...props}
  />
));
TabsTrigger.displayName = TabsTriggerPrimitive.displayName;

const TabsContent = forwardRef<
  ElementRef<typeof TabsContentPrimitive>,
  ComponentPropsWithoutRef<typeof TabsContentPrimitive>
>(({ className, ...props }, ref) => (
  <TabsContentPrimitive
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    ref={ref}
    {...props}
  />
));
TabsContent.displayName = TabsContentPrimitive.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
