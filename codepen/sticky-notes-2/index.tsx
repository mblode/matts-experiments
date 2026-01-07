// CodePen packages: react-dom@19.2.3, react@19.2.3

import * as React from "react";
import { CSSProperties, Children, HTMLAttributes, ReactNode, RefObject, useCallback, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

// ============================================================================
// Core Geometry Types
// ============================================================================

interface Point2D {
  x: number;
  y: number;
}

// Bottom-right corner only for this implementation
type Corner = "br";

// ============================================================================
// Fold Geometry (calculated from pointer position)
// ============================================================================

interface FoldGeometry {
  /** Rotation angle in degrees */
  angle: number;
  /** Alpha angle in radians (for internal calculations) */
  alpha: number;
  /** Translation offset for transforms */
  translate: Point2D;
  /** Movement vector for edge cases */
  movement: Point2D;
  /** Pixel offset for fold line position */
  px: number;
  /** Destination fold point */
  df: Point2D;
  /** Gradient opacity (0-1) based on distance from end */
  gradientOpacity: number;
  /** Gradient size in pixels */
  gradientSize: number;
  /** Gradient start value for color stops */
  gradientStartV: number;
}

// ============================================================================
// Flip State
// ============================================================================

interface FlipState {
  /** Whether a flip animation is active */
  isFlipping: boolean;
  /** Whether the user is actively dragging */
  isDragging: boolean;
  /** Animation progress (0 to 1) */
  progress: number;
  /** Current page index (0-based) */
  currentPage: number;
  /** Current fold point position */
  foldPoint: Point2D | null;
}

// ============================================================================
// Transform Outputs
// ============================================================================

interface PageTransforms {
  /** Transform for the current page container */
  container: CSSProperties;
  /** Wrapper that clips and counter-rotates the current page */
  wrapper: CSSProperties;
  /** Transform for the page being flipped */
  currentPage: CSSProperties;
  /** Transform for the fold wrapper (fwrapper in turn.js) */
  foldWrapper: CSSProperties;
  /** Transform for fold page container (fpage.parent() in turn.js) */
  foldPageContainer: CSSProperties;
  /** Transform for the fold page (fpage in turn.js) */
  foldPage: CSSProperties;
  /** Transform for the folding content (90° rotated next page) */
  folding: CSSProperties;
  /** Gradient overlay on the front (shadow) */
  frontGradient: CSSProperties;
  /** Gradient overlay on the back */
  backGradient: CSSProperties;
}

// ============================================================================
// Hook Options and Returns
// ============================================================================

interface UseFlipbookOptions {
  /** Total number of pages */
  totalPages: number;
  /** Page dimensions */
  width: number;
  height: number;
  /** Initial page index (0-based, default 0) */
  initialPage?: number;
  /** Animation duration in ms (default 600) */
  duration?: number;
  /** Corner activation zone size in pixels (default 100) */
  cornerSize?: number;
  /** Enable gradient shadows (default true) */
  gradients?: boolean;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
}

interface UseFlipbookReturn {
  /** Ref to attach to container element */
  containerRef: RefObject<HTMLDivElement>;
  /** Current page index (0-based) */
  currentPage: number;
  /** Current flip state */
  flipState: FlipState;
  /** Calculated fold geometry (null when not flipping) */
  foldGeometry: FoldGeometry | null;
  /** CSS transforms to apply (null when not flipping) */
  pageTransforms: PageTransforms | null;
  /** Navigate to next page */
  nextPage: () => void;
  /** Navigate to previous page */
  previousPage: () => void;
  /** Navigate to specific page */
  goToPage: (page: number) => void;
}

interface UseCornerDetectionOptions {
  /** Ref to the container element */
  containerRef: RefObject<HTMLElement | null>;
  /** Size of corner activation zone in pixels */
  cornerSize: number;
  /** Container width */
  width: number;
  /** Container height */
  height: number;
  /** Whether detection is enabled */
  enabled: boolean;
  /** Callback when corner is activated */
  onCornerActivated?: (point: Point2D) => void;
  /** Callback when pointer moves while active */
  onPointerMove?: (point: Point2D) => void;
  /** Callback when pointer is released */
  onPointerRelease?: (point: Point2D, wasQuickFlip: boolean) => void;
  /** Callback when pointer leaves corner zone */
  onPointerLeave?: () => void;
}

interface UseCornerDetectionReturn {
  /** Whether pointer is in the corner zone */
  isInCorner: boolean;
  /** Current pointer position relative to container */
  pointerPosition: Point2D | null;
  /** Whether pointer is currently pressed */
  isPressed: boolean;
  /** Event handlers to attach to container */
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerLeave: (e: React.PointerEvent) => void;
  };
}

interface AnimationConfig {
  /** Starting point */
  from: Point2D;
  /** Ending point */
  to: Point2D;
  /** Duration in milliseconds */
  duration: number;
  /** Callback on each animation frame */
  onFrame: (point: Point2D) => void;
  /** Callback when animation completes */
  onComplete: () => void;
  /** Whether to use bezier curve (for page turn) */
  useBezier?: boolean;
}

interface UseFlipAnimationReturn {
  /** Start an animation */
  animate: (config: AnimationConfig) => void;
  /** Stop current animation */
  stop: () => void;
  /** Whether animation is currently running */
  isAnimating: boolean;
}

// ============================================================================
// Component Props
// ============================================================================

interface FlipbookProps {
  /** Width of the flipbook in pixels */
  width: number;
  /** Height of the flipbook in pixels */
  height: number;
  /** Animation duration in ms (default 600) */
  duration?: number;
  /** Corner activation zone size in pixels (default 100) */
  cornerSize?: number;
  /** Enable gradient shadows (default true) */
  gradients?: boolean;
  /** Page content as children */
  children: ReactNode[];
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Additional CSS class */
  className?: string;
}

