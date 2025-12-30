import * as AE from "astronomy-engine";

export interface Inputs {
  date: Date;
  lat: number;
  lon: number;
  elev?: number;
}

export interface MoonSolution {
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
function toTuple(v: AE.Vector): [number, number, number] {
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
export function solveMoon(i: Inputs): MoonSolution {
  const elev = i.elev ?? 0;
  const obs = new AE.Observer(i.lat, i.lon, elev);

  // Validate and sanitize the date input
  let validDate = i.date;
  if (!validDate || Number.isNaN(validDate.getTime())) {
    validDate = new Date();
  }

  const time = AE.MakeTime(validDate);

  // STEP 1: CALCULATE BASIC PHASE INFORMATION
  // ========================================
  // Get illumination data: how much of moon is lit and phase angle
  // phase_fraction: 0.0 = new moon, 0.5 = quarter, 1.0 = full moon
  // phase_angle: Sun-Moon-Earth angle in degrees (0° = full, 180° = new)
  const illum = AE.Illumination(AE.Body.Moon, time);
  const illumFraction = illum.phase_fraction;
  const phaseAngleDeg = illum.phase_angle;

  // STEP 2: CALCULATE 3D POSITIONS IN SPACE
  // ======================================
  // Get geocentric vectors (from Earth center) to Sun and Moon
  // These are in Astronomical Units (AU) in J2000 equatorial coordinates
  // This gives us the fundamental geometry: Earth-Moon-Sun triangle
  const rES = AE.GeoVector(AE.Body.Sun, time, true); // Earth → Sun
  const _rEM = AE.GeoVector(AE.Body.Moon, time, true); // Earth → Moon

  // STEP 3: OBSERVER'S VIEW OF THE MOON
  // ==================================
  // Calculate moon's position as seen from specific location on Earth
  // This accounts for parallax, atmospheric refraction, and topocentric corrections
  const moonEquatorial = AE.Equator(AE.Body.Moon, time, obs, true, true);
  const ra = moonEquatorial.ra; // Right ascension in hours (0-24)
  const dec = moonEquatorial.dec; // Declination in degrees (-90 to +90)

  // Convert distance from AU to kilometers for practical use
  const AU_KM = 149_597_870.7;
  const distanceKm = (moonEquatorial.dist ?? 0) * AU_KM;

  // STEP 4: LIBRATION EFFECTS (TIDAL LOCKING WOBBLES)
  // ================================================
  // Even though tidally locked, the moon has small wobbles called libration:
  // - Longitudinal: ±7°54' due to elliptical orbit (speed variations)
  // - Latitudinal: ±6°50' due to 6.7° axial tilt
  // - Physical: tiny real oscillations from gravitational perturbations
  // mlat/mlon represent these wobbles in selenographic coordinates
  const lib = AE.Libration(time);
  const mlat = lib.mlat; // Latitudinal libration in degrees
  const mlon = lib.mlon; // Longitudinal libration in degrees

  // STEP 5: PARALLACTIC ANGLE CALCULATION
  // ====================================
  // The parallactic angle describes how the moon appears rotated
  // due to the observer's location on Earth's surface
  // Important for precise orientation at different latitudes/times

  // Convert to local sidereal time to get moon's position in local sky
  const gst = AE.SiderealTime(time); // Greenwich sidereal time in hours
  const lst = (((gst + i.lon / 15) % 24) + 24) % 24; // Local sidereal time

  // Hour angle: how far west the moon is from the meridian
  const H = ((((lst - ra) % 24) + 24) % 24) * (Math.PI / 12.0); // Convert to radians

  // Observer's latitude and moon's declination in radians
  const phi = (i.lat * Math.PI) / 180.0;
  const decRad = (dec * Math.PI) / 180.0;

  // Trigonometric components for parallactic angle calculation
  const sinH = Math.sin(H);
  const cosH = Math.cos(H);
  const tanPhi = Math.tan(phi);
  const cosDec = Math.cos(decRad);
  const sinDec = Math.sin(decRad);

  // Parallactic angle using Meeus formula
  // This angle shows how much the moon appears rotated from its standard orientation
  // tan(q) = sin(H) / (tan(φ) * cos(δ) - sin(δ) * cos(H))
  const denom = tanPhi * cosDec - sinDec * cosH;
  const parallacticAngleRad = Math.atan2(sinH, denom);

  // STEP 6: COORDINATE SYSTEM SETUP
  // ===============================
  // Set up 3D coordinate system for bright limb calculation

  // Unit vector from observer to Moon (our viewing direction)
  const uM = equatorialToVector(ra, dec);

  // Unit vector from Earth to Sun (lighting direction)
  const uS = normalizeVec(toTuple(rES));

  // Celestial north pole in J2000 equatorial coordinates (+Z axis)
  const north: [number, number, number] = [0, 0, 1];

  // STEP 7: PROJECT CELESTIAL COORDINATES ONTO MOON'S APPARENT DISK
  // ==============================================================
  // To determine where features appear on the moon's disk as seen from Earth,
  // we project 3D directions onto the 2D plane perpendicular to our line of sight

  // Project celestial north onto the plane of the moon's apparent disk
  // (Remove the component along the line of sight to get the projection)
  let n: [number, number, number] = [
    north[0] - dot(north, uM) * uM[0],
    north[1] - dot(north, uM) * uM[1],
    north[2] - dot(north, uM) * uM[2],
  ];
  n = normalizeVec(n);

  // East direction on the moon's disk using right-hand rule
  // This gives us a coordinate system on the apparent lunar disk
  let east = cross(uM, n);
  east = normalizeVec(east);

  // STEP 8: BRIGHT LIMB POSITION ANGLE CALCULATION
  // =============================================
  // The bright limb is the edge of the illuminated portion of the moon
  // Its position angle determines where the terminator (day/night boundary) appears

  // Project the Sun's direction onto the moon's apparent disk
  // This shows where the Sun "appears" relative to the moon from our viewpoint
  let v: [number, number, number] = [
    uS[0] - dot(uS, uM) * uM[0],
    uS[1] - dot(uS, uM) * uM[1],
    uS[2] - dot(uS, uM) * uM[2],
  ];
  v = normalizeVec(v);

  // Calculate position angle of bright limb measured east of celestial north
  // This angle tells us how to orient the moon so the terminator appears correctly
  const brightLimbAngleRad = Math.atan2(dot(east, v), dot(n, v));

  // --- Moon's north pole position angle ---
  const axis = AE.RotationAxis(AE.Body.Moon, time);
  const poleRa = axis.ra; // hours
  const poleDec = axis.dec; // degrees
  const uP = equatorialToVector(poleRa, poleDec);

  // Project pole vector into plane of Moon disk
  let p: [number, number, number] = [
    uP[0] - dot(uP, uM) * uM[0],
    uP[1] - dot(uP, uM) * uM[1],
    uP[2] - dot(uP, uM) * uM[2],
  ];
  p = normalizeVec(p);

  // position angle of Moon's north pole measured east of celestial north
  const poleAngleRad = Math.atan2(dot(east, p), dot(n, p));

  // STEP 9: DETERMINE WAXING vs WANING PHASE
  // ========================================
  // Critical for accurate phase naming - determines if moon is growing or shrinking
  // Uses ecliptic longitude difference to calculate moon's "age" in the cycle

  let isWaxing = true; // Default fallback
  try {
    // Get ecliptic longitudes of Moon and Sun (their positions along the ecliptic)
    const moonEclLon = AE.EclipticLongitude(AE.Body.Moon, time);
    const sunEclLon = AE.EclipticLongitude(AE.Body.Sun, time);

    // Calculate elongation: how far ahead the Moon is of the Sun in orbit
    let elongationDeg = moonEclLon - sunEclLon;
    elongationDeg = ((elongationDeg % 360) + 360) % 360; // Normalize to 0-360°

    // Convert to "moon age" in days since new moon
    const synodicMonth = 29.530_588_853; // Average length of lunar phase cycle
    const moonAgeDays = (elongationDeg / 360) * synodicMonth;

    // Waxing: 0-14.77 days (growing), Waning: 14.77-29.53 days (shrinking)
    isWaxing = moonAgeDays <= synodicMonth / 2;
  } catch (_error) {
    // Fallback: Use a more sophisticated approach based on time progression
    // Calculate days since a known new moon to determine waxing/waning
    const knownNewMoon = new Date("2000-01-06T18:14:00.000Z"); // J2000 reference new moon
    const synodicMonth = 29.530_588_853; // days
    const daysSinceRef =
      (validDate.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const cyclePosition =
      ((daysSinceRef % synodicMonth) + synodicMonth) % synodicMonth;

    // Waxing: 0-14.77 days, Waning: 14.77-29.53 days
    isWaxing = cyclePosition <= synodicMonth / 2;
  }

  // STEP 10: CALCULATE SUN DIRECTION FOR THREE.JS LIGHTING
  // =====================================================
  // CRITICAL: Create sun direction based on orbital phase geometry
  // The key insight: moon phases result from Moon's position relative to Sun-Earth line

  // Use phase angle to determine orbital position and create rotating sun direction
  // Phase angle: 0° = full moon, 180° = new moon
  // We need to convert this to elongation angle for proper geometry

  // Calculate elongation using a more robust approach
  // Use the cycle position from our time-based calculation for better continuity
  let elongationDeg: number;

  // Calculate cycle position directly from date for smooth transitions
  const knownNewMoon = new Date("2000-01-06T18:14:00.000Z"); // J2000 reference new moon
  const synodicMonth = 29.530_588_853; // days
  const daysSinceRef =
    (validDate.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const cyclePosition =
    ((daysSinceRef % synodicMonth) + synodicMonth) % synodicMonth;

  // Convert cycle position to elongation angle (0-360°)
  elongationDeg = (cyclePosition / synodicMonth) * 360;

  // Ensure smooth progression: 0° = new moon, 180° = full moon, 360° = new moon again
  elongationDeg = ((elongationDeg % 360) + 360) % 360;

  // Convert to radians for trigonometry
  const elongationRad = (elongationDeg * Math.PI) / 180;

  // ORBITAL PHASE GEOMETRY:
  // 0° = New Moon (Sun behind Moon from Earth's perspective)
  // 90° = First Quarter (Sun to the side)
  // 180° = Full Moon (Sun in front of Moon from Earth's perspective)
  // 270° = Last Quarter (Sun to the other side)

  // Create sun direction that rotates around Moon based on orbital position
  // This simulates how the Sun appears to move relative to Moon during orbit
  const sunDir: [number, number, number] = [
    Math.cos(elongationRad), // X: varies from +1 (new) to -1 (full)
    0, // Y: keep in orbital plane
    Math.sin(elongationRad), // Z: varies to create side lighting for quarters
  ];

  // DEBUG: Elongation calculation debug logging disabled for Cache Components compatibility
  // Math.random() cannot be used in Client Components with cacheComponents enabled
  // To enable debugging, wrap the component in a Suspense boundary or use a different logging approach

  // STEP 11: PHASE NAMING HEURISTICS
  // ===============================
  let phaseName = "Unknown";
  let phaseEmoji = "";

  // Southern Hemisphere sees Moon upside down - flip crescents
  const isSouthernHemisphere = i.lat < 0;

  if (illumFraction < 0.01) {
    phaseName = "New Moon";
    phaseEmoji = "🌑";
  } else if (illumFraction > 0.99) {
    phaseName = "Full Moon";
    phaseEmoji = "🌕";
  } else if (Math.abs(illumFraction - 0.5) < 0.05) {
    phaseName = isWaxing ? "First Quarter" : "Last Quarter";
    // Flip quarters for Southern Hemisphere
    if (isSouthernHemisphere) {
      phaseEmoji = isWaxing ? "🌗" : "🌓";
    } else {
      phaseEmoji = isWaxing ? "🌓" : "🌗";
    }
  } else if (illumFraction < 0.5) {
    phaseName = isWaxing ? "Waxing Crescent" : "Waning Crescent";
    // Flip crescents for Southern Hemisphere
    if (isSouthernHemisphere) {
      phaseEmoji = isWaxing ? "🌘" : "🌒";
    } else {
      phaseEmoji = isWaxing ? "🌒" : "🌘";
    }
  } else {
    phaseName = isWaxing ? "Waxing Gibbous" : "Waning Gibbous";
    // Flip gibbous for Southern Hemisphere
    if (isSouthernHemisphere) {
      phaseEmoji = isWaxing ? "🌖" : "🌔";
    } else {
      phaseEmoji = isWaxing ? "🌔" : "🌖";
    }
  }

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
