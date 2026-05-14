import { Grid3X3, MessageCircle, Phone, Ruler, ShoppingBag, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";
import type { KitchenProduct } from "../../data/kitchenProducts";
import type { CustomerUser } from "../../types/auth";
import { Header } from "./Header";

type SiteLayoutProps = {
  cartItemCount: number;
  children: React.ReactNode;
  isAuthenticated: boolean;
  onAccountClick: () => void;
  products: KitchenProduct[];
  user: CustomerUser | null;
};

export function SiteLayout({
  cartItemCount,
  children,
  isAuthenticated,
  onAccountClick,
  products,
  user,
}: SiteLayoutProps) {
  const location = useLocation();
  const isProductDetail = location.pathname.startsWith("/products/");

  return (
    <div className={isProductDetail ? "site-shell product-detail-shell" : "site-shell"}>
      <Header
        cartItemCount={cartItemCount}
        isAuthenticated={isAuthenticated}
        onAccountClick={onAccountClick}
        products={products}
        user={user}
      />
      {children}
      <BottomActions />
      <SiteFooter />
    </div>
  );
}

function BottomActions() {
  return (
    <aside className="bottom-actions" aria-label="Quick actions">
      <a href="/#systems">
        <Grid3X3 size={18} />
        Explore
      </a>
      <a href="/#quote">
        <Ruler size={18} />
        Quote
      </a>
      <a href="tel:+910000000000">
        <Phone size={18} />
        Call
      </a>
      <a href="/#quote">
        <MessageCircle size={18} />
        Chat
      </a>
    </aside>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>Space Mint</span>
      <p>Premium plywood modular interiors for kitchens, wardrobes and living spaces.</p>
      <div>
        <a href="/#systems">
          <ShoppingBag size={16} />
          Systems
        </a>
        <a href="/#quote">
          <Sparkles size={16} />
          Consultation
        </a>
      </div>
    </footer>
  );
}