// ============================================================================
// Constants
// ============================================================================

const PI = Math.PI;
const A90 = PI / 2; // 90 degrees in radians

// ============================================================================
// Basic Math Helpers (ported from turn.js lines 141-153)
// ============================================================================

/**
 * Creates a 2D point object
 */
function point2D(x: number, y: number): Point2D {
  return { x, y };
}

/**
 * Converts degrees to radians
 */
function rad(degrees: number): number {
  return (degrees / 180) * PI;
}

/**
 * Converts radians to degrees
 */
function deg(radians: number): number {
  return (radians / PI) * 180;
}

// ============================================================================
// Bezier Curve (ported from turn.js lines 119-138)
// ============================================================================

/**
 * Calculates a point on a cubic Bezier curve
 * Used for smooth page turn animation paths
 *
 * @param p1 - Start point
 * @param p2 - Control point 1
 * @param p3 - Control point 2
 * @param p4 - End point
 * @param t - Parameter (0 to 1)
 */
function bezier(
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  p4: Point2D,
  t: number
): Point2D {
  const mum1 = 1 - t;
  const mum13 = mum1 * mum1 * mum1;
  const mu3 = t * t * t;

  return point2D(
    Math.round(
      mum13 * p1.x +
        3 * t * mum1 * mum1 * p2.x +
        3 * t * t * mum1 * p3.x +
        mu3 * p4.x
    ),
    Math.round(
      mum13 * p1.y +
        3 * t * mum1 * mum1 * p2.y +
        3 * t * t * mum1 * p3.y +
        mu3 * p4.y
    )
  );
}

// ============================================================================
// Corner Helpers
// ============================================================================

/**
 * Gets the corner position (bottom-right corner)
 */
function getCornerPosition(width: number, height: number): Point2D {
  return point2D(width, height);
}

/**
 * Gets the flip end position (opposite corner - bottom-left)
 */
function getFlipEndPosition(_width: number, height: number): Point2D {
  return point2D(0, height);
}

// ============================================================================
// Fold Geometry Calculation (simplified from turn.js _fold, lines 1445-1676)
// ============================================================================

/**
 * Calculates fold geometry for bottom-right corner only
 *
 * This is the core algorithm that determines how the page should fold
 * based on the pointer position. Simplified from turn.js to handle only
 * the BR (bottom-right) corner case.
 *
 * @param point - Current pointer position
 * @param width - Page width
 * @param height - Page height
 * @param wrapperHeight - Height of the wrapper (diagonal for rotation)
 */
function calculateFold(
  point: Point2D,
  width: number,
  height: number,
  wrapperHeight?: number
): FoldGeometry {
  const h = wrapperHeight ?? Math.sqrt(width * width + height * height);

  // Corner origin (bottom-right)
  const o = point2D(width, height);

  // For BR corner: left = false, top = false
  const left = false;
  const top = false;

  // Clamp point.x to valid range (line 1666)
  const clampedX = Math.min(point.x, width - 1);
  const clampedPoint = point2D(clampedX, point.y);

  // Calculate relative position from corner
  const rel = point2D(
    o.x ? o.x - clampedPoint.x : clampedPoint.x,
    o.y ? o.y - clampedPoint.y : clampedPoint.y
  );

  // Calculate angle
  const tan = Math.atan2(rel.y, rel.x);
  const alpha = A90 - tan;
  const angle = deg(alpha);

  // Calculate middle point (turn.js line 1479-1482)
  // IMPORTANT: Uses original point.x, NOT clamped point
  const middle = point2D(
    left ? width - rel.x / 2 : point.x + rel.x / 2,
    rel.y / 2
  );

  // Calculate gamma and distance
  const gamma = alpha - Math.atan2(middle.y, middle.x);
  const distance = Math.max(
    0,
    Math.sin(gamma) * Math.sqrt(middle.x * middle.x + middle.y * middle.y)
  );

  // Calculate translation
  let tr = point2D(distance * Math.sin(alpha), distance * Math.cos(alpha));

  // Movement vector for edge cases
  let mv = point2D(0, 0);

  // Handle angle > 90 degrees edge case
  if (alpha > A90) {
    tr.x += Math.abs(tr.y * Math.tan(tan));
    tr.y = 0;

    // Recursive correction if needed
    if (Math.round(tr.x * Math.tan(PI - alpha)) < height) {
      const newY = Math.sqrt(height * height + 2 * middle.x * rel.x);
      const correctedPoint = point2D(clampedX, top ? height - newY : newY);
      return calculateFold(correctedPoint, width, height, wrapperHeight);
    }

    // Calculate movement vector
    const beta = PI - alpha;
    const dd = h - height / Math.sin(beta);
    mv = point2D(
      Math.round(dd * Math.cos(beta)) * (left ? -1 : 1),
      Math.round(dd * Math.sin(beta)) * (top ? -1 : 1)
    );
  }

  // Calculate pixel position of fold line
  const px = Math.round(tr.y / Math.tan(alpha) + tr.x);

  // Calculate side and destination fold point
  const side = width - px;
  const sideX = side * Math.cos(alpha * 2);
  const sideY = side * Math.sin(alpha * 2);
  const df = point2D(
    Math.round(left ? side - sideX : px + sideX),
    Math.round(top ? sideY : height - sideY)
  );

  // Gradient calculations
  const gradientSize = side * Math.sin(alpha);
  const endPoint = getFlipEndPosition(width, height);
  // Use unclamped point for distance calculation (turn.js lines 1531-1535)
  const far = Math.sqrt(
    (endPoint.x - point.x) ** 2 + (endPoint.y - point.y) ** 2
  );
  const gradientOpacity = far < width ? far / width : 1;
  const gradientStartV =
    gradientSize > 100 ? (gradientSize - 100) / gradientSize : 0;

  // Round translation values
  tr = point2D(Math.round(tr.x), Math.round(tr.y));

  return {
    angle,
    alpha,
    translate: tr,
    movement: mv,
    px,
    df,
    gradientOpacity,
    gradientSize,
    gradientStartV,
  };
}

