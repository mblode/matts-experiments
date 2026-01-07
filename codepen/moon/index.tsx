// CodePen packages: @react-three/drei@^10.7.7, @react-three/fiber@^9.5.0, astronomy-engine@^2.1.19, react-dom@19.2.3, react@19.2.3, three@^0.182.0, zustand@^5.0.9

import * as React from "react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { create } from "zustand";
import { Body, EclipticLongitude, Equator, GeoVector, Illumination, Libration, MakeTime, Observer, RotationAxis, SiderealTime, type Vector } from "astronomy-engine";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { BasicShadowMap, ClampToEdgeWrapping, FrontSide, LinearFilter, LinearMipmapLinearFilter, RGBAFormat, RepeatWrapping, TextureLoader, Vector2, type DirectionalLight, type Group, type Mesh, type Texture } from "three";
import { createRoot } from "react-dom/client";

const cacheLife = () => {};

/**
 * Server action for reverse geocoding with caching.
 * Cached for days since location names rarely change.
 */
export async function getCachedLocationName(
  lat: number,
  lon: number
): Promise<string> {

  cacheLife("days");

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      {
        headers: {
          "User-Agent": "Moon Demo App",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.address) {
      const { city, town, village, county, state, country } = data.address;
      const place = city || town || village || county;
      const region = state || country;
      if (place && region) {
        return `${place}, ${region}`;
      }
      if (place) {
        return place;
      }
      if (region) {
        return region;
      }
    }
    return `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
  } catch (err) {
    console.warn("Geocoding failed:", err);
    return `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
  }
}

interface Inputs {
  date: Date;
  lat: number;
  lon: number;
  elev?: number;
}

interface MoonSolution {
  // Direction to place the directional light in THREE coordinates (unit vector)
  sunDir: [number, number, number];

  // illumination fraction 0..1 (from astronomy-engine)
  illumFraction: number;

  // phase angle (Sun-Moon-Earth) in degrees
  phaseAngleDeg: number;

  // distance Moon -> observer in km
  distanceKm: number;

  // parallactic angle (radians) — useful for other calculations
  parallacticAngleRad: number;

  // right ascension (hours) and declination (degrees) of the Moon (equatorial)
  ra: number; // hours
  dec: number; // degrees

  // human readable phase
  phaseName: string;
  phaseEmoji: string;

  // bright limb position angle (radians) measured east of celestial north
  // rotate the sphere by -brightLimbAngleRad in three.js to align the illuminated limb
  brightLimbAngleRad: number;

  // position angle of Moon's north pole (radians)
  poleAngleRad: number;

  // selenographic libration for orientation
  mlat: number; // degrees
  mlon: number; // degrees
}

/* --- Helpers --- */
function _norm([x, y, z]: [number, number, number]): [number, number, number] {
  const m = Math.hypot(x, y, z) || 1;
  return [x / m, y / m, z / m];
}
function toTuple(v: Vector): [number, number, number] {
  return [v.x, v.y, v.z];
}
function dot(a: [number, number, number], b: [number, number, number]) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(a: [number, number, number], b: [number, number, number]) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ] as [number, number, number];
}
function normalizeVec(a: [number, number, number]) {
  const m = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / m, a[1] / m, a[2] / m] as [number, number, number];
}

function equatorialToVector(
  ra_hours: number,
  dec_deg: number
): [number, number, number] {
  const ra_rad = (ra_hours * Math.PI) / 12;
  const dec_rad = (dec_deg * Math.PI) / 180;
  const cos_dec = Math.cos(dec_rad);
  return [
    cos_dec * Math.cos(ra_rad),
    cos_dec * Math.sin(ra_rad),
    Math.sin(dec_rad),
  ];
}

const AU_KM = 149_597_870.7;
const SYNODIC_MONTH_DAYS = 29.530_588_853;
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const KNOWN_NEW_MOON = new Date("2000-01-06T18:14:00.000Z");

