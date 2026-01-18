import * as React from "react";
import { Children, useCallback, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
const PI = Math.PI;
const A90 = PI / 2;
function point2D(x, y) {
  return { x, y };
}
function rad(degrees) {
  return degrees / 180 * PI;
}
function deg(radians) {
  return radians / PI * 180;
}
function bezier(p1, p2, p3, p4, t) {
  const mum1 = 1 - t;
  const mum13 = mum1 * mum1 * mum1;
  const mu3 = t * t * t;
  return point2D(
    Math.round(
      mum13 * p1.x + 3 * t * mum1 * mum1 * p2.x + 3 * t * t * mum1 * p3.x + mu3 * p4.x
    ),
    Math.round(
      mum13 * p1.y + 3 * t * mum1 * mum1 * p2.y + 3 * t * t * mum1 * p3.y + mu3 * p4.y
    )
  );
}
function getCornerPosition(width, height) {
  return point2D(width, height);
}
function getFlipEndPosition(_width, height) {
  return point2D(0, height);
}
function calculateFold(point, width, height, wrapperHeight) {
  const h = wrapperHeight ?? Math.sqrt(width * width + height * height);
  const o = point2D(width, height);
  const left = false;
  const top = false;
  const clampedX = Math.min(point.x, width - 1);
  const clampedPoint = point2D(clampedX, point.y);
  const rel = point2D(
    o.x ? o.x - clampedPoint.x : clampedPoint.x,
    o.y ? o.y - clampedPoint.y : clampedPoint.y
  );
  const tan = Math.atan2(rel.y, rel.x);
  const alpha = A90 - tan;
  const angle = deg(alpha);
  const middle = point2D(
    left ? width - rel.x / 2 : point.x + rel.x / 2,
    rel.y / 2
  );
  const gamma = alpha - Math.atan2(middle.y, middle.x);
  const distance2 = Math.max(
    0,
    Math.sin(gamma) * Math.sqrt(middle.x * middle.x + middle.y * middle.y)
  );
  let tr = point2D(distance2 * Math.sin(alpha), distance2 * Math.cos(alpha));
  let mv = point2D(0, 0);
  if (alpha > A90) {
    tr.x += Math.abs(tr.y * Math.tan(tan));
    tr.y = 0;
    if (Math.round(tr.x * Math.tan(PI - alpha)) < height) {
      const newY = Math.sqrt(height * height + 2 * middle.x * rel.x);
      const correctedPoint = point2D(clampedX, top ? height - newY : newY);
      return calculateFold(correctedPoint, width, height, wrapperHeight);
    }
    const beta = PI - alpha;
    const dd = h - height / Math.sin(beta);
    mv = point2D(
      Math.round(dd * Math.cos(beta)) * (left ? -1 : 1),
      Math.round(dd * Math.sin(beta)) * (top ? -1 : 1)
    );
  }
  const px = Math.round(tr.y / Math.tan(alpha) + tr.x);
  const side = width - px;
  const sideX = side * Math.cos(alpha * 2);
  const sideY = side * Math.sin(alpha * 2);
  const df = point2D(
    Math.round(left ? side - sideX : px + sideX),
    Math.round(top ? sideY : height - sideY)
  );
  const gradientSize = side * Math.sin(alpha);
  const endPoint = getFlipEndPosition(width, height);
  const far = Math.sqrt(
    (endPoint.x - point.x) ** 2 + (endPoint.y - point.y) ** 2
  );
  const gradientOpacity = far < width ? far / width : 1;
  const gradientStartV = gradientSize > 100 ? (gradientSize - 100) / gradientSize : 0;
  tr = point2D(Math.round(tr.x), Math.round(tr.y));
  return {
    angle,
    alpha,
    translate: tr,
    movement: mv,
    px,
    df,
    gradientOpacity,
    gradientSize,
    gradientStartV
  };
}
function distance(p1, p2) {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}
function calculateWrapperHeight(width, height) {
  return Math.sqrt(width * width + height * height);
}
function lerp(p1, p2, t) {
  return point2D(p1.x + (p2.x - p1.x) * t, p1.y + (p2.y - p1.y) * t);
}
function has3dSupport() {
  if (typeof window === "undefined") {
    return true;
  }
  return "WebKitCSSMatrix" in window || "MozPerspective" in document.body.style || "perspective" in document.body.style;
}
const has3d = has3dSupport();
function translate(x, y, use3d = true) {
  return has3d && use3d ? ` translate3d(${x}px, ${y}px, 0px) ` : ` translate(${x}px, ${y}px) `;
}
function rotate(degrees) {
  return ` rotate(${degrees}deg) `;
}
function createGradient(p0, p1, stops) {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const angle = Math.atan2(dy, dx);
  const angleDeg = angle * 180 / Math.PI;
  const colorStops = stops.map((stop) => `${stop.color} ${stop.position * 100}%`).join(", ");
  return `linear-gradient(${angleDeg}deg, ${colorStops})`;
}
function createFrontGradient(geometry, width, height) {
  const { gradientOpacity, gradientSize, gradientStartV, alpha } = geometry;
  const A902 = Math.PI / 2;
  const p0 = { x: 0, y: 100 };
  const p1 = {
    x: gradientSize * Math.sin(A902 - alpha) / height * 100,
    y: 100 - gradientSize * Math.cos(A902 - alpha) / width * 100
  };
  const stops = [
    { position: gradientStartV, color: "rgba(0,0,0,0)" },
    {
      position: (1 - gradientStartV) * 0.8 + gradientStartV,
      color: `rgba(0,0,0,${0.2 * gradientOpacity})`
    },
    { position: 1, color: `rgba(255,255,255,${0.2 * gradientOpacity})` }
  ];
  return {
    position: "absolute",
    inset: 0,
    background: createGradient(p0, p1, stops),
    pointerEvents: "none"
  };
}
function createBackGradient(geometry, width, height) {
  const { gradientOpacity, gradientSize, alpha } = geometry;
  const p0 = { x: 100, y: 100 };
  const p1 = {
    x: 100 - gradientSize * Math.sin(alpha) / width * 100,
    y: 100 - gradientSize * Math.cos(alpha) / height * 100
  };
  const stops = [
    { position: 0.8, color: "rgba(0,0,0,0)" },
    { position: 1, color: `rgba(0,0,0,${0.3 * gradientOpacity})` }
  ];
  return {
    position: "absolute",
    inset: 0,
    background: createGradient(p0, p1, stops),
    pointerEvents: "none"
  };
}
function generatePageTransforms(geometry, width, height, wrapperHeight, showGradients) {
  const { angle, translate: tr, movement: mv, df } = geometry;
  const a = angle;
  const mvW = (width - wrapperHeight) * 0 / 100;
  const mvH = (height - wrapperHeight) * 100 / 100;
  const aliasingFk = a !== 90 && a !== -90 ? 1 : 0;
  const container = {
    position: "relative",
    width,
    height,
    overflow: "hidden"
  };
  const wrapper = {
    position: "absolute",
    left: 0,
    bottom: 0,
    width,
    height,
    overflow: "hidden",
    transform: `${translate(-tr.x + mvW - aliasingFk, -tr.y + mvH)}${rotate(-a)}`,
    transformOrigin: "0% 100%",
    zIndex: 2
  };
  const currentPage = {
    position: "absolute",
    top: 0,
    right: 0,
    left: "auto",
    bottom: "auto",
    width,
    height,
    transform: `${rotate(a)}${translate(tr.x + aliasingFk, tr.y)}`,
    transformOrigin: "0% 100%"
  };
  const foldWrapper = {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: wrapperHeight,
    height: wrapperHeight,
    overflow: "hidden",
    transform: `${translate(-tr.x + mv.x + mvW, -tr.y + mv.y + mvH)}${rotate(-a)}`,
    transformOrigin: "0% 100%",
    zIndex: 3
  };
  const foldPageContainer = {
    position: "absolute",
    top: "auto",
    right: "auto",
    left: 0,
    bottom: 0,
    width,
    height,
    overflow: "visible",
    transform: `${rotate(a)}${translate(tr.x + df.x - mv.x, tr.y + df.y - mv.y)}`,
    transformOrigin: "0% 100%"
  };
  const foldPage = {
    position: "absolute",
    top: 0,
    left: 0,
    width: height,
    // Note: swapped dimensions for rotation
    height: width,
    transform: rotate(90 - a * 2),
    transformOrigin: "0% 0%"
  };
  const folding = {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    transform: `${rotate(90)}${translate(0, -height)}`,
    transformOrigin: "0% 0%"
  };
  const frontGradient = showGradients ? createFrontGradient(geometry, width, height) : { display: "none" };
  const backGradient = showGradients ? createBackGradient(geometry, width, height) : { display: "none" };
  return {
    container,
    wrapper,
    currentPage,
    foldWrapper,
    foldPageContainer,
    foldPage,
    folding,
    frontGradient,
    backGradient
  };
}
function generateFoldingTransform(height) {
  return {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transform: `${rotate(90)}${translate(0, -height)}`,
    transformOrigin: "0% 0%"
  };
}
const QUICK_FLIP_THRESHOLD = 200;
function useCornerDetection({
  containerRef,
  cornerSize,
  width,
  height,
  enabled,
  onCornerActivated,
  onPointerMove,
  onPointerRelease,
  onPointerLeave
}) {
  const [isInCorner, setIsInCorner] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [pointerPosition, setPointerPosition] = useState(null);
  const pressTimeRef = useRef(0);
  const getPointerPosition = useCallback(
    (e) => {
      if (!containerRef.current) {
        return null;
      }
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, e.clientX - rect.left);
      const y = Math.max(0, e.clientY - rect.top);
      return point2D(x, y);
    },
    [containerRef]
  );
  const isInCornerZone = useCallback(
    (pos) => {
      if (pos.x <= 0 || pos.y <= 0 || pos.x >= width || pos.y >= height) {
        return false;
      }
      const inBottomZone = pos.y >= height - cornerSize;
      const inRightZone = pos.x >= width - cornerSize;
      return inBottomZone && inRightZone;
    },
    [width, height, cornerSize]
  );
  const onPointerDown = useCallback(
    (e) => {
      if (!enabled) {
        return;
      }
      const pos = getPointerPosition(e);
      if (!pos) {
        return;
      }
      if (isInCornerZone(pos)) {
        e.target.setPointerCapture?.(e.pointerId);
        setIsPressed(true);
        setIsInCorner(true);
        setPointerPosition(pos);
        pressTimeRef.current = Date.now();
        onCornerActivated?.(pos);
        e.preventDefault();
      }
    },
    [enabled, getPointerPosition, isInCornerZone, onCornerActivated]
  );
  const onPointerMoveHandler = useCallback(
    (e) => {
      if (!enabled) {
        return;
      }
      const pos = getPointerPosition(e);
      if (!pos) {
        return;
      }
      if (isPressed) {
        setPointerPosition(pos);
        onPointerMove?.(pos);
      } else {
        const inCorner = isInCornerZone(pos);
        if (inCorner !== isInCorner) {
          setIsInCorner(inCorner);
          if (inCorner) {
            const origin = point2D(
              width - cornerSize / 2,
              height - cornerSize / 2
            );
            setPointerPosition(origin);
            onCornerActivated?.(origin);
          } else {
            setPointerPosition(null);
            onPointerLeave?.();
          }
        }
      }
    },
    [
      enabled,
      getPointerPosition,
      isInCornerZone,
      isPressed,
      isInCorner,
      width,
      height,
      cornerSize,
      onPointerMove,
      onCornerActivated,
      onPointerLeave
    ]
  );
  const onPointerUp = useCallback(
    (e) => {
      if (!(enabled && isPressed)) {
        return;
      }
      e.target.releasePointerCapture?.(e.pointerId);
      const pos = getPointerPosition(e);
      const releaseTime = Date.now();
      const pressDuration = releaseTime - pressTimeRef.current;
      const wasQuickFlip = pressDuration < QUICK_FLIP_THRESHOLD || Boolean(pos && (pos.x < 0 || pos.x > width));
      setIsPressed(false);
      setIsInCorner(false);
      setPointerPosition(null);
      if (pos) {
        onPointerRelease?.(pos, wasQuickFlip);
      }
    },
    [enabled, isPressed, getPointerPosition, onPointerRelease, width]
  );
  const onPointerLeaveHandler = useCallback(
    (_e) => {
      if (!enabled) {
        return;
      }
      if (!isPressed) {
        setIsInCorner(false);
        setPointerPosition(null);
        onPointerLeave?.();
      }
    },
    [enabled, isPressed, onPointerLeave]
  );
  return {
    isInCorner,
    pointerPosition,
    isPressed,
    handlers: {
      onPointerDown,
      onPointerMove: onPointerMoveHandler,
      onPointerUp,
      onPointerLeave: onPointerLeaveHandler
    }
  };
}
function circularEaseOut(t, b, c, d) {
  const normalizedT = t / d - 1;
  return c * Math.sqrt(1 - normalizedT * normalizedT) + b;
}
function easeOut(progress) {
  return circularEaseOut(progress, 0, 1, 1);
}
function useFlipAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);
  const configRef = useRef(null);
  const startTimeRef = useRef(0);
  const stop = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    configRef.current = null;
    setIsAnimating(false);
  }, []);
  const animate = useCallback(
    (config) => {
      stop();
      configRef.current = config;
      startTimeRef.current = 0;
      setIsAnimating(true);
      const { from, to, duration, onFrame, onComplete, useBezier } = config;
      const tick = (timestamp) => {
        if (startTimeRef.current === 0) {
          startTimeRef.current = timestamp;
        }
        const elapsed = timestamp - startTimeRef.current;
        const rawProgress = Math.min(1, elapsed / duration);
        const easedProgress = easeOut(rawProgress);
        let currentPoint;
        if (useBezier) {
          const p1 = from;
          const p4 = to;
          currentPoint = bezier(p1, p1, p4, p4, easedProgress);
        } else {
          currentPoint = lerp(from, to, easedProgress);
        }
        onFrame(currentPoint);
        if (rawProgress < 1) {
          animationRef.current = requestAnimationFrame(tick);
        } else {
          animationRef.current = null;
          configRef.current = null;
          setIsAnimating(false);
          onComplete();
        }
      };
      animationRef.current = requestAnimationFrame(tick);
    },
    [stop]
  );
  return {
    animate,
    stop,
    isAnimating
  };
}
function animateAsync(animateFn, config) {
  return new Promise((resolve) => {
    animateFn({
      ...config,
      onComplete: resolve
    });
  });
}
const DEFAULT_DURATION = 600;
const DEFAULT_CORNER_SIZE = 100;
function useFlipbook({
  totalPages,
  width,
  height,
  initialPage = 0,
  duration = DEFAULT_DURATION,
  cornerSize = DEFAULT_CORNER_SIZE,
  gradients = true,
  onPageChange
}) {
  const containerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [flipState, setFlipState] = useState({
    isFlipping: false,
    isDragging: false,
    progress: 0,
    currentPage: initialPage,
    foldPoint: null
  });
  const wrapperHeight = useMemo(
    () => calculateWrapperHeight(width, height),
    [width, height]
  );
  const { animate, stop: _stopAnimation, isAnimating } = useFlipAnimation();
  const foldGeometry = useMemo(() => {
    if (!flipState.foldPoint) {
      return null;
    }
    return calculateFold(flipState.foldPoint, width, height, wrapperHeight);
  }, [flipState.foldPoint, width, height, wrapperHeight]);
  const pageTransforms = useMemo(() => {
    if (!foldGeometry) {
      return null;
    }
    return generatePageTransforms(
      foldGeometry,
      width,
      height,
      wrapperHeight,
      gradients
    );
  }, [foldGeometry, width, height, wrapperHeight, gradients]);
  const completePageTurn = useCallback(() => {
    const nextPage2 = currentPage + 1;
    if (nextPage2 >= totalPages) {
      return;
    }
    setCurrentPage(nextPage2);
    setFlipState((prev) => ({
      ...prev,
      isFlipping: false,
      isDragging: false,
      progress: 0,
      currentPage: nextPage2,
      foldPoint: null
    }));
    onPageChange?.(nextPage2);
  }, [currentPage, totalPages, onPageChange]);
  const cancelPageTurn = useCallback(() => {
    setFlipState((prev) => ({
      ...prev,
      isFlipping: false,
      isDragging: false,
      progress: 0,
      foldPoint: null
    }));
  }, []);
  const nextPage = useCallback(() => {
    if (currentPage >= totalPages - 1) {
      return;
    }
    if (isAnimating) {
      return;
    }
    const cornerPos = getCornerPosition(width, height);
    const endPos = getFlipEndPosition(width, height);
    setFlipState((prev) => ({
      ...prev,
      isFlipping: true,
      isDragging: false,
      foldPoint: cornerPos
    }));
    animate({
      from: cornerPos,
      to: endPos,
      duration,
      useBezier: true,
      onFrame: (point) => {
        setFlipState((prev) => ({
          ...prev,
          foldPoint: point
        }));
      },
      onComplete: completePageTurn
    });
  }, [
    currentPage,
    totalPages,
    width,
    height,
    duration,
    isAnimating,
    animate,
    completePageTurn
  ]);
  const previousPage = useCallback(() => {
    if (currentPage <= 0) {
      return;
    }
    const prevPage = currentPage - 1;
    setCurrentPage(prevPage);
    setFlipState((prev) => ({
      ...prev,
      currentPage: prevPage
    }));
    onPageChange?.(prevPage);
  }, [currentPage, onPageChange]);
  const goToPage = useCallback(
    (page) => {
      if (page < 0 || page >= totalPages) {
        return;
      }
      if (page === currentPage) {
        return;
      }
      setCurrentPage(page);
      setFlipState((prev) => ({
        ...prev,
        currentPage: page
      }));
      onPageChange?.(page);
    },
    [totalPages, currentPage, onPageChange]
  );
  const handleCornerActivated = useCallback(
    (point) => {
      if (currentPage >= totalPages - 1) {
        return;
      }
      if (isAnimating) {
        return;
      }
      setFlipState((prev) => ({
        ...prev,
        isFlipping: true,
        isDragging: true,
        foldPoint: point
      }));
    },
    [currentPage, totalPages, isAnimating]
  );
  const handlePointerMove = useCallback(
    (point) => {
      if (!flipState.isDragging) {
        return;
      }
      setFlipState((prev) => ({
        ...prev,
        foldPoint: point
      }));
    },
    [flipState.isDragging]
  );
  const handlePointerRelease = useCallback(
    (point, wasQuickFlip) => {
      if (!flipState.isFlipping) {
        return;
      }
      const shouldComplete = wasQuickFlip || point.x < 0;
      if (shouldComplete && currentPage < totalPages - 1) {
        const endPos = getFlipEndPosition(width, height);
        animate({
          from: point,
          to: endPos,
          duration: duration / 2,
          // Faster completion
          useBezier: false,
          onFrame: (p) => {
            setFlipState((prev) => ({
              ...prev,
              isDragging: false,
              foldPoint: p
            }));
          },
          onComplete: completePageTurn
        });
      } else {
        const cornerPos = getCornerPosition(width, height);
        animate({
          from: point,
          to: cornerPos,
          duration: duration / 2,
          // Faster cancel
          useBezier: false,
          onFrame: (p) => {
            setFlipState((prev) => ({
              ...prev,
              isDragging: false,
              foldPoint: p
            }));
          },
          onComplete: cancelPageTurn
        });
      }
    },
    [
      flipState.isFlipping,
      currentPage,
      totalPages,
      width,
      height,
      duration,
      animate,
      completePageTurn,
      cancelPageTurn
    ]
  );
  const handlePointerLeave = useCallback(() => {
    if (flipState.isDragging) {
      return;
    }
    if (flipState.isFlipping && !isAnimating) {
      cancelPageTurn();
    }
  }, [flipState.isDragging, flipState.isFlipping, isAnimating, cancelPageTurn]);
  const { handlers } = useCornerDetection({
    containerRef,
    cornerSize,
    width,
    height,
    enabled: currentPage < totalPages - 1,
    onCornerActivated: handleCornerActivated,
    onPointerMove: handlePointerMove,
    onPointerRelease: handlePointerRelease,
    onPointerLeave: handlePointerLeave
  });
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  return {
    containerRef,
    currentPage,
    flipState,
    foldGeometry,
    pageTransforms,
    nextPage,
    previousPage,
    goToPage,
    // Expose handlers for component to attach
    _handlers: handlers
  };
}
function Flipbook({
  width,
  height,
  duration = 600,
  cornerSize = 100,
  gradients = true,
  children,
  onPageChange,
  className
}) {
  const pages = useMemo(() => Children.toArray(children), [children]);
  const {
    containerRef,
    currentPage,
    flipState,
    foldGeometry,
    pageTransforms,
    nextPage: _nextPage,
    previousPage: _previousPage,
    goToPage: _goToPage,
    _handlers
  } = useFlipbook({
    totalPages: pages.length,
    width,
    height,
    duration,
    cornerSize,
    gradients,
    onPageChange
  });
  const _wrapperHeight = useMemo(
    () => calculateWrapperHeight(width, height),
    [width, height]
  );
  const showFlipAnimation = flipState.isFlipping && foldGeometry && pageTransforms;
  const hasNextPage = currentPage < pages.length - 1;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className,
      ref: containerRef,
      style: {
        position: "relative",
        width,
        height,
        overflow: "hidden",
        perspective: "2000px",
        touchAction: "none",
        // Prevent browser gestures
        userSelect: "none"
      },
      ..._handlers
    },
    hasNextPage && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "flipbook-page flipbook-page-next",
        style: {
          position: "absolute",
          inset: 0,
          width,
          height,
          zIndex: 1,
          overflow: "hidden"
        }
      },
      pages[currentPage + 1]
    ),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "flipbook-wrapper",
        style: showFlipAnimation ? pageTransforms.wrapper : {
          position: "absolute",
          inset: 0,
          width,
          height,
          zIndex: 2,
          overflow: "hidden"
        }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "flipbook-page flipbook-page-current",
          style: showFlipAnimation ? {
            ...pageTransforms.currentPage,
            overflow: "hidden"
          } : {
            position: "absolute",
            inset: 0,
            width,
            height,
            overflow: "hidden"
          }
        },
        pages[currentPage],
        showFlipAnimation && gradients && /* @__PURE__ */ React.createElement(
          "div",
          {
            className: "flipbook-gradient-front",
            style: pageTransforms.frontGradient
          }
        )
      )
    ),
    showFlipAnimation && hasNextPage && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "flipbook-fold-wrapper",
        style: pageTransforms.foldWrapper
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "flipbook-fold-page-container",
          style: pageTransforms.foldPageContainer
        },
        /* @__PURE__ */ React.createElement("div", { className: "flipbook-fold-page", style: pageTransforms.foldPage }, /* @__PURE__ */ React.createElement("div", { className: "flipbook-folding", style: pageTransforms.folding }, pages[currentPage + 1]), gradients && /* @__PURE__ */ React.createElement(
          "div",
          {
            className: "flipbook-gradient-back",
            style: pageTransforms.backGradient
          }
        ))
      )
    ),
    hasNextPage && !flipState.isFlipping && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "flipbook-corner-hint",
        style: {
          position: "absolute",
          right: 0,
          bottom: 0,
          width: cornerSize,
          height: cornerSize,
          cursor: "pointer",
          zIndex: 10
        }
      }
    )
  );
}
function StickyNotes2Block() {
  return /* @__PURE__ */ React.createElement(
    Flipbook,
    {
      cornerSize: 100,
      duration: 600,
      gradients: true,
      height: 300,
      onPageChange: (page) => console.log("Page changed to:", page),
      width: 400
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex h-full w-full items-center justify-center bg-yellow-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("h2", { className: "mb-2 font-bold text-xl text-yellow-800" }, "Page 1"), /* @__PURE__ */ React.createElement("p", { className: "text-yellow-700" }, "Drag the bottom-right corner to flip"))),
    /* @__PURE__ */ React.createElement("div", { className: "flex h-full w-full items-center justify-center bg-blue-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("h2", { className: "mb-2 font-bold text-blue-800 text-xl" }, "Page 2"), /* @__PURE__ */ React.createElement("p", { className: "text-blue-700" }, "Keep flipping to see more pages"))),
    /* @__PURE__ */ React.createElement("div", { className: "flex h-full w-full items-center justify-center bg-purple-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("h2", { className: "mb-2 font-bold text-purple-800 text-xl" }, "Page 3"), /* @__PURE__ */ React.createElement("p", { className: "text-purple-700" }, "Almost there!"))),
    /* @__PURE__ */ React.createElement("div", { className: "flex h-full w-full items-center justify-center bg-pink-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("h2", { className: "mb-2 font-bold text-pink-800 text-xl" }, "Page 4"), /* @__PURE__ */ React.createElement("p", { className: "text-pink-700" }, "Last page - all done!")))
  );
}
function App() {
  return /* @__PURE__ */ React.createElement(StickyNotes2Block, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
