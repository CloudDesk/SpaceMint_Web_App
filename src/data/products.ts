export type ProductSize = {
  width?: number;
  height?: number;
  depth?: number;
  unit?: string;
  label?: string;
};

export type ProductSpecs = {
  summary: string;
  coreMaterial?: string | null;
  finish?: string | null;
  hardware: string[];
  highlights: string[];
  raw?: string | null;
  customAttributes?: Record<string, unknown>;
};

export type ProductMedia = {
  thumbnail?: string | null;
  images: string[];
  videos: string[];
  model3d?: {
    type?: string;
    url?: string;
  } | null;
};

export type Product = {
  id: string;
  serialNumber: number;
  name: string;
  code: string;
  category: string;
  categoryId?: string | null;
  subcategory: string;
  subcategoryId?: string | null;
  status?: string | null;
  pricing?: {
    basePrice?: number | null;
    currency?: string | null;
  };
  size: ProductSize | null;
  media?: ProductMedia;
  specs: ProductSpecs;
  seo?: Record<string, unknown> | null;
  audit?: {
    createdAt?: number | string | null;
    updatedAt?: number | string | null;
  };
  hasSketchupModel: boolean;
};

let productCache: Product[] | null = null;
let productRequest: Promise<Product[]> | null = null;

export async function getProducts(): Promise<Product[]> {
  if (productCache) {
    return productCache;
  }

  if (!productRequest) {
    productRequest = fetchProductsFromApi()
      .then((products) => {
        productCache = products;
        return productCache;
      })
      .catch(() => {
        productCache = [];
        return productCache;
      });
  }

  return productRequest;
}

export function getCachedProducts() {
  return productCache;
}

async function fetchProductsFromApi(): Promise<Product[]> {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
  const productPlatform = import.meta.env.VITE_PRODUCT_PLATFORM ?? "spacemint";

  if (!apiBaseUrl) {
    return [];
  }

  const apiRoot = apiBaseUrl.endsWith("/v1") ? apiBaseUrl : `${apiBaseUrl}/v1`;
  const response = await fetch(
    `${apiRoot}/products/platform/${encodeURIComponent(productPlatform)}?limit=500`,
  );

  if (!response.ok) {
    throw new Error(`Product API failed with ${response.status}`);
  }

  const payload = await response.json();
  const rawProducts = Array.isArray(payload?.data) ? payload.data : [];

  return rawProducts.map(normalizeProduct);
}

export function normalizeProduct(product: any, index = 0): Product {
  const code = String(product.code ?? product.puc ?? product.id ?? "");
  const category = String(product.category ?? product.categoryId ?? "Kitchens");
  const subcategory = String(product.subcategory ?? product.subcategoryId ?? "Modules");
  const specs = normalizeSpecs(product.specs, product);

  return {
    id: String(product.id ?? code),
    serialNumber: Number(product.serialNumber ?? product.serialnumber ?? index + 1),
    name: String(product.name ?? "Untitled product"),
    code,
    category,
    categoryId: product.categoryId ?? category,
    subcategory,
    subcategoryId: product.subcategoryId ?? subcategory,
    status: product.status ?? product.productstatus ?? "published",
    pricing: {
      basePrice: product.pricing?.basePrice ?? product.price ?? null,
      currency: product.pricing?.currency ?? product.currency ?? "INR",
    },
    size: normalizeSize(product.size),
    media: normalizeMedia(product.media),
    specs,
    seo: product.seo ?? null,
    audit: product.audit ?? {
      createdAt: product.createddate ?? null,
      updatedAt: product.modifieddate ?? null,
    },
    hasSketchupModel: Boolean(product.hasSketchupModel ?? product.has_sketchup_model),
  };
}

function normalizeSize(size: any): ProductSize | null {
  if (!size || typeof size !== "object") {
    return null;
  }

  return {
    width: toOptionalNumber(size.width),
    height: toOptionalNumber(size.height),
    depth: toOptionalNumber(size.depth),
    unit: size.unit ?? "mm",
    label: size.label ?? size.displayLabel ?? undefined,
  };
}

function normalizeMedia(media: any): ProductMedia {
  if (!media || typeof media !== "object") {
    return {
      images: [],
      videos: [],
      model3d: null,
    };
  }

  return {
    thumbnail: media.thumbnail ?? null,
    images: Array.isArray(media.images) ? media.images : [],
    videos: Array.isArray(media.videos) ? media.videos : [],
    model3d: media.model3d ?? null,
  };
}

function normalizeSpecs(specs: any, product: any): ProductSpecs {
  const summary = specs?.summary ?? specs?.overview?.summary ?? product.shortdescription ?? "";
  return {
    summary,
    coreMaterial: specs?.coreMaterial ?? specs?.materials?.coreMaterial ?? product.material ?? null,
    finish: specs?.finish ?? specs?.materials?.finish ?? null,
    hardware: Array.isArray(specs?.hardware)
      ? specs.hardware
      : Array.isArray(specs?.features?.hardware)
        ? specs.features.hardware
        : [],
    highlights: Array.isArray(specs?.highlights)
      ? specs.highlights
      : Array.isArray(specs?.features?.highlights)
        ? specs.features.highlights
        : [],
    raw: specs?.raw ?? product.fulldescription ?? null,
    customAttributes: specs?.customAttributes ?? {},
  };
}

function toOptionalNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}
