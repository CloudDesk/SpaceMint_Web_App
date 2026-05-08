export const palette = {
  black: "#111111",
  white: "#FFFFFF",
  warmBeige: "#faf7f2",
} as const;

export const themePresets = {
  spaceMintMinimal: {
    name: "Space Mint Minimal",
    colors: {
      background: palette.white,
      foreground: palette.black,
      primary: palette.black,
      secondary: palette.white,
      accent: palette.warmBeige,
      muted: "#faf7f2",
      border: "rgba(17, 17, 17, 0.14)",
      overlay: "rgba(17, 17, 17, 0.54)",
    },
  },
} as const;

export const typographyPresets = {
  editorial: {
    heading: "AlbertusNova, Optima, Albertus MT, Marcellus, Times New Roman, sans-serif",
    body: "Inter, ui-sans-serif, system-ui, sans-serif",
    scale: {
      display: "clamp(3.75rem, 9vw, 8.75rem)",
      h1: "clamp(3rem, 7vw, 7rem)",
      h2: "clamp(2.25rem, 4.6vw, 4.75rem)",
      h3: "clamp(1.75rem, 3vw, 2.75rem)",
      body: "1rem",
    },
  },
} as const;

export const spacingPresets = {
  spacious: {
    section: "clamp(5rem, 9vw, 10rem)",
    sectionSmall: "clamp(3.5rem, 6vw, 6rem)",
    sectionLarge: "clamp(7rem, 12vw, 14rem)",
    gutter: "clamp(1rem, 2.5vw, 2rem)",
    cardPadding: "clamp(1rem, 2vw, 1.5rem)",
    pageWidth: "1440px",
  },
} as const;

export const motionPresets = {
  subtle: {
    duration: {
      fast: 0.16,
      smooth: 0.36,
      reveal: 0.72,
    },
    ease: [0.22, 1, 0.36, 1],
    distance: 18,
  },
} as const;

export const componentStylePresets = {
  luxuryMinimal: {
    radius: {
      sm: "2px",
      md: "4px",
      lg: "8px",
    },
    button: {
      height: "2.875rem",
      density: "comfortable",
    },
    card: {
      border: "1px solid rgba(17, 17, 17, 0.14)",
      shadow: "none",
    },
  },
} as const;

export const layoutPresets = {
  ecommerceEditorial: {
    headerHeight: "4.75rem",
    gridGap: "clamp(1rem, 2.5vw, 2rem)",
    productGrid: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))",
  },
} as const;

export const activeDesignSystem = {
  theme: themePresets.spaceMintMinimal,
  typography: typographyPresets.editorial,
  spacing: spacingPresets.spacious,
  motion: motionPresets.subtle,
  components: componentStylePresets.luxuryMinimal,
  layout: layoutPresets.ecommerceEditorial,
} as const;