// ============================================================================
// Distance Helpers
// ============================================================================

/**
 * Calculate distance between two points
 */
function distance(p1: Point2D, p2: Point2D): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

/**
 * Calculate wrapper height (diagonal of page for rotation clipping)
 */
function calculateWrapperHeight(width: number, height: number): number {
  return Math.sqrt(width * width + height * height);
}

/**
 * Linear interpolation between two points
 */
function lerp(p1: Point2D, p2: Point2D, t: number): Point2D {
  return point2D(p1.x + (p2.x - p1.x) * t, p1.y + (p2.y - p1.y) * t);
}

// ============================================================================
// 3D Support Detection
// ============================================================================

/**
 * Detect if browser supports 3D transforms
 */
function has3dSupport(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  return (
    "WebKitCSSMatrix" in window ||
    "MozPerspective" in document.body.style ||
    "perspective" in document.body.style
  );
}

const has3d = has3dSupport();

// ============================================================================
// Transform String Generators (ported from turn.js lines 156-165)
// ============================================================================

/**
 * Generate CSS translate transform string
 * Uses translate3d for hardware acceleration when available
 */
function translate(x: number, y: number, use3d = true): string {
  return has3d && use3d
    ? ` translate3d(${x}px, ${y}px, 0px) `
    : ` translate(${x}px, ${y}px) `;
}

/**
 * Generate CSS rotate transform string
 */
function rotate(degrees: number): string {
  return ` rotate(${degrees}deg) `;
}

// ============================================================================
// Gradient Generation (simplified from turn.js gradient function)
// ============================================================================

interface GradientStop {
  position: number; // 0 to 1
  color: string;
}

/**
 * Generate CSS linear gradient for shadow effects
 */
function createGradient(
  p0: Point2D,
  p1: Point2D,
  stops: GradientStop[]
): string {
  // Calculate angle from points
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const angle = Math.atan2(dy, dx);
  const angleDeg = (angle * 180) / Math.PI;

  // Build color stops string
  const colorStops = stops
    .map((stop) => `${stop.color} ${stop.position * 100}%`)
    .join(", ");

  return `linear-gradient(${angleDeg}deg, ${colorStops})`;
}

/**
 * Generate front gradient (shadow on the fold)
 * Based on turn.js lines 1603-1618
 */
function createFrontGradient(
  geometry: FoldGeometry,
  width: number,
  height: number
): CSSProperties {
  const { gradientOpacity, gradientSize, gradientStartV, alpha } = geometry;
  const A90 = Math.PI / 2;

  // For BR corner: left = false, top = false
  // Start point: (0, 100) - bottom-left
  const p0: Point2D = { x: 0, y: 100 };

  // End point calculation
  const p1: Point2D = {
    x: ((gradientSize * Math.sin(A90 - alpha)) / height) * 100,
    y: 100 - ((gradientSize * Math.cos(A90 - alpha)) / width) * 100,
  };

  const stops: GradientStop[] = [
    { position: gradientStartV, color: "rgba(0,0,0,0)" },
    {
      position: (1 - gradientStartV) * 0.8 + gradientStartV,
      color: `rgba(0,0,0,${0.2 * gradientOpacity})`,
    },
    { position: 1, color: `rgba(255,255,255,${0.2 * gradientOpacity})` },
  ];

  return {
    position: "absolute",
    inset: 0,
    background: createGradient(p0, p1, stops),
    pointerEvents: "none",
  };
}

/**
 * Generate back gradient (shadow on revealed page)
 * Based on turn.js lines 1620-1631
 */
function createBackGradient(
  geometry: FoldGeometry,
  width: number,
  height: number
): CSSProperties {
  const { gradientOpacity, gradientSize, alpha } = geometry;

  // For BR corner: left = false, top = false
  // Start point: (100, 100) - bottom-right
  const p0: Point2D = { x: 100, y: 100 };

  // End point calculation
  const p1: Point2D = {
    x: 100 - ((gradientSize * Math.sin(alpha)) / width) * 100,
    y: 100 - ((gradientSize * Math.cos(alpha)) / height) * 100,
  };

  const stops: GradientStop[] = [
    { position: 0.8, color: "rgba(0,0,0,0)" },
    { position: 1, color: `rgba(0,0,0,${0.3 * gradientOpacity})` },
  ];

  return {
    position: "absolute",
    inset: 0,
    background: createGradient(p0, p1, stops),
    pointerEvents: "none",
  };
}

// ============================================================================
// Page Transform Generation
// ============================================================================

