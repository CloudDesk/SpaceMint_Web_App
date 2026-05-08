import { useEffect, useState } from "react";
import { parseAppHash } from "@/config/routes";
import { collectionPages } from "@/data/collections";
import products from "@/data/spacemint-products.json";

export function useAppRoute() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
    };
  }, []);

  const route = parseAppHash(hash);
  const productId = route.type === "product" ? route.id : null;
  const product = products.find((item) => item.id === productId) ?? null;
  const collectionId = route.type === "collection" ? route.id : null;
  const collection = collectionPages.find((item) => item.id === collectionId) ?? null;
  const isCart = route.type === "cart";
  const isCheckout = route.type === "checkout";

  return { collection, collectionId, isCart, isCheckout, product, productId, route };
}

export const useProductRoute = useAppRoute;
