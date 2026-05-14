/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/context/auth-context";

export type CartItemInput = {
  category: string;
  code: string | null;
  finishColor?: string;
  finishLabel?: string;
  id: string;
  name: string;
  quantity?: number;
  sizeLabel?: string;
  subcategory: string;
};

export type CartItem = Required<Pick<CartItemInput, "id" | "name" | "category" | "subcategory">> &
  Omit<CartItemInput, "id" | "name" | "category" | "subcategory" | "quantity"> & {
    quantity: number;
  };

export type CheckoutDetails = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  email: string;
  fullName: string;
  notes: string;
  phone: string;
  pincode: string;
  state: string;
};

export type StoredOrder = {
  checkoutDetails: CheckoutDetails;
  createdAt: string;
  id: string;
  items: CartItem[];
  totalQuantity: number;
};

type CartContextValue = {
  addItem: (item: CartItemInput) => void;
  cartCount: number;
  checkoutDetails: CheckoutDetails;
  clearCart: () => void;
  guestCartId: string;
  items: CartItem[];
  orders: StoredOrder[];
  placeOrder: (details: CheckoutDetails) => StoredOrder | null;
  removeItem: (itemId: string) => void;
  saveCheckoutDetails: (details: CheckoutDetails) => void;
  syncCartNow: () => Promise<void>;
  syncStatus: CartSyncStatus;
  updateQuantity: (itemId: string, quantity: number) => void;
};

const CART_STORAGE_KEY = "spacemint.cart.v1";
const CHECKOUT_STORAGE_KEY = "spacemint.checkout.v1";
const GUEST_CART_STORAGE_KEY = "spacemint.cart.guest-id.v1";
const ORDERS_STORAGE_KEY = "spacemint.orders.v1";
const CART_SYNC_DEBOUNCE_MS = 600;

type CartSyncStatus = "idle" | "syncing" | "synced" | "error";

type ApiResponse<T> = {
  data?: T;
  details?: string;
  message?: string;
  success: boolean;
};

type RemoteCartRecord = {
  clientlineid?: string | null;
  itemdata?: Partial<CartItem> | null;
  productid?: number | string | null;
  quantity?: number | string | null;
};

const emptyCheckoutDetails: CheckoutDetails = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  email: "",
  fullName: "",
  notes: "",
  phone: "",
  pincode: "",
  state: "",
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [guestCartId] = useState(() => readOrCreateGuestCartId());
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails>(() =>
    readStoredCheckoutDetails(),
  );
  const [orders, setOrders] = useState<StoredOrder[]>(() => readStoredOrders());
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
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    window.localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkoutDetails));
  }, [checkoutDetails]);

  useEffect(() => {
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    let isCancelled = false;

    setRemoteHydrated(false);

    async function hydrateRemoteCart() {
      try {
        const remoteItems = await fetchCurrentCart(guestCartId, token);

        if (isCancelled) {
          return;
        }

        if (remoteItems.length) {
          setItems((currentItems) => mergeCartItems(remoteItems, currentItems));
        }

        setSyncStatus("idle");
      } catch {
        if (!isCancelled) {
          setSyncStatus("error");
        }
      } finally {
        if (!isCancelled) {
          setRemoteHydrated(true);
        }
      }
    }

    void hydrateRemoteCart();

    return () => {
      isCancelled = true;
    };
  }, [guestCartId, token]);

  useEffect(() => {
    if (!remoteHydrated) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void syncCartNow();
    }, CART_SYNC_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [remoteHydrated, syncCartNow]);

  const addItem = useCallback((input: CartItemInput) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === input.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === input.id
            ? {
                ...item,
                finishColor: input.finishColor ?? item.finishColor,
                finishLabel: input.finishLabel ?? item.finishLabel,
                quantity: item.quantity + (input.quantity ?? 1),
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          category: input.category,
          code: input.code,
          finishColor: input.finishColor,
          finishLabel: input.finishLabel,
          id: input.id,
          name: input.name,
          quantity: Math.max(input.quantity ?? 1, 1),
          sizeLabel: input.sizeLabel,
          subcategory: input.subcategory,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: Math.max(Math.min(quantity, 99), 0),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const saveCheckoutDetails = useCallback((details: CheckoutDetails) => {
    setCheckoutDetails(details);
  }, []);

  const placeOrder = useCallback(
    (details: CheckoutDetails) => {
      if (!items.length) {
        return null;
      }

      const order: StoredOrder = {
        checkoutDetails: details,
        createdAt: new Date().toISOString(),
        id: createOrderId(),
        items,
        totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
      };

      setCheckoutDetails(details);
      setOrders((currentOrders) => [order, ...currentOrders]);
      setItems([]);

      return order;
    },
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      addItem,
      cartCount: items.reduce((total, item) => total + item.quantity, 0),
      checkoutDetails,
      clearCart,
      guestCartId,
      items,
      orders,
      placeOrder,
      removeItem,
      saveCheckoutDetails,
      syncCartNow,
      syncStatus,
      updateQuantity,
    }),
    [
      addItem,
      checkoutDetails,
      clearCart,
      guestCartId,
      items,
      orders,
      placeOrder,
      removeItem,
      saveCheckoutDetails,
      syncCartNow,
      syncStatus,
      updateQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

function readStoredCart() {
  try {
    const storedValue = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue) as CartItem[];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((item) => item.id && item.name && item.quantity > 0);
  } catch {
    return [];
  }
}

function readOrCreateGuestCartId() {
  try {
    const storedValue = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);

    if (storedValue && storedValue.length >= 8) {
      return storedValue;
    }

    const nextGuestCartId = createGuestCartId();
    window.localStorage.setItem(GUEST_CART_STORAGE_KEY, nextGuestCartId);
    return nextGuestCartId;
  } catch {
    return createGuestCartId();
  }
}

