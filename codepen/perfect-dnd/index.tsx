// CodePen packages: @dnd-kit/core@^6.3.1, @dnd-kit/sortable@^10.0.0, @dnd-kit/utilities@^3.2.2, clsx@^2.1.1, lucide-react@^0.562.0, mobx-persist-store@^1.1.8, mobx-react-lite@^4.1.1, mobx@^6.15.0, react-dom@19.2.3, react@19.2.3, tailwind-merge@^3.4.0

import { DndContext, DragEndEvent, DragMoveEvent, DragOverlay, DragStartEvent, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, defaultDropAnimationSideEffects, type DragEndEvent, type DragOverEvent, type DragStartEvent, type DropAnimation, useDndMonitor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { observer } from "mobx-react-lite";
import { CSS } from "@dnd-kit/utilities";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GripVertical } from "lucide-react";
import * as React from "react";
import { ReactNode, createContext, forwardRef, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";
import { createRoot } from "react-dom/client";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getSvgPathFromStroke(stroke: number[][]): string {
  if (!stroke.length) {
    return "";
  }

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"] as (string | number)[]
  );

  d.push("Z");
  return d.join(" ");
}

const imageLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
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
  cropH,
}: {
  src: string;
  width: number;
  quality?: number;
  blur?: number;
  cropX?: number;
  cropY?: number;
  cropW?: number;
  cropH?: number;
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

interface BlockData {
  id: string;
  title: string;
  type: "link" | "header" | "text";
  url?: string;
  visible: boolean;
  order: number;
  pageId: string;
}

type DropPosition = "above" | "below" | null;

interface CardInnerProps {
  block: BlockData;
  actions?: ReactNode;
}

function CardInner({ block, actions }: CardInnerProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
        <GripVertical className="h-4 w-4 text-slate-400" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium text-slate-900">{block.title}</div>
        {block.type === "link" && block.url && (
          <div className="truncate text-slate-500 text-sm">{block.url}</div>
        )}
      </div>
      {actions}
    </div>
  );
}

// Mock data for demo
const MOCK_BLOCKS: BlockData[] = [
  {
    id: "block-1",
    title: "My Portfolio",
    type: "link",
    url: "https://portfolio.com",
    visible: true,
    order: 0,
    pageId: "page-1",
  },
  {
    id: "block-2",
    title: "About Me",
    type: "header",
    visible: true,
    order: 1,
    pageId: "page-1",
  },
  {
    id: "block-3",
    title: "Twitter",
    type: "link",
    url: "https://twitter.com",
    visible: true,
    order: 2,
    pageId: "page-1",
  },
  {
    id: "block-4",
    title: "Instagram",
    type: "link",
    url: "https://instagram.com",
    visible: false,
    order: 3,
    pageId: "page-1",
  },
  {
    id: "block-5",
    title: "Contact",
    type: "text",
    visible: true,
    order: 4,
    pageId: "page-1",
  },
];

export class Store {
  blocksData: BlockData[] = MOCK_BLOCKS;

  // Drag state
  activeBlockId: string | null = null;
  settlingBlockId: string | null = null;
  overBlockId: string | null = null;
  dropPosition: DropPosition = null;

