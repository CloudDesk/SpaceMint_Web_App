import { useEffect, useState } from "react";
import {
  getCachedProducts,
  getProducts,
  type Product,
} from "@/data/products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(
    () => getCachedProducts() ?? [],
  );
  const [isLoading, setIsLoading] = useState(() => !getCachedProducts());

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);

    getProducts()
      .then((nextProducts) => {
        if (isActive) {
          setProducts(nextProducts);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return { isLoading, products };
}
