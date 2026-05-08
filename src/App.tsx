import { useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { CartProvider } from "@/context/cart-context";
import { useLenis } from "@/hooks/use-lenis";
import { useAppRoute } from "@/hooks/use-product-route";
import { CartPage } from "@/pages/cart";
import { CheckoutPage } from "@/pages/checkout";
import { CollectionDetailPage } from "@/pages/collection-detail";
import { HomePage } from "@/pages/home";
import { ProductDetailPage } from "@/pages/product-detail";
import { ProductListPage } from "@/pages/product-list";
import { restoreOrScrollToTop } from "@/lib/scroll";

export default function App() {
  useLenis();
  const { collection, hash, isCart, isCheckout, isProducts, product } = useAppRoute();

  useEffect(() => {
    restoreOrScrollToTop(hash, { defer: true });
  }, [hash]);

  return (
    <CartProvider>
      <Layout>
        {isCart ? (
          <CartPage />
        ) : isCheckout ? (
          <CheckoutPage />
        ) : isProducts ? (
          <ProductListPage />
        ) : product ? (
          <ProductDetailPage key={product.id} product={product} />
        ) : collection ? (
          <CollectionDetailPage key={collection.id} collection={collection} />
        ) : (
          <HomePage />
        )}
      </Layout>
    </CartProvider>
  );
}
