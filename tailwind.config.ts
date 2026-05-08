import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "3rem",
      },
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
          hover: "var(--color-primary-hover)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
          hover: "var(--color-secondary-hover)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
          hover: "var(--color-accent-hover)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        border: "var(--color-border)",
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        overlay: "var(--color-overlay)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        destructive: "var(--color-destructive)",
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
      },
      fontSize: {
        eyebrow: ["0.68rem", { lineHeight: "1rem", letterSpacing: "0.16em" }],
        display: ["clamp(3.75rem, 9vw, 8.75rem)", { lineHeight: "0.88" }],
        h1: ["clamp(3rem, 7vw, 7rem)", { lineHeight: "0.92" }],
        h2: ["clamp(2.25rem, 4.6vw, 4.75rem)", { lineHeight: "0.96" }],
        h3: ["clamp(1.75rem, 3vw, 2.75rem)", { lineHeight: "1.05" }],
        lead: ["clamp(1.05rem, 1.4vw, 1.28rem)", { lineHeight: "1.75" }],
      },
      spacing: {
        section: "var(--space-section)",
        "section-sm": "var(--space-section-sm)",
        "section-lg": "var(--space-section-lg)",
        gutter: "var(--space-gutter)",
        "card-pad": "var(--space-card-padding)",
      },
      maxWidth: {
        page: "var(--layout-page-width)",
        prose: "var(--layout-prose-width)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius-md)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        elevated: "var(--shadow-elevated)",
      },
      transitionDuration: {
        smooth: "var(--motion-duration-smooth)",
      },
      transitionTimingFunction: {
        luxury: "var(--motion-ease-luxury)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up var(--motion-duration-reveal) var(--motion-ease-luxury) both",
      },
    },
  },
  plugins: [animate],
} satisfies Config;

export default config;
