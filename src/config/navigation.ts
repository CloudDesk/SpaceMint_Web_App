import type { Product } from "@/data/products";
import { kitchenImages, wardrobeImages } from "@/data/local-assets";
import { routes } from "@/config/routes";
import { webImages } from "@/data/web-images";

export type NavigationItem = {
  id: string;
  href: string;
  label: string;
  showInFooter?: boolean;
  showInHeader?: boolean;
  showInMobile?: boolean;
};

export type MegaMenuItem = {
  label: string;
  href: string;
  meta?: string;
};

export type MegaMenuColumn = {
  title: string;
  items: MegaMenuItem[];
};

export type MegaMenuSection = NavigationItem & {
  columns: MegaMenuColumn[];
  eyebrow: string;
  image: string;
  summary: string;
};

const kitchenSubcategoryOrder = [
  "Wall units",
  "Base shutter units",
  "Drawer units",
  "Pull-out storage",
  "Corner units",
  "Lift-up wall units",
];

const categoryAliases: Record<string, string[]> = {
  "bedroom-wardrobes": ["bedroom", "bedroom_wardrobes", "bedroom-wardrobes", "bedroom wardrobes"],
  kitchens: ["kitchen", "kitchens"],
  "living-room-furniture": [
    "living room",
    "living_room",
    "living-room",
    "living room furniture",
    "living-room-furniture",
  ],
  "other-furniture": ["other", "other_furniture", "other-furniture", "other furniture"],
};

function normalizeKey(value: string | null | undefined) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function buildProductColumns(
  products: Product[],
  sectionId: string,
  fallbackColumns: MegaMenuColumn[],
  preferredOrder: string[] = [],
) {
  const acceptedKeys = new Set(
    (categoryAliases[sectionId] ?? [sectionId]).map(normalizeKey),
  );
  const sectionProducts = products.filter((product) =>
    acceptedKeys.has(normalizeKey(product.categoryId ?? product.category)),
  );

  if (!sectionProducts.length) {
    return fallbackColumns;
  }

  const orderIndex = new Map(
    preferredOrder.map((subcategory, index) => [normalizeKey(subcategory), index]),
  );
  const groups = new Map<string, Product[]>();

  sectionProducts.forEach((product) => {
    const subcategory = product.subcategoryId ?? product.subcategory ?? "Products";
    groups.set(subcategory, [...(groups.get(subcategory) ?? []), product]);
  });

  return [...groups.entries()]
    .sort(([first], [second]) => {
      const firstOrder = orderIndex.get(normalizeKey(first)) ?? Number.MAX_SAFE_INTEGER;
      const secondOrder = orderIndex.get(normalizeKey(second)) ?? Number.MAX_SAFE_INTEGER;

      if (firstOrder !== secondOrder) {
        return firstOrder - secondOrder;
      }

      return first.localeCompare(second);
    })
    .map(([title, items]) => ({
      title,
      items: items
        .slice()
        .sort((first, second) => first.serialNumber - second.serialNumber)
        .map((product) => ({
          href: routes.product(product.id),
          label: product.name,
          meta: product.size?.label ?? product.code ?? undefined,
        })),
    }));
}

