# Miqat Platform — UI/UX Permanent Quick Reference
> **Canonical Implementation Reference for Engineers & AI Agents**  
> Location: `.agent/knowledge/MIQAT-UI-UX-QUICK-REFERENCE.md`  
> Baseline Authorities:
> 1. Current Task Scope & Directives
> 2. `docs/MIQAT-DESIGN-SYSTEM-REFERENCE.md` (Tokens, Colors, Typography)
> 3. `RESPONSIVE_DESIGN_GUIDELINES.md` (Breakpoints, Responsive Hierarchy & Rule 6)
> 4. `docs/MIQAT-UI-QUALITY-STANDARD.md` (Dimensions, Layout Rhythm & Quality)
> 5. `.agent/rules/` (Modern Web Guidance as Technical Reference Only)

---

## 1. Authority Hierarchy & Design Token Source

- **Authority Priority**: Task Scope > Design System Reference > Responsive Guidelines (Rule 6) > UI Quality Standard > Technical Web Rules.
- **Single Source of Truth**: All CSS tokens are defined in `Miqat UI-UX/styles.css` under `:root` and `[data-theme="dark"]`.
- **Absolute Prohibitions**:
  - Never invent new HEX, RGB/RGBA, or HSL literals in page styles.
  - Never hardcode arbitrary colors; strictly declare `var(--color-*)`.
  - Never create local token duplicates or shadow palettes.
  - Zero harsh red and zero vibrant green across badges, chips, and pills (Strict Zero-Red/Zero-Green Policy).

---

## 2. Approved Design Tokens Quick Map

| Token Name | Light Mode Value | Dark Mode Value | Context / Usage |
|---|---|---|---|
| `--color-bg` | `#F7F4EC` (Warm Ivory) | `#172838` (Night Sky Navy) | Global page background |
| `--color-surface` | `#FFFFFF` (Crisp White) | `#22384B` (Elevated Navy) | Primary card & table container surface |
| `--color-surface-secondary` | `#EAF0F5` (Pale Slate) | `#2B4358` (Mid-tone Navy) | Nested cards, table headers, filter wells |
| `--color-surface-tertiary` | `#DFE8F0` | `#1C3144` | Recessed input background |
| `--color-text` | `#24374A` (Deep Slate) | `#F5F2EB` (Warm Ivory) | Primary high-contrast body & heading text |
| `--color-text-muted` | `#526579` | `#D0D9E2` | Secondary descriptors, labels, metadata |
| `--color-border` | `#D3DFEB` | `#334D64` | Primary structural boundaries & borders |
| `--color-border-subtle` | `#E2ECF5` | `#273D52` | Subtle dividers & row separators |
| `--color-primary` | `#183653` (Navy) | `#2B4E70` / `#8AB7E0` | Brand primary, action buttons |
| `--color-primary-hover` | `#0F253B` | `#3E739E` | Primary interactive hover |
| `--color-secondary-blue` | `#28577D` | `#3E739E` | Secondary brand blue |
| `--color-accent` | `#C5A15E` (Refined Gold) | `#D1B16C` (Radiant Gold) | Warm gold accent & highlights |
| `--color-accent-soft` | `#F4EBD8` | `#2D2D24` | Soft gold background tint |
| `--color-focus` | `#3B82F6` | `#3B82F6` | Accessible 2px focus ring |

---

## 3. Typography & Hierarchy Standards