  // Drop animation state - position captured when drag ends
  dropAnimationRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  } | null = null;
  dropAnimationRotation = 0;

  // Editor state
  pageId = "page-1";

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });

    makePersistable(this, {
      name: "perfect-dnd-store",
      properties: ["blocksData"],
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    });
  }

  get isHydrated() {
    return isHydrated(this);
  }

  reorderBlocks(pageId: string, newOrder: string[]) {
    this.blocksData = this.blocksData.map((block) => {
      if (block.pageId !== pageId) {
        return block;
      }
      const newIndex = newOrder.indexOf(block.id);
      if (newIndex === -1) {
        return block;
      }
      return { ...block, order: newIndex };
    });
  }

  toggleVisibility(blockId: string) {
    this.blocksData = this.blocksData.map((block) =>
      block.id === blockId ? { ...block, visible: !block.visible } : block
    );
  }

  setDropTarget(overBlockId: string | null, position: DropPosition) {
    this.overBlockId = overBlockId;
    this.dropPosition = position;
  }

  clearDropTarget() {
    this.overBlockId = null;
    this.dropPosition = null;
  }

  startDrag(blockId: string) {
    this.activeBlockId = blockId;
    this.dropAnimationRect = null;
  }

  // Called when drag ends - start the settling phase
  startSettling(
    rect: { top: number; left: number; width: number; height: number },
    rotation: number
  ) {
    this.settlingBlockId = this.activeBlockId;
    this.dropAnimationRect = rect;
    this.dropAnimationRotation = rotation;
    this.activeBlockId = null;
    this.clearDropTarget();
  }

  // Called when drop animation completes
  endDrag() {
    this.activeBlockId = null;
    this.settlingBlockId = null;
    this.dropAnimationRect = null;
    this.dropAnimationRotation = 0;
  }
}

// Singleton instance
const store = new Store();

// Context
const StoreContext = createContext<Store>(store);

// Hook
function useStore(): Store {
  return useContext(StoreContext);
}

// Provider
function StoreProvider({ children }: React.PropsWithChildren) {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

interface ContentCardProps {
  block: BlockData;
}

const ContentCard = observer(({ block }: ContentCardProps) => {
  const store = useStore();

  const isSettling = store.settlingBlockId === block.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: _isDragging,
  } = useSortable({ id: block.id });

  const isActiveInStore = store.activeBlockId === block.id;
  // Use store state for placeholder visibility to coordinate with our drop animation
  // isDragging from dnd-kit resets immediately, but we want to wait for animation
  const showPlaceholder = isActiveInStore || isSettling;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="mb-2">
      <button
        {...attributes}
        {...listeners}
        className={cn(
          "group flex w-full cursor-grab rounded-xl border border-border bg-white p-4 text-left transition-shadow",
          {
            "z-0 bg-muted/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]":
              showPlaceholder,
            "z-10": !showPlaceholder,
          }
        )}
        data-settling-target={isSettling ? block.id : undefined}
        data-sortable-item
        ref={setNodeRef}
        style={style}
      >
        <div
          className={cn({
            "opacity-0": showPlaceholder,
          })}
        >
          <CardInner block={block} />
        </div>
      </button>
    </div>
  );
});

ContentCard.displayName = "ContentCard";

interface DragOverlayCardProps {
  block: BlockData;
}

const DragOverlayCard = forwardRef<HTMLDivElement, DragOverlayCardProps>(
  ({ block }, ref) => {
    return (
      <div
        className="rounded-xl border border-border bg-white p-4 transition-shadow"
        data-overlay-card
        ref={ref}
        style={{
          cursor: "grabbing",
        }}
      >
        <CardInner block={block} />
      </div>
    );
  }
);

DragOverlayCard.displayName = "DragOverlayCard";

interface SpringConfig {
  stiffness: number;
  damping: number;
  mass?: number;
}

interface Spring {
  setTarget(value: number): void;
  getValue(): number;
  getVelocity(): number;
  tick(dt: number): boolean; // returns true if still animating
  isAtRest(): boolean;
}

const EPSILON = 0.001;

function createSpring(config: SpringConfig): Spring {
  const { stiffness, damping, mass = 1 } = config;

  let currentValue = 0;
  let targetValue = 0;
  let velocity = 0;

  return {
    setTarget(value: number) {
      targetValue = value;
    },

    getValue() {
      return currentValue;
    },

    getVelocity() {
      return velocity;
    },

    isAtRest() {
      return (
        Math.abs(currentValue - targetValue) < EPSILON &&
        Math.abs(velocity) < EPSILON
      );
    },

    tick(dt: number): boolean {
      // Spring physics: F = -k * x - c * v
      // where k = stiffness, c = damping, x = displacement, v = velocity
      const displacement = currentValue - targetValue;
      const springForce = -stiffness * displacement;
      const dampingForce = -damping * velocity;
      const acceleration = (springForce + dampingForce) / mass;

      velocity += acceleration * dt;
      currentValue += velocity * dt;

      // Check if at rest
      if (this.isAtRest()) {
        currentValue = targetValue;
        velocity = 0;
        return false; // No longer animating
      }

      return true; // Still animating
    },
  };
}

