import type { CSSProperties } from "react";
import type { KitchenProduct } from "../data/kitchenProducts";
import { productColourOptions } from "../data/siteContent";
import type { CartItem, CheckoutForm, ProductColourOption } from "../types/commerce";

export const cartStorageKey = "space-mint-cart";

export const emptyCheckoutForm: CheckoutForm = {
  addressLine1: "",
  city: "",
  email: "",
  fullName: "",
  paymentMethod: "upi",
  phone: "",
  pincode: "",
  state: "",
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);

export const getKitchenProductPrice = (product: KitchenProduct) => {
  if (product.pricing?.basePrice && product.pricing.basePrice > 0) {
    return Math.round(product.pricing.basePrice);
  }

  const baseBySubcategory: Record<string, number> = {
    "Base shutter units": 18500,
    "Corner units": 24500,
    "Drawer units": 21500,
    "Lift-up wall units": 17200,
    "Pull-out storage": 11800,
    "Wall units": 14200,
  };
  const basePrice = baseBySubcategory[product.subcategory] ?? 15500;
  const sizePremium = product.size
    ? Math.round((product.size.width * product.size.height * product.size.depth) / 1000000) * 95
    : 3600;

  return Math.round((basePrice + sizePremium) / 100) * 100;
};

export const getStoredCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const storedCart = window.localStorage.getItem(cartStorageKey);
    if (!storedCart) return [];
    const parsedCart = JSON.parse(storedCart);
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
};

export const getKitchenProductVariant = (product: KitchenProduct) => {
  if (product.name.includes("3 Drawers")) return "3 Drawer";
  if (product.name.includes("2 Drawers")) return "2 Drawer";
  if (product.name.includes("2 Door")) return "2 Door";
  if (product.name.includes("1 Door")) return "1 Door";
  if (product.name.includes("Bottle Pullout")) return "Bottle Pullout";
  if (product.name.includes("Corner Unit")) return "Corner Unit";
  if (product.name.includes("Up Lift")) return "Lift-up Wall";

  return product.subcategory;
};

export const getKitchenProductVariantOptions = (product: KitchenProduct) => {
  if (product.name.includes("Door") || product.subcategory.toLowerCase().includes("shutter")) {
    return ["1 Door", "2 Door"];
  }

  if (product.name.includes("Drawer") || product.subcategory.toLowerCase().includes("drawer")) {
    return ["2 Drawer", "3 Drawer"];
  }

  if (product.subcategory === "Pull-out storage") {
    return ["150mm", "200mm", "300mm"];
  }

  if (product.subcategory === "Corner units") {
    return ["L Shaped", "Left Side", "Right Side"];
  }

  if (product.subcategory === "Lift-up wall units") {
    return ["600mm", "750mm"];
  }

  return [getKitchenProductVariant(product)];
};

export const findKitchenVariantProduct = (
  variant: string,
  currentProduct: KitchenProduct,
  products: KitchenProduct[],
) => {
  const matchingProducts = products.filter((product) => getKitchenProductVariant(product) === variant);

  if (matchingProducts.length === 0) return null;

  return (
    matchingProducts.find((product) => product.subcategory === currentProduct.subcategory) ??
    matchingProducts.find((product) => product.category === currentProduct.category) ??
    matchingProducts[0]
  );
};

export const getKitchenProductInitialOption = (product: KitchenProduct) => {
  const variant = getKitchenProductVariant(product);
  const options = getKitchenProductVariantOptions(product);

  if (options.includes(variant)) return variant;

  const sizeMatch = product.name.match(/(\d{3,4}mm)/i);
  if (sizeMatch && options.includes(sizeMatch[1])) return sizeMatch[1];

  if (product.name.includes("Left")) return "Left Side";
  if (product.name.includes("Right")) return "Right Side";
  if (product.name.includes("L Shaped")) return "L Shaped";

  return options[0];
};

export const createCartItem = (
  product: KitchenProduct,
  variant: string,
  colour: ProductColourOption = productColourOptions[0],
): CartItem => ({
  code: product.code,
  colourLabel: colour.label,
  colourSwatch: colour.swatch,
  id: `${product.id}-${variant}-${colour.label}`,
  name: product.name,
  productId: product.id,
  quantity: 1,
  sizeLabel: product.size?.label ?? "Size to be confirmed",
  subcategory: product.subcategory,
  unitPrice: getKitchenProductPrice(product),
  variant,
});

export const getProductStageBackground = (colour: ProductColourOption): CSSProperties => {
  const [red, green, blue] = colour.color;
  const r = Math.round(red * 255);
  const g = Math.round(green * 255);
  const b = Math.round(blue * 255);
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  const isLightFinish = luminance > 0.78;
  const isDarkFinish = luminance < 0.34;
  const base = isLightFinish ? "#d8d8d3" : isDarkFinish ? "#f2ecdf" : "#ebe7df";
  const edge = isLightFinish ? "#c8c9c4" : isDarkFinish ? "#fff8ec" : "#f5efe5";
  const tintOpacity = isLightFinish ? 0.08 : isDarkFinish ? 0.1 : 0.22;
  const highlight = isLightFinish ? "rgba(255, 255, 255, 0.52)" : "rgba(255, 255, 255, 0.76)";
  const floorShadow = isLightFinish ? "rgba(0, 0, 0, 0.16)" : "rgba(0, 0, 0, 0.1)";

  return {
    background: `
      radial-gradient(circle at 50% 36%, ${highlight} 0%, rgba(255, 255, 255, 0.28) 30%, transparent 56%),
      radial-gradient(ellipse at 50% 88%, ${floorShadow} 0%, transparent 34%),
      linear-gradient(135deg, rgba(${r}, ${g}, ${b}, ${tintOpacity}) 0%, ${base} 48%, ${edge} 100%)
    `,
  };
};
