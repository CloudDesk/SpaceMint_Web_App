import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CustomerAuthModal } from "./components/auth/CustomerAuthModal";
import { SiteLayout } from "./components/layout/SiteLayout";
import { useAppNavigation } from "./hooks/useAppNavigation";
import { useAuth } from "./hooks/useAuth";
import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";
import { getKitchenProductInitialOption } from "./lib/commerce";
import { routes } from "./config/routes";
import { productColourOptions } from "./data/siteContent";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { HomePage } from "./pages/HomePage";
import { KitchenPage } from "./pages/KitchenPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { SpacePage } from "./pages/SpacePage";
import type { OrderConfirmation, ProductColourOption } from "./types/commerce";
import type { KitchenProduct } from "./data/kitchenProducts";

export function App() {
  const auth = useAuth();
  const { products } = useProducts();
  const cart = useCart(auth.token, products);
  const navigation = useAppNavigation();
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);

  const buyProductNow = (
    product: KitchenProduct,
    variant = getKitchenProductInitialOption(product),
    colour: ProductColourOption = productColourOptions[0],
  ) => {
    cart.addProductToCart(product, variant, colour);
    navigation.navigateCart();
  };

  return (
    <SiteLayout
      cartItemCount={cart.summary.itemCount}
      isAuthenticated={auth.isAuthenticated}
      onAccountClick={() => auth.openAuthModal({ intent: "profile" })}
      products={products}
      user={auth.user}
    >
      <Routes>
        <Route path={routes.home} element={<HomePage />} />
        <Route
          path={routes.kitchen}
          element={
            <KitchenPage
              addProductToCart={cart.addProductToCart}
              buyProductNow={buyProductNow}
              products={products}
            />
          }
        />
        <Route path={routes.wardrobe} element={<SpacePage kind="wardrobe" />} />
        <Route path={routes.living} element={<SpacePage kind="living" />} />
        <Route
          path="/products/:productId"
          element={
            <ProductDetailPage
              addProductToCart={cart.addProductToCart}
              buyProductNow={buyProductNow}
              products={products}
            />
          }
        />
        <Route
          path={routes.cart}
          element={
            <CartPage
              items={cart.items}
              removeItem={cart.removeItem}
              summary={cart.summary}
              syncCartNow={cart.syncCartNow}
              syncStatus={cart.syncStatus}
              updateQuantity={cart.updateQuantity}
            />
          }
        />
        <Route
          path={routes.checkout}
          element={
            cart.items.length ? (
              <CheckoutPage
                clearCart={cart.clearCart}
                isAuthenticated={auth.isAuthenticated}
                items={cart.items}
                onOrderPlaced={setOrderConfirmation}
                onRequireAuth={(onSuccess) =>
                  auth.openAuthModal({
                    intent: "checkout",
                    onSuccess,
                  })
                }
                summary={cart.summary}
                user={auth.user}
              />
            ) : (
              <Navigate to={routes.cart} replace />
            )
          }
        />
        <Route
          path={routes.orderConfirmation}
          element={<OrderConfirmationPage order={orderConfirmation} />}
        />
        <Route path="*" element={<Navigate to={routes.home} replace />} />
      </Routes>
      <CustomerAuthModal
        error={auth.error}
        googleClientId={auth.googleClientId}
        intent={auth.modalIntent}
        isAuthenticated={auth.isAuthenticated}
        isLoading={auth.isLoading}
        onClose={auth.closeAuthModal}
        onRegister={auth.registerWithPassword}
        onSignIn={auth.signInWithPassword}
        onSignInWithGoogle={auth.signInWithGoogle}
        onSignOut={auth.signOut}
        onUpdateProfile={auth.updateProfile}
        open={auth.modalOpen}
        user={auth.user}
      />
    </SiteLayout>
  );
}
