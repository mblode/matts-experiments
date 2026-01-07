// CodePen packages: @react-three/fiber@^9.5.0, clsx@^2.1.1, motion@^12.23.26, perfect-freehand@^1.2.2, react-dom@19.2.3, react@19.2.3, tailwind-merge@^3.4.0, three@^0.182.0, zustand@^5.0.9

import { motion } from "motion/react";
import { create } from "zustand";
import * as React from "react";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { CanvasTexture, Color, DoubleSide, PlaneGeometry, SRGBColorSpace, ShaderMaterial, Vector2, type Texture } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { getStroke } from "perfect-freehand";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createRoot } from "react-dom/client";

interface Vec2 {
  x: number;
  y: number;
}

interface Point {
  x: number;
  y: number;
  pressure?: number;
}

interface PathData {
  points: Point[];
  color: string;
  size: number;
}

interface StickyNote {
  id: string;
  color: string;
  paths: PathData[];
  createdAt: Date;
}

type PeelEdge = "top" | "right" | "bottom" | "left" | null;
type AnimationState = "idle" | "dragging" | "completing" | "cancelling";

interface StickyNotesStore {
  // Notes stack (index 0 = top)
  notes: StickyNote[];
  currentColor: string;

  // Peel state
  isPeeling: boolean;
  peelEdge: PeelEdge;
  clickPos: Vec2; // Where drag started (0-1 normalized)
  dragPos: Vec2; // Current drag position (0-1 normalized)

  // Animation state for spring physics
  animationState: AnimationState;
  targetProgress: number; // 0 for cancel, 1 for complete

  // Actions
  setCurrentColor: (color: string) => void;
  addPathToTopNote: (path: PathData) => void;
  startPeel: (edge: PeelEdge, clickPos: Vec2) => void;
  updatePeel: (dragPos: Vec2) => void;
  completePeel: () => void;
  cancelPeel: () => void;
  setAnimationState: (state: AnimationState, targetProgress?: number) => void;

  // History
  peeledNotes: StickyNote[];
}

const PASTEL_COLORS = {
  yellow: "#fef08a",
  blue: "#bfdbfe",
  purple: "#ddd6fe",
  pink: "#fbcfe8",
  green: "#bbf7d0",
} as const;

const createInitialNotes = (count: number, color: string): StickyNote[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `note-${i}`,
    color,
    paths: [],
    createdAt: new Date(),
  }));
};

const initialVec2: Vec2 = { x: 0.5, y: 0.5 };

const useStickyNotesStore = create<StickyNotesStore>((set, get) => ({
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
    // Update the top note's color
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
      paths: [...updatedNotes[0].paths, path],
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
      targetProgress: 0,
    });
  },

  updatePeel: (dragPos) => {
    set({ dragPos });
  },

  setAnimationState: (state, targetProgress) => {
    set({
      animationState: state,
      ...(targetProgress !== undefined && { targetProgress }),
    });
  },

  completePeel: () => {
    const { notes, peeledNotes, currentColor } = get();
    if (notes.length === 0) {
      return;
    }

    const [peeledNote, ...remainingNotes] = notes;

    // Add a new blank note at the bottom to maintain stack size
    const newNote: StickyNote = {
      id: `note-${Date.now()}`,
      color: currentColor,
      paths: [],
      createdAt: new Date(),
    };

    set({
      notes: [...remainingNotes, newNote],
      peeledNotes: [...peeledNotes, peeledNote],
      isPeeling: false,
      peelEdge: null,
      clickPos: initialVec2,
      dragPos: initialVec2,
      animationState: "idle",
      targetProgress: 0,
    });
  },

  cancelPeel: () => {
    set({
      isPeeling: false,
      peelEdge: null,
      clickPos: initialVec2,
      dragPos: initialVec2,
      animationState: "idle",
      targetProgress: 0,
    });
  },
}));

