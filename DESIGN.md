# Design System: Canvas V2

Canvas V2 is a presentation-first analytics interface. It feels calm, editorial, and projector-friendly rather than dashboard-heavy: warm neutrals, soft borders, translucent chrome, and selective blue-led emphasis. The layout behaves like a slide deck, but the visuals stay close to product UI patterns so the content still reads as interactive and current.

## 1. Visual Theme & Atmosphere

The atmosphere is light, spacious, and slightly tactile. The background reads like warm paper instead of pure white, while surfaces sit on top as clean cards with thin borders and soft elevation. Fixed top and bottom bars use a frosted-glass effect, which makes the navigation feel present without dominating the content.

The design avoids harsh contrast and heavy shadowing. Instead, it relies on subtle separation, rounded geometry, and restrained accent color to guide attention. The result is polished but quiet: more strategic briefing room than control panel.

## 2. Color Palette & Roles

- `Parchment Background` `#fcfcf8` - main page canvas and the default shell background.
- `Warm Subtle Background` `#f6f5ef` - secondary page tone for light sectioning.
- `Pure Surface White` `#ffffff` - primary card and panel surface.
- `Soft Elevated Surface` `#faf9f3` - lifted containers and premium neutral panels.
- `Muted Surface Cream` `#f2efe8` - subdued chip, control, and secondary panel fill.
- `Hairline Border Sand` `#e4dfd3` - default divider and card border color.
- `Strong Border Taupe` `#d4ccbd` - emphasized border for key controls and active containers.
- `Primary Ink` `#1f2430` - primary text, headlines, and strong foreground color.
- `Muted Slate Ink` `#515968` - secondary body copy and helper text.
- `Soft Slate Ink` `#717887` - low-emphasis labels, counts, and metadata.
- `Focus Blue` `#1c7ed6` - focus rings, active states, and primary brand accent.
- `Deep Accent Blue` `#1971c2` - stronger brand emphasis and selected-state reinforcement.
- `Soft Accent Blue` `#d0ebff` - light selected backgrounds and accent washes.
- `Success Green` `#37b24d` - success feedback and confirmation marks.
- `Overlay Ink` `rgb(31 36 48 / 0.46)` - modal scrim and immersive overlays.

Accent families are used to distinguish content clusters and theme groupings:

- `Lavender Voice` `#f8f0fc` / `#eebefa` / `#ae3ec9` - strategic or reflective content blocks.
- `Blue Voice` `#e7f5ff` / `#a5d8ff` / `#1c7ed6` - core system emphasis and active selections.
- `Green Voice` `#ebfbee` / `#b2f2bb` / `#37b24d` - collaborative or positive themes.
- `Orange Voice` `#fff4e6` / `#ffd8a8` / `#f76707` - operational or priority-related themes.
- `Yellow Voice` `#fff9db` / `#ffec99` / `#f08c00` - caution, friction, or attention markers.
- `Pink Voice` `#fff0f6` / `#fcc2d7` / `#d6336c` - human, culture, or emotional themes.

## 3. Typography Rules

The page shell uses `DM Sans` as the primary voice, which keeps the presentation readable and modern. The Tailwind config also exposes a large type library, but the rendered experience leans on `DM Sans` plus rotating quote-specific faces like `Noto Sans`, `Noto Serif`, and `Noto Sans Mono` to create variation inside long-form quote cards.

Headings are semibold, compact, and tracked tightly. Body copy stays medium-weight or regular with generous line height. Supporting labels often move to uppercase with wider tracking, which gives metrics and section tags a structured, presentation-like feel.

Typography should stay clean and conversational. Avoid decorative type unless it is used intentionally for quote variety.

## 4. Component Stylings

- Buttons are pill-shaped or softly rounded, usually `44px` tall, with a thin neutral border and a subtle hover fill. Primary navigation controls stay compact and circular, while slide selectors use wider pill forms with truncation and counters.
- Cards and containers use rounded corners in the `20px` to `40px` range, warm neutral fills, and a low-shadow or soft-shadow treatment. Selected cards often gain an inset accent bar or a stronger border to show state without relying on color alone.
- Inputs, dropdowns, and menu surfaces should follow the same border-and-ring language as buttons: thin sand border, white or cream fill, and a blue focus ring. When shown in overlays, they can use a frosted or semi-transparent treatment.
- Fixed chrome elements, including the top bar and bottom bar, are lightly translucent and blurred so the content remains the focus.
- Quote cards are intentionally more expressive than the rest of the system. They combine accent-tinted borders and fills with alternating serif, sans, and mono type to make each quote feel distinct without breaking the overall system.
- Theme containers may carry simple geometric SVG patterns. These patterns should stay faint and decorative, not compete with the text.

## 5. Layout Principles

The layout centers content in a broad reading column, typically `max-w-6xl` to `max-w-7xl`, with generous horizontal padding and strong vertical breathing room. Slides are built as large, self-contained sections rather than dense grids.

Use a clear hierarchy:

- Hero or overview content first
- Summary metrics next
- Content exploration and detail views after that

Responsive behavior should collapse cleanly from two or three columns into one column on smaller screens. The navigation shell remains fixed, but the content area should stay scrollable and comfortably spaced.

Spacing should feel deliberate and roomy. Prefer consistent gaps over dense packing, and keep borders light so the structure reads through spacing and elevation instead of heavy outlines.

## 6. Motion & Interaction

Motion is subtle and functional. The page uses short fade-ins, gentle upward reveals, and quick transitions between states. Overlays blur the background instead of sliding in aggressively, and menus animate with a small amount of vertical motion.

Interactions should feel crisp but calm:

- Focus states use a 2px blue ring with offset
- Disabled controls lower opacity and block pointer events
- Hover states shift fill and text tone rather than moving layout
- Modals and menus close cleanly on outside click or escape

