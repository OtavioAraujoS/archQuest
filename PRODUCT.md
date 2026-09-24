# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Process analysts and managers who map business processes (purchase approval, expense reimbursement, employee onboarding, customer support) and need correct BPMN 2.0 without the weight of enterprise tools. Brazilian Portuguese speakers. They open the app to draw, revise and export a process diagram, often starting from a ready template.

## Product Purpose
archQuest is a BPMN 2.0 modelling tool with whiteboard-level ease of use: the robustness of Bizagi with the simplicity of Whimsical. Success is a valid, readable process diagram created quickly, saved locally, and exported.

## Positioning
Real BPMN 2.0 (bpmn-js engine, grouped palette, simple properties panel) that runs local-first in the browser with no account, is open source (MIT), and ships ready-made templates in Brazilian Portuguese. A neighbour such as Bizagi, Whimsical or bpmn.io cannot truthfully claim all four at once.

## Operating Context
Diagrams live in IndexedDB (Dexie) and work without an account (guest mode). An optional account (Supabase) adds cloud sync, version conflict handling and public read-only links (ADRs 0014-0018). Files can be opened and saved through the File System Access API. Light and dark themes, toggled manually; dark stays dark everywhere, editor included. bpmn-js requires its "powered by bpmn.io" watermark to stay visible (ADR 0004).

## Capabilities and Constraints
Diagram library (create, open, delete), template picker (5 static templates), BPMN editor with grouped palette (events, gateways, tasks, sub-processes), properties panel (timer, message), element style panel (colours, text format), theme toggle, export. Stack: React 19, TypeScript, Vite, Tailwind v4, shadcn/ui new-york, lucide-react. UI copy in pt-BR. Repository conventions: tests in root `__tests__/`, files at most 150 lines, one responsibility per file, no comments.

## Brand Commitments
Name is written `archQuest`. New logo: BPMN arch mark on a primary-blue tile (design system artifact "archQuest Design System"). MIT licence; open source.

## Evidence on Hand
Five real BPMN templates in `src/templates/`, ADRs in `docs/adr/`, the design system artifact https://claude.ai/artifact/5mxgBfYocPomH3UmJFCZbv. No customers, testimonials, benchmarks or usage numbers exist; do not fabricate them.

## Product Principles
- Correct BPMN first: never trade notation validity for visual simplicity.
- Start fast: a template or blank canvas within one click, no account.
- Local-first and open: the user owns the data; cloud is optional.
- Whiteboard calm: the tool recedes, the diagram leads.
- Portuguese-native language and vocabulary.

## Accessibility & Inclusion
No product-specific requirement established; assume WCAG AA and keyboard access for the app chrome, in both themes.
