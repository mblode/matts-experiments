"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const AlbumBlock = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      className="relative w-full max-w-[400px] aspect-square overflow-hidden rounded-[40px] bg-gray-400 shadow-2xl"
      onClick={() => setIsPlaying(!isPlaying)}
    >
      <div className="text-center flex flex-col w-full justify-center text-foreground absolute bottom-8">
        <h1 className="text-base font-bold">Bridge Over Troubled Water</h1>
        <h2 className="text-sm">Simon & Garfunkel</h2>
      </div>

      <div
        className={cn(
          "relative z-[10] w-full overflow-hidden object-cover aspect-square shadow-xl transition-all duration-1000",
          {
            "rounded-none translate-y-0": isPlaying,
            "animation-album-spin rounded-[999px] -translate-y-1/2": !isPlaying,
          },
        )}
      >
        <img src="./album.png" alt="Album" className="size-full object-cover" />
        <div
          className={cn(
            "absolute rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity flex items-center justify-center duration-1000",
            {
              "opacity-0": isPlaying,
            },
          )}
        >
          <div className="absolute rounded-full size-12 bg-gray-400 z-[10]" />
          <div className="absolute rounded-full size-14 bg-gray-100 z-[9]" />
          <div className="absolute rounded-full size-20 bg-gray-400 z-[8]" />
          <div className="absolute rounded-full size-[94px] bg-gray-500 z-[7]" />
          <div className="absolute rounded-full size-24 bg-white z-[6]" />
        </div>
      </div>
    </div>
  );
};
