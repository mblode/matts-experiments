"use client";

import { ColorPicker } from "./components/color-picker";
import { StickyNoteStack } from "./components/sticky-note-stack";

export const StickyNotesBlock = () => {
  return (
    <>
      <StickyNoteStack />
      <ColorPicker />
    </>
  );
};
