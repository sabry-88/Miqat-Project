<USER_REQUEST>
# Miqat Company Portal — Page 7: Company Profile
## Professional Implementation, Existing Account Integration & Strict Scope Protection

You are continuing development of the existing **Miqat Platform**, specifically the Company Portal for already contracted and registered tourism companies.

Your next task is to implement the seventh and final Company Portal page:

**Company Profile — بيانات الشركة**

This page represents the existing company's registered business profile, contact information, and available partnership/contract information with Miqat.

This is NOT a new portal, a new company registration page, or a separate account system.

It is a new page within the existing Company Portal, and it must integrate naturally with the existing architecture and the six previously implemented pages.

The previous pages are already implemented. Your responsibility is to build this page professionally while preserving all existing functionality and visual decisions.

**The most important rule: Do not invent a new system, do not duplicate existing components, and do not modify unrelated completed work.**

---

# 1. MANDATORY PRE-IMPLEMENTATION INSPECTION

Before writing or modifying any code, inspect the actual existing project.

Do not assume that a file, field, function, API, or component exists without verifying it.

Inspect the following:

### A. Existing Company Portal

Review the six completed Company Portal pages:

1. Dashboard.
2. Bookings.
3. Booking Details.
4. Financial Overview.
5. Programs & Trips.
6. Notifications.

Use these pages as the reference for the existing architecture, layout, design conventions, navigation, and responsive behavior.

### B. Shared Company Portal Components

Inspect:

- The actual shared Company Portal Navbar.
- The actual shared Footer.
- Existing page navigation and active-link behavior.
- Existing account/company identity display.
- Existing authentication and session management.
- Existing Light/Dark Mode implementation.
- Existing Arabic/English switching mechanism.
- Existing page content container and spacing conventions.

### C. Company Data and Database

Inspect the actual company database records and schema.

Identify:

- Company name.
- Company ID.
- Registered license number, if available.
- Responsible person's name.
- Phone number.
- WhatsApp number, if stored separately.
- Email.
- Governorate and address, if available.
- Company registration and activation information.
- Partnership/contract status.
- Contract information and dates, if stored.
- Any other existing company profile fields.

Determine which fields are editable and which are protected according to the existing business rules.

Do not invent fields that are not supported by the actual system.

### D. Existing Forms and Required Field Indicators

Inspect the existing Register pages carefully.

Identify the exact required-field indicator already approved for Miqat, including:

- Its star/asterisk appearance.
- Its color.
- Its size.
- Its positioning.
- Its spacing.
- Its tooltip, if present.
- Its Arabic and English behavior.
- Its Light and Dark Mode behavior.

Reuse this exact established convention.

Do not create a new required-field indicator.

---

# 2. SHARED COMPANY PORTAL NAVBAR — ABSOLUTELY NO DUPLICATION

This page belongs to the existing Company Portal.

It must use the exact same shared Navbar that is already used by the six completed Company Portal pages.

### Mandatory Requirements

- Do not create a new Navbar.
- Do not copy the existing Navbar HTML into the new page.
- Do not create a page-specific Navbar.
- Do not duplicate its CSS or JavaScript.
- Do not introduce a new navigation structure.
- Reuse the existing shared Navbar implementation exactly as the other Company Portal pages do.

The Company Profile page must be accessible through the existing shared navigation item associated with:

- Company Profile.
- بيانات الشركة.
- My Account / حسابي, only where that is already the existing approved navigation label or route.

**Do not create a second account menu or an additional navigation item if the existing shared Navbar already provides the correct destination.**

The navigation behavior must be:

1. When the company clicks the existing Company Profile / بيانات الشركة / My Account navigation entry, the new Company Profile page opens.
2. The correct navigation item becomes active.
3. All other navigation links continue working.
4. Existing authentication and company identity remain unchanged.
5. Existing theme and language switching continue working.
6. Existing profile and logout interactions remain unchanged.

If a minimal shared Navbar integration is necessary, modify only the required navigation destination or active-state configuration.