// Helper to run a spring animation with RAF
function animateSpring(
  spring: Spring,
  onUpdate: (value: number) => void,
  onComplete?: () => void
): () => void {
  let animationId: number | null = null;
  let lastTime = performance.now();

  const tick = (currentTime: number) => {
    const dt = Math.min((currentTime - lastTime) / 1000, 0.064); // Cap at ~16fps min
    lastTime = currentTime;

    const stillAnimating = spring.tick(dt);
    onUpdate(spring.getValue());

    if (stillAnimating) {
      animationId = requestAnimationFrame(tick);
    } else {
      onComplete?.();
    }
  };

  animationId = requestAnimationFrame(tick);

  // Return cleanup function
  return () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }
  };
}

interface DragSwingConfig {
  /** How much velocity affects rotation (deg per px/frame). Default: 0.3 */
  sensitivity?: number;
  /** Maximum rotation in degrees. Default: 12 */
  maxAngle?: number;
  /** Velocity smoothing (0-1, higher = more responsive, lower = heavier feel). Default: 0.15 */
  smoothing?: number;
  /** Spring stiffness for return animation. Default: 200 */
  returnStiffness?: number;
  /** Spring damping for return animation. Default: 22 */
  returnDamping?: number;
}

interface UseDragSwingReturn {
  overlayRef: React.RefObject<HTMLDivElement | null>;
  scaleRef: React.RefObject<HTMLDivElement | null>;
}

// Utility functions
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

