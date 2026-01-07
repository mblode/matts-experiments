import { motion } from "motion/react";
import { create } from "zustand";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { CanvasTexture, Color, DoubleSide, PlaneGeometry, SRGBColorSpace, ShaderMaterial, Vector2 } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { getStroke } from "perfect-freehand";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createRoot } from "react-dom/client";
const PASTEL_COLORS = {
  yellow: "#fef08a",
  blue: "#bfdbfe",
  purple: "#ddd6fe",
  pink: "#fbcfe8",
  green: "#bbf7d0"
};
const createInitialNotes = (count, color) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `note-${i}`,
    color,
    paths: [],
    createdAt: /* @__PURE__ */ new Date()
  }));
};
const initialVec2 = { x: 0.5, y: 0.5 };
const useStickyNotesStore = create((set, get) => ({
  notes: createInitialNotes(25, PASTEL_COLORS.yellow),
  currentColor: PASTEL_COLORS.yellow,
  isPeeling: false,
  peelEdge: null,
  clickPos: initialVec2,
  dragPos: initialVec2,
  animationState: "idle",
  targetProgress: 0,
  peeledNotes: [],
  setCurrentColor: (color) => {
    set({ currentColor: color });
    const notes = get().notes;
    if (notes.length > 0) {
      const updatedNotes = [...notes];
      updatedNotes[0] = { ...updatedNotes[0], color };
      set({ notes: updatedNotes });
    }
  },
  addPathToTopNote: (path) => {
    const notes = get().notes;
    if (notes.length === 0) {
      return;
    }
    const updatedNotes = [...notes];
    updatedNotes[0] = {
      ...updatedNotes[0],
      paths: [...updatedNotes[0].paths, path]
    };
    set({ notes: updatedNotes });
  },
  startPeel: (edge, clickPos) => {
    set({
      isPeeling: true,
      peelEdge: edge,
      clickPos,
      dragPos: clickPos,
      animationState: "dragging",
      targetProgress: 0
    });
  },
  updatePeel: (dragPos) => {
    set({ dragPos });
  },
  setAnimationState: (state, targetProgress) => {
    set({
      animationState: state,
      ...targetProgress !== void 0 && { targetProgress }
    });
  },
  completePeel: () => {
    const { notes, peeledNotes, currentColor } = get();
    if (notes.length === 0) {
      return;
    }
    const [peeledNote, ...remainingNotes] = notes;
    const newNote = {
      id: `note-${Date.now()}`,
      color: currentColor,
      paths: [],
      createdAt: /* @__PURE__ */ new Date()
    };
    set({
      notes: [...remainingNotes, newNote],
      peeledNotes: [...peeledNotes, peeledNote],
      isPeeling: false,
      peelEdge: null,
      clickPos: initialVec2,
      dragPos: initialVec2,
      animationState: "idle",
      targetProgress: 0
    });
  },
  cancelPeel: () => {
    set({
      isPeeling: false,
      peelEdge: null,
      clickPos: initialVec2,
      dragPos: initialVec2,
      animationState: "idle",
      targetProgress: 0
    });
  }
}));
const colors = Object.values(PASTEL_COLORS);
const ColorPicker = () => {
  const { currentColor, setCurrentColor } = useStickyNotesStore();
  return /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 gap-4" }, colors.map((color) => /* @__PURE__ */ React.createElement(
    motion.button,
    {
      animate: {
        boxShadow: currentColor === color ? "0 0 0 2px rgba(0,0,0,0.3), 0 4px 6px -1px rgba(0,0,0,0.1)" : "0 4px 6px -1px rgba(0,0,0,0.1)"
      },
      className: "h-10 w-10 cursor-pointer rounded-full border border-black/12 shadow-md",
      key: color,
      onClick: () => setCurrentColor(color),
      style: { backgroundColor: color },
      whileHover: { scale: 1.1 },
      whileTap: { scale: 0.95 }
    }
  )));
};
const EDGE_ZONE_PERCENT = 0.15;
const PEEL_THRESHOLD = 0.5;
const PEEL_DISTANCE_FACTOR = 0.7;
const ANIMATION_DURATION_MS = 300;
const CURL_MIN_RADIUS = 0.05;
const CURL_MAX_RADIUS = 0.15;
const NOTE_SIZE = 300;
const SPRING_STIFFNESS = 180;
const SPRING_DAMPING = 12;
const SPRING_MASS = 1;
const MOMENTUM_THRESHOLD = 2;
const MOMENTUM_PROGRESS_MIN = 0.3;
function useSvgToTexture(options) {
  const { width, height, backgroundColor } = options;
  const textureRef = useRef(null);
  const canvasRef = useRef(null);
  const captureToTexture = useCallback(
    async (svgElement) => {
      try {
        if (!canvasRef.current) {
          canvasRef.current = document.createElement("canvas");
        }
        const canvas = canvasRef.current;
        const dpr = Math.min(window.devicePixelRatio, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return null;
        }
        ctx.scale(dpr, dpr);
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
        const svgClone = svgElement.cloneNode(true);
        svgClone.setAttribute("width", String(width));
        svgClone.setAttribute("height", String(height));
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgClone);
        const blob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8"
        });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = url;
        });
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        if (textureRef.current) {
          textureRef.current.dispose();
        }
        const texture = new CanvasTexture(canvas);
        texture.needsUpdate = true;
        texture.flipY = false;
        texture.colorSpace = SRGBColorSpace;
        textureRef.current = texture;
        return texture;
      } catch (error) {
        console.error("Error capturing SVG to texture:", error);
        return null;
      }
    },
    [width, height, backgroundColor]
  );
  const disposeTexture = useCallback(() => {
    if (textureRef.current) {
      textureRef.current.dispose();
      textureRef.current = null;
    }
  }, []);
  return { captureToTexture, disposeTexture };
}
const DEFAULT_CONFIG = {
  stiffness: SPRING_STIFFNESS,
  damping: SPRING_DAMPING,
  mass: SPRING_MASS
};
const SETTLE_THRESHOLD = 1e-3;
const VELOCITY_THRESHOLD = 1e-3;
function useSpring(target, config = {}, onSettle) {
  const { stiffness, damping, mass } = { ...DEFAULT_CONFIG, ...config };
  const stateRef = useRef({
    value: target,
    velocity: 0,
    isSettled: true
  });
  const targetRef = useRef(target);
  const onSettleRef = useRef(onSettle);
  onSettleRef.current = onSettle;
  if (targetRef.current !== target) {
    targetRef.current = target;
    stateRef.current.isSettled = false;
  }
  useFrame((_, delta) => {
    const state = stateRef.current;
    const currentTarget = targetRef.current;
    if (state.isSettled) {
      return;
    }
    const dt = Math.min(delta, 0.064);
    const displacement = state.value - currentTarget;
    const springForce = -stiffness * displacement;
    const dampingForce = -damping * state.velocity;
    const acceleration = (springForce + dampingForce) / mass;
    state.velocity += acceleration * dt;
    state.value += state.velocity * dt;
    const isSettled = Math.abs(displacement) < SETTLE_THRESHOLD && Math.abs(state.velocity) < VELOCITY_THRESHOLD;
    if (isSettled) {
      state.value = currentTarget;
      state.velocity = 0;
      state.isSettled = true;
      onSettleRef.current?.();
    }
  });
  return stateRef.current;
}
function springStep(current, target, velocity, config, deltaTime) {
  const { stiffness, damping, mass } = config;
  const displacement = current - target;
  const springForce = -stiffness * displacement;
  const dampingForce = -damping * velocity;
  const acceleration = (springForce + dampingForce) / mass;
  const newVelocity = velocity + acceleration * deltaTime;
  const newValue = current + newVelocity * deltaTime;
  const isSettled = Math.abs(newValue - target) < SETTLE_THRESHOLD && Math.abs(newVelocity) < VELOCITY_THRESHOLD;
  return {
    value: isSettled ? target : newValue,
    velocity: isSettled ? 0 : newVelocity,
    isSettled
  };
}
const fragmentShader = `
#define PI 3.14159265359

uniform vec2 uClickPos;      // Where drag started (normalized 0-1)
uniform vec2 uDragPos;       // Current drag position (normalized 0-1)
uniform float uRadius;       // Curl cylinder radius
uniform sampler2D uNoteTexture;
uniform vec3 uBaseColor;
uniform vec3 uBackColor;     // Back of paper color

varying vec2 vUv;

// Enhanced shadow calculation for realistic depth
float computeShadow(float dist, float radius, float theta) {
  // Deeper shadow at the fold crease
  float foldShadow = smoothstep(0.0, radius, dist) * 0.2;

  // Ambient occlusion from curl depth (paper curves inward)
  float curlDepth = sin(theta) * radius;
  float aoShadow = curlDepth * 0.25;

  // Self-shadow from the overhanging curl behind
  float overhang = max(0.0, -dist / radius);
  float selfShadow = overhang * 0.35;

  return clamp(1.0 - foldShadow - aoShadow - selfShadow, 0.55, 1.0);
}

void main() {
  vec2 uv = vUv;

  // Direction from drag to click (curl direction)
  vec2 mouseDir = uClickPos - uDragPos;
  float mouseDist = length(mouseDir);

  // Handle no drag - show flat texture
  if (mouseDist < 0.001) {
    vec4 tex = texture2D(uNoteTexture, uv);
    gl_FragColor = vec4(mix(uBaseColor, tex.rgb, tex.a), 1.0);
    return;
  }

  mouseDir = normalize(mouseDir);

  // Project UV onto curl direction relative to drag position
  float dist = dot(uv - uDragPos, mouseDir);
  vec2 linePoint = uv - mouseDir * dist;

  vec3 color;
  float shadow = 1.0;  // Default: no darkening

  if (dist > uRadius) {
    // REGION 1: Ahead of curl - flat page
    vec4 tex = texture2D(uNoteTexture, uv);
    color = mix(uBaseColor, tex.rgb, tex.a);

    // Subtle shadow gradient approaching the fold
    float edgeDist = dist - uRadius;
    float edgeShadow = smoothstep(0.15, 0.0, edgeDist) * 0.08;
    shadow = 1.0 - edgeShadow;

  } else if (dist >= 0.0) {
    // REGION 2: On the curl
    float theta = asin(clamp(dist / uRadius, -1.0, 1.0));
    vec2 p2 = linePoint + mouseDir * (PI - theta) * uRadius;  // Back face UV
    vec2 p1 = linePoint + mouseDir * theta * uRadius;          // Front face UV

    // Check if back of page is visible (p2 is within bounds)
    bool useBack = (p2.x >= 0.0 && p2.x <= 1.0 && p2.y >= 0.0 && p2.y <= 1.0);

    if (useBack) {
      // Back of page - show blank paper color with shadow
      color = uBackColor;
      shadow = computeShadow(dist, uRadius, theta) * 0.92;
    } else {
      // Front of page - sample texture at remapped UV
      if (p1.x >= 0.0 && p1.x <= 1.0 && p1.y >= 0.0 && p1.y <= 1.0) {
        vec4 tex = texture2D(uNoteTexture, p1);
        color = mix(uBaseColor, tex.rgb, tex.a);
      } else {
        vec4 tex = texture2D(uNoteTexture, uv);
        color = mix(uBaseColor, tex.rgb, tex.a);
      }

      // Apply curl shadow with highlight at apex
      shadow = computeShadow(dist, uRadius, theta);

      // Subtle highlight at curl apex (light catching the edge)
      float highlight = smoothstep(0.0, 0.15, theta) * smoothstep(0.4, 0.0, theta);
      color = mix(color, vec3(1.0), highlight * 0.08);
    }

  } else {
    // REGION 3: Behind curl - back of curled paper visible
    color = uBackColor;

    // Darker shadow behind the curl
    float behindDist = abs(dist);
    shadow = 0.55 + 0.35 * smoothstep(0.0, uRadius * 2.0, behindDist);
  }

  gl_FragColor = vec4(color * shadow, 1.0);
}
`;
const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const easeOutCubic = (t) => 1 - (1 - t) ** 3;
const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
const paperEase = (t) => t ** 0.7;
const linear = (t) => t;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const springConfig = prefersReducedMotion ? { stiffness: 500, damping: 50, mass: 1 } : { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING, mass: SPRING_MASS };
function CurlingNoteMesh({
  texture,
  clickPos,
  dragPos,
  baseColor = "#fef08a",
  animationState,
  targetProgress,
  onAnimationComplete
}) {
  const materialRef = useRef(null);
  const springRef = useRef({
    value: 0,
    velocity: 0,
    isSettled: true
  });
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  onAnimationCompleteRef.current = onAnimationComplete;
  const geometry = useMemo(() => {
    return new PlaneGeometry(1, 1, 1, 1);
  }, []);
  const material = useMemo(() => {
    const baseColorVec = new Color(baseColor);
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uClickPos: { value: new Vector2(clickPos.x, 1 - clickPos.y) },
        uDragPos: { value: new Vector2(dragPos.x, 1 - dragPos.y) },
        uRadius: { value: 0.1 },
        uNoteTexture: { value: texture },
        uBaseColor: { value: baseColorVec },
        uBackColor: { value: baseColorVec.clone() }
        // Back matches front for sticky notes
      },
      side: DoubleSide,
      transparent: false
    });
  }, [texture, baseColor, clickPos.x, clickPos.y, dragPos.x, dragPos.y]);
  const calculateRawProgress = useCallback(() => {
    const dx = clickPos.x - dragPos.x;
    const dy = dragPos.y - clickPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return Math.min(1, distance / PEEL_DISTANCE_FACTOR);
  }, [clickPos, dragPos]);
  useFrame((_, delta) => {
    if (!materialRef.current) {
      return;
    }
    materialRef.current.uniforms.uClickPos.value.set(
      clickPos.x,
      1 - clickPos.y
    );
    materialRef.current.uniforms.uDragPos.value.set(dragPos.x, 1 - dragPos.y);
    materialRef.current.uniforms.uBaseColor.value.set(baseColor);
    materialRef.current.uniforms.uBackColor.value.set(baseColor);
    let currentTarget;
    if (animationState === "dragging") {
      currentTarget = calculateRawProgress();
    } else if (animationState === "completing") {
      currentTarget = 1;
    } else if (animationState === "cancelling") {
      currentTarget = 0;
    } else {
      currentTarget = targetProgress;
    }
    const isAnimating = animationState === "completing" || animationState === "cancelling";
    if (isAnimating && !springRef.current.isSettled) {
      const nextState = springStep(
        springRef.current.value,
        currentTarget,
        springRef.current.velocity,
        springConfig,
        Math.min(delta, 0.064)
        // Clamp delta for stability
      );
      springRef.current = nextState;
      if (nextState.isSettled) {
        onAnimationCompleteRef.current?.();
      }
    } else if (animationState === "dragging") {
      springRef.current.value = currentTarget;
      springRef.current.velocity = 0;
      springRef.current.isSettled = false;
    }
    const smoothProgress = springRef.current.value;
    const easedProgress = paperEase(smoothProgress);
    const radius = CURL_MIN_RADIUS + (1 - easedProgress) * (CURL_MAX_RADIUS - CURL_MIN_RADIUS);
    materialRef.current.uniforms.uRadius.value = radius;
    if (texture) {
      materialRef.current.uniforms.uNoteTexture.value = texture;
    }
  });
  return /* @__PURE__ */ React.createElement("mesh", { geometry }, /* @__PURE__ */ React.createElement("primitive", { attach: "material", object: material, ref: materialRef }));
}
function PageCurlCanvas({
  isActive,
  texture,
  clickPos,
  dragPos,
  baseColor,
  noteSize,
  animationState,
  targetProgress,
  onAnimationComplete
}) {
  if (!(isActive && texture)) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "pointer-events-none absolute",
      style: {
        width: noteSize,
        height: noteSize,
        zIndex: 100
      }
    },
    /* @__PURE__ */ React.createElement(
      Canvas,
      {
        camera: {
          zoom: noteSize,
          position: [0, 0, 10],
          near: 0.1,
          far: 100
        },
        gl: {
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true
        },
        orthographic: true,
        style: {
          width: "100%",
          height: "100%",
          background: "transparent"
        }
      },
      /* @__PURE__ */ React.createElement(
        CurlingNoteMesh,
        {
          animationState,
          baseColor,
          clickPos,
          dragPos,
          onAnimationComplete,
          targetProgress,
          texture
        }
      )
    )
  );
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
const StickyNoteComponent = forwardRef(
  ({ note, isTopNote, index, onAddPath, isPeeling = false }, ref) => {
    const [currentPath, setCurrentPath] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const svgRef = useRef(null);
    const currentBrushSize = 8;
    useImperativeHandle(ref, () => ({
      getSvgElement: () => svgRef.current
    }));
    const getPointFromEvent = useCallback((e) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) {
        return { x: 0, y: 0 };
      }
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        pressure: e.pressure || 0.5
      };
    }, []);
    const handlePointerDown = useCallback(
      (e) => {
        if (!isTopNote || isPeeling) {
          return;
        }
        e.preventDefault();
        const target = e.target;
        target.setPointerCapture(e.pointerId);
        const point = getPointFromEvent(e);
        setCurrentPath([point]);
        setIsDrawing(true);
      },
      [isTopNote, isPeeling, getPointFromEvent]
    );
    const handlePointerMove = useCallback(
      (e) => {
        if (!(isDrawing && isTopNote) || isPeeling) {
          return;
        }
        const point = getPointFromEvent(e);
        setCurrentPath((prev) => [...prev, point]);
      },
      [isDrawing, isTopNote, isPeeling, getPointFromEvent]
    );
    const handlePointerUp = useCallback(() => {
      if (!isDrawing || currentPath.length < 2) {
        setIsDrawing(false);
        setCurrentPath([]);
        return;
      }
      onAddPath({
        points: currentPath,
        color: "#000",
        size: currentBrushSize
      });
      setCurrentPath([]);
      setIsDrawing(false);
    }, [isDrawing, currentPath, onAddPath]);
    const renderPath = (pathData, pathIndex) => {
      if (pathData.points.length < 2) {
        return null;
      }
      const stroke = getStroke(
        pathData.points.map((p) => [p.x, p.y, p.pressure || 0.5]),
        {
          size: pathData.size,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5
        }
      );
      const pathD = getSvgPathFromStroke(stroke);
      return /* @__PURE__ */ React.createElement(
        "path",
        {
          d: pathD,
          fill: pathData.color,
          key: pathIndex,
          style: { pointerEvents: "none" }
        }
      );
    };
    const renderCurrentPath = () => {
      if (currentPath.length < 2) {
        return null;
      }
      const stroke = getStroke(
        currentPath.map((p) => [p.x, p.y, p.pressure || 0.5]),
        {
          size: currentBrushSize,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5
        }
      );
      const pathD = getSvgPathFromStroke(stroke);
      return /* @__PURE__ */ React.createElement("path", { d: pathD, fill: "#000", style: { pointerEvents: "none" } });
    };
    const stackOffset = index * 1.5;
    const visibility = isTopNote && isPeeling ? "hidden" : "visible";
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "absolute",
        style: {
          width: NOTE_SIZE,
          height: NOTE_SIZE,
          backgroundColor: note.color,
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 4,
          transform: `translateY(${stackOffset}px)`,
          zIndex: 25 - index,
          boxShadow: index === 24 ? "0 4px 20px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)" : "none",
          cursor: isTopNote && !isPeeling ? "crosshair" : "default",
          visibility
        }
      },
      /* @__PURE__ */ React.createElement(
        "svg",
        {
          "aria-label": `Sticky note ${note.id}`,
          className: "touch-none",
          height: NOTE_SIZE,
          onPointerDown: handlePointerDown,
          onPointerLeave: handlePointerUp,
          onPointerMove: handlePointerMove,
          onPointerUp: handlePointerUp,
          ref: svgRef,
          style: { touchAction: "none" },
          viewBox: `0 0 ${NOTE_SIZE} ${NOTE_SIZE}`,
          width: NOTE_SIZE
        },
        /* @__PURE__ */ React.createElement("title", null, `Sticky note ${note.id}`),
        /* @__PURE__ */ React.createElement("rect", { fill: note.color, height: NOTE_SIZE, width: NOTE_SIZE }),
        note.paths.map(renderPath),
        isTopNote && renderCurrentPath()
      )
    );
  }
);
StickyNoteComponent.displayName = "StickyNoteComponent";
const StickyNoteStack = () => {
  const {
    notes,
    addPathToTopNote,
    isPeeling,
    peelEdge,
    clickPos,
    dragPos,
    animationState,
    targetProgress,
    startPeel,
    updatePeel,
    completePeel,
    cancelPeel,
    setAnimationState
  } = useStickyNotesStore();
  const containerRef = useRef(null);
  const topNoteRef = useRef(null);
  const [noteTexture, setNoteTexture] = useState(null);
  const pointerIdRef = useRef(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);
  const velocityRef = useRef({ x: 0, y: 0 });
  const topNote = notes[0];
  const { captureToTexture, disposeTexture } = useSvgToTexture({
    width: NOTE_SIZE,
    height: NOTE_SIZE,
    backgroundColor: topNote?.color || "#fef08a"
  });
  const clientToNoteSpace = useCallback(
    (clientX, clientY) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) {
        return null;
      }
      return {
        x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
        y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
      };
    },
    []
  );
  const detectEdgeAndPos = useCallback(
    (clientX, clientY) => {
      const pos = clientToNoteSpace(clientX, clientY);
      if (!pos) {
        return null;
      }
      let edge = null;
      if (pos.y < EDGE_ZONE_PERCENT) {
        edge = "top";
      } else if (pos.x > 1 - EDGE_ZONE_PERCENT) {
        edge = "right";
      } else if (pos.y > 1 - EDGE_ZONE_PERCENT) {
        edge = "bottom";
      } else if (pos.x < EDGE_ZONE_PERCENT) {
        edge = "left";
      }
      return edge ? { edge, pos } : null;
    },
    [clientToNoteSpace]
  );
  const computeProgress = useCallback(() => {
    const dx = dragPos.x - clickPos.x;
    const dy = dragPos.y - clickPos.y;
    let distance = 0;
    switch (peelEdge) {
      case "right":
        distance = -dx;
        break;
      case "left":
        distance = dx;
        break;
      case "top":
        distance = dy;
        break;
      case "bottom":
        distance = -dy;
        break;
      default:
        distance = Math.sqrt(dx * dx + dy * dy);
    }
    return Math.min(1, Math.max(0, distance / PEEL_DISTANCE_FACTOR));
  }, [clickPos, dragPos, peelEdge]);
  const isDraggingRef = useRef(false);
  const handlePeelStart = useCallback(
    async (edge, pos) => {
      const svgElement = topNoteRef.current?.getSvgElement();
      if (svgElement) {
        const texture = await captureToTexture(svgElement);
        setNoteTexture(texture);
      }
      startPeel(edge, pos);
    },
    [captureToTexture, startPeel]
  );
  const handlePointerDown = useCallback(
    (e) => {
      if (isPeeling) {
        return;
      }
      const detection = detectEdgeAndPos(e.clientX, e.clientY);
      if (detection) {
        e.preventDefault();
        e.stopPropagation();
        e.target.setPointerCapture(e.pointerId);
        pointerIdRef.current = e.pointerId;
        isDraggingRef.current = true;
        handlePeelStart(detection.edge, detection.pos);
      }
    },
    [isPeeling, detectEdgeAndPos, handlePeelStart]
  );
  const handlePointerMove = useCallback(
    (e) => {
      if (!(isDraggingRef.current && isPeeling)) {
        return;
      }
      const pos = clientToNoteSpace(e.clientX, e.clientY);
      if (pos) {
        const now = performance.now();
        const dt = (now - lastTimeRef.current) / 1e3;
        if (dt > 0 && lastTimeRef.current > 0) {
          velocityRef.current = {
            x: (pos.x - lastPosRef.current.x) / dt,
            y: (pos.y - lastPosRef.current.y) / dt
          };
        }
        lastPosRef.current = pos;
        lastTimeRef.current = now;
        updatePeel(pos);
      }
    },
    [isPeeling, clientToNoteSpace, updatePeel]
  );
  const getEdgeVelocity = useCallback(() => {
    const { x: vx, y: vy } = velocityRef.current;
    switch (peelEdge) {
      case "right":
        return -vx;
      // Pulling left
      case "left":
        return vx;
      // Pulling right
      case "top":
        return vy;
      // Pulling down
      case "bottom":
        return -vy;
      // Pulling up
      default:
        return Math.sqrt(vx * vx + vy * vy);
    }
  }, [peelEdge]);
  const handlePointerUp = useCallback(
    (e) => {
      if (!isDraggingRef.current) {
        return;
      }
      if (pointerIdRef.current !== null && e?.target) {
        try {
          e.target.releasePointerCapture(pointerIdRef.current);
        } catch {
        }
        pointerIdRef.current = null;
      }
      isDraggingRef.current = false;
      const progress = computeProgress();
      const velocity = getEdgeVelocity();
      velocityRef.current = { x: 0, y: 0 };
      lastTimeRef.current = 0;
      const shouldComplete = progress >= PEEL_THRESHOLD || progress >= MOMENTUM_PROGRESS_MIN && velocity > MOMENTUM_THRESHOLD;
      if (shouldComplete) {
        setAnimationState("completing", 1);
      } else {
        setAnimationState("cancelling", 0);
      }
    },
    [computeProgress, getEdgeVelocity, setAnimationState]
  );
  const handleAnimationComplete = useCallback(() => {
    if (animationState === "completing") {
      completePeel();
    } else if (animationState === "cancelling") {
      cancelPeel();
    }
    disposeTexture();
    setNoteTexture(null);
  }, [animationState, completePeel, cancelPeel, disposeTexture]);
  useEffect(() => {
    return () => {
      disposeTexture();
    };
  }, [disposeTexture]);
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "relative flex items-center justify-center",
      onPointerDown: handlePointerDown,
      onPointerLeave: () => handlePointerUp(),
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      ref: containerRef,
      style: {
        width: NOTE_SIZE,
        height: NOTE_SIZE + 40
      }
    },
    [...notes].reverse().map((note, reversedIndex) => {
      const actualIndex = notes.length - 1 - reversedIndex;
      const isTop = actualIndex === 0;
      return /* @__PURE__ */ React.createElement(
        StickyNoteComponent,
        {
          index: actualIndex,
          isPeeling: isTop && isPeeling && noteTexture !== null,
          isTopNote: isTop,
          key: note.id,
          note,
          onAddPath: addPathToTopNote,
          ref: isTop ? topNoteRef : void 0
        }
      );
    }),
    /* @__PURE__ */ React.createElement(
      PageCurlCanvas,
      {
        animationState,
        baseColor: topNote?.color || "#fef08a",
        clickPos,
        dragPos,
        isActive: isPeeling,
        noteSize: NOTE_SIZE,
        onAnimationComplete: handleAnimationComplete,
        targetProgress,
        texture: noteTexture
      }
    )
  );
};
const StickyNotesBlock = () => {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StickyNoteStack, null), /* @__PURE__ */ React.createElement(ColorPicker, null));
};
function App() {
  return /* @__PURE__ */ React.createElement(StickyNotesBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
