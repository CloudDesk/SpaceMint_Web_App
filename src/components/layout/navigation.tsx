import { primaryNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";

type NavigationProps = {
  className?: string;
  itemClassName?: string;
  onNavigate?: () => void;
};

export function Navigation({
  className,
  itemClassName,
  onNavigate,
}: NavigationProps) {
  return (
    <nav className={cn("flex items-center gap-5 xl:gap-8", className)} aria-label="Primary">
      {primaryNavigation.map((item) => (
        <a
          className={cn(
            "font-heading text-xs font-light uppercase tracking-[0.14em] transition-colors duration-smooth ease-luxury",
            itemClassName,
          )}
          href={item.href}
          key={item.href}
          onClick={onNavigate}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
