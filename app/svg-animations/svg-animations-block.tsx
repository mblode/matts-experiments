// app/page.tsx
"use client";

import * as React from "react";
import { motion } from "motion/react";

type Shape = "asterix" | "arrow" | "plus" | "x" | "hashtag" | "parallel";

type Segment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
};

const MAX_SEGMENTS = 4;
const EMPTY: Segment = { x1: 50, y1: 50, x2: 50, y2: 50, opacity: 0 };

export const SVGAnimationsBlock = () => {
  const [shape, setShape] = React.useState<Shape>("asterix");
  const [isCycling, setIsCycling] = React.useState(false);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // Order matches: plus → asterix → x → arrow → hashtag (…parallel → plus)
  const shapeOrder: Shape[] = [
    "plus",
    "asterix",
    "x",
    "arrow",
    "hashtag",
    "parallel",
  ];

  const shapeButtons: Array<{ shape: Shape; label: string }> = [
    { shape: "asterix", label: "Asterix" },
    { shape: "x", label: "X" },
    { shape: "arrow", label: "Arrow" },
    { shape: "hashtag", label: "#" },
    { shape: "parallel", label: "Parallel" },
    { shape: "plus", label: "Plus" },
  ];

  const getShapeColor = () => {
    switch (shape) {
      case "asterix":
        return "#E072DE";
      case "arrow":
        return "#04A58E";
      case "hashtag":
        return "#4E71F6";
      case "parallel":
        return "#F68200";
      case "plus":
        return "#3E4647";
      case "x":
      default:
        return "#F62C00";
    }
  };

  const cycleToNext = React.useCallback(() => {
    setShape((current) => {
      const idx = shapeOrder.indexOf(current);
      const next = (idx + 1) % shapeOrder.length;
      return shapeOrder[next];
    });
  }, [shapeOrder]);

  const toggleCycle = () => setIsCycling((v) => !v);

  React.useEffect(() => {
    if (isCycling) {
      intervalRef.current = setInterval(cycleToNext, 1800);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isCycling, cycleToNext]);

  const segments = React.useMemo<Segment[]>(() => segmentsFor(shape), [shape]);

  return (
    <main
      style={{ minHeight: "100svh", display: "grid", placeItems: "center" }}
    >
      <div style={{ display: "grid", gap: 24, justifyItems: "center" }}>
        <svg
          viewBox="0 0 100 100"
          width={220}
          height={220}
          style={{ overflow: "visible" }}
          aria-label={shape}
        >
          {Array.from({ length: MAX_SEGMENTS }).map((_, i) => {
            const seg = segments[i] ?? EMPTY;
            return (
              <motion.line
                key={i}
                initial={false}
                strokeLinecap="round"
                strokeWidth={10}
                animate={{
                  x1: seg.x1,
                  y1: seg.y1,
                  x2: seg.x2,
                  y2: seg.y2,
                  opacity: seg.opacity,
                  stroke: getShapeColor(),
                }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
              />
            );
          })}
        </svg>

        <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
          <button
            onClick={toggleCycle}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: isCycling ? "#fef0f0" : "#f6f6f6",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            {isCycling ? "Stop Cycle" : "Start Cycle"}
          </button>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
            }}
          >
            {shapeButtons.map((btn) => (
              <button
                key={btn.shape}
                onClick={() => {
                  setIsCycling(false);
                  setShape(btn.shape);
                }}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border:
                    shape === btn.shape ? "1px solid #333" : "1px solid #ccc",
                  background: shape === btn.shape ? "#eee" : "#fff",
                  cursor: "pointer",
                  fontSize: 15,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

/**
 * Returns up to 4 strokes for each shape.
 * Unused slots are faded via opacity: 0 to keep morphs smooth.
 */
function segmentsFor(shape: Shape): Segment[] {
  const C = 50;
  const R = 30;
  const mk = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    opacity = 1,
  ): Segment => ({
    x1,
    y1,
    x2,
    y2,
    opacity,
  });

  switch (shape) {
    case "plus":
      return [
        mk(C, C - R, C, C + R), // vertical
        mk(C - R, C, C + R, C), // horizontal
        EMPTY,
        EMPTY,
      ];

    case "x":
      return [
        mk(C - R, C - R, C + R, C + R),
        mk(C + R, C - R, C - R, C + R),
        EMPTY,
        EMPTY,
      ];

    case "asterix": {
      // 3 lines at 0°, 60°, 120° (typical asterisk)
      const ax = R * 0.5;
      const ay = R * 0.866; // sin(60°)
      return [
        mk(C - R, C, C + R, C),
        mk(C - ax, C - ay, C + ax, C + ay),
        mk(C - ax, C + ay, C + ax, C - ay),
        EMPTY,
      ];
    }

    case "arrow":
      return [
        mk(20, C, 70, C), // shaft
        mk(70, C, 80, C - 10), // head up
        mk(70, C, 80, C + 10), // head down
        EMPTY,
      ];

    case "hashtag":
      return [
        mk(40, 28, 40, 72), // |
        mk(60, 28, 60, 72), // |
        mk(28, 40, 72, 40), // —
        mk(28, 60, 72, 60), // —
      ];

    case "parallel":
      return [mk(35, 25, 70, 75), mk(25, 35, 60, 85), EMPTY, EMPTY];

    default:
      return [EMPTY, EMPTY, EMPTY, EMPTY];
  }
}