/**
 * Generate all CSS transforms for the flip animation
 * Based on turn.js _fold function, BR corner case (lines 1665-1672)
 *
 * DOM Structure (from turn.js):
 * container (relative positioning)
 * ├── nextPage (z-index: 1, static, revealed underneath)
 * ├── wrapper (overflow: hidden, contains current page, counter-rotates)
 * │   └── currentPage (transforms: rotate + translate)
 * │       └── frontGradient
 * └── fwrapper (fold wrapper, counter-rotates)
 *     └── fpage container (positioned, rotated)
 *         └── fpage (double-rotated)
 *             └── folding content (90° rotated + translated)
 *             └── backGradient
 *
 * Key transforms from turn.js BR corner (lines 1665-1672):
 * - Wrapper: translate(-tr.x + mvW - aliasingFk, -tr.y + mvH) + rotate(-a)
 * - CurrentPage: rotate(a) + translate(tr.x + aliasingFk, tr.y)
 * - FWrapper: translate(-tr.x + mv.x + mvW, -tr.y + mv.y + mvH) + rotate(-a)
 * - FPage.parent(): rotate(a) + translate(tr.x + df.x - mv.x, tr.y + df.y - mv.y)
 * - FPage: rotate(90 - a * 2)
 * - Folding: rotate(90) + translate(0, -height)
 */
function generatePageTransforms(
  geometry: FoldGeometry,
  width: number,
  height: number,
  wrapperHeight: number,
  showGradients: boolean
): PageTransforms {
  const { angle, translate: tr, movement: mv, df } = geometry;
  const a = angle;

  // mvW, mvH - adjustment for wrapper size difference (turn.js line 1568-1569)
  // For BR corner: origin is [0, 100] meaning x=0%, y=100%
  const mvW = ((width - wrapperHeight) * 0) / 100; // x origin = 0%
  const mvH = ((height - wrapperHeight) * 100) / 100; // y origin = 100%

  // Anti-aliasing fix (turn.js line 1576)
  // For BR corner (left = false): aliasingFk = 1 (or 0 if angle is exactly 90/-90)
  const aliasingFk = a !== 90 && a !== -90 ? 1 : 0;

  // Container style - positioning context
  const container: CSSProperties = {
    position: "relative",
    width,
    height,
    overflow: "hidden",
  };

  // Wrapper - clips and counter-rotates (turn.js line 1585-1588)
  // This wrapper contains the current page and provides the clipping effect
  const wrapper: CSSProperties = {
    position: "absolute",
    left: 0,
    bottom: 0,
    width,
    height,
    overflow: "hidden",
    transform: `${translate(-tr.x + mvW - aliasingFk, -tr.y + mvH)}${rotate(-a)}`,
    transformOrigin: "0% 100%",
    zIndex: 2,
  };

  // Current page - sits INSIDE wrapper (turn.js line 1580-1582, 1668)
  // Position array [0, 1, 1, 0] = { left: auto, top: 0, right: 0, bottom: auto }
  // Transform: rotate(a) + translate(tr.x + aliasingFk, tr.y)
  const currentPage: CSSProperties = {
    position: "absolute",
    top: 0,
    right: 0,
    left: "auto",
    bottom: "auto",
    width,
    height,
    transform: `${rotate(a)}${translate(tr.x + aliasingFk, tr.y)}`,
    transformOrigin: "0% 100%",
  };

  // Fold wrapper - counter-rotates (turn.js line 1590-1594)
  const foldWrapper: CSSProperties = {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: wrapperHeight,
    height: wrapperHeight,
    overflow: "hidden",
    transform: `${translate(-tr.x + mv.x + mvW, -tr.y + mv.y + mvH)}${rotate(-a)}`,
    transformOrigin: "0% 100%",
    zIndex: 3,
  };

  // Fold page container - fpage.parent() (turn.js line 1595-1601)
  // For BR corner pattern [0, 1, 1, 0]: left: 0, top: auto, right: auto, bottom: 0
  const foldPageContainer: CSSProperties = {
    position: "absolute",
    top: "auto",
    right: "auto",
    left: 0,
    bottom: 0,
    width,
    height,
    overflow: "visible",
    transform: `${rotate(a)}${translate(tr.x + df.x - mv.x, tr.y + df.y - mv.y)}`,
    transformOrigin: "0% 100%",
  };

  // Fold page - fpage (turn.js line 1669)
  const foldPage: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: height, // Note: swapped dimensions for rotation
    height: width,
    transform: rotate(90 - a * 2),
    transformOrigin: "0% 0%",
  };

  // Folding content - the next page rotated 90° (turn.js line 1670)
  const folding: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    transform: `${rotate(90)}${translate(0, -height)}`,
    transformOrigin: "0% 0%",
  };

  // Gradients
  const frontGradient: CSSProperties = showGradients
    ? createFrontGradient(geometry, width, height)
    : { display: "none" };

  const backGradient: CSSProperties = showGradients
    ? createBackGradient(geometry, width, height)
    : { display: "none" };

  return {
    container,
    wrapper,
    currentPage,
    foldWrapper,
    foldPageContainer,
    foldPage,
    folding,
    frontGradient,
    backGradient,
  };
}

// ============================================================================
// Folding Page Transform
// ============================================================================

/**
 * Generate transform for the folding page element
 * Based on turn.js line 1670: folding.transform(rotate(90) + translate(0, -height, ac), "0% 0%")
 */
function generateFoldingTransform(height: number): CSSProperties {
  return {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transform: `${rotate(90)}${translate(0, -height)}`,
    transformOrigin: "0% 0%",
  };
}

// Quick flip threshold in milliseconds (from turn.js line 1059)
const QUICK_FLIP_THRESHOLD = 200;

/**
 * Hook for detecting pointer interaction with the bottom-right corner
 * Ported from turn.js _cornerActivated, _eventStart, _eventMove, _eventEnd
 */
