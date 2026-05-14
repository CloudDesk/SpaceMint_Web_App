import { ChevronLeft } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { PaymentGatewayModal } from "../components/commerce/PaymentGatewayModal";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { emptyCheckoutForm, formatCurrency } from "../lib/commerce";
import type { CustomerUser } from "../types/auth";
import type { CartItem, CartSummary, CheckoutForm, OrderConfirmation } from "../types/commerce";

type CheckoutPageProps = {
  clearCart: () => void;
  isAuthenticated: boolean;
  items: CartItem[];
  onOrderPlaced: (order: OrderConfirmation) => void;
  onRequireAuth: (onSuccess: () => void) => void;
  summary: CartSummary;
  user: CustomerUser | null;
};

type CheckoutErrors = Partial<Record<keyof CheckoutForm, string>>;
const checkoutStorageKey = "space-mint-checkout";

export function CheckoutPage({
  clearCart,
  isAuthenticated,
  items,
  onOrderPlaced,
  onRequireAuth,
  summary,
  user,
}: CheckoutPageProps) {
  const navigation = useAppNavigation();
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>(readStoredCheckoutForm);
  const [checkoutErrors, setCheckoutErrors] = useState<CheckoutErrors>({});
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(checkoutStorageKey, JSON.stringify(checkoutForm));
  }, [checkoutForm]);

  useEffect(() => {
    if (!user) return;

    setCheckoutForm((form) => ({
      ...form,
      email: user.useremail?.trim() || form.email,
      fullName:
        [user.firstname, user.lastname]
          .map((value) => value?.trim())
          .filter(Boolean)
          .join(" ") || form.fullName,
      phone: user.usermobilenumber ? String(user.usermobilenumber) : form.phone,
    }));
  }, [user]);

  const updateCheckoutField = (field: keyof CheckoutForm, value: string) => {
    setCheckoutForm((form) => ({ ...form, [field]: value }));
    setCheckoutErrors((errors) => ({ ...errors, [field]: "" }));
  };

  const placeOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!items.length || !validateCheckout(checkoutForm, setCheckoutErrors)) return;

    if (!isAuthenticated) {
      onRequireAuth(() => setIsPaymentGatewayOpen(true));
      return;
    }

    setIsPaymentGatewayOpen(true);
  };

  const completePayment = () => {
    if (!items.length) return;
    const order = {
      itemCount: summary.itemCount,
      orderNumber: `SM-${Date.now().toString().slice(-8)}`,
      total: summary.total,
    };

    onOrderPlaced(order);
    clearCart();
    setCheckoutForm(emptyCheckoutForm);
    window.localStorage.setItem(checkoutStorageKey, JSON.stringify(emptyCheckoutForm));
    setIsPaymentGatewayOpen(false);
    navigation.navigateOrder();
  };

  return (
    <>
      <section className="page-flow commerce-page checkout-page" aria-label="Checkout">
        <form className="commerce-panel checkout-panel" onSubmit={placeOrder}>
          <div className="commerce-header">
            <div>
              <span>Checkout</span>
              <h3>Complete your order</h3>
            </div>
            <button type="button" onClick={navigation.navigateCart}>
              <ChevronLeft size={16} />
              Back to cart
            </button>
          </div>

          <div className="checkout-layout">
            <div className="checkout-form-sections">
              <section className="checkout-section">
                <h4>Customer details</h4>
                <label>
                  Full name
                  <input value={checkoutForm.fullName} onChange={(event) => updateCheckoutField("fullName", event.target.value)} />
                  {checkoutErrors.fullName ? <small>{checkoutErrors.fullName}</small> : null}
                </label>
                <label>
                  Mobile number
                  <input value={checkoutForm.phone} onChange={(event) => updateCheckoutField("phone", event.target.value)} />
                  {checkoutErrors.phone ? <small>{checkoutErrors.phone}</small> : null}
                </label>
                <label>
                  Email
                  <input value={checkoutForm.email} onChange={(event) => updateCheckoutField("email", event.target.value)} />
                  {checkoutErrors.email ? <small>{checkoutErrors.email}</small> : null}
                </label>
              </section>

              <section className="checkout-section">
                <h4>Shipping address</h4>
                <label className="wide-field">
                  Address
                  <input value={checkoutForm.addressLine1} onChange={(event) => updateCheckoutField("addressLine1", event.target.value)} />
                  {checkoutErrors.addressLine1 ? <small>{checkoutErrors.addressLine1}</small> : null}
                </label>
                <label>
                  City
                  <input value={checkoutForm.city} onChange={(event) => updateCheckoutField("city", event.target.value)} />
                  {checkoutErrors.city ? <small>{checkoutErrors.city}</small> : null}
                </label>
                <label>
                  State
                  <input value={checkoutForm.state} onChange={(event) => updateCheckoutField("state", event.target.value)} />
                  {checkoutErrors.state ? <small>{checkoutErrors.state}</small> : null}
                </label>
                <label>
                  Pincode
                  <input value={checkoutForm.pincode} onChange={(event) => updateCheckoutField("pincode", event.target.value)} />
                  {checkoutErrors.pincode ? <small>{checkoutErrors.pincode}</small> : null}
                </label>
              </section>

              <section className="checkout-section payment-section">
                <h4>Payment step</h4>
                {["upi", "card", "pay-on-visit"].map((method) => (
                  <button
                    className={checkoutForm.paymentMethod === method ? "active" : ""}
                    key={method}
                    type="button"
                    onClick={() => updateCheckoutField("paymentMethod", method)}
                  >
                    {method === "upi" ? "UPI" : method === "card" ? "Credit / Debit Card" : "Pay after design visit"}
                  </button>
                ))}
                {checkoutErrors.paymentMethod ? <small>{checkoutErrors.paymentMethod}</small> : null}
              </section>
            </div>

            <aside className="checkout-summary">
              <h4>Order summary</h4>
              <div className="checkout-items">
                {items.map((item) => (
                  <p key={item.id}>
                    <span>
                      {item.name}
                      <small>
                        {item.quantity} x {item.colourLabel}
                      </small>
                    </span>
                    <strong>{formatCurrency(item.unitPrice * item.quantity)}</strong>
                  </p>
                ))}
              </div>
              <div className="summary-lines">
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
              </div>
              <button type="submit">Place Order</button>
            </aside>
          </div>
        </form>
      </section>

      {isPaymentGatewayOpen ? (
        <PaymentGatewayModal
          checkoutForm={checkoutForm}
          onClose={() => setIsPaymentGatewayOpen(false)}
          onComplete={completePayment}
          summary={summary}
        />
      ) : null}
    </>
  );
}

