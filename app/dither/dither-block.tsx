"use client";

import { Canvas } from "@react-three/fiber";
import Scene from "./scene";
import Effects from "./components/effects";
import { GameProvider, INITIAL_CAMERA_POSITION } from "./game";
import { GameControls } from "./components/game-controls";
import { CameraControls } from "./components/camera-controls";
import { UI } from "./components/ui";

export function DitherBlock() {
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
          position={[100, 200, -300]}
          intensity={1.5}
          castShadow
        />

        {/* Fill lights from multiple angles */}
        <directionalLight position={[-100, 100, 200]} intensity={1.2} />
        <directionalLight position={[100, -100, 100]} intensity={1.0} />
        <directionalLight position={[0, 100, 300]} intensity={1.0} />
        <directionalLight position={[-150, 0, -100]} intensity={0.8} />

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
