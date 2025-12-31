# Repository Guidelines

## Project Structure & Module Organization
- `app/` is the Next.js App Router. Each experiment lives in its own route folder (e.g., `app/sky/`) and typically includes `page.tsx` plus a feature component like `sky-block.tsx`.
- `lib/` holds shared logic and registries. Update `lib/blocks.ts` when adding or hiding experiments (name, description, flags).
- `components/ui/` contains reusable UI primitives (Radix UI + Tailwind CSS).
- `public/` stores static assets (images, textures, fonts).
- `hooks/` includes shared hooks when needed.

## Build, Test, and Development Commands
- `npm run dev` — start the local dev server on `http://localhost:3000`.
- `npm run build` — create a production build.
- `npm run start` — run the production server from `.next/`.
- `npm run lint` — run Biome checks.
- `npm run lint:fix` — auto-fix Biome lint issues.
- `npm run format` — format code with Biome.
- `npm run format:check` — verify formatting.
- `npm run check-types` — TypeScript typecheck without emit.

## Coding Style & Naming Conventions
- Indentation is 2 spaces (Biome). Format before committing.
- File names are kebab-case (e.g., `my-component.tsx`); components are PascalCase.
- Prefer `type` over `interface`, avoid `any` and `// @ts-ignore`, and keep one component per file.
- Imports: React/Next → third-party → internal `@/` → relative; use `import type` for types.
- Use `next/image` for images with `alt` and explicit sizing; remove `console.*`/`debugger`.

## Testing Guidelines
- No dedicated test runner is configured. Use `npm run check-types`, `npm run lint`, and `npm run build` as quality gates.
- Manually verify UI changes by visiting the relevant route (e.g., `/sky`, `/dnd-grid`) during `npm run dev`.
- If you introduce tests, add scripts and document the framework in this file.

## Commit & Pull Request Guidelines
- Git history favors short, present-tense messages (e.g., “Fix”, “Update”, “opengraph”). Keep commits concise; no conventional prefix required.
- PRs should include: summary, list of routes/experiments touched, and screenshots or short clips for UI changes.
- Call out updates to `lib/blocks.ts` and any new assets added under `public/`.

## Motion & UX Guidelines
- Follow `ANIMATION.md`: use short durations (0.2–0.3s), `ease-out` for entrances, and stick to `opacity`/`transform`.
- Respect `prefers-reduced-motion` and ensure focus states and keyboard navigation work.