### Font Families
- **Arabic UI & Body**: `'IBM Plex Sans Arabic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, Arial, sans-serif`
- **English UI & Body**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
- **Monospace (IDs, Hashes, Code)**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`

### Hierarchical Scale
- **Page Title**: `1.35rem` (21.6px), `font-weight: 700; line-height: 1.3;`
- **Page Subtitle**: `0.85rem` (13.6px), `font-weight: 400; line-height: 1.45; color: var(--color-text-muted);`
- **Card / Section Header**: `1.05rem` (16.8px), `font-weight: 700; line-height: 1.35;`
- **KPI Metric Value**: `1.30rem` (20.8px), `font-weight: 700; line-height: 1.2;` (Never giant 2rem+)
- **KPI Metric Label**: `0.76rem` (12.2px), `font-weight: 600; line-height: 1.3; color: var(--color-text-muted);`
- **Table Headers (`<th>`)**: `0.76rem` (12.2px), `font-weight: 700;`
- **Table Cell Text**: `0.82rem` (13.1px), `font-weight: 400/500; line-height: 1.4;`
- **Form Labels**: `0.78rem` (12.5px), `font-weight: 600; line-height: 1.3;`
- **Buttons & Tabs**: `0.82rem` (13.1px), `font-weight: 600;`
- **Status Badges / Pills**: `0.74rem` (11.8px), `font-weight: 600;`

### Mandatory Typography Constraints
1. **Tabular Numerals**: Declare `font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1;` on all amounts, prices, dates, IDs, sizes, and counts.
2. **Zero Letter-Spacing in Arabic**: Never apply `letter-spacing` to Arabic text (breaks cursive script).
3. **Diacritic Protection**: Arabic line-height must never drop below `1.3`.
4. **No Forced Uppercase**: Never apply `text-transform: uppercase` to English labels.

---

## 4. Component Dimensions & Sizing Rules

### Buttons
- **Standard Primary & Secondary**: `height: 38px; padding-inline: 14px-16px; border-radius: 6px; font-size: 0.82rem; font-weight: 600;`
- **Compact / Table Action (`.btn-sm`)**: `height: 32px; padding-inline: 10px; border-radius: 5px; font-size: 0.76rem;`
- **Icon-Only Button**: `34px × 34px; border-radius: 6px;`
- **Icon Spacing**: `gap: 6px` between icon and label text.
- **Prohibitions**: No oversized buttons, no giant vertical padding, no buttons wider than content requires.

### Inputs, Selects & Filter Controls
- **Standard Height**: `38px` across text inputs, selects, and date fields.
- **Padding**: `0 12px; border-radius: 6px; font-size: 0.82rem;`
- **Labels**: Always placed directly above controls (`gap: 4px`) and linked via `for="id"`.

### Cards & Containers
- **Border**: `1px solid var(--color-border); border-radius: 10px` (or `12px` for root container).
- **Padding**: `16px 20px` (Desktop) / `14px 16px` (Mobile).
- **Gaps**: Standard gap of `14px-16px` between sibling cards.
- **No Card Overload**: Do not nest cards inside cards unnecessarily.

### Tables
- **Container**: Must use `.acc-table-responsive` (`overflow-x: auto; width: 100%; border: 1px solid var(--color-border); border-radius: 8px;`).
- **Header Height**: `38px; background: var(--color-surface-secondary);`
- **Row Height**: `44px - 48px;` cell padding: `10px 14px;`
- **Containment**: Scrolling is contained strictly within the table wrapper; never causes page overflow.

---

## 5. Bidirectional (RTL / LTR) & Directional Isolation

- **Logical Properties**: Always declare `margin-inline`, `padding-inline`, `border-inline-start`, `inset-inline` instead of physical `left`/`right`.
- **Directional Isolation for Technical Data**:
  - Technical IDs (`BK-20261123-0400`, `REP-20261123-01`), dates (`2026-11-23`), times (`09:30`), file sizes (`1.8 MB`, `4.82 TB`), `SHA-256`, and English parenthetical terms must declare `dir="ltr"` or use directional isolation `<bdi>` / `.rep-table-mono`.
  - This prevents awkward punctuation inversion (e.g. `(Every 12h)` rendering as `)Every 12h(`).
- **Units and Values**: Numbers must maintain logical reading order with units (`1.8 MB`, `2.84 GB`, `73.4%`).

---

## 6. Shared Layout, Navbar & Sidebar Sovereignty

- **Never Recreate or Approximate**:
  - Top header must be the exact shared `.acc-header`.
  - Sidebar must be the exact shared 11-item `.acc-sidebar`.
  - Layout must be `.acc-layout-wrapper` with `.acc-main-content`.
- **Navigation & Routing**:
  - Each major record or preview must open as an **independent standalone page / view** (e.g. `accounts-booking-details.html`, `accounts-refund-details.html`, `accounts-report-details.html`), NOT as a giant inline block appended beneath the list page.
  - Sidebar item must accurately show `active` / `is-active` and `aria-current="page"`.
  - Clear back-navigation button must be provided on all detail views.

---

## 7. Responsive Design & Zero Horizontal Overflow (Rule 6)

- **The Golden Directive**: `document.documentElement.scrollWidth <= document.documentElement.clientWidth` across all viewports (`1440px`, `1280px`, `1024px`, `768px`, `390px`, `320px`) in RTL & LTR, Light & Dark.
- **Flex & Grid Shrinkability**: Flex and grid children must declare `min-width: 0;` and use `minmax(0, 1fr)`.
- **Adaptive Reflow**:
  - Multi-column card grids must reflow into fewer columns on tablets/mobile.
  - Header actions must wrap gracefully on small screens (`flex-wrap: wrap`).
  - Form fields must stack cleanly on mobile.
- **No Masking**: Never use `overflow-x: hidden` on root containers to mask broken child element sizing. Fix sizing at the source.

---

## 8. Interactive States, Tooltips & Storage UI Guidelines

- **Storage Visualization Rule**:
  - **Traditional completion/progress bars are forbidden** as the primary visual representation for multi-category storage or capacity.
  - Use structured numeric hierarchy, data panels, and clear categorical cards.
- **Hover & Focus Interactions**:
  - Interactive data items must support keyboard focus (`tabindex="0"`) as well as mouse hover.
  - Tooltips must be position-aware, close to the trigger, non-clipping, and must not cause layout reflow or page jumping.
- **Accessible Focus**: All interactive triggers must show `outline: 2px solid var(--color-focus); outline-offset: 2px;` on `:focus-visible`.

---

## 9. Common Mistakes That Must Never Be Repeated

1. ❌ **Oversized Buttons**: Do not create buttons taller than 38px or with huge horizontal padding.
2. ❌ **Giant KPI Numbers**: Do not set KPI font sizes to 2rem–3rem. Use `1.30rem` (20.8px) bold.
3. ❌ **Inline Preview Sprawl**: Do not append a giant report preview below Page 9; open an independent page view.
4. ❌ **Repeated Progress Bars**: Do not use progress bars for storage capacity and distribution.
5. ❌ **Inverted Parentheses & Technical IDs**: Do not leave mixed LTR/RTL strings unisolated.
6. ❌ **Leaked Translation Keys**: Never show raw keypaths (e.g. `accounts_workspace.rep_title`). Always provide safe fallbacks.
7. ❌ **Hardcoded Colors**: Never use `#fff`, `#000`, `#ef4444`, or arbitrary hex codes in page CSS.
8. ❌ **Recreating Shared Navigation**: Never build a custom fake header or sidebar for a specific page.
