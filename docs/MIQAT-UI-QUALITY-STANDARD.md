# Miqat UI Quality Standard & Implementation Guide

> **Mandatory Reference for Miqat Platform UI/UX Quality, Layout Hierarchy, Component Standardization & Localization**  
> Location: `docs/MIQAT-UI-QUALITY-STANDARD.md`  
> Complementary Design Token Reference: [`docs/MIQAT-DESIGN-SYSTEM-REFERENCE.md`](file:///d:/Miqat%20Platform/docs/MIQAT-DESIGN-SYSTEM-REFERENCE.md)  
> Responsive Foundation: [`RESPONSIVE_DESIGN_GUIDELINES.md`](file:///d:/Miqat%20Platform/RESPONSIVE_DESIGN_GUIDELINES.md)

---

## Relationship Between Documentation Files

This document serves as the **operational and engineering implementation standard** for all views, templates, components, and controllers across the Miqat Platform.

- **`docs/MIQAT-DESIGN-SYSTEM-REFERENCE.md`** remains the single source of truth for design tokens, brand palettes, typography families, color variables, and the zero-red/zero-green semantic policy.
- **`docs/MIQAT-UI-QUALITY-STANDARD.md`** establishes component ergonomics, exact dimension scales, layout rhythms, visual hierarchy rules, complete localization integrity (Arabic/English), Light/Dark surface behavior, table containment, responsive contracts, and QA acceptance criteria.

---

## 1. Design System Compliance

1. **Token-Only Styling**: Every color, surface, border, outline, focus ring, shadow, and text style must be expressed exclusively using approved CSS custom properties defined in `styles.css` (e.g. `var(--color-bg)`, `var(--color-surface)`, `var(--color-surface-secondary)`, `var(--color-border)`, `var(--color-primary)`, `var(--color-text)`, `var(--color-text-muted)`).
2. **No Arbitrary Values**: Never introduce hardcoded HEX, RGB/RGBA, or HSL color literals into page-scoped stylesheets or inline styles.
3. **No Redundant Token Definitions**: Do not create local token duplicates or shadow palettes.
4. **Shared Navigation Sovereignty**: Never rewrite, reconstruct, or replace the shared employee Navbar (`.emp-navbar`) or Sidebar (`.accounts-sidebar`). All pages inherit their navigation and layout shell directly from the shared framework.
5. **Class Scoping**: All page-specific CSS rules must be strictly encapsulated under their designated container class (e.g. `.accounts-cancellations-page`, `.accounts-cancellation-details-page`) to guarantee zero style leakage across workspace modules.

---

## 2. Typography Standards

Miqat UI typography represents a calm, mature, institutional financial and operational workspace. Overly aggressive font weights, giant text, and decorative AI styling are strictly forbidden.

### 2.1 Font Family Declarations
- **Arabic UI & Body**: `'IBM Plex Sans Arabic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, Arial, sans-serif`
- **English UI & Body**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
- **Editorial Brand Accents**: `'Aref Ruqaa'` (Arabic) and `'Cormorant Garamond'` (English) reserved strictly for ceremonial marketing titles; never in operational workspace registers or forms.

### 2.2 Hierarchical Type Scale

| UI Role | Font Size | Font Weight | Line Height | Letter Spacing | Context / Purpose |
|---|---|---|---|---|---|
| **Page Title** | `1.35rem` (21.6px) | `700` | `1.3` | `normal` | Main workspace module title (e.g., Cancellations Register) |
| **Page Subtitle / Descriptors** | `0.85rem` (13.6px) | `400` | `1.45` | `normal` | Subtitle beneath page title, helper paragraphs |
| **Section / Card Header** | `1.05rem` (16.8px) | `700` | `1.35` | `normal` | Card header title, major subsection header |
| **KPI Metric Value** | `1.30rem` (20.8px) | `700` | `1.2` | `normal` | Primary numerical figure in KPI summaries |
| **KPI Label / Category** | `0.76rem` (12.2px) | `600` | `1.3` | `normal` | Metric description, uppercase forbidden |
| **Table Column Headers** | `0.76rem` (12.2px) | `700` | `1.25` | `normal` | Table headers (`<th>`), sorting labels |
| **Table Body & Cell Text** | `0.82rem` (13.1px) | `400` / `500` | `1.4` | `normal` | Primary table record text, reference IDs, dates |
| **Form Labels** | `0.78rem` (12.5px) | `600` | `1.3` | `normal` | Input, select, and filter field labels |
| **Input / Select Text** | `0.82rem` (13.1px) | `400` | `1.4` | `normal` | Active input values and placeholders |
| **Buttons & Primary Actions** | `0.82rem` (13.1px) | `600` | `1` | `normal` | Buttons, tab titles, actionable interactive triggers |
| **Status Badges & Pills** | `0.74rem` (11.8px) | `600` | `1` | `normal` | Record lifecycle status indicators |
| **Microcopy / Helper Text** | `0.72rem` (11.5px) | `400` | `1.35` | `normal` | Validation hints, secondary timestamps |

### 2.3 Typography Rules & Constraints
- **Tabular Numerals**: All numerical figures, dates, IDs, phone numbers, and currency values must declare:
  ```css
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
  ```
- **Zero Letter-Spacing in Arabic**: Never apply CSS `letter-spacing` to Arabic script, as it breaks the cursive character junctions (Kashida/Tashkeel).
- **No Forced Uppercase**: Never apply `text-transform: uppercase` to English labels or table headers; use natural Sentence case or Title Case.
- **Diacritic Protection**: Arabic line-height must never drop below `1.3` to prevent clipping diacritics and dots.

---

## 3. Card Standards

Cards are structural containment surfaces that group related data and interactive controls.

### 3.1 Standard Content Card
- **Background**: `var(--color-surface)`
- **Border**: `1px solid var(--color-border)`
- **Border Radius**: `10px` (or `12px` for root container cards)
- **Padding**: `16px 20px` (Desktop / Tablet) / `14px 16px` (Mobile)
- **Shadow**: `0 1px 3px rgba(0, 0, 0, 0.04)` (Light) / `none` (Dark)
- **Gap between sibling cards**: `16px`

### 3.2 KPI Summary Cards
- **Row Grid Layout**:
  ```css
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 14px;
  ```
- **Equal Heights**: All KPI cards within the same container must match height precisely using `display: flex; flex-direction: column; justify-content: space-between;`.
- **Internal Padding**: `14px 16px`.
- **Icon Sizing & Placement**:
  - Container: `34px × 34px` with `border-radius: 8px`.
  - Icon Glyph: `16px × 16px` (SVG / Lucide).
  - Background: `var(--color-surface-secondary)`.
  - Color: `var(--color-secondary-blue)` or `var(--color-accent)`.
- **Metric Grouping**:
  - Top row: Icon and Metric Label.
  - Middle row: Metric Value (`1.30rem`, weight `700`, tabular-nums).
  - Bottom row: Secondary descriptor or contextual change indicator (`0.74rem`).
- **No Text Squeezing**: Long labels must wrap gracefully without clipping numbers or overflowing containers.

---

## 4. Button Standards

Buttons must follow strict dimensional and ergonomic standards across all pages.

### 4.1 Button Hierarchy & Dimensions

| Button Type | Height | Padding (inline) | Font Size | Border Radius | Token Styles |
|---|---|---|---|---|---|
| **Primary Button** (`.btn-primary`) | `38px` | `16px` | `0.82rem` | `6px` | Bg: `var(--color-primary)`<br>Text: `#FFFFFF`<br>Hover: `var(--color-primary-hover)` |
| **Secondary Button** (`.btn-secondary`) | `38px` | `14px` | `0.82rem` | `6px` | Bg: `var(--color-surface)`<br>Border: `1px solid var(--color-border)`<br>Text: `var(--color-text)` |
| **Compact / Table Action** (`.btn-sm`) | `32px` | `10px` | `0.76rem` | `5px` | Standard compact height across all table rows and card action toolbars |
| **Icon-Only Button** (`.btn-icon`) | `34px × 34px` | `0` | - | `6px` | Centered icon (`16px`), Bg: transparent or surface |
| **Destructive / Danger Button** | `38px` | `16px` | `0.82rem` | `6px` | Bg: `var(--color-surface-secondary)`, Border: `var(--color-border)`, Text: `var(--color-text)`. *Harsh red is forbidden.* |

### 4.2 Button States
- **Hover**: Subtle brightness/color transition (`0.15s ease`).
- **Focus**: `outline: 2px solid var(--color-focus); outline-offset: 2px;`.
- **Disabled**: `opacity: 0.55; cursor: not-allowed; pointer-events: none;`.
- **Icon Alignment**: Gap of `6px` between icon and label, dynamically ordered based on `dir` (RTL/LTR).

---

## 5. Inputs, Selects, and Filters

Form controls and filter bars must provide predictable ergonomics and immediate visual coherence.

### 5.1 Field Dimensions
- **Height**: Standard `38px` across text inputs, search fields, selects, and date pickers.
- **Padding**: `0 12px` (or `0 34px` when leading/trailing search icons are present).
- **Font Size**: `0.82rem`.
- **Border Radius**: `6px`.
- **Border**: `1px solid var(--color-input-border)`.
- **Background**: `var(--color-input-bg)`.
- **Text Color**: `var(--color-input-text)`.
- **Placeholder Color**: `var(--color-input-placeholder)`.

### 5.2 Label Association & Layout
- Labels must sit directly above inputs with a `4px` gap, or align horizontally in compact inline filters.
- Labels must explicitly link to inputs via `<label for="id">`.
- Search bars must contain integrated search glyphs (`15px`) positioned using logical properties (`inset-inline-start: 10px`).

### 5.3 Filter Panel Architecture
- **Primary Row**: Search query input + 2-3 essential quick filters (Status, Type, Date Range) + Clear/Reset action.
- **Advanced Filters Drawer/Tray**: Complex multidimensional filters expand smoothly without distorting the primary page rhythm.
- **Active Filter Indicators**: Counter badge indicating how many filters are currently applied.

---

## 6. Tables and Tabs

Tables and tabs form the backbone of the Accounts Workspace registries.

### 6.1 Records Table Architecture
- **Table Container**: Must declare `overflow-x: auto; width: 100%; border: 1px solid var(--color-border); border-radius: 8px;`.
- **Page Containment Rule**: The table container must contain horizontal scrolling internally; it must **never** trigger document-level or body-level horizontal overflow (`body { overflow-x: hidden; }` is a safety baseline, but internal containers must be constrained).
- **Header Row (`<thead>`)**:
  - Background: `var(--color-surface-secondary)`.
  - Height: `38px`.
  - Text: `font-size: 0.76rem; font-weight: 700; color: var(--color-text-muted);`.
  - Border Bottom: `1px solid var(--color-border)`.
- **Body Rows (`<tbody>`)**:
  - Height: `44px - 48px`.
  - Background: `var(--color-surface)`.
  - Alternate Row / Hover: `var(--color-surface-secondary)` on `:hover`.
  - Cell Padding: `10px 14px`.
  - Border Bottom: `1px solid var(--color-border-subtle)`.
- **Proportional Column Widths**:
  - Checkbox / Row Selector: `44px` fixed.
  - Reference Code / ID: `110px - 130px`.
  - Customer / Entity Name: `minmax(140px, 1.5fr)`.
  - Timestamps / Dates: `110px - 130px`.
  - Financial Amounts: `110px - 130px` (Right-aligned in LTR, Left-aligned in RTL, or aligned with numeral flow).
  - Status Badge: `120px - 140px`.
  - Action Column: `90px - 110px` (Sticky or pinned end-column where appropriate).

### 6.2 Workspace Tabs
- **Container Layout**: Flex row with gap `8px`, border bottom `1px solid var(--color-border)`.
- **Tab Item**:
  - Height: `38px`.
  - Padding: `0 14px`.
  - Font Size: `0.82rem; font-weight: 600;`.
  - Inactive State: Transparent background, text `var(--color-text-muted)`.
  - Active State: Border bottom `2px solid var(--color-primary)` (or `var(--color-accent)`), text `var(--color-primary)` (Light) or `var(--color-text)` (Dark).
  - Count Badges: Nested count pill (`padding: 2px 7px; border-radius: 10px; font-size: 0.72rem; background: var(--color-surface-secondary); color: var(--color-text);`).

---

## 7. Localization Standards (Arabic & English)

Miqat Platform requires complete, authentic, high-fidelity localization in both Arabic (`ar`) and English (`en`).

### 7.1 Zero Leaked Keys Guarantee
- **Never Render Raw Translation Keys**: Translation functions must **never** return raw paths like `accounts_workspace.can_header_title` to the DOM.
- **Fail-Safe Translation Architecture**:
  ```javascript
  // In accounts-workspace.js and local controllers
  function t(keyPath, defaultText) {
    if (!currentDict || !keyPath) return defaultText || '';
    const parts = keyPath.split('.');
    let curr = currentDict;
    for (let i = 0; i < parts.length; i++) {
      if (curr && typeof curr === 'object' && parts[i] in curr) {
        curr = curr[parts[i]];
      } else {
        // Safe fallback to defaultText; NEVER leak raw keyPath to user!
        return defaultText || '';
      }
    }
    return typeof curr === 'string' ? curr : (defaultText || '');
  }
  ```
- **DOM Attribute Binding**:
  ```javascript
  // applyTranslations() must verify resolved string is valid and not a raw key
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key, el.getAttribute('data-i18n-default') || el.textContent);
    if (val && val !== key && !val.includes('.')) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.getAttribute('placeholder')) el.setAttribute('placeholder', val);
      } else {
        el.textContent = val;
      }
    }
  });
  ```

### 7.2 Strict Mode Rules
- **Arabic Mode**:
  - HTML root: `<html lang="ar" dir="rtl">`.
  - 100% Arabic text across headers, descriptors, tables, badges, dialogs, toasts, pagination, and mock data.
  - Numbers and dates formatted per Arabic locale standards.
  - Zero English words accidentally leaked in headers or badges.
- **English Mode**:
  - HTML root: `<html lang="en" dir="ltr">`.
  - 100% English text across all UI elements, mock datasets, and status descriptions.
  - Strictly Latin numerals (`0-9`); zero Eastern Arabic-Indic numerals (`٠-٩`).
  - Zero Arabic characters anywhere in the document.
- **Runtime Toggling**: Switching languages must update all dynamic labels, table records, KPI values, filter dropdowns, and modals **instantly without requiring a page reload**.

---

## 8. Dark and Light Mode Standards

The visual identity must maintain uncompromising contrast, clarity, and institutional prestige in both modes.

### 8.1 Surface Contrast Token Mapping

| Component Surface | Light Mode Token & Value | Dark Mode Token & Value |
|---|---|---|
| **Main Page Canvas** | `var(--color-bg)` (`#F7F4EC`) | `var(--color-bg)` (`#172838`) |
| **Primary Container Cards** | `var(--color-surface)` (`#FFFFFF`) | `var(--color-surface)` (`#22384B`) |
| **Nested Cards & Table Headers** | `var(--color-surface-secondary)` (`#EAF0F5`) | `var(--color-surface-secondary)` (`#2B4358`) |
| **Inputs, Dropdowns & Wells** | `var(--color-surface-tertiary)` / `input-bg` (`#FFFFFF`) | `var(--color-surface-tertiary)` / `input-bg` (`#1A2D3D`) |
| **Card & Table Outlines** | `var(--color-border)` (`#D3DFEB`) | `var(--color-border)` (`#334D64`) |
| **Primary Typography** | `var(--color-text)` (`#24374A`) | `var(--color-text)` (`#F5F2EB`) |
| **Muted & Secondary Text** | `var(--color-text-muted)` (`#526579`) | `var(--color-text-muted)` (`#D0D9E2`) |

### 8.2 Dark Mode Rules
- **Never Pure Black**: The Dark Mode canvas must be `#172838`, conveying the approved "Night in Makkah" atmosphere. Never use `#000000`.
- **Card Elevation**: Elevated cards (`#22384B`) must have clear visible contrast above the background canvas (`#172838`).
- **No Hardcoded Whites**: Never hardcode `#ffffff`, `#fff`, or light rgba backgrounds into cards, modals, or table rows.
- **Zero Inverted Contrast Bugs**: Muted text in Dark Mode must maintain a minimum 4.5:1 contrast ratio against card surfaces.

---

## 9. Responsive Standards (320px to 1920px)

Every workspace page must seamlessly scale across the 12 certified viewports:  
`320px`, `360px`, `375px`, `390px`, `430px`, `768px`, `1024px`, `1280px`, `1366px`, `1440px`, `1600px`, `1920px`.

### 9.1 Viewport Breakpoint Categories
1. **Ultra-Narrow & Mobile (`320px` - `430px`)**:
   - Page container padding: `12px`.
   - KPI Grid: Single column or 2-column compact grid (`grid-template-columns: 1fr;` or `repeat(2, 1fr)`).
   - Filter Toolbar: Stacks vertically; inputs and buttons expand to full width (`100%`).
   - Table: Horizontally scrolls cleanly inside its bordered container, or renders responsive stacked cards.
   - Header: Actions wrap beneath page title.
   - Zero horizontal body overflow.
2. **Tablet & Small Laptop (`768px` - `1024px`)**:
   - KPI Grid: 2-3 column balanced grid.
   - Filter Toolbar: 2 rows of aligned filters with primary actions pinned end.
   - Navigation: Responsive drawer or condensed sidebar.
3. **Standard Desktop & Widescreen (`1280px` - `1920px`)**:
   - Container: Fluid layout with max-width containment (`max-width: 1600px; margin: 0 auto;`).
   - KPI Grid: 5-column balanced row.
   - Table: Full 13-column presentation with clear breathing room.

---

## 10. Visual Quality Checklist

Before submitting any page for production review, run this 10-point visual quality checklist:

- [ ] **1. Design Tokens**: Zero hardcoded hex/rgb colors; all surfaces use CSS custom properties.
- [ ] **2. Typography Scale**: Headings are balanced (`1.35rem` max for page title), weights are calibrated (`400`/`600`/`700`), and tabular nums are applied to data.
- [ ] **3. Zero Leaked Keys**: Scanned DOM for raw translation keys (`accounts_workspace.*` or any un-translated string).
- [ ] **4. 100% Arabic Purity**: In Arabic mode, zero untranslated English strings or reversed LTR punctuation.
- [ ] **5. 100% English Purity**: In English mode, zero Arabic characters or Arabic-Indic numerals.
- [ ] **6. Card Dimensions**: KPI cards share identical height in their row; padding is normalized (`16px 20px`).
- [ ] **7. Button Dimensions**: Primary/Secondary buttons are `38px` high; compact table actions are `32px`.
- [ ] **8. Table Containment**: Wide tables scroll inside `.table-responsive` without spilling onto the page canvas.
- [ ] **9. Dark Mode Contrast**: Checked dark canvas (`#172838`), card elevation (`#22384B`), and text contrast in both modes.
- [ ] **10. Responsive Integrity**: Verified across all 12 target widths from `320px` to `1920px` with zero clipping.

---

## 11. Future Page Implementation Rule

> ### Mandatory Engineering Directive
> **Before implementing any new Miqat page or significantly modifying an existing page, inspect and follow both:**
> 1. `docs/MIQAT-DESIGN-SYSTEM-REFERENCE.md`
> 2. `docs/MIQAT-UI-QUALITY-STANDARD.md`
> 
> **These documents are mandatory implementation references.** Any code, template, or style that violates these standards must be rejected during code review and corrected immediately.
