import { ArrowRight, ChevronDown, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import type { KitchenProduct } from "../../data/kitchenProducts";
import { navigationGroups, type NavigationTarget } from "../../config/routes";
import { routes } from "../../config/routes";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { getCustomerDisplayName, getCustomerInitials } from "../auth/CustomerAuthModal";
import type { CustomerUser } from "../../types/auth";

type HeaderProps = {
  cartItemCount: number;
  isAuthenticated: boolean;
  onAccountClick: () => void;
  products: KitchenProduct[];
  user: CustomerUser | null;
};

type SearchResult = {
  id: string;
  label: string;
  meta: string;
  tokens: string;
  target: NavigationTarget;
};

export function Header({
  cartItemCount,
  isAuthenticated,
  onAccountClick,
  products,
  user,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(navigationGroups[0].id);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useAppNavigation(() => {
    setIsMenuOpen(false);
    setIsMegaMenuOpen(false);
    setIsSearchOpen(false);
  });

  const activeGroup = navigationGroups.find((group) => group.id === activeMegaMenu) ?? navigationGroups[0];
  const searchResults = useMemo(
    () => buildSearchResults(searchQuery, products),
    [products, searchQuery],
  );

  const navigateTo = (target: NavigationTarget) => {
    navigation.navigateToTarget(target);
    setSearchQuery("");
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSearchOpen) {
      setIsSearchOpen(true);
      return;
    }

    const firstResult = searchResults[0];
    if (firstResult) navigateTo(firstResult.target);
  };

  return (
    <>
      <header className="site-header" onMouseLeave={() => setIsMegaMenuOpen(false)}>
        <a
          aria-label="Space Mint home"
          className="brand-mark"
          href={routes.home}
          onClick={(event) => {
            event.preventDefault();
            navigation.navigateHome();
          }}
          onMouseEnter={() => setIsMegaMenuOpen(false)}
        >
          <span>Space</span>
          <span>Mint</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigationGroups.map((group) => (
            <a
              href={`#${group.id}`}
              key={group.id}
              className={isMegaMenuOpen && activeMegaMenu === group.id ? "nav-link active" : "nav-link"}
              onFocus={() => {
                setActiveMegaMenu(group.id);
                setIsMegaMenuOpen(true);
              }}
              onMouseEnter={() => {
                setActiveMegaMenu(group.id);
                setIsMegaMenuOpen(true);
              }}
            >
              {group.label}
              <ChevronDown size={14} aria-hidden="true" />
            </a>
          ))}
        </nav>

        <div className="header-actions" onMouseEnter={() => setIsMegaMenuOpen(false)}>
          <div className={isSearchOpen ? "header-search open" : "header-search"}>
            <form onSubmit={submitSearch}>
              <button
                className="icon-button"
                type="button"
                aria-label={isSearchOpen ? "Close search" : "Open search"}
                onClick={() => {
                  setIsSearchOpen((isOpen) => !isOpen);
                  setSearchQuery("");
                }}
              >
                <Search size={18} />
              </button>
              {isSearchOpen ? (
                <input
                  autoFocus
                  aria-label="Search Space Mint"
                  placeholder="Search products, spaces, materials"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              ) : null}
            </form>
            {isSearchOpen ? (
              <div className="search-results" role="listbox" aria-label="Search results">
                {searchResults.length ? (
                  searchResults.map((result) => (
                    <button key={result.id} type="button" onClick={() => navigateTo(result.target)}>
                      <span>{result.meta}</span>
                      {result.label}
                    </button>
                  ))
                ) : (
                  <p>No matches found.</p>
                )}
              </div>
            ) : null}
          </div>
          <button
            className={isAuthenticated ? "account-button signed-in" : "account-button"}
            type="button"
            onClick={onAccountClick}
            aria-label={isAuthenticated ? "Open customer profile" : "Sign in"}
          >
            {isAuthenticated ? (
              <strong>{getCustomerInitials(user)}</strong>
            ) : (
              <UserRound size={17} />
            )}
            <span>{isAuthenticated ? getCustomerDisplayName(user) : "Sign in"}</span>
          </button>
          <button
            className="cart-button"
            type="button"
            onClick={navigation.navigateCart}
            aria-label={`Open cart with ${cartItemCount} items`}
          >
            <ShoppingBag size={17} />
            <span>Cart</span>
            {cartItemCount > 0 ? <strong>{cartItemCount}</strong> : null}
          </button>
          <button
            className="icon-button mobile-menu-button"
            aria-label="Open menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>

        <div
          className={isMegaMenuOpen ? "mega-menu open" : "mega-menu"}
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          onMouseLeave={() => setIsMegaMenuOpen(false)}
        >
          <div>
            <p className="eyebrow">{activeGroup.label}</p>
            <h2>{activeGroup.label}</h2>
          </div>
          <div className="mega-links">
            {activeGroup.items.map((item) => (
              <a
                href={targetToHref(item.target)}
                key={item.id}
                onClick={(event) => {
                  event.preventDefault();
                  navigateTo(item.target);
                }}
              >
                {item.label}
                <ArrowRight size={14} />
              </a>
            ))}
          </div>
          <div className="mega-preview">
            <img
              src="https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=85"
              alt="Minimal modern interior with cabinetry"
            />
          </div>
        </div>
      </header>

      {isMenuOpen ? (
        <MobileDrawer
          cartItemCount={cartItemCount}
          isAuthenticated={isAuthenticated}
          navigateTo={navigateTo}
          onAccountClick={() => {
            setIsMenuOpen(false);
            onAccountClick();
          }}
          onClose={() => setIsMenuOpen(false)}
          user={user}
        />
      ) : null}
    </>
  );
}