**Do not redesign the shared Navbar.**

The new page must look and behave as part of the existing Company Portal, not as an independent website.

---

# 3. PAGE STRUCTURE AND OVERALL LAYOUT

Create a professional, organized Company Profile page.

The page should have a clear visual hierarchy and enough breathing room.

### A. Content Spacing

There must be a proper vertical margin between:

- The shared Navbar.
- The breadcrumb/page navigation, if used by the existing Company Portal.
- The page header.
- The main content.

Do not allow the page content to touch, overlap, or appear attached to the Navbar.

Use the same content width, horizontal alignment, and spacing conventions as the other Company Portal pages.

Do not create unnecessary empty space.

### B. Page Header

The header should contain:

- Page title: Company Profile / بيانات الشركة.
- A short, professional localized subtitle explaining the purpose of the page.
- A clear indication that this is the profile of the currently authenticated company.

Maintain proper alignment in both Arabic RTL and English LTR.

Do not add decorative content that does not serve the page.

### C. Company Information Sections

Organize the profile into clear sections, using the actual available information in the existing company record.

Suggested structure:

1. Company Overview.
2. Company Contact Information.
3. Partnership & Contract Information.
4. Company Status.

Each section must have a clear title, consistent card styling, and an appropriate information hierarchy.

Do not force all information into one oversized card.

Avoid excessive nested cards.

Do not display empty sections or meaningless placeholder information when the corresponding data does not exist.

---

# 4. COMPANY INFORMATION — PROTECTED AND EDITABLE FIELDS

This is one of the most important requirements.

The Company Profile page must clearly distinguish between protected company identity information and editable contact information.

## A. Company Name — PERMANENTLY NON-EDITABLE

The registered company name must NOT be editable from this page.

Requirements:

- Display the actual company name retrieved from the authenticated company's existing record.
- Present it professionally and clearly.
- Do not show an editable input for the company name.
- Do not provide an Edit action for this field.
- Do not allow changing it through the frontend.
- Do not allow changing it by manually manipulating a request in the browser.

The company name is protected identity information.

**It must remain unchanged through this page and its related update operations.**

Do not confuse the responsible person's name with the company name.

## B. License Number — NON-EDITABLE WHEN REGISTERED

If a license number already exists in the company record:

- Display the actual registered number.
- Make it clearly visible.
- Treat it as read-only.
- Do not allow the company to edit it.
- Do not provide an Edit action.
- Do not allow it to be modified through a manually constructed API request.

If no license number exists, follow the existing database and business rules.

Do not invent a license number or create an artificial value.

Do not make an unregistered license number editable unless the existing system explicitly supports an authorized registration/update workflow.

## C. Editable Company Contact Information

Allow editing only the contact and operational profile fields that the existing system permits the company to update.

These may include, when actually supported by the database:

- Responsible person's name.
- Primary phone number.
- WhatsApp number.
- Email address.
- Governorate.
- Address.
- Other existing company contact fields.

The exact editable field list must come from the actual existing company model and approved business rules.

Do not invent additional editable fields.

### Editing Experience

Provide a professional and intuitive editing experience.

Requirements:

- Display the current saved values.
- Provide a clear Edit Profile action.
- Allow the company to edit permitted fields.
- Keep protected fields visibly read-only.
- Provide Save Changes and Cancel actions.
- Cancel must discard unsaved changes and restore the last saved values.
- Save must validate the fields and persist the changes.
- Show a clear success message only after the server confirms successful saving.
- Show meaningful validation or server error messages when saving fails.
- Prevent accidental duplicate submissions.
- Preserve the existing company identity throughout the operation.

Do not create a fake Save button that only changes the page visually.

Do not display a success state before the backend confirms that the changes were saved.

### Validation Requirements

Use the existing project validation conventions.

Examples:

- Validate required fields.
- Validate phone number format according to existing accepted formats.
- Validate email format when an email is provided.
- Apply existing maximum lengths and database constraints.
- Handle optional values correctly.
- Display validation messages in the selected language.
- Preserve existing values when the user cancels editing.
- Prevent modification of protected company fields on both frontend and backend.

