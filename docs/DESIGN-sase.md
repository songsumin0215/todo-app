---
description: |
  A bold, friendly, warm and trustworthy food-brand interface system for
  SASE. SASE Red leads brand recognition and primary actions; Warm
  Orange adds appetite and energy; Pink Red provides a friendly accent.
  Rounded surfaces, clear hierarchy, approachable iconography and
  appetizing food photography make product discovery and everyday tasks
  feel simple and inviting.
name: SASE Design System
version: 1.0
---

# SASE Design System

> **Brand direction:** Bold · Friendly · Warm · Trustworthy · Simple\
> **Primary use:** SASE digital products, websites, commerce
> experiences, internal tools, dashboards and presentation materials.

## 1. Overview

The SASE visual language combines the strong recognition of the red SASE
logo with the appetite appeal of warm orange and food photography. The
interface should feel energetic without becoming noisy, approachable
without losing clarity, and reliable enough for product, quality and
operational information.

The supplied design-system reference image establishes five core
principles:

-   **Bold:** Distinctive brand presence, confident headings and clear
    primary actions.
-   **Friendly:** Approachable language, rounded shapes and expressive
    but simple icons.
-   **Warm:** Red and orange accents, appetizing food imagery and soft
    surfaces.
-   **Trustworthy:** Consistent components, clear states and legible
    information.
-   **Simple:** Clean layouts, restrained decoration and predictable
    interaction patterns.

### Visual signature

1.  SASE Red is the principal brand and action color.
2.  Warm Orange is the secondary action and appetite-supporting color.
3.  Pink Red is a supporting accent for highlights, tags and friendly
    emphasis.
4.  White and light neutral surfaces keep product and operational
    information easy to scan.
5.  Rounded cards, controls and chips create a consistent, welcoming
    interface.
6.  Food photography should be high quality, natural-looking and
    appetizing.

### Design balance

Use red as the strongest signal, not as a background for every element.
Orange should support hierarchy and calls to action; pink should be used
selectively. Large areas should remain white or light neutral so that
the interface feels clean and information remains readable.

------------------------------------------------------------------------

## 2. Design Tokens

### 2.1 Color palette

The following values are transcribed from the supplied SASE
design-system reference image.

#### Brand colors

  -----------------------------------------------------------------------
  Token                   Hex                     Role
  ----------------------- ----------------------- -----------------------
  `colors.primary`        `#E3182F`               SASE Red; primary brand
                                                  color and main action

  `colors.secondary`      `#F59E0B`               Warm Orange; secondary
                                                  action and energetic
                                                  emphasis

  `colors.accent`         `#FF6B81`               Pink Red; highlights,
                                                  promotional emphasis
                                                  and friendly accents
  -----------------------------------------------------------------------

#### Neutral colors

  -----------------------------------------------------------------------
  Token                   Hex                     Role
  ----------------------- ----------------------- -----------------------
  `colors.ink`            `#111827`               Strong text and
                                                  high-emphasis icons

  `colors.text-normal`    `#374151`               Standard body text

  `colors.text-muted`     `#6B7280`               Secondary text, helper
                                                  text and captions

  `colors.border`         `#D1D5DB`               Input and component
                                                  borders

  `colors.surface`        `#E5E7EB`               Subtle surface and
                                                  control backgrounds

  `colors.background`     `#F3F4F6`               Page background and
                                                  low-emphasis regions

  `colors.white`          `#FFFFFF`               Cards, input
                                                  backgrounds and text on
                                                  strong fills
  -----------------------------------------------------------------------

#### Semantic colors

The reference image does not specify dedicated success, warning or
information colors. Use these semantic mappings as implementation
guidance only, and validate them against the product's accessibility and
operational requirements before release.

  -----------------------------------------------------------------------
  Token                   Recommended treatment   Use
  ----------------------- ----------------------- -----------------------
  `colors.success`        Green with sufficient   Completed, approved and
                          contrast                ready states

  `colors.warning`        Warm amber/orange       Attention required or
                                                  approaching deadline

  `colors.error`          `colors.primary`        Invalid input, failed
                                                  action and critical
                                                  error

  `colors.info`           Blue                    Informational notice
                                                  and neutral system
                                                  guidance
  -----------------------------------------------------------------------

#### Color usage rules

-   Use `colors.primary` for the logo-adjacent brand expression, primary
    buttons, active navigation and key emphasis.