const getValidDate = (date: Date) => {
  if (!date || Number.isNaN(date.getTime())) {
    return new Date();
  }
  return date;
};

const getCyclePosition = (date: Date) => {
  const daysSinceRef = (date.getTime() - KNOWN_NEW_MOON.getTime()) / MS_PER_DAY;
  return (
    ((daysSinceRef % SYNODIC_MONTH_DAYS) + SYNODIC_MONTH_DAYS) %
    SYNODIC_MONTH_DAYS
  );
};

const projectOntoPlane = (
  vector: [number, number, number],
  normal: [number, number, number]
) =>
  normalizeVec([
    vector[0] - dot(vector, normal) * normal[0],
    vector[1] - dot(vector, normal) * normal[1],
    vector[2] - dot(vector, normal) * normal[2],
  ]);

const getDiskAxes = (uM: [number, number, number]) => {
  const north: [number, number, number] = [0, 0, 1];
  const n = projectOntoPlane(north, uM);
  const east = normalizeVec(cross(uM, n));
  return { n, east };
};

const getMoonEquatorialData = (
  time: ReturnType<typeof MakeTime>,
  obs: Observer
) => {
  const moonEquatorial = Equator(Body.Moon, time, obs, true, true);
  const ra = moonEquatorial.ra;
  const dec = moonEquatorial.dec;
  const distanceKm = (moonEquatorial.dist ?? 0) * AU_KM;
  return { ra, dec, distanceKm };
};

const getLibrationAngles = (time: ReturnType<typeof MakeTime>) => {
  const lib = Libration(time);
  return { mlat: lib.mlat, mlon: lib.mlon };
};

const getParallacticAngle = (
  time: ReturnType<typeof MakeTime>,
  lat: number,
  lon: number,
  ra: number,
  dec: number
) => {
  const gst = SiderealTime(time);
  const lst = (((gst + lon / 15) % 24) + 24) % 24;
  const H = ((((lst - ra) % 24) + 24) % 24) * (Math.PI / 12.0);
  const phi = (lat * Math.PI) / 180.0;
  const decRad = (dec * Math.PI) / 180.0;
  const sinH = Math.sin(H);
  const cosH = Math.cos(H);
  const tanPhi = Math.tan(phi);
  const cosDec = Math.cos(decRad);
  const sinDec = Math.sin(decRad);
  const denom = tanPhi * cosDec - sinDec * cosH;
  return Math.atan2(sinH, denom);
};

const getBrightLimbAngle = (
  uM: [number, number, number],
  uS: [number, number, number],
  n: [number, number, number],
  east: [number, number, number]
) => {
  const v = projectOntoPlane(uS, uM);
  return Math.atan2(dot(east, v), dot(n, v));
};

const getPoleAngle = (
  time: ReturnType<typeof MakeTime>,
  uM: [number, number, number],
  n: [number, number, number],
  east: [number, number, number]
) => {
  const axis = RotationAxis(Body.Moon, time);
  const uP = equatorialToVector(axis.ra, axis.dec);
  const p = projectOntoPlane(uP, uM);
  return Math.atan2(dot(east, p), dot(n, p));
};

const getWaxingStatus = (time: ReturnType<typeof MakeTime>, date: Date) => {
  try {
    const moonEclLon = EclipticLongitude(Body.Moon, time);
    const sunEclLon = EclipticLongitude(Body.Sun, time);
    let elongationDeg = moonEclLon - sunEclLon;
    elongationDeg = ((elongationDeg % 360) + 360) % 360;
    const moonAgeDays = (elongationDeg / 360) * SYNODIC_MONTH_DAYS;
    return moonAgeDays <= SYNODIC_MONTH_DAYS / 2;
  } catch (_error) {
    const cyclePosition = getCyclePosition(date);
    return cyclePosition <= SYNODIC_MONTH_DAYS / 2;
  }
};

