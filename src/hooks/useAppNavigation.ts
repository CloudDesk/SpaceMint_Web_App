import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { NavigationTarget } from "../config/routes";
import { routes } from "../config/routes";

export function useAppNavigation(onNavigate?: () => void) {
  const navigate = useNavigate();

  const navigateToTarget = useCallback(
    (target: NavigationTarget) => {
      onNavigate?.();
      navigate(`${target.path}${target.hash ?? ""}`);

      if (target.hash) {
        window.setTimeout(() => {
          const element = document.getElementById(target.hash!.slice(1));
          if (element) {
            const headerOffset = window.innerWidth <= 860 ? 66 : 76;
            const top = element.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }, 80);
        return;
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [navigate, onNavigate],
  );

  const navigateHome = useCallback(() => navigateToTarget({ path: routes.home }), [navigateToTarget]);
  const navigateKitchen = useCallback(() => navigateToTarget({ path: routes.kitchen }), [navigateToTarget]);
  const navigateKitchenProducts = useCallback(
    () => navigateToTarget({ hash: "#kitchen-products", path: routes.kitchen }),
    [navigateToTarget],
  );
  const navigateWardrobe = useCallback(() => navigateToTarget({ path: routes.wardrobe }), [navigateToTarget]);
  const navigateLiving = useCallback(() => navigateToTarget({ path: routes.living }), [navigateToTarget]);
  const navigateCart = useCallback(() => navigateToTarget({ path: routes.cart }), [navigateToTarget]);
  const navigateCheckout = useCallback(() => navigateToTarget({ path: routes.checkout }), [navigateToTarget]);
  const navigateOrder = useCallback(
    () => navigateToTarget({ path: routes.orderConfirmation }),
    [navigateToTarget],
  );

  return {
    navigateCart,
    navigateCheckout,
    navigateHome,
    navigateKitchen,
    navigateKitchenProducts,
    navigateLiving,
    navigateOrder,
    navigateToTarget,
    navigateWardrobe,
  };
}
