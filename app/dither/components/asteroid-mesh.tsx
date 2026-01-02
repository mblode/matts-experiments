import { useMemo } from "react";
import {
  type BufferGeometry,
  DodecahedronGeometry,
  IcosahedronGeometry,
  OctahedronGeometry,
} from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

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

export const AsteroidGeometry = ({
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

export default AsteroidGeometry;
