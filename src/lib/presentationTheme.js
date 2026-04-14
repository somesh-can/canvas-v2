export const presentationSemanticClasses = {
  pageShell: "bg-[var(--presentation-bg)] text-[var(--presentation-text)]",
  pageSubtle: "bg-[var(--presentation-bg-subtle)]",
  surface: "bg-[var(--presentation-surface)]",
  surfaceElevated: "bg-[var(--presentation-surface-elevated)]",
  surfaceMuted: "bg-[var(--presentation-surface-muted)]",
  border: "border-[var(--presentation-border)]",
  borderStrong: "border-[var(--presentation-border-strong)]",
  text: "text-[var(--presentation-text)]",
  textMuted: "text-[var(--presentation-text-muted)]",
  textSoft: "text-[var(--presentation-text-soft)]",
  focusRing:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--presentation-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--presentation-bg)]",
  accentText: "text-[var(--presentation-accent)]",
  accentSurface: "bg-[var(--presentation-accent-soft)]",
  accentBorder: "border-[var(--presentation-accent)]",
  panel:
    "bg-[var(--presentation-surface)] border border-[var(--presentation-border)]",
  panelStrong:
    "bg-[var(--presentation-surface)] border border-[var(--presentation-border-strong)]",
  mutedPanel:
    "bg-[var(--presentation-surface-elevated)] border border-[var(--presentation-border)]",
  control:
    "bg-[var(--presentation-surface)] border border-[var(--presentation-border)] text-[var(--presentation-text-muted)]",
  controlHover:
    "hover:bg-[var(--presentation-surface-muted)] hover:text-[var(--presentation-text)]",
};

export const presentationAccentClasses = {
  blue: {
    text: "text-[var(--mantine-color-blue-7)]",
    soft: "bg-[var(--mantine-color-blue-1)]",
    border: "border-[var(--mantine-color-blue-3)]",
    strong: "text-[var(--mantine-color-blue-8)]",
  },
  grape: {
    text: "text-[var(--mantine-color-grape-7)]",
    soft: "bg-[var(--mantine-color-grape-1)]",
    border: "border-[var(--mantine-color-grape-3)]",
    strong: "text-[var(--mantine-color-grape-8)]",
  },
  green: {
    text: "text-[var(--mantine-color-green-7)]",
    soft: "bg-[var(--mantine-color-green-1)]",
    border: "border-[var(--mantine-color-green-3)]",
    strong: "text-[var(--mantine-color-green-8)]",
  },
  orange: {
    text: "text-[var(--mantine-color-orange-7)]",
    soft: "bg-[var(--mantine-color-orange-1)]",
    border: "border-[var(--mantine-color-orange-3)]",
    strong: "text-[var(--mantine-color-orange-8)]",
  },
  yellow: {
    text: "text-[var(--mantine-color-yellow-8)]",
    soft: "bg-[var(--mantine-color-yellow-1)]",
    border: "border-[var(--mantine-color-yellow-3)]",
    strong: "text-[var(--mantine-color-yellow-9)]",
  },
  pink: {
    text: "text-[var(--mantine-color-pink-7)]",
    soft: "bg-[var(--mantine-color-pink-1)]",
    border: "border-[var(--mantine-color-pink-3)]",
    strong: "text-[var(--mantine-color-pink-8)]",
  },
};

export const presentationToneFamily = {
  lavender: "grape",
  blue: "blue",
  sage: "green",
  peach: "orange",
  butter: "yellow",
  blush: "pink",
};

export const presentationToneCardClasses = {
  lavender:
    "bg-[var(--mantine-color-grape-0)] border-[var(--mantine-color-grape-2)] text-[var(--presentation-text)]",
  blue:
    "bg-[var(--mantine-color-blue-0)] border-[var(--mantine-color-blue-2)] text-[var(--presentation-text)]",
  sage:
    "bg-[var(--mantine-color-green-0)] border-[var(--mantine-color-green-2)] text-[var(--presentation-text)]",
  peach:
    "bg-[var(--mantine-color-orange-0)] border-[var(--mantine-color-orange-2)] text-[var(--presentation-text)]",
  butter:
    "bg-[var(--mantine-color-yellow-0)] border-[var(--mantine-color-yellow-2)] text-[var(--presentation-text)]",
  blush:
    "bg-[var(--mantine-color-pink-0)] border-[var(--mantine-color-pink-2)] text-[var(--presentation-text)]",
};

export const presentationPatternColor = {
  lavender: "var(--mantine-color-grape-4)",
  blue: "var(--mantine-color-blue-4)",
  sage: "var(--mantine-color-green-4)",
};

export const presentationTheme = {
  classes: presentationSemanticClasses,
  accents: presentationAccentClasses,
  tones: presentationToneCardClasses,
  patternColor: presentationPatternColor,
};
