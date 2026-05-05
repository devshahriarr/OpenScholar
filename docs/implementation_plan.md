# Goal Description

Set up a scalable frontend architecture for OpenScholar based on the provided Next.js (App Router) + TypeScript template, adhering to the coding standards, best practices, and security guidelines. Additionally, scaffold a robust UI Design System (Tailwind CSS) and build fundamental reusable UI components (Button, Input, Card, Badge, Modal, Loader) that strictly match the project's design requirements.

> [!WARNING]
> The project uses Tailwind CSS v4 which simplifies configuration by moving theme variables directly into CSS (`@theme` block) rather than `tailwind.config.ts`. The implementation will reflect this modern approach.

## User Review Required

> [!IMPORTANT]
> The prompt mentions implementing the design system from a provided UI (PDF) that must exactly match the design. Since I cannot visually extract spacing, colors, and typography from the provided PDF, I need your input on the exact design tokens.

## Open Questions

1. **Design Tokens**: Could you please provide the specific hex color codes (primary, secondary, background, text, borders), typography (font family), and spacing scales from the provided Figma Design PDF? 
2. **Icons**: I plan to install `lucide-react` for standard UI icons. Is this acceptable, or does the design specify another icon set?
3. **Utility Libraries**: I will add `clsx` and `tailwind-merge` to handle dynamic Tailwind classes efficiently. Are these additions approved?

## Proposed Changes

### Setup & Dependencies

I will run: `npm install clsx tailwind-merge lucide-react`

---

### Global Styling & Tailwind v4 Theme

#### [MODIFY] src/app/globals.css
Define the global Tailwind CSS v4 theme, including CSS variables for the color palette, spacing, and typography to build the design system.

---

### Architecture Scaffolding

#### [NEW] src/types/index.ts
#### [NEW] src/hooks/index.ts
#### [NEW] src/modules/index.ts
Directories will be created to enforce the modular architecture and separation of concerns as per `/docs/engineering/best-practices.md`.

---

### Core Libraries

#### [NEW] src/lib/utils.ts
A utility file containing the `cn()` function combining `clsx` and `tailwind-merge` for scalable component styling.

---

### UI Components

Components will be created strictly adhering to React/Next.js best practices, using TypeScript interfaces for props, and fully integrated with the Tailwind design system.

#### [NEW] src/components/ui/Button.tsx
Variations for primary, secondary, outline, ghost, disabled, etc.

#### [NEW] src/components/ui/Input.tsx
Text input with label, error states, and standard styling.

#### [NEW] src/components/ui/Card.tsx
Card wrapper with Header, Content, and Footer sub-components for reusability.

#### [NEW] src/components/ui/Badge.tsx
Status indicators or tags.

#### [NEW] src/components/ui/Modal.tsx
A reusable overlay component for dialogs using a standard backdrop and centered content.

#### [NEW] src/components/ui/Loader.tsx
Skeleton loader and spinner components for asynchronous data states.

## Verification Plan

### Automated Tests
- `npm run lint` and `npm run build` to ensure no TypeScript or ESLint errors are introduced.

### Manual Verification
- We will set up a temporary showcase page (e.g., `src/app/page.tsx`) rendering all the newly created components with their respective variants so you can visually verify they EXACTLY match your Figma design.