function useCornerDetection({
  containerRef,
  cornerSize,
  width,
  height,
  enabled,
  onCornerActivated,
  onPointerMove,
  onPointerRelease,
  onPointerLeave,
}: UseCornerDetectionOptions): UseCornerDetectionReturn {
  const [isInCorner, setIsInCorner] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [pointerPosition, setPointerPosition] = useState<Point2D | null>(null);

  // Track press start time for quick flip detection
  const pressTimeRef = useRef<number>(0);

  /**
   * Get pointer position relative to container
   */
  const getPointerPosition = useCallback(
    (e: React.PointerEvent): Point2D | null => {
      if (!containerRef.current) {
        return null;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, e.clientX - rect.left);
      const y = Math.max(0, e.clientY - rect.top);

      return point2D(x, y);
    },
    [containerRef]
  );

  /**
   * Check if position is in the bottom-right corner zone
   * Ported from turn.js _cornerActivated (lines 1238-1267)
   * Simplified for BR corner only
   */
  const isInCornerZone = useCallback(
    (pos: Point2D): boolean => {
      // Check bounds
      if (pos.x <= 0 || pos.y <= 0 || pos.x >= width || pos.y >= height) {
        return false;
      }

      // Check if in bottom zone (y >= height - cornerSize)
      const inBottomZone = pos.y >= height - cornerSize;

      // Check if in right zone (x >= width - cornerSize)
      const inRightZone = pos.x >= width - cornerSize;

      // BR corner: must be in both bottom AND right zones
      return inBottomZone && inRightZone;
    },
    [width, height, cornerSize]
  );

  /**
   * Handle pointer down event
   * Ported from turn.js _eventStart (lines 1853-1864)
   */
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) {
        return;
      }

      const pos = getPointerPosition(e);
      if (!pos) {
        return;
      }

      if (isInCornerZone(pos)) {
        // Capture pointer for tracking outside container
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

        setIsPressed(true);
        setIsInCorner(true);
        setPointerPosition(pos);
        pressTimeRef.current = Date.now();

        onCornerActivated?.(pos);

        // Prevent default to avoid text selection during drag
        e.preventDefault();
      }
    },
    [enabled, getPointerPosition, isInCornerZone, onCornerActivated]
  );

  /**
   * Handle pointer move event
   * Ported from turn.js _eventMove (lines 1866-1894)
   */
  const onPointerMoveHandler = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) {
        return;
      }

      const pos = getPointerPosition(e);
      if (!pos) {
        return;
      }

      if (isPressed) {
        // Dragging - update position
        setPointerPosition(pos);
        onPointerMove?.(pos);
      } else {
        // Hover detection - show fold preview when hovering corner
        const inCorner = isInCornerZone(pos);

        if (inCorner !== isInCorner) {
          setIsInCorner(inCorner);

          if (inCorner) {
            // Show corner fold preview at corner origin
            const origin = point2D(
              width - cornerSize / 2,
              height - cornerSize / 2
            );
            setPointerPosition(origin);
            onCornerActivated?.(origin);
          } else {
            setPointerPosition(null);
            onPointerLeave?.();
          }
        }
      }
    },
    [
      enabled,
      getPointerPosition,
      isInCornerZone,
      isPressed,
      isInCorner,
      width,
      height,
      cornerSize,
      onPointerMove,
      onCornerActivated,
      onPointerLeave,
    ]
  );

  /**
   * Handle pointer up event
   * Ported from turn.js _eventEnd (lines 1897-1908) and _released (lines 1052-1068)
   */
  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!(enabled && isPressed)) {
        return;
      }

      // Release pointer capture
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

      const pos = getPointerPosition(e);
      const releaseTime = Date.now();
      const pressDuration = releaseTime - pressTimeRef.current;

      // Quick flip detection (from turn.js lines 1059-1061)
      // If press duration < 200ms OR pointer moved past either edge (left or right)
      const wasQuickFlip =
        pressDuration < QUICK_FLIP_THRESHOLD ||
        Boolean(pos && (pos.x < 0 || pos.x > width));

      setIsPressed(false);
      setIsInCorner(false);
      setPointerPosition(null);

      if (pos) {
        onPointerRelease?.(pos, wasQuickFlip);
      }
    },
    [enabled, isPressed, getPointerPosition, onPointerRelease, width]
  );

  /**
   * Handle pointer leave event
   */
  const onPointerLeaveHandler = useCallback(
    (_e: React.PointerEvent) => {
      if (!enabled) {
        return;
      }

      // Only handle hover leave, not drag leave
      if (!isPressed) {
        setIsInCorner(false);
        setPointerPosition(null);
        onPointerLeave?.();
      }
    },
    [enabled, isPressed, onPointerLeave]
  );

  return {
    isInCorner,
    pointerPosition,
    isPressed,
    handlers: {
      onPointerDown,
      onPointerMove: onPointerMoveHandler,
      onPointerUp,
      onPointerLeave: onPointerLeaveHandler,
    },
  };
}

// ============================================================================
// Easing Functions
// ============================================================================

/**
 * Circular ease-out easing function (from turn.js animatef)
 * Original: c * Math.sqrt(1 - (t = t / d - 1) * t) + b
 *
 * @param t - Current time (0 to duration)
 * @param b - Beginning value
 * @param c - Change in value (to - from)
 * @param d - Duration
 */
function circularEaseOut(t: number, b: number, c: number, d: number): number {
  const normalizedT = t / d - 1;
  return c * Math.sqrt(1 - normalizedT * normalizedT) + b;
}

/**
 * Normalized easing (0 to 1 input, 0 to 1 output)
 */
function easeOut(progress: number): number {
  return circularEaseOut(progress, 0, 1, 1);
}

// ============================================================================
// Animation Hook
// ============================================================================

/**
 * Hook for requestAnimationFrame-based flip animation
 * Replaces turn.js animatef which uses setInterval
 */
