// CodePen packages: @react-three/fiber@^9.5.0, @react-three/postprocessing@^3.0.4, postprocessing@^6.38.2, react-dom@19.2.3, react@19.2.3, three-stdlib@*, three@^0.182.0

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as React from "react";
import { createContext, forwardRef, memo, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { CanvasTexture, DodecahedronGeometry, Euler, IcosahedronGeometry, OctahedronGeometry, Raycaster, RepeatWrapping, TextureLoader, Uniform, Vector2, Vector3, type BufferGeometry, type Camera, type Matrix4, type Object3D, type Texture, type WebGLRenderTarget, type WebGLRenderer } from "three";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import { EffectComposer } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { createRoot } from "react-dom/client";

// Game configuration constants
const INITIAL_CAMERA_POSITION: [number, number, number] = [0, 0, 10];
const POINTS_PER_KILL = 100;

const INITIAL_GAME_STATE = {
  isPlaying: true,
  isGameOver: false,
  score: 0,
  distance: 0,
  kills: 0,
  asteroids: [],
  explosions: [],
  cameraPosition: INITIAL_CAMERA_POSITION,
  cameraVelocity: [0, 0, 0] as [number, number, number],
  speed: 8,
  lastShotTime: 0,
  lastHitTime: 0,
};

interface Asteroid {
  id: number;
  position: [number, number, number];
  radius: number;
  color: string;
  roughness: number;
  velocity: [number, number, number];
  rotation: [number, number, number];
  rotationSpeed: [number, number, number];
  shapeSeed: number; // Random seed for generating unique organic shapes
}

interface Explosion {
  id: number;
  position: [number, number, number];
  startTime: number;
}

interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  distance: number;
  kills: number;
  asteroids: Asteroid[];
  explosions: Explosion[];
  cameraPosition: [number, number, number];
  cameraVelocity: [number, number, number];
  speed: number;
  lastShotTime: number;
  lastHitTime: number;
}

interface GameContextType extends GameState {
  startGame: () => void;
  endGame: () => void;
  updateScore: (points: number) => void;
  updateDistance: (dist: number) => void;
  incrementKills: (speedMultiplier?: number) => void;
  removeAsteroid: (id: number) => void;
  addExplosion: (position: [number, number, number]) => void;
  handleAsteroidDestroyed: (
    asteroidId: number,
    explosionPos: [number, number, number],
    hitTime: number,
    speedMultiplier: number
  ) => void;
  setAsteroids: (asteroids: Asteroid[]) => void;
  setExplosions: (explosions: Explosion[]) => void;
  setCameraPosition: (pos: [number, number, number]) => void;
  setCameraVelocity: (vel: [number, number, number]) => void;
  setLastShotTime: (time: number) => void;
  setLastHitTime: (time: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

const GameProvider = ({ children }: GameProviderProps) => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);

  const startGame = useCallback(() => {
    setGameState(INITIAL_GAME_STATE);
  }, []);

