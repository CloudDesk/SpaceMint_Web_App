import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex h-[2.875rem] items-center justify-center gap-2 whitespace-nowrap rounded-sm border px-5 text-sm font-medium transition-[background,color,border-color,transform] duration-smooth ease-luxury focus-visible:outline-none disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary:
          "border-primary bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary:
          "border-border bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        accent:
          "border-accent bg-accent text-accent-foreground hover:bg-accent-hover",
        ghost:
          "border-transparent bg-transparent text-foreground hover:border-border hover:bg-accent",
        link: "h-auto border-transparent bg-transparent px-0 text-foreground underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-10 px-4 text-xs",
        md: "h-[2.875rem] px-5 text-sm",
        lg: "h-12 px-7 text-sm",
        icon: "size-11 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);