-   Use `colors.secondary` for secondary buttons, promotional markers
    and selected appetite-oriented highlights.
-   Use `colors.accent` sparingly for new-item labels, campaign emphasis
    and friendly visual accents.
-   Use `colors.ink` and `colors.text-normal` for text; do not use
    bright brand colors for long paragraphs.
-   Keep white or light neutral backgrounds behind dense information.
-   Always verify text/background contrast, especially for small labels
    placed on red, orange or pink fills.

### 2.2 Color scale guidance

The reference image shows tonal swatches for the three brand colors but
does not provide individual hexadecimal values for every shade. Do not
invent shade tokens from the swatches. If a product requires hover,
pressed or disabled shades, derive them from the approved base color in
implementation and document the resulting values in the codebase.

------------------------------------------------------------------------

## 3. Typography

### 3.1 Typeface

The reference image identifies the typography by role and weight, but
does not specify a named font family. Use the following practical stack:

-   **Preferred:** The approved SASE corporate typeface, if one is
    available.
-   **Fallback:** `Pretendard, "Noto Sans KR", system-ui, sans-serif`.
-   Use a consistent Korean-capable font across headings, body copy,
    forms and navigation.

### 3.2 Type scale

The sizes below follow the ranges shown in the reference image. Where
the image gives a range, select a responsive value within that range.

  ----------------------------------------------------------------------------------------
  Token                                 Size          Weight     Recommended Use
                                                                 line height 
  -------------------------- --------------- --------------- --------------- -------------
  `typography.display`              40--56px             700            1.15 Main page and
                                                                             hero headings

  `typography.heading`              28--36px             700             1.2 Major section
                                                                             headings

  `typography.subheading`           20--24px             700             1.3 Card and
                                                                             subsection
                                                                             headings

  `typography.body`                 16--18px             400             1.5 Main body
                                                                             text

  `typography.body-strong`          16--18px             700             1.5 Emphasis
                                                                             within body
                                                                             content

  `typography.label`                12--14px             500             1.4 Form labels,
                                                                             chips and
                                                                             metadata

  `typography.caption`              12--14px             400             1.4 Helper text
                                                                             and secondary
                                                                             information

  `typography.button`               14--16px             700             1.2 Button labels
  ----------------------------------------------------------------------------------------

### 3.3 Typography principles

-   Use bold weight 700 for headings and primary action labels to create
    a confident, recognizable hierarchy.
-   Use regular weight 400 for paragraphs and longer descriptions.
-   Use medium weight 500 for labels, metadata and compact interface
    text.
-   Avoid using display-sized text for dense operational content.
-   Keep line lengths comfortable and provide sufficient line height for
    Korean text.
-   Use tabular numerals for prices, quantities, dates and dashboard
    metrics when supported.

------------------------------------------------------------------------

## 4. Layout, Spacing and Shape

### 4.1 Spacing scale

The reference image specifies an 8pt grid and the following visible
spacing values.

  Token           Value Typical use
  ------------- ------- ----------------------------------
  `spacing.1`       8px Tight inline spacing
  `spacing.2`      16px Control padding and compact gaps
  `spacing.3`      24px Card padding and component gaps
  `spacing.4`      32px Section grouping
  `spacing.5`      40px Large component separation

Use multiples of 8px for most structural spacing. Small optical
adjustments are acceptable when required for icon alignment or
typography.

### 4.2 Corner radius

  Token             Value Use
  --------------- ------- -----------------------------------------
  `radius.sm`         4px Small tags and compact controls
  `radius.md`         8px Inputs and small containers
  `radius.lg`        12px Standard cards and buttons
  `radius.xl`        16px Large cards and prominent panels
  `radius.full`     999px Pills, chips and fully rounded controls

The reference image presents a rounded visual language. Keep radii
consistent within a component family rather than assigning arbitrary
values to individual elements.

### 4.3 Layout principles

-   Prefer a clear grid with consistent alignment and predictable
    gutters.
-   Use white cards on a light neutral page background to separate
    content.
-   Reserve strong red or orange surfaces for key actions and selected
    emphasis.
-   Group related information in cards; avoid unnecessary nested
    containers.
-   Keep product photography visually prominent while ensuring the
    product name, price and action remain easy to find.
-   For data-heavy screens, prioritize alignment, readable labels and
    whitespace over decorative styling.

------------------------------------------------------------------------

## 5. Components