const getSunDirection = (date: Date): [number, number, number] => {
  const cyclePosition = getCyclePosition(date);
  let elongationDeg = (cyclePosition / SYNODIC_MONTH_DAYS) * 360;
  elongationDeg = ((elongationDeg % 360) + 360) % 360;
  const elongationRad = (elongationDeg * Math.PI) / 180;
  return [Math.cos(elongationRad), 0, Math.sin(elongationRad)];
};

type PhaseType = "new" | "full" | "quarter" | "crescent" | "gibbous";
type Hemisphere = "north" | "south";
type WaxingKey = "waxing" | "waning";

const getPhaseType = (illumFraction: number): PhaseType => {
  if (illumFraction < 0.01) {
    return "new";
  }
  if (illumFraction > 0.99) {
    return "full";
  }
  if (Math.abs(illumFraction - 0.5) < 0.05) {
    return "quarter";
  }
  if (illumFraction < 0.5) {
    return "crescent";
  }
  return "gibbous";
};

const PHASE_NAMES: Record<
  Exclude<PhaseType, "new" | "full">,
  Record<WaxingKey, string>
> = {
  quarter: { waxing: "First Quarter", waning: "Last Quarter" },
  crescent: { waxing: "Waxing Crescent", waning: "Waning Crescent" },
  gibbous: { waxing: "Waxing Gibbous", waning: "Waning Gibbous" },
};

const PHASE_EMOJI: Record<
  Exclude<PhaseType, "new" | "full">,
  Record<Hemisphere, Record<WaxingKey, string>>
> = {
  quarter: {
    north: { waxing: "🌓", waning: "🌗" },
    south: { waxing: "🌗", waning: "🌓" },
  },
  crescent: {
    north: { waxing: "🌒", waning: "🌘" },
    south: { waxing: "🌘", waning: "🌒" },
  },
  gibbous: {
    north: { waxing: "🌔", waning: "🌖" },
    south: { waxing: "🌖", waning: "🌔" },
  },
};

const getPhaseLabel = (
  illumFraction: number,
  isWaxing: boolean,
  latitude: number
) => {
  const phaseType = getPhaseType(illumFraction);
  if (phaseType === "new") {
    return { phaseName: "New Moon", phaseEmoji: "🌑" };
  }
  if (phaseType === "full") {
    return { phaseName: "Full Moon", phaseEmoji: "🌕" };
  }
  const hemisphere: Hemisphere = latitude < 0 ? "south" : "north";
  const waxingKey: WaxingKey = isWaxing ? "waxing" : "waning";
  return {
    phaseName: PHASE_NAMES[phaseType][waxingKey],
    phaseEmoji: PHASE_EMOJI[phaseType][hemisphere][waxingKey],
  };
};

/**
 * MOON PHASE PHYSICS AND CALCULATION EXPLANATION
 * =============================================
 *
 * FUNDAMENTAL PRINCIPLES:
 * 1. The Moon is TIDALLY LOCKED - it rotates exactly once per orbit (27.3 days)
 *    so the same side always faces Earth
 * 2. Moon phases result from changing Sun-Moon-Earth GEOMETRY, not moon rotation
 * 3. The Sun always illuminates half the Moon; phases show how much of that
 *    illuminated half is visible from Earth
 * 4. New Moon: Moon between Earth-Sun (dark side toward us)
 *    Full Moon: Earth between Moon-Sun (bright side toward us)
 *
 * ASTRONOMY ENGINE APPROACH:
 * - Calculate precise Sun and Moon positions in 3D space
 * - Determine lighting direction (Moon → Sun vector)
 * - Compute apparent orientation as seen from observer location
 * - Apply libration effects (small wobbles) for realism
 *
 * This function returns vectors and angles needed to render accurate moon phases
 * in Three.js, keeping moon tidally locked while varying sun direction.
 */
