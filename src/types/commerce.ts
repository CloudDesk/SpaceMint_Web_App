import type { KitchenProduct } from "../data/kitchenProducts";

export type ProductColourOption = {
  color: number[];
  group: string;
  label: string;
  swatch: string;
};

export type FinishOption = {
  color: number[];
  image: string;
  label: string;
};

export type CartItem = {
  id: string;
  productId: string;
  code: string;
  name: string;
  subcategory: string;
  sizeLabel: string;
  variant: string;
  colourLabel: string;
  colourSwatch: string;
  unitPrice: number;
  quantity: number;
};

export type CheckoutForm = {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
};

export type OrderConfirmation = {
  orderNumber: string;
  total: number;
  itemCount: number;
};

export type CartSummary = {
  itemCount: number;
  subtotal: number;
  installCare: number;
  total: number;
};

export type ProductActionHandlers = {
  addProductToCart: (
    product: KitchenProduct,
    variant: string,
    colour: ProductColourOption,
  ) => void;
  buyProductNow: (
    product: KitchenProduct,
    variant: string,
    colour: ProductColourOption,
  ) => void;
};
