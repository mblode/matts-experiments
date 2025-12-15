"use client";

import { StickyNoteStack } from "./components/sticky-note-stack";
import { ColorPicker } from "./components/color-picker";

export const StickyNotesBlock = () => {
  return (
    <>
      <StickyNoteStack />
      <ColorPicker />
    </>
  );
};
