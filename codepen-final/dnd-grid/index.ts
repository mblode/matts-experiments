// CodePen packages: @dnd-grid/react@^1.1.0, react-dom@19.2.3, react@19.2.3

import { DndGrid, verticalCompactor, type Layout, type LayoutItem } from "@dnd-grid/react";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

interface ResizeState {
  id: string;
  w: number;
  h: number;
}

interface GridInteractionsHandlers {
  handleDragStart: (
    layout: Layout,
    oldItem: LayoutItem | null | undefined,
    newItem: LayoutItem | null | undefined,
    placeholder: LayoutItem | null | undefined,
    event: Event,
    node: HTMLElement | null | undefined
  ) => void;
  handleDrag: (
    layout: Layout,
    oldItem: LayoutItem | null | undefined,
    newItem: LayoutItem | null | undefined,
    placeholder: LayoutItem | null | undefined,
    event: Event,
    node: HTMLElement | null | undefined
  ) => void;
  handleDragStop: (
    layout: Layout,
    oldItem: LayoutItem | null | undefined,
    newItem: LayoutItem | null | undefined,
    placeholder: LayoutItem | null | undefined,
    event: Event,
    node: HTMLElement | null | undefined
  ) => void;
  handleResizeStart: (
    layout: Layout,
    oldItem: LayoutItem | null | undefined,
    newItem: LayoutItem | null | undefined,
    placeholder: LayoutItem | null | undefined,
    event: Event,
    node: HTMLElement | null | undefined
  ) => void;
  handleResize: (
    layout: Layout,
    oldItem: LayoutItem | null | undefined,
    newItem: LayoutItem | null | undefined,
    placeholder: LayoutItem | null | undefined,
    event: Event,
    node: HTMLElement | null | undefined
  ) => void;
  handleResizeStop: (
    layout: Layout,
    oldItem: LayoutItem | null | undefined,
    newItem: LayoutItem | null | undefined,
    placeholder: LayoutItem | null | undefined,
    event: Event,
    node: HTMLElement | null | undefined
  ) => void;
  handleSelect: (id: string) => void;
  handleHover: (id: string | null) => void;
  setHoveredId: (id: string | null) => void;
  setSelectedId: (id: string | null) => void;
}

interface UseGridInteractionsOptions {
  onDragStart?: (id: string) => void;
  onDragStop?: (id: string) => void;
  onResizeStart?: (id: string) => void;
  onResizeStop?: (id: string) => void;
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
}

function useGridInteractions(
  options: UseGridInteractionsOptions = {}
): GridInteractionsHandlers {
  const [, setHoveredId] = useState<string | null>(null);
  const [, setSelectedId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);

  const handleDragStart = useCallback(
    (_layout: Layout, oldItem: LayoutItem | null | undefined) => {
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
    (
      _layout: Layout,
      _oldItem: LayoutItem | null | undefined,
      _newItem: LayoutItem | null | undefined
    ) => {
      // Can be extended for edge scroll or other drag-time behaviors
    },
    []
  );

  const handleDragStop = useCallback(
    (
      _layout: Layout,
      _oldItem: LayoutItem | null | undefined,
      newItem: LayoutItem | null | undefined
    ) => {
      setDragId(null);
      if (newItem?.i) {
        options.onDragStop?.(newItem.i);
      }
    },
    [options]
  );

  const handleResizeStart = useCallback(
    (
      _layout: Layout,
      _oldItem: LayoutItem | null | undefined,
      newItem: LayoutItem | null | undefined
    ) => {
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
    (
      _layout: Layout,
      _oldItem: LayoutItem | null | undefined,
      newItem: LayoutItem | null | undefined
    ) => {
      if (newItem) {
        setResizeState({ id: newItem.i, w: newItem.w, h: newItem.h });
      }
    },
    []
  );

  const handleResizeStop = useCallback(
    (
      _layout: Layout,
      _oldItem: LayoutItem | null | undefined,
      newItem: LayoutItem | null | undefined
    ) => {
      setResizeState(null);
      if (newItem?.i) {
        options.onResizeStop?.(newItem.i);
      }
    },
    [options]
  );

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      options.onSelect?.(id);
    },
    [options]
  );

  const handleHover = useCallback(
    (id: string | null) => {
      // Don't update hover during drag or resize operations
      if (!(resizeState || dragId)) {
        setHoveredId(id);
        options.onHover?.(id);
      }
    },
    [resizeState, dragId, options]
  );

  return {
    handleDragStart:
      handleDragStart as GridInteractionsHandlers["handleDragStart"],
    handleDrag: handleDrag as GridInteractionsHandlers["handleDrag"],
    handleDragStop:
      handleDragStop as GridInteractionsHandlers["handleDragStop"],
    handleResizeStart:
      handleResizeStart as GridInteractionsHandlers["handleResizeStart"],
    handleResize: handleResize as GridInteractionsHandlers["handleResize"],
    handleResizeStop:
      handleResizeStop as GridInteractionsHandlers["handleResizeStop"],
    handleSelect,
    handleHover,
    setHoveredId,
    setSelectedId,
  };
}