function useFlipAnimation(): UseFlipAnimationReturn {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);
  const configRef = useRef<AnimationConfig | null>(null);
  const startTimeRef = useRef<number>(0);

  /**
   * Stop any running animation
   */
  const stop = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    configRef.current = null;
    setIsAnimating(false);
  }, []);

  /**
   * Start an animation
   */
  const animate = useCallback(
    (config: AnimationConfig) => {
      // Stop any existing animation
      stop();

      configRef.current = config;
      startTimeRef.current = 0;
      setIsAnimating(true);

      const { from, to, duration, onFrame, onComplete, useBezier } = config;

      /**
       * Animation frame callback
       */
      const tick = (timestamp: number) => {
        // Initialize start time on first frame
        if (startTimeRef.current === 0) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const rawProgress = Math.min(1, elapsed / duration);

        // Apply easing
        const easedProgress = easeOut(rawProgress);

        // Calculate current point
        let currentPoint: Point2D;

        if (useBezier) {
          // Use bezier curve for page turn path (turn.js line 1829)
          // turn.js uses bezier(p1, p1, p4, p4, t) - a degenerate bezier
          // which effectively produces a straight line from p1 to p4
          // but with the bezier math applied for consistent behavior
          const p1 = from;
          const p4 = to;

          currentPoint = bezier(p1, p1, p4, p4, easedProgress);
        } else {
          // Linear interpolation with easing
          currentPoint = lerp(from, to, easedProgress);
        }

        // Call frame callback with current point
        onFrame(currentPoint);

        // Check if animation is complete
        if (rawProgress < 1) {
          // Continue animation
          animationRef.current = requestAnimationFrame(tick);
        } else {
          // Animation complete
          animationRef.current = null;
          configRef.current = null;
          setIsAnimating(false);
          onComplete();
        }
      };

      // Start animation loop
      animationRef.current = requestAnimationFrame(tick);
    },
    [stop]
  );

  return {
    animate,
    stop,
    isAnimating,
  };
}

// ============================================================================
// Utility: Animate with Promise
// ============================================================================

/**
 * Promise-based animation utility
 * Useful for sequential animations
 */
