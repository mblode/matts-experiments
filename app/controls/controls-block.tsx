"use client";
import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";

// Generate color palette: 16 colors (4x4) with varying hues
const generateColorPalette = (saturation: number) => {
  const colors = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const hue = (row * 4 + col) * (360 / 16);
      colors.push({
        hue,
        saturation,
        lightness: 0.65,
        oklch: `oklch(0.65 ${saturation} ${hue})`,
      });
    }
  }
  return colors;
};

// Gap presets
const gapPresets = {
  tight: 6,
  cozy: 32,
  roomy: 64,
};
const gapPresetKeys = ["tight", "cozy", "roomy"] as const;

// Corner radius values
const cornerRadiusValues = [0, 16, 32, 48, 64];

export const ControlsBlock = () => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0); // Large red swatch (index 0)
  const [saturationIndex, setSaturationIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gapPresetIndex, setGapPresetIndex] = useState(1);
  const [cornerRadius, setCornerRadius] = useState(32);
  const [isCornerHovered, setIsCornerHovered] = useState(false);
  const [isCenterHovered, setIsCenterHovered] = useState(false);

  // Generate dynamic saturation levels based on selected color hue
  // Need to calculate this first before using it for colorPalette
  const dynamicSaturationLevels = useMemo(() => {
    // Use a temporary hue value for initial render
    const hue = selectedColorIndex * (360 / 16);
    return [
      { sat: 0.25, lightness: 0.58, hue },
      { sat: 0.2, lightness: 0.6, hue },
      { sat: 0.15, lightness: 0.62, hue },
      { sat: 0.1, lightness: 0.65, hue },
      { sat: 0.05, lightness: 0.68, hue },
    ];
  }, [selectedColorIndex]);

  // Use selected saturation level for the color palette
  const selectedSaturation = dynamicSaturationLevels[saturationIndex].sat;
  const colorPalette = generateColorPalette(selectedSaturation);
  const selectedColor = colorPalette[selectedColorIndex];
  const gap = gapPresets[gapPresetKeys[gapPresetIndex]];

  // Dynamic marker and accent color based on selected hue/saturation
  const accentColor = `oklch(${dynamicSaturationLevels[saturationIndex].lightness} ${dynamicSaturationLevels[saturationIndex].sat} ${selectedColor.hue})`;

  // Handle saturation container click with cycling and wrap-around animation
  const handleSaturationClick = () => {
    if (isAnimating) return; // Prevent clicks during animation

    if (saturationIndex === 4) {
      // At last item - trigger wrap-around animation
      setIsAnimating(true);

      // Animate backwards through indices: 4 → 3 → 2 → 1 → 0
      const animationSteps = [3, 2, 1, 0];
      animationSteps.forEach((step, index) => {
        setTimeout(
          () => {
            setSaturationIndex(step);
            if (step === 0) {
              setIsAnimating(false);
            }
          },
          (index + 1) * 150,
        ); // 150ms between each step
      });
    } else {
      // Normal increment
      setSaturationIndex((prev) => prev + 1);
    }
  };

  // Spring animation config
  const springConfig = { type: "spring" as const, stiffness: 350, damping: 55 };

  // Gap & Corners dimensions for curved design
  const outerSize = 205;
  const padding = 16;
  const markerSize = 24;
  const innerSize = outerSize - 2 * padding;

  // Calculate corner marker positions: center of quadrant
  // Each quadrant width is (innerSize - gap) / 2, so center is at (innerSize - gap) / 4
  const quadrantCenter = (innerSize - gap) / 4;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start p-8 gap-12"
      style={{
        background:
          "linear-gradient(to bottom, rgb(220, 200, 200), rgb(240, 210, 210), rgb(200, 180, 190))",
        position: "relative",
      }}
    >
      {/* Vignette overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.15) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Demo Preview Area */}
      <div
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 relative z-10"
        style={{ gap: `${gap}px` }}
      >
        {/* Profile Card */}
        <motion.div
          layout
          className="bg-white p-6"
          style={{
            borderRadius: `${cornerRadius}px`,
          }}
          transition={springConfig}
        >
          <div className="flex flex-col gap-6 h-full">
            <div className="flex items-start justify-between">
              <motion.div
                className="w-20 h-20 rounded-full overflow-hidden"
                style={{ borderRadius: `${cornerRadius * 1.5}px` }}
                transition={springConfig}
              >
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-400" />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={springConfig}
                style={{ color: accentColor }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.div>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Mackenzie Child
              </h2>
              <p className="text-gray-600">@mackenziechild</p>
            </div>

            <div className="flex-1"></div>

            <motion.div
              className="flex gap-6 bg-gray-50 px-6 py-4"
              style={{
                borderRadius: `${Math.max(cornerRadius - 24, 0)}px`,
              }}
              transition={springConfig}
            >
              <div>
                <span className="font-semibold text-gray-900">1.3k</span>
                <span className="text-gray-600 ml-1">Following</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">12.7k</span>
                <span className="text-gray-600 ml-1">Followers</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          layout
          className="flex flex-col justify-between text-white p-6"
          style={{
            backgroundColor: accentColor,
            borderRadius: `${cornerRadius}px`,
          }}
          transition={springConfig}
        >
          <div className="flex flex-col gap-6 h-full">
            <h1 className="text-4xl font-bold leading-tight">
              Hey, I'm Mackenzie Child.
              <br />
              I'm a design engineer based in Atlanta. Building something new.
            </h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 text-lg font-semibold transition-colors"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: `${Math.max(cornerRadius - 24, 0)}px`,
              backdropFilter: "blur(10px)",
            }}
            transition={springConfig}
          >
            Say hello
          </motion.button>
        </motion.div>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[675px] px-4 z-50">
        <div className="backdrop-blur-xl rounded-[50px] p-4 border border-white bg-white/30 shadow-2xl">
          <div className="flex flex-row gap-6">
            {/* Hue & Saturation Control */}
            <motion.div
              layout
              className="flex flex-1 flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ...springConfig }}
            >
              <div className="bg-white rounded-[34px] shadow-lg p-4 w-full">
                <div className="flex gap-4">
                  {/* Mixed-shape color grid */}
                  <div className="flex flex-col gap-2 flex-1">
                    {[0, 1, 2, 3].map((row) => {
                      const selectedRow = Math.floor(selectedColorIndex / 4);
                      const selectedCol = selectedColorIndex % 4;
                      const isSelectedRow = row === selectedRow;
                      const targetHeight = isSelectedRow ? 72 : 36;

                      // Build grid template columns with 2fr for selected column
                      const gridCols = [0, 1, 2, 3]
                        .map((col) => (col === selectedCol ? "2fr" : "1fr"))
                        .join(" ");

                      return (
                        <motion.div
                          key={row}
                          className="grid gap-4"
                          animate={{
                            height: targetHeight,
                            gridTemplateColumns: gridCols,
                          }}
                          transition={springConfig}
                        >
                          {[0, 1, 2, 3].map((col) => {
                            const index = row * 4 + col;
                            const color = colorPalette[index];
                            const isSelected = selectedColorIndex === index;

                            return (
                              <motion.button
                                key={index}
                                className="relative overflow-hidden transition-all cursor-pointer"
                                style={{
                                  backgroundColor: color.oklch,
                                  borderRadius: 18,
                                  border: "none",
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedColorIndex(index)}
                                transition={springConfig}
                                aria-label={`Hue ${color.hue}`}
                              >
                                {isSelected && (
                                  <motion.div
                                    className="absolute inset-0 flex items-center justify-center"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={springConfig}
                                  >
                                    <Check
                                      className="size-8 text-white relative z-10"
                                      strokeWidth={3.5}
                                    />
                                  </motion.div>
                                )}
                              </motion.button>
                            );
                          })}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Dynamic saturation selector - clickable container */}
                  <motion.div
                    className="border-2 p-3 border-gray-300 cursor-pointer"
                    style={{
                      borderRadius: 18,
                      width: 72,
                      cursor: "pointer",
                    }}
                    onClick={handleSaturationClick}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                    whileTap={{ scale: 0.97 }}
                    transition={springConfig}
                    aria-label="Cycle saturation levels"
                  >
                    <div className="flex flex-col gap-2 justify-end h-full">
                      {dynamicSaturationLevels.map((level, index) => {
                        if (index < saturationIndex) return null;

                        return (
                          <motion.div
                            key={index}
                            className="relative pointer-events-none"
                            style={{
                              backgroundColor: `oklch(${level.lightness} ${level.sat} ${level.hue})`,
                              borderRadius: 10,
                              height: 29,
                              border: "none",
                            }}
                            transition={springConfig}
                          >
                            {/* Visual indicator for selected level */}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              </div>
              {/* Label */}
              <p
                className="font-semibold"
                style={{
                  fontSize: "16px",
                  color: "rgb(100, 90, 85)",
                  letterSpacing: "0.02em",
                }}
              >
                Hue & Saturation
              </p>
            </motion.div>

            {/* Gap & Corners Control */}
            <motion.div
              layout
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ...springConfig }}
            >
              <div className="bg-white rounded-[34px] shadow-lg p-4 w-full">
                <div
                  className="relative bg-gray-50 border-2 border-gray-300"
                  style={{
                    width: `${outerSize}px`,
                    height: `${outerSize}px`,
                    borderRadius: 18,
                    margin: "0 auto",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ padding: `${padding}px` }}
                  >
                    {/* Corner shape outlines with thick borders */}
                    {/* Top-left quadrant - thick bottom and right borders, bottom-right radius (opposite corner) */}
                    <motion.div
                      className="absolute pointer-events-none border-4 border-gray-300"
                      animate={{
                        width: `calc(50% - ${gap / 2}px)`,
                        height: `calc(50% - ${gap / 2}px)`,
                        borderBottomRightRadius: cornerRadius,
                      }}
                      style={{
                        top: 0,
                        left: 0,
                        borderLeft: `none`,
                        borderTop: `none`,
                      }}
                      transition={springConfig}
                    />

                    {/* Top-right quadrant - right aligned, thick bottom and left borders, bottom-left radius (opposite corner) */}
                    <motion.div
                      className="absolute pointer-events-none border-4 border-gray-300"
                      animate={{
                        width: `calc(50% - ${gap / 2}px)`,
                        height: `calc(50% - ${gap / 2}px)`,
                        borderBottomLeftRadius: cornerRadius,
                      }}
                      style={{
                        top: 0,
                        right: 0,
                        borderRight: `none`,
                        borderTop: `none`,
                      }}
                      transition={springConfig}
                    />

                    {/* Bottom-left quadrant - thick top and right borders, top-right radius (opposite corner) */}
                    <motion.div
                      className="absolute pointer-events-none border-4 border-gray-300"
                      animate={{
                        width: `calc(50% - ${gap / 2}px)`,
                        height: `calc(50% - ${gap / 2}px)`,
                        borderTopRightRadius: cornerRadius,
                      }}
                      style={{
                        bottom: 0,
                        left: 0,
                        borderLeft: `none`,
                        borderBottom: `none`,
                      }}
                      transition={springConfig}
                    />

                    {/* Bottom-right quadrant - right aligned, thick top and left borders, top-left radius (opposite corner) */}
                    <motion.div
                      className="absolute pointer-events-none border-4 border-gray-300"
                      animate={{
                        width: `calc(50% - ${gap / 2}px)`,
                        height: `calc(50% - ${gap / 2}px)`,
                        borderTopLeftRadius: cornerRadius,
                      }}
                      style={{
                        bottom: 0,
                        right: 0,
                        borderRight: `none`,
                        borderBottom: `none`,
                      }}
                      transition={springConfig}
                    />

                    {/* Bullseye markers - Corner positions */}
                    {/* Top-left */}
                    <motion.button
                      className="absolute cursor-pointer"
                      animate={{
                        top: quadrantCenter,
                        left: quadrantCenter,
                      }}
                      style={{
                        width: `${markerSize}px`,
                        height: `${markerSize}px`,
                        transform: "translate(-50%, -50%)",
                      }}
                      onHoverStart={() => setIsCornerHovered(true)}
                      onHoverEnd={() => setIsCornerHovered(false)}
                      onClick={() => {
                        const currentIndex =
                          cornerRadiusValues.indexOf(cornerRadius);
                        const nextIndex =
                          (currentIndex + 1) % cornerRadiusValues.length;
                        setCornerRadius(cornerRadiusValues[nextIndex]);
                      }}
                      transition={springConfig}
                      aria-label="Corner radius control"
                    >
                      {/* Outer ring - only show on hover */}
                      {isCornerHovered && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            border: `2.5px solid ${accentColor}`,
                            width: `${markerSize}px`,
                            height: `${markerSize}px`,
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={springConfig}
                        />
                      )}
                      {/* Inner filled circle */}
                      <div
                        className="absolute rounded-full -translate-1/2"
                        style={{
                          backgroundColor: accentColor,
                          width: 14,
                          height: 14,
                          top: "50%",
                          left: "50%",
                        }}
                      />
                    </motion.button>

                    {/* Top-right */}
                    <motion.button
                      className="absolute cursor-pointer"
                      animate={{
                        top: quadrantCenter,
                        right: quadrantCenter,
                      }}
                      style={{
                        width: `${markerSize}px`,
                        height: `${markerSize}px`,
                        transform: "translate(50%, -50%)",
                      }}
                      onHoverStart={() => setIsCornerHovered(true)}
                      onHoverEnd={() => setIsCornerHovered(false)}
                      onClick={() => {
                        const currentIndex =
                          cornerRadiusValues.indexOf(cornerRadius);
                        const nextIndex =
                          (currentIndex + 1) % cornerRadiusValues.length;
                        setCornerRadius(cornerRadiusValues[nextIndex]);
                      }}
                      transition={springConfig}
                      aria-label="Corner radius control"
                    >
                      {/* Outer ring - only show on hover */}
                      {isCornerHovered && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            border: `2.5px solid ${accentColor}`,
                            width: `${markerSize}px`,
                            height: `${markerSize}px`,
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={springConfig}
                        />
                      )}
                      <div
                        className="absolute rounded-full -translate-1/2"
                        style={{
                          backgroundColor: accentColor,
                          width: 14,
                          height: 14,
                          top: "50%",
                          left: "50%",
                        }}
                      />
                    </motion.button>

                    {/* Bottom-left */}
                    <motion.button
                      className="absolute cursor-pointer"
                      animate={{
                        bottom: quadrantCenter,
                        left: quadrantCenter,
                      }}
                      style={{
                        width: `${markerSize}px`,
                        height: `${markerSize}px`,
                        transform: "translate(-50%, 50%)",
                      }}
                      onHoverStart={() => setIsCornerHovered(true)}
                      onHoverEnd={() => setIsCornerHovered(false)}
                      onClick={() => {
                        const currentIndex =
                          cornerRadiusValues.indexOf(cornerRadius);
                        const nextIndex =
                          (currentIndex + 1) % cornerRadiusValues.length;
                        setCornerRadius(cornerRadiusValues[nextIndex]);
                      }}
                      transition={springConfig}
                      aria-label="Corner radius control"
                    >
                      {/* Outer ring - only show on hover */}
                      {isCornerHovered && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            border: `2.5px solid ${accentColor}`,
                            width: `${markerSize}px`,
                            height: `${markerSize}px`,
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={springConfig}
                        />
                      )}
                      <div
                        className="absolute rounded-full -translate-1/2"
                        style={{
                          backgroundColor: accentColor,
                          width: 14,
                          height: 14,
                          top: "50%",
                          left: "50%",
                        }}
                      />
                    </motion.button>

                    {/* Bottom-right */}
                    <motion.button
                      className="absolute cursor-pointer"
                      animate={{
                        bottom: quadrantCenter,
                        right: quadrantCenter,
                      }}
                      style={{
                        width: `${markerSize}px`,
                        height: `${markerSize}px`,
                        transform: "translate(50%, 50%)",
                      }}
                      onHoverStart={() => setIsCornerHovered(true)}
                      onHoverEnd={() => setIsCornerHovered(false)}
                      onClick={() => {
                        const currentIndex =
                          cornerRadiusValues.indexOf(cornerRadius);
                        const nextIndex =
                          (currentIndex + 1) % cornerRadiusValues.length;
                        setCornerRadius(cornerRadiusValues[nextIndex]);
                      }}
                      transition={springConfig}
                      aria-label="Corner radius control"
                    >
                      {/* Outer ring - only show on hover */}
                      {isCornerHovered && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            border: `2.5px solid ${accentColor}`,
                            width: `${markerSize}px`,
                            height: `${markerSize}px`,
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={springConfig}
                        />
                      )}
                      <div
                        className="absolute rounded-full -translate-1/2"
                        style={{
                          backgroundColor: accentColor,
                          width: 14,
                          height: 14,
                          top: "50%",
                          left: "50%",
                        }}
                      />
                    </motion.button>

                    {/* Center marker - solid dot */}
                    <motion.button
                      className="absolute z-10 -translate-1/2 cursor-pointer"
                      style={{
                        top: "50%",
                        left: "50%",
                        width: `${markerSize}px`,
                        height: `${markerSize}px`,
                      }}
                      onHoverStart={() => setIsCenterHovered(true)}
                      onHoverEnd={() => setIsCenterHovered(false)}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setGapPresetIndex(
                          (prev) => (prev + 1) % gapPresetKeys.length,
                        );
                      }}
                      transition={springConfig}
                      aria-label="Gap control"
                    >
                      {/* Outer ring - only show on hover */}
                      {isCenterHovered && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            border: `2.5px solid ${accentColor}`,
                            width: `${markerSize}px`,
                            height: `${markerSize}px`,
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={springConfig}
                        />
                      )}
                      {/* Inner filled circle */}
                      <div
                        className="absolute rounded-full -translate-1/2"
                        style={{
                          backgroundColor: accentColor,
                          width: 14,
                          height: 14,
                          top: "50%",
                          left: "50%",
                        }}
                      />
                    </motion.button>
                  </div>
                </div>
              </div>
              {/* Label */}
              <p
                className="font-semibold"
                style={{
                  fontSize: "16px",
                  color: "rgb(100, 90, 85)",
                  letterSpacing: "0.02em",
                }}
              >
                Gap & Corners
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