function readStoredCheckoutDetails() {
  try {
    const storedValue = window.localStorage.getItem(CHECKOUT_STORAGE_KEY);

    if (!storedValue) {
      return emptyCheckoutDetails;
    }

    return {
      ...emptyCheckoutDetails,
      ...(JSON.parse(storedValue) as Partial<CheckoutDetails>),
    };
  } catch {
    return emptyCheckoutDetails;
  }
}

function readStoredOrders() {
  try {
    const storedValue = window.localStorage.getItem(ORDERS_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue) as StoredOrder[];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((order) => order.id && Array.isArray(order.items));
  } catch {
    return [];
  }
}

function createOrderId() {
  const randomPart =
    typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `SM-${randomPart.toUpperCase()}`;
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

async function fetchCurrentCart(guestCartId: string, token: string | null) {
  const query = new URLSearchParams({ guestCartId });
  const response = await fetch(`${getApiRoot()}/carts/current?${query.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const payload = (await response.json()) as ApiResponse<RemoteCartRecord[]>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.details || payload.message || "Cart sync failed.");
  }

  return normalizeRemoteCartItems(payload.data ?? []);
}

async function syncCartSnapshot(guestCartId: string, items: CartItem[], token: string | null) {
  const response = await fetch(`${getApiRoot()}/carts/sync`, {
    body: JSON.stringify({
      guestCartId,
      items: items.map((item) => ({
        clientLineId: item.id,
        itemData: item,
        productId: item.id,
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

  if (!response.ok || !payload.success) {
    throw new Error(payload.details || payload.message || "Cart sync failed.");
  }
}

function normalizeRemoteCartItems(records: RemoteCartRecord[]): CartItem[] {
  return records
    .map((record): CartItem | null => {
      const itemData = record.itemdata ?? {};
      const id = String(itemData.id ?? record.clientlineid ?? record.productid ?? "");
      const name = typeof itemData.name === "string" ? itemData.name : "";
      const category = typeof itemData.category === "string" ? itemData.category : "";
      const subcategory = typeof itemData.subcategory === "string" ? itemData.subcategory : "";
      const quantity = Number(record.quantity ?? itemData.quantity ?? 1);

      if (!id || !name || !category || !subcategory || quantity <= 0) {
        return null;
      }

      return {
        category,
        code: typeof itemData.code === "string" ? itemData.code : null,
        finishColor: typeof itemData.finishColor === "string" ? itemData.finishColor : undefined,
        finishLabel: typeof itemData.finishLabel === "string" ? itemData.finishLabel : undefined,
        id,
        name,
        quantity: Math.max(1, Math.min(Math.trunc(quantity), 99)),
        sizeLabel: typeof itemData.sizeLabel === "string" ? itemData.sizeLabel : undefined,
        subcategory,
      } satisfies CartItem;
    })
    .filter((item): item is CartItem => item !== null);
}

function getApiRoot() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

  if (!apiBaseUrl) {
    return "";
  }

  return apiBaseUrl.endsWith("/v1") ? apiBaseUrl : `${apiBaseUrl}/v1`;
}
