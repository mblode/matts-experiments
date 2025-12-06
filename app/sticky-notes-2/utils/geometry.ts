import type { Point2D, FoldGeometry } from "../types";

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
export function point2D(x: number, y: number): Point2D {
  return { x, y };
}

/**
 * Converts degrees to radians
 */
export function rad(degrees: number): number {
  return (degrees / 180) * PI;
}

/**
 * Converts radians to degrees
 */
export function deg(radians: number): number {
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
export function bezier(
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
export function getCornerPosition(width: number, height: number): Point2D {
  return point2D(width, height);
}

/**
 * Gets the flip end position (opposite corner - bottom-left)
 */
export function getFlipEndPosition(width: number, height: number): Point2D {
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
export function calculateFold(
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
  let alpha = A90 - tan;
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
    tr.x = tr.x + Math.abs(tr.y * Math.tan(tan));
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
    Math.pow(endPoint.x - point.x, 2) +
      Math.pow(endPoint.y - point.y, 2)
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
export function distance(p1: Point2D, p2: Point2D): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Calculate wrapper height (diagonal of page for rotation clipping)
 */
export function calculateWrapperHeight(width: number, height: number): number {
  return Math.sqrt(width * width + height * height);
}

/**
 * Linear interpolation between two points
 */
export function lerp(p1: Point2D, p2: Point2D, t: number): Point2D {
  return point2D(p1.x + (p2.x - p1.x) * t, p1.y + (p2.y - p1.y) * t);
}
