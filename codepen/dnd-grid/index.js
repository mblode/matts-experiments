import { DndGrid, verticalCompactor } from "@dnd-grid/react";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
function useGridInteractions(options = {}) {
  const [, setHoveredId] = useState(null);
  const [, setSelectedId] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [resizeState, setResizeState] = useState(null);
  const handleDragStart = useCallback(
    (_layout, oldItem) => {
      const id = oldItem?.i ?? null;
      setHoveredId(id);
      setDragId(id);
      if (id) {
        options.onDragStart?.(id);
      }
    },
    [options]
  );
  const handleDrag = useCallback(
    (_layout, _oldItem, _newItem) => {
    },
    []
  );
  const handleDragStop = useCallback(
    (_layout, _oldItem, newItem) => {
      setDragId(null);
      if (newItem?.i) {
        options.onDragStop?.(newItem.i);
      }
    },
    [options]
  );
  const handleResizeStart = useCallback(
    (_layout, _oldItem, newItem) => {
      const id = newItem?.i ?? null;
      setHoveredId(id);
      setSelectedId(id);
      if (newItem) {
        setResizeState({ id: newItem.i, w: newItem.w, h: newItem.h });
        options.onResizeStart?.(newItem.i);
      }
    },
    [options]
  );
  const handleResize = useCallback(
    (_layout, _oldItem, newItem) => {
      if (newItem) {
        setResizeState({ id: newItem.i, w: newItem.w, h: newItem.h });
      }
    },
    []
  );
  const handleResizeStop = useCallback(
    (_layout, _oldItem, newItem) => {
      setResizeState(null);
      if (newItem?.i) {
        options.onResizeStop?.(newItem.i);
      }
    },
    [options]
  );
  const handleSelect = useCallback(
    (id) => {
      setSelectedId(id);
      options.onSelect?.(id);
    },
    [options]
  );
  const handleHover = useCallback(
    (id) => {
      if (!(resizeState || dragId)) {
        setHoveredId(id);
        options.onHover?.(id);
      }
    },
    [resizeState, dragId, options]
  );
  return {
    handleDragStart,
    handleDrag,
    handleDragStop,
    handleResizeStart,
    handleResize,
    handleResizeStop,
    handleSelect,
    handleHover,
    setHoveredId,
    setSelectedId
  };
}
const BLOCK_GAP = 16;
const BLOCK_HEIGHT = 24;
const BLOCK_COLUMNS = 4;
const DEFAULT_WIDTH = 480;
const MAX_WIDTH = 643;
const DEFAULT_GRID_ROWS = 12;
const DEFAULT_GRID_HEIGHT = DEFAULT_GRID_ROWS * BLOCK_HEIGHT + (DEFAULT_GRID_ROWS - 1) * BLOCK_GAP + BLOCK_GAP * 2;
const initialLayout = [
  { i: "a", x: 0, y: 0, w: 2, h: 6 },
  { i: "b", x: 2, y: 0, w: 1, h: 3 },
  { i: "c", x: 3, y: 0, w: 1, h: 3 },
  { i: "d", x: 2, y: 3, w: 2, h: 4 },
  { i: "e", x: 0, y: 6, w: 1, h: 4 },
  { i: "f", x: 1, y: 6, w: 1, h: 4 },
  { i: "g", x: 2, y: 7, w: 2, h: 3 },
  { i: "h", x: 0, y: 10, w: 4, h: 2 }
];
const DndGridBlock = () => {
  const [layout, setLayout] = useState(initialLayout);
  const handlers = useGridInteractions();
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const isResizingRef = useRef(false);
  const pendingWidthRef = useRef(null);
  const resizeRafRef = useRef(null);
  const commitContainerWidth = useCallback((nextWidth) => {
    setContainerWidth((prev) => prev === nextWidth ? prev : nextWidth);
  }, []);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const nextWidth = Math.round(entry.contentRect.width);
        pendingWidthRef.current = nextWidth;
        if (isResizingRef.current) {
          continue;
        }
        if (resizeRafRef.current !== null) {
          cancelAnimationFrame(resizeRafRef.current);
        }
        resizeRafRef.current = requestAnimationFrame(() => {
          resizeRafRef.current = null;
          if (pendingWidthRef.current === null) {
            return;
          }
          commitContainerWidth(pendingWidthRef.current);
        });
      }
    });
    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
      if (resizeRafRef.current !== null) {
        cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }
    };
  }, [commitContainerWidth]);
  const scaleFactor = useMemo(() => {
    const width = containerWidth ?? DEFAULT_WIDTH;
    return Math.min(width, MAX_WIDTH) / DEFAULT_WIDTH;
  }, [containerWidth]);
  const margin = BLOCK_GAP * scaleFactor;
  const handleResizeStart = useCallback(
    (...args) => {
      isResizingRef.current = true;
      handlers.handleResizeStart(...args);
    },
    [handlers]
  );
  const handleResizeStop = useCallback(
    (...args) => {
      handlers.handleResizeStop(...args);
      isResizingRef.current = false;
      if (pendingWidthRef.current !== null) {
        commitContainerWidth(pendingWidthRef.current);
      }
    },
    [handlers, commitContainerWidth]
  );
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "mx-auto w-full",
      ref: containerRef,
      style: { maxWidth: MAX_WIDTH }
    },
    containerWidth !== null && containerWidth > 0 ? /* @__PURE__ */ React.createElement(
      DndGrid,
      {
        cols: BLOCK_COLUMNS,
        compactor: { ...verticalCompactor },
        layout,
        margin,
        onDrag: handlers.handleDrag,
        onDragStart: handlers.handleDragStart,
        onDragStop: handlers.handleDragStop,
        onLayoutChange: setLayout,
        onResize: handlers.handleResize,
        onResizeStart: handleResizeStart,
        onResizeStop: handleResizeStop,
        resizeHandles: ["ne", "nw", "se", "sw"],
        rowHeight: BLOCK_HEIGHT * scaleFactor,
        width: containerWidth
      },
      layout.map((item) => {
        return /* @__PURE__ */ React.createElement(
          "button",
          {
            "aria-label": `Block ${item.i}`,
            className: "select-none p-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            key: item.i,
            onClick: () => handlers.handleSelect(item.i),
            onPointerEnter: () => handlers.handleHover(item.i),
            onPointerLeave: () => handlers.handleHover(null),
            type: "button"
          },
          item.i
        );
      })
    ) : /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "w-full rounded-3xl border border-border/60 bg-muted/40",
        style: { height: DEFAULT_GRID_HEIGHT }
      }
    )
  );
};
function App() {
  return /* @__PURE__ */ React.createElement(BLOCK_GAP, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
