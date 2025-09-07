"use client";
import React, { useMemo, useState, useEffect } from "react";
import { MoonScene } from "./moon-scene";
import { Inputs, solveMoon, getLocationName } from "./astro";
import { create } from "zustand";

type Store = {
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
};

const nowLocalISO = () => {
  const d = new Date();
  // round to minute
  d.setSeconds(0, 0);
  const tz = -d.getTimezoneOffset();
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

export const MoonBlock = () => {
  const { lat, lon, datetimeLocal, speed, locationStatus, locationName, set } =
    useStore();
  const [scrubIncrement, setScrubIncrement] = useState(0); // In 2-hour increments

  // Request geolocation on component mount
  useEffect(() => {
    if (locationStatus !== "unknown") return;

    if (!navigator.geolocation) {
      set({ locationStatus: "unavailable" });
      return;
    }

    set({ locationStatus: "requesting" });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLat = position.coords.latitude;
        const newLon = position.coords.longitude;

        // Get location name
        const name = await getLocationName(newLat, newLon);

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
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    );
  }, [locationStatus, set]);

  const requestLocation = () => {
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
        distanceKm: 384400,
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
          <label>
            Time Travel:{" "}
            {totalScrubHours >= 0 ? `+${totalScrubHours}` : totalScrubHours}h (
            {scrubDays > 0
              ? `+${scrubDays}d ${scrubHours}h`
              : scrubDays < 0
                ? `-${scrubDays}d ${scrubHours}h`
                : `${scrubHours}h`}
            )
          </label>
          <input
            type="range"
            min={-360} // -30 days in 2-hour increments
            max={+360} // +30 days in 2-hour increments
            value={scrubIncrement}
            onChange={(e) => setScrubIncrement(Number(e.target.value))}
            style={{ width: "100%" }}
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
          color: "/textures/moon_anorthositic_crust_albedo.jpg", // Surface albedo/color
          normal: "/textures/moon_anorthositic_crust_normal.jpg", // Surface normal mapping
          roughness: "/textures/moon_anorthositic_crust_roughness.jpg", // Surface roughness
          displacement: "/textures/moon_lro_lola_dem_colorhillshade.jpg", // Elevation/displacement
          // Additional detail textures available:
          // - moon_lola_roughness.jpg (alternative roughness)
          // - moon_lola_surface_slope.jpg (slope data)
          // - moon_mantle_* textures (for cutaway views)
        }}
      />
    </>
  );
};