function solveMoon(i: Inputs): MoonSolution {
  const validDate = getValidDate(i.date);
  const time = MakeTime(validDate);
  const obs = new Observer(i.lat, i.lon, i.elev ?? 0);

  const illum = Illumination(Body.Moon, time);
  const illumFraction = illum.phase_fraction;
  const phaseAngleDeg = illum.phase_angle;

  const { ra, dec, distanceKm } = getMoonEquatorialData(time, obs);
  const { mlat, mlon } = getLibrationAngles(time);
  const parallacticAngleRad = getParallacticAngle(time, i.lat, i.lon, ra, dec);

  const uM = equatorialToVector(ra, dec);
  const uS = normalizeVec(toTuple(GeoVector(Body.Sun, time, true)));
  const { n, east } = getDiskAxes(uM);
  const brightLimbAngleRad = getBrightLimbAngle(uM, uS, n, east);
  const poleAngleRad = getPoleAngle(time, uM, n, east);
  const isWaxing = getWaxingStatus(time, validDate);
  const sunDir = getSunDirection(validDate);
  const { phaseName, phaseEmoji } = getPhaseLabel(
    illumFraction,
    isWaxing,
    i.lat
  );

  return {
    sunDir,
    illumFraction,
    phaseAngleDeg,
    distanceKm,
    parallacticAngleRad,
    ra,
    dec,
    phaseName,
    phaseEmoji,
    brightLimbAngleRad,
    poleAngleRad,
    mlat,
    mlon,
  };
}

/**
 * Reverse geocode helper (legacy - not cached).
 * @deprecated Use getCachedLocationName from ./actions.ts instead for cached geocoding.
 * This function remains for backward compatibility but is not optimized with cache.
 */
export async function getLocationName(
  lat: number,
  lon: number
): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
    );
    const data = await response.json();
    if (data.address) {
      const { city, town, village, county, state, country } = data.address;
      const place = city || town || village || county;
      const region = state || country;
      if (place && region) {
        return `${place}, ${region}`;
      }
      if (place) {
        return place;
      }
      if (region) {
        return region;
      }
    }
    return `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
  } catch (err) {
    console.warn("Geocoding failed:", err);
    return `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
  }
}

interface Props {
  inputs: Inputs;
  // optional speed multiplier for auto-scrub playback (days per second)
  speed?: number;
  textures: {
    color: string;
    normal: string;
    roughness: string;
    displacement: string;
  };
}

