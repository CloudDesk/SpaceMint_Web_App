import { useCallback, useEffect, useMemo, useState } from "react";
import type { KitchenProduct } from "../data/kitchenProducts";
import { getApiRoot, type ApiResponse } from "../lib/api";
import {
  cartStorageKey,
  createCartItem,
  getKitchenProductInitialOption,
  getKitchenProductPrice,
  getStoredCart,
} from "../lib/commerce";
import { productColourOptions } from "../data/siteContent";
import type { CartItem, ProductColourOption } from "../types/commerce";

const guestCartStorageKey = "spacemint.cart.guest-id.v1";
const cartSyncDebounceMs = 600;

export type CartSyncStatus = "idle" | "syncing" | "synced" | "error";

type RemoteCartRecord = {
  clientLineId?: string | null;
  clientlineid?: string | null;
  itemData?: Partial<CartItem> | null;
  itemdata?: Partial<CartItem> | null;
  productId?: number | string | null;
  productid?: number | string | null;
  quantity?: number | string | null;
};

export function useCart(token: string | null, products: KitchenProduct[]) {
  const [guestCartId] = useState(readOrCreateGuestCartId);
  const [items, setItems] = useState<CartItem[]>(getStoredCart);
  const [remoteHydrated, setRemoteHydrated] = useState(false);
  const [syncStatus, setSyncStatus] = useState<CartSyncStatus>("idle");

  const syncCartNow = useCallback(async () => {
    setSyncStatus("syncing");

    try {
      await syncCartSnapshot(guestCartId, items, token);
      setSyncStatus("synced");
    } catch {
      setSyncStatus("error");
    }
  }, [guestCartId, items, token]);

  useEffect(() => {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    let isCancelled = false;
    setRemoteHydrated(false);

    fetchCurrentCart(guestCartId, token, products)
      .then((remoteItems) => {
        if (isCancelled) return;

        if (remoteItems.length) {
          setItems((currentItems) => mergeCartItems(remoteItems, currentItems));
        }

        setSyncStatus("idle");
      })
      .catch(() => {
        if (!isCancelled) {
          setSyncStatus("error");
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setRemoteHydrated(true);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [guestCartId, products, token]);

  useEffect(() => {
    if (!remoteHydrated) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void syncCartNow();
    }, cartSyncDebounceMs);

    return () => window.clearTimeout(timeoutId);
  }, [remoteHydrated, syncCartNow]);

  const summary = useMemo(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
    const installCare = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;

    return {
      installCare,
      itemCount,
      subtotal,
      total: subtotal + installCare,
    };
  }, [items]);

  const addProductToCart = (
    product: KitchenProduct,
    variant: string,
    colour: ProductColourOption,
  ) => {
    const nextItem = createCartItem(product, variant, colour);

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === nextItem.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === nextItem.id
            ? { ...item, quantity: Math.min(item.quantity + 1, 20) }
            : item,
        );
      }

      return [...currentItems, nextItem];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === itemId ? { ...item, quantity: Math.max(0, Math.min(quantity, 20)) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (itemId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  };

  const clearCart = () => setItems([]);

  return {
    addProductToCart,
    clearCart,
    guestCartId,
    items,
    removeItem,
    setItems,
    summary,
    syncCartNow,
    syncStatus,
    updateQuantity,
  };
}

function readOrCreateGuestCartId() {
  try {
    const storedValue = window.localStorage.getItem(guestCartStorageKey);

    if (storedValue && storedValue.length >= 8) {
      return storedValue;
    }

    const nextGuestCartId = createGuestCartId();
    window.localStorage.setItem(guestCartStorageKey, nextGuestCartId);
    return nextGuestCartId;
  } catch {
    return createGuestCartId();
  }
}

function createGuestCartId() {
  const randomPart =
    typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

  return `guest-${randomPart}`;
}

function mergeCartItems(remoteItems: CartItem[], localItems: CartItem[]) {
  const mergedItems = new Map<string, CartItem>();

  for (const item of remoteItems) {
    mergedItems.set(item.id, item);
  }

  for (const item of localItems) {
    const existingItem = mergedItems.get(item.id);
    mergedItems.set(item.id, existingItem ? { ...existingItem, ...item } : item);
  }

  return Array.from(mergedItems.values()).filter((item) => item.quantity > 0);
}

async function fetchCurrentCart(
  guestCartId: string,
  token: string | null,
  products: KitchenProduct[],
) {
  const apiRoot = getApiRoot();
  if (!apiRoot) return [];

  const query = new URLSearchParams({ guestCartId });
  const response = await fetch(`${apiRoot}/carts/current?${query.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const payload = (await response.json()) as ApiResponse<RemoteCartRecord[]>;

  if (!response.ok || payload.success === false) {
    throw new Error(payload.details || payload.message || "Cart sync failed.");
  }

  return normalizeRemoteCartItems(payload.data ?? [], products);
}

async function syncCartSnapshot(guestCartId: string, items: CartItem[], token: string | null) {
  const apiRoot = getApiRoot();
  if (!apiRoot) return;

  const response = await fetch(`${apiRoot}/carts/sync`, {
    body: JSON.stringify({
      guestCartId,
      items: items.map((item) => ({
        clientLineId: item.id,
        itemData: item,
        productId: item.productId,
        quantity: item.quantity,
      })),
    }),
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    method: "POST",
  });
  const payload = (await response.json()) as ApiResponse<RemoteCartRecord[]>;

  if (!response.ok || payload.success === false) {
    throw new Error(payload.details || payload.message || "Cart sync failed.");
  }
}

function normalizeRemoteCartItems(records: RemoteCartRecord[], products: KitchenProduct[]): CartItem[] {
  return records
    .map((record): CartItem | null => {
      const itemData = record.itemdata ?? record.itemData ?? {};
      const productId = String(itemData.productId ?? record.productid ?? record.productId ?? "");
      const id = String(itemData.id ?? record.clientlineid ?? record.clientLineId ?? productId);
      const code = String(itemData.code ?? "");
      const localProduct = products.find(
        (product) => product.id === productId || product.id === id || product.code === code,
      );
      const quantity = Number(record.quantity ?? itemData.quantity ?? 1);

      if (!id || quantity <= 0) {
        return null;
      }

      return {
        id,
        productId: productId || localProduct?.id || id,
        code: code || localProduct?.code || "Code TBA",
        name: String(itemData.name ?? localProduct?.name ?? "Space Mint module"),
        subcategory: String(itemData.subcategory ?? localProduct?.subcategory ?? "Modules"),
        sizeLabel: String(itemData.sizeLabel ?? localProduct?.size?.label ?? "Size to be confirmed"),
        variant: String(itemData.variant ?? (localProduct ? getKitchenProductInitialOption(localProduct) : "Standard")),
        colourLabel: String(itemData.colourLabel ?? productColourOptions[0].label),
        colourSwatch: String(itemData.colourSwatch ?? productColourOptions[0].swatch),
        unitPrice: Number(itemData.unitPrice ?? (localProduct ? getKitchenProductPrice(localProduct) : 0)),
        quantity: Math.max(1, Math.min(Math.trunc(quantity), 20)),
      };
    })
    .filter((item): item is CartItem => item !== null);
}
