import { useMemo } from "react";
import * as THREE from "three";

interface AsteroidMaterialProps {
  color: string;
  roughness: number;
  shapeSeed: number;
}

// Better hash function to avoid stripes
function hash2D(x: number, y: number, seed: number): number {
  // Use bitwise operations for better randomization
  let h = seed + x * 374_761_393 + y * 668_265_263;
  h = (h ^ (h >>> 13)) * 1_274_126_177;
  h ^= h >>> 16;
  return (h >>> 0) / 4_294_967_296; // Normalize to 0-1
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
function generateAsteroidTexture(seed: number): THREE.Texture {
  const size = 128; // Reduced from 512 for better performance (16x faster)
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

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

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;

  return texture;
}

// Generate normal map for surface detail
function generateNormalMap(seed: number): THREE.Texture {
  const size = 128; // Reduced from 512 for better performance
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

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

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;

  return texture;
}

export const AsteroidMaterial = ({
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
      normalScale={new THREE.Vector2(1.5, 1.5)}
      roughness={roughness}
    />
  );
};

export default AsteroidMaterial;
