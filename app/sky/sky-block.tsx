"use client";

import { useScroll, useTransform, motion, useSpring } from "motion/react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { Header } from "@/components/ui/header";

export const SkyBlock = () => {
  const { scrollYProgress } = useScroll();

  // Transform scroll progress to gradient values for background
  const bgGradient = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [
      "linear-gradient(rgb(0, 144, 245), rgb(230, 214, 221), rgb(234, 176, 69))",
      "linear-gradient(rgb(30, 84, 200), rgb(91, 143, 230), rgb(189, 216, 254))",
      "linear-gradient(rgb(46, 70, 112), rgb(205, 177, 175), rgb(204, 126, 101))",
      "linear-gradient(rgb(6, 22, 31), rgb(0, 73, 104), rgb(75, 148, 161))",
    ],
  );

  // Transform scroll progress for cloud gradients
  const cloudsGradient = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [
      "linear-gradient(rgb(205, 206, 208), rgb(255, 231, 230))",
      "linear-gradient(rgb(255, 255, 255), rgb(248, 248, 255))",
      "linear-gradient(rgb(254, 130, 143), rgb(230, 150, 130))",
      "linear-gradient(rgb(33, 62, 80), rgb(49, 84, 106))",
    ],
  );

  // Stars animations
  const starsOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 0, 0.933345, 1],
  );
  const starsY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [-50, -36.0824, -13.9901, -4.08733],
  );

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
      <motion.div
        id="home-footer-bg-gradient"
        className="fixed inset-0 z-0"
        style={{ background: bgGradient }}
      />

      <footer id="contact" className="fixed inset-0">
        {/* Shooting Stars */}
        <ShootingStars />

        {/* Cloud Mask Layer */}
        <motion.div
          id="home-footer-clouds-gradient"
          className="absolute inset-0"
          style={{
            mask: 'url("/footer-clouds.png") center/cover no-repeat',
            WebkitMask: 'url("/footer-clouds.png") center/cover no-repeat',
            background: cloudsGradient,
          }}
        />
        {/* Stars Layer */}
        <motion.div
          id="home-footer-stars"
          className="absolute inset-0 -bottom-120 bg-repeat"
          style={{
            backgroundImage: 'url("/footer-stars.png")',
            opacity: starsOpacity,
            y: starsY,
          }}
        />
      </footer>
    </>
  );
};