function readStoredCheckoutForm() {
  try {
    const storedValue = window.localStorage.getItem(checkoutStorageKey);

    if (!storedValue) {
      return emptyCheckoutForm;
    }

    return {
      ...emptyCheckoutForm,
      ...(JSON.parse(storedValue) as Partial<CheckoutForm>),
    };
  } catch {
    return emptyCheckoutForm;
  }
}

function validateCheckout(
  checkoutForm: CheckoutForm,
  setCheckoutErrors: (errors: CheckoutErrors) => void,
) {
  const errors: CheckoutErrors = {};

  if (!checkoutForm.fullName.trim()) errors.fullName = "Full name is required.";
  if (!/^[6-9]\d{9}$/.test(checkoutForm.phone.trim())) errors.phone = "Enter a valid 10 digit mobile number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutForm.email.trim())) errors.email = "Enter a valid email address.";
  if (!checkoutForm.addressLine1.trim()) errors.addressLine1 = "Shipping address is required.";
  if (!checkoutForm.city.trim()) errors.city = "City is required.";
  if (!checkoutForm.state.trim()) errors.state = "State is required.";
  if (!/^\d{6}$/.test(checkoutForm.pincode.trim())) errors.pincode = "Enter a valid 6 digit pincode.";
  if (!checkoutForm.paymentMethod) errors.paymentMethod = "Select a payment method.";

  setCheckoutErrors(errors);
  return Object.keys(errors).length === 0;
}
