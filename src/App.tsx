import { useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { CustomerAuthModal } from "@/components/layout/customer-auth-modal";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { useLenis } from "@/hooks/use-lenis";
import { useAppRoute } from "@/hooks/use-product-route";
import { useProducts } from "@/hooks/use-products";
import { CartPage } from "@/pages/cart";
import { CheckoutPage } from "@/pages/checkout";
import { CollectionDetailPage } from "@/pages/collection-detail";
import { HomePage } from "@/pages/home";
import { ProductDetailRoutePage } from "@/pages/product-detail";
import { ProductListPage } from "@/pages/product-list";
import { restoreOrScrollToTop } from "@/lib/scroll";

export default function App() {
  useLenis();
  const { isLoading: isProductsLoading, products } = useProducts();
  const { collection, hash, isCart, isCheckout, isProducts, productId } = useAppRoute(products);

  useEffect(() => {
    restoreOrScrollToTop(hash, { defer: true });
  }, [hash]);

  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          {isCart ? (
            <CartPage />
          ) : isCheckout ? (
            <CheckoutPage />
          ) : isProducts ? (
            <ProductListPage />
          ) : productId ? (
            <ProductDetailRoutePage
              isLoading={isProductsLoading}
              key={productId}
              productId={productId}
              products={products}
            />
          ) : collection ? (
            <CollectionDetailPage key={collection.id} collection={collection} />
          ) : (
            <HomePage />
          )}
        </Layout>
        <CustomerAuthModal />
      </CartProvider>
    </AuthProvider>
  );
}