function useDragSwing(config: DragSwingConfig = {}): UseDragSwingReturn {
  const {
    sensitivity = 0.3,
    maxAngle = 30,
    smoothing = 0.15,
    returnStiffness = 250,
    returnDamping = 25,
  } = config;

  const store = useStore();

  const overlayRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);

  // Spring for rotation animation
  const springRef = useRef<Spring | null>(null);

  // Position tracking for velocity calculation
  const pointerXRef = useRef<number>(0);
  const lastFrameXRef = useRef<number>(0);
  const smoothedVelocityRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  // Drag state tracking
  const isDraggingRef = useRef<boolean>(false);
  const dragLoopRef = useRef<number | null>(null);

  // Initialize spring
  useEffect(() => {
    springRef.current = createSpring({
      stiffness: returnStiffness,
      damping: returnDamping,
    });
  }, [returnStiffness, returnDamping]);

  // Update CSS custom property
  const updateRotation = useCallback((value: number) => {
    if (overlayRef.current) {
      overlayRef.current.style.setProperty("--motion-rotate", `${value}deg`);
    }
  }, []);

  // Continuous physics loop - runs spring simulation every frame
  const runDragLoop = useCallback(() => {
    if (!(isDraggingRef.current && springRef.current)) {
      return;
    }

    // Calculate delta time
    const now = performance.now();
    const dt = Math.min((now - lastFrameTimeRef.current) / 1000, 0.064);
    lastFrameTimeRef.current = now;

    // Calculate velocity from pointer delta every frame (so idle motion decays)
    const currentX = pointerXRef.current;
    const instantVelocity = currentX - lastFrameXRef.current;
    lastFrameXRef.current = currentX;

    // Smooth the velocity
    smoothedVelocityRef.current = lerp(
      smoothedVelocityRef.current,
      instantVelocity,
      smoothing
    );

    // Dead zone - ignore tiny velocity to prevent jitter during slow movement
    const effectiveVelocity =
      Math.abs(smoothedVelocityRef.current) < 0.3
        ? 0
        : smoothedVelocityRef.current;

    // Map velocity directly to rotation angle
    const targetRotation = clamp(
      -effectiveVelocity * sensitivity,
      -maxAngle,
      maxAngle
    );

    // Just set the target - physics loop handles animation with momentum
    springRef.current.setTarget(targetRotation);

    // Advance spring physics (momentum preserved!)
    springRef.current.tick(dt);

    // Update rotation from spring value
    updateRotation(springRef.current.getValue());

    // Continue loop
    dragLoopRef.current = requestAnimationFrame(runDragLoop);
  }, [maxAngle, sensitivity, smoothing, updateRotation]);

  // Apply initial scale/shadow and start physics loop on mount
  // (component mounts after drag starts, so handleDragStart won't fire)
  useEffect(() => {
    // Initialize drag state and timing
    isDraggingRef.current = true;
    lastFrameTimeRef.current = performance.now();
    pointerXRef.current = 0;
    lastFrameXRef.current = 0;
    smoothedVelocityRef.current = 0;

    const cardElement = overlayRef.current?.querySelector(
      "[data-overlay-card]"
    ) as HTMLElement | null;

    // Animate scale on the scale wrapper
    if (scaleRef.current) {
      scaleRef.current.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.04)" }],
        {
          duration: 200,
          easing: "cubic-bezier(.2, 0, 0, 1)",
          fill: "forwards",
        }
      );
    }

    // Animate shadow on the card element
    if (cardElement) {
      cardElement.animate(
        [
          { boxShadow: "0 0 0 0 rgba(0,0,0,0)" },
          {
            boxShadow:
              "0 25px 50px -12px rgba(0,0,0,0.15), 0 12px 24px -8px rgba(0,0,0,0.1)",
          },
        ],
        {
          duration: 200,
          easing: "cubic-bezier(.2, 0, 0, 1)",
          fill: "forwards",
        }
      );
    }

    // Start the physics loop
    dragLoopRef.current = requestAnimationFrame(runDragLoop);
  }, [runDragLoop]);

  const handleDragStart = useCallback(
    (_event: DragStartEvent) => {
      // Reset tracking state
      pointerXRef.current = 0;
      lastFrameXRef.current = 0;
      smoothedVelocityRef.current = 0;
      isDraggingRef.current = true;

      // Initialize timing and start physics loop
      lastFrameTimeRef.current = performance.now();
      dragLoopRef.current = requestAnimationFrame(runDragLoop);
    },
    [runDragLoop]
  );

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    if (!springRef.current) {
      return;
    }

    pointerXRef.current = event.delta.x;
  }, []);

  const handleDragEnd = useCallback(
    (_event: DragEndEvent) => {
      // Stop the drag loop
      isDraggingRef.current = false;
      if (dragLoopRef.current) {
        cancelAnimationFrame(dragLoopRef.current);
        dragLoopRef.current = null;
      }

      if (!springRef.current) {
        return;
      }

      // Get current rotation value from spring
      const currentRotation = springRef.current.getValue();

      // Capture the overlay position for the settling animation
      // We need to find the actual card element inside the overlay
      const cardElement = overlayRef.current?.querySelector(
        "[data-overlay-card]"
      ) as HTMLElement | null;
      if (cardElement) {
        const rect = cardElement.getBoundingClientRect();
        // Compensate for scale(1.04) to get true unscaled dimensions
        // getBoundingClientRect returns scaled dimensions, so divide by scale factor
        const scale = 1.04;
        const unscaledRect = {
          top: rect.top,
          left: rect.left,
          width: rect.width / scale,
          height: rect.height / scale,
        };
        store.startSettling(unscaledRect, currentRotation);
      }

      // Reset tracking state
      pointerXRef.current = 0;
      lastFrameXRef.current = 0;
      smoothedVelocityRef.current = 0;
    },
    [store]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (dragLoopRef.current) {
        cancelAnimationFrame(dragLoopRef.current);
      }
    };
  }, []);

  useDndMonitor({
    onDragStart: handleDragStart,
    onDragMove: handleDragMove,
    onDragEnd: handleDragEnd,
    onDragCancel: handleDragEnd,
  });

  return { overlayRef, scaleRef };
}

interface DragSwingOverlayProps {
  block: BlockData;
}

