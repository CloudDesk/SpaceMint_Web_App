export type AppRoute =
  | {
      type: "cart";
    }
  | {
      type: "checkout";
    }
  | {
      type: "collection";
      id: string;
    }
  | {
      type: "home";
    }
  | {
      type: "product";
      id: string;
    }
  | {
      hash: string;
      type: "section";
    };

export const routes = {
  cart: "#cart",
  checkout: "#checkout",
  collection: (id: string) => `#collection/${id}`,
  home: "#",
  product: (id: string) => `#product/${id}`,
  section: (id: string) => `#${id}`,
} as const;

export function parseAppHash(hash: string): AppRoute {
  if (!hash || hash === routes.home) {
    return { type: "home" };
  }

  if (hash === routes.cart) {
    return { type: "cart" };
  }

  if (hash === routes.checkout) {
    return { type: "checkout" };
  }

  const productId = hash.match(/^#product\/(.+)$/)?.[1];

  if (productId) {
    return {
      id: productId,
      type: "product",
    };
  }

  const collectionId = hash.match(/^#collection\/(.+)$/)?.[1];

  if (collectionId) {
    return {
      id: collectionId,
      type: "collection",
    };
  }

  return {
    hash,
    type: "section",
  };
}