Component descriptions below translate the supplied visual reference
into implementation guidance. Exact dimensions not explicitly shown in
the image should be treated as recommended starting points, not measured
production specifications.

### 5.1 Buttons

  -----------------------------------------------------------------------
  Component               Appearance              Use
  ----------------------- ----------------------- -----------------------
  `button.primary`        SASE Red fill, white    Main action on a screen
                          bold label, rounded     
                          corners                 

  `button.secondary`      Warm Orange fill, white Secondary or
                          bold label, rounded     promotional action
                          corners                 

  `button.outlined`       White fill, red border  Alternative action with
                          and red label           lower emphasis

  `button.ghost`          Light neutral fill, red Low-emphasis action
                          label                   

  `button.inverted`       Dark charcoal fill,     Action on a light or
                          white label             brand-colored region
  -----------------------------------------------------------------------

**Behavior and states**

-   Default: use the component's defined fill, border and text color.
-   Focus: show a clearly visible focus indicator that is not conveyed
    by color alone.
-   Pressed: provide immediate visual feedback without changing the
    component's meaning.
-   Disabled: reduce emphasis and prevent interaction; maintain readable
    contrast.
-   Loading: preserve button width and communicate progress with text or
    a progress indicator.

Use one primary button per visual action group whenever possible. Do not
place multiple equally prominent red buttons next to one another unless
the workflow genuinely contains parallel primary actions.

### 5.2 Form controls

#### Search field

-   White background with a subtle neutral border.
-   Search icon aligned to the leading edge.
-   Placeholder text uses muted neutral color.
-   Rounded shape consistent with the input family.

#### Text input

-   White background, neutral border and dark text.
-   Use a persistent label rather than relying on placeholder text
    alone.
-   Provide clear focus, error, disabled and read-only states.

#### Filter chips

-   Use compact rounded chips for filters such as product category,
    storage state or status.
-   Selected chips may use a pale brand tint with red text or border.
-   Include a visible removal affordance when the chip is removable.

#### Text field states

  State      Visual guidance
  ---------- -----------------------------------------------------------
  Default    White surface and neutral border
  Focused    Red border or focus ring
  Error      Red border, error icon and concise explanatory message
  Disabled   Muted surface and text; interaction unavailable
  Success    Clear confirmation message and semantic success indicator

Do not communicate errors or success by color alone; include text or an
icon with an accessible name.

### 5.3 Cards

#### Product card --- `card.product`

Recommended structure:

1.  Product image with a consistent crop and rounded top corners.
2.  Product name in bold, high-contrast text.
3.  Short description in normal body text.
4.  Price or key product information.
5.  Primary purchase or detail action.

Use appetizing, high-resolution product imagery. Avoid stretching images
or mixing inconsistent photography styles within the same product list.

#### Information card --- `card.information`

-   White surface.
-   Rounded corners.
-   Consistent internal padding based on the 8pt spacing scale.
-   Clear heading, supporting copy and optional action.
-   Use subtle borders or surface contrast to define the card; avoid
    excessive shadows.

### 5.4 Tabs and navigation

-   Use a segmented tab container with a clearly distinguished active
    tab.
-   The active tab should use SASE Red or a light red tint with strong
    text contrast.
-   Inactive tabs should remain visually quiet.
-   Navigation icons should be simple, familiar and paired with labels
    where meaning may be unclear.
-   Keep active, selected and current-page states visually consistent
    across the product.

### 5.5 Badges and pills

Recommended semantic examples:

  Badge             Meaning                        Suggested treatment
  ----------------- ------------------------------ -------------------------
  `New`             Newly added                    Pink Red tint
  `Best`            Best seller or featured        Warm yellow/orange tint
  `Sale`            Discount or promotion          Pink/red tint
  `Limited`         Limited availability           Neutral gray tint
  `Chicken`         Product category               Pale red tint
  `Frozen`          Storage or product condition   Pale blue tint
  `Ready to Cook`   Preparation state              Pale green tint

Badge colors are visual recommendations based on the reference image.
Confirm semantic meaning and contrast before production.

### 5.6 Iconography

-   Prefer simple, recognizable outline icons with consistent stroke
    weight.
-   Use red for high-emphasis brand actions and neutral gray for utility
    actions.
-   Use icons to reinforce labels, not replace important text.
-   Keep icon-button hit areas large enough for touch interaction.
-   Provide accessible labels for icon-only controls.

------------------------------------------------------------------------

