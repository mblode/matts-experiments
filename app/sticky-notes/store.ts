import { create } from "zustand";

export interface Vec2 {
  x: number;
  y: number;
}

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface PathData {
  points: Point[];
  color: string;
  size: number;
}

export interface StickyNote {
  id: string;
  color: string;
  paths: PathData[];
  createdAt: Date;
}

export type PeelEdge = "top" | "right" | "bottom" | "left" | null;
export type AnimationState = "idle" | "dragging" | "completing" | "cancelling";

interface StickyNotesStore {
  // Notes stack (index 0 = top)
  notes: StickyNote[];
  currentColor: string;

  // Peel state
  isPeeling: boolean;
  peelEdge: PeelEdge;
  clickPos: Vec2; // Where drag started (0-1 normalized)
  dragPos: Vec2; // Current drag position (0-1 normalized)

  // Animation state for spring physics
  animationState: AnimationState;
  targetProgress: number; // 0 for cancel, 1 for complete

  // Actions
  setCurrentColor: (color: string) => void;
  addPathToTopNote: (path: PathData) => void;
  startPeel: (edge: PeelEdge, clickPos: Vec2) => void;
  updatePeel: (dragPos: Vec2) => void;
  completePeel: () => void;
  cancelPeel: () => void;
  setAnimationState: (state: AnimationState, targetProgress?: number) => void;

  // History
  peeledNotes: StickyNote[];
}

const PASTEL_COLORS = {
  yellow: "#fef08a",
  blue: "#bfdbfe",
  purple: "#ddd6fe",
  pink: "#fbcfe8",
  green: "#bbf7d0",
} as const;

const createInitialNotes = (count: number, color: string): StickyNote[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `note-${i}`,
    color,
    paths: [],
    createdAt: new Date(),
  }));
};

const initialVec2: Vec2 = { x: 0.5, y: 0.5 };

export const useStickyNotesStore = create<StickyNotesStore>((set, get) => ({
  notes: createInitialNotes(25, PASTEL_COLORS.yellow),
  currentColor: PASTEL_COLORS.yellow,
  isPeeling: false,
  peelEdge: null,
  clickPos: initialVec2,
  dragPos: initialVec2,
  animationState: "idle",
  targetProgress: 0,
  peeledNotes: [],

  setCurrentColor: (color) => {
    set({ currentColor: color });
    // Update the top note's color
    const notes = get().notes;
    if (notes.length > 0) {
      const updatedNotes = [...notes];
      updatedNotes[0] = { ...updatedNotes[0], color };
      set({ notes: updatedNotes });
    }
  },

  addPathToTopNote: (path) => {
    const notes = get().notes;
    if (notes.length === 0) {
      return;
    }

    const updatedNotes = [...notes];
    updatedNotes[0] = {
      ...updatedNotes[0],
      paths: [...updatedNotes[0].paths, path],
    };
    set({ notes: updatedNotes });
  },

  startPeel: (edge, clickPos) => {
    set({
      isPeeling: true,
      peelEdge: edge,
      clickPos,
      dragPos: clickPos,
      animationState: "dragging",
      targetProgress: 0,
    });
  },

  updatePeel: (dragPos) => {
    set({ dragPos });
  },

  setAnimationState: (state, targetProgress) => {
    set({
      animationState: state,
      ...(targetProgress !== undefined && { targetProgress }),
    });
  },

  completePeel: () => {
    const { notes, peeledNotes, currentColor } = get();
    if (notes.length === 0) {
      return;
    }

    const [peeledNote, ...remainingNotes] = notes;

    // Add a new blank note at the bottom to maintain stack size
    const newNote: StickyNote = {
      id: `note-${Date.now()}`,
      color: currentColor,
      paths: [],
      createdAt: new Date(),
    };

    set({
      notes: [...remainingNotes, newNote],
      peeledNotes: [...peeledNotes, peeledNote],
      isPeeling: false,
      peelEdge: null,
      clickPos: initialVec2,
      dragPos: initialVec2,
      animationState: "idle",
      targetProgress: 0,
    });
  },

  cancelPeel: () => {
    set({
      isPeeling: false,
      peelEdge: null,
      clickPos: initialVec2,
      dragPos: initialVec2,
      animationState: "idle",
      targetProgress: 0,
    });
  },
}));

export { PASTEL_COLORS };
