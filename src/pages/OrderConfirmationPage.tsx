import { Check, ChevronLeft } from "lucide-react";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { formatCurrency } from "../lib/commerce";
import type { OrderConfirmation } from "../types/commerce";

type OrderConfirmationPageProps = {
  order: OrderConfirmation | null;
};

export function OrderConfirmationPage({ order }: OrderConfirmationPageProps) {
  const navigation = useAppNavigation();

  if (!order) {
    return (
      <section className="page-flow commerce-page order-page" aria-label="Order confirmation">
        <div className="commerce-panel confirmation-panel">
          <button type="button" onClick={navigation.navigateHome}>
            <ChevronLeft size={16} />
            Home
          </button>
          <span>Order unavailable</span>
          <h3>No active order</h3>
          <p>Place an order from checkout to view a confirmation.</p>
          <button type="button" onClick={navigation.navigateKitchen}>
            Continue browsing
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-flow commerce-page order-page" aria-label="Order confirmation">
      <div className="commerce-panel confirmation-panel">
        <button type="button" onClick={navigation.navigateHome}>
          <ChevronLeft size={16} />
          Home
        </button>
        <Check size={34} />
        <span>Order confirmed</span>
        <h3>{order.orderNumber}</h3>
        <p>
          Your order for {order.itemCount} module{order.itemCount === 1 ? "" : "s"} has been placed.
        </p>
        <strong>{formatCurrency(order.total)}</strong>
        <button type="button" onClick={navigation.navigateKitchen}>
          Continue browsing
        </button>
      </div>
    </section>
  );
}
