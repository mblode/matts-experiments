import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as React from "react";
import { createContext, forwardRef, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CanvasTexture, DodecahedronGeometry, Euler, IcosahedronGeometry, OctahedronGeometry, Raycaster, RepeatWrapping, TextureLoader, Uniform, Vector2, Vector3 } from "three";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import { EffectComposer } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { createRoot } from "react-dom/client";
const INITIAL_CAMERA_POSITION = [0, 0, 10];
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
  cameraVelocity: [0, 0, 0],
  speed: 8,
  lastShotTime: 0,
  lastHitTime: 0
};
const GameContext = createContext(void 0);
const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
};
const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const startGame = useCallback(() => {
    setGameState(INITIAL_GAME_STATE);
  }, []);
  const endGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: false,
      isGameOver: true
    }));
  }, []);
  const updateScore = useCallback((points) => {
    setGameState((prev) => ({
      ...prev,
      score: Math.max(0, prev.score + points)
      // Prevent score from going below 0
    }));
  }, []);
  const updateDistance = useCallback((dist) => {
    setGameState((prev) => ({
      ...prev,
      distance: dist
    }));
  }, []);
  const setAsteroids = useCallback((asteroids) => {
    setGameState((prev) => ({
      ...prev,
      asteroids
    }));
  }, []);
  const setCameraPosition = useCallback((pos) => {
    setGameState((prev) => ({
      ...prev,
      cameraPosition: pos
    }));
  }, []);
  const setCameraVelocity = useCallback((vel) => {
    setGameState((prev) => ({
      ...prev,
      cameraVelocity: vel
    }));
  }, []);
  const incrementKills = useCallback((speedMultiplier = 1) => {
    const points = Math.floor(POINTS_PER_KILL * speedMultiplier);
    setGameState((prev) => ({
      ...prev,
      kills: prev.kills + 1,
      score: prev.score + points
    }));
  }, []);
  const removeAsteroid = useCallback((id) => {
    setGameState((prev) => ({
      ...prev,
      asteroids: prev.asteroids.filter((asteroid) => asteroid.id !== id)
    }));
  }, []);
  const addExplosion = useCallback((position) => {
    const explosion = {
      id: Date.now() + Math.random(),
      position,
      startTime: Date.now()
    };
    setGameState((prev) => ({
      ...prev,
      explosions: [...prev.explosions, explosion]
    }));
  }, []);
  const setExplosions = useCallback((explosions) => {
    setGameState((prev) => ({
      ...prev,
      explosions
    }));
  }, []);
  const setLastShotTime = useCallback((time) => {
    setGameState((prev) => ({
      ...prev,
      lastShotTime: time
    }));
  }, []);
  const setLastHitTime = useCallback((time) => {
    setGameState((prev) => ({
      ...prev,
      lastHitTime: time
    }));
  }, []);
  const handleAsteroidDestroyed = useCallback(
    (asteroidId, explosionPos, hitTime, speedMultiplier) => {
      const points = Math.floor(POINTS_PER_KILL * speedMultiplier);
      const explosion = {
        id: Date.now() + Math.random(),
        position: explosionPos,
        startTime: hitTime
      };
      setGameState((prev) => ({
        ...prev,
        asteroids: prev.asteroids.filter(
          (asteroid) => asteroid.id !== asteroidId
        ),
        explosions: [...prev.explosions, explosion],
        lastHitTime: hitTime,
        kills: prev.kills + 1,
        score: prev.score + points
      }));
    },
    []
  );
  return /* @__PURE__ */ React.createElement(
    GameContext.Provider,
    {
      value: {
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
        setLastHitTime
      }
    },
    children
  );
};
const TOUCH_SENSITIVITY = 2e-3;
const _MOUSE_SENSITIVITY = 2e-3;
const CameraControls = () => {
  const { camera, gl } = useThree();
  const { isPlaying } = useGame();
  const controlsRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartRef = useRef(null);
  const rotationRef = useRef(new Euler(0, 0, 0, "YXZ"));
  const isTouchRotating = useRef(false);
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
      if (controls.isLocked) {
        try {
          controls.unlock();
        } catch (e) {
          console.warn("Failed to unlock pointer:", e);
        }
      }
      controls.dispose();
    };
  }, [camera, gl, isPlaying, isMobile]);
  useEffect(() => {
    if (!isMobile) {
      return;
    }
    rotationRef.current.setFromQuaternion(camera.quaternion);
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isTouchRotating.current = true;
        touchStartRef.current = new Vector2(
          e.touches[0].clientX,
          e.touches[0].clientY
        );
      }
    };
    const handleTouchMove = (e) => {
      if (!(isTouchRotating.current && touchStartRef.current) || e.touches.length !== 1) {
        return;
      }
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      rotationRef.current.y -= deltaX * TOUCH_SENSITIVITY;
      rotationRef.current.x -= deltaY * TOUCH_SENSITIVITY;
      const PI_2 = Math.PI / 2;
      rotationRef.current.x = Math.max(
        -PI_2,
        Math.min(PI_2, rotationRef.current.x)
      );
      camera.quaternion.setFromEuler(rotationRef.current);
      touchStartRef.current.set(touch.clientX, touch.clientY);
    };
    const handleTouchEnd = (e) => {
      if (e.touches.length === 0) {
        isTouchRotating.current = false;
        touchStartRef.current = null;
      }
    };
    gl.domElement.addEventListener("touchstart", handleTouchStart, {
      passive: false
    });
    gl.domElement.addEventListener("touchmove", handleTouchMove, {
      passive: false
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
class DitherEffectImpl extends Effect {
  constructor(blueNoiseTexture, camera, patternScale, threshold, pixelSize, resolution) {
    blueNoiseTexture.wrapS = RepeatWrapping;
    blueNoiseTexture.wrapT = RepeatWrapping;
    super("DitherEffect", fragmentShader, {
      uniforms: /* @__PURE__ */ new Map([
        ["tBlueNoise", new Uniform(blueNoiseTexture)],
        ["patternScale", new Uniform(patternScale)],
        ["threshold", new Uniform(threshold)],
        ["pixelSize", new Uniform(pixelSize)],
        ["resolution", new Uniform(resolution)],
        ["cameraPosition", new Uniform(new Vector3())],
        ["cameraWorldMatrix", new Uniform(camera.matrixWorld)],
        [
          "cameraProjectionMatrixInverse",
          new Uniform(camera.projectionMatrixInverse)
        ]
      ])
    });
    this.cameraRef = camera;
  }
  cameraRef;
  update(_renderer, inputBuffer, _deltaTime) {
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
    const width = inputBuffer.width;
    const height = inputBuffer.height;
    this.uniforms.get("resolution")?.value.set(width, height);
  }
}
const DitherEffect = forwardRef(
  ({ patternScale = 20, threshold = 0.5, pixelSize = 1 }, ref) => {
    const { camera, size } = useThree();
    const blueNoiseTexture = useMemo(() => {
      const loader = new TextureLoader();
      return loader.load("./assets/blue-noise.png");
    }, []);
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
    return /* @__PURE__ */ React.createElement("primitive", { dispose: null, object: effect, ref });
  }
);
DitherEffect.displayName = "DitherEffect";
DitherEffect;
function Effects({
  patternScale,
  threshold,
  pixelSize = 1
}) {
  return /* @__PURE__ */ React.createElement(EffectComposer, null, /* @__PURE__ */ React.createElement(
    DitherEffect,
    {
      patternScale,
      pixelSize,
      threshold
    }
  ));
}
const BASE_SPEED = 30;
const SPEED_SCALE_POINTS = 500;
const SPEED_SCALE_MULTIPLIER = 1.2;
const MAX_SPEED = 150;
const SHOT_COOLDOWN_MS = 200;
const ASTEROID_VISUAL_RADIUS_MULTIPLIER = 1.25;
const PLAYER_COLLISION_RADIUS = 0.5;
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
    score
  } = useGame();
  const keysPressed = useRef({});
  const lastShotTime = useRef(0);
  const startPosition = useRef(
    new Vector3(...INITIAL_CAMERA_POSITION)
  );
  const isTouching = useRef(false);
  const autoFireInterval = useRef(null);
  const scoreRef = useRef(score);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
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
    const raycaster = new Raycaster();
    raycaster.setFromCamera(new Vector2(0, 0), camera);
    const asteroidMeshes = [];
    scene.traverse((obj) => {
      if (obj.type === "Mesh" && obj.userData.asteroidId !== void 0) {
        asteroidMeshes.push(obj);
      }
    });
    if (asteroidMeshes.length === 0) {
      return;
    }
    const intersects = raycaster.intersectObjects(asteroidMeshes, false);
    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      const hitPosition = intersects[0].point;
      const asteroidId = hitMesh.userData.asteroidId;
      const speedTier = Math.max(0, scoreRef.current) / SPEED_SCALE_POINTS;
      const currentSpeed = Math.min(
        MAX_SPEED,
        BASE_SPEED * SPEED_SCALE_MULTIPLIER ** speedTier
      );
      const speedMultiplier = currentSpeed / BASE_SPEED;
      handleAsteroidDestroyed(
        asteroidId,
        [hitPosition.x, hitPosition.y, hitPosition.z],
        now,
        speedMultiplier
      );
    }
  }, [camera, handleAsteroidDestroyed, isPlaying, scene, setLastShotTime]);
  const startAutoFire = useCallback(() => {
    if (autoFireInterval.current !== null) {
      return;
    }
    shootRaycast();
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
    const handleKeyDown = (e) => {
      if (isGameOver && (e.key === " " || e.key === "Enter")) {
        startGame();
        return;
      }
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };
    const handlePointerDown = () => {
      if (isGameOver) {
        startGame();
        return;
      }
      isTouching.current = true;
      startAutoFire();
    };
    const handlePointerUp = () => {
      isTouching.current = false;
      stopAutoFire();
    };
    const handleTouchStart = (e) => {
      if (isGameOver) {
        return;
      }
      e.preventDefault();
      isTouching.current = true;
      startAutoFire();
    };
    const handleTouchEnd = () => {
      isTouching.current = false;
      stopAutoFire();
    };
    const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    if (isMobile) {
      gl.domElement.addEventListener("touchstart", handleTouchStart, {
        passive: false
      });
      gl.domElement.addEventListener("touchend", handleTouchEnd);
      gl.domElement.addEventListener("touchcancel", handleTouchEnd);
    } else {
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
    const speedTier = Math.max(0, score) / SPEED_SCALE_POINTS;
    const currentSpeed = Math.min(
      MAX_SPEED,
      BASE_SPEED * SPEED_SCALE_MULTIPLIER ** speedTier
    );
    const forward = new Vector3();
    camera.getWorldDirection(forward);
    camera.position.addScaledVector(forward, currentSpeed * delta);
    setCameraPosition([
      camera.position.x,
      camera.position.y,
      camera.position.z
    ]);
    const newDistance = camera.position.distanceTo(startPosition.current);
    updateDistance(newDistance);
    for (const asteroid of asteroids) {
      const dx = camera.position.x - asteroid.position[0];
      const dy = camera.position.y - asteroid.position[1];
      const dz = camera.position.z - asteroid.position[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const visualRadius = asteroid.radius * ASTEROID_VISUAL_RADIUS_MULTIPLIER;
      if (dist < visualRadius + PLAYER_COLLISION_RADIUS) {
        endGame();
        break;
      }
    }
  });
  return null;
};
const INSTRUCTIONS_DISPLAY_MS = 4e3;
const ANIMATION_FRAME_INTERVAL_MS = 16;
const SHOT_FLASH_DURATION_MS = 100;
const HIT_INDICATOR_DURATION_MS = 150;
const UI = () => {
  const {
    distance,
    kills,
    score,
    isGameOver,
    startGame,
    lastShotTime,
    lastHitTime
  } = useGame();
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
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
  useEffect(() => {
    setCurrentTime(Date.now());
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, ANIMATION_FRAME_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);
  const _distanceMeters = Math.floor(distance);
  const scoreRounded = Math.floor(score);
  const BASE_SPEED2 = 30;
  const SPEED_SCALE_POINTS2 = 500;
  const SPEED_SCALE_MULTIPLIER2 = 1.2;
  const MAX_SPEED2 = 150;
  const speedTier = Math.max(0, score) / SPEED_SCALE_POINTS2;
  const scaledSpeed = Math.min(
    MAX_SPEED2,
    BASE_SPEED2 * SPEED_SCALE_MULTIPLIER2 ** speedTier
  );
  const speedMultiplier = (scaledSpeed / BASE_SPEED2).toFixed(1);
  const timeSinceShot = currentTime - lastShotTime;
  const timeSinceHit = currentTime - lastHitTime;
  const shotFlashActive = timeSinceShot < SHOT_FLASH_DURATION_MS;
  const hitIndicatorActive = timeSinceHit < HIT_INDICATOR_DURATION_MS;
  const crosshairPulse = shotFlashActive ? 1.3 : 1;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        fontFamily: '"VT323", monospace',
        color: "#ffffff",
        zIndex: 1e3
      }
    },
    !isGameOver && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          position: "absolute",
          top: "20px",
          left: "20px",
          fontSize: "20px"
        }
      },
      "Score: ",
      scoreRounded,
      " | ",
      kills,
      " kills"
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          position: "absolute",
          top: "20px",
          right: "20px",
          fontSize: "20px",
          color: "#ffffff"
        }
      },
      "SPEED: ",
      speedMultiplier,
      "x"
    )),
    showInstructions && !isGameOver && /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 24,
          textAlign: "center",
          opacity: showInstructions ? 1 : 0,
          transition: "opacity 0.5s",
          lineHeight: "1.5",
          maxWidth: "90%"
        }
      },
      isMobile ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, "Touch and drag to aim"), /* @__PURE__ */ React.createElement("div", null, "Auto-fires while touching"), /* @__PURE__ */ React.createElement("div", null, "Dodge the asteroids!")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, "Click to lock pointer"), /* @__PURE__ */ React.createElement("div", null, "Hold mouse to auto-fire"), /* @__PURE__ */ React.createElement("div", null, "Dodge the asteroids!"))
    ),
    !isGameOver && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${crosshairPulse})`,
          width: "4px",
          height: "4px",
          backgroundColor: hitIndicatorActive ? "rgba(255,100,100,0.9)" : "rgba(255,255,255,0.9)",
          borderRadius: "50%",
          transition: "transform 0.1s, background-color 0.15s"
        }
      }
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${crosshairPulse})`,
          width: "24px",
          height: "24px",
          border: `2px solid ${hitIndicatorActive ? "rgba(255,100,100,0.7)" : "rgba(255,255,255,0.6)"}`,
          borderRadius: "50%",
          transition: "transform 0.1s, border-color 0.15s"
        }
      }
    )),
    isGameOver && /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center"
        }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            fontSize: "64px",
            fontWeight: "bold",
            marginBottom: "20px"
          }
        },
        "GAME OVER"
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            fontSize: "32px",
            marginBottom: "10px"
          }
        },
        "Score: ",
        scoreRounded
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            fontSize: "32px",
            marginBottom: "40px"
          }
        },
        "Kills: ",
        kills
      ),
      /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: startGame,
          onPointerDown: (e) => {
            e.currentTarget.style.backgroundColor = "#cccccc";
          },
          onPointerLeave: (e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
          },
          onPointerUp: (e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
          },
          style: {
            pointerEvents: "all",
            fontSize: isMobile ? "20px" : "24px",
            padding: isMobile ? "20px 50px" : "15px 40px",
            backgroundColor: "#ffffff",
            color: "#000000",
            border: "none",
            cursor: "pointer",
            fontFamily: '"VT323", monospace',
            fontWeight: "bold",
            touchAction: "manipulation"
          },
          type: "button"
        },
        "RESTART"
      )
    )
  );
};
function hash2D(x, y, seed) {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return value - Math.floor(value);
}
function smoothstep(t) {
  return t * t * (3 - 2 * t);
}
function valueNoise(x, y, seed) {
  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const y0 = Math.floor(y);
  const y1 = y0 + 1;
  const fx = x - x0;
  const fy = y - y0;
  const sx = smoothstep(fx);
  const sy = smoothstep(fy);
  const n00 = hash2D(x0, y0, seed);
  const n10 = hash2D(x1, y0, seed);
  const n01 = hash2D(x0, y1, seed);
  const n11 = hash2D(x1, y1, seed);
  const nx0 = n00 * (1 - sx) + n10 * sx;
  const nx1 = n01 * (1 - sx) + n11 * sx;
  return nx0 * (1 - sy) + nx1 * sy;
}
function createTexture(canvas) {
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}
function generateAsteroidTexture(seed) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return createTexture(canvas);
  }
  ctx.fillStyle = "#c0c0c0";
  ctx.fillRect(0, 0, size, size);
  let randomSeed = seed;
  const seededRandom = () => {
    randomSeed = (randomSeed * 9301 + 49297) % 233280;
    return randomSeed / 233280;
  };
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      let value = 0;
      let amplitude = 1;
      let frequency = 1;
      let maxValue = 0;
      for (let octave = 0; octave < 4; octave++) {
        const nx = x / size * frequency * 4;
        const ny = y / size * frequency * 4;
        const noise = valueNoise(nx, ny, seed + octave * 1e3);
        value += noise * amplitude;
        maxValue += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
      }
      value /= maxValue;
      const base = 160 + value * 80;
      const spotNoise = valueNoise(x * 0.05, y * 0.05, seed + 5e3);
      const darkSpots = spotNoise > 0.7 ? -20 : 0;
      const highlightNoise = valueNoise(x * 0.1, y * 0.1, seed + 6e3);
      const highlights = highlightNoise > 0.8 ? 30 : 0;
      const finalValue = Math.max(
        0,
        Math.min(255, base + darkSpots + highlights)
      );
      data[i] = finalValue;
      data[i + 1] = finalValue;
      data[i + 2] = finalValue;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  const numCraters = 15 + Math.floor(seededRandom() * 25);
  for (let i = 0; i < numCraters; i++) {
    const cx = seededRandom() * size;
    const cy = seededRandom() * size;
    const radius = 5 + seededRandom() * 30;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, "rgba(80, 80, 80, 0.4)");
    gradient.addColorStop(0.5, "rgba(120, 120, 120, 0.2)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 5e3; i++) {
    const x = seededRandom() * size;
    const y = seededRandom() * size;
    const brightness = seededRandom() > 0.5 ? 255 : 0;
    const alpha = seededRandom() * 0.3;
    ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${alpha})`;
    ctx.fillRect(x, y, 1, 1);
  }
  return createTexture(canvas);
}
function generateNormalMap(seed) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return createTexture(canvas);
  }
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  const heightMap = [];
  for (let y = 0; y < size; y++) {
    heightMap[y] = [];
    for (let x = 0; x < size; x++) {
      let height = 0;
      let amplitude = 1;
      let frequency = 1;
      for (let octave = 0; octave < 2; octave++) {
        const nx = x / size * frequency * 8;
        const ny = y / size * frequency * 8;
        const noise = valueNoise(nx, ny, seed + octave * 7e3);
        height += noise * amplitude;
        amplitude *= 0.5;
        frequency *= 2;
      }
      heightMap[y][x] = height;
    }
  }
  const strength = 3;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const hL = heightMap[y][(x - 1 + size) % size];
      const hR = heightMap[y][(x + 1) % size];
      const hU = heightMap[(y - 1 + size) % size][x];
      const hD = heightMap[(y + 1) % size][x];
      const nx = (hL - hR) * strength;
      const ny = (hU - hD) * strength;
      const nz = 1;
      const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
      const normX = nx / length;
      const normY = ny / length;
      const normZ = nz / length;
      data[i] = (normX + 1) * 0.5 * 255;
      data[i + 1] = (normY + 1) * 0.5 * 255;
      data[i + 2] = (normZ + 1) * 0.5 * 255;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return createTexture(canvas);
}
const AsteroidMaterial = ({
  color,
  roughness,
  shapeSeed
}) => {
  const texture = useMemo(
    () => generateAsteroidTexture(shapeSeed),
    [shapeSeed]
  );
  const normalMap = useMemo(() => generateNormalMap(shapeSeed), [shapeSeed]);
  return /* @__PURE__ */ React.createElement(
    "meshStandardMaterial",
    {
      color,
      map: texture,
      metalness: 0.1,
      normalMap,
      normalScale: new Vector2(1.5, 1.5),
      roughness
    }
  );
};
AsteroidMaterial;
class SeededRandom {
  state;
  constructor(seed) {
    this.state = Math.abs(seed) % 4294967296;
  }
  next() {
    this.state = (this.state * 1664525 + 1013904223) % 4294967296;
    return this.state / 4294967296;
  }
}
class Noise3D {
  // Hash function for 3D coordinates
  hash(x, y, z) {
    const n = Math.floor(x) * 374761393 + Math.floor(y) * 668265263 + Math.floor(z) * 2147483647;
    return Math.abs(n) % 1e6;
  }
  // Interpolation function (smoothstep)
  smoothstep(t) {
    return t * t * (3 - 2 * t);
  }
  // Get noise value at 3D position
  noise(x, y, z) {
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
    const n000 = this.hash(x0, y0, z0) / 1e6;
    const n001 = this.hash(x0, y0, z1) / 1e6;
    const n010 = this.hash(x0, y1, z0) / 1e6;
    const n011 = this.hash(x0, y1, z1) / 1e6;
    const n100 = this.hash(x1, y0, z0) / 1e6;
    const n101 = this.hash(x1, y0, z1) / 1e6;
    const n110 = this.hash(x1, y1, z0) / 1e6;
    const n111 = this.hash(x1, y1, z1) / 1e6;
    const nx00 = n000 * (1 - sx) + n100 * sx;
    const nx01 = n001 * (1 - sx) + n101 * sx;
    const nx10 = n010 * (1 - sx) + n110 * sx;
    const nx11 = n011 * (1 - sx) + n111 * sx;
    const nxy0 = nx00 * (1 - sy) + nx10 * sy;
    const nxy1 = nx01 * (1 - sy) + nx11 * sy;
    return nxy0 * (1 - sz) + nxy1 * sz;
  }
  // Multi-octave noise (fractal Brownian motion)
  octaveNoise(x, y, z, octaves) {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;
    for (let i = 0; i < octaves; i++) {
      value += this.noise(x * frequency, y * frequency, z * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }
    return value / maxValue;
  }
}
const AsteroidGeometry = ({
  radius,
  shapeSeed
}) => {
  const geometry = useMemo(() => {
    const rng = new SeededRandom(shapeSeed);
    const noise = new Noise3D();
    const typeRand = rng.next();
    let baseGeometry;
    if (typeRand < 0.6) {
      const detail = 2 + Math.floor(rng.next() * 2);
      baseGeometry = new IcosahedronGeometry(radius, detail);
    } else if (typeRand < 0.85) {
      const detail = 2 + Math.floor(rng.next() * 2);
      baseGeometry = new DodecahedronGeometry(radius, detail);
    } else {
      const detail = 2 + Math.floor(rng.next() * 2);
      baseGeometry = new OctahedronGeometry(radius, detail);
    }
    baseGeometry = mergeVertices(baseGeometry);
    baseGeometry.computeVertexNormals();
    const positionAttribute = baseGeometry.attributes.position;
    const normalAttribute = baseGeometry.attributes.normal;
    const numLargeCraters = Math.floor(4 + rng.next() * 6);
    const numSmallCraters = Math.floor(8 + rng.next() * 12);
    const craters = [];
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
        radius: radius * (0.2 + rng.next() * 0.25),
        // 20-45% of asteroid radius
        depth: radius * (0.12 + rng.next() * 0.15)
        // 12-27% depth
      });
    }
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
        radius: radius * (0.05 + rng.next() * 0.12),
        // 5-17% of asteroid radius (small spots)
        depth: radius * (0.04 + rng.next() * 0.08)
        // 4-12% depth (shallow)
      });
    }
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);
      const nx = normalAttribute.getX(i);
      const ny = normalAttribute.getY(i);
      const nz = normalAttribute.getZ(i);
      const noiseScale = 3;
      const noiseValue = noise.octaveNoise(
        x / radius * noiseScale,
        y / radius * noiseScale,
        z / radius * noiseScale,
        5
      );
      const detailScale = 8;
      const detailNoise = noise.noise(
        x / radius * detailScale,
        y / radius * detailScale,
        z / radius * detailScale
      );
      const combinedNoise = noiseValue * 0.75 + detailNoise * 0.25;
      const noiseDisplacement = (combinedNoise * 2 - 1) * radius * 0.22;
      let craterDisplacement = 0;
      for (const crater of craters) {
        const dx = x - crater.x;
        const dy = y - crater.y;
        const dz = z - crater.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < crater.radius) {
          const falloff = (Math.cos(dist / crater.radius * Math.PI) + 1) * 0.5;
          craterDisplacement -= crater.depth * falloff;
        }
      }
      const totalDisplacement = noiseDisplacement + craterDisplacement;
      positionAttribute.setXYZ(
        i,
        x + nx * totalDisplacement,
        y + ny * totalDisplacement,
        z + nz * totalDisplacement
      );
    }
    positionAttribute.needsUpdate = true;
    baseGeometry.computeVertexNormals();
    return baseGeometry;
  }, [radius, shapeSeed]);
  return /* @__PURE__ */ React.createElement("primitive", { attach: "geometry", object: geometry });
};
AsteroidGeometry;
const AsteroidComponent = ({ asteroid }) => {
  return /* @__PURE__ */ React.createElement(
    "mesh",
    {
      castShadow: true,
      position: asteroid.position,
      rotation: asteroid.rotation,
      userData: { asteroidId: asteroid.id }
    },
    /* @__PURE__ */ React.createElement(
      AsteroidGeometry,
      {
        radius: asteroid.radius,
        shapeSeed: asteroid.shapeSeed
      }
    ),
    /* @__PURE__ */ React.createElement(
      AsteroidMaterial,
      {
        color: asteroid.color,
        roughness: asteroid.roughness,
        shapeSeed: asteroid.shapeSeed
      }
    )
  );
};
const Asteroid = memo(AsteroidComponent, (prev, next) => {
  return prev.asteroid === next.asteroid;
});
const EXPLOSION_DURATION_MS = 600;
const FRAGMENT_COUNT = 12;
const FRAGMENT_SPEED_MIN = 5;
const FRAGMENT_SPEED_MAX = 13;
const FRAGMENT_SCALE_MIN = 0.2;
const FRAGMENT_SCALE_MAX = 0.5;
const FRAGMENT_VELOCITY_DECAY = 0.95;
const Explosions = () => {
  const { explosions, setExplosions } = useGame();
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
  return /* @__PURE__ */ React.createElement(React.Fragment, null, explosions.map((explosion) => /* @__PURE__ */ React.createElement(ExplosionEffect, { explosion, key: explosion.id })));
};
const ExplosionEffect = ({ explosion }) => {
  const fragments = useMemo(() => {
    const frags = [];
    for (let i = 0; i < FRAGMENT_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = FRAGMENT_SPEED_MIN + Math.random() * (FRAGMENT_SPEED_MAX - FRAGMENT_SPEED_MIN);
      const vx = Math.sin(phi) * Math.cos(theta) * speed;
      const vy = Math.sin(phi) * Math.sin(theta) * speed;
      const vz = Math.cos(phi) * speed;
      frags.push({
        id: `${explosion.id}-${i}`,
        position: [...explosion.position],
        velocity: [vx, vy, vz],
        rotation: [
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ],
        rotationSpeed: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ],
        scale: FRAGMENT_SCALE_MIN + Math.random() * (FRAGMENT_SCALE_MAX - FRAGMENT_SCALE_MIN)
      });
    }
    return frags;
  }, [explosion]);
  useFrame((_, delta) => {
    for (const frag of fragments) {
      frag.position[0] += frag.velocity[0] * delta;
      frag.position[1] += frag.velocity[1] * delta;
      frag.position[2] += frag.velocity[2] * delta;
      frag.rotation[0] += frag.rotationSpeed[0] * delta;
      frag.rotation[1] += frag.rotationSpeed[1] * delta;
      frag.rotation[2] += frag.rotationSpeed[2] * delta;
      frag.velocity[0] *= FRAGMENT_VELOCITY_DECAY;
      frag.velocity[1] *= FRAGMENT_VELOCITY_DECAY;
      frag.velocity[2] *= FRAGMENT_VELOCITY_DECAY;
    }
  });
  const now = Date.now();
  const age = now - explosion.startTime;
  const opacity = Math.max(0, 1 - age / EXPLOSION_DURATION_MS);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, fragments.map((frag) => /* @__PURE__ */ React.createElement(
    "mesh",
    {
      key: frag.id,
      position: frag.position,
      rotation: frag.rotation,
      scale: frag.scale
    },
    /* @__PURE__ */ React.createElement("boxGeometry", { args: [1, 1, 1] }),
    /* @__PURE__ */ React.createElement(
      "meshStandardMaterial",
      {
        color: "#ffffff",
        metalness: 0.2,
        opacity,
        roughness: 0.5,
        transparent: true
      }
    )
  )));
};
const MAX_ASTEROIDS = 30;
const SPAWN_INTERVAL_START = 1.2;
const SPAWN_INTERVAL_MIN = 0.3;
const SPAWN_DISTANCE_MIN = 60;
const SPAWN_DISTANCE_MAX = 150;
const REMOVE_DISTANCE = 200;
const MIN_SPAWN_SAFETY = 15;
const SPAWN_RATE_SCALE = 2e3;
const VELOCITY_SCALE = 500;
function createAsteroidProperties(id, score = 0) {
  const dirX = (Math.random() - 0.5) * 2;
  const dirY = (Math.random() - 0.5) * 2;
  const dirZ = (Math.random() - 0.5) * 2;
  const length = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
  const baseMaxVelocity = 10;
  const velocityBonus = Math.max(0, score) / VELOCITY_SCALE;
  const maxVelocity = baseMaxVelocity + velocityBonus;
  const speed = 0.5 + Math.random() * maxVelocity;
  const velocityX = dirX / length * speed;
  const velocityY = dirY / length * speed;
  const velocityZ = dirZ / length * speed;
  const radius = 2 + Math.random() * 6;
  const gray = Math.floor(Math.random() * 10 + 245).toString(16).padStart(2, "0");
  const roughness = Math.random() * 0.4 + 0.3;
  return {
    id,
    radius,
    color: `#${gray}${gray}${gray}`,
    roughness,
    velocity: [velocityX, velocityY, velocityZ],
    rotation: [
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    ],
    rotationSpeed: [
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5
    ],
    shapeSeed: Math.random() * 1e4
  };
}
function Scene() {
  const { camera } = useThree();
  const { asteroids, setAsteroids, isPlaying, isGameOver, score } = useGame();
  const nextIdRef = useRef(0);
  const spawnAccumulator = useRef(0);
  const asteroidsRef = useRef([]);
  const initializedRef = useRef(false);
  const starGeometry = useMemo(() => {
    const starCount = 200;
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 100;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      sizes[i] = 0.5 + Math.random() * 0.5;
    }
    return { positions, sizes };
  }, []);
  const starsRef = useRef(null);
  useEffect(() => {
    if ((!isPlaying || isGameOver) && initializedRef.current) {
      initializedRef.current = false;
      asteroidsRef.current = [];
      setAsteroids([]);
      return;
    }
    if (!isPlaying || isGameOver || initializedRef.current) {
      return;
    }
    nextIdRef.current = 0;
    spawnAccumulator.current = 0;
    initializedRef.current = true;
    const initialAsteroids = [];
    const numInitial = 10;
    const startPos = camera.position;
    for (let i = 0; i < numInitial; i++) {
      const spreadX = (Math.random() - 0.5) * 80;
      const spreadY = (Math.random() - 0.5) * 60;
      const distance = SPAWN_DISTANCE_MIN + Math.random() * (SPAWN_DISTANCE_MAX - SPAWN_DISTANCE_MIN);
      const x = startPos.x + spreadX;
      const y = startPos.y + spreadY;
      const z = startPos.z - distance;
      const dx = x - startPos.x;
      const dy = y - startPos.y;
      const dz = z - startPos.z;
      const distFromCamera = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (distFromCamera < MIN_SPAWN_SAFETY) {
        i--;
        continue;
      }
      initialAsteroids.push({
        ...createAsteroidProperties(nextIdRef.current++, 0),
        // Start at score 0
        position: [x, y, z]
      });
    }
    asteroidsRef.current = initialAsteroids;
    setAsteroids(initialAsteroids);
  }, [isPlaying, isGameOver, setAsteroids, camera]);
  useEffect(() => {
    const stateIds = new Set(asteroids.map((a) => a.id));
    const refIds = new Set(asteroidsRef.current.map((a) => a.id));
    const removed = Array.from(refIds).filter((id) => !stateIds.has(id));
    if (removed.length > 0) {
      asteroidsRef.current = asteroidsRef.current.filter(
        (a) => stateIds.has(a.id)
      );
    }
  }, [asteroids]);
  useFrame((_, delta) => {
    if (!(isPlaying && initializedRef.current)) {
      return;
    }
    let needsStateUpdate = false;
    const currentCameraPos = camera.position;
    asteroidsRef.current = asteroidsRef.current.map((asteroid) => ({
      ...asteroid,
      position: [
        asteroid.position[0] + asteroid.velocity[0] * delta,
        asteroid.position[1] + asteroid.velocity[1] * delta,
        asteroid.position[2] + asteroid.velocity[2] * delta
      ],
      rotation: [
        asteroid.rotation[0] + asteroid.rotationSpeed[0] * delta,
        asteroid.rotation[1] + asteroid.rotationSpeed[1] * delta,
        asteroid.rotation[2] + asteroid.rotationSpeed[2] * delta
      ]
    }));
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
    const currentSpawnInterval = Math.max(
      SPAWN_INTERVAL_MIN,
      SPAWN_INTERVAL_START - Math.max(0, score) / SPAWN_RATE_SCALE
    );
    spawnAccumulator.current += delta;
    if (spawnAccumulator.current >= currentSpawnInterval && asteroidsRef.current.length < MAX_ASTEROIDS) {
      spawnAccumulator.current = 0;
      needsStateUpdate = true;
      const numToSpawn = Math.min(
        Math.floor(Math.random() * 2) + 1,
        MAX_ASTEROIDS - asteroidsRef.current.length
      );
      for (let i = 0; i < numToSpawn; i++) {
        const spreadX = (Math.random() - 0.5) * 100;
        const spreadY = (Math.random() - 0.5) * 80;
        const distance = SPAWN_DISTANCE_MIN + Math.random() * (SPAWN_DISTANCE_MAX - SPAWN_DISTANCE_MIN);
        const x = currentCameraPos.x + spreadX;
        const y = currentCameraPos.y + spreadY;
        const z = currentCameraPos.z - distance;
        const dx = x - currentCameraPos.x;
        const dy = y - currentCameraPos.y;
        const dz = z - currentCameraPos.z;
        const distFromCamera = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (distFromCamera < MIN_SPAWN_SAFETY) {
          i--;
          continue;
        }
        asteroidsRef.current.push({
          ...createAsteroidProperties(nextIdRef.current++, score),
          position: [x, y, z]
        });
      }
    }
    if (needsStateUpdate) {
      setAsteroids([...asteroidsRef.current]);
    }
    if (starsRef.current) {
      starsRef.current.position.copy(camera.position);
    }
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("points", { ref: starsRef }, /* @__PURE__ */ React.createElement("bufferGeometry", null, /* @__PURE__ */ React.createElement(
    "bufferAttribute",
    {
      args: [starGeometry.positions, 3],
      attach: "attributes-position"
    }
  ), /* @__PURE__ */ React.createElement(
    "bufferAttribute",
    {
      args: [starGeometry.sizes, 1],
      attach: "attributes-size"
    }
  )), /* @__PURE__ */ React.createElement(
    "pointsMaterial",
    {
      color: "#ffffff",
      size: 1.5,
      sizeAttenuation: false,
      transparent: false
    }
  )), asteroidsRef.current.map((asteroid) => /* @__PURE__ */ React.createElement(Asteroid, { asteroid, key: asteroid.id })), /* @__PURE__ */ React.createElement(Explosions, null));
}
function DitherBlock() {
  return /* @__PURE__ */ React.createElement(GameProvider, null, /* @__PURE__ */ React.createElement(UI, null), /* @__PURE__ */ React.createElement(
    Canvas,
    {
      camera: {
        position: INITIAL_CAMERA_POSITION,
        fov: 75,
        near: 0.1,
        far: 500
      },
      dpr: [1, 2]
    },
    /* @__PURE__ */ React.createElement("ambientLight", { intensity: 1 }),
    /* @__PURE__ */ React.createElement(
      "directionalLight",
      {
        castShadow: true,
        intensity: 1.5,
        position: [100, 200, -300]
      }
    ),
    /* @__PURE__ */ React.createElement("directionalLight", { intensity: 1.2, position: [-100, 100, 200] }),
    /* @__PURE__ */ React.createElement("directionalLight", { intensity: 1, position: [100, -100, 100] }),
    /* @__PURE__ */ React.createElement("directionalLight", { intensity: 1, position: [0, 100, 300] }),
    /* @__PURE__ */ React.createElement("directionalLight", { intensity: 0.8, position: [-150, 0, -100] }),
    /* @__PURE__ */ React.createElement(Scene, null),
    /* @__PURE__ */ React.createElement(CameraControls, null),
    /* @__PURE__ */ React.createElement(GameControls, null),
    /* @__PURE__ */ React.createElement(Effects, { patternScale: 12, threshold: 0.5 })
  ));
}
function App() {
  return /* @__PURE__ */ React.createElement(DitherBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
