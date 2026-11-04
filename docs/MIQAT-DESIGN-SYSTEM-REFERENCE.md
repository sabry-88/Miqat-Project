# Miqat Approved Design System Reference

> **Official Design System & Architecture Standard for the Accounts Employee Workspace**  
> Location: `docs/MIQAT-DESIGN-SYSTEM-REFERENCE.md`  
> Baseline Reference Files:
> - `docs/MIQAT-DESIGN-SYSTEM-REFERENCE.md` (Design tokens, color specifications, typography scale, surface contrast)
> - `RESPONSIVE_DESIGN_GUIDELINES.md` (Viewport scale: 1920px down to 320px, logical properties, direction-aware drawers)
> - `Miqat UI-UX/styles.css` (Root `:root` and `[data-theme="dark"]` CSS variable definitions)

---

## 1. Light Mode Design Reference

### Palette & Surface Contrast Hierarchy:
- **Main Page Background:** `var(--color-bg)` = `#F7F4EC` (Soft Warm Ivory)
- **Primary Card Surface:** `var(--color-surface)` = `#FFFFFF` (Crisp Elevated White)
- **Secondary / Nested Surface:** `var(--color-surface-secondary)` = `#EAF0F5` (Subtle Pale Blue-Slate Tint)
- **Tertiary Surface:** `var(--color-surface-tertiary)` = `#DFE8F0`
- **Primary Text:** `var(--color-text)` = `#24374A` (High-contrast Deep Slate, WCAG AAA compliant)
- **Muted Text:** `var(--color-text-muted)` = `#526579` (Secondary descriptors & labels)
- **Card & Table Borders:** `var(--color-border)` = `#D3DFEB` (Clear structural boundary)
- **Subtle Dividers:** `var(--color-border-subtle)` = `#E2ECF5`
- **Form Inputs:**
  - Background: `var(--color-input-bg)` = `#FFFFFF`
  - Border: `var(--color-input-border)` = `#D3DFEB`
  - Text: `var(--color-input-text)` = `#24374A`
  - Focus Ring: `var(--color-focus)` = `#3B82F6` (2px outline with offset)
- **Brand Colors:**
  - Primary Brand Navy: `var(--color-primary)` = `#183653`
  - Brand Hover: `var(--color-primary-hover)` = `#0F253B`
  - Brand Secondary Blue: `var(--color-secondary-blue)` = `#28577D`
  - Refined Warm Gold: `var(--color-accent)` = `#C5A15E`
  - Soft Gold Tint: `var(--color-accent-soft)` = `#F4EBD8`

---

## 2. Dark Mode Design Reference