const colors = Object.values(PASTEL_COLORS);

const ColorPicker = () => {
  const { currentColor, setCurrentColor } = useStickyNotesStore();

  return (
    <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 gap-4">
      {colors.map((color) => (
        <motion.button
          animate={{
            boxShadow:
              currentColor === color
                ? "0 0 0 2px rgba(0,0,0,0.3), 0 4px 6px -1px rgba(0,0,0,0.1)"
                : "0 4px 6px -1px rgba(0,0,0,0.1)",
          }}
          className="h-10 w-10 cursor-pointer rounded-full border border-black/12 shadow-md"
          key={color}
          onClick={() => setCurrentColor(color)}
          style={{ backgroundColor: color }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        />
      ))}
    </div>
  );
};

// Gesture detection
const EDGE_ZONE_PERCENT = 0.15; // 15% from edge for peel detection
const PEEL_THRESHOLD = 0.5; // Progress needed to complete peel
const PEEL_DISTANCE_FACTOR = 0.7; // Normalization for directional progress

// Animation timing
const ANIMATION_DURATION_MS = 300;

// Curl rendering
const CURL_MIN_RADIUS = 0.05;
const CURL_MAX_RADIUS = 0.15;

// Note dimensions
const NOTE_SIZE = 300;

// Spring physics defaults
const SPRING_STIFFNESS = 180;
const SPRING_DAMPING = 12;
const SPRING_MASS = 1;

// Momentum threshold for completion
const MOMENTUM_THRESHOLD = 2.0;
const MOMENTUM_PROGRESS_MIN = 0.3;

interface UseSvgToTextureOptions {
  width: number;
  height: number;
  backgroundColor: string;
}

function useSvgToTexture(options: UseSvgToTextureOptions) {
  const { width, height, backgroundColor } = options;
  const textureRef = useRef<CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const captureToTexture = useCallback(
    async (svgElement: SVGSVGElement): Promise<CanvasTexture | null> => {
      try {
        // Create or reuse canvas
        if (!canvasRef.current) {
          canvasRef.current = document.createElement("canvas");
        }
        const canvas = canvasRef.current;

        // Set canvas size with device pixel ratio for sharpness
        const dpr = Math.min(window.devicePixelRatio, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return null;
        }

        // Scale context for device pixel ratio
        ctx.scale(dpr, dpr);

        // Draw background color
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Clone and serialize SVG
        const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
        svgClone.setAttribute("width", String(width));
        svgClone.setAttribute("height", String(height));

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgClone);

        // Create blob and load as image
        const blob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);

        const img = new Image();
        img.crossOrigin = "anonymous";

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = url;
        });

        // Draw SVG content on top of background
        ctx.drawImage(img, 0, 0, width, height);

        // Clean up blob URL
        URL.revokeObjectURL(url);

        // Dispose old texture if exists
        if (textureRef.current) {
          textureRef.current.dispose();
        }

        // Create Three.js texture
        const texture = new CanvasTexture(canvas);
        texture.needsUpdate = true;
        texture.flipY = false; // Shader handles Y inversion via 1 - clickPos.y
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

interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

interface SpringState {
  value: number;
  velocity: number;
  isSettled: boolean;
}

const DEFAULT_CONFIG: SpringConfig = {
  stiffness: SPRING_STIFFNESS,
  damping: SPRING_DAMPING,
  mass: SPRING_MASS,
};

// Threshold for considering the spring settled
const SETTLE_THRESHOLD = 0.001;
const VELOCITY_THRESHOLD = 0.001;

/**
 * Spring physics hook for smooth animations within Three.js context.
 * Uses the spring equation: F = -k * x - c * v
 * where k = stiffness, c = damping, x = displacement, v = velocity
 */
function useSpring(
  target: number,
  config: Partial<SpringConfig> = {},
  onSettle?: () => void
): SpringState {
  const { stiffness, damping, mass } = { ...DEFAULT_CONFIG, ...config };

  const stateRef = useRef<SpringState>({
    value: target,
    velocity: 0,
    isSettled: true,
  });

  const targetRef = useRef(target);
  const onSettleRef = useRef(onSettle);
  onSettleRef.current = onSettle;

  // Update target when it changes
  if (targetRef.current !== target) {
    targetRef.current = target;
    stateRef.current.isSettled = false;
  }

  useFrame((_, delta) => {
    const state = stateRef.current;
    const currentTarget = targetRef.current;

    // Skip if already settled
    if (state.isSettled) {
      return;
    }

    // Clamp delta to avoid instability with large time steps
    const dt = Math.min(delta, 0.064);

    // Spring physics calculation
    const displacement = state.value - currentTarget;
    const springForce = -stiffness * displacement;
    const dampingForce = -damping * state.velocity;
    const acceleration = (springForce + dampingForce) / mass;

    // Update velocity and position
    state.velocity += acceleration * dt;
    state.value += state.velocity * dt;

    // Check if settled
    const isSettled =
      Math.abs(displacement) < SETTLE_THRESHOLD &&
      Math.abs(state.velocity) < VELOCITY_THRESHOLD;

    if (isSettled) {
      state.value = currentTarget;
      state.velocity = 0;
      state.isSettled = true;
      onSettleRef.current?.();
    }
  });

  return stateRef.current;
}

/**
 * Standalone spring step function for manual animation control.
 * Returns the next state without requiring useFrame.
 */
function springStep(
  current: number,
  target: number,
  velocity: number,
  config: SpringConfig,
  deltaTime: number
): SpringState {
  const { stiffness, damping, mass } = config;

  const displacement = current - target;
  const springForce = -stiffness * displacement;
  const dampingForce = -damping * velocity;
  const acceleration = (springForce + dampingForce) / mass;

  const newVelocity = velocity + acceleration * deltaTime;
  const newValue = current + newVelocity * deltaTime;

  const isSettled =
    Math.abs(newValue - target) < SETTLE_THRESHOLD &&
    Math.abs(newVelocity) < VELOCITY_THRESHOLD;

  return {
    value: isSettled ? target : newValue,
    velocity: isSettled ? 0 : newVelocity,
    isSettled,
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

/**
 * Easing functions for smooth animations
 */

/**
 * Ease-out cubic - fast start, slow end
 * Good for elements moving to their final position
 */
const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

/**
 * Ease-in-out quadratic - smooth acceleration and deceleration
 * Good for looping animations or transitions
 */
const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;

/**
 * Paper-like easing - slight resistance initially, then releases
 * Mimics the feel of peeling sticky paper
 */
const paperEase = (t: number): number => t ** 0.7;

/**
 * Linear - no easing (useful for direct mapping)
 */
const linear = (t: number): number => t;

/**
 * Clamp a value between min and max
 */
const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

interface CurlingNoteMeshProps {
  texture: Texture | null;
  clickPos: Vec2;
  dragPos: Vec2;
  baseColor?: string;
  animationState: AnimationState;
  targetProgress: number;
  onAnimationComplete?: () => void;
}

// Check for reduced motion preference
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Spring config based on motion preference
const springConfig = prefersReducedMotion
  ? { stiffness: 500, damping: 50, mass: 1 } // Near-instant for reduced motion
  : { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING, mass: SPRING_MASS };

function CurlingNoteMesh({
  texture,
  clickPos,
  dragPos,
  baseColor = "#fef08a",
  animationState,
  targetProgress,
  onAnimationComplete,
}: CurlingNoteMeshProps) {
  const materialRef = useRef<ShaderMaterial>(null);
  const springRef = useRef<SpringState>({
    value: 0,
    velocity: 0,
    isSettled: true,
  });
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  onAnimationCompleteRef.current = onAnimationComplete;

  // Simple plane geometry - all curl logic is in fragment shader
  const geometry = useMemo(() => {
    return new PlaneGeometry(1, 1, 1, 1);
  }, []);

  // Create shader material with uniforms
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
        uBackColor: { value: baseColorVec.clone() }, // Back matches front for sticky notes
      },
      side: DoubleSide,
      transparent: false,
    });
  }, [texture, baseColor, clickPos.x, clickPos.y, dragPos.x, dragPos.y]);

  // Calculate raw progress from positions
  const calculateRawProgress = useCallback(() => {
    const dx = clickPos.x - dragPos.x;
    const dy = dragPos.y - clickPos.y; // Sign flipped to match shader's Y inversion
    const distance = Math.sqrt(dx * dx + dy * dy);
    return Math.min(1, distance / PEEL_DISTANCE_FACTOR);
  }, [clickPos, dragPos]);

  // Update uniforms on each frame with spring physics
  useFrame((_, delta) => {
    if (!materialRef.current) {
      return;
    }

    // Update positions
    materialRef.current.uniforms.uClickPos.value.set(
      clickPos.x,
      1 - clickPos.y
    );
    materialRef.current.uniforms.uDragPos.value.set(dragPos.x, 1 - dragPos.y);

    // Update colors dynamically (in case note color changes)
    materialRef.current.uniforms.uBaseColor.value.set(baseColor);
    materialRef.current.uniforms.uBackColor.value.set(baseColor);

    // Determine target based on animation state
    let currentTarget: number;

    if (animationState === "dragging") {
      // During drag, follow the raw progress from mouse position
      currentTarget = calculateRawProgress();
    } else if (animationState === "completing") {
      // Animating to completion
      currentTarget = 1;
    } else if (animationState === "cancelling") {
      // Animating back to start
      currentTarget = 0;
    } else {
      // Idle - use target progress
      currentTarget = targetProgress;
    }

    // Apply spring physics
    const isAnimating =
      animationState === "completing" || animationState === "cancelling";

    if (isAnimating && !springRef.current.isSettled) {
      // Use spring physics for smooth animation
      const nextState = springStep(
        springRef.current.value,
        currentTarget,
        springRef.current.velocity,
        springConfig,
        Math.min(delta, 0.064) // Clamp delta for stability
      );

      springRef.current = nextState;

      // Check if animation just completed
      if (nextState.isSettled) {
        onAnimationCompleteRef.current?.();
      }
    } else if (animationState === "dragging") {
      // During drag, directly follow the target (no spring)
      springRef.current.value = currentTarget;
      springRef.current.velocity = 0;
      springRef.current.isSettled = false; // Ready for animation
    }

    // Calculate radius from spring-animated progress with paper-like easing
    const smoothProgress = springRef.current.value;
    const easedProgress = paperEase(smoothProgress);

    // Radius decreases as progress increases (tighter curl when pulled further)
    const radius =
      CURL_MIN_RADIUS +
      (1 - easedProgress) * (CURL_MAX_RADIUS - CURL_MIN_RADIUS);
    materialRef.current.uniforms.uRadius.value = radius;

    if (texture) {
      materialRef.current.uniforms.uNoteTexture.value = texture;
    }
  });

  return (
    <mesh geometry={geometry}>
      <primitive attach="material" object={material} ref={materialRef} />
    </mesh>
  );
}