function MobileDrawer({
  cartItemCount,
  isAuthenticated,
  navigateTo,
  onAccountClick,
  onClose,
  user,
}: {
  cartItemCount: number;
  isAuthenticated: boolean;
  navigateTo: (target: NavigationTarget) => void;
  onAccountClick: () => void;
  onClose: () => void;
  user: CustomerUser | null;
}) {
  const navigation = useAppNavigation(onClose);

  return (
    <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <div className="drawer-top">
        <span className="brand-mark compact">
          <span>Space</span>
          <span>Mint</span>
        </span>
        <button className="icon-button inverted" aria-label="Close menu" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      {navigationGroups.map((group) => (
        <details key={group.id} open={group.id === "products"}>
          <summary>
            {group.label}
            <ChevronDown size={16} />
          </summary>
          {group.items.map((item) => (
            <a
              href={targetToHref(item.target)}
              key={item.id}
              onClick={(event) => {
                event.preventDefault();
                navigateTo(item.target);
              }}
            >
              {item.label}
            </a>
          ))}
        </details>
      ))}
      <button className="drawer-account-button" type="button" onClick={onAccountClick}>
        <UserRound size={18} />
        {isAuthenticated ? getCustomerDisplayName(user) : "Sign in / Register"}
      </button>
      <button className="drawer-cart-button" type="button" onClick={navigation.navigateCart}>
        <ShoppingBag size={18} />
        Cart
        {cartItemCount > 0 ? <span>{cartItemCount}</span> : null}
      </button>
      <a
        className="drawer-cta"
        href="/#quote"
        onClick={(event) => {
          event.preventDefault();
          navigateTo({ hash: "#quote", path: "/" });
        }}
      >
        Book Design Visit
      </a>
    </div>
  );
}

function buildSearchResults(query: string, products: KitchenProduct[]): SearchResult[] {
  const staticResults = navigationGroups.flatMap((group) =>
    group.items.map((item) => ({
      id: item.id,
      label: item.label,
      meta: group.label,
      target: item.target,
      tokens: item.tokens,
    })),
  );
  const productResults = products.map((product) => ({
    id: product.id,
    label: product.name,
    meta: `${product.code} / ${product.subcategory}`,
    target: { path: routes.product(product.id) },
    tokens: `${product.name} ${product.code} ${product.subcategory} ${product.category} ${product.size?.label ?? ""} ${product.specs.summary} ${product.specs.highlights?.join(" ") ?? ""}`,
  }));
  const results = [...staticResults, ...productResults];
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return results.slice(0, 8);

  return results
    .filter((result) =>
      `${result.label} ${result.meta} ${result.tokens}`.toLowerCase().includes(normalizedQuery),
    )
    .slice(0, 8);
}

function targetToHref(target: NavigationTarget) {
  return `${target.path}${target.hash ?? ""}`;
}
