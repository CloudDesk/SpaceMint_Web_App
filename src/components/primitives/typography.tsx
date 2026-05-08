import * as React from "react";
import { cn } from "@/lib/utils";

type TextProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Eyebrow<T extends React.ElementType = "p">({
  as,
  className,
  children,
  ...props
}: TextProps<T>) {
  const Comp = as ?? "p";

  return (
    <Comp
      className={cn("text-eyebrow font-semibold uppercase tracking-[0.16em]", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Heading<T extends React.ElementType = "h2">({
  as,
  className,
  children,
  ...props
}: TextProps<T>) {
  const Comp = as ?? "h2";

  return (
    <Comp
      className={cn("font-heading text-h2 font-light tracking-normal", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Lead<T extends React.ElementType = "p">({
  as,
  className,
  children,
  ...props
}: TextProps<T>) {
  const Comp = as ?? "p";

  return (
    <Comp
      className={cn("max-w-prose text-lead text-muted-foreground", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function BodyText<T extends React.ElementType = "p">({
  as,
  className,
  children,
  ...props
}: TextProps<T>) {
  const Comp = as ?? "p";

  return (
    <Comp className={cn("text-base leading-7 text-muted-foreground", className)} {...props}>
      {children}
    </Comp>
  );
}
