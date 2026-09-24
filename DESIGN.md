---
name: archQuest
description: BPMN 2.0 com a leveza de um quadro branco
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  card: "oklch(1 0 0)"
  primary: "oklch(0.546 0.245 262.881)"
  primary-foreground: "oklch(0.985 0 0)"
  secondary: "oklch(0.97 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  accent: "oklch(0.97 0.014 254.604)"
  accent-foreground: "oklch(0.379 0.146 265.522)"
  destructive: "oklch(0.577 0.245 27.325)"
  border: "oklch(0.922 0 0)"
  ring: "oklch(0.623 0.214 259.815)"
  background-dark: "oklch(0.145 0.02 264)"
  card-dark: "oklch(0.205 0.015 264)"
  primary-dark: "oklch(0.623 0.214 259.815)"
typography:
  display:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  heading:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    height: "36px"
  template-tab-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.lg}"
  diagram-canvas:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.xl}"
---

# archQuest design

## Overview

A calm drafting table for business processes. Neutral surfaces, one confident blue, and
the diagram as the main image. The brand motif is the BPMN arch from the logo: a start
event and an end event as feet, a gateway diamond as keystone. The chrome recedes; the
diagram leads. Source of truth for tokens is `src/index.css`; the design system artifact is
"archQuest Design System".

## Colors

Semantic shadcn tokens flip with the `.dark` class on `<html>`. Neutral greys carry
everything; `primary` blue is reserved for the main action, selection and the mark. `ring`
is the lighter blue for focus and secondary brand shapes. No raw hex in UI code.

**Dark mode stays dark everywhere, including the editor.** Canvas, BPMN shape fills,
labels, palette and panels use dark surfaces (`card`, `background`) with `foreground`
strokes and text, through the renderer defaults `var(--bpmn-shape-fill)` and
`var(--bpmn-shape-stroke)` (ADR 0024), so switching theme is instant. Every exported
SVG, PNG and thumbnail is resolved to the light paper palette by
`resolveThemedColorsForExport` in `src/lib/diagram-colors.ts`.

## Typography

Two voices. Archivo Variable (self-hosted via `@fontsource-variable/archivo`, width axis
at 112%) is the display voice for headlines and the wordmark; the utility class is
`font-display`. The system sans stays the UI voice at 14/20 for body, 14/20 medium for
labels, 12/16 for captions. Tracking never below -0.03em; headings use `text-balance`.

## Layout

Content in `max-w-6xl` with 16px side gutters on mobile and 24px from `sm`. Sections
separate with generous vertical space (64px mobile, 96px desktop) and hairline `border`
rules, not cards. Two-column rhythm on desktop: an 18rem label column beside the content.

## Elevation & Depth

Almost flat. `shadow-xs` on buttons, a soft 1–4px shadow on the bpmn-js palette and context
pad. Elevation is declared once: a surface has a border or a shadow, not both.

## Shapes

Radii from `--radius` (10px): 6 small controls, 8 buttons, 10 cards and tabs, 14 the
diagram canvas and the logo tile. Arch shapes (a rectangle topped by a half circle whose
radius is half the width) are the decorative geometry, used sparingly (hero colonnade).

## Components

- **Button** (`src/components/ui/button.tsx`): one primary per view.
- **ArchQuestMark / ArchQuestWordmark** (`src/components/brand/`): the logo, drawn from
  tokens so it follows the theme.
- **Template tabs** (`src/components/landing/TemplateTabs.tsx`): vertical tablist on
  desktop, horizontal snap scroller on mobile; arrow keys move between templates.
- **Template preview canvas**: a bpmn-js `Viewer` painted with theme tokens; keeps the
  required "powered by bpmn.io" watermark.
- **Template browser** (`src/components/templates/TemplateBrowser.tsx`): tabs, live
  preview and "Usar este modelo"; shared by the landing showcase and the library's
  template picker.
- **App header** (`src/components/layout/AppHeader.tsx`): wordmark back to the landing,
  account menu and theme toggle; used by app screens.
- **Diagram card** (`src/components/library/DiagramCard.tsx`): 16:9 thumbnail, name,
  relative edit time ("Editado há 5 minutos", full date on hover) and an always-visible
  delete button. Stored thumbnails are light SVGs; in dark mode they are shown with
  `invert` plus `hue-rotate-180`, so thumbnails must keep being generated in the light
  palette.
- **Editor header** (`src/components/editor/EditorHeader.tsx`): back, mark, editable
  name, save status (cloud sync when signed in, "Salvo neste navegador" for guests),
  share, one "Arquivo" menu (import, save to file, export .bpmn/SVG/PNG) and the theme
  toggle.
- **Dropdown menu** (`src/components/ui/dropdown-menu.tsx`): accessible menu button with
  arrow-key focus, Escape and outside-click dismissal; items close the menu on select.
- **Element inspector** (`src/components/editor/ElementInspector.tsx`): one panel for the
  selection, docked right on desktop and below the canvas on mobile (the canvas shrinks,
  so the bpmn.io watermark stays visible); sections "Aparência" and "Propriedades".
- **Palette hint**: a one-time, dismissible tip about grouped palette entries. The
  bpmn-js palette and context pad are translated to pt-BR by
  `src/components/editor/translations/`.
- **Library states**: loading skeletons, a first-run empty state with "Diagrama em branco"
  and "Começar por um modelo", "Nenhum diagrama encontrado" with "Limpar busca", and a
  delete confirmation dialog that shows errors in place instead of `alert()`.

## Do's and Don'ts

- Do keep the bpmn.io watermark visible on every rendered diagram (ADR 0004).
- Do write UI copy in pt-BR, sentence case, second person, no exclamation marks.
- Do theme dark mode fully, canvas included, and route every SVG that leaves the app
  through `resolveThemedColorsForExport`.
- Don't use eyebrows above headings, section numbers, gradient text, or grids of identical
  icon cards.
- Don't fabricate customers, testimonials or usage numbers; none exist.