Do not create conflicting or unnecessarily restrictive validation rules.

---

# 5. REQUIRED FIELDS — REUSE THE EXACT REGISTER PAGE INDICATOR

All required fields must display the exact same required-field star/asterisk used in the existing Register pages.

This must be visually identical to the approved Register implementation.

### Mandatory Requirements

- Inspect the existing Register pages.
- Reuse the existing `.required-indicator`, `.required-dot`, or the actual equivalent component/class found in the project.
- Do not recreate the indicator using a different design.
- Do not use a different color.
- Do not change its size or positioning.
- Preserve the existing tooltip behavior where implemented.
- Display the indicator beside the appropriate field label.
- Use it only for fields that are genuinely required by the actual validation rules.

The indicator must display correctly in:

1. Arabic + Light Mode.
2. Arabic + Dark Mode.
3. English + Light Mode.
4. English + Dark Mode.

### Important

The required indicator must not be applied indiscriminately to every field.

Use the actual required/optional validation status of each field.

An optional email or phone field must not be marked as required unless the existing system's validation rules explicitly require it.

The visual indicator and backend validation must agree.

---

# 6. PARTNERSHIP AND CONTRACT INFORMATION

The Company Profile page must present the available partnership/contract information between the company and Miqat.

This is an informational section, not an unrestricted contract-editing interface.

First inspect the real database fields and available contract records.

Display only the information that actually exists and that the authenticated company is authorized to view.

Depending on the actual available data, this may include:

- Partnership/contract status.
- Contract reference number.
- Contract start date.
- Contract end date.
- Contract signing date.
- Company license information.
- Current partnership status.
- Other existing contractual information.

### Rules

- Do not invent contractual details.
- Do not fabricate dates or reference numbers.
- Do not display misleading contract statuses.
- Do not create editable fields for legally significant contract information unless an existing authorized workflow explicitly permits it.
- Do not allow ordinary profile editing to modify contract terms, license information, or partnership status.
- Do not expose confidential internal notes or administrative information that the company is not authorized to access.

If a contract document or download mechanism already exists, reuse it according to its existing permissions.

Do not invent a contract upload/download feature if none exists.

### Partnership Status

Display the actual company partnership status using the existing Miqat status badge conventions.

Possible labels must reflect actual stored statuses.

Examples may include:

- Active / نشطة.
- Pending / قيد المراجعة.
- Suspended / موقوفة.
- Expired / منتهية.

Do not assume that every company has the same status.

Status colors must follow the existing theme-aware status design system.

---

# 7. BACKEND INTEGRATION AND DATA SECURITY

This page must work with the existing backend and authenticated company records.

It must not be a static profile mockup.

### A. Data Loading

- Load the profile of the currently authenticated company.
- Use the existing server-side authentication/session mechanism.
- Do not hardcode company names, phone numbers, license numbers, email addresses, or contract information.
- Do not use arbitrary example data in the production interface.
- Handle loading, empty, and error states properly.

### B. Company Ownership and Authorization

- The backend must determine the company identity from the authenticated session.
- Never trust a company ID supplied by the browser to determine which company profile is being updated.
- A company must only be able to view and update its own permitted profile information.
- Prevent a company from accessing another company's private profile or contract details.
- Validate all submitted values on the server.

### C. Protected Fields Enforcement

The protection of the company name and license number must not rely only on disabled or read-only HTML fields.

The backend update operation must explicitly reject unauthorized changes to:

- Company name.
- Registered license number.
- Company ID.
- Partnership/contract status.
- Contract terms.
- Other protected identity or legal fields.

The update operation should accept only an explicit allowlist of editable profile fields.

Do not accept unrestricted database updates from client-provided JSON.

### D. Safe Update Behavior

