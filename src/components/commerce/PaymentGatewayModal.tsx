import { X } from "lucide-react";
import { formatCurrency } from "../../lib/commerce";
import type { CartSummary, CheckoutForm } from "../../types/commerce";

type PaymentGatewayModalProps = {
  checkoutForm: CheckoutForm;
  onClose: () => void;
  onComplete: () => void;
  summary: CartSummary;
};

export function PaymentGatewayModal({
  checkoutForm,
  onClose,
  onComplete,
  summary,
}: PaymentGatewayModalProps) {
  return (
    <div className="payment-gateway-modal" role="dialog" aria-modal="true" aria-label="Payment gateway">
      <div className="payment-gateway-backdrop" onClick={onClose} />
      <div className="payment-gateway-panel">
        <div className="payment-gateway-header">
          <div>
            <span>Secure payment</span>
            <h3>Space Mint Checkout</h3>
          </div>
          <button type="button" aria-label="Close payment gateway" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="payment-gateway-body">
          <div className="payment-method-card">
            <span>Payment method</span>
            <strong>{getPaymentLabel(checkoutForm.paymentMethod)}</strong>
            <p>{checkoutForm.fullName} / {checkoutForm.phone}</p>
          </div>
          <div className="payment-total-card">
            <span>Total payable</span>
            <strong>{formatCurrency(summary.total)}</strong>
            <p>Includes installation care and selected module total.</p>
          </div>
          {checkoutForm.paymentMethod === "upi" ? (
            <label>
              UPI ID
              <input placeholder="name@bank" />
            </label>
          ) : checkoutForm.paymentMethod === "card" ? (
            <div className="gateway-card-fields">
              <label>
                Card number
                <input inputMode="numeric" placeholder="1234 5678 9012 3456" />
              </label>
              <label>
                Expiry
                <input placeholder="MM/YY" />
              </label>
              <label>
                CVV
                <input inputMode="numeric" placeholder="123" />
              </label>
            </div>
          ) : (
            <p className="gateway-note">Your order will be placed now and payment will be collected after the design visit.</p>
          )}
        </div>
        <div className="payment-gateway-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" onClick={onComplete}>
            {checkoutForm.paymentMethod === "pay-on-visit"
              ? "Confirm Order"
              : `Pay ${formatCurrency(summary.total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function getPaymentLabel(paymentMethod: string) {
  if (paymentMethod === "upi") return "UPI";
  if (paymentMethod === "card") return "Credit / Debit Card";
  return "Pay after design visit";
}