function DragSwingOverlay({ block }: DragSwingOverlayProps) {
  const { overlayRef, scaleRef } = useDragSwing({
    sensitivity: 0.5,
    maxAngle: 20,
    smoothing: 0.12,
    returnStiffness: 220,
    returnDamping: 22,
  });

  const measureRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );

  useLayoutEffect(() => {
    if (measureRef.current && !size) {
      const rect = measureRef.current.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    }
  }, [size]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: size?.height,
      }}
    >
      <div
        ref={scaleRef}
        style={{
          position: size ? "absolute" : "relative",
          top: 0,
          left: 0,
          width: "100%",
          transformOrigin: "center center",
        }}
      >
        <div
          ref={overlayRef}
          style={{
            width: "100%",
            transform: "rotate(var(--motion-rotate, 0deg))",
            transformOrigin: "center center",
          }}
        >
          <DragOverlayCard block={block} ref={measureRef} />
        </div>
      </div>
    </div>
  );
}

interface SettlingOverlayProps {
  block: BlockData;
  onAnimationComplete: () => void;
}

const SettlingOverlay = observer(
  ({ block, onAnimationComplete }: SettlingOverlayProps) => {
    const store = useStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const rect = store.dropAnimationRect;
    const rotation = store.dropAnimationRotation;

    useLayoutEffect(() => {
      if (
        !(rect && containerRef.current && wrapperRef.current && cardRef.current)
      ) {
        return;
      }

      // Find the target content-card position
      const targetElement = document.querySelector(
        `[data-settling-target="${block.id}"]`
      ) as HTMLElement | null;

      if (!targetElement) {
        // No target found, just complete immediately
        onAnimationComplete();
        return;
      }

      const targetRect = targetElement.getBoundingClientRect();

      // Spring physics parameters (similar to framer motion defaults)
      const stiffness = 250;
      const damping = 25;
      const mass = 1;

      // Generate spring keyframes
      const generateSpringKeyframes = (
        from: number,
        to: number,
        steps: number
      ): number[] => {
        const keyframes: number[] = [];
        const w0 = Math.sqrt(stiffness / mass);
        const zeta = damping / (2 * Math.sqrt(stiffness * mass));
        const wd = w0 * Math.sqrt(1 - zeta * zeta);
        const duration = 0.6; // seconds

        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * duration;
          const envelope = Math.exp(-zeta * w0 * t);
          const oscillation =
            envelope * (Math.cos(wd * t) + (zeta * w0 * Math.sin(wd * t)) / wd);
          const value = to - (to - from) * oscillation;
          keyframes.push(value);
        }
        return keyframes;
      };

      const steps = 60;
      const duration = 600;

      // Position spring keyframes
      const xKeyframes = generateSpringKeyframes(
        rect.left,
        targetRect.left,
        steps
      );
      const yKeyframes = generateSpringKeyframes(
        rect.top,
        targetRect.top,
        steps
      );
      const positionFrames = xKeyframes.map((x, i) => ({
        transform: `translate(${x}px, ${yKeyframes[i]}px)`,
      }));

      const positionAnimation = containerRef.current.animate(positionFrames, {
        duration,
        easing: "linear",
        fill: "forwards",
      });

      // Scale and rotation spring keyframes
      const scaleKeyframes = generateSpringKeyframes(1.04, 1, steps);
      const rotationKeyframes = generateSpringKeyframes(rotation, 0, steps);
      const transformFrames = scaleKeyframes.map((scale, i) => ({
        transform: `rotate(${rotationKeyframes[i]}deg) scale(${scale})`,
      }));

      const transformAnimation = wrapperRef.current.animate(transformFrames, {
        duration,
        easing: "linear",
        fill: "forwards",
      });

      // Shadow fade (linear, no spring needed)
      const currentShadow =
        "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 12px 24px -8px rgba(0, 0, 0, 0.1)";
      const noShadow =
        "0 25px 50px -12px rgba(0, 0, 0, 0), 0 12px 24px -8px rgba(0, 0, 0, 0)";

      const shadowAnimation = cardRef.current.animate(
        [{ boxShadow: currentShadow }, { boxShadow: noShadow }],
        {
          duration: 300,
          easing: "ease-out",
          fill: "forwards",
        }
      );

      positionAnimation.onfinish = () => {
        onAnimationComplete();
      };

      // Cleanup: cancel animations on unmount to prevent iOS Safari memory leaks
      return () => {
        positionAnimation.cancel();
        transformAnimation.cancel();
        shadowAnimation.cancel();
      };
    }, [rect, rotation, block.id, onAnimationComplete]);

    if (!rect) {
      return null;
    }

    return (
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: rect.width,
          height: rect.height,
          transform: `translate(${rect.left}px, ${rect.top}px)`,
          zIndex: 9999,
          pointerEvents: "none",
        }}
      >
        <div
          ref={wrapperRef}
          style={{
            width: "100%",
            height: "100%",
            transform: `rotate(${rotation}deg) scale(1.04)`,
            transformOrigin: "center center",
          }}
        >
          <div
            className="rounded-xl border border-border bg-white p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15),0_12px_24px_-8px_rgba(0,0,0,0.1)]"
            ref={cardRef}
          >
            <CardInner block={block} />
          </div>
        </div>
      </div>
    );
  }
);