function animateAsync(
  animateFn: (config: AnimationConfig) => void,
  config: Omit<AnimationConfig, "onComplete">
): Promise<void> {
  return new Promise((resolve) => {
    animateFn({
      ...config,
      onComplete: resolve,
    });
  });
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_DURATION = 600;
const DEFAULT_CORNER_SIZE = 100;

// ============================================================================
// Main Flipbook Hook
// ============================================================================

/**
 * Main orchestrator hook for the flipbook functionality
 * Combines corner detection, fold geometry, and animation
 */
function useFlipbook({
  totalPages,
  width,
  height,
  initialPage = 0,
  duration = DEFAULT_DURATION,
  cornerSize = DEFAULT_CORNER_SIZE,
  gradients = true,
  onPageChange,
}: UseFlipbookOptions): UseFlipbookReturn {
  // ============================================================================
  // Refs and State
  // ============================================================================

  const containerRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [flipState, setFlipState] = useState<FlipState>({
    isFlipping: false,
    isDragging: false,
    progress: 0,
    currentPage: initialPage,
    foldPoint: null,
  });

  // Calculated wrapper height (diagonal for rotation clipping)
  const wrapperHeight = useMemo(
    () => calculateWrapperHeight(width, height),
    [width, height]
  );

  // Animation hook
  const { animate, stop: _stopAnimation, isAnimating } = useFlipAnimation();

  // ============================================================================
  // Fold Geometry Calculation
  // ============================================================================

  const foldGeometry = useMemo<FoldGeometry | null>(() => {
    if (!flipState.foldPoint) {
      return null;
    }
    return calculateFold(flipState.foldPoint, width, height, wrapperHeight);
  }, [flipState.foldPoint, width, height, wrapperHeight]);

  // ============================================================================
  // Page Transforms
  // ============================================================================

  const pageTransforms = useMemo<PageTransforms | null>(() => {
    if (!foldGeometry) {
      return null;
    }
    return generatePageTransforms(
      foldGeometry,
      width,
      height,
      wrapperHeight,
      gradients
    );
  }, [foldGeometry, width, height, wrapperHeight, gradients]);

  // ============================================================================
  // Page Navigation
  // ============================================================================

  /**
   * Complete the page turn (go to next page)
   */
  const completePageTurn = useCallback(() => {
    const nextPage = currentPage + 1;
    if (nextPage >= totalPages) {
      return;
    }

    setCurrentPage(nextPage);
    setFlipState((prev) => ({
      ...prev,
      isFlipping: false,
      isDragging: false,
      progress: 0,
      currentPage: nextPage,
      foldPoint: null,
    }));

    onPageChange?.(nextPage);
  }, [currentPage, totalPages, onPageChange]);

  /**
   * Cancel the page turn (stay on current page)
   */
  const cancelPageTurn = useCallback(() => {
    setFlipState((prev) => ({
      ...prev,
      isFlipping: false,
      isDragging: false,
      progress: 0,
      foldPoint: null,
    }));
  }, []);

  /**
   * Navigate to next page with animation
   */
  const nextPage = useCallback(() => {
    if (currentPage >= totalPages - 1) {
      return;
    }
    if (isAnimating) {
      return;
    }

    // Start from corner
    const cornerPos = getCornerPosition(width, height);
    const endPos = getFlipEndPosition(width, height);

    setFlipState((prev) => ({
      ...prev,
      isFlipping: true,
      isDragging: false,
      foldPoint: cornerPos,
    }));

    // Animate the page turn
    animate({
      from: cornerPos,
      to: endPos,
      duration,
      useBezier: true,
      onFrame: (point) => {
        setFlipState((prev) => ({
          ...prev,
          foldPoint: point,
        }));
      },
      onComplete: completePageTurn,
    });
  }, [
    currentPage,
    totalPages,
    width,
    height,
    duration,
    isAnimating,
    animate,
    completePageTurn,
  ]);

  /**
   * Navigate to previous page
   */
  const previousPage = useCallback(() => {
    if (currentPage <= 0) {
      return;
    }

    const prevPage = currentPage - 1;
    setCurrentPage(prevPage);
    setFlipState((prev) => ({
      ...prev,
      currentPage: prevPage,
    }));
    onPageChange?.(prevPage);
  }, [currentPage, onPageChange]);

  /**
   * Navigate to specific page
   */
  const goToPage = useCallback(
    (page: number) => {
      if (page < 0 || page >= totalPages) {
        return;
      }
      if (page === currentPage) {
        return;
      }

      setCurrentPage(page);
      setFlipState((prev) => ({
        ...prev,
        currentPage: page,
      }));
      onPageChange?.(page);
    },
    [totalPages, currentPage, onPageChange]
  );

  // ============================================================================
  // Corner Detection Callbacks
  // ============================================================================

  /**
   * Handle corner activation (pointer enters corner zone or presses)
   */
  const handleCornerActivated = useCallback(
    (point: Point2D) => {
      if (currentPage >= totalPages - 1) {
        return;
      }
      if (isAnimating) {
        return;
      }

      setFlipState((prev) => ({
        ...prev,
        isFlipping: true,
        isDragging: true,
        foldPoint: point,
      }));
    },
    [currentPage, totalPages, isAnimating]
  );

  /**
   * Handle pointer move during drag
   */
  const handlePointerMove = useCallback(
    (point: Point2D) => {
      if (!flipState.isDragging) {
        return;
      }

      setFlipState((prev) => ({
        ...prev,
        foldPoint: point,
      }));
    },
    [flipState.isDragging]
  );

  /**
   * Handle pointer release
   */
  const handlePointerRelease = useCallback(
    (point: Point2D, wasQuickFlip: boolean) => {
      if (!flipState.isFlipping) {
        return;
      }

      // Determine if we should complete or cancel the flip (turn.js lines 1052-1068)
      // Quick flip: always complete (handled by wasQuickFlip - includes time < 200ms and boundary checks)
      // Otherwise: complete only if dragged past left boundary (100% threshold)
      const shouldComplete = wasQuickFlip || point.x < 0;

      if (shouldComplete && currentPage < totalPages - 1) {
        // Animate to completion
        const endPos = getFlipEndPosition(width, height);

        animate({
          from: point,
          to: endPos,
          duration: duration / 2, // Faster completion
          useBezier: false,
          onFrame: (p) => {
            setFlipState((prev) => ({
              ...prev,
              isDragging: false,
              foldPoint: p,
            }));
          },
          onComplete: completePageTurn,
        });
      } else {
        // Animate back to corner (cancel)
        const cornerPos = getCornerPosition(width, height);

        animate({
          from: point,
          to: cornerPos,
          duration: duration / 2, // Faster cancel
          useBezier: false,
          onFrame: (p) => {
            setFlipState((prev) => ({
              ...prev,
              isDragging: false,
              foldPoint: p,
            }));
          },
          onComplete: cancelPageTurn,
        });
      }
    },
    [
      flipState.isFlipping,
      currentPage,
      totalPages,
      width,
      height,
      duration,
      animate,
      completePageTurn,
      cancelPageTurn,
    ]
  );

  /**
   * Handle pointer leave (hover preview cancel)
   */
  const handlePointerLeave = useCallback(() => {
    if (flipState.isDragging) {
      return; // Don't cancel during drag
    }

    if (flipState.isFlipping && !isAnimating) {
      // Cancel hover preview
      cancelPageTurn();
    }
  }, [flipState.isDragging, flipState.isFlipping, isAnimating, cancelPageTurn]);

  // ============================================================================
  // Corner Detection Hook
  // ============================================================================

  const { handlers } = useCornerDetection({
    containerRef,
    cornerSize,
    width,
    height,
    enabled: currentPage < totalPages - 1,
    onCornerActivated: handleCornerActivated,
    onPointerMove: handlePointerMove,
    onPointerRelease: handlePointerRelease,
    onPointerLeave: handlePointerLeave,
  });

  // ============================================================================
  // Attach handlers to container ref
  // ============================================================================

  // Store handlers for the component to use
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  // ============================================================================
  // Return
  // ============================================================================

  return {
    containerRef,
    currentPage,
    flipState,
    foldGeometry,
    pageTransforms,
    nextPage,
    previousPage,
    goToPage,
    // Expose handlers for component to attach
    _handlers: handlers,
  } as UseFlipbookReturn & { _handlers: typeof handlers };
}

// ============================================================================
// Flipbook Component
// ============================================================================

/**
 * React Flipbook component with page-flip animation
 * Ported from turn.js jQuery library
 *
 * Features:
 * - Single page display mode
 * - Bottom-right corner flip
 * - Gradient shadows for depth
 * - Touch and mouse support
 * - Smooth requestAnimationFrame animations
 *
 * DOM Structure (matching turn.js):
 * container
 * ├── nextPage (z-index: 1, revealed underneath)
 * ├── wrapper (clips current page, counter-rotates)
 * │   └── currentPage (rotates + translates)
 * │       └── frontGradient
 * └── foldWrapper (fwrapper, counter-rotates)
 *     └── foldPageContainer (fpage.parent())
 *         └── foldPage (fpage, double-rotated)
 *             └── folding (90° rotated next page content)
 *                 └── next page content
 *             └── backGradient
 */
function Flipbook({
  width,
  height,
  duration = 600,
  cornerSize = 100,
  gradients = true,
  children,
  onPageChange,
  className,
}: FlipbookProps) {
  type FlipbookHandlers = Pick<
    HTMLAttributes<HTMLDivElement>,
    "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerLeave"
  >;

  // Convert children to array
  const pages = useMemo(() => Children.toArray(children), [children]);

  // Main flipbook hook
  const {
    containerRef,
    currentPage,
    flipState,
    foldGeometry,
    pageTransforms,
    nextPage: _nextPage,
    previousPage: _previousPage,
    goToPage: _goToPage,
    _handlers,
  } = useFlipbook({
    totalPages: pages.length,
    width,
    height,
    duration,
    cornerSize,
    gradients,
    onPageChange,
  }) as ReturnType<typeof useFlipbook> & { _handlers: FlipbookHandlers };

  // Calculate wrapper height for fold element
  const _wrapperHeight = useMemo(
    () => calculateWrapperHeight(width, height),
    [width, height]
  );

  // Check if we can show the flip animation
  const showFlipAnimation =
    flipState.isFlipping && foldGeometry && pageTransforms;
  const hasNextPage = currentPage < pages.length - 1;

  return (
    <div
      className={className}
      ref={containerRef}
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        perspective: "2000px",
        touchAction: "none", // Prevent browser gestures
        userSelect: "none",
      }}
      {..._handlers}
    >
      {/* Layer 1: Next page (revealed underneath during flip) */}
      {hasNextPage && (
        <div
          className="flipbook-page flipbook-page-next"
          style={{
            position: "absolute",
            inset: 0,
            width,
            height,
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          {pages[currentPage + 1]}
        </div>
      )}

      {/* Layer 2: Wrapper (clips current page during fold, counter-rotates) */}
      <div
        className="flipbook-wrapper"
        style={
          showFlipAnimation
            ? pageTransforms.wrapper
            : {
                position: "absolute",
                inset: 0,
                width,
                height,
                zIndex: 2,
                overflow: "hidden",
              }
        }
      >
        {/* Current page (inside wrapper, transforms applied during flip) */}
        <div
          className="flipbook-page flipbook-page-current"
          style={
            showFlipAnimation
              ? {
                  ...pageTransforms.currentPage,
                  overflow: "hidden",
                }
              : {
                  position: "absolute",
                  inset: 0,
                  width,
                  height,
                  overflow: "hidden",
                }
          }
        >
          {pages[currentPage]}

          {/* Front gradient (shadow on the fold) */}
          {showFlipAnimation && gradients && (
            <div
              className="flipbook-gradient-front"
              style={pageTransforms.frontGradient}
            />
          )}
        </div>
      </div>

      {/* Layer 3: Fold wrapper (fwrapper - during animation only) */}
      {showFlipAnimation && hasNextPage && (
        <div
          className="flipbook-fold-wrapper"
          style={pageTransforms.foldWrapper}
        >
          {/* Fold page container (fpage.parent()) */}
          <div
            className="flipbook-fold-page-container"
            style={pageTransforms.foldPageContainer}
          >
            {/* Fold page (fpage - double rotation) */}
            <div className="flipbook-fold-page" style={pageTransforms.foldPage}>
              {/* Folding content (90° rotated next page) */}
              <div className="flipbook-folding" style={pageTransforms.folding}>
                {pages[currentPage + 1]}
              </div>

              {/* Back gradient (shadow on revealed page) */}
              {gradients && (
                <div
                  className="flipbook-gradient-back"
                  style={pageTransforms.backGradient}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Corner hint indicator */}
      {hasNextPage && !flipState.isFlipping && (
        <div
          className="flipbook-corner-hint"
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: cornerSize,
            height: cornerSize,
            cursor: "pointer",
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}

function StickyNotes2Block() {
  return (
    <Flipbook
      cornerSize={100}
      duration={600}
      gradients={true}
      height={300}
      onPageChange={(page) => console.log("Page changed to:", page)}
      width={400}
    >
      {/* Page 1 */}
      <div className="flex h-full w-full items-center justify-center bg-yellow-200 p-4">
        <div className="text-center">
          <h2 className="mb-2 font-bold text-xl text-yellow-800">Page 1</h2>
          <p className="text-yellow-700">
            Drag the bottom-right corner to flip
          </p>
        </div>
      </div>

      {/* Page 2 */}
      <div className="flex h-full w-full items-center justify-center bg-blue-200 p-4">
        <div className="text-center">
          <h2 className="mb-2 font-bold text-blue-800 text-xl">Page 2</h2>
          <p className="text-blue-700">Keep flipping to see more pages</p>
        </div>
      </div>

      {/* Page 3 */}
      <div className="flex h-full w-full items-center justify-center bg-purple-200 p-4">
        <div className="text-center">
          <h2 className="mb-2 font-bold text-purple-800 text-xl">Page 3</h2>
          <p className="text-purple-700">Almost there!</p>
        </div>
      </div>

      {/* Page 4 */}
      <div className="flex h-full w-full items-center justify-center bg-pink-200 p-4">
        <div className="text-center">
          <h2 className="mb-2 font-bold text-pink-800 text-xl">Page 4</h2>
          <p className="text-pink-700">Last page - all done!</p>
        </div>
      </div>
    </Flipbook>
  );
}

function App() {
  return (
    <StickyNotes2Block />
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