interface PageCurlCanvasProps {
  isActive: boolean;
  texture: THREE.Texture | null;
  clickPos: Vec2;
  dragPos: Vec2;
  baseColor: string;
  noteSize: number;
  animationState: AnimationState;
  targetProgress: number;
  onAnimationComplete?: () => void;
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
  onAnimationComplete,
}: PageCurlCanvasProps) {
  // Don't render until we have both active state AND texture with the drawing
  if (!(isActive && texture)) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        width: noteSize,
        height: noteSize,
        zIndex: 100,
      }}
    >
      <Canvas
        camera={{
          zoom: noteSize,
          position: [0, 0, 10],
          near: 0.1,
          far: 100,
        }}
        gl={{
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
        }}
        orthographic
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
      >
        <CurlingNoteMesh
          animationState={animationState}
          baseColor={baseColor}
          clickPos={clickPos}
          dragPos={dragPos}
          onAnimationComplete={onAnimationComplete}
          targetProgress={targetProgress}
          texture={texture}
        />
      </Canvas>
    </div>
  );
}

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

interface StickyNoteProps {
  note: StickyNoteType;
  isTopNote: boolean;
  index: number;
  onAddPath: (path: PathData) => void;
  isPeeling?: boolean;
}

interface StickyNoteRef {
  getSvgElement: () => SVGSVGElement | null;
}