  const endGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: false,
      isGameOver: true,
    }));
  }, []);

  const updateScore = useCallback((points: number) => {
    setGameState((prev) => ({
      ...prev,
      score: Math.max(0, prev.score + points), // Prevent score from going below 0
    }));
  }, []);

  const updateDistance = useCallback((dist: number) => {
    setGameState((prev) => ({
      ...prev,
      distance: dist,
    }));
  }, []);

  const setAsteroids = useCallback((asteroids: Asteroid[]) => {
    setGameState((prev) => ({
      ...prev,
      asteroids,
    }));
  }, []);

  const setCameraPosition = useCallback((pos: [number, number, number]) => {
    setGameState((prev) => ({
      ...prev,
      cameraPosition: pos,
    }));
  }, []);

  const setCameraVelocity = useCallback((vel: [number, number, number]) => {
    setGameState((prev) => ({
      ...prev,
      cameraVelocity: vel,
    }));
  }, []);

  const incrementKills = useCallback((speedMultiplier = 1) => {
    const points = Math.floor(POINTS_PER_KILL * speedMultiplier);
    setGameState((prev) => ({
      ...prev,
      kills: prev.kills + 1,
      score: prev.score + points,
    }));
  }, []);

  const removeAsteroid = useCallback((id: number) => {
    setGameState((prev) => ({
      ...prev,
      asteroids: prev.asteroids.filter((asteroid) => asteroid.id !== id),
    }));
  }, []);

  const addExplosion = useCallback((position: [number, number, number]) => {
    const explosion: Explosion = {
      id: Date.now() + Math.random(),
      position,
      startTime: Date.now(),
    };
    setGameState((prev) => ({
      ...prev,
      explosions: [...prev.explosions, explosion],
    }));
  }, []);

  const setExplosions = useCallback((explosions: Explosion[]) => {
    setGameState((prev) => ({
      ...prev,
      explosions,
    }));
  }, []);

  const setLastShotTime = useCallback((time: number) => {
    setGameState((prev) => ({
      ...prev,
      lastShotTime: time,
    }));
  }, []);

  const setLastHitTime = useCallback((time: number) => {
    setGameState((prev) => ({
      ...prev,
      lastHitTime: time,
    }));
  }, []);

  // Batched update for asteroid destruction - combines multiple state updates into one
  const handleAsteroidDestroyed = useCallback(
    (
      asteroidId: number,
      explosionPos: [number, number, number],
      hitTime: number,
      speedMultiplier: number
    ) => {
      const points = Math.floor(POINTS_PER_KILL * speedMultiplier);
      const explosion: Explosion = {
        id: Date.now() + Math.random(),
        position: explosionPos,
        startTime: hitTime,
      };

      setGameState((prev) => ({
        ...prev,
        asteroids: prev.asteroids.filter(
          (asteroid) => asteroid.id !== asteroidId
        ),
        explosions: [...prev.explosions, explosion],
        lastHitTime: hitTime,
        kills: prev.kills + 1,
        score: prev.score + points,
      }));
    },
    []
  );

  return (
    <GameContext.Provider
      value={{
        ...gameState,
        startGame,
        endGame,
        updateScore,
        updateDistance,
        incrementKills,
        removeAsteroid,
        addExplosion,
        handleAsteroidDestroyed,
        setAsteroids,
        setExplosions,
        setCameraPosition,
        setCameraVelocity,
        setLastShotTime,
        setLastHitTime,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

const TOUCH_SENSITIVITY = 0.002;
const _MOUSE_SENSITIVITY = 0.002;

const CameraControls = () => {
  const { camera, gl } = useThree();
  const { isPlaying } = useGame();
  const controlsRef = useRef<PointerLockControlsImpl | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Touch tracking
  const touchStartRef = useRef<Vector2 | null>(null);
  const rotationRef = useRef<Euler>(new Euler(0, 0, 0, "YXZ"));
  const isTouchRotating = useRef(false);

  // Detect if device is mobile/touch
  useEffect(() => {
    const checkMobile = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const hasPointerLock = "pointerLockElement" in document;
      setIsMobile(hasTouch && !hasPointerLock);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Desktop: PointerLockControls
  useEffect(() => {
    if (isMobile) {
      return;
    }

    const controls = new PointerLockControlsImpl(camera, gl.domElement);
    controlsRef.current = controls;

    const handleClick = () => {
      if (isPlaying) {
        controls.lock();
      }
    };

    gl.domElement.addEventListener("click", handleClick);

    return () => {
      gl.domElement.removeEventListener("click", handleClick);
      // Only unlock if currently locked
      if (controls.isLocked) {
        try {
          controls.unlock();
        } catch (e) {
          // Ignore unlock errors - happens when pointer lock not supported
          console.warn("Failed to unlock pointer:", e);
        }
      }
      controls.dispose();
    };
  }, [camera, gl, isPlaying, isMobile]);

  // Mobile: Touch drag controls
  useEffect(() => {
    if (!isMobile) {
      return;
    }

    // Initialize rotation from camera
    rotationRef.current.setFromQuaternion(camera.quaternion);

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        // Single finger - camera rotation
        isTouchRotating.current = true;
        touchStartRef.current = new Vector2(
          e.touches[0].clientX,
          e.touches[0].clientY
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (
        !(isTouchRotating.current && touchStartRef.current) ||
        e.touches.length !== 1
      ) {
        return;
      }

      e.preventDefault();

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      // Update rotation
      rotationRef.current.y -= deltaX * TOUCH_SENSITIVITY;
      rotationRef.current.x -= deltaY * TOUCH_SENSITIVITY;

      // Clamp vertical rotation to prevent camera flip
      const PI_2 = Math.PI / 2;
      rotationRef.current.x = Math.max(
        -PI_2,
        Math.min(PI_2, rotationRef.current.x)
      );

      // Apply rotation to camera
      camera.quaternion.setFromEuler(rotationRef.current);

      // Update touch position for next move
      touchStartRef.current.set(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        isTouchRotating.current = false;
        touchStartRef.current = null;
      }
    };

    gl.domElement.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    gl.domElement.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    gl.domElement.addEventListener("touchend", handleTouchEnd);

    return () => {
      gl.domElement.removeEventListener("touchstart", handleTouchStart);
      gl.domElement.removeEventListener("touchmove", handleTouchMove);
      gl.domElement.removeEventListener("touchend", handleTouchEnd);
    };
  }, [camera, gl, isMobile]);

  return null;
};

const fragmentShader = `
uniform sampler2D tBlueNoise;
uniform mat4 cameraWorldMatrix;
uniform mat4 cameraProjectionMatrixInverse;
uniform float patternScale;
uniform float threshold;
uniform float pixelSize;
uniform vec2 resolution;

// Convert sRGB to linear RGB
vec3 sRGBToLinear(vec3 srgb) {
  return pow(srgb, vec3(2.2));
}

// Sphere projection mapping - like Obra Dinn
vec2 directionToSphericalUV(vec3 dir) {
  vec3 n = normalize(dir);

  // Spherical coordinates: phi (azimuth), theta (elevation)
  float phi = atan(n.z, n.x);
  float theta = asin(clamp(n.y, -1.0, 1.0));

  // Map to [0, 1] UV space
  vec2 uv = vec2(
    phi / 6.28318530718 + 0.5,  // 2*PI
    theta / 3.14159265359 + 0.5  // PI
  );

  return uv;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // Apply pixelation effect (low-res chunky look)
  vec2 pixelatedUV = uv;
  if (pixelSize > 1.0) {
    vec2 pixelCount = resolution / pixelSize;
    pixelatedUV = floor(uv * pixelCount) / pixelCount;
  }

  // Reconstruct view direction from pixelated UV
  vec4 clip = vec4(pixelatedUV * 2.0 - 1.0, 0.0, 1.0);
  vec4 view = cameraProjectionMatrixInverse * clip;
  view.xyz /= view.w;

  // Transform to world space
  vec3 worldDir = normalize((cameraWorldMatrix * vec4(view.xyz, 0.0)).xyz);

  // Project onto sphere and get UV coordinates (Obra Dinn technique)
  vec2 sphereUV = directionToSphericalUV(worldDir);
  vec2 tiledUV = fract(sphereUV * patternScale);

  // Sample blue noise
  float noise = texture2D(tBlueNoise, tiledUV).r;

  // Calculate luminance
  float luma = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));

  // Apply threshold adjustment
  float adjustedLuma = clamp(luma + threshold - 0.5, 0.0, 1.0);

  // Strict binary dithering - pure 1-bit output (no gradients)
  float dithered = step(noise, adjustedLuma);

  // Custom colors: #333319 (dark gray-green) and #ffffff (white)
  // Convert from sRGB hex values to linear RGB for proper rendering
  vec3 darkColorSRGB = vec3(51.0/255.0, 51.0/255.0, 25.0/255.0);  // #333319 in sRGB
  vec3 darkColor = sRGBToLinear(darkColorSRGB);
  vec3 lightColor = vec3(1.0, 1.0, 1.0);  // #ffffff (white)

  // Binary output - either dark or light, no in-between
  vec3 finalColor = mix(darkColor, lightColor, dithered);

  outputColor = vec4(finalColor, 1.0);
}
`;

// Custom Dither Effect class
class DitherEffectImpl extends Effect {
  constructor(
    blueNoiseTexture: Texture,
    camera: Camera,
    patternScale: number,
    threshold: number,
    pixelSize: number,
    resolution: Vector2
  ) {
    // Set up texture wrapping for tiling
    blueNoiseTexture.wrapS = RepeatWrapping;
    blueNoiseTexture.wrapT = RepeatWrapping;

    super("DitherEffect", fragmentShader, {
      uniforms: new Map<
        string,
        Uniform<number | Texture | Vector2 | Vector3 | Matrix4>
      >([
        ["tBlueNoise", new Uniform(blueNoiseTexture)],
        ["patternScale", new Uniform(patternScale)],
        ["threshold", new Uniform(threshold)],
        ["pixelSize", new Uniform(pixelSize)],
        ["resolution", new Uniform(resolution)],
        ["cameraPosition", new Uniform(new Vector3())],
        ["cameraWorldMatrix", new Uniform(camera.matrixWorld)],
        [
          "cameraProjectionMatrixInverse",
          new Uniform(camera.projectionMatrixInverse),
        ],
      ]),
    });

    this.cameraRef = camera;
  }

  private readonly cameraRef: Camera;

  update(
    _renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget,
    _deltaTime: number
  ) {
    // Update camera uniforms each frame
    if (this.cameraRef) {
      this.uniforms.get("cameraPosition")?.value.copy(this.cameraRef.position);
      const cameraWorldMatrix = this.uniforms.get("cameraWorldMatrix");
      if (cameraWorldMatrix) {
        cameraWorldMatrix.value = this.cameraRef.matrixWorld;
      }
      const projectionMatrixInverse = this.uniforms.get(
        "cameraProjectionMatrixInverse"
      );
      if (projectionMatrixInverse) {
        projectionMatrixInverse.value = this.cameraRef.projectionMatrixInverse;
      }
    }

    // Update resolution uniform
    const width = inputBuffer.width;
    const height = inputBuffer.height;
    this.uniforms.get("resolution")?.value.set(width, height);
  }
}

// Props interface
interface DitherEffectProps {
  patternScale?: number;
  threshold?: number;
  pixelSize?: number;
}

// React component wrapper
const DitherEffect = forwardRef<typeof DitherEffectImpl, DitherEffectProps>(
  ({ patternScale = 20.0, threshold = 0.5, pixelSize = 1.0 }, ref) => {
    const { camera, size } = useThree();

    // Load blue noise texture
    const blueNoiseTexture = useMemo(() => {
      const loader = new TextureLoader();
      return loader.load("./assets/blue-noise.png");
    }, []);

    // Create effect instance with camera
    const effect = useMemo(() => {
      const resolution = new Vector2(size.width, size.height);
      return new DitherEffectImpl(
        blueNoiseTexture,
        camera,
        patternScale,
        threshold,
        pixelSize,
        resolution
      );
    }, [blueNoiseTexture, camera, patternScale, threshold, pixelSize, size]);

    // Update uniform values when props change
    useMemo(() => {
      if (effect) {
        const patternScaleUniform = effect.uniforms.get("patternScale");
        if (patternScaleUniform) {
          patternScaleUniform.value = patternScale;
        }
        const thresholdUniform = effect.uniforms.get("threshold");
        if (thresholdUniform) {
          thresholdUniform.value = threshold;
        }
        const pixelSizeUniform = effect.uniforms.get("pixelSize");
        if (pixelSizeUniform) {
          pixelSizeUniform.value = pixelSize;
        }
      }
    }, [effect, patternScale, threshold, pixelSize]);

    return <primitive dispose={null} object={effect} ref={ref} />;
  }
);

DitherEffect.displayName = "DitherEffect";

DitherEffect;

interface EffectsProps {
  patternScale: number;
  threshold: number;
  pixelSize?: number;
}

function Effects({
  patternScale,
  threshold,
  pixelSize = 1.0,
}: EffectsProps) {
  return (
    <EffectComposer>
      <DitherEffect
        patternScale={patternScale}
        pixelSize={pixelSize}
        threshold={threshold}
      />
    </EffectComposer>
  );
}

// Movement constants
const BASE_SPEED = 30; // Starting forward speed (units per second)
const SPEED_SCALE_POINTS = 500; // Points needed for each speed tier
const SPEED_SCALE_MULTIPLIER = 1.2; // Speed multiplier per tier (20% increase)
const MAX_SPEED = 150; // Maximum speed cap (units per second)

// Combat constants
const SHOT_COOLDOWN_MS = 200; // Milliseconds between shots

// Collision constants
const ASTEROID_VISUAL_RADIUS_MULTIPLIER = 1.25; // Displacement makes asteroids ~25% larger
const PLAYER_COLLISION_RADIUS = 0.5; // Player collision sphere radius

const GameControls = () => {
  const { camera, scene, gl } = useThree();
  const {
    isPlaying,
    isGameOver,
    distance: _distance,
    updateDistance,
    endGame,
    startGame,
    asteroids,
    setCameraPosition,
    handleAsteroidDestroyed,
    setLastShotTime,
    updateScore: _updateScore,
    score,
  } = useGame();

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const lastShotTime = useRef<number>(0);
  const startPosition = useRef<Vector3>(
    new Vector3(...INITIAL_CAMERA_POSITION)
  );
  const isTouching = useRef<boolean>(false);
  const autoFireInterval = useRef<number | null>(null);
  const scoreRef = useRef<number>(score);

  // Keep scoreRef in sync with score
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Extract shoot logic into reusable function
  const shootRaycast = useCallback(() => {
    if (!isPlaying) {
      return;
    }

    const now = Date.now();

    if (now - lastShotTime.current < SHOT_COOLDOWN_MS) {
      return;
    }
    lastShotTime.current = now;
    setLastShotTime(now);

    // Raycasting from camera center
    const raycaster = new Raycaster();
    raycaster.setFromCamera(new Vector2(0, 0), camera); // Center of screen

    // Find all asteroid meshes by traversing the scene directly
    const asteroidMeshes: Object3D[] = [];
    scene.traverse((obj) => {
      if (obj.type === "Mesh" && obj.userData.asteroidId !== undefined) {
        asteroidMeshes.push(obj);
      }
    });

    if (asteroidMeshes.length === 0) {
      return;
    }

    const intersects = raycaster.intersectObjects(asteroidMeshes, false);

    if (intersects.length > 0) {
      // Hit! Find which asteroid was hit
      const hitMesh = intersects[0].object;
      const hitPosition = intersects[0].point;
      const asteroidId = hitMesh.userData.asteroidId;

      // Calculate current speed multiplier for scoring (use ref for latest value)
      const speedTier = Math.max(0, scoreRef.current) / SPEED_SCALE_POINTS;
      const currentSpeed = Math.min(
        MAX_SPEED,
        BASE_SPEED * SPEED_SCALE_MULTIPLIER ** speedTier
      );
      const speedMultiplier = currentSpeed / BASE_SPEED;

      // Handle asteroid destruction with batched state update
      handleAsteroidDestroyed(
        asteroidId,
        [hitPosition.x, hitPosition.y, hitPosition.z],
        now,
        speedMultiplier
      );
    }
  }, [camera, handleAsteroidDestroyed, isPlaying, scene, setLastShotTime]);

  // Auto-fire management
  const startAutoFire = useCallback(() => {
    if (autoFireInterval.current !== null) {
      return;
    }

    // Fire immediately on touch start
    shootRaycast();

    // Then continue firing at intervals
    autoFireInterval.current = window.setInterval(() => {
      shootRaycast();
    }, SHOT_COOLDOWN_MS);
  }, [shootRaycast]);

  const stopAutoFire = useCallback(() => {
    if (autoFireInterval.current !== null) {
      clearInterval(autoFireInterval.current);
      autoFireInterval.current = null;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow restart with spacebar or Enter when game is over
      if (isGameOver && (e.key === " " || e.key === "Enter")) {
        startGame();
        return;
      }

      keysPressed.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    const handlePointerDown = () => {
      // Allow restart by clicking anywhere when game is over
      if (isGameOver) {
        startGame();
        return;
      }

      // Desktop: Start auto-fire on mouse down
      isTouching.current = true;
      startAutoFire();
    };

    const handlePointerUp = () => {
      // Desktop: Stop auto-fire on mouse up
      isTouching.current = false;
      stopAutoFire();
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isGameOver) {
        return;
      }
      // Prevent pointerdown from also firing
      e.preventDefault();
      isTouching.current = true;
      startAutoFire();
    };

    const handleTouchEnd = () => {
      isTouching.current = false;
      stopAutoFire();
    };

    // Detect if device is mobile/touch
    const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    if (isMobile) {
      // Mobile: Use touch events for auto-fire
      gl.domElement.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      gl.domElement.addEventListener("touchend", handleTouchEnd);
      gl.domElement.addEventListener("touchcancel", handleTouchEnd);
    } else {
      // Desktop: Use pointer events for auto-fire (hold to shoot)
      gl.domElement.addEventListener("pointerdown", handlePointerDown);
      gl.domElement.addEventListener("pointerup", handlePointerUp);
      gl.domElement.addEventListener("pointerleave", handlePointerUp);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);

      if (isMobile) {
        gl.domElement.removeEventListener("touchstart", handleTouchStart);
        gl.domElement.removeEventListener("touchend", handleTouchEnd);
        gl.domElement.removeEventListener("touchcancel", handleTouchEnd);
      } else {
        gl.domElement.removeEventListener("pointerdown", handlePointerDown);
        gl.domElement.removeEventListener("pointerup", handlePointerUp);
        gl.domElement.removeEventListener("pointerleave", handlePointerUp);
      }

      stopAutoFire();
    };
  }, [isGameOver, startGame, gl, startAutoFire, stopAutoFire]);

  // Reset game state when restarting
  useEffect(() => {
    if (isPlaying && !isGameOver) {
      camera.position.set(...INITIAL_CAMERA_POSITION);
      startPosition.current.set(...INITIAL_CAMERA_POSITION);
      keysPressed.current = {};
    }
  }, [isPlaying, isGameOver, camera]);

  useFrame((_, delta) => {
    if (!isPlaying) {
      return;
    }

    // Progressive speed system - gets faster as score increases
    const speedTier = Math.max(0, score) / SPEED_SCALE_POINTS;
    const currentSpeed = Math.min(
      MAX_SPEED,
      BASE_SPEED * SPEED_SCALE_MULTIPLIER ** speedTier
    );

    // Get camera forward direction
    const forward = new Vector3();
    camera.getWorldDirection(forward);

    // Apply constant forward movement
    camera.position.addScaledVector(forward, currentSpeed * delta);

    // Update game state with current camera position (for asteroid spawning)
    setCameraPosition([
      camera.position.x,
      camera.position.y,
      camera.position.z,
    ]);

    // Update distance score (total distance from start)
    const newDistance = camera.position.distanceTo(startPosition.current);
    updateDistance(newDistance);

    // Collision detection with asteroids
    for (const asteroid of asteroids) {
      const dx = camera.position.x - asteroid.position[0];
      const dy = camera.position.y - asteroid.position[1];
      const dz = camera.position.z - asteroid.position[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Account for displacement (±22% from noise) and player collision sphere
      const visualRadius = asteroid.radius * ASTEROID_VISUAL_RADIUS_MULTIPLIER;

      if (dist < visualRadius + PLAYER_COLLISION_RADIUS) {
        // Collision! End game
        endGame();
        break;
      }
    }
  });

  return null;
};

// UI timing constants
const INSTRUCTIONS_DISPLAY_MS = 4000; // How long to show instructions before fading
const ANIMATION_FRAME_INTERVAL_MS = 16; // Update interval for animations (~60fps)
const SHOT_FLASH_DURATION_MS = 100; // Duration of white flash when shooting
const HIT_INDICATOR_DURATION_MS = 150; // Duration of red crosshair when hitting target

const UI = () => {
  const {
    distance,
    kills,
    score,
    isGameOver,
    startGame,
    lastShotTime,
    lastHitTime,
  } = useGame();
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(hasTouch);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, INSTRUCTIONS_DISPLAY_MS);

    return () => clearTimeout(timer);
  }, []);

  // Update current time for animations
  useEffect(() => {
    // Initialize time on client side
    setCurrentTime(Date.now());

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, ANIMATION_FRAME_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const _distanceMeters = Math.floor(distance);
  const scoreRounded = Math.floor(score);

  // Calculate speed multiplier (same formula as GameControls)
  const BASE_SPEED = 30;
  const SPEED_SCALE_POINTS = 500;
  const SPEED_SCALE_MULTIPLIER = 1.2;
  const MAX_SPEED = 150;
  const speedTier = Math.max(0, score) / SPEED_SCALE_POINTS;
  const scaledSpeed = Math.min(
    MAX_SPEED,
    BASE_SPEED * SPEED_SCALE_MULTIPLIER ** speedTier
  );
  const speedMultiplier = (scaledSpeed / BASE_SPEED).toFixed(1);

  // Calculate animation states
  const timeSinceShot = currentTime - lastShotTime;
  const timeSinceHit = currentTime - lastHitTime;
  const shotFlashActive = timeSinceShot < SHOT_FLASH_DURATION_MS;
  const hitIndicatorActive = timeSinceHit < HIT_INDICATOR_DURATION_MS;
  const crosshairPulse = shotFlashActive ? 1.3 : 1;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        fontFamily: '"VT323", monospace',
        color: "#ffffff",
        zIndex: 1000,
      }}
    >
      {/* Score Display */}
      {!isGameOver && (
        <>
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              fontSize: "20px",
            }}
          >
            Score: {scoreRounded} | {kills} kills
          </div>
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              fontSize: "20px",
              color: "#ffffff",
            }}
          >
            SPEED: {speedMultiplier}x
          </div>
        </>
      )}

      {/* Instructions (fade out after 4 seconds) */}
      {showInstructions && !isGameOver && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 24,
            textAlign: "center",
            opacity: showInstructions ? 1 : 0,
            transition: "opacity 0.5s",
            lineHeight: "1.5",
            maxWidth: "90%",
          }}
        >
          {isMobile ? (
            <>
              <div>Touch and drag to aim</div>
              <div>Auto-fires while touching</div>
              <div>Dodge the asteroids!</div>
            </>
          ) : (
            <>
              <div>Click to lock pointer</div>
              <div>Hold mouse to auto-fire</div>
              <div>Dodge the asteroids!</div>
            </>
          )}
        </div>
      )}

      {/* Crosshair */}
      {!isGameOver && (
        <>
          {/* Center dot */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${crosshairPulse})`,
              width: "4px",
              height: "4px",
              backgroundColor: hitIndicatorActive
                ? "rgba(255,100,100,0.9)"
                : "rgba(255,255,255,0.9)",
              borderRadius: "50%",
              transition: "transform 0.1s, background-color 0.15s",
            }}
          />

          {/* Outer ring */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${crosshairPulse})`,
              width: "24px",
              height: "24px",
              border: `2px solid ${hitIndicatorActive ? "rgba(255,100,100,0.7)" : "rgba(255,255,255,0.6)"}`,
              borderRadius: "50%",
              transition: "transform 0.1s, border-color 0.15s",
            }}
          />
        </>
      )}

      {/* Game Over Screen */}
      {isGameOver && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            GAME OVER
          </div>
          <div
            style={{
              fontSize: "32px",
              marginBottom: "10px",
            }}
          >
            Score: {scoreRounded}
          </div>
          <div
            style={{
              fontSize: "32px",
              marginBottom: "40px",
            }}
          >
            Kills: {kills}
          </div>
          <button
            onClick={startGame}
            onPointerDown={(e) => {
              e.currentTarget.style.backgroundColor = "#cccccc";
            }}
            onPointerLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
            onPointerUp={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
            style={{
              pointerEvents: "all",
              fontSize: isMobile ? "20px" : "24px",
              padding: isMobile ? "20px 50px" : "15px 40px",
              backgroundColor: "#ffffff",
              color: "#000000",
              border: "none",
              cursor: "pointer",
              fontFamily: '"VT323", monospace',
              fontWeight: "bold",
              touchAction: "manipulation",
            }}
            type="button"
          >
            RESTART
          </button>
        </div>
      )}
    </div>
  );
};

