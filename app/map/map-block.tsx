"use client";
import { AbsoluteMapLabel } from "./absolute-map-label";
import { CustomMapDot } from "./custom-map-dot";
import { GetDirectionsButton } from "./get-directions-button";
import NextImage from "next/image";

export const MapBlock = () => {
  const lat = -37.89445651502459;
  const lng = 145.0304000469272;
  const zoom = 8;

  const WIDTH = 400;
  const HEIGHT = 400;

  return (
    <a
      className="relative block w-full max-w-[400px] overflow-hidden rounded-3xl bg-white"
      href="https://www.google.com/maps/place/Melbourne+VIC/data=!4m2!3m1!1s0x6ad646b5d2ba4df7:0x4045675218ccd90?sa=X&ved=1t:242&ictx=111"
      target="_blank"
      style={{
        height: HEIGHT,
      }}
    >
      {/* Map Image */}
      <NextImage
        src={`https://api.mapbox.com/styles/v1/matthewblode/clix8w21k00ux01qi5r472wau/static/${lng},${lat},${zoom},0/${WIDTH}x${HEIGHT}@2x?access_token=pk.eyJ1IjoibWF0dGhld2Jsb2RlIiwiYSI6ImNsaXg4dXZnODA0c3Uzc2wyNmNncTlibzkifQ.s4oJ2Ha9_yYNFf7vGOXvXg&logo=false&attribution=false`}
        alt="Melbourne"
        className="size-full object-cover"
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Title, Address Labels */}
      <AbsoluteMapLabel title="Melbourne" />

      {/* Fixed Map Pin Icon */}
      <div className="absolute left-1/2 top-1/2 flex size-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <CustomMapDot pulsating={true} size={28} />
      </div>

      {/* Get Directions Button */}
      <div className="p-4 absolute right-0 top-0 flex">
        <GetDirectionsButton lng={lng} lat={lat} size="large" />
      </div>
    </a>
  );
};
