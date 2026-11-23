# Miqat Platform — Responsive Design System & Architecture Guidelines

> **Mandatory Standard for All Future Pages, Sections, and Components**  
> Every current and future page in the **Miqat Hajj & Umrah Platform** must adhere to the responsive architecture, breakpoint tokens, layout patterns, and validation checklist documented here. Do not invent isolated media queries or hardcoded widths.

---

## 1. Core Architectural Breakpoints

The Miqat responsive system is built on a container-aligned, content-aware breakpoint scale. Breakpoints are chosen based on the actual horizontal footprint required by content (including bilingual text lengths), rather than arbitrary device names.

| Breakpoint | Target Viewports | Primary Layout Adaptations |
|---|---|---|
| **`> 1320px`** | Large Desktops (1440px, 1600px, 1920px) | Full desktop navigation bar with fluid `clamp()` gaps and margins. Centered container capped at `--container-max: 1320px`. |
| **`<= 1320px`** | Compact Laptops, Laptops, Landscape Tablets (1180px–1320px) | **Adaptive Burger Menu Transition**: Desktop navigation links (`.nav-desktop`) transition into the sliding drawer. The top bar preserves Brand, Language Switcher, Theme Toggle, Sign In, and Create Account, maintaining >500px of balanced breathing room with zero clipping. |
| **`<= 1024px`** | Portrait Tablets & iPads (768px–1024px) | Gateways grid reflows to 1 column; Program category cards reflow from 3 to 2 columns; "How It Works" steps reflow from 4 to 2 columns; Partnerships grid stacks to 1 column; Footer reflows from 4 to 2 columns. |
| **`<= 768px`** | Small Tablets & Large Phones (600px–768px) | All multi-column cards stack to 1 column (`.cards-grid`, `.steps-grid`, `.value-grid`); Header height scales to 66px; Register CTA and standalone control buttons collapse into the mobile drawer. |
| **`<= 680px`** | Phablets & Mobile Devices | Account type selection cards (`.account-type-grid`) transition from 2 columns to 1 column. |
| **`<= 520px`** | Standard Mobile Viewports | Auth header scales to 60px; Back-to-home button in auth headers collapses to an accessible icon-only button; Auth card padding optimizes to `clamp(16px, 4vw, 24px)`. |
| **`<= 480px`** | Standard Phones (380px–480px) | Hero and CTA button groups stack to 100% width vertical layout; Category filter tabs stack full-width for touch targets. |
| **`<= 380px`** | Compact Mobile Phones (320px–380px) | Brand English wordmark tagline hides; Header Login button collapses into the drawer menu, reserving the top bar exclusively for the Brand Logo and the 44px touch-target Burger Menu button with zero horizontal overflow. |

---

## 2. The Navbar & Burger Menu Rule

### The Space Problem at `1180px – 1320px`
The full desktop Navbar comprises three heavy blocks:
1. **Brand Wordmark & Logo:** ~180px – 200px
2. **6 Navigation Links:** ~655px (EN) to ~730px (AR)
3. **Action Controls (Lang + Theme + Login + Register):** ~370px
4. **Container padding & gaps:** ~96px

**Sum = 1300px – 1374px.**  
At viewports between 1180px and 1320px (e.g. `1285.6px`, `1240px`, `1200px`), forcing these three blocks side-by-side caused severe crowding, wrapping, and the end buttons to be clipped outside the viewport.

### The Established Solution
At `@media (max-width: 1320px)`:
1. `.nav-desktop` is hidden (`display: none`).
2. `.menu-toggle-btn` is displayed (`display: inline-flex`).
3. Primary actions (Language, Theme, Login, Register) remain visible and accessible in `.header-actions` down to `768px`.
4. The Burger Menu button opens `#mobileNavDrawer` containing all section navigation links, plus dedicated mobile controls and registration actions.
5. At screens `< 768px`, secondary buttons collapse into the drawer, ensuring the top bar remains clean and uncluttered.

---

## 3. Bilingual (RTL / LTR) & Theme Rules

1. **Logical CSS Properties:**
   - Always use `margin-inline`, `padding-inline`, `border-inline-start`, `border-inline-end`, and `inset-inline` instead of physical `left`/`right`.
   - Never use physical `margin-left` or `float` that breaks in the opposite direction.
2. **Directional Drawer Transitions:**
   - Arabic (`[dir="rtl"]`): Drawer is anchored at `right: 0;` and transitions from `translateX(100%)` to `translateX(0)`.
   - English (`[dir="ltr"]`): Drawer is anchored at `left: 0;` and transitions from `translateX(-100%)` to `translateX(0)`.
3. **Typography & Diacritics:**
   - Arabic display & body font: `'IBM Plex Sans Arabic'`.
   - Maintain a minimum `line-height: 1.42` and `padding-top` on headings with Arabic diacritics (tashkeel) to avoid clipping or collisions.
   - Do not apply `letter-spacing` to Arabic text; restrict tracking strictly to `[dir="ltr"]`.
4. **Contrast & Theme Tokens:**
   - Gold accent backgrounds (`--color-accent`: `#D1B16C` or `#C5A15E`) must always use deep navy text (`#12202D`) with hover `#0A141E`, ensuring **WCAG AAA contrast (>7.5:1)** in both Light and Dark modes.

---

## 4. Container & Layout Utilities

- **Global Page Container:** `.container` has `max-width: var(--container-max); margin-inline: auto; padding-inline: clamp(16px, 4vw, 28px);`.
- **Narrow Container:** `.container-narrow` has `max-width: var(--container-narrow);` (880px) for editorial and transparency sections.
- **Auth Card:** `.auth-card` has `max-width: var(--container-auth);` (480px), `.auth-card-wide` (540px), `.auth-card-choice` (700px).
- **Fluid Typography:** Use CSS `clamp()` for headings and card titles (e.g. `clamp(1.65rem, 4vw, 1.95rem)`).
- **Grid Layouts:** Use `display: grid` with `minmax()` or clean fractional columns; stack gracefully using media queries without fixed column pixel widths.

---

## 5. Mandatory Viewport Validation Checklist

Before any new page, card, or modal is merged, it must be verified across this exact matrix:

- [ ] **Ultra-Small Mobile (320px–360px):** Zero horizontal scrollbar, touch targets >= 40px, text wraps naturally.
- [ ] **Standard Mobile (375px–390px):** Form fields, buttons, and badges fit within container margins.
- [ ] **Large Mobile (414px–430px):** Header layout balanced, card grids render properly.
- [ ] **Tablet Portrait (768px–820px):** Burger menu active, 2-column card layouts balanced.
- [ ] **Tablet Landscape / Small Laptop (1024px–1180px):** Burger menu active, header actions visible, generous breathing room.
- [ ] **Intermediate Laptops (1200px, 1285.6px, 1290px):** Header is completely balanced with zero button clipping.
- [ ] **Standard Desktop (1366px, 1440px, 1920px):** Full desktop navigation active, container centered cleanly.
- [ ] **RTL (Arabic) & LTR (English):** All text aligned logically; drawer opens from correct side.
- [ ] **Light Mode & Dark Mode:** WCAG AAA contrast maintained on all buttons, badges, and cards.
- [ ] **Keyboard & Accessibility:** Escape key closes open menus and modals; focus indicators remain clearly visible.
