import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Container } from "@/components/primitives/container";
import { megaMenuSections } from "@/config/navigation";
import { cn } from "@/lib/utils";

type MegaNavigationProps = {
  className?: string;
  itemClassName?: string;
};

export function MegaNavigation({
  className,
  itemClassName,
}: MegaNavigationProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [currentHash, setCurrentHash] = useState(() => window.location.hash);
  const activeSection =
    megaMenuSections.find((section) => section.id === activeId) ??
    megaMenuSections[0];
  const closeMenu = useCallback(() => setActiveId(null), []);

  const currentSectionId =
    megaMenuSections.find((section) => {
      if (section.href === currentHash) {
        return true;
      }

      return section.columns.some((column) =>
        column.items.some((item) => item.href === currentHash),
      );
    })?.id ?? null;

  useEffect(() => {
    if (!activeId) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("scroll", closeMenu, { passive: true });
    window.addEventListener("wheel", closeMenu, { passive: true });
    window.addEventListener("touchmove", closeMenu, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("scroll", closeMenu);
      window.removeEventListener("wheel", closeMenu);
      window.removeEventListener("touchmove", closeMenu);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeId, closeMenu]);

  useEffect(() => {
    const onRouteChange = () => setCurrentHash(window.location.hash);

    onRouteChange();
    window.addEventListener("hashchange", onRouteChange);
    window.addEventListener("popstate", onRouteChange);

    return () => {
      window.removeEventListener("hashchange", onRouteChange);
      window.removeEventListener("popstate", onRouteChange);
    };
  }, []);

  return (
    <div
      className={cn("hidden xl:block", className)}
      onMouseEnter={() =>
        setActiveId((current) => current ?? megaMenuSections[0].id)
      }
      onMouseLeave={() => setActiveId(null)}
    >
      <nav className="flex items-center gap-5 xl:gap-8" aria-label="Primary">
        {megaMenuSections.map((section) => {
          const isSelected =
            activeId === section.id || currentSectionId === section.id;

          return (
            <a
              aria-current={
                currentSectionId === section.id ? "page" : undefined
              }
              className={cn(
                "border-b border-transparent py-8 font-heading text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-smooth ease-luxury hover:border-current hover:text-current",
                itemClassName,
                isSelected && "border-current text-current",
              )}
              href={section.href}
              key={section.id}
              onClick={closeMenu}
              onFocus={() => setActiveId(section.id)}
              onMouseEnter={() => setActiveId(section.id)}
            >
              {section.label}
            </a>
          );
        })}
      </nav>

      <AnimatePresence>
        {activeId ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-0 top-full overflow-hidden border-y border-border bg-background text-foreground shadow-elevated"
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Container className="grid gap-8 py-8 xl:grid-cols-[20rem_1fr]">
              <AnimatePresence mode="wait">
                <motion.a
                  animate={{ opacity: 1, y: 0 }}
                  className="group grid overflow-hidden rounded-lg border bg-accent text-foreground"
                  exit={{ opacity: 0, y: 8 }}
                  href={activeSection.href}
                  initial={{ opacity: 0, y: 8 }}
                  key={activeSection.id}
                  onClick={closeMenu}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img
                    alt={activeSection.label}
                    className="sm-image-treatment aspect-[4/3] w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.035]"
                    src={activeSection.image}
                  />
                  <div className="grid gap-3 p-5">
                    <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
                      {activeSection.eyebrow}
                    </p>
                    <div className="flex items-end justify-between gap-4">
                      <h2 className="font-heading text-3xl font-light">
                        {activeSection.label}
                      </h2>
                      <ArrowUpRight
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {activeSection.summary}
                    </p>
                  </div>
                </motion.a>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="grid gap-x-10 gap-y-8 md:grid-cols-2 xl:grid-cols-3"
                  exit={{ opacity: 0, y: 8 }}
                  initial={{ opacity: 0, y: 8 }}
                  key={`${activeSection.id}-columns`}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  {activeSection.columns.map((column, columnIndex) => (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      key={column.title}
                      transition={{
                        delay: columnIndex * 0.035,
                        duration: 0.24,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <h3 className="font-heading text-xl font-light">
                        {column.title}
                      </h3>
                      <ul className="grid gap-3">
                        {column.items.map((item) => (
                          <li key={`${column.title}-${item.label}`}>
                            <a
                              className="group grid gap-1 text-sm transition-colors hover:text-muted-foreground"
                              href={item.href}
                              onClick={closeMenu}
                            >
                              <span className="font-medium">{item.label}</span>
                              {item.meta ? (
                                <span className="text-xs text-muted-foreground">
                                  {item.meta}
                                </span>
                              ) : null}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