interface AsteroidMaterialProps {
  color: string;
  roughness: number;
  shapeSeed: number;
}

// Better hash function to avoid stripes
function hash2D(x: number, y: number, seed: number): number {
  // Use a sine-based hash to keep values deterministic without bitwise ops
  const value =
    Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43_758.545_312_3;
  return value - Math.floor(value);
}

// Interpolate function for smooth noise
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

// Value noise function using hash
function valueNoise(x: number, y: number, seed: number): number {
  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const y0 = Math.floor(y);
  const y1 = y0 + 1;

  const fx = x - x0;
  const fy = y - y0;

  const sx = smoothstep(fx);
  const sy = smoothstep(fy);

  // Sample 4 corners
  const n00 = hash2D(x0, y0, seed);
  const n10 = hash2D(x1, y0, seed);
  const n01 = hash2D(x0, y1, seed);
  const n11 = hash2D(x1, y1, seed);

  // Bilinear interpolation
  const nx0 = n00 * (1 - sx) + n10 * sx;
  const nx1 = n01 * (1 - sx) + n11 * sx;

  return nx0 * (1 - sy) + nx1 * sy;
}

// Generate procedural asteroid texture
function createTexture(canvas: HTMLCanvasElement): Texture {
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

function generateAsteroidTexture(seed: number): Texture {
  const size = 128; // Reduced from 512 for better performance (16x faster)
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return createTexture(canvas);
  }

  // Fill base color (bright gray)
  ctx.fillStyle = "#c0c0c0";
  ctx.fillRect(0, 0, size, size);

  // Simple seeded random
  let randomSeed = seed;
  const seededRandom = () => {
    randomSeed = (randomSeed * 9301 + 49_297) % 233_280;
    return randomSeed / 233_280;
  };

  // Add rocky texture with noise
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;

      // Multi-scale noise for rocky texture using improved hash-based noise
      let value = 0;
      let amplitude = 1;
      let frequency = 1;
      let maxValue = 0;

      // 4 octaves of noise
      for (let octave = 0; octave < 4; octave++) {
        const nx = (x / size) * frequency * 4;
        const ny = (y / size) * frequency * 4;

        // Use hash-based value noise instead of sin (removes stripes)
        const noise = valueNoise(nx, ny, seed + octave * 1000);

        value += noise * amplitude;
        maxValue += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
      }

      value /= maxValue;

      // Base bright gray color with variation
      const base = 160 + value * 80; // 160-240 range (much brighter)

      // Add some slightly darker spots using hash-based noise (no stripes)
      const spotNoise = valueNoise(x * 0.05, y * 0.05, seed + 5000);
      const darkSpots = spotNoise > 0.7 ? -20 : 0;

      // Add some lighter spots (highlights) using hash-based noise
      const highlightNoise = valueNoise(x * 0.1, y * 0.1, seed + 6000);
      const highlights = highlightNoise > 0.8 ? 30 : 0;

      const finalValue = Math.max(
        0,
        Math.min(255, base + darkSpots + highlights)
      );

      // Bright grayscale with slight warm tint
      data[i] = finalValue; // R
      data[i + 1] = finalValue; // G (very slight reduction)
      data[i + 2] = finalValue; // B (slight reduction for warm tint)
      data[i + 3] = 255; // A
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Add visible crater spots (lighter craters for bright surface)
  const numCraters = 15 + Math.floor(seededRandom() * 25); // 15-40 craters
  for (let i = 0; i < numCraters; i++) {
    const cx = seededRandom() * size;
    const cy = seededRandom() * size;
    const radius = 5 + seededRandom() * 30; // 5-35 pixel radius

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, "rgba(80, 80, 80, 0.4)"); // Gray center (not black)
    gradient.addColorStop(0.5, "rgba(120, 120, 120, 0.2)"); // Lighter
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // Fade out

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add small dust/grain texture
  for (let i = 0; i < 5000; i++) {
    const x = seededRandom() * size;
    const y = seededRandom() * size;
    const brightness = seededRandom() > 0.5 ? 255 : 0;
    const alpha = seededRandom() * 0.3;

    ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${alpha})`;
    ctx.fillRect(x, y, 1, 1);
  }

  return createTexture(canvas);
}

// Generate normal map for surface detail
function generateNormalMap(seed: number): Texture {
  const size = 128; // Reduced from 512 for better performance
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return createTexture(canvas);
  }

  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;

  // Generate height map first, then convert to normals
  const heightMap: number[][] = [];
  for (let y = 0; y < size; y++) {
    heightMap[y] = [];
    for (let x = 0; x < size; x++) {
      // Multi-scale noise using hash-based method (no stripes)
      let height = 0;
      let amplitude = 1;
      let frequency = 1;

      for (let octave = 0; octave < 2; octave++) {
        const nx = (x / size) * frequency * 8;
        const ny = (y / size) * frequency * 8;
        const noise = valueNoise(nx, ny, seed + octave * 7000);
        height += noise * amplitude;
        amplitude *= 0.5;
        frequency *= 2;
      }

      heightMap[y][x] = height;
    }
  }

  // Convert height map to normal map
  const strength = 3.0; // Normal map strength
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;

      // Sample neighboring heights (with wrapping)
      const hL = heightMap[y][(x - 1 + size) % size];
      const hR = heightMap[y][(x + 1) % size];
      const hU = heightMap[(y - 1 + size) % size][x];
      const hD = heightMap[(y + 1) % size][x];

      // Calculate normal
      const nx = (hL - hR) * strength;
      const ny = (hU - hD) * strength;
      const nz = 1.0;

      // Normalize
      const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
      const normX = nx / length;
      const normY = ny / length;
      const normZ = nz / length;

      // Convert to RGB (map from -1,1 to 0,255)
      data[i] = (normX + 1) * 0.5 * 255; // R
      data[i + 1] = (normY + 1) * 0.5 * 255; // G
      data[i + 2] = (normZ + 1) * 0.5 * 255; // B
      data[i + 3] = 255; // A
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return createTexture(canvas);
}

const AsteroidMaterial = ({
  color,
  roughness,
  shapeSeed,
}: AsteroidMaterialProps) => {
  const texture = useMemo(
    () => generateAsteroidTexture(shapeSeed),
    [shapeSeed]
  );
  const normalMap = useMemo(() => generateNormalMap(shapeSeed), [shapeSeed]);

  return (
    <meshStandardMaterial
      color={color}
      map={texture}
      metalness={0.1}
      normalMap={normalMap}
      normalScale={new Vector2(1.5, 1.5)}
      roughness={roughness}
    />
  );
};

AsteroidMaterial;

interface AsteroidGeometryProps {
  radius: number;
  shapeSeed: number;
}

// Simple LCG PRNG - deterministic without bitwise ops
class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = Math.abs(seed) % 4_294_967_296;
  }

  next(): number {
    this.state = (this.state * 1_664_525 + 1_013_904_223) % 4_294_967_296;
    return this.state / 4_294_967_296;
  }
}

// Simple 3D Perlin-like noise using interpolated random values
class Noise3D {
  // Hash function for 3D coordinates
  private hash(x: number, y: number, z: number): number {
    const n =
      Math.floor(x) * 374_761_393 +
      Math.floor(y) * 668_265_263 +
      Math.floor(z) * 2_147_483_647;
    return Math.abs(n) % 1_000_000;
  }

  // Interpolation function (smoothstep)
  private smoothstep(t: number): number {
    return t * t * (3 - 2 * t);
  }

  // Get noise value at 3D position
  noise(x: number, y: number, z: number): number {
    const x0 = Math.floor(x);
    const x1 = x0 + 1;
    const y0 = Math.floor(y);
    const y1 = y0 + 1;
    const z0 = Math.floor(z);
    const z1 = z0 + 1;

    const fx = x - x0;
    const fy = y - y0;
    const fz = z - z0;

    const sx = this.smoothstep(fx);
    const sy = this.smoothstep(fy);
    const sz = this.smoothstep(fz);

    // Sample 8 corners of the cube
    const n000 = this.hash(x0, y0, z0) / 1_000_000;
    const n001 = this.hash(x0, y0, z1) / 1_000_000;
    const n010 = this.hash(x0, y1, z0) / 1_000_000;
    const n011 = this.hash(x0, y1, z1) / 1_000_000;
    const n100 = this.hash(x1, y0, z0) / 1_000_000;
    const n101 = this.hash(x1, y0, z1) / 1_000_000;
    const n110 = this.hash(x1, y1, z0) / 1_000_000;
    const n111 = this.hash(x1, y1, z1) / 1_000_000;

    // Trilinear interpolation
    const nx00 = n000 * (1 - sx) + n100 * sx;
    const nx01 = n001 * (1 - sx) + n101 * sx;
    const nx10 = n010 * (1 - sx) + n110 * sx;
    const nx11 = n011 * (1 - sx) + n111 * sx;

    const nxy0 = nx00 * (1 - sy) + nx10 * sy;
    const nxy1 = nx01 * (1 - sy) + nx11 * sy;

    return nxy0 * (1 - sz) + nxy1 * sz;
  }

  // Multi-octave noise (fractal Brownian motion)
  octaveNoise(x: number, y: number, z: number, octaves: number): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      value +=
        this.noise(x * frequency, y * frequency, z * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }

    return value / maxValue;
  }
}

const AsteroidGeometry = ({
  radius,
  shapeSeed,
}: AsteroidGeometryProps) => {
  const geometry = useMemo(() => {
    const rng = new SeededRandom(shapeSeed);
    const noise = new Noise3D();

    // Use seed to pick base geometry type (weighted toward icosahedron)
    const typeRand = rng.next();
    let baseGeometry: BufferGeometry;

    if (typeRand < 0.6) {
      // 60% icosahedron (best for asteroids)
      const detail = 2 + Math.floor(rng.next() * 2); // 2-3 subdivisions
      baseGeometry = new IcosahedronGeometry(radius, detail);
    } else if (typeRand < 0.85) {
      // 25% dodecahedron
      const detail = 2 + Math.floor(rng.next() * 2);
      baseGeometry = new DodecahedronGeometry(radius, detail);
    } else {
      // 15% octahedron (remove tetrahedron - too simple)
      const detail = 2 + Math.floor(rng.next() * 2);
      baseGeometry = new OctahedronGeometry(radius, detail);
    }

    // Merge vertices to ensure no gaps (vertices at same position become one)
    baseGeometry = mergeVertices(baseGeometry);

    // Compute vertex normals so we can displace along them
    baseGeometry.computeVertexNormals();

    // Apply multi-octave noise displacement for organic, asteroid-like shape
    const positionAttribute = baseGeometry.attributes.position;
    const normalAttribute = baseGeometry.attributes.normal;

    // Generate random craters - both large impacts and small pockmarks
    const numLargeCraters = Math.floor(4 + rng.next() * 6); // 4-9 large craters
    const numSmallCraters = Math.floor(8 + rng.next() * 12); // 8-19 small pockmarks
    const craters: {
      x: number;
      y: number;
      z: number;
      radius: number;
      depth: number;
    }[] = [];

    // Large impact craters
    for (let i = 0; i < numLargeCraters; i++) {
      const theta = rng.next() * Math.PI * 2;
      const phi = Math.acos(2 * rng.next() - 1);
      const cx = radius * Math.sin(phi) * Math.cos(theta);
      const cy = radius * Math.sin(phi) * Math.sin(theta);
      const cz = radius * Math.cos(phi);

      craters.push({
        x: cx,
        y: cy,
        z: cz,
        radius: radius * (0.2 + rng.next() * 0.25), // 20-45% of asteroid radius
        depth: radius * (0.12 + rng.next() * 0.15), // 12-27% depth
      });
    }

    // Small pockmark craters for spotty texture
    for (let i = 0; i < numSmallCraters; i++) {
      const theta = rng.next() * Math.PI * 2;
      const phi = Math.acos(2 * rng.next() - 1);
      const cx = radius * Math.sin(phi) * Math.cos(theta);
      const cy = radius * Math.sin(phi) * Math.sin(theta);
      const cz = radius * Math.cos(phi);

      craters.push({
        x: cx,
        y: cy,
        z: cz,
        radius: radius * (0.05 + rng.next() * 0.12), // 5-17% of asteroid radius (small spots)
        depth: radius * (0.04 + rng.next() * 0.08), // 4-12% depth (shallow)
      });
    }

    // Displace each vertex
    for (let i = 0; i < positionAttribute.count; i++) {
      // Get vertex position and normal
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);

      const nx = normalAttribute.getX(i);
      const ny = normalAttribute.getY(i);
      const nz = normalAttribute.getZ(i);

      // Multi-octave noise displacement for rough, rocky surface texture
      const noiseScale = 3.0; // Base frequency for large features
      const noiseValue = noise.octaveNoise(
        (x / radius) * noiseScale,
        (y / radius) * noiseScale,
        (z / radius) * noiseScale,
        5
      );

      // Add high-frequency detail noise for spotty, bumpy texture
      const detailScale = 8.0; // Very high frequency for fine bumps
      const detailNoise = noise.noise(
        (x / radius) * detailScale,
        (y / radius) * detailScale,
        (z / radius) * detailScale
      );

      // Combine base noise and detail noise
      const combinedNoise = noiseValue * 0.75 + detailNoise * 0.25; // 75% large features, 25% fine detail

      // Convert noise from [0,1] to [-1,1] range for displacement
      const noiseDisplacement = (combinedNoise * 2 - 1) * radius * 0.22; // ±22% of radius for rougher surface

      // Add crater depressions
      let craterDisplacement = 0;
      for (const crater of craters) {
        const dx = x - crater.x;
        const dy = y - crater.y;
        const dz = z - crater.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < crater.radius) {
          // Smooth crater falloff using cosine
          const falloff =
            (Math.cos((dist / crater.radius) * Math.PI) + 1) * 0.5;
          craterDisplacement -= crater.depth * falloff;
        }
      }

      // Combine noise and crater displacement
      const totalDisplacement = noiseDisplacement + craterDisplacement;

      // Displace along normal direction
      positionAttribute.setXYZ(
        i,
        x + nx * totalDisplacement,
        y + ny * totalDisplacement,
        z + nz * totalDisplacement
      );
    }

    // Mark attribute as needing update
    positionAttribute.needsUpdate = true;

    // Recalculate normals after displacement for proper lighting
    baseGeometry.computeVertexNormals();

    return baseGeometry;
  }, [radius, shapeSeed]);

  return <primitive attach="geometry" object={geometry} />;
};

AsteroidGeometry;

interface AsteroidProps {
  asteroid: AsteroidType;
}

// Memoized asteroid component - only re-renders when asteroid reference changes
// This prevents all asteroids from re-rendering when one is destroyed
const AsteroidComponent = ({ asteroid }: AsteroidProps) => {
  return (
    <mesh
      castShadow
      position={asteroid.position}
      rotation={asteroid.rotation}
      userData={{ asteroidId: asteroid.id }}
    >
      <AsteroidGeometry
        radius={asteroid.radius}
        shapeSeed={asteroid.shapeSeed}
      />
      <AsteroidMaterial
        color={asteroid.color}
        roughness={asteroid.roughness}
        shapeSeed={asteroid.shapeSeed}
      />
    </mesh>
  );
};

// Memo comparison: only re-render if asteroid object reference changes
const Asteroid = memo(AsteroidComponent, (prev, next) => {
  // Return true if props are equal (skip re-render)
  // Return false if props are different (do re-render)
  return prev.asteroid === next.asteroid;
});

// Explosion constants
const EXPLOSION_DURATION_MS = 600; // Milliseconds before explosion fragments are removed
const FRAGMENT_COUNT = 12; // Number of debris fragments per explosion
const FRAGMENT_SPEED_MIN = 5; // Minimum fragment velocity
const FRAGMENT_SPEED_MAX = 13; // Maximum fragment velocity (min + range)
const FRAGMENT_SCALE_MIN = 0.2; // Minimum fragment size
const FRAGMENT_SCALE_MAX = 0.5; // Maximum fragment size
const FRAGMENT_VELOCITY_DECAY = 0.95; // Per-frame velocity multiplier (slowdown)

interface Fragment {
  id: string;
  position: [number, number, number];
  velocity: [number, number, number];
  rotation: [number, number, number];
  rotationSpeed: [number, number, number];
  scale: number;
}

const Explosions = () => {
  const { explosions, setExplosions } = useGame();

  // Update explosions and remove old ones
  useFrame(() => {
    const now = Date.now();
    const filtered = explosions.filter((explosion) => {
      const age = now - explosion.startTime;
      return age < EXPLOSION_DURATION_MS;
    });

    if (filtered.length !== explosions.length) {
      setExplosions(filtered);
    }
  });

  return (
    <>
      {explosions.map((explosion) => (
        <ExplosionEffect explosion={explosion} key={explosion.id} />
      ))}
    </>
  );
};

interface ExplosionEffectProps {
  explosion: ExplosionType;
}

const ExplosionEffect = ({ explosion }: ExplosionEffectProps) => {
  // Generate fragments for this explosion
  const fragments = useMemo(() => {
    const frags: Fragment[] = [];

    for (let i = 0; i < FRAGMENT_COUNT; i++) {
      // Distribute fragments in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed =
        FRAGMENT_SPEED_MIN +
        Math.random() * (FRAGMENT_SPEED_MAX - FRAGMENT_SPEED_MIN);

      const vx = Math.sin(phi) * Math.cos(theta) * speed;
      const vy = Math.sin(phi) * Math.sin(theta) * speed;
      const vz = Math.cos(phi) * speed;

      frags.push({
        id: `${explosion.id}-${i}`,
        position: [...explosion.position] as [number, number, number],
        velocity: [vx, vy, vz],
        rotation: [
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
        ],
        rotationSpeed: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
        ],
        scale:
          FRAGMENT_SCALE_MIN +
          Math.random() * (FRAGMENT_SCALE_MAX - FRAGMENT_SCALE_MIN),
      });
    }

    return frags;
  }, [explosion]);

  // Update fragment positions
  useFrame((_, delta) => {
    for (const frag of fragments) {
      frag.position[0] += frag.velocity[0] * delta;
      frag.position[1] += frag.velocity[1] * delta;
      frag.position[2] += frag.velocity[2] * delta;

      frag.rotation[0] += frag.rotationSpeed[0] * delta;
      frag.rotation[1] += frag.rotationSpeed[1] * delta;
      frag.rotation[2] += frag.rotationSpeed[2] * delta;

      // Slow down fragments
      frag.velocity[0] *= FRAGMENT_VELOCITY_DECAY;
      frag.velocity[1] *= FRAGMENT_VELOCITY_DECAY;
      frag.velocity[2] *= FRAGMENT_VELOCITY_DECAY;
    }
  });

  // Calculate opacity based on age
  const now = Date.now();
  const age = now - explosion.startTime;
  const opacity = Math.max(0, 1 - age / EXPLOSION_DURATION_MS);

  return (
    <>
      {fragments.map((frag) => (
        <mesh
          key={frag.id}
          position={frag.position}
          rotation={frag.rotation}
          scale={frag.scale}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.2}
            opacity={opacity}
            roughness={0.5}
            transparent
          />
        </mesh>
      ))}
    </>
  );
};

const MAX_ASTEROIDS = 30;
const SPAWN_INTERVAL_START = 1.2; // Starting spawn interval (seconds)
const SPAWN_INTERVAL_MIN = 0.3; // Minimum spawn interval at high scores
const SPAWN_DISTANCE_MIN = 60; // Spawn ahead of camera
const SPAWN_DISTANCE_MAX = 150;
const REMOVE_DISTANCE = 200; // Remove when far from camera (any direction)
const MIN_SPAWN_SAFETY = 15; // Minimum distance from camera when spawning

// Difficulty scaling constants
const SPAWN_RATE_SCALE = 2000; // Score points to reduce spawn interval
const VELOCITY_SCALE = 500; // Score points to increase asteroid velocity

// Helper function to create asteroid properties (avoids code duplication)
function createAsteroidProperties(
  id: number,
  score = 0
): Omit<AsteroidType, "position"> {
  // Random linear velocity with scaling based on score
  const dirX = (Math.random() - 0.5) * 2;
  const dirY = (Math.random() - 0.5) * 2;
  const dirZ = (Math.random() - 0.5) * 2;
  const length = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);

  // Scale max velocity with score: starts at 10.5, increases by 1 per 500 points
  const baseMaxVelocity = 10;
  const velocityBonus = Math.max(0, score) / VELOCITY_SCALE;
  const maxVelocity = baseMaxVelocity + velocityBonus;
  const speed = 0.5 + Math.random() * maxVelocity; // 0.5 to (10.5 + bonus) units/sec

  const velocityX = (dirX / length) * speed;
  const velocityY = (dirY / length) * speed;
  const velocityZ = (dirZ / length) * speed;

  // Varied asteroid sizes
  const radius = 2 + Math.random() * 6; // 2-8 units

  // Very bright colors
  const gray = Math.floor(Math.random() * 10 + 245)
    .toString(16)
    .padStart(2, "0"); // 245-255

  const roughness = Math.random() * 0.4 + 0.3; // 0.3-0.7

  return {
    id,
    radius,
    color: `#${gray}${gray}${gray}`,
    roughness,
    velocity: [velocityX, velocityY, velocityZ],
    rotation: [
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    ],
    rotationSpeed: [
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
    ],
    shapeSeed: Math.random() * 10_000,
  };
}

