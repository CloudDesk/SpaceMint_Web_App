import { ArrowLeft, ArrowRight, Check, Loader2, Minus, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Container } from "@/components/primitives/container";
import { Section } from "@/components/primitives/section";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { routes } from "@/config/routes";

export function CartPage() {
  const { cartCount, clearCart, items, removeItem, syncCartNow, syncStatus, updateQuantity } = useCart();

  return (
    <article className="bg-background pt-20">
      <Container className="py-6">
        <Button asChild variant="ghost">
          <a href={routes.home}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Continue Shopping
          </a>
        </Button>
      </Container>

      <Section className="border-y bg-accent" spacing="sm">
        <Container className="grid gap-4">
          <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
            Space Mint Cart
          </p>
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="font-heading text-h1 font-light">Review your modules.</h1>
              <p className="mt-4 max-w-2xl text-lead text-muted-foreground">
                Your selected modules are saved locally for instant updates and synced in the
                background when the connection is available.
              </p>
            </div>
            <div className="rounded-sm border bg-background px-5 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Total items
              </p>
              <p className="mt-1 font-heading text-3xl font-light">{cartCount}</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="sm">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,0.64fr)_minmax(22rem,0.36fr)] lg:items-start">
          <div className="grid gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
                  Selected Products
                </p>
                <h2 className="mt-2 font-heading text-3xl font-light">Cart items</h2>
              </div>
              {items.length ? (
                <Button onClick={clearCart} size="sm" variant="ghost">
                  Clear cart
                </Button>
              ) : null}
            </div>

            {items.length ? (
              <div className="grid gap-3">
                {items.map((item) => (
                  <article className="grid gap-4 rounded-lg border bg-card p-card-pad md:grid-cols-[1fr_auto] md:items-center" key={item.id}>
                    <div className="grid gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {item.category} / {item.subcategory}
                      </p>
                      <h3 className="font-heading text-2xl font-light">{item.name}</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span>{item.code ?? "Code TBA"}</span>
                        <span>/</span>
                        <span>{item.sizeLabel ?? "Custom sizing"}</span>
                        {item.finishLabel ? (
                          <>
                            <span>/</span>
                            <span className="inline-flex items-center gap-2">
                              {item.finishColor ? (
                                <span
                                  className="size-3 rounded-full border"
                                  style={{ backgroundColor: item.finishColor }}
                                  aria-hidden="true"
                                />
                              ) : null}
                              {item.finishLabel}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 md:justify-end">
                      <div className="inline-flex items-center rounded-sm border bg-background">
                        <button
                          aria-label={`Decrease ${item.name} quantity`}
                          className="grid size-10 place-items-center border-r transition-colors hover:bg-accent"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          type="button"
                        >
                          <Minus className="size-4" aria-hidden="true" />
                        </button>
                        <span className="grid h-10 min-w-12 place-items-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          aria-label={`Increase ${item.name} quantity`}
                          className="grid size-10 place-items-center border-l transition-colors hover:bg-accent"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          type="button"
                        >
                          <Plus className="size-4" aria-hidden="true" />
                        </button>
                      </div>

                      <button
                        aria-label={`Remove ${item.name}`}
                        className="grid size-10 place-items-center rounded-sm border bg-background transition-colors hover:bg-accent"
                        onClick={() => removeItem(item.id)}
                        type="button"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border bg-card p-card-pad">
                <h3 className="font-heading text-3xl font-light">Your cart is empty.</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                  Add kitchen, wardrobe, or furniture modules from product detail pages. They will
                  remain saved locally after refresh.
                </p>
                <Button asChild className="mt-6">
                  <a href={routes.collection("kitchens")}>Explore Kitchens</a>
                </Button>
              </div>
            )}
          </div>

          <aside className="sticky top-28 grid gap-4">
            <div className="rounded-lg border bg-accent p-card-pad">
              <div className="flex items-center justify-between gap-4">
                <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
                  Order Summary
                </p>
                <CartSyncControl status={syncStatus} syncCartNow={syncCartNow} />
              </div>
              <div className="mt-5 grid gap-3 text-sm">
                <SummaryRow label="Products" value={String(items.length)} />
                <SummaryRow label="Total quantity" value={String(cartCount)} />
                <SummaryRow label="Pricing" value="Quote required" />
              </div>
              <p className="mt-5 text-sm leading-6 text-muted-foreground">
                Pricing and final measurements will be confirmed after design validation.
              </p>

              <Button asChild className="mt-6 w-full" disabled={!items.length}>
                <a href={items.length ? routes.checkout : routes.collection("kitchens")}>
                  {items.length ? "Proceed to Checkout" : "Explore Products"}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </aside>
        </Container>
      </Section>
    </article>
  );
}

function CartSyncControl({
  status,
  syncCartNow,
}: {
  status: "idle" | "syncing" | "synced" | "error";
  syncCartNow: () => Promise<void>;
}) {
  if (status === "synced") {
    return (
      <span
        aria-label="Cart synced"
        className="grid size-8 place-items-center rounded-sm border bg-background text-foreground"
        title="Cart synced"
      >
        <Check className="size-4" aria-hidden="true" />
      </span>
    );
  }

  if (status === "syncing") {
    return (
      <span
        aria-label="Cart syncing"
        className="grid size-8 place-items-center rounded-sm border bg-background text-muted-foreground"
        title="Cart syncing"
      >
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      </span>
    );
  }

  return (
    <button
      aria-label="Sync cart"
      className="grid size-8 place-items-center rounded-sm border bg-background text-muted-foreground transition-colors hover:text-foreground"
      onClick={() => void syncCartNow()}
      title="Sync cart"
      type="button"
    >
      <RefreshCw className="size-4" aria-hidden="true" />
    </button>
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
