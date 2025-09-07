"use client";

import { useEffect, useRef } from "react";
import { scroll } from "motion";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { Header } from "@/components/ui/header";

export const SkyBlock = () => {
  const bgGradientRef = useRef<HTMLDivElement>(null);
  const cloudsGradientRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cancelScrollAnimations: (() => void)[] = [];

    // Background gradient scroll animation
    const bgCancel = scroll((progress: number) => {
      if (!bgGradientRef.current) return;

      const animations = getAnimationsForProgress(progress);
      Object.assign(bgGradientRef.current.style, animations.bgGradient);
    });

    // Clouds gradient scroll animation
    const cloudsCancel = scroll((progress: number) => {
      if (!cloudsGradientRef.current) return;

      const animations = getAnimationsForProgress(progress);
      Object.assign(cloudsGradientRef.current.style, animations.cloudsGradient);
    });

    // Stars scroll animation
    const starsCancel = scroll((progress: number) => {
      if (!starsRef.current) return;

      const animations = getAnimationsForProgress(progress);
      Object.assign(starsRef.current.style, animations.stars);
    });

    cancelScrollAnimations.push(bgCancel, cloudsCancel, starsCancel);

    return () => {
      cancelScrollAnimations.forEach((cancel) => cancel());
    };
  }, []);

  // Define gradient states
  const gradientStates = [
    {
      // Stage 1: Morning sky
      bgGradient: [
        [0, 144, 245],
        [230, 214, 221],
        [234, 176, 69],
      ],
      cloudsGradient: [
        [205, 206, 208],
        [255, 231, 230],
      ],
      stars: { transform: -50, opacity: 0 },
      progress: 0,
    },
    {
      // Stage 2: Sky blue start
      bgGradient: [
        [30, 84, 200],
        [91, 143, 230],
        [189, 216, 254],
      ],
      cloudsGradient: [
        [255, 255, 255],
        [248, 248, 255],
      ],
      stars: { transform: -36.0824, opacity: 0 },
      progress: 0.2,
    },
    {
      // Stage 3: Twilight
      bgGradient: [
        [46, 70, 112],
        [205, 177, 175],
        [204, 126, 101],
      ],
      cloudsGradient: [
        [254, 130, 143],
        [230, 150, 130],
      ],
      stars: { transform: -13.9901, opacity: 0.933345 },
      progress: 0.8,
    },
    {
      // Stage 4: Deep night
      bgGradient: [
        [6, 22, 31],
        [0, 73, 104],
        [75, 148, 161],
      ],
      cloudsGradient: [
        [33, 62, 80],
        [49, 84, 106],
      ],
      stars: { transform: -4.08733, opacity: 1 },
      progress: 1,
    },
  ];

  const interpolateColor = (
    color1: number[],
    color2: number[],
    t: number,
  ): number[] => {
    return color1.map((c1, i) => Math.round(c1 + (color2[i] - c1) * t));
  };

  const interpolateValue = (val1: number, val2: number, t: number): number => {
    return val1 + (val2 - val1) * t;
  };

  const createGradient = (colors: number[][]): string => {
    const colorStrings = colors.map((color) => `rgb(${color.join(", ")})`);
    return `linear-gradient(${colorStrings.join(", ")})`;
  };

  const getAnimationsForProgress = (progress: number) => {
    // Clamp progress to prevent glitches on iOS when scrolling past 100%
    const clampedProgress = Math.min(Math.max(progress, 0), 1);

    // Find the two states to interpolate between
    let fromIndex = 0;
    let toIndex = 1;

    for (let i = 0; i < gradientStates.length - 1; i++) {
      if (
        clampedProgress >= gradientStates[i].progress &&
        clampedProgress <= gradientStates[i + 1].progress
      ) {
        fromIndex = i;
        toIndex = i + 1;
        break;
      }
    }

    const fromState = gradientStates[fromIndex];
    const toState = gradientStates[toIndex];

    // Calculate interpolation factor
    const progressRange = toState.progress - fromState.progress;
    const t =
      progressRange === 0
        ? 0
        : (clampedProgress - fromState.progress) / progressRange;

    // Interpolate background gradient
    const bgColors = fromState.bgGradient.map((color, i) =>
      toState.bgGradient[i]
        ? interpolateColor(color, toState.bgGradient[i], t)
        : color,
    );

    // Interpolate clouds gradient
    const cloudColors = fromState.cloudsGradient.map((color, i) =>
      toState.cloudsGradient[i]
        ? interpolateColor(color, toState.cloudsGradient[i], t)
        : color,
    );

    return {
      bgGradient: {
        background: createGradient(bgColors),
        opacity: 1,
      },
      cloudsGradient: {
        background: createGradient(cloudColors),
      },
      stars: {
        transform: `translateY(${interpolateValue(fromState.stars.transform, toState.stars.transform, t)}%)`,
        opacity: interpolateValue(
          fromState.stars.opacity,
          toState.stars.opacity,
          t,
        ),
      },
    };
  };

  // Default animations for SSR - starting with morning sky
  const defaultAnimations = getAnimationsForProgress(0);

  return (
    <>
      <div className="relative z-10 p-8 bg-background">
        <div className="mx-auto max-w-4xl">
          <Header id="sky" className="mb-0!" />
        </div>
      </div>

      <div className="relative z-10 bg-noise">
        <section className="relative min-h-[100lvh] flex items-center justify-center">
          <div className="max-w-[900px] mx-auto text-center flex flex-col items-center justify-center">
            <h1 className="text-6xl md:text-8xl">Sunrise</h1>
          </div>
        </section>

        <section className="relative min-h-[100lvh] flex items-center justify-center">
          <div className="max-w-[900px] mx-auto text-center flex flex-col items-center justify-center">
            <h1 className="text-6xl md:text-8xl">Day</h1>
          </div>
        </section>

        <section className="relative min-h-[100lvh] flex items-center justify-center">
          <div className="max-w-[900px] mx-auto text-center flex flex-col items-center justify-center">
            <h1 className="text-6xl md:text-8xl">Sunset</h1>
          </div>
        </section>

        <section className="relative min-h-[100lvh] flex items-center justify-center">
          <div className="max-w-[900px] mx-auto text-center flex flex-col items-center justify-center">
            <h1 className="text-6xl md:text-8xl">Night</h1>
          </div>
        </section>
      </div>

      {/* Fixed Background Gradient - Only for Footer */}
      <div
        ref={bgGradientRef}
        id="home-footer-bg-gradient"
        className="fixed inset-0 z-0"
        style={defaultAnimations.bgGradient}
      />

      <footer id="contact" className="fixed inset-0">
        {/* Shooting Stars */}
        <ShootingStars />

        {/* Cloud Mask Layer */}
        <div
          ref={cloudsGradientRef}
          id="home-footer-clouds-gradient"
          className="absolute inset-0"
          style={{
            mask: 'url("/footer-clouds.png") center/cover no-repeat',
            WebkitMask: 'url("/footer-clouds.png") center/cover no-repeat',
            ...defaultAnimations.cloudsGradient,
          }}
        />
        {/* Stars Layer */}
        <div
          ref={starsRef}
          id="home-footer-stars"
          className="absolute inset-0 -bottom-120 bg-repeat"
          style={{
            background: 'url("/footer-stars.png")',
            ...defaultAnimations.stars,
          }}
        />
      </footer>
    </>
  );
};
