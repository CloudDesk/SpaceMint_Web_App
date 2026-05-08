import * as React from "react";
import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  spacing?: "sm" | "md" | "lg";
};

export function Section({
  className,
  spacing = "md",
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        spacing === "sm" && "py-section-sm",
        spacing === "md" && "py-section",
        spacing === "lg" && "py-section-lg",
        className,
      )}
      {...props}
    />
  );
}
