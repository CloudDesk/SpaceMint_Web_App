import { ArrowRight, Check, ChevronLeft, Loader2, RefreshCw, ShoppingBag } from "lucide-react";
import { useAppNavigation } from "../hooks/useAppNavigation";
import type { CartSyncStatus } from "../hooks/useCart";
import { formatCurrency } from "../lib/commerce";
import type { CartItem, CartSummary } from "../types/commerce";

type CartPageProps = {
  items: CartItem[];
  removeItem: (itemId: string) => void;
  summary: CartSummary;
  syncCartNow: () => Promise<void>;
  syncStatus: CartSyncStatus;
  updateQuantity: (itemId: string, quantity: number) => void;
};

export function CartPage({
  items,
  removeItem,
  summary,
  syncCartNow,
  syncStatus,
  updateQuantity,
}: CartPageProps) {
  const navigation = useAppNavigation();

  return (
    <section className="page-flow commerce-page cart-page" aria-label="Shopping cart">
      <div className="commerce-panel cart-panel">
        <div className="commerce-header">
          <div>
            <span>Cart</span>
            <h3>Your selected modules</h3>
          </div>
          <button type="button" onClick={navigation.navigateKitchenProducts}>
            <ChevronLeft size={16} />
            Continue browsing
          </button>
        </div>

        <div className="cart-content">
          {items.length ? (
            <>
              <div className="cart-item-list">
                {items.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <div className="cart-item-swatch" style={{ background: item.colourSwatch }} />
                    <div>
                      <span>{item.code}</span>
                      <h4>{item.name}</h4>
                      <p>
                        {item.variant} / {item.colourLabel} / {item.sizeLabel}
                      </p>
                      <strong>{formatCurrency(item.unitPrice)}</strong>
                    </div>
                    <div className="quantity-control" aria-label={`${item.name} quantity`}>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        -
                      </button>
                      <input
                        aria-label="Quantity"
                        min="1"
                        max="20"
                        type="number"
                        value={item.quantity}
                        onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                      />
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <button className="remove-item" type="button" onClick={() => removeItem(item.id)}>
                      Remove
                    </button>
                    <strong className="line-total">{formatCurrency(item.unitPrice * item.quantity)}</strong>
                  </article>
                ))}
              </div>

              <aside className="cart-summary">
                <div className="cart-summary-topline">
                  <h4>Order summary</h4>
                  <CartSyncControl status={syncStatus} syncCartNow={syncCartNow} />
                </div>
                <p>
                  <span>Items</span>
                  <strong>{summary.itemCount}</strong>
                </p>
                <p>
                  <span>Subtotal</span>
                  <strong>{formatCurrency(summary.subtotal)}</strong>
                </p>
                <p>
                  <span>Installation care</span>
                  <strong>{formatCurrency(summary.installCare)}</strong>
                </p>
                <p className="cart-total">
                  <span>Total</span>
                  <strong>{formatCurrency(summary.total)}</strong>
                </p>
                <button type="button" onClick={navigation.navigateCheckout}>
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </button>
              </aside>
            </>
          ) : (
            <div className="empty-cart">
              <ShoppingBag size={30} />
              <h4>Your cart is empty.</h4>
              <p>Open a kitchen module and add a variant to begin checkout.</p>
              <button type="button" onClick={navigation.navigateKitchenProducts}>
                Continue browsing
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CartSyncControl({
  status,
  syncCartNow,
}: {
  status: CartSyncStatus;
  syncCartNow: () => Promise<void>;
}) {
  if (status === "synced") {
    return (
      <span className="cart-sync-pill" title="Cart synced">
        <Check size={14} />
        Synced
      </span>
    );
  }

  if (status === "syncing") {
    return (
      <span className="cart-sync-pill" title="Cart syncing">
        <Loader2 className="spin-icon" size={14} />
        Syncing
      </span>
    );
  }

  return (
    <button className="cart-sync-pill action" type="button" onClick={() => void syncCartNow()}>
      <RefreshCw size={14} />
      {status === "error" ? "Retry sync" : "Sync"}
    </button>
  );
}