## 6. Imagery and Brand Expression

### 6.1 Food photography

Food photography is a central part of the SASE brand experience.

-   Show the food clearly, with appetizing texture, color and lighting.
-   Prefer realistic product photography over generic decorative
    illustrations.
-   Use close-up crops for hero areas and product cards when the food
    remains recognizable.
-   Keep lighting and color treatment consistent across a product
    collection.
-   Avoid excessive saturation, artificial-looking textures or overlays
    that distort the actual product.
-   Do not allow decorative photography to reduce text legibility.

### 6.2 Logo

-   Use the supplied official SASE logo artwork.
-   Preserve its proportions, clear space and original colors.
-   Do not recreate the logo with editable text or apply unapproved
    effects.
-   Place the logo on a background that provides sufficient contrast.
-   Do not stretch, rotate, crop or recolor the logo.

### 6.3 Brand voice

Use language that is confident, friendly and direct.

-   Prefer short, understandable sentences.
-   Make product and action labels specific.
-   Use warm, inviting language in consumer-facing experiences.
-   Use precise, unambiguous language for food safety, quality,
    compliance and operational workflows.
-   Avoid jokes or playful expressions in critical safety and compliance
    messages.

------------------------------------------------------------------------

## 7. Brand Principles

### Bold

Create a recognizable presence through SASE Red, strong headings and
clear calls to action. Use emphasis deliberately.

### Friendly

Make interfaces approachable through plain language, rounded components
and familiar icons.

### Warm

Use appetizing food imagery and warm brand colors to create an inviting
experience.

### Trustworthy

Maintain consistent component behavior, legible information and clear
feedback. Critical information must never be hidden behind decorative
styling.

### Simple

Reduce unnecessary visual elements. Make the next action obvious and
keep navigation predictable.

------------------------------------------------------------------------

## 8. Accessibility and Interaction Guidance

The supplied reference image does not define a complete accessibility
specification. The following are recommended implementation
requirements:

-   Maintain WCAG-aligned text and control contrast; verify actual color
    pairs before release.
-   Do not use color as the only indicator of selection, error, success
    or status.
-   Provide visible keyboard focus for all interactive elements.
-   Ensure controls have accessible names and logical keyboard order.
-   Use sufficiently large touch targets; aim for at least 44 × 44px for
    primary touch controls.
-   Associate form labels and error messages programmatically with their
    fields.
-   Respect reduced-motion preferences and avoid unnecessary animation.
-   Provide meaningful alternative text for informative food and product
    images; use empty alternative text for purely decorative images.

------------------------------------------------------------------------

## 9. Responsive Behavior

The supplied reference image does not specify breakpoints. Use these
proposed breakpoints as an initial implementation convention and adjust
them after testing real content:

  ------------------------------------------------------------------------
  Name                                         Width Recommended behavior
  --------------------- ---------------------------- ---------------------
  Small mobile                               ≤ 480px Single-column layout;
                                                     compact spacing;
                                                     simplified navigation

  Mobile                                  481--767px One- or two-column
                                                     cards depending on
                                                     content width

  Tablet                                 768--1023px Two-column content
                                                     grids; navigation may
                                                     condense

  Desktop                               1024--1439px Full navigation and
                                                     multi-column card
                                                     layouts

  Wide desktop                              ≥ 1440px Constrain content
                                                     width and preserve
                                                     comfortable reading
                                                     lengths
  ------------------------------------------------------------------------

Responsive rules:

-   Keep primary actions visible and easy to reach on small screens.
-   Stack form controls and card content when horizontal space is
    limited.
-   Preserve image aspect ratios and use intentional responsive crops.
-   Avoid shrinking body text below a comfortable reading size.
-   Prevent horizontal scrolling except where a deliberate data table or
    carousel requires it.

------------------------------------------------------------------------

## 10. Do's and Don'ts

### Do

-   Use SASE Red as the primary brand and action color.
-   Use Warm Orange and Pink Red as supporting accents.
-   Keep body text dark and readable on light surfaces.
-   Follow the 8pt spacing rhythm.
-   Use the defined rounded-corner scale consistently.
-   Use high-quality, appetizing and authentic food photography.
-   Provide clear form labels, validation messages and interaction
    states.
-   Keep safety, quality and compliance information especially clear.

### Don't

-   Do not use red, orange and pink at equal strength across the same
    screen.
