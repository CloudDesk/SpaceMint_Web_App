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
  items: CartItem[];
  orders: StoredOrder[];
  placeOrder: (details: CheckoutDetails) => StoredOrder | null;
  removeItem: (itemId: string) => void;
  saveCheckoutDetails: (details: CheckoutDetails) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
};

const CART_STORAGE_KEY = "spacemint.cart.v1";
const CHECKOUT_STORAGE_KEY = "spacemint.checkout.v1";
const ORDERS_STORAGE_KEY = "spacemint.orders.v1";

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
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails>(() =>
    readStoredCheckoutDetails(),
  );
  const [orders, setOrders] = useState<StoredOrder[]>(() => readStoredOrders());

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    window.localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkoutDetails));
  }, [checkoutDetails]);

  useEffect(() => {
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

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
      items,
      orders,
      placeOrder,
      removeItem,
      saveCheckoutDetails,
      updateQuantity,
    }),
    [
      addItem,
      checkoutDetails,
      clearCart,
      items,
      orders,
      placeOrder,
      removeItem,
      saveCheckoutDetails,
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
