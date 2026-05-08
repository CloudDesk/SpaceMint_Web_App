import { Container } from "@/components/primitives/container";
import { footerCollectionNavigation, studioNavigation } from "@/config/navigation";

export function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <Container className="grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-5">
          <h1
            className="flex min-w-0 items-center uppercase justify-self-start font-['Montserrat'] text-[1.65rem] font-medium tracking-[0.01em]"
            aria-label="Space Mint home"
          >
            <span className="mr-1.5 text-[#626262]">Space</span>
            <span className="text-[#86a08d]">Mint</span>
          </h1>
          <p className="max-w-sm text-sm leading-6 text-white/72">
            Premium modular interior systems for kitchens, wardrobes, and living
            spaces.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-white/72">
          <p className="text-eyebrow font-semibold uppercase text-white">
            Collections
          </p>
          {footerCollectionNavigation.map((item) => (
            <a
              className="transition-colors hover:text-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="grid gap-3 text-sm text-white/72">
          <p className="text-eyebrow font-semibold uppercase text-white">
            Studio
          </p>
          {studioNavigation.map((item) => (
            <a
              className="transition-colors hover:text-white"
              href={item.href}
              key={item.id}
            >
              {item.label}
            </a>
          ))}
        </div>
      </Container>
      <Container className="flex flex-col gap-3 border-t border-white/14 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
        <p>Copyright 2026 Space Mint.</p>
        <p>Luxury modular interiors, configured for modern homes.</p>
      </Container>
    </footer>
  );
}
