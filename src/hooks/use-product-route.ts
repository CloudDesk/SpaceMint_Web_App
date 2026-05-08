import { useEffect, useRef, useState } from "react";
import { parseAppHash } from "@/config/routes";
import { collectionPages } from "@/data/collections";
import products from "@/data/spacemint-products.json";
import {
  markNextRouteForRestore,
  markNextRouteForTop,
  saveRouteScrollPosition,
} from "@/lib/scroll";

export function useAppRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  const previousHashRef = useRef(hash);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const handleRouteChange = (intent: "restore" | "top") => {
      const nextHash = window.location.hash;
      const previousHash = previousHashRef.current;

      if (previousHash === nextHash) {
        return;
      }

      saveRouteScrollPosition(previousHash);

      if (intent === "restore") {
        markNextRouteForRestore();
      } else {
        markNextRouteForTop();
      }

      previousHashRef.current = nextHash;
      setHash(nextHash);
    };

    const onHashChange = () => handleRouteChange("top");
    const onPopState = () => handleRouteChange("restore");

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const route = parseAppHash(hash);
  const productId = route.type === "product" ? route.id : null;
  const product = products.find((item) => item.id === productId) ?? null;
  const collectionId = route.type === "collection" ? route.id : null;
  const collection = collectionPages.find((item) => item.id === collectionId) ?? null;
  const isCart = route.type === "cart";
  const isCheckout = route.type === "checkout";
  const isProducts = route.type === "products";

  return { collection, collectionId, hash, isCart, isCheckout, isProducts, product, productId, route };
}

export const useProductRoute = useAppRoute;
