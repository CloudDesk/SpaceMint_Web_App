import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: "default" | "narrow" | "wide";
};

export function Container({
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12",
        size === "default" && "max-w-page",
        size === "narrow" && "max-w-prose",
        size === "wide" && "max-w-[1680px]",
        className,
      )}
      {...props}
    />
  );
}