function MoonMesh(props: Props) {
  const { inputs, textures, speed = 0 } = props;
  const { gl } = useThree(); // Get renderer for anisotropy settings
  const group = useRef<Group>(null);
  const light = useRef<DirectionalLight>(null);
  const moon = useRef<Mesh>(null);

  const colorMap = useMemo(
    () => new TextureLoader().load(textures.color),
    [textures.color]
  );
  const normalMap = useMemo(
    () => new TextureLoader().load(textures.normal),
    [textures.normal]
  );
  const roughnessMap = useMemo(
    () => new TextureLoader().load(textures.roughness),
    [textures.roughness]
  );
  const displacementMap = useMemo(
    () => new TextureLoader().load(textures.displacement),
    [textures.displacement]
  );

  // Configure NASA LRO textures for optimal lunar surface rendering
  useMemo(() => {
    const configureLunarTexture = (texture: Texture, isNormalMap = false) => {
      // NASA LRO textures are in equirectangular projection
      texture.wrapS = RepeatWrapping;
      texture.wrapT = ClampToEdgeWrapping;

      // Proper texture orientation for lunar coordinate system
      texture.flipY = true;
      texture.offset.set(0.47, 0); // Offset X to show more textured lunar terrain
      texture.repeat.set(1, 1);

      // High-quality filtering for detailed lunar surface
      texture.anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy());
      texture.magFilter = LinearFilter;
      texture.minFilter = LinearMipmapLinearFilter;

      // Generate mipmaps for better performance
      texture.generateMipmaps = true;

      // Normal map specific settings
      if (isNormalMap) {
        texture.format = RGBAFormat;
      }
    };

    configureLunarTexture(colorMap);
    configureLunarTexture(normalMap, true);
    configureLunarTexture(roughnessMap);
    configureLunarTexture(displacementMap);
  }, [
    colorMap,
    normalMap,
    roughnessMap,
    displacementMap,
    gl.capabilities.getMaxAnisotropy,
  ]);

  // Recompute astronomy solution when inputs change
  const sol = useMemo(() => solveMoon(inputs), [inputs]);

  const timeRef = useRef(inputs.date.getTime());

  // TIDAL LOCKING: Moon orientation stays COMPLETELY FIXED
  useEffect(() => {
    if (!group.current) {
      return;
    }

    // FUNDAMENTAL PHYSICS: The Moon is tidally locked to Earth
    // - Same side always faces Earth (synchronous rotation = orbital period)
    // - Moon does NOT rotate to create phases - phases come from lighting geometry ONLY
    // - Moon orientation must stay fixed as dates change

    // Set FIXED orientation once and never change it
    group.current.rotation.set(0, 1.8, 0);

    // Only texture coordinate correction (flip Y to match lunar coordinate system)
    group.current.rotateX(Math.PI);

    // NO MORE ROTATIONS - moon stays tidally locked
    // Phases are created by sun direction changes only
  }, []); // Empty dependency array - this only runs once

  // PHASE CREATION: Change sun direction to simulate orbital motion
  useFrame((_state, delta) => {
    let currentSol = sol;

    // Time progression for animation
    if (speed) {
      timeRef.current += delta * speed * 86_400_000; // advance time by speed days per second
      const animDate = new Date(timeRef.current);
      currentSol = solveMoon({ ...inputs, date: animDate });
    }

    if (!light.current) {
      return;
    }

    // MOON PHASE PHYSICS: Phases result from changing Sun-Moon-Earth geometry
    // As the Moon orbits Earth, the Sun appears to move relative to the Moon-Earth system
    // This creates different illumination patterns (phases) visible from Earth
    //
    // KEY INSIGHT: Moon stays tidally locked, sun direction changes with orbital motion
    // - New Moon: Sun direction from "behind" moon (between Earth-Sun)
    // - Full Moon: Sun direction from "in front" (Earth between Moon-Sun)
    // - Quarter phases: Sun direction from the "side"

    const [x, y, z] = currentSol.sunDir;
    const lightDistance = 100;

    // DEBUG: Log sun direction to verify it's rotating over orbital cycle
    if (Math.random() < 0.03) {
      // Log occasionally to avoid spam
      const angle = (Math.atan2(z, x) * 180) / Math.PI; // Angle in XZ plane
      console.log("🌙 Moon Phase Debug:", {
        sunDir: `[${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}]`,
        sunAngle: `${angle.toFixed(1)}°`,
        phase: currentSol.phaseName,
        illum: `${(currentSol.illumFraction * 100).toFixed(1)}%`,
        phaseAngle: `${currentSol.phaseAngleDeg.toFixed(1)}°`,
      });
    }

    // Position directional light to simulate sun's position relative to Moon-Earth system
    // The sunDir vector represents where the Sun appears from the Moon's perspective
    light.current.position.set(
      x * lightDistance,
      y * lightDistance,
      z * lightDistance
    );

    // Ensure light targets moon center for accurate directional illumination
    light.current.target.position.set(0, 0, 0);
    light.current.target.updateMatrixWorld();

    // Update shadow mapping for realistic terminator line
    light.current.shadow.camera.updateProjectionMatrix();
  });

  return (
    <group ref={group}>
      <mesh receiveShadow ref={moon}>
        <sphereGeometry args={[1, 256, 256]} />
        <meshPhysicalMaterial
          // NASA LRO Surface Textures
          clearcoat={0.0} // Anorthositic crust albedo
          displacementBias={0.0} // Surface normal details
          displacementMap={displacementMap} // Enhanced normal mapping for better surface detail
          displacementScale={0.012} // Surface roughness variation
          // Lunar Surface Material Properties
          map={colorMap} // Moon surface is very rough/dusty
          metalness={0.0} // Lunar regolith is non-metallic
          normalMap={normalMap} // No clear coating
          // Displacement for surface height variation
          normalScale={new Vector2(1.2, 1.2)} // LRO LOLA elevation data
          reflectivity={0.12} // More pronounced height variation
          roughness={0.9}
          // Enhanced lunar surface reflectance for better visibility
          roughnessMap={roughnessMap}
          side={FrontSide} // Very low - lunar regolith is matte/dusty
          specularIntensity={0.02}
          transparent={false}
        />
      </mesh>

      {/* LUNAR LIGHTING: Harsh shadows due to no atmosphere */}

      <ambientLight intensity={0.1} />

      {/* Sun light - creates harsh, well-defined shadows like on the Moon */}
      <directionalLight
        castShadow={true}
        intensity={3} // Extreme sun intensity for maximum contrast
        ref={light}
        shadow-bias={0} // Ultra high resolution for razor-sharp shadows
        shadow-camera-bottom={-1.5}
        shadow-camera-far={200}
        shadow-camera-left={-1.5}
        shadow-camera-near={0.01}
        shadow-camera-right={1.5}
        shadow-camera-top={1.5}
        shadow-mapSize-height={8192}
        shadow-mapSize-width={8192} // No shadow softening - harsh edges
        shadow-normalBias={0} // No bias - raw, unfiltered shadows
        shadow-radius={0}
      />
    </group>
  );
}

