import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
const LightingBlock = () => {
  const lightingContainerRef = useRef(null);
  const touchContainerRef = useRef(null);
  const bumpContainerRef = useRef(null);
  const windowFrameRef = useRef(null);
  const windowFrameHighlightRef = useRef(null);
  const [dimensions, setDimensions] = useState([0, 0]);
  useEffect(() => {
    const handleResize = () => {
      setDimensions([window.innerWidth, window.innerHeight]);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    const perlinNoise = (x) => {
      const t = Date.now();
      const timeOffset = -(130 * t * 0.01);
      let noise = Math.sin(+x);
      noise += 4.5 * Math.sin(2.1 * x + timeOffset);
      noise += 4 * Math.sin(1.72 * x + 1.121 * timeOffset);
      noise += 5 * Math.sin(2.221 * x + 0.437 * timeOffset);
      noise += 2.5 * Math.sin(3.1122 * x + 4.269 * timeOffset);
      noise *= 0.06;
      return noise;
    };
    const generateBumpOffset = () => {
      let offset = 0;
      let amplitude = 16;
      let frequency = 1;
      for (let i = 0; i < 1; i++) {
        offset += amplitude * perlinNoise(frequency * Date.now());
        frequency *= 2;
        amplitude *= 0.5;
      }
      return offset;
    };
    const bumpInterval = setInterval(() => {
      if (bumpContainerRef.current) {
        const offsetY = generateBumpOffset();
        const offsetX = offsetY * 0.25;
        bumpContainerRef.current.style.setProperty(
          "--bump-offset-y",
          `${offsetY}px`
        );
        bumpContainerRef.current.style.setProperty(
          "--bump-offset-x",
          `${offsetX}px`
        );
      }
    }, 800);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(bumpInterval);
    };
  }, []);
  useEffect(() => {
    console.log("Setting up mouse handler with dimensions:", dimensions);
    const handleMouseMove = (e) => {
      if (!(lightingContainerRef.current && touchContainerRef.current && windowFrameRef.current && windowFrameHighlightRef.current)) {
        return;
      }
      const [width, height] = dimensions;
      if (width === 0 || height === 0) {
        return;
      }
      const mouseX = e.clientX / width;
      const mouseY = e.clientY / height;
      const perspective = 750 + (mouseX - 0.5) * 100;
      console.log("Setting perspective to:", perspective);
      lightingContainerRef.current.style.setProperty(
        "--perspective",
        `${perspective}px`
      );
      touchContainerRef.current.style.setProperty(
        "--translate-x",
        `${-1 * mouseX}px`
      );
      touchContainerRef.current.style.setProperty(
        "--translate-y",
        `${-1 * mouseY}px`
      );
      const shadowOffset = 15 * mouseX + 30;
      const shadowStrength = 45 * mouseY;
      windowFrameRef.current.style.setProperty(
        "--shadow-offset",
        `${shadowOffset}px`
      );
      windowFrameRef.current.style.setProperty(
        "--shadow-strength",
        `${shadowStrength}px`
      );
      windowFrameHighlightRef.current.style.setProperty(
        "--shadow-strength",
        `${shadowStrength * 0.5}px`
      );
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [dimensions]);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "lighting-container", ref: lightingContainerRef }, /* @__PURE__ */ React.createElement("div", { className: "transformContainer" }, /* @__PURE__ */ React.createElement("div", { className: "bumpContainer", ref: bumpContainerRef }, /* @__PURE__ */ React.createElement("div", { className: "touchContainer", ref: touchContainerRef }, /* @__PURE__ */ React.createElement("div", { className: "sideBar" }), /* @__PURE__ */ React.createElement("div", { className: "sideBarHighlight" }), /* @__PURE__ */ React.createElement("div", { className: "topBar" }), /* @__PURE__ */ React.createElement("div", { className: "ceiling" }), /* @__PURE__ */ React.createElement("div", { className: "windowFrame", ref: windowFrameRef }, /* @__PURE__ */ React.createElement("div", { className: "contents" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "windowFrameInnerHighlight",
      ref: windowFrameHighlightRef
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "windowFrameInner" }), /* @__PURE__ */ React.createElement("div", { className: "windowInset" }), /* @__PURE__ */ React.createElement("div", { className: "windowFrameOuter" }), /* @__PURE__ */ React.createElement("div", { className: "windowFrameLedge" }), /* @__PURE__ */ React.createElement("div", { className: "blackBorder" }), /* @__PURE__ */ React.createElement("div", { className: "windowScene" }, /* @__PURE__ */ React.createElement("div", { className: "contents" }, /* @__PURE__ */ React.createElement(
    "video",
    {
      autoPlay: true,
      className: "clouds",
      loop: true,
      muted: true,
      playsInline: true,
      src: "./assets/videos/clouds.mp4"
    }
  ), /* @__PURE__ */ React.createElement(
    "video",
    {
      autoPlay: true,
      className: "video",
      loop: true,
      muted: true,
      playsInline: true,
      src: "./assets/videos/window.mp4"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "verticalBeams" }))))))))), /* @__PURE__ */ React.createElement("div", { className: "relative", style: { pointerEvents: "none" } }, /* @__PURE__ */ React.createElement("div", { className: "grain" }), /* @__PURE__ */ React.createElement("div", { className: "light" }), /* @__PURE__ */ React.createElement("div", { className: "circularLight" }), /* @__PURE__ */ React.createElement("div", { className: "artifactTop" }), /* @__PURE__ */ React.createElement("div", { className: "circularLightArtifact" }), /* @__PURE__ */ React.createElement("div", { className: "tinyCircularLight" }), /* @__PURE__ */ React.createElement("div", { className: "yummyColorGrading" }), /* @__PURE__ */ React.createElement("div", { className: "warmth" }), /* @__PURE__ */ React.createElement("div", { className: "whiteOverlay" })));
};
function App() {
  return /* @__PURE__ */ React.createElement(LightingBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