-   Do not use brand colors for long blocks of body text.
-   Do not invent or alter the official SASE logo.
-   Do not mix unrelated icon styles or inconsistent corner radii.
-   Do not rely on color alone to convey a status or error.
-   Do not use decorative imagery that competes with important product
    or operational information.
-   Do not add shadows, gradients or ornamental effects without a clear
    functional purpose.
-   Do not treat proposed semantic colors or responsive breakpoints as
    official brand specifications until approved.

------------------------------------------------------------------------

## 11. Implementation Tokens (YAML)

The YAML below is a practical starter token set derived from the
supplied reference image. Typography line heights, semantic colors and
responsive breakpoints are implementation recommendations where the
reference does not specify exact values.

``` yaml
version: "1.0"
name: "SASE Design System"

colors:
  primary: "#E3182F"
  secondary: "#F59E0B"
  accent: "#FF6B81"
  ink: "#111827"
  text-normal: "#374151"
  text-muted: "#6B7280"
  border: "#D1D5DB"
  surface: "#E5E7EB"
  background: "#F3F4F6"
  white: "#FFFFFF"

typography:
  font-family: 'Pretendard, "Noto Sans KR", system-ui, sans-serif'
  display:
    font-size: "40–56px"
    font-weight: 700
    line-height: 1.15
  heading:
    font-size: "28–36px"
    font-weight: 700
    line-height: 1.2
  subheading:
    font-size: "20–24px"
    font-weight: 700
    line-height: 1.3
  body:
    font-size: "16–18px"
    font-weight: 400
    line-height: 1.5
  body-strong:
    font-size: "16–18px"
    font-weight: 700
    line-height: 1.5
  label:
    font-size: "12–14px"
    font-weight: 500
    line-height: 1.4
  caption:
    font-size: "12–14px"
    font-weight: 400
    line-height: 1.4
  button:
    font-size: "14–16px"
    font-weight: 700
    line-height: 1.2

spacing:
  1: "8px"
  2: "16px"
  3: "24px"
  4: "32px"
  5: "40px"

radius:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "999px"

components:
  button-primary:
    background: "{colors.primary}"
    foreground: "{colors.white}"
    font: "{typography.button}"
    radius: "{radius.lg}"
  button-secondary:
    background: "{colors.secondary}"
    foreground: "{colors.white}"
    font: "{typography.button}"
    radius: "{radius.lg}"
  button-outlined:
    background: "{colors.white}"
    foreground: "{colors.primary}"
    border: "{colors.primary}"
    radius: "{radius.lg}"
  button-ghost:
    background: "{colors.background}"
    foreground: "{colors.primary}"
    radius: "{radius.lg}"
  button-inverted:
    background: "{colors.ink}"
    foreground: "{colors.white}"
    radius: "{radius.lg}"
  input:
    background: "{colors.white}"
    foreground: "{colors.ink}"
    border: "{colors.border}"
    radius: "{radius.md}"
  product-card:
    background: "{colors.white}"
    foreground: "{colors.ink}"
    radius: "{radius.xl}"
  badge:
    radius: "{radius.full}"
  page:
    background: "{colors.background}"
    foreground: "{colors.ink}"
```

------------------------------------------------------------------------

## 12. Governance and Maintenance

To keep the design system consistent as SASE digital products grow:

1.  Treat approved color, typography, spacing and radius tokens as
    shared foundations.
2.  Build reusable components from the tokens rather than styling each
    screen independently.
3.  Document new component variants and their use cases before broad
    adoption.
4.  Test components with real Korean copy, long product names, price
    formats and operational data.
5.  Review accessibility, responsive behavior and visual consistency
    before release.
6.  Assign an owner to approve changes to brand-critical tokens and logo
    usage.

### Source and confidence note

-   **Directly represented in the supplied SASE reference image:** brand
    colors and their hex values, neutral palette, typography roles/size
    ranges/weights, 8pt spacing values, corner-radius values, component
    families and the five brand principles.
-   **Adapted from the supplied `DESIGN-apple.md` structure:** token
    organization, component documentation, implementation guidance,
    responsive documentation, accessibility considerations, do/don't
    rules and governance format.
-   **Recommended additions, not explicitly specified in the SASE
    image:** font fallback, exact line heights, semantic status colors,
    detailed component states, responsive breakpoints, accessibility
    requirements and YAML component properties. These should be
    validated by the SASE brand/design owner before being treated as
    official specifications.