function Scene() {
  const { camera } = useThree();
  const { asteroids, setAsteroids, isPlaying, isGameOver, score } = useGame();

  const nextIdRef = useRef(0);
  const spawnAccumulator = useRef(0);
  const asteroidsRef = useRef<AsteroidType[]>([]);
  const initializedRef = useRef(false);

  // Generate static background stars once as a point cloud
  const starGeometry = useMemo(() => {
    const starCount = 200;
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 100; // Fixed radius for all stars

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = 0.5 + Math.random() * 0.5;
    }

    return { positions, sizes };
  }, []);

  const starsRef = useRef<THREE.Points>(null);

  // Initialize asteroids on mount and when game restarts
  useEffect(() => {
    if ((!isPlaying || isGameOver) && initializedRef.current) {
      // Game ended, reset
      initializedRef.current = false;
      asteroidsRef.current = [];
      setAsteroids([]);
      return;
    }

    if (!isPlaying || isGameOver || initializedRef.current) {
      return;
    }

    // Reset for new game
    nextIdRef.current = 0;
    spawnAccumulator.current = 0;
    initializedRef.current = true;

    // Start with some initial asteroids
    const initialAsteroids: AsteroidType[] = [];
    const numInitial = 10;
    const startPos = camera.position;

    for (let i = 0; i < numInitial; i++) {
      // Spawn in front of camera in a wide spread
      const spreadX = (Math.random() - 0.5) * 80;
      const spreadY = (Math.random() - 0.5) * 60;
      const distance =
        SPAWN_DISTANCE_MIN +
        Math.random() * (SPAWN_DISTANCE_MAX - SPAWN_DISTANCE_MIN);

      const x = startPos.x + spreadX;
      const y = startPos.y + spreadY;
      const z = startPos.z - distance; // Negative Z is forward in Three.js

      // Check minimum safety distance
      const dx = x - startPos.x;
      const dy = y - startPos.y;
      const dz = z - startPos.z;
      const distFromCamera = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distFromCamera < MIN_SPAWN_SAFETY) {
        i--; // Retry this iteration
        continue;
      }

      // Create asteroid with helper function
      initialAsteroids.push({
        ...createAsteroidProperties(nextIdRef.current++, 0), // Start at score 0
        position: [x, y, z],
      });
    }

    asteroidsRef.current = initialAsteroids;
    setAsteroids(initialAsteroids);
  }, [isPlaying, isGameOver, setAsteroids, camera]);

  // Handle external asteroid removals (e.g., from shooting) without overwriting positions
  useEffect(() => {
    const stateIds = new Set(asteroids.map((a) => a.id));
    const refIds = new Set(asteroidsRef.current.map((a) => a.id));

    // Only remove asteroids from ref that are no longer in state
    // Don't touch positions of remaining asteroids
    const removed = Array.from(refIds).filter((id) => !stateIds.has(id));
    if (removed.length > 0) {
      asteroidsRef.current = asteroidsRef.current.filter((a) =>
        stateIds.has(a.id)
      );
    }
  }, [asteroids]);

  // Update asteroid positions and spawn new ones
  useFrame((_, delta) => {
    if (!(isPlaying && initializedRef.current)) {
      return;
    }

    let needsStateUpdate = false;
    const currentCameraPos = camera.position;

    // Update positions - positions are stored in ref and read directly during render
    // No need to update React state for position changes - only for add/remove
    asteroidsRef.current = asteroidsRef.current.map((asteroid) => ({
      ...asteroid,
      position: [
        asteroid.position[0] + asteroid.velocity[0] * delta,
        asteroid.position[1] + asteroid.velocity[1] * delta,
        asteroid.position[2] + asteroid.velocity[2] * delta,
      ] as [number, number, number],
      rotation: [
        asteroid.rotation[0] + asteroid.rotationSpeed[0] * delta,
        asteroid.rotation[1] + asteroid.rotationSpeed[1] * delta,
        asteroid.rotation[2] + asteroid.rotationSpeed[2] * delta,
      ] as [number, number, number],
    }));

    // Remove asteroids that are too far from camera (any direction)
    const beforeCount = asteroidsRef.current.length;
    asteroidsRef.current = asteroidsRef.current.filter((asteroid) => {
      const dx = asteroid.position[0] - currentCameraPos.x;
      const dy = asteroid.position[1] - currentCameraPos.y;
      const dz = asteroid.position[2] - currentCameraPos.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      return distance < REMOVE_DISTANCE;
    });
    if (asteroidsRef.current.length !== beforeCount) {
      needsStateUpdate = true;
    }

    // Calculate dynamic spawn interval based on score (gets faster over time)
    // Formula: spawnInterval = max(0.3, 1.2 - score/2000)
    const currentSpawnInterval = Math.max(
      SPAWN_INTERVAL_MIN,
      SPAWN_INTERVAL_START - Math.max(0, score) / SPAWN_RATE_SCALE
    );

    // Spawn new asteroids using accumulated time
    spawnAccumulator.current += delta;

    if (
      spawnAccumulator.current >= currentSpawnInterval &&
      asteroidsRef.current.length < MAX_ASTEROIDS
    ) {
      spawnAccumulator.current = 0;
      needsStateUpdate = true;

      const numToSpawn = Math.min(
        Math.floor(Math.random() * 2) + 1,
        MAX_ASTEROIDS - asteroidsRef.current.length
      );

      for (let i = 0; i < numToSpawn; i++) {
        const spreadX = (Math.random() - 0.5) * 100;
        const spreadY = (Math.random() - 0.5) * 80;
        const distance =
          SPAWN_DISTANCE_MIN +
          Math.random() * (SPAWN_DISTANCE_MAX - SPAWN_DISTANCE_MIN);

        const x = currentCameraPos.x + spreadX;
        const y = currentCameraPos.y + spreadY;
        const z = currentCameraPos.z - distance;

        // Check minimum safety distance
        const dx = x - currentCameraPos.x;
        const dy = y - currentCameraPos.y;
        const dz = z - currentCameraPos.z;
        const distFromCamera = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distFromCamera < MIN_SPAWN_SAFETY) {
          i--; // Retry this iteration
          continue;
        }

        // Create asteroid with helper function (pass current score for difficulty scaling)
        asteroidsRef.current.push({
          ...createAsteroidProperties(nextIdRef.current++, score),
          position: [x, y, z],
        });
      }
    }

    // Only update React state when asteroids added/removed
    if (needsStateUpdate) {
      setAsteroids([...asteroidsRef.current]);
    }

    // Update star position to follow camera (skybox effect - infinite distance)
    if (starsRef.current) {
      starsRef.current.position.copy(camera.position);
    }
  });

  return (
    <>
      {/* Background stars - skybox at infinite distance */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            args={[starGeometry.positions, 3]}
            attach="attributes-position"
          />
          <bufferAttribute
            args={[starGeometry.sizes, 1]}
            attach="attributes-size"
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={1.5}
          sizeAttenuation={false}
          transparent={false}
        />
      </points>

      {/* Dynamic asteroids - render from ref for real-time position updates */}
      {asteroidsRef.current.map((asteroid) => (
        <Asteroid asteroid={asteroid} key={asteroid.id} />
      ))}

      {/* Explosion effects */}
      <Explosions />
    </>
  );
}

function DitherBlock() {
  return (
    <GameProvider>
      <UI />
      <Canvas
        camera={{
          position: INITIAL_CAMERA_POSITION,
          fov: 75,
          near: 0.1,
          far: 500,
        }}
        dpr={[1, 2]}
      >
        {/* Multi-directional lighting for maximum asteroid visibility */}
        <ambientLight intensity={1.0} />

        {/* Main sun - from upper back */}
        <directionalLight
          castShadow
          intensity={1.5}
          position={[100, 200, -300]}
        />

        {/* Fill lights from multiple angles */}
        <directionalLight intensity={1.2} position={[-100, 100, 200]} />
        <directionalLight intensity={1.0} position={[100, -100, 100]} />
        <directionalLight intensity={1.0} position={[0, 100, 300]} />
        <directionalLight intensity={0.8} position={[-150, 0, -100]} />

        {/* Scene with dynamic asteroids */}
        <Scene />

        {/* Camera controls (desktop + mobile) */}
        <CameraControls />

        {/* Game controls */}
        <GameControls />

        {/* Post-processing with dither effect */}
        <Effects patternScale={12.0} threshold={0.5} />
      </Canvas>
    </GameProvider>
  );
}

function App() {
  return (
    <DitherBlock />
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