const BLOCK_GAP = 16;
const BLOCK_HEIGHT = 24;
const BLOCK_COLUMNS = 4;
const DEFAULT_WIDTH = 480;
const MAX_WIDTH = 643;
const DEFAULT_GRID_ROWS = 12;
const DEFAULT_GRID_HEIGHT =
  DEFAULT_GRID_ROWS * BLOCK_HEIGHT +
  (DEFAULT_GRID_ROWS - 1) * BLOCK_GAP +
  BLOCK_GAP * 2;

const initialLayout: Layout = [
  { i: "a", x: 0, y: 0, w: 2, h: 6 },
  { i: "b", x: 2, y: 0, w: 1, h: 3 },
  { i: "c", x: 3, y: 0, w: 1, h: 3 },
  { i: "d", x: 2, y: 3, w: 2, h: 4 },
  { i: "e", x: 0, y: 6, w: 1, h: 4 },
  { i: "f", x: 1, y: 6, w: 1, h: 4 },
  { i: "g", x: 2, y: 7, w: 2, h: 3 },
  { i: "h", x: 0, y: 10, w: 4, h: 2 },
];

const DndGridBlock = () => {
  const [layout, setLayout] = useState<Layout>(initialLayout);
  const handlers = useGridInteractions();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  // Prevent ResizeObserver feedback loops while grid items are being resized.
  const isResizingRef = useRef(false);
  const pendingWidthRef = useRef<number | null>(null);
  const resizeRafRef = useRef<number | null>(null);

  const commitContainerWidth = useCallback((nextWidth: number) => {
    setContainerWidth((prev) => (prev === nextWidth ? prev : nextWidth));
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
  const handleResizeStart: typeof handlers.handleResizeStart = useCallback(
    (...args) => {
      isResizingRef.current = true;
      handlers.handleResizeStart(...args);
    },
    [handlers]
  );
  const handleResizeStop: typeof handlers.handleResizeStop = useCallback(
    (...args) => {
      handlers.handleResizeStop(...args);
      isResizingRef.current = false;
      if (pendingWidthRef.current !== null) {
        commitContainerWidth(pendingWidthRef.current);
      }
    },
    [handlers, commitContainerWidth]
  );

  return (
    <div
      className="mx-auto w-full"
      ref={containerRef}
      style={{ maxWidth: MAX_WIDTH }}
    >
      {containerWidth !== null && containerWidth > 0 ? (
        <DndGrid
          cols={BLOCK_COLUMNS}
          compactor={{ ...verticalCompactor }}
          layout={layout}
          margin={margin}
          onDrag={handlers.handleDrag}
          onDragStart={handlers.handleDragStart}
          onDragStop={handlers.handleDragStop}
          onLayoutChange={setLayout}
          onResize={handlers.handleResize}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
          resizeHandles={["ne", "nw", "se", "sw"]}
          rowHeight={BLOCK_HEIGHT * scaleFactor}
          width={containerWidth}
        >
          {layout.map((item) => {
            return (
              <button
                aria-label={`Block ${item.i}`}
                className="select-none p-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                key={item.i}
                onClick={() => handlers.handleSelect(item.i)}
                onPointerEnter={() => handlers.handleHover(item.i)}
                onPointerLeave={() => handlers.handleHover(null)}
                type="button"
              >
                {item.i}
              </button>
            );
          })}
        </DndGrid>
      ) : (
        <div
          className="w-full rounded-3xl border border-border/60 bg-muted/40"
          style={{ height: DEFAULT_GRID_HEIGHT }}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <DndGridBlock />
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
