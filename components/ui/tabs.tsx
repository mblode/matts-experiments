"use client";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import mergeRefs from "merge-refs";
import * as React from "react";

import { useTabObserver } from "@/hooks/use-tab-observer";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    floatingBgClassName?: string;
    variant?: "default" | "clip-path";
  }
>(
  (
    { className, floatingBgClassName, variant = "default", children, ...props },
    ref,
  ) => {
    const [lineStyle, setLineStyle] = React.useState({ width: 0, left: 0 });
    const [hasInitialized, setHasInitialized] = React.useState(false);
    const { mounted, listRef } = useTabObserver({
      onActiveTabChange: (_, activeTab) => {
        const { offsetWidth: width, offsetLeft: left } = activeTab;
        setLineStyle({ width, left });
        if (!hasInitialized && width > 0) {
          setHasInitialized(true);
        }
      },
    });

    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (variant === "clip-path" && mounted && containerRef.current) {
        const { width, left } = lineStyle;
        const container = containerRef.current;
        if (width > 0) {
          const clipLeft = left;
          const clipRight = left + width;
          container.style.clipPath = `inset(0 ${Number(100 - (clipRight / container.offsetWidth) * 100).toFixed()}% 0 ${Number((clipLeft / container.offsetWidth) * 100).toFixed()}% round 17px)`;
        }
      }
    }, [lineStyle, mounted, variant]);

    if (variant === "clip-path") {
      return (
        <div className="overflow-x-auto">
          <div className="relative inline-block min-w-max">
            <TabsPrimitive.List
              ref={mergeRefs(ref, listRef)}
              className={cn(
                "relative inline-flex items-center justify-start gap-2",
                className,
              )}
              {...props}
            >
              {children}
            </TabsPrimitive.List>

            <div
              aria-hidden
              ref={containerRef}
              className={cn(
                "absolute inset-0 z-10 overflow-hidden transition-[clip-path] duration-1000 ease-in-out pointer-events-none",
                (!mounted || !hasInitialized) && "opacity-0",
              )}
              style={{
                clipPath: hasInitialized
                  ? undefined
                  : "inset(0px 100% 0px 0% round 17px)",
              }}
            >
              <TabsPrimitive.List
                className={cn(
                  "inline-flex items-center justify-start gap-2",
                  floatingBgClassName || "bg-blue-500",
                  className,
                )}
              >
                {React.Children.map(children, (child) => {
                  if (React.isValidElement(child)) {
                    return React.cloneElement(
                      child as React.ReactElement<any>,
                      {
                        className: cn(
                          (child.props as any).className,
                          "text-primary-foreground data-[state=active]:text-primary-foreground",
                        ),
                        tabIndex: -1,
                        "aria-hidden": true,
                      },
                    );
                  }
                  return child;
                })}
              </TabsPrimitive.List>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <TabsPrimitive.List
          ref={mergeRefs(ref, listRef)}
          className={cn(
            "relative isolate inline-flex h-10 items-center justify-start rounded-xl bg-card p-1 text-muted-foreground min-w-max",
            className,
          )}
          {...props}
        >
          {children}
          <div
            className={cn(
              "absolute inset-y-1 left-0 -z-10 rounded-lg bg-background shadow-sm transition-all duration-300",
              {
                "opacity-0": !mounted || !hasInitialized,
                "opacity-100": mounted && hasInitialized,
              },
              floatingBgClassName,
            )}
            style={{
              transform: `translateX(${lineStyle.left}px)`,
              width: `${lineStyle.width}px`,
              transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
            }}
            aria-hidden="true"
          />
        </TabsPrimitive.List>
      </div>
    );
  },
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center cursor-pointer whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground flex-shrink-0",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
