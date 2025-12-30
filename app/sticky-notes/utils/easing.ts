/**
 * Easing functions for smooth animations
 */

/**
 * Ease-out cubic - fast start, slow end
 * Good for elements moving to their final position
 */
export const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

/**
 * Ease-in-out quadratic - smooth acceleration and deceleration
 * Good for looping animations or transitions
 */
export const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;

/**
 * Paper-like easing - slight resistance initially, then releases
 * Mimics the feel of peeling sticky paper
 */
export const paperEase = (t: number): number => t ** 0.7;

/**
 * Linear - no easing (useful for direct mapping)
 */
export const linear = (t: number): number => t;

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);
