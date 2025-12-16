# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run Biome linter
npm run format   # Format code with Biome
```

## Architecture

This is a Next.js 16 app with each experiment as a standalone route under `/app/[experiment-name]/`.

**Key files:**
- `lib/blocks.ts` - Registry of all experiments (name, description, hidden flag)
- `components/ui/` - Reusable UI components (Radix UI + Tailwind)
- `ANIMATION.md` - Animation guidelines and easing curves

**Experiment structure:**
```
app/[name]/
├── page.tsx           # Route component
└── [name]-block.tsx   # Main experiment component
```

**Tech stack:** Next.js 16, React 19, Tailwind CSS 4, Motion (animation), Three.js + React Three Fiber (3D), Radix UI (accessible components), Biome (linting/formatting)

## Animation Guidelines

- Default duration: 0.2-0.3s, max 1s
- Use `ease-out` for entrances, `ease-in-out` for movements within screen
- Stick to `opacity` and `transform` for performance
- Support `prefers-reduced-motion`
- See `ANIMATION.md` for easing curves

## Code Standards

### Code Quality
- Delete all `console.log`, `console.error`, `console.warn` statements
- Remove `debugger` statements
- Delete commented-out code blocks
- Remove unused imports, variables, and functions
- Generate unique IDs with `useId()` instead of hardcoded values

### TypeScript
- Replace all `any` with proper types
- Remove `// @ts-ignore` and `// @ts-expect-error` by fixing types
- Prefer `type` over `interface`
- Components as arrow functions: `const Component = ({...}: Props) => {}`
- One component per file
- Files: kebab-case (`my-component.tsx`)
- Components: PascalCase (`MyComponent`)

### Imports
- Order: React/Next → third-party → internal (`@/*`) → relative
- Use absolute imports (`@/lib/utils`, `@/components/ui/`)
- Use `import type { ... }` for type-only imports

### State Management
- `useState` for local UI state only
- Zustand for shared state across components
- Single source of truth - never duplicate state
- Never sync state with useEffect between sources

### Images (Next.js)
- Use `next/image` for all images
- Always provide `alt` (use `alt=""` for decorative)
- Provide explicit `width` and `height`, or use `fill` with relative parent

### Accessibility
- Inputs have labels; icon buttons have `aria-label`
- Keyboard navigation works; visible focus rings
- Use `<button>` not `<div onClick>`
- Support `prefers-reduced-motion`

### Performance
- Stick to `opacity` and `transform` for animations
- Use `will-change` sparingly: only for `transform`, `opacity`, `clipPath`, `filter`
- Lists use stable unique keys (avoid index as key)
- `useEffect` has correct deps and cleanup