const MoonScene = (props: Props) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.0], fov: 35, zoom: 0.5 }}
      gl={{
        antialias: true,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = BasicShadowMap; // Raw pixelated shadows - zero filtering
        gl.shadowMap.autoUpdate = true;
        // Disable any WebGL shadow filtering
        gl.shadowMap.needsUpdate = true;
      }} // Enable shadow rendering
      shadows
      style={{ width: "100%", height: "100vh" }}
    >
      <color args={["#05060a"]} attach="background" />
      <Suspense fallback={null}>
        <MoonMesh {...props} />
      </Suspense>
      <OrbitControls enablePan={false} enableRotate={true} enableZoom={true} />
    </Canvas>
  );
};

interface Store {
  lat: number;
  lon: number;
  datetimeLocal: string;
  speed: number;
  locationStatus:
    | "unknown"
    | "requesting"
    | "granted"
    | "denied"
    | "unavailable";
  locationName: string;
  set: (p: Partial<Store>) => void;
}

const nowLocalISO = () => {
  const d = new Date();
  // round to minute
  d.setSeconds(0, 0);
  const _tz = -d.getTimezoneOffset();
  const pad = (n: number) => String(n).padStart(2, "0");
  const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return iso;
};

const useStore = create<Store>((set) => ({
  lat: -37.8136, // Melbourne default
  lon: 144.9631,
  datetimeLocal: nowLocalISO(),
  speed: 0,
  locationStatus: "unknown",
  locationName: "Melbourne, Victoria",
  set,
}));

