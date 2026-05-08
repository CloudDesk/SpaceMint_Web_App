import {
  ArrowLeft,
  BadgeIndianRupee,
  Check,
  CreditCard,
  PackageCheck,
  SmartphoneNfc,
  WalletCards,
} from "lucide-react";
import type { FormEvent } from "react";
import { useLayoutEffect, useState } from "react";
import { Container } from "@/components/primitives/container";
import { Section } from "@/components/primitives/section";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import type { CheckoutDetails, StoredOrder } from "@/context/cart-context";
import { useCart } from "@/context/cart-context";
import { routes } from "@/config/routes";
import { scrollToPageTop } from "@/lib/scroll";

const paymentMethods = [
  {
    description: "Visa, Mastercard, RuPay, and business cards.",
    icon: CreditCard,
    id: "card",
    label: "Cards",
  },
  {
    description: "Google Pay, PhonePe, Paytm, BHIM, and bank UPI apps.",
    icon: SmartphoneNfc,
    id: "upi",
    label: "UPI",
  },
  {
    description: "Net banking, wallet, or assisted payment link.",
    icon: WalletCards,
    id: "assisted",
    label: "Assisted Pay",
  },
] as const;

type PaymentMethodId = (typeof paymentMethods)[number]["id"];

export function CheckoutPage() {
  const { cartCount, checkoutDetails, items, placeOrder, saveCheckoutDetails } = useCart();
  const [formData, setFormData] = useState(checkoutDetails);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("upi");
  const [placedOrder, setPlacedOrder] = useState<StoredOrder | null>(null);

  useLayoutEffect(() => {
    scrollToPageTop({ defer: true });
  }, []);

  const handleFieldChange = (field: keyof CheckoutDetails, value: string) => {
    const nextFormData = {
      ...formData,
      [field]: value,
    };

    setFormData(nextFormData);
    saveCheckoutDetails(nextFormData);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveCheckoutDetails(formData);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentContinue = () => {
    const order = placeOrder(formData);

    if (order) {
      setIsPaymentModalOpen(false);
      setPlacedOrder(order);
      scrollToPageTop({ defer: true });
    }
  };

  if (placedOrder) {
    return <OrderConfirmation order={placedOrder} />;
  }

  return (
    <article className="bg-background pt-20">
      <Container className="py-6">
        <Button asChild variant="ghost">
          <a href={routes.cart}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to Cart
          </a>
        </Button>
      </Container>

      <Section className="border-y bg-accent" spacing="sm">
        <Container className="grid gap-4">
          <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
            Checkout
          </p>
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="font-heading text-h1 font-light">Place your order request.</h1>
              <p className="mt-4 max-w-2xl text-lead text-muted-foreground">
                Add delivery and contact details here. The cart remains dedicated to product review,
                while checkout captures the information needed to prepare the final quote.
              </p>
            </div>
            <div className="rounded-sm border bg-background px-5 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Checkout quantity
              </p>
              <p className="mt-1 font-heading text-3xl font-light">{cartCount}</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="sm">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,0.62fr)_minmax(22rem,0.38fr)] lg:items-start">
          <form className="grid gap-4 rounded-lg border bg-card p-card-pad" onSubmit={handleSubmit}>
            <div>
              <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
                Customer Details
              </p>
              <h2 className="mt-2 font-heading text-3xl font-light">Contact and delivery</h2>
            </div>

            <CheckoutInput
              autoComplete="name"
              label="Full name"
              onChange={(value) => handleFieldChange("fullName", value)}
              required
              value={formData.fullName}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <CheckoutInput
                autoComplete="tel"
                label="Phone number"
                onChange={(value) => handleFieldChange("phone", value)}
                required
                type="tel"
                value={formData.phone}
              />
              <CheckoutInput
                autoComplete="email"
                label="Email"
                onChange={(value) => handleFieldChange("email", value)}
                required
                type="email"
                value={formData.email}
              />
            </div>
            <CheckoutInput
              autoComplete="address-line1"
              label="Address line 1"
              onChange={(value) => handleFieldChange("addressLine1", value)}
              required
              value={formData.addressLine1}
            />
            <CheckoutInput
              autoComplete="address-line2"
              label="Address line 2"
              onChange={(value) => handleFieldChange("addressLine2", value)}
              value={formData.addressLine2}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <CheckoutInput
                autoComplete="address-level2"
                label="City"
                onChange={(value) => handleFieldChange("city", value)}
                required
                value={formData.city}
              />
              <CheckoutInput
                autoComplete="address-level1"
                label="State"
                onChange={(value) => handleFieldChange("state", value)}
                required
                value={formData.state}
              />
              <CheckoutInput
                autoComplete="postal-code"
                label="Pincode"
                onChange={(value) => handleFieldChange("pincode", value)}
                required
                value={formData.pincode}
              />
            </div>
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Notes / requirements</span>
              <textarea
                className="min-h-32 rounded-sm border bg-background px-3 py-3 text-sm outline-none transition-colors focus:border-foreground"
                onChange={(event) => handleFieldChange("notes", event.target.value)}
                value={formData.notes}
              />
            </label>

            <Button disabled={!items.length} type="submit">
              Place Order Request
            </Button>

            {!items.length ? (
              <p className="text-sm text-muted-foreground">
                Your cart is empty. Add products before placing an order request.
              </p>
            ) : null}
          </form>

          <aside className="sticky top-28 grid gap-4">
            <div className="rounded-lg border bg-accent p-card-pad">
              <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
                Order Summary
              </p>
              <div className="mt-5 grid gap-3 text-sm">
                <SummaryRow label="Products" value={String(items.length)} />
                <SummaryRow label="Total quantity" value={String(cartCount)} />
                <SummaryRow label="Pricing" value="Quote required" />
              </div>
              <Button asChild className="mt-6 w-full" variant="secondary">
                <a href={routes.cart}>Edit Cart</a>
              </Button>
            </div>

            {items.length ? (
              <div className="grid max-h-[32rem] gap-3 overflow-y-auto rounded-lg border bg-card p-card-pad">
                {items.map((item) => (
                  <article className="border-b pb-3 last:border-b-0 last:pb-0" key={item.id}>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {item.category} / {item.subcategory}
                    </p>
                    <h3 className="mt-1 font-heading text-xl font-light">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Qty {item.quantity} / {item.code ?? "Code TBA"}
                    </p>
                    {item.finishLabel ? (
                      <p className="mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                        {item.finishColor ? (
                          <span
                            aria-hidden="true"
                            className="size-3 rounded-full border"
                            style={{ backgroundColor: item.finishColor }}
                          />
                        ) : null}
                        {item.finishLabel}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border bg-card p-card-pad">
                <h3 className="font-heading text-2xl font-light">Nothing to checkout yet.</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Start with kitchens, wardrobes, or living room furniture and come back here once
                  your cart is ready.
                </p>
                <Button asChild className="mt-6">
                  <a href={routes.collection("kitchens")}>Explore Kitchens</a>
                </Button>
              </div>
            )}
          </aside>
        </Container>
      </Section>

      <PaymentIntegrationModal
        cartCount={cartCount}
        isOpen={isPaymentModalOpen}
        onContinue={handlePaymentContinue}
        onOpenChange={setIsPaymentModalOpen}
        onPaymentMethodChange={setPaymentMethod}
        paymentMethod={paymentMethod}
      />
    </article>
  );
}

function PaymentIntegrationModal({
  cartCount,
  isOpen,
  onContinue,
  onOpenChange,
  onPaymentMethodChange,
  paymentMethod,
}: {
  cartCount: number;
  isOpen: boolean;
  onContinue: () => void;
  onOpenChange: (isOpen: boolean) => void;
  onPaymentMethodChange: (method: PaymentMethodId) => void;
  paymentMethod: PaymentMethodId;
}) {
  const selectedMethod = paymentMethods.find((method) => method.id === paymentMethod);

  return (
    <Modal open={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-4xl gap-0 overflow-hidden p-0">
        <div className="grid bg-accent lg:grid-cols-[0.42fr_0.58fr]">
          <div className="border-b bg-primary p-6 text-primary-foreground lg:border-b-0 lg:border-r sm:p-8">
            <div className="grid size-12 place-items-center rounded-full border border-white/25">
              <BadgeIndianRupee className="size-5" aria-hidden="true" />
            </div>
            <p className="mt-8 text-eyebrow font-semibold uppercase text-primary-foreground/68">
              Payment Integration
            </p>
            <h2 className="mt-3 font-heading text-4xl font-light">
              Payment setup preview.
            </h2>
            <p className="mt-5 text-sm leading-6 text-primary-foreground/72">
              This is a frontend placeholder for the future payment gateway. The order request will
              be saved locally now, and real payment capture can be connected later.
            </p>
            <div className="mt-8 grid gap-3 text-sm">
              <PaymentFact label="Order quantity" value={`${cartCount} modules`} />
              <PaymentFact label="Payable amount" value="After quote validation" />
              <PaymentFact label="Status" value="Integration pending" />
            </div>
          </div>

          <div className="grid gap-6 bg-background p-6 sm:p-8">
            <ModalHeader className="pr-12">
              <ModalTitle className="font-heading text-3xl font-light">
                Choose payment mode
              </ModalTitle>
              <ModalDescription className="text-sm leading-6 text-muted-foreground">
                Select how payment will be handled once pricing and measurements are finalized.
              </ModalDescription>
            </ModalHeader>

            <div className="grid gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = method.id === paymentMethod;

                return (
                  <button
                    className={`grid min-h-[6.75rem] gap-4 rounded-sm border p-4 text-left transition-colors sm:grid-cols-[auto_1fr_2rem] sm:items-center ${
                      isSelected
                        ? "border-foreground bg-accent"
                        : "bg-background hover:border-foreground"
                    }`}
                    key={method.id}
                    onClick={() => onPaymentMethodChange(method.id)}
                    type="button"
                  >
                    <span className="grid size-11 place-items-center rounded-full border bg-background">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-medium">{method.label}</span>
                      <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                        {method.description}
                      </span>
                    </span>
                    <span
                      className={`grid size-8 place-items-center rounded-full transition-opacity ${
                        isSelected
                          ? "bg-primary text-primary-foreground opacity-100"
                          : "bg-transparent text-transparent opacity-0"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="size-4" aria-hidden="true" />
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="min-h-[6.75rem] rounded-sm border bg-accent p-4 text-sm leading-6 text-muted-foreground">
              <strong className="font-medium text-foreground">
                {selectedMethod?.label ?? "Payment"} selected.
              </strong>{" "}
              No money will be collected in this version. This confirms the customer journey and
              saves the order request locally.
            </div>

            <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => onOpenChange(false)} type="button">
                Review Details
              </Button>
              <Button onClick={onContinue} type="button">
                Save Order Request
              </Button>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

function PaymentFact({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex items-center justify-between gap-4 border-t border-white/18 pt-3">
      <span className="text-primary-foreground/58">{label}</span>
      <strong className="font-medium">{value}</strong>
    </p>
  );
}

function OrderConfirmation({ order }: { order: StoredOrder }) {
  return (
    <article className="bg-background pt-20">
      <Section className="border-y bg-accent" spacing="sm">
        <Container className="grid gap-5">
          <div className="grid size-14 place-items-center rounded-full border bg-background">
            <PackageCheck className="size-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
              Order Request Saved
            </p>
            <h1 className="mt-3 font-heading text-h1 font-light">Your order request is ready.</h1>
            <p className="mt-4 max-w-2xl text-lead text-muted-foreground">
              The order snapshot has been saved locally on this browser. Backend submission can be
              connected later without changing the cart experience.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="sm">
        <Container className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
          <div className="rounded-lg border bg-card p-card-pad">
            <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
              Reference
            </p>
            <h2 className="mt-2 font-heading text-3xl font-light">{order.id}</h2>
            <div className="mt-5 grid gap-3 text-sm">
              <SummaryRow label="Products" value={String(order.items.length)} />
              <SummaryRow label="Total quantity" value={String(order.totalQuantity)} />
              <SummaryRow
                label="Placed"
                value={new Intl.DateTimeFormat("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(order.createdAt))}
              />
            </div>
            <Button asChild className="mt-6 w-full">
              <a href={routes.home}>Continue Shopping</a>
            </Button>
          </div>

          <div className="grid gap-3 rounded-lg border bg-card p-card-pad">
            {order.items.map((item) => (
              <article className="flex justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0" key={item.id}>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {item.category} / {item.subcategory}
                  </p>
                  <h3 className="mt-1 font-heading text-xl font-light">{item.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.code ?? "Code TBA"} / {item.sizeLabel ?? "Custom sizing"}
                  </p>
                </div>
                <p className="shrink-0 text-sm text-muted-foreground">Qty {item.quantity}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </article>
  );
}

function CheckoutInput({
  autoComplete,
  label,
  onChange,
  required = false,
  type = "text",
  value,
}: {
  autoComplete?: string;
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium">
        {label}
        {required ? <span className="text-muted-foreground"> *</span> : null}
      </span>
      <input
        autoComplete={autoComplete}
        className="h-11 rounded-sm border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex items-center justify-between gap-4 border-t pt-3">
      <span className="text-muted-foreground">{label}</span>
      <strong className="font-medium">{value}</strong>
    </p>
  );
}
