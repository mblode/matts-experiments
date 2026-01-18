import * as React from "react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { create } from "zustand";
import { Body, EclipticLongitude, Equator, GeoVector, Illumination, Libration, MakeTime, Observer, RotationAxis, SiderealTime } from "astronomy-engine";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { BasicShadowMap, ClampToEdgeWrapping, FrontSide, LinearFilter, LinearMipmapLinearFilter, RGBAFormat, RepeatWrapping, TextureLoader, Vector2 } from "three";
import { createRoot } from "react-dom/client";
const cacheLife = () => {
};
async function getCachedLocationName(lat, lon) {
  cacheLife("days");
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      {
        headers: {
          "User-Agent": "Moon Demo App"
        }
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
    return `${lat.toFixed(4)}\xB0, ${lon.toFixed(4)}\xB0`;
  } catch (err) {
    console.warn("Geocoding failed:", err);
    return `${lat.toFixed(4)}\xB0, ${lon.toFixed(4)}\xB0`;
  }
}
function _norm([x, y, z]) {
  const m = Math.hypot(x, y, z) || 1;
  return [x / m, y / m, z / m];
}
function toTuple(v) {
  return [v.x, v.y, v.z];
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}
function normalizeVec(a) {
  const m = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / m, a[1] / m, a[2] / m];
}
function equatorialToVector(ra_hours, dec_deg) {
  const ra_rad = ra_hours * Math.PI / 12;
  const dec_rad = dec_deg * Math.PI / 180;
  const cos_dec = Math.cos(dec_rad);
  return [
    cos_dec * Math.cos(ra_rad),
    cos_dec * Math.sin(ra_rad),
    Math.sin(dec_rad)
  ];
}
const AU_KM = 1495978707e-1;
const SYNODIC_MONTH_DAYS = 29.530588853;
const MS_PER_DAY = 1e3 * 60 * 60 * 24;
const KNOWN_NEW_MOON = /* @__PURE__ */ new Date("2000-01-06T18:14:00.000Z");
const getValidDate = (date) => {
  if (!date || Number.isNaN(date.getTime())) {
    return /* @__PURE__ */ new Date();
  }
  return date;
};
const getCyclePosition = (date) => {
  const daysSinceRef = (date.getTime() - KNOWN_NEW_MOON.getTime()) / MS_PER_DAY;
  return (daysSinceRef % SYNODIC_MONTH_DAYS + SYNODIC_MONTH_DAYS) % SYNODIC_MONTH_DAYS;
};
const projectOntoPlane = (vector, normal) => normalizeVec([
  vector[0] - dot(vector, normal) * normal[0],
  vector[1] - dot(vector, normal) * normal[1],
  vector[2] - dot(vector, normal) * normal[2]
]);
const getDiskAxes = (uM) => {
  const north = [0, 0, 1];
  const n = projectOntoPlane(north, uM);
  const east = normalizeVec(cross(uM, n));
  return { n, east };
};
const getMoonEquatorialData = (time, obs) => {
  const moonEquatorial = Equator(Body.Moon, time, obs, true, true);
  const ra = moonEquatorial.ra;
  const dec = moonEquatorial.dec;
  const distanceKm = (moonEquatorial.dist ?? 0) * AU_KM;
  return { ra, dec, distanceKm };
};
const getLibrationAngles = (time) => {
  const lib = Libration(time);
  return { mlat: lib.mlat, mlon: lib.mlon };
};
const getParallacticAngle = (time, lat, lon, ra, dec) => {
  const gst = SiderealTime(time);
  const lst = ((gst + lon / 15) % 24 + 24) % 24;
  const H = ((lst - ra) % 24 + 24) % 24 * (Math.PI / 12);
  const phi = lat * Math.PI / 180;
  const decRad = dec * Math.PI / 180;
  const sinH = Math.sin(H);
  const cosH = Math.cos(H);
  const tanPhi = Math.tan(phi);
  const cosDec = Math.cos(decRad);
  const sinDec = Math.sin(decRad);
  const denom = tanPhi * cosDec - sinDec * cosH;
  return Math.atan2(sinH, denom);
};
const getBrightLimbAngle = (uM, uS, n, east) => {
  const v = projectOntoPlane(uS, uM);
  return Math.atan2(dot(east, v), dot(n, v));
};
const getPoleAngle = (time, uM, n, east) => {
  const axis = RotationAxis(Body.Moon, time);
  const uP = equatorialToVector(axis.ra, axis.dec);
  const p = projectOntoPlane(uP, uM);
  return Math.atan2(dot(east, p), dot(n, p));
};
const getWaxingStatus = (time, date) => {
  try {
    const moonEclLon = EclipticLongitude(Body.Moon, time);
    const sunEclLon = EclipticLongitude(Body.Sun, time);
    let elongationDeg = moonEclLon - sunEclLon;
    elongationDeg = (elongationDeg % 360 + 360) % 360;
    const moonAgeDays = elongationDeg / 360 * SYNODIC_MONTH_DAYS;
    return moonAgeDays <= SYNODIC_MONTH_DAYS / 2;
  } catch (_error) {
    const cyclePosition = getCyclePosition(date);
    return cyclePosition <= SYNODIC_MONTH_DAYS / 2;
  }
};
const getSunDirection = (date) => {
  const cyclePosition = getCyclePosition(date);
  let elongationDeg = cyclePosition / SYNODIC_MONTH_DAYS * 360;
  elongationDeg = (elongationDeg % 360 + 360) % 360;
  const elongationRad = elongationDeg * Math.PI / 180;
  return [Math.cos(elongationRad), 0, Math.sin(elongationRad)];
};
const getPhaseType = (illumFraction) => {
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
const PHASE_NAMES = {
  quarter: { waxing: "First Quarter", waning: "Last Quarter" },
  crescent: { waxing: "Waxing Crescent", waning: "Waning Crescent" },
  gibbous: { waxing: "Waxing Gibbous", waning: "Waning Gibbous" }
};
const PHASE_EMOJI = {
  quarter: {
    north: { waxing: "\u{1F313}", waning: "\u{1F317}" },
    south: { waxing: "\u{1F317}", waning: "\u{1F313}" }
  },
  crescent: {
    north: { waxing: "\u{1F312}", waning: "\u{1F318}" },
    south: { waxing: "\u{1F318}", waning: "\u{1F312}" }
  },
  gibbous: {
    north: { waxing: "\u{1F314}", waning: "\u{1F316}" },
    south: { waxing: "\u{1F316}", waning: "\u{1F314}" }
  }
};
const getPhaseLabel = (illumFraction, isWaxing, latitude) => {
  const phaseType = getPhaseType(illumFraction);
  if (phaseType === "new") {
    return { phaseName: "New Moon", phaseEmoji: "\u{1F311}" };
  }
  if (phaseType === "full") {
    return { phaseName: "Full Moon", phaseEmoji: "\u{1F315}" };
  }
  const hemisphere = latitude < 0 ? "south" : "north";
  const waxingKey = isWaxing ? "waxing" : "waning";
  return {
    phaseName: PHASE_NAMES[phaseType][waxingKey],
    phaseEmoji: PHASE_EMOJI[phaseType][hemisphere][waxingKey]
  };
};
function solveMoon(i) {
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
    mlon
  };
}
async function getLocationName(lat, lon) {
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
    return `${lat.toFixed(4)}\xB0, ${lon.toFixed(4)}\xB0`;
  } catch (err) {
    console.warn("Geocoding failed:", err);
    return `${lat.toFixed(4)}\xB0, ${lon.toFixed(4)}\xB0`;
  }
}
function MoonMesh(props) {
  const { inputs, textures, speed = 0 } = props;
  const { gl } = useThree();
  const group = useRef(null);
  const light = useRef(null);
  const moon = useRef(null);
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
  useMemo(() => {
    const configureLunarTexture = (texture, isNormalMap = false) => {
      texture.wrapS = RepeatWrapping;
      texture.wrapT = ClampToEdgeWrapping;
      texture.flipY = true;
      texture.offset.set(0.47, 0);
      texture.repeat.set(1, 1);
      texture.anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy());
      texture.magFilter = LinearFilter;
      texture.minFilter = LinearMipmapLinearFilter;
      texture.generateMipmaps = true;
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
    gl.capabilities.getMaxAnisotropy
  ]);
  const sol = useMemo(() => solveMoon(inputs), [inputs]);
  const timeRef = useRef(inputs.date.getTime());
  useEffect(() => {
    if (!group.current) {
      return;
    }
    group.current.rotation.set(0, 1.8, 0);
    group.current.rotateX(Math.PI);
  }, []);
  useFrame((_state, delta) => {
    let currentSol = sol;
    if (speed) {
      timeRef.current += delta * speed * 864e5;
      const animDate = new Date(timeRef.current);
      currentSol = solveMoon({ ...inputs, date: animDate });
    }
    if (!light.current) {
      return;
    }
    const [x, y, z] = currentSol.sunDir;
    const lightDistance = 100;
    if (Math.random() < 0.03) {
      const angle = Math.atan2(z, x) * 180 / Math.PI;
      console.log("\u{1F319} Moon Phase Debug:", {
        sunDir: `[${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}]`,
        sunAngle: `${angle.toFixed(1)}\xB0`,
        phase: currentSol.phaseName,
        illum: `${(currentSol.illumFraction * 100).toFixed(1)}%`,
        phaseAngle: `${currentSol.phaseAngleDeg.toFixed(1)}\xB0`
      });
    }
    light.current.position.set(
      x * lightDistance,
      y * lightDistance,
      z * lightDistance
    );
    light.current.target.position.set(0, 0, 0);
    light.current.target.updateMatrixWorld();
    light.current.shadow.camera.updateProjectionMatrix();
  });
  return /* @__PURE__ */ React.createElement("group", { ref: group }, /* @__PURE__ */ React.createElement("mesh", { receiveShadow: true, ref: moon }, /* @__PURE__ */ React.createElement("sphereGeometry", { args: [1, 256, 256] }), /* @__PURE__ */ React.createElement(
    "meshPhysicalMaterial",
    {
      clearcoat: 0,
      displacementBias: 0,
      displacementMap,
      displacementScale: 0.012,
      map: colorMap,
      metalness: 0,
      normalMap,
      normalScale: new Vector2(1.2, 1.2),
      reflectivity: 0.12,
      roughness: 0.9,
      roughnessMap,
      side: FrontSide,
      specularIntensity: 0.02,
      transparent: false
    }
  )), /* @__PURE__ */ React.createElement("ambientLight", { intensity: 0.1 }), /* @__PURE__ */ React.createElement(
    "directionalLight",
    {
      castShadow: true,
      intensity: 3,
      ref: light,
      "shadow-bias": 0,
      "shadow-camera-bottom": -1.5,
      "shadow-camera-far": 200,
      "shadow-camera-left": -1.5,
      "shadow-camera-near": 0.01,
      "shadow-camera-right": 1.5,
      "shadow-camera-top": 1.5,
      "shadow-mapSize-height": 8192,
      "shadow-mapSize-width": 8192,
      "shadow-normalBias": 0,
      "shadow-radius": 0
    }
  ));
}
const MoonScene = (props) => {
  return /* @__PURE__ */ React.createElement(
    Canvas,
    {
      camera: { position: [0, 0, 3], fov: 35, zoom: 0.5 },
      gl: {
        antialias: true
      },
      onCreated: ({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = BasicShadowMap;
        gl.shadowMap.autoUpdate = true;
        gl.shadowMap.needsUpdate = true;
      },
      shadows: true,
      style: { width: "100%", height: "100vh" }
    },
    /* @__PURE__ */ React.createElement("color", { args: ["#05060a"], attach: "background" }),
    /* @__PURE__ */ React.createElement(Suspense, { fallback: null }, /* @__PURE__ */ React.createElement(MoonMesh, { ...props })),
    /* @__PURE__ */ React.createElement(OrbitControls, { enablePan: false, enableRotate: true, enableZoom: true })
  );
};
const nowLocalISO = () => {
  const d = /* @__PURE__ */ new Date();
  d.setSeconds(0, 0);
  const _tz = -d.getTimezoneOffset();
  const pad = (n) => String(n).padStart(2, "0");
  const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return iso;
};
const useStore = create((set) => ({
  lat: -37.8136,
  // Melbourne default
  lon: 144.9631,
  datetimeLocal: nowLocalISO(),
  speed: 0,
  locationStatus: "unknown",
  locationName: "Melbourne, Victoria",
  set
}));
const MoonBlock = () => {
  const {
    lat,
    lon,
    datetimeLocal,
    speed: _speed,
    locationStatus,
    locationName,
    set
  } = useStore();
  const [scrubIncrement, setScrubIncrement] = useState(0);
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
        const name = await getCachedLocationName(newLat, newLon);
        set({
          lat: newLat,
          lon: newLon,
          locationStatus: "granted",
          locationName: name
        });
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
        set({ locationStatus: "denied" });
      },
      {
        enableHighAccuracy: false,
        timeout: 1e4,
        maximumAge: 3e5
        // 5 minutes
      }
    );
  }, [locationStatus, set]);
  const _requestLocation = () => {
    set({ locationStatus: "unknown" });
  };
  const baseDate = useMemo(() => new Date(datetimeLocal), [datetimeLocal]);
  const date = useMemo(() => {
    const d = new Date(baseDate);
    const totalHours = scrubIncrement * 2;
    d.setHours(d.getHours() + totalHours);
    return d;
  }, [baseDate, scrubIncrement]);
  const totalScrubHours = scrubIncrement * 2;
  const scrubDays = Math.floor(Math.abs(totalScrubHours) / 24);
  const scrubHours = Math.abs(totalScrubHours) % 24;
  const inputs = useMemo(() => ({ date, lat, lon }), [date, lat, lon]);
  const sol = useMemo(() => {
    try {
      return solveMoon(inputs);
    } catch (error) {
      console.error("Astronomy calculation error:", error);
      return {
        sunDir: [1, 0, 0],
        illumFraction: 0.5,
        phaseAngleDeg: 90,
        distanceKm: 384400,
        parallacticAngleRad: 0,
        ra: 0,
        dec: 0,
        phaseName: "Unknown",
        phaseEmoji: "\u{1F315}"
      };
    }
  }, [inputs]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "controls" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { htmlFor: "time-travel-input" }, "Time Travel:", " ", totalScrubHours >= 0 ? `+${totalScrubHours}` : totalScrubHours, "h (", (() => {
    if (scrubDays > 0) {
      return `+${scrubDays}d ${scrubHours}h`;
    }
    if (scrubDays < 0) {
      return `-${scrubDays}d ${scrubHours}h`;
    }
    return `${scrubHours}h`;
  })(), ")"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "time-travel-input",
      max: 360,
      min: -360,
      onChange: (e) => setScrubIncrement(Number(e.target.value)),
      style: { width: "100%" },
      type: "range",
      value: scrubIncrement
    }
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "10px",
        opacity: 0.7,
        marginTop: "2px"
      }
    },
    /* @__PURE__ */ React.createElement("span", null, "-30 days"),
    /* @__PURE__ */ React.createElement("span", null, "Now"),
    /* @__PURE__ */ React.createElement("span", null, "+30 days")
  )), /* @__PURE__ */ React.createElement("div", { className: "readout" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        fontSize: "14px",
        margin: "8px 0 4px",
        fontWeight: "bold"
      }
    },
    "\u{1F4CD}",
    /* @__PURE__ */ React.createElement("strong", null, " Location:"),
    " ",
    locationName
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        fontSize: "14px",
        margin: "8px 0 4px",
        fontWeight: "bold"
      }
    },
    sol.phaseEmoji,
    " ",
    /* @__PURE__ */ React.createElement("strong", null, sol.phaseName)
  ))), /* @__PURE__ */ React.createElement(
    MoonScene,
    {
      inputs,
      textures: {
        // NASA Lunar Reconnaissance Orbiter (LRO) textures
        color: "./assets/textures/moon_anorthositic_crust_albedo.jpg",
        // Surface albedo/color
        normal: "./assets/textures/moon_anorthositic_crust_normal.jpg",
        // Surface normal mapping
        roughness: "./assets/textures/moon_anorthositic_crust_roughness.jpg",
        // Surface roughness
        displacement: "./assets/textures/moon_lro_lola_dem_colorhillshade.jpg"
        // Elevation/displacement
        // Additional detail textures available:
        // - moon_lola_roughness.jpg (alternative roughness)
        // - moon_lola_surface_slope.jpg (slope data)
        // - moon_mantle_* textures (for cutaway views)
      }
    }
  ));
};
function App() {
  return /* @__PURE__ */ React.createElement(MoonBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
export {
  getCachedLocationName,
  getLocationName
};