- Update only fields that are authorized for modification.
- Preserve all unrelated company information.
- Do not overwrite existing values with empty strings accidentally.
- Handle optional values correctly.
- Prevent unintended duplicate submissions.
- Use existing error-handling and response conventions.
- Ensure that a failed profile update does not leave the interface showing unsaved data as if it were permanent.

If the existing system has a company activity/audit mechanism for profile updates, reuse it.

Do not introduce an unnecessary audit architecture or change unrelated database behavior.

---

# 8. ARABIC / ENGLISH LOCALIZATION — ABSOLUTELY NO MIXED LANGUAGE

The Company Profile page must support complete Arabic and English localization.

This requirement applies to every visible interface element, not just the main headings.

### Arabic Mode

- Correct RTL layout.
- Approved Arabic Miqat fonts.
- Correct Arabic labels and descriptions.
- Correct field alignment.
- Correct button placement.
- Correct validation messages.
- Correct success and error notifications.
- Proper Arabic date and number formatting based on existing project conventions.

### English Mode

- Correct LTR layout.
- Approved existing English UI font.
- Professional English terminology.
- Correct text alignment.
- Correct button labels.
- Correct validation and feedback messages.
- Correct date and number formatting based on existing project conventions.

### Localization Coverage

Inspect every source of visible text, including:

- Page HTML.
- Dynamically generated JavaScript text.
- Field labels.
- Input placeholders.
- Required indicators and tooltips.
- Section titles.
- Status badges.
- Edit and Save actions.
- Cancel actions.
- Success messages.
- Error messages.
- Validation messages.
- Empty states.
- Loading states.
- Confirmation dialogs.
- Accessibility labels.
- Any other visible UI text.

Use the existing `ar.json` and `en.json` localization structure and the current translation mechanism.

Do not hardcode interface text directly into the HTML or JavaScript if the project already uses localization keys.

**Arabic mode must never contain accidental English interface text.**

**English mode must never contain accidental Arabic interface text.**

Only approved brand names or intentionally untranslated proper names may remain as they are.

Do not solve localization problems using arbitrary fallback text or by hiding interface elements.

Test actual language switching, not just the initial page load.

---

# 9. LIGHT MODE / DARK MODE — CONSISTENT MIQAT DESIGN

The page must follow the existing Miqat design system exactly.

Do not create a separate visual identity for Company Profile.

Reuse the existing design tokens, theme variables, typography, cards, inputs, buttons, borders, shadows, and badges.

### Visual Requirements

Correctly style:

- Main page background.
- Content sections.
- Company Overview card.
- Contact Information card.
- Partnership/Contract card.
- Read-only information fields.
- Editable inputs.
- Buttons.
- Status badges.
- Required indicators.
- Dividers and borders.
- Hover and focus states.
- Success and error feedback.

### Critical Contrast Rule

No text, button, icon, badge, field, card, or other visual element may have the same or nearly identical background color as the surface behind it when that makes the element difficult to identify.

In particular:

- Cards must be visually distinguishable from the page background.
- Inputs must be visually distinguishable from their cards.
- Buttons must be distinguishable from their surrounding surfaces.
- Read-only fields must be recognizable as protected information.
- Primary and secondary actions must have clear visual hierarchy.
- All labels and values must remain readable.

Use existing approved Miqat theme tokens.

Do not invent arbitrary HEX/RGB/HSL colors.

Do not modify global design tokens to make this page look correct.

If a page-specific style is necessary, scope it under the Company Profile page root class.

---

# 10. TYPOGRAPHY AND VISUAL QUALITY

The Company Profile page must use the exact typography system already approved for Miqat.

### Arabic

- Use the existing approved Arabic font configuration.
- Preserve the established Arabic typography hierarchy.
- Maintain proper line heights and spacing.
- Avoid awkward wrapping and oversized labels.
- Use the approved Ruq'ah treatment only where existing Miqat heading conventions allow it.

### English

- Use the existing approved English interface font.
- Do not use the Arabic font for English content.
- Do not introduce Inter or any new font.
- Preserve consistent font weights and sizes across all sections.

### Overall UI/UX Quality

