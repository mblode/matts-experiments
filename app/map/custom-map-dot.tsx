import type { SVGProps } from "react";

interface Props {
  size: number;
  pulsating: boolean;
}

export const CustomMapDot = ({ size, pulsating }: Props) => {
  return (
    <div
      className="relative h-full w-full"
      style={{ width: size, height: size }}
    >
      {pulsating && (
        <div
          className="absolute top-1/2 left-1/2 h-3 w-3 rounded-full bg-[#679BFF] opacity-20"
          style={{
            animation: "pulse-map 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
      )}
      <div className="relative flex h-full w-full items-center justify-center rounded-full bg-white shadow-xl">
        <div className="absolute inset-[3px] rounded-full bg-[#679BFF]" />
        <div className="absolute inset-[3px] rounded-full border border-white/20" />
        <div className="absolute inset-[5px] rounded-full bg-[#679BFF]" />
      </div>
    </div>
  );
};

export const CustomMapDotRadar = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g transform="translate(200,200)">
        <circle className="drop-shadow-lg" cx={0} cy={0} fill="#fff" r={50} />
        <circle
          className="drop-shadow-sm"
          cx={0}
          cy={0}
          fill="#147aff"
          r={36}
        />
        <circle cx={0} cy={0} id="map-radar" r={30} />
      </g>
    </svg>
  );
};