SettlingOverlay.displayName = "SettlingOverlay";

const EditorPage = observer(() => {
  const store = useStore();
  const pageId = store.pageId;

  const sortedBlocks = store.blocksData
    .filter((block) => block.pageId === pageId)
    .sort((a, b) => a.order - b.order);

  // MouseSensor + TouchSensor (not PointerSensor) per dnd-kit best practices
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Hold to drag - distinguishes scroll from drag on iOS
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const _dropAnimation: DropAnimation = {
    duration: 350,
    easing: "cubic-bezier(0.22, 1.5, 0.36, 1)",
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0" } },
    }),
  };

  const handleDragStart = (event: DragStartEvent) => {
    store.startDrag(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      store.clearDropTarget();
      return;
    }

    const activeIndex = sortedBlocks.findIndex((b) => b.id === active.id);
    const overIndex = sortedBlocks.findIndex((b) => b.id === over.id);
    const position = activeIndex < overIndex ? "below" : "above";

    store.setDropTarget(over.id as string, position);
  };

  const activeBlock = store.activeBlockId
    ? sortedBlocks.find((b) => b.id === store.activeBlockId)
    : null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedBlocks.findIndex((b) => b.id === active.id);
      const newIndex = sortedBlocks.findIndex((b) => b.id === over.id);
      const newOrder = arrayMove(
        sortedBlocks.map((b) => b.id),
        oldIndex,
        newIndex
      );
      store.reorderBlocks(pageId, newOrder);
    }

    // Clear drop target but keep activeBlockId until animation completes
    store.clearDropTarget();
  };

  const handleDragCancel = () => {
    store.clearDropTarget();
    store.endDrag();
  };

  const handleSettlingComplete = () => {
    store.endDrag();
  };

  // Get the settling block data
  const settlingBlock = store.settlingBlockId
    ? sortedBlocks.find((b) => b.id === store.settlingBlockId)
    : null;

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex-1">
          <div className="mx-auto">
            <div className="flex gap-4 p-4">
              <div className="min-w-0 flex-1 overflow-auto">
                <div className="mx-auto max-w-lg py-2">
                  <SortableContext
                    items={sortedBlocks.map((b) => b.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {sortedBlocks.map((block) => (
                      <ContentCard block={block} key={block.id} />
                    ))}
                  </SortableContext>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeBlock && <DragSwingOverlay block={activeBlock} />}
      </DragOverlay>

      {/* Settling overlay - renders outside dnd-kit's control */}
      {settlingBlock && (
        <SettlingOverlay
          block={settlingBlock}
          onAnimationComplete={handleSettlingComplete}
        />
      )}
    </DndContext>
  );
});

EditorPage.displayName = "EditorPage";

function App() {
  return (
    <StoreProvider><EditorPage /></StoreProvider>
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