const MoonBlock = () => {
  const {
    lat,
    lon,
    datetimeLocal,
    speed: _speed,
    locationStatus,
    locationName,
    set,
  } = useStore();
  const [scrubIncrement, setScrubIncrement] = useState(0); // In 2-hour increments

  // Request geolocation on component mount
  useEffect(() => {
    if (locationStatus !== "unknown") {
      return;
    }

    if (!navigator.geolocation) {
      set({ locationStatus: "unavailable" });
      return;
    }

    set({ locationStatus: "requesting" });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLat = position.coords.latitude;
        const newLon = position.coords.longitude;

        // Get location name (cached server action)
        const name = await getCachedLocationName(newLat, newLon);

        set({
          lat: newLat,
          lon: newLon,
          locationStatus: "granted",
          locationName: name,
        });
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
        set({ locationStatus: "denied" });
      },
      {
        enableHighAccuracy: false,
        timeout: 10_000,
        maximumAge: 300_000, // 5 minutes
      }
    );
  }, [locationStatus, set]);

  const _requestLocation = () => {
    set({ locationStatus: "unknown" });
  };

  const baseDate = useMemo(() => new Date(datetimeLocal), [datetimeLocal]);
  const date = useMemo(() => {
    const d = new Date(baseDate);
    // Each increment is 2 hours, range covers ±30 days (720 hours = 360 increments)
    const totalHours = scrubIncrement * 2;
    d.setHours(d.getHours() + totalHours);
    return d;
  }, [baseDate, scrubIncrement]);

  const totalScrubHours = scrubIncrement * 2;
  const scrubDays = Math.floor(Math.abs(totalScrubHours) / 24);
  const scrubHours = Math.abs(totalScrubHours) % 24;

  const inputs: Inputs = useMemo(() => ({ date, lat, lon }), [date, lat, lon]);
  const sol = useMemo(() => {
    try {
      return solveMoon(inputs);
    } catch (error) {
      console.error("Astronomy calculation error:", error);
      // Return fallback values
      return {
        sunDir: [1, 0, 0] as [number, number, number],
        illumFraction: 0.5,
        phaseAngleDeg: 90,
        distanceKm: 384_400,
        parallacticAngleRad: 0,
        ra: 0,
        dec: 0,
        phaseName: "Unknown",
        phaseEmoji: "🌕",
      };
    }
  }, [inputs]);

  return (
    <>
      <div className="controls">
        <div>
          <label htmlFor="time-travel-input">
            Time Travel:{" "}
            {totalScrubHours >= 0 ? `+${totalScrubHours}` : totalScrubHours}h (
            {(() => {
              if (scrubDays > 0) {
                return `+${scrubDays}d ${scrubHours}h`;
              }
              if (scrubDays < 0) {
                return `-${scrubDays}d ${scrubHours}h`;
              }
              return `${scrubHours}h`;
            })()})
          </label>
          <input
            id="time-travel-input"
            max={+360}
            min={-360} // -30 days in 2-hour increments
            onChange={(e) => setScrubIncrement(Number(e.target.value))} // +30 days in 2-hour increments
            style={{ width: "100%" }}
            type="range"
            value={scrubIncrement}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              opacity: 0.7,
              marginTop: "2px",
            }}
          >
            <span>-30 days</span>
            <span>Now</span>
            <span>+30 days</span>
          </div>
        </div>

        <div className="readout">
          <div
            style={{
              fontSize: "14px",
              margin: "8px 0 4px",
              fontWeight: "bold",
            }}
          >
            📍<strong> Location:</strong> {locationName}
          </div>
          <div
            style={{
              fontSize: "14px",
              margin: "8px 0 4px",
              fontWeight: "bold",
            }}
          >
            {sol.phaseEmoji} <strong>{sol.phaseName}</strong>
          </div>
        </div>
      </div>

      <MoonScene
        inputs={inputs}
        textures={{
          // NASA Lunar Reconnaissance Orbiter (LRO) textures
          color: "./assets/textures/moon_anorthositic_crust_albedo.jpg", // Surface albedo/color
          normal: "./assets/textures/moon_anorthositic_crust_normal.jpg", // Surface normal mapping
          roughness: "./assets/textures/moon_anorthositic_crust_roughness.jpg", // Surface roughness
          displacement: "./assets/textures/moon_lro_lola_dem_colorhillshade.jpg", // Elevation/displacement
          // Additional detail textures available:
          // - moon_lola_roughness.jpg (alternative roughness)
          // - moon_lola_surface_slope.jpg (slope data)
          // - moon_mantle_* textures (for cutaway views)
        }}
      />
    </>
  );
};

function App() {
  return (
    <MoonBlock />
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