The page must be:

- Professional.
- Calm.
- Premium.
- Well-structured.
- Easy to read.
- Comfortable for business users.
- Consistent with the other six Company Portal pages.

Avoid:

- Excessive card nesting.
- Oversized headings.
- Oversized buttons.
- Unnecessary icons.
- Arbitrary decorative gradients.
- Excessive shadows.
- Inconsistent spacing.
- Crowded information.
- Generic AI-generated dashboard patterns.
- Unnecessary animation.

Prioritize clarity, natural proportions, and usability.

---

# 11. RESPONSIVE DESIGN — EXISTING STANDARD VIEWPORTS

The page must follow the project's existing responsive standards.

Test these viewport widths:

- 1920px.
- 1680px.
- 1440px.
- 1366px.
- 1280px.
- 1024px.
- 768px.
- 390px.
- 320px.

### Requirements

- No horizontal overflow.
- No overlapping elements.
- No clipped text.
- No distorted cards.
- No oversized input fields.
- No buttons extending beyond their containers.
- No broken field labels.
- Proper Arabic RTL behavior.
- Proper English LTR behavior.
- Proper Navbar integration.
- Proper Footer alignment.

On mobile:

- Reorganize sections naturally.
- Stack cards only where appropriate.
- Keep labels and values readable.
- Make form fields comfortable to use.
- Ensure Edit, Save, and Cancel actions remain accessible.
- Prevent important contract information from becoming unreadable.

Do not simply shrink desktop elements.

Use proper responsive layout behavior consistent with the other Company Portal pages.

---

# 12. STRICT SCOPE PROTECTION — DO NOT TOUCH UNRELATED WORK

This task is for the seventh Company Portal page only.

The previous six pages are already implemented and must be preserved.

### You are authorized to:

1. Create the Company Profile page.
2. Add its required link to the existing shared Navbar only if that link is missing or incorrectly configured.
3. Implement its page-specific layout and styling.
4. Reuse existing company data and backend operations.
5. Implement the minimum necessary profile-specific update operation if the existing backend does not already provide one.
6. Add the required Arabic and English localization entries.
7. Add the minimum necessary integration for correct authentication and active navigation.

### You MUST NOT MODIFY:

- Dashboard.
- Bookings.
- Booking Details.
- Financial Overview.
- Programs & Trips.
- Notifications.
- Their existing cards, charts, tables, filters, forms, or modals.
- Shared Navbar design.
- Shared Footer design.
- Global CSS or design tokens.
- Authentication and registration workflows.
- Login and password validation.
- Booking operations.
- Payment operations.
- Financial calculations.
- Program-management operations.
- Program-change approval workflow.
- Notification generation and handling.
- WhatsApp integrations.
- Unrelated database tables.
- Unrelated API endpoints.
- Other customer-facing pages.

### Mandatory Preservation Rules

- Do not create a second Company Portal.
- Do not create another Navbar.
- Do not duplicate the Footer.
- Do not redesign shared components.
- Do not rewrite entire existing files unnecessarily.
- Do not change protected company identity information.
- Do not make unrelated improvements.
- Do not introduce new third-party dependencies without a proven necessity.
- Do not overwrite existing user changes.
- Do not make destructive database migrations.
- Do not change global styling for a page-specific issue.

If an integration requires a broader modification, stop and explain the exact technical dependency instead of making an unsafe or unrelated change.

---

# 13. REQUIRED TESTING AND VERIFICATION

Do not report that the implementation is complete based on source code inspection alone.

Run the existing project and inspect the actual rendered Company Profile page.

### A. Navigation

- Open the page through the existing shared Company Portal Navbar.
- Verify the correct active navigation state.
- Navigate between the Company Profile page and all six existing pages.
- Verify the shared Navbar has not been duplicated.
- Verify all existing navigation actions still work.

### B. Company Data

- Verify the profile displays the actual authenticated company's information.
- Verify protected identity fields display correctly.
- Verify that missing optional information is handled correctly.
- Verify the correct partnership and contract information is displayed where available.

