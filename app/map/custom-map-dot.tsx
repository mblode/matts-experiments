import { SVGProps } from "react";

type Props = {
  size: number;
  pulsating: boolean;
};

export const CustomMapDot = ({ size, pulsating }: Props) => {
  return (
    <div
      className="relative h-full w-full"
      style={{ width: size, height: size }}
    >
      {pulsating && (
        <div
          className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-[#679BFF] opacity-20"
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
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      fill="none"
      {...props}
    >
      <g transform="translate(200,200)">
        <circle cx={0} cy={0} r={50} fill="#fff" className="drop-shadow-lg" />
        <circle
          cx={0}
          cy={0}
          r={36}
          fill="#147aff"
          className="drop-shadow-sm"
        />
        <circle cx={0} cy={0} r={30} id="map-radar" />
      </g>
    </svg>
  );
};
