export const routes = {
  cart: "/cart",
  checkout: "/checkout",
  home: "/",
  kitchen: "/kitchen",
  kitchenProducts: "/kitchen#kitchen-products",
  living: "/living",
  orderConfirmation: "/order-confirmation",
  product: (id: string) => `/products/${id}`,
  wardrobe: "/wardrobe",
} as const;

export type AppRouteKey = keyof typeof routes;

export type NavigationTarget = {
  hash?: string;
  path: string;
};

export type NavigationItem = {
  id: string;
  label: string;
  target: NavigationTarget;
  tokens: string;
};

export type NavigationGroup = {
  id: string;
  label: string;
  items: NavigationItem[];
};

export const navigationGroups: NavigationGroup[] = [
  {
    id: "products",
    label: "Products",
    items: [
      createNavigationItem("kitchens", "Kitchens", routes.kitchen, "kitchen modular cabinet layouts"),
      createNavigationItem("wardrobes", "Wardrobes", routes.wardrobe, "wardrobe bedroom sliding hinged loft"),
      createNavigationItem("tv-units", "TV Units", routes.living, "living tv media wall units console"),
      createNavigationItem("storage", "Storage", routes.living, "storage living wardrobe utility"),
      createNavigationItem("utility", "Utility", routes.kitchen, "utility pantry laundry service modules"),
      createNavigationItem("custom-plywood", "Custom Plywood", "/#systems", "custom plywood material modules"),
    ],
  },
  {
    id: "spaces",
    label: "Spaces",
    items: [
      createNavigationItem("kitchen-space", "Kitchen", routes.kitchen, "kitchen spaces layouts"),
      createNavigationItem("bedroom-space", "Bedroom", routes.wardrobe, "bedroom wardrobe"),
      createNavigationItem("living-space", "Living", routes.living, "living room tv unit"),
      createNavigationItem("utility-space", "Utility", routes.kitchen, "utility laundry kitchen"),
      createNavigationItem("commercial-space", "Commercial", "/#quote", "commercial consultation"),
    ],
  },
  {
    id: "materials",
    label: "Materials",
    items: [
      createNavigationItem("bwp-plywood", "BWP Plywood", "/#materials", "bwp plywood waterproof"),
      createNavigationItem("commercial-ply", "Commercial Ply", "/#materials", "commercial plywood"),
      createNavigationItem("laminate", "Laminate", "/#materials", "laminate finish material"),
      createNavigationItem("glass", "Glass", "/#quote", "glass shutters"),
      createNavigationItem("hardware", "Hardware", "/#process", "hardware soft close hinges"),
    ],
  },
  {
    id: "studio",
    label: "Studio",
    items: [
      createNavigationItem("projects", "Projects", "/#systems", "projects portfolio"),
      createNavigationItem("process", "Process", "/#process", "process measure compose build install"),
      createNavigationItem("design-visit", "Design Visit", "/#quote", "design visit consultation quote"),
      createNavigationItem("catalogue", "Catalogue", routes.kitchenProducts, "catalogue kitchen products"),
    ],
  },
];

export const quickActions = [
  { href: "/#systems", id: "explore", label: "Explore" },
  { href: "/#quote", id: "quote", label: "Quote" },
  { href: "tel:+910000000000", id: "call", label: "Call" },
  { href: "/#quote", id: "chat", label: "Chat" },
] as const;

function createNavigationItem(
  id: string,
  label: string,
  href: string,
  tokens: string,
): NavigationItem {
  const [path, hash] = href.split("#");

  return {
    id,
    label,
    target: {
      hash: hash ? `#${hash}` : undefined,
      path: path || "/",
    },
    tokens,
  };
}
