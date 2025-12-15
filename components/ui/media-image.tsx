/* eslint-disable @next/next/no-img-element */
"use client";
import NextImage from "next/image";
import { type CSSProperties, useMemo } from "react";
import { cn, imageLoader, unsplashLoader } from "@/lib/utils";
import { Media } from "@/lib/types";

type Props = {
  media?: Partial<Media>;
  title?: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  disableGaussianBlur?: boolean;
  disableOverlayBackground?: boolean;
  disableCrop?: boolean;
  blurMultiplier?: number;
  objectFit?: "CONTAIN" | "COVER";
};

export const MediaImage = ({
  media,
  width,
  height,
  title,
  priority,
  className,
  style,
  disableGaussianBlur,
  disableOverlayBackground,
  disableCrop,
  blurMultiplier = 1,
  objectFit = "COVER",
}: Props) => {
  const objectPosition = useMemo(() => {
    if (!["ASSET", "UNSPLASH"].includes(media?.type || "")) {
      return "50% 50%";
    }

    const defaultFocalX = media?.focalPointX ?? 0.5;
    const defaultFocalY = media?.focalPointY ?? 0.5;

    if (disableCrop || !media?.focalPointX || !media?.focalPointY) {
      return `${(defaultFocalX || 0.5) * 100}% ${(defaultFocalY || 0.5) * 100}%`;
    }

    const sourceWidth = media?.width || 500;
    const sourceHeight = media?.height || 500;
    const cropX = media?.cropX ? media.cropX : 0;
    const cropY = media?.cropY ? media.cropY : 0;
    const cropW = media?.cropW ? media.cropW : sourceWidth;
    const cropH = media?.cropH ? media.cropH : sourceHeight;

    const focalPointX =
      (defaultFocalX - cropX / sourceWidth) / (cropW / sourceWidth);
    const focalPointY =
      (defaultFocalY - cropY / sourceHeight) / (cropH / sourceHeight);

    return `${focalPointX * 100}% ${focalPointY * 100}%`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media, disableCrop]);

  const overlay = useMemo(() => {
    const overlayStyle: CSSProperties = {
      background:
        !disableOverlayBackground && media?.overlayBackground
          ? media.overlayBackground
          : undefined,
    };

    if (
      !disableGaussianBlur &&
      media?.gaussianBlur &&
      !["COLOR", "UNSPLASH"].includes(media?.type || "")
    ) {
      if (
        media?.type !== "ASSET" ||
        (media?.type === "ASSET" && media?.assetFileName?.includes(".svg"))
      ) {
        overlayStyle.backdropFilter =
          !disableGaussianBlur && media?.gaussianBlur
            ? `blur(${media?.gaussianBlur * blurMultiplier}px)`
            : undefined;

        overlayStyle.WebkitBackdropFilter =
          !disableGaussianBlur && media?.gaussianBlur
            ? `blur(${media?.gaussianBlur * blurMultiplier}px)`
            : undefined;
      }
    }

    return (
      <div
        className="pointer-events-none absolute inset-0 size-full"
        style={overlayStyle}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media, blurMultiplier, disableGaussianBlur, disableOverlayBackground]);

  if (media?.type === "ASSET") {
    return (
      <div className={cn("relative size-full", className)} style={{ ...style }}>
        <NextImage
          src={`${media?.assetBucket}/${media?.assetSrc}`}
          alt={title || media?.altText || ""}
          className={cn("size-full", {
            "object-cover": objectFit === "COVER",
            "object-contain": objectFit === "CONTAIN",
          })}
          style={{
            objectPosition,
          }}
          width={width}
          height={height}
          loader={(loader) =>
            imageLoader({
              ...loader,
            })
          }
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
          placeholder={media?.blurDataUrl ? "blur" : "empty"}
          blurDataURL={media?.blurDataUrl || ""}
        />

        {overlay}
      </div>
    );
  } else if (media?.type === "UNSPLASH") {
    return (
      <div className={cn("relative size-full", className)} style={{ ...style }}>
        <NextImage
          src={media?.unsplashUrl || ""}
          alt={title || media?.altText || ""}
          className={cn("size-full", {
            "object-cover": objectFit === "COVER",
            "object-contain": objectFit === "CONTAIN",
          })}
          style={{
            objectPosition,
          }}
          width={width}
          height={height}
          loader={(loader) =>
            unsplashLoader({
              ...loader,
              blur:
                !disableGaussianBlur && media?.gaussianBlur
                  ? media.gaussianBlur * 4
                  : undefined,
              cropX: !disableCrop && media?.cropX ? media?.cropX : undefined,
              cropY: !disableCrop && media?.cropY ? media?.cropY : undefined,
              cropW: !disableCrop && media?.cropW ? media?.cropW : undefined,
              cropH: !disableCrop && media?.cropH ? media?.cropH : undefined,
            })
          }
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
          placeholder={media?.blurDataUrl ? "blur" : "empty"}
          blurDataURL={media?.blurDataUrl || ""}
        />

        {overlay}
      </div>
    );
  } else if (media?.type === "BRANDFETCH") {
    return (
      <div
        className={cn(
          "relative flex justify-center items-center size-full",
          className,
        )}
        style={{ ...style, background: media?.color }}
      >
        <NextImage
          src={media?.customUrl || ""}
          alt={title || media?.altText || ""}
          className="size-full object-contain! p-1"
          style={{
            objectPosition,
          }}
          width={width}
          height={height}
          priority={priority}
        />

        {overlay}
      </div>
    );
  } else if (media?.type === "ICONS8") {
    return (
      <div
        className={cn(
          "relative flex justify-center items-center size-full",
          className,
        )}
        style={{ ...style, background: media?.color }}
      >
        <NextImage
          src={media?.customUrl || ""}
          alt={title || media?.altText || ""}
          className="w-full object-contain! p-1"
          style={{
            objectPosition,
          }}
          width={width}
          height={height}
          priority={priority}
        />

        {overlay}
      </div>
    );
  } else if (media?.type === "URL") {
    return (
      <div className={cn("relative size-full", className)} style={{ ...style }}>
        {/* biome-ignore lint/performance/noImgElement: Custom URLs may not work with Next.js Image due to domain restrictions */}
        <img
          src={media?.customUrl}
          alt={title || media?.altText || ""}
          className={cn("size-full", {
            "object-cover": objectFit === "COVER",
            "object-contain": objectFit === "CONTAIN",
          })}
          style={{
            objectPosition,
          }}
          width={width}
          height={height}
        />

        {overlay}
      </div>
    );
  } else if (media?.type === "COLOR") {
    return (
      <div
        className={cn("size-full", className)}
        style={{
          ...style,
        }}
      >
        <div
          className="size-full"
          style={{
            background: media?.backgroundColor2 || media?.color,
          }}
        />

        {overlay}
      </div>
    );
  }

  return null;
};
