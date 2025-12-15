import type { CSSProperties, ReactNode, RefObject } from "react";

// ============================================================================
// Core Geometry Types
// ============================================================================

export interface Point2D {
  x: number;
  y: number;
}

// Bottom-right corner only for this implementation
export type Corner = "br";

// ============================================================================
// Fold Geometry (calculated from pointer position)
// ============================================================================

export interface FoldGeometry {
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

export interface FlipState {
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

export interface PageTransforms {
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

export interface UseFlipbookOptions {
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

export interface UseFlipbookReturn {
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

export interface UseCornerDetectionOptions {
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

export interface UseCornerDetectionReturn {
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

export interface AnimationConfig {
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

export interface UseFlipAnimationReturn {
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

export interface FlipbookProps {
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
