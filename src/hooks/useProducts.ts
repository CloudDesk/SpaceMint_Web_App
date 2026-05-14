import { useEffect, useState } from "react";
import { getKitchenProductModelUrl, kitchenProducts, type KitchenProduct } from "../data/kitchenProducts";
import { getApiRoot } from "../lib/api";

export type ProductApiStatus = "error" | "live" | "loading" | "local";

export function useProducts() {
  const [products, setProducts] = useState<KitchenProduct[]>(kitchenProducts);
  const [status, setStatus] = useState<ProductApiStatus>("local");

  useEffect(() => {
    let isActive = true;
    setStatus("loading");

    fetchProductsFromApi()
      .then((nextProducts) => {
        if (!isActive) return;

        if (nextProducts.length) {
          setProducts(nextProducts);
          setStatus("live");
          return;
        }

        setProducts(kitchenProducts);
        setStatus("local");
      })
      .catch(() => {
        if (!isActive) return;

        setProducts(kitchenProducts);
        setStatus("error");
      });

    return () => {
      isActive = false;
    };
  }, []);

  return { products, status };
}

async function fetchProductsFromApi(): Promise<KitchenProduct[]> {
  const apiRoot = getApiRoot();
  const productPlatform = import.meta.env.VITE_PRODUCT_PLATFORM ?? "spacemint";

  if (!apiRoot) {
    return [];
  }

  const response = await fetch(
    `${apiRoot}/products/platform/${encodeURIComponent(productPlatform)}?limit=500`,
  );

  if (!response.ok) {
    throw new Error(`Product API failed with ${response.status}`);
  }

  const payload = await response.json();
  const rawProducts = Array.isArray(payload?.data) ? payload.data : [];

  return rawProducts.map(normalizeKitchenProductFromApi);
}

function normalizeKitchenProductFromApi(product: any, index: number): KitchenProduct {
  const code = String(product.code ?? product.puc ?? product.productcode ?? product.id ?? "");
  const id = String(product.id ?? code);
  const localProduct = kitchenProducts.find((item) => item.id === id || item.code === code);
  const specs = product.specs ?? {};
  const media = product.media ?? {};

  return {
    id,
    serialNumber: Number(product.serialNumber ?? product.serialnumber ?? localProduct?.serialNumber ?? index + 1),
    name: String(product.name ?? localProduct?.name ?? "Untitled product"),
    code,
    size: normalizeProductSize(product.size) ?? localProduct?.size ?? null,
    hasSketchupModel: Boolean(product.hasSketchupModel ?? product.has_sketchup_model ?? localProduct?.hasSketchupModel),
    sketchupFile: localProduct?.sketchupFile,
    modelUrl: getKitchenProductModelUrl(code, media.model3d?.url) ?? localProduct?.modelUrl,
    category: String(product.category ?? product.categoryId ?? localProduct?.category ?? "Kitchens"),
    subcategory: String(product.subcategory ?? product.subcategoryId ?? localProduct?.subcategory ?? "Modules"),
    pricing: {
      basePrice: product.pricing?.basePrice ?? product.price ?? null,
      currency: product.pricing?.currency ?? product.currency ?? "INR",
    },
    specs: {
      summary: String(specs.summary ?? specs.overview?.summary ?? product.shortdescription ?? localProduct?.specs.summary ?? ""),
      coreMaterial: specs.coreMaterial ?? specs.materials?.coreMaterial ?? product.material ?? localProduct?.specs.coreMaterial ?? null,
      finish: specs.finish ?? specs.materials?.finish ?? localProduct?.specs.finish ?? null,
      hardware: Array.isArray(specs.hardware)
        ? specs.hardware
        : Array.isArray(specs.features?.hardware)
          ? specs.features.hardware
          : localProduct?.specs.hardware ?? [],
      highlights: Array.isArray(specs.highlights)
        ? specs.highlights
        : Array.isArray(specs.features?.highlights)
          ? specs.features.highlights
          : localProduct?.specs.highlights,
    },
  };
}

function normalizeProductSize(size: any): KitchenProduct["size"] {
  if (!size || typeof size !== "object") {
    return null;
  }

  const width = Number(size.width);
  const height = Number(size.height);
  const depth = Number(size.depth);
  const hasDimensions = Number.isFinite(width) && Number.isFinite(height) && Number.isFinite(depth);

  if (!hasDimensions && !size.label && !size.displayLabel) {
    return null;
  }

  return {
    width: Number.isFinite(width) ? width : 0,
    height: Number.isFinite(height) ? height : 0,
    depth: Number.isFinite(depth) ? depth : 0,
    unit: size.unit ?? "mm",
    label: size.label ?? size.displayLabel ?? "Size to be confirmed",
  };
}