const StickyNoteComponent = forwardRef<StickyNoteRef, StickyNoteProps>(
  ({ note, isTopNote, index, onAddPath, isPeeling = false }, ref) => {
    const [currentPath, setCurrentPath] = useState<Point[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);

    const currentBrushSize = 8;

    // Expose SVG element to parent
    useImperativeHandle(ref, () => ({
      getSvgElement: () => svgRef.current,
    }));

    const getPointFromEvent = useCallback((e: React.PointerEvent): Point => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) {
        return { x: 0, y: 0 };
      }

      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        pressure: e.pressure || 0.5,
      };
    }, []);

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (!isTopNote || isPeeling) {
          return;
        }

        e.preventDefault();
        const target = e.target as Element;
        target.setPointerCapture(e.pointerId);

        const point = getPointFromEvent(e);
        setCurrentPath([point]);
        setIsDrawing(true);
      },
      [isTopNote, isPeeling, getPointFromEvent]
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
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
        size: currentBrushSize,
      });
      setCurrentPath([]);
      setIsDrawing(false);
    }, [isDrawing, currentPath, onAddPath]);

    const renderPath = (pathData: PathData, pathIndex: number) => {
      if (pathData.points.length < 2) {
        return null;
      }

      const stroke = getStroke(
        pathData.points.map((p) => [p.x, p.y, p.pressure || 0.5]),
        {
          size: pathData.size,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        }
      );

      const pathD = getSvgPathFromStroke(stroke);

      return (
        <path
          d={pathD}
          fill={pathData.color}
          key={pathIndex}
          style={{ pointerEvents: "none" }}
        />
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
          streamline: 0.5,
        }
      );

      const pathD = getSvgPathFromStroke(stroke);

      return <path d={pathD} fill="#000" style={{ pointerEvents: "none" }} />;
    };

    // Calculate stacking offset - bottom notes peek out slightly
    const stackOffset = index * 1.5;

    // Hide top note when peeling (WebGL canvas takes over)
    const visibility = isTopNote && isPeeling ? "hidden" : "visible";

    return (
      <div
        className="absolute"
        style={{
          width: NOTE_SIZE,
          height: NOTE_SIZE,
          backgroundColor: note.color,
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 4,
          transform: `translateY(${stackOffset}px)`,
          zIndex: 25 - index,
          boxShadow:
            index === 24
              ? "0 4px 20px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)"
              : "none",
          cursor: isTopNote && !isPeeling ? "crosshair" : "default",
          visibility,
        }}
      >
        <svg
          aria-label={`Sticky note ${note.id}`}
          className="touch-none"
          height={NOTE_SIZE}
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          ref={svgRef}
          style={{ touchAction: "none" }}
          viewBox={`0 0 ${NOTE_SIZE} ${NOTE_SIZE}`}
          width={NOTE_SIZE}
        >
          <title>{`Sticky note ${note.id}`}</title>
          {/* Background rect for texture capture */}
          <rect fill={note.color} height={NOTE_SIZE} width={NOTE_SIZE} />
          {note.paths.map(renderPath)}
          {isTopNote && renderCurrentPath()}
        </svg>
      </div>
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
    setAnimationState,
  } = useStickyNotesStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const topNoteRef = useRef<StickyNoteRef>(null);
  const [noteTexture, setNoteTexture] = useState<THREE.Texture | null>(null);
  const pointerIdRef = useRef<number | null>(null);

  // Velocity tracking for momentum-based completion
  const lastPosRef = useRef<Vec2>({ x: 0, y: 0 });
  const lastTimeRef = useRef<number>(0);
  const velocityRef = useRef<Vec2>({ x: 0, y: 0 });

  const topNote = notes[0];

  const { captureToTexture, disposeTexture } = useSvgToTexture({
    width: NOTE_SIZE,
    height: NOTE_SIZE,
    backgroundColor: topNote?.color || "#fef08a",
  });

  // Convert client coordinates to normalized note-space (0-1)
  const clientToNoteSpace = useCallback(
    (clientX: number, clientY: number): Vec2 | null => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) {
        return null;
      }

      return {
        x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
        y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
      };
    },
    []
  );

  // Detect which edge the pointer is on and return position
  const detectEdgeAndPos = useCallback(
    (
      clientX: number,
      clientY: number
    ): { edge: "top" | "right" | "bottom" | "left"; pos: Vec2 } | null => {
      const pos = clientToNoteSpace(clientX, clientY);
      if (!pos) {
        return null;
      }

      let edge: "top" | "right" | "bottom" | "left" | null = null;
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

  // Calculate progress from clickPos and dragPos using edge-aware directional distance
  const computeProgress = useCallback((): number => {
    const dx = dragPos.x - clickPos.x;
    const dy = dragPos.y - clickPos.y;

    // Use directional distance based on which edge is being peeled
    let distance = 0;
    switch (peelEdge) {
      case "right":
        distance = -dx; // Pulling left from right edge
        break;
      case "left":
        distance = dx; // Pulling right from left edge
        break;
      case "top":
        distance = dy; // Pulling down from top edge
        break;
      case "bottom":
        distance = -dy; // Pulling up from bottom edge
        break;
      default:
        // Fallback to diagonal for safety
        distance = Math.sqrt(dx * dx + dy * dy);
    }

    return Math.min(1, Math.max(0, distance / PEEL_DISTANCE_FACTOR));
  }, [clickPos, dragPos, peelEdge]);

  // Track if we're in a drag
  const isDraggingRef = useRef(false);

  // Handle peel start
  const handlePeelStart = useCallback(
    async (edge: "top" | "right" | "bottom" | "left", pos: Vec2) => {
      // Capture SVG to texture
      const svgElement = topNoteRef.current?.getSvgElement();
      if (svgElement) {
        const texture = await captureToTexture(svgElement);
        setNoteTexture(texture);
      }

      startPeel(edge, pos);
    },
    [captureToTexture, startPeel]
  );

  // Handle pointer events on container
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isPeeling) {
        return;
      }

      const detection = detectEdgeAndPos(e.clientX, e.clientY);
      if (detection) {
        e.preventDefault();
        e.stopPropagation();
        (e.target as Element).setPointerCapture(e.pointerId);
        pointerIdRef.current = e.pointerId;

        isDraggingRef.current = true;
        handlePeelStart(detection.edge, detection.pos);
      }
    },
    [isPeeling, detectEdgeAndPos, handlePeelStart]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!(isDraggingRef.current && isPeeling)) {
        return;
      }

      const pos = clientToNoteSpace(e.clientX, e.clientY);
      if (pos) {
        // Track velocity for momentum-based completion
        const now = performance.now();
        const dt = (now - lastTimeRef.current) / 1000; // Convert to seconds

        if (dt > 0 && lastTimeRef.current > 0) {
          velocityRef.current = {
            x: (pos.x - lastPosRef.current.x) / dt,
            y: (pos.y - lastPosRef.current.y) / dt,
          };
        }

        lastPosRef.current = pos;
        lastTimeRef.current = now;

        updatePeel(pos);
      }
    },
    [isPeeling, clientToNoteSpace, updatePeel]
  );

  // Calculate edge-specific velocity magnitude
  const getEdgeVelocity = useCallback((): number => {
    const { x: vx, y: vy } = velocityRef.current;

    switch (peelEdge) {
      case "right":
        return -vx; // Pulling left
      case "left":
        return vx; // Pulling right
      case "top":
        return vy; // Pulling down
      case "bottom":
        return -vy; // Pulling up
      default:
        return Math.sqrt(vx * vx + vy * vy);
    }
  }, [peelEdge]);

  const handlePointerUp = useCallback(
    (e?: React.PointerEvent) => {
      if (!isDraggingRef.current) {
        return;
      }

      // Release pointer capture
      if (pointerIdRef.current !== null && e?.target) {
        try {
          (e.target as Element).releasePointerCapture(pointerIdRef.current);
        } catch {
          // Ignore if already released
        }
        pointerIdRef.current = null;
      }

      isDraggingRef.current = false;
      const progress = computeProgress();
      const velocity = getEdgeVelocity();

      // Reset velocity tracking
      velocityRef.current = { x: 0, y: 0 };
      lastTimeRef.current = 0;

      // Determine if we should complete based on progress OR momentum
      // Complete if: progress >= 0.5 OR (progress >= 0.3 AND velocity > threshold)
      const shouldComplete =
        progress >= PEEL_THRESHOLD ||
        (progress >= MOMENTUM_PROGRESS_MIN && velocity > MOMENTUM_THRESHOLD);

      if (shouldComplete) {
        // Trigger completion animation
        setAnimationState("completing", 1);
      } else {
        // Trigger cancel animation
        setAnimationState("cancelling", 0);
      }
    },
    [computeProgress, getEdgeVelocity, setAnimationState]
  );

  // Handle animation completion from spring physics
  const handleAnimationComplete = useCallback(() => {
    if (animationState === "completing") {
      completePeel();
    } else if (animationState === "cancelling") {
      cancelPeel();
    }

    // Clean up texture
    disposeTexture();
    setNoteTexture(null);
  }, [animationState, completePeel, cancelPeel, disposeTexture]);

  // Clean up texture on unmount
  useEffect(() => {
    return () => {
      disposeTexture();
    };
  }, [disposeTexture]);

  return (
    <div
      className="relative flex items-center justify-center"
      onPointerDown={handlePointerDown}
      onPointerLeave={() => handlePointerUp()}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      ref={containerRef}
      style={{
        width: NOTE_SIZE,
        height: NOTE_SIZE + 40,
      }}
    >
      {/* Render notes from bottom to top */}
      {[...notes].reverse().map((note, reversedIndex) => {
        const actualIndex = notes.length - 1 - reversedIndex;
        const isTop = actualIndex === 0;

        return (
          <StickyNoteComponent
            index={actualIndex}
            isPeeling={isTop && isPeeling && noteTexture !== null}
            isTopNote={isTop}
            key={note.id}
            note={note}
            onAddPath={addPathToTopNote}
            ref={isTop ? topNoteRef : undefined}
          />
        );
      })}

      {/* WebGL page curl overlay */}
      <PageCurlCanvas
        animationState={animationState}
        baseColor={topNote?.color || "#fef08a"}
        clickPos={clickPos}
        dragPos={dragPos}
        isActive={isPeeling}
        noteSize={NOTE_SIZE}
        onAnimationComplete={handleAnimationComplete}
        targetProgress={targetProgress}
        texture={noteTexture}
      />
    </div>
  );
};

const StickyNotesBlock = () => {
  return (
    <>
      <StickyNoteStack />
      <ColorPicker />
    </>
  );
};

function App() {
  return (
    <StickyNotesBlock />
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
