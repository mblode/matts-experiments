import { DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, defaultDropAnimationSideEffects, useDndMonitor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { observer } from "mobx-react-lite";
import { CSS } from "@dnd-kit/utilities";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GripVertical } from "lucide-react";
import * as React from "react";
import { createContext, forwardRef, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";
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
function CardInner({ block, actions }) {
  return /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100" }, /* @__PURE__ */ React.createElement(GripVertical, { className: "h-4 w-4 text-slate-400" })), /* @__PURE__ */ React.createElement("div", { className: "min-w-0 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "truncate font-medium text-slate-900" }, block.title), block.type === "link" && block.url && /* @__PURE__ */ React.createElement("div", { className: "truncate text-slate-500 text-sm" }, block.url)), actions);
}
const MOCK_BLOCKS = [
  {
    id: "block-1",
    title: "My Portfolio",
    type: "link",
    url: "https://portfolio.com",
    visible: true,
    order: 0,
    pageId: "page-1"
  },
  {
    id: "block-2",
    title: "About Me",
    type: "header",
    visible: true,
    order: 1,
    pageId: "page-1"
  },
  {
    id: "block-3",
    title: "Twitter",
    type: "link",
    url: "https://twitter.com",
    visible: true,
    order: 2,
    pageId: "page-1"
  },
  {
    id: "block-4",
    title: "Instagram",
    type: "link",
    url: "https://instagram.com",
    visible: false,
    order: 3,
    pageId: "page-1"
  },
  {
    id: "block-5",
    title: "Contact",
    type: "text",
    visible: true,
    order: 4,
    pageId: "page-1"
  }
];
class Store {
  blocksData = MOCK_BLOCKS;
  // Drag state
  activeBlockId = null;
  settlingBlockId = null;
  overBlockId = null;
  dropPosition = null;
  // Drop animation state - position captured when drag ends
  dropAnimationRect = null;
  dropAnimationRotation = 0;
  // Editor state
  pageId = "page-1";
  constructor() {
    makeAutoObservable(this, void 0, { autoBind: true });
    makePersistable(this, {
      name: "perfect-dnd-store",
      properties: ["blocksData"],
      storage: typeof window !== "undefined" ? window.localStorage : void 0
    });
  }
  get isHydrated() {
    return isHydrated(this);
  }
  reorderBlocks(pageId, newOrder) {
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
  toggleVisibility(blockId) {
    this.blocksData = this.blocksData.map(
      (block) => block.id === blockId ? { ...block, visible: !block.visible } : block
    );
  }
  setDropTarget(overBlockId, position) {
    this.overBlockId = overBlockId;
    this.dropPosition = position;
  }
  clearDropTarget() {
    this.overBlockId = null;
    this.dropPosition = null;
  }
  startDrag(blockId) {
    this.activeBlockId = blockId;
    this.dropAnimationRect = null;
  }
  // Called when drag ends - start the settling phase
  startSettling(rect, rotation) {
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
const store = new Store();
const StoreContext = createContext(store);
function useStore() {
  return useContext(StoreContext);
}
function StoreProvider({ children }) {
  return /* @__PURE__ */ React.createElement(StoreContext.Provider, { value: store }, children);
}
const ContentCard = observer(({ block }) => {
  const store2 = useStore();
  const isSettling = store2.settlingBlockId === block.id;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: _isDragging
  } = useSortable({ id: block.id });
  const isActiveInStore = store2.activeBlockId === block.id;
  const showPlaceholder = isActiveInStore || isSettling;
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  return /* @__PURE__ */ React.createElement("div", { className: "mb-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      ...attributes,
      ...listeners,
      className: cn(
        "group flex w-full cursor-grab rounded-xl border border-border bg-white p-4 text-left transition-shadow",
        {
          "z-0 bg-muted/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]": showPlaceholder,
          "z-10": !showPlaceholder
        }
      ),
      "data-settling-target": isSettling ? block.id : void 0,
      "data-sortable-item": true,
      ref: setNodeRef,
      style
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: cn({
          "opacity-0": showPlaceholder
        })
      },
      /* @__PURE__ */ React.createElement(CardInner, { block })
    )
  ));
});
ContentCard.displayName = "ContentCard";
const DragOverlayCard = forwardRef(
  ({ block }, ref) => {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "rounded-xl border border-border bg-white p-4 transition-shadow",
        "data-overlay-card": true,
        ref,
        style: {
          cursor: "grabbing"
        }
      },
      /* @__PURE__ */ React.createElement(CardInner, { block })
    );
  }
);
DragOverlayCard.displayName = "DragOverlayCard";
const EPSILON = 1e-3;
function createSpring(config) {
  const { stiffness, damping, mass = 1 } = config;
  let currentValue = 0;
  let targetValue = 0;
  let velocity = 0;
  return {
    setTarget(value) {
      targetValue = value;
    },
    getValue() {
      return currentValue;
    },
    getVelocity() {
      return velocity;
    },
    isAtRest() {
      return Math.abs(currentValue - targetValue) < EPSILON && Math.abs(velocity) < EPSILON;
    },
    tick(dt) {
      const displacement = currentValue - targetValue;
      const springForce = -stiffness * displacement;
      const dampingForce = -damping * velocity;
      const acceleration = (springForce + dampingForce) / mass;
      velocity += acceleration * dt;
      currentValue += velocity * dt;
      if (this.isAtRest()) {
        currentValue = targetValue;
        velocity = 0;
        return false;
      }
      return true;
    }
  };
}
function animateSpring(spring, onUpdate, onComplete) {
  let animationId = null;
  let lastTime = performance.now();
  const tick = (currentTime) => {
    const dt = Math.min((currentTime - lastTime) / 1e3, 0.064);
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
  return () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }
  };
}
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
function useDragSwing(config = {}) {
  const {
    sensitivity = 0.3,
    maxAngle = 30,
    smoothing = 0.15,
    returnStiffness = 250,
    returnDamping = 25
  } = config;
  const store2 = useStore();
  const overlayRef = useRef(null);
  const scaleRef = useRef(null);
  const springRef = useRef(null);
  const pointerXRef = useRef(0);
  const lastFrameXRef = useRef(0);
  const smoothedVelocityRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragLoopRef = useRef(null);
  useEffect(() => {
    springRef.current = createSpring({
      stiffness: returnStiffness,
      damping: returnDamping
    });
  }, [returnStiffness, returnDamping]);
  const updateRotation = useCallback((value) => {
    if (overlayRef.current) {
      overlayRef.current.style.setProperty("--motion-rotate", `${value}deg`);
    }
  }, []);
  const runDragLoop = useCallback(() => {
    if (!(isDraggingRef.current && springRef.current)) {
      return;
    }
    const now = performance.now();
    const dt = Math.min((now - lastFrameTimeRef.current) / 1e3, 0.064);
    lastFrameTimeRef.current = now;
    const currentX = pointerXRef.current;
    const instantVelocity = currentX - lastFrameXRef.current;
    lastFrameXRef.current = currentX;
    smoothedVelocityRef.current = lerp(
      smoothedVelocityRef.current,
      instantVelocity,
      smoothing
    );
    const effectiveVelocity = Math.abs(smoothedVelocityRef.current) < 0.3 ? 0 : smoothedVelocityRef.current;
    const targetRotation = clamp(
      -effectiveVelocity * sensitivity,
      -maxAngle,
      maxAngle
    );
    springRef.current.setTarget(targetRotation);
    springRef.current.tick(dt);
    updateRotation(springRef.current.getValue());
    dragLoopRef.current = requestAnimationFrame(runDragLoop);
  }, [maxAngle, sensitivity, smoothing, updateRotation]);
  useEffect(() => {
    isDraggingRef.current = true;
    lastFrameTimeRef.current = performance.now();
    pointerXRef.current = 0;
    lastFrameXRef.current = 0;
    smoothedVelocityRef.current = 0;
    const cardElement = overlayRef.current?.querySelector(
      "[data-overlay-card]"
    );
    if (scaleRef.current) {
      scaleRef.current.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.04)" }],
        {
          duration: 200,
          easing: "cubic-bezier(.2, 0, 0, 1)",
          fill: "forwards"
        }
      );
    }
    if (cardElement) {
      cardElement.animate(
        [
          { boxShadow: "0 0 0 0 rgba(0,0,0,0)" },
          {
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15), 0 12px 24px -8px rgba(0,0,0,0.1)"
          }
        ],
        {
          duration: 200,
          easing: "cubic-bezier(.2, 0, 0, 1)",
          fill: "forwards"
        }
      );
    }
    dragLoopRef.current = requestAnimationFrame(runDragLoop);
  }, [runDragLoop]);
  const handleDragStart = useCallback(
    (_event) => {
      pointerXRef.current = 0;
      lastFrameXRef.current = 0;
      smoothedVelocityRef.current = 0;
      isDraggingRef.current = true;
      lastFrameTimeRef.current = performance.now();
      dragLoopRef.current = requestAnimationFrame(runDragLoop);
    },
    [runDragLoop]
  );
  const handleDragMove = useCallback((event) => {
    if (!springRef.current) {
      return;
    }
    pointerXRef.current = event.delta.x;
  }, []);
  const handleDragEnd = useCallback(
    (_event) => {
      isDraggingRef.current = false;
      if (dragLoopRef.current) {
        cancelAnimationFrame(dragLoopRef.current);
        dragLoopRef.current = null;
      }
      if (!springRef.current) {
        return;
      }
      const currentRotation = springRef.current.getValue();
      const cardElement = overlayRef.current?.querySelector(
        "[data-overlay-card]"
      );
      if (cardElement) {
        const rect = cardElement.getBoundingClientRect();
        const scale = 1.04;
        const unscaledRect = {
          top: rect.top,
          left: rect.left,
          width: rect.width / scale,
          height: rect.height / scale
        };
        store2.startSettling(unscaledRect, currentRotation);
      }
      pointerXRef.current = 0;
      lastFrameXRef.current = 0;
      smoothedVelocityRef.current = 0;
    },
    [store2]
  );
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
    onDragCancel: handleDragEnd
  });
  return { overlayRef, scaleRef };
}
function DragSwingOverlay({ block }) {
  const { overlayRef, scaleRef } = useDragSwing({
    sensitivity: 0.5,
    maxAngle: 20,
    smoothing: 0.12,
    returnStiffness: 220,
    returnDamping: 22
  });
  const measureRef = useRef(null);
  const [size, setSize] = useState(
    null
  );
  useLayoutEffect(() => {
    if (measureRef.current && !size) {
      const rect = measureRef.current.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    }
  }, [size]);
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        position: "relative",
        width: "100%",
        height: size?.height
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        ref: scaleRef,
        style: {
          position: size ? "absolute" : "relative",
          top: 0,
          left: 0,
          width: "100%",
          transformOrigin: "center center"
        }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          ref: overlayRef,
          style: {
            width: "100%",
            transform: "rotate(var(--motion-rotate, 0deg))",
            transformOrigin: "center center"
          }
        },
        /* @__PURE__ */ React.createElement(DragOverlayCard, { block, ref: measureRef })
      )
    )
  );
}
const SettlingOverlay = observer(
  ({ block, onAnimationComplete }) => {
    const store2 = useStore();
    const containerRef = useRef(null);
    const wrapperRef = useRef(null);
    const cardRef = useRef(null);
    const rect = store2.dropAnimationRect;
    const rotation = store2.dropAnimationRotation;
    useLayoutEffect(() => {
      if (!(rect && containerRef.current && wrapperRef.current && cardRef.current)) {
        return;
      }
      const targetElement = document.querySelector(
        `[data-settling-target="${block.id}"]`
      );
      if (!targetElement) {
        onAnimationComplete();
        return;
      }
      const targetRect = targetElement.getBoundingClientRect();
      const stiffness = 250;
      const damping = 25;
      const mass = 1;
      const generateSpringKeyframes = (from, to, steps2) => {
        const keyframes = [];
        const w0 = Math.sqrt(stiffness / mass);
        const zeta = damping / (2 * Math.sqrt(stiffness * mass));
        const wd = w0 * Math.sqrt(1 - zeta * zeta);
        const duration2 = 0.6;
        for (let i = 0; i <= steps2; i++) {
          const t = i / steps2 * duration2;
          const envelope = Math.exp(-zeta * w0 * t);
          const oscillation = envelope * (Math.cos(wd * t) + zeta * w0 * Math.sin(wd * t) / wd);
          const value = to - (to - from) * oscillation;
          keyframes.push(value);
        }
        return keyframes;
      };
      const steps = 60;
      const duration = 600;
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
        transform: `translate(${x}px, ${yKeyframes[i]}px)`
      }));
      const positionAnimation = containerRef.current.animate(positionFrames, {
        duration,
        easing: "linear",
        fill: "forwards"
      });
      const scaleKeyframes = generateSpringKeyframes(1.04, 1, steps);
      const rotationKeyframes = generateSpringKeyframes(rotation, 0, steps);
      const transformFrames = scaleKeyframes.map((scale, i) => ({
        transform: `rotate(${rotationKeyframes[i]}deg) scale(${scale})`
      }));
      const transformAnimation = wrapperRef.current.animate(transformFrames, {
        duration,
        easing: "linear",
        fill: "forwards"
      });
      const currentShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 12px 24px -8px rgba(0, 0, 0, 0.1)";
      const noShadow = "0 25px 50px -12px rgba(0, 0, 0, 0), 0 12px 24px -8px rgba(0, 0, 0, 0)";
      const shadowAnimation = cardRef.current.animate(
        [{ boxShadow: currentShadow }, { boxShadow: noShadow }],
        {
          duration: 300,
          easing: "ease-out",
          fill: "forwards"
        }
      );
      positionAnimation.onfinish = () => {
        onAnimationComplete();
      };
      return () => {
        positionAnimation.cancel();
        transformAnimation.cancel();
        shadowAnimation.cancel();
      };
    }, [rect, rotation, block.id, onAnimationComplete]);
    if (!rect) {
      return null;
    }
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        ref: containerRef,
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          width: rect.width,
          height: rect.height,
          transform: `translate(${rect.left}px, ${rect.top}px)`,
          zIndex: 9999,
          pointerEvents: "none"
        }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          ref: wrapperRef,
          style: {
            width: "100%",
            height: "100%",
            transform: `rotate(${rotation}deg) scale(1.04)`,
            transformOrigin: "center center"
          }
        },
        /* @__PURE__ */ React.createElement(
          "div",
          {
            className: "rounded-xl border border-border bg-white p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15),0_12px_24px_-8px_rgba(0,0,0,0.1)]",
            ref: cardRef
          },
          /* @__PURE__ */ React.createElement(CardInner, { block })
        )
      )
    );
  }
);
SettlingOverlay.displayName = "SettlingOverlay";
const EditorPage = observer(() => {
  const store2 = useStore();
  const pageId = store2.pageId;
  const sortedBlocks = store2.blocksData.filter((block) => block.pageId === pageId).sort((a, b) => a.order - b.order);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        // Hold to drag - distinguishes scroll from drag on iOS
        tolerance: 5
      }
    }),
    useSensor(KeyboardSensor)
  );
  const _dropAnimation = {
    duration: 350,
    easing: "cubic-bezier(0.22, 1.5, 0.36, 1)",
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0" } }
    })
  };
  const handleDragStart = (event) => {
    store2.startDrag(event.active.id);
  };
  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      store2.clearDropTarget();
      return;
    }
    const activeIndex = sortedBlocks.findIndex((b) => b.id === active.id);
    const overIndex = sortedBlocks.findIndex((b) => b.id === over.id);
    const position = activeIndex < overIndex ? "below" : "above";
    store2.setDropTarget(over.id, position);
  };
  const activeBlock = store2.activeBlockId ? sortedBlocks.find((b) => b.id === store2.activeBlockId) : null;
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sortedBlocks.findIndex((b) => b.id === active.id);
      const newIndex = sortedBlocks.findIndex((b) => b.id === over.id);
      const newOrder = arrayMove(
        sortedBlocks.map((b) => b.id),
        oldIndex,
        newIndex
      );
      store2.reorderBlocks(pageId, newOrder);
    }
    store2.clearDropTarget();
  };
  const handleDragCancel = () => {
    store2.clearDropTarget();
    store2.endDrag();
  };
  const handleSettlingComplete = () => {
    store2.endDrag();
  };
  const settlingBlock = store2.settlingBlockId ? sortedBlocks.find((b) => b.id === store2.settlingBlockId) : null;
  return /* @__PURE__ */ React.createElement(
    DndContext,
    {
      collisionDetection: closestCenter,
      onDragCancel: handleDragCancel,
      onDragEnd: handleDragEnd,
      onDragMove: handleDragOver,
      onDragStart: handleDragStart,
      sensors
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex min-h-screen w-full flex-col" }, /* @__PURE__ */ React.createElement("main", { className: "flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-4 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "min-w-0 flex-1 overflow-auto" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-lg py-2" }, /* @__PURE__ */ React.createElement(
      SortableContext,
      {
        items: sortedBlocks.map((b) => b.id),
        strategy: verticalListSortingStrategy
      },
      sortedBlocks.map((block) => /* @__PURE__ */ React.createElement(ContentCard, { block, key: block.id }))
    ))))))),
    /* @__PURE__ */ React.createElement(DragOverlay, { dropAnimation: null }, activeBlock && /* @__PURE__ */ React.createElement(DragSwingOverlay, { block: activeBlock })),
    settlingBlock && /* @__PURE__ */ React.createElement(
      SettlingOverlay,
      {
        block: settlingBlock,
        onAnimationComplete: handleSettlingComplete
      }
    )
  );
});
EditorPage.displayName = "EditorPage";
function App() {
  return /* @__PURE__ */ React.createElement(StoreProvider, null, /* @__PURE__ */ React.createElement(EditorPage, null));
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
export {
  Store
};
