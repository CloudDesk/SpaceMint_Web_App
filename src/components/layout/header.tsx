import { Menu, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Container } from "@/components/primitives/container";
import { MegaNavigation } from "@/components/layout/mega-navigation";
import { Navigation } from "@/components/layout/navigation";
import { ProductSearchModal } from "@/components/layout/product-search-modal";
import { routes } from "@/config/routes";

export function Header() {
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHomeRoute, setIsHomeRoute] = useState(() => !window.location.hash);
  const shouldUseHeroContrast = isHomeRoute && !isScrolled && !mobileOpen;
  const headerIconClass = `${
    shouldUseHeroContrast
      ? "border-white/18 text-white hover:bg-white hover:text-foreground"
      : isScrolled
        ? ""
        : "border-border text-foreground hover:bg-background"
  } max-sm:size-10`;

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 32);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onRouteChange = () => {
      setIsHomeRoute(!window.location.hash);
    };

    onRouteChange();
    window.addEventListener("hashchange", onRouteChange);
    window.addEventListener("popstate", onRouteChange);

    return () => {
      window.removeEventListener("hashchange", onRouteChange);
      window.removeEventListener("popstate", onRouteChange);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,box-shadow,color] duration-smooth ease-luxury ${
        shouldUseHeroContrast
          ? "border-white/12 bg-[rgba(17,17,17,0.46)] text-primary-foreground backdrop-blur-md"
          : isScrolled
            ? "border-border bg-[rgba(255,255,255,0.94)] text-foreground shadow-soft backdrop-blur-xl"
            : "border-border bg-[var(--color-accent)] text-foreground shadow-soft"
      }`}
    >
      <Container className="grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:h-[5rem] xl:grid-cols-[1fr_auto_1fr] xl:gap-4">
        <a
          className="flex min-w-0 items-center justify-self-start overflow-hidden whitespace-nowrap font-['Montserrat'] text-[clamp(1.05rem,6.1vw,1.65rem)] font-bold uppercase tracking-[0.01em] sm:text-[1.65rem]"
          href={routes.home}
          aria-label="Space Mint home"
        >
          <span className="mr-1 text-[#626262] sm:mr-1.5">Space</span>
          <span className="text-[#86a08d]">Mint</span>
        </a>

        <MegaNavigation
          className="hidden justify-self-center xl:flex"
          itemClassName={
            shouldUseHeroContrast
              ? "text-white/82 hover:text-white"
              : "text-foreground/72 hover:text-foreground"
          }
        />

        <div className="flex items-center justify-self-end gap-2">
          <ProductSearchModal triggerClassName={headerIconClass} />
          <Button
            asChild
            aria-label="Cart"
            className={headerIconClass}
            size="icon"
            variant="ghost"
          >
            <a className="relative" href={routes.cart}>
              <ShoppingBag className="size-4" aria-hidden="true" />
              {cartCount ? (
                <span className="absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[0.68rem] leading-5 text-primary-foreground">
                  {cartCount}
                </span>
              ) : null}
            </a>
          </Button>
          <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
            <DrawerTrigger asChild>
              <Button
                aria-label="Open menu"
                className={`xl:hidden ${
                  shouldUseHeroContrast
                    ? "border-white/18 bg-white/10 text-white hover:bg-white hover:text-foreground"
                    : isScrolled
                      ? ""
                      : "border-border bg-accent text-foreground hover:bg-background"
                } max-sm:size-10`}
                size="icon"
                variant="secondary"
              >
                <Menu className="size-4" aria-hidden="true" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="font-['Montserrat'] text-h3 font-medium">
                  <span className="mr-1.5 text-[#626262]">Space</span>
                  <span className="text-[#86a08d]">Mint</span>
                </DrawerTitle>
                <DrawerDescription className="text-sm leading-6 text-muted-foreground">
                  Kitchens, living room furniture, bedroom wardrobes, and
                  made-to-measure furniture.
                </DrawerDescription>
              </DrawerHeader>
              <Navigation
                className="mt-12 flex-col items-start gap-6"
                itemClassName="font-heading text-3xl font-light text-foreground"
                onNavigate={() => setMobileOpen(false)}
              />
              <div className="mt-auto grid gap-3 border-t pt-6">
                <Button>Book Consultation</Button>
                <Button variant="secondary">View Studio</Button>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </Container>
    </header>
  );
}
