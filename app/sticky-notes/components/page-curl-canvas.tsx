"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { CurlingNoteMesh } from "./curling-note-mesh";
import type { Vec2, AnimationState } from "../store";

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

export function PageCurlCanvas({
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
  if (!isActive || !texture) return null;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: noteSize,
        height: noteSize,
        zIndex: 100,
      }}
    >
      <Canvas
        orthographic
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
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
      >
        <CurlingNoteMesh
          texture={texture}
          clickPos={clickPos}
          dragPos={dragPos}
          baseColor={baseColor}
          animationState={animationState}
          targetProgress={targetProgress}
          onAnimationComplete={onAnimationComplete}
        />
      </Canvas>
    </div>
  );
}