### Palette & Surface Contrast Hierarchy ("Night in Makkah" Atmosphere):
- **Main Page Background:** `var(--color-bg)` = `#172838` (Deep Blue-Black Night Sky, NEVER pitch black #000000)
- **Primary Card Surface:** `var(--color-surface)` = `#22384B` (Crisp elevated container surface with clear visual elevation over `--color-bg`)
- **Secondary / Nested Surface:** `var(--color-surface-secondary)` = `#2B4358` (Used for nested cards, table headers, and filter bars)
- **Tertiary Surface:** `var(--color-surface-tertiary)` = `#1C3144` (Input background and recessed wells)
- **Primary Text:** `var(--color-text)` = `#F5F2EB` (Warm Ivory High-Contrast Text, WCAG AAA)
- **Muted Text:** `var(--color-text-muted)` = `#D0D9E2` (Soft High-Contrast Slate)
- **Card & Table Borders:** `var(--color-border)` = `#334D64` (Defined contrast edge)
- **Subtle Dividers:** `var(--color-border-subtle)` = `#273D52`
- **Form Inputs:**
  - Background: `var(--color-input-bg)` = `#1A2D3D`
  - Border: `var(--color-input-border)` = `#334D64`
  - Text: `var(--color-input-text)` = `#F5F2EB`
  - Placeholder: `var(--color-input-placeholder)` = `#8FA3B5`
- **Brand Colors (Dark):**
  - Primary Navy Accent: `var(--color-primary)` = `#2B4E70`
  - Secondary Blue: `var(--color-secondary-blue)` = `#3E739E`
  - Radiant Warm Gold: `var(--color-accent)` = `#D1B16C`
  - Warm Gold Tint: `var(--color-accent-soft)` = `#2D2D24`
  - Links: `var(--color-link)` = `#8AB7E0`

---

## 3. Arabic Typography Reference

- **Primary Arabic UI & Body Font:** `'IBM Plex Sans Arabic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, Arial, sans-serif`
  - Page Headings: `font-weight: 700; line-height: 1.3;`
  - Card Titles & Section Headers: `font-weight: 700; font-size: 1.15rem;`
  - Body & Table Text: `font-weight: 400; font-size: 0.875rem; line-height: 1.5;`
  - Form & Filter Labels: `font-weight: 600; font-size: 0.8rem;`
  - Buttons & Actions: `font-weight: 600; font-size: 0.85rem;`
- **Arabic Display Font (Editorial/Brand):** `'Aref Ruqaa', 'Traditional Arabic', 'Amiri', serif`
- **Rules:**
  - Strictly RTL (`dir="rtl"`).
  - Never apply `letter-spacing` to Arabic script.
  - Heading line-height minimum 1.4 to protect Arabic diacritics from clipping.

---

## 4. English Typography Reference

- **Primary English UI & Body Font:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
  - Page Headings: `font-weight: 700; font-size: 1.5rem;`
  - Section Headers: `font-weight: 700; font-size: 1.15rem;`
  - Body & Table Content: `font-weight: 400; font-size: 0.875rem; line-height: 1.5;`
  - Controls, Badges, Tabs: `font-weight: 600; font-size: 0.85rem;`
- **English Editorial Font:** `'Cormorant Garamond', Garamond, 'Times New Roman', Georgia, serif`
- **Tabular Figures & Numbers:**
  - **Tabular Numerals Mandatory:** All prices, transaction amounts, dates, booking references, counts, and phone numbers must declare `font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1;`.

---

## 5. Strict Zero-Red and Zero-Green Policy

In the Accounts Workspace, harsh red and vibrant green are strictly forbidden across all badges, chips, pills, and indicators. Use the approved semantic tokens:

| Semantic State | Approved Pill Class | Light Mode Tokens | Dark Mode Tokens |
|---|---|---|---|
| **Confirmed / Verified / Completed** | `.status-pill-navy` | Background: `var(--color-surface-secondary)`, Color: `var(--color-primary)` | Background: `var(--color-surface-tertiary)`, Color: `var(--color-text)` |
| **Pending / Under Review / Partial** | `.status-pill-amber` | Background: `var(--color-accent-soft)`, Color: `var(--color-warning)` | Background: `var(--color-surface-tertiary)`, Color: `var(--color-accent)` |
| **In Progress / New / Processing** | `.status-pill-blue` | Background: `var(--color-surface-secondary)`, Color: `var(--color-secondary-blue)` | Background: `var(--color-surface-tertiary)`, Color: `var(--color-link)` |
| **Completed / Finished** | `.status-pill-indigo` | Background: `var(--color-surface-secondary)`, Color: `var(--color-indigo)` | Background: `var(--color-surface-tertiary)`, Color: `var(--color-indigo)` |
| **Cancelled / Rejected / Neutral** | `.status-pill-slate` | Background: `var(--color-surface-secondary)`, Color: `var(--color-text-muted)` | Background: `var(--color-surface-tertiary)`, Color: `var(--color-text-muted)` |

---

## 6. How Future Pages Must Use These References

1. **Never invent new HEX colors, RGB/RGBA values, or HSL codes.**
2. **Never hardcode arbitrary colors** in page-specific CSS; strictly use `var(--color-*)` tokens.
3. **Never duplicate the shared Navbar or Sidebar.** Reuse the exact markup and selectors established in `accounts-dashboard.html` and `accounts-customers.html`.
4. **Scope all page-specific rules** under the body class (e.g. `.accounts-customer-details-page`).
5. **Always verify against both themes** (`light` and `dark`) and both directions (`rtl` and `ltr`).