export function buildMegaMenuSections(products: Product[] = []): MegaMenuSection[] {
  const kitchenColumns = buildProductColumns(
    products,
    "kitchens",
    [],
    kitchenSubcategoryOrder,
  );

  const sections: MegaMenuSection[] = [
  {
    columns: kitchenColumns,
    eyebrow: "20 configurable modules",
    href: routes.collection("kitchens"),
    id: "kitchens",
    image: kitchenImages.islandWide,
    label: "Kitchens",
    showInFooter: true,
    showInHeader: true,
    showInMobile: true,
    summary:
      "Wall units, shutter units, drawer systems, pull-outs, corner modules, and lift-up storage.",
  },
  {
    columns: [
      {
        items: [
          { href: routes.collection("living-room-furniture"), label: "Floating TV Units", meta: "Wall mounted" },
          { href: routes.collection("living-room-furniture"), label: "Media Storage Walls", meta: "Made to measure" },
          { href: routes.collection("living-room-furniture"), label: "Display Shelving", meta: "Open + closed" },
        ],
        title: "TV & Media",
      },
      {
        items: [
          { href: routes.collection("living-room-furniture"), label: "Sofas", meta: "Modular layouts" },
          { href: routes.collection("living-room-furniture"), label: "Coffee Tables", meta: "Wood / stone tops" },
          { href: routes.collection("living-room-furniture"), label: "Side Tables", meta: "Compact accents" },
        ],
        title: "Seating & Tables",
      },
      {
        items: [
          { href: routes.collection("living-room-furniture"), label: "Console Units", meta: "Entry + living" },
          { href: routes.collection("living-room-furniture"), label: "Low Storage Units", meta: "Soft-close" },
          { href: routes.collection("living-room-furniture"), label: "Wall Panels", meta: "Integrated finish" },
        ],
        title: "Storage",
      },
    ],
    eyebrow: "Living systems",
    href: routes.collection("living-room-furniture"),
    id: "living-room-furniture",
    image: webImages.livingRoom,
    label: "Living Room Furniture",
    showInFooter: true,
    showInHeader: true,
    showInMobile: true,
    summary:
      "Furniture compositions for TV walls, sofas, consoles, display, and concealed storage.",
  },
  {
    columns: [
      {
        items: [
          { href: routes.collection("bedroom-wardrobes"), label: "Hinged Wardrobes", meta: "Full height" },
          { href: routes.collection("bedroom-wardrobes"), label: "Sliding Wardrobes", meta: "Space saving" },
          { href: routes.collection("bedroom-wardrobes"), label: "Walk-in Wardrobes", meta: "Premium storage" },
        ],
        title: "Wardrobes",
      },
      {
        items: [
          { href: routes.collection("bedroom-wardrobes"), label: "Storage Beds", meta: "Hydraulic options" },
          { href: routes.collection("bedroom-wardrobes"), label: "Bedside Tables", meta: "Paired units" },
          { href: routes.collection("bedroom-wardrobes"), label: "Dressers", meta: "Mirror ready" },
        ],
        title: "Bedroom Furniture",
      },
      {
        items: [
          { href: routes.collection("bedroom-wardrobes"), label: "Loft Storage", meta: "Above wardrobe" },
          { href: routes.collection("bedroom-wardrobes"), label: "Drawer Inserts", meta: "Organized interiors" },
          { href: routes.collection("bedroom-wardrobes"), label: "Open Shelves", meta: "Display zones" },
        ],
        title: "Accessories",
      },
    ],
    eyebrow: "Bedroom furniture",
    href: routes.collection("bedroom-wardrobes"),
    id: "bedroom-wardrobes",
    image: wardrobeImages.hinged,
    label: "Bedroom Wardrobes",
    showInFooter: true,
    showInHeader: true,
    showInMobile: true,
    summary:
      "Wardrobes and bedroom pieces planned around clean storage and calm proportions.",
  },
  {
    columns: [
      {
        items: [
          { href: routes.collection("other-furniture"), label: "Dining Tables", meta: "4 to 8 seater" },
          { href: routes.collection("other-furniture"), label: "Dining Chairs", meta: "Wood / upholstered" },
          { href: routes.collection("other-furniture"), label: "Crockery Units", meta: "Display storage" },
        ],
        title: "Dining",
      },
      {
        items: [
          { href: routes.collection("other-furniture"), label: "Study Tables", meta: "Compact work zones" },
          { href: routes.collection("other-furniture"), label: "Book Shelves", meta: "Wall + floor units" },
          { href: routes.collection("other-furniture"), label: "Office Storage", meta: "Closed storage" },
        ],
        title: "Study",
      },
      {
        items: [
          { href: routes.collection("other-furniture"), label: "Shoe Cabinets", meta: "Entry storage" },
          { href: routes.collection("other-furniture"), label: "Utility Cabinets", meta: "Made to fit" },
          { href: routes.collection("other-furniture"), label: "Accent Consoles", meta: "Living + foyer" },
        ],
        title: "Storage",
      },
    ],
    eyebrow: "Loose + fitted pieces",
    href: routes.collection("other-furniture"),
    id: "other-furniture",
    image: webImages.otherFurniture,
    label: "Other Furniture",
    showInFooter: false,
    showInHeader: true,
    showInMobile: true,
    summary:
      "Dining, study, storage, and accent pieces designed to sit with the main room systems.",
  },
  ];

  return sections.map((section) => ({
    ...section,
    columns: buildProductColumns(products, section.id, section.columns, kitchenSubcategoryOrder),
  }));
}

export const megaMenuSections: MegaMenuSection[] = buildMegaMenuSections();

export const primaryNavigation = megaMenuSections
  .filter((section) => section.showInHeader)
  .map(({ href, id, label, showInFooter, showInHeader, showInMobile }) => ({
    href,
    id,
    label,
    showInFooter,
    showInHeader,
    showInMobile,
  }));

export const footerCollectionNavigation = primaryNavigation.filter((item) => item.showInFooter);

export const studioNavigation: NavigationItem[] = [
  { href: routes.section("studio"), id: "studio", label: "Design Consultation" },
  { href: routes.section("process"), id: "process", label: "Process" },
  { href: routes.collection("kitchens"), id: "product-systems", label: "Product Systems" },
];