### C. Editing

Test the actual permitted editing workflow:

1. Open Edit Profile.
2. Modify an allowed field, such as the responsible person's name.
3. Save the changes.
4. Confirm the server successfully persists the update.
5. Refresh the page.
6. Verify the saved value remains correct.
7. Test Cancel and confirm unsaved changes are discarded.

Also verify that:

- Company name cannot be changed.
- Registered license number cannot be changed.
- Protected fields cannot be modified through a manually constructed request.
- A company cannot update another company's profile.
- Unauthorized fields are rejected by the server.

Do not claim backend protection based only on disabled HTML inputs.

### D. Required Indicators

Verify that:

- Required fields show the exact Register-style star.
- Optional fields do not incorrectly show a required indicator.
- Arabic and English versions are correct.
- The indicator is correctly displayed in Light and Dark Mode.
- UI indicators and actual server validation rules agree.

### E. Localization and Themes

Test all four combinations:

1. Arabic + Light Mode.
2. Arabic + Dark Mode.
3. English + Light Mode.
4. English + Dark Mode.

Inspect the entire page, including every form label, field, button, badge, validation message, and tooltip.

There must be no accidental mixed-language content.

### F. Responsive Tests

Test all nine viewport widths listed in Section 11.

Inspect the actual rendered page for alignment, readability, content wrapping, overflow, and accessible actions.

### G. Regression Tests

Reopen all six previously completed Company Portal pages.

Verify that:

- Their shared Navbar remains unchanged.
- Their Footer remains unchanged.
- Their visual design remains unchanged.
- Their existing navigation continues to work.
- Their existing logic and functionality remain intact.

Do not claim successful regression testing unless it was actually executed.

---

# 14. FINAL IMPLEMENTATION REPORT

When the work is finished, provide a detailed but factual report containing:

1. Files created.
2. Existing files modified.
3. Company profile sections implemented.
4. Exact fields that are editable.
5. Exact fields that are protected.
6. Confirmation that the company name cannot be modified.
7. Confirmation that an existing license number cannot be modified.
8. How profile data is loaded from the authenticated company record.
9. How profile updates are validated and saved.
10. How company ownership and authorization are enforced.
11. How the page uses the real shared Company Portal Navbar.
12. Confirmation that no duplicate Navbar was created.
13. Arabic/English localization results.
14. Light/Dark Mode results.
15. Responsive test results for all specified viewport widths.
16. Regression test results for the previous six pages.
17. Any issues or limitations that remain.

For each test, specify whether it was:

- Actually executed and passed.
- Executed and failed.
- Not executed.
- Not applicable.

Never claim that something was tested or verified when it was not.

---

# FINAL NON-NEGOTIABLE INSTRUCTION

Implement the seventh and final Company Portal page as a professional, fully integrated Company Profile experience.

It must use the existing shared Navbar and existing authenticated company account.

Company identity fields must be protected.

Permitted contact information must be editable and saved through the actual backend.

Partnership and contract information must be displayed accurately using real existing records.

Arabic, English, Light Mode, Dark Mode, and responsive layouts must all work correctly.

**Protect all six completed pages and all existing business logic. Only make the minimum changes required to implement and safely integrate Company Profile.**

Do not improvise new systems, do not duplicate existing components, and do not modify anything unrelated to this task.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-11-01T17:56:59+02:00.

The user's current state is as follows:
Active Document: d:\Miqat Platform\scratch\verify_notifications_fixes.cjs (LANGUAGE_UNSPECIFIED)
Cursor is on line: 1
Other open documents:
- d:\Miqat Platform\Miqat UI-UX\styles.css (LANGUAGE_UNSPECIFIED)
- d:\Miqat Platform\Miqat UI-UX\index.html (LANGUAGE_UNSPECIFIED)
- d:\Miqat Platform\Miqat UI-UX\script.js (LANGUAGE_UNSPECIFIED)
</ADDITIONAL_METADATA>