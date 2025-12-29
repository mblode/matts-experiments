export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass?: number;
}

export interface Spring {
  setTarget(value: number): void;
  getValue(): number;
  getVelocity(): number;
  tick(dt: number): boolean; // returns true if still animating
  isAtRest(): boolean;
}

const EPSILON = 0.001;

export function createSpring(config: SpringConfig): Spring {
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
export function animateSpring(
  spring: Spring,
  onUpdate: (value: number) => void,
  onComplete?: () => void,
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
