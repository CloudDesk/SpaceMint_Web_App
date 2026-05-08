import products from "@/data/spacemint-products.json";
import { routes } from "@/config/routes";
import { kitchenImages, wardrobeImages } from "@/data/local-assets";
import { webImages } from "@/data/web-images";

export type CollectionProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  href: string;
  meta?: string;
};

export type CollectionType = {
  id: string;
  name: string;
  description: string;
  image: string;
  bestFor: string;
};

export type CollectionPage = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  typesTitle: string;
  types: CollectionType[];
  productsTitle: string;
  products: CollectionProduct[];
};

const kitchenModuleImages: Record<string, string> = {
  "Wall units": kitchenImages.lShapeWarm,
  "Base shutter units": kitchenImages.straightWarm,
  "Drawer units": kitchenImages.islandWarm,
  "Pull-out storage": kitchenImages.parallelWarm,
  "Corner units": kitchenImages.uShapeWarm,
  "Lift-up wall units": kitchenImages.lShapeMono,
};

const kitchenProducts: CollectionProduct[] = products.map((product) => ({
  id: product.id,
  name: product.name,
  category: product.subcategory,
  description: product.specs.summary,
  image: kitchenModuleImages[product.subcategory] ?? kitchenModuleImages["Wall units"],
  href: routes.product(product.id),
  meta: product.size?.label ?? product.code ?? undefined,
}));

export const collectionPages: CollectionPage[] = [
  {
    id: "kitchens",
    label: "Kitchens",
    eyebrow: "Modular kitchen systems",
    title: "Kitchen layouts and modules for every room size.",
    description:
      "Choose the right kitchen shape first, then configure wall units, base units, drawers, pull-outs, corner units, and lift-up storage from the Space Mint module library.",
    image: kitchenImages.islandWide,
    typesTitle: "Kitchen types",
    types: [
      {
        id: "l-shaped",
        name: "L-Shaped Kitchen",
        description: "Two-wall layout that keeps preparation, cooking, and cleaning zones efficient.",
        image: kitchenImages.lShapeWarm,
        bestFor: "Small to medium homes",
      },
      {
        id: "parallel",
        name: "Parallel Kitchen",
        description: "Two facing runs for strong workflow, storage, and appliance zoning.",
        image: kitchenImages.parallelWarm,
        bestFor: "Narrow kitchen rooms",
      },
      {
        id: "island",
        name: "Island Kitchen",
        description: "A central work block for prep, storage, hosting, and open-plan living.",
        image: kitchenImages.islandWarm,
        bestFor: "Open, larger spaces",
      },
      {
        id: "u-shaped",
        name: "U-Shaped Kitchen",
        description: "Three-sided cabinetry with generous counter area and high storage capacity.",
        image: kitchenImages.uShapeWarm,
        bestFor: "Maximum storage",
      },
      {
        id: "straight",
        name: "Straight Kitchen",
        description: "Single-wall layout that keeps compact kitchens simple and easy to maintain.",
        image: kitchenImages.straightWarm,
        bestFor: "Studio and compact homes",
      },
      {
        id: "open",
        name: "Open Kitchen",
        description: "Integrated kitchen that connects cooking, dining, and living in one space.",
        image: kitchenImages.parallelMono,
        bestFor: "Connected family spaces",
      },
    ],
    productsTitle: "Kitchen modules",
    products: kitchenProducts,
  },
  {
    id: "living-room-furniture",
    label: "Living Room Furniture",
    eyebrow: "Living systems",
    title: "Living room furniture planned as complete compositions.",
    description:
      "Browse sofas, TV units, coffee tables, side tables, consoles, cabinets, shelves, and display storage for modern living rooms.",
    image: webImages.livingRoom,
    typesTitle: "Living room categories",
    types: [
      {
        id: "sofas-seating",
        name: "Sofas & Seating",
        description: "Sofas, L-shaped sofas, sofa beds, recliners, lounge chairs, benches, and ottomans.",
        image:
          "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=82",
        bestFor: "Main seating zones",
      },
      {
        id: "tv-units",
        name: "TV Units",
        description: "Wall-mounted, floating, display, and storage-led TV unit compositions.",
        image: webImages.tvUnit,
        bestFor: "Media walls",
      },
      {
        id: "tables",
        name: "Coffee & Side Tables",
        description: "Coffee tables, side tables, nesting tables, and occasional tables.",
        image:
          "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1000&q=82",
        bestFor: "Flexible everyday use",
      },
      {
        id: "storage",
        name: "Cabinets & Shelves",
        description: "Bookshelves, wall shelves, display units, cabinets, sideboards, and room dividers.",
        image:
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=82",
        bestFor: "Organized living rooms",
      },
    ],
    productsTitle: "Living room products",
    products: [
      {
        id: "living-tv-unit",
        name: "Floating TV Unit",
        category: "TV Units",
        description: "Wall-mounted TV storage with open shelves and concealed cable zones.",
        image: webImages.tvUnit,
        href: routes.collection("living-room-furniture"),
        meta: "Made to measure",
      },
      {
        id: "living-sofa",
        name: "Modular Sofa",
        category: "Sofas & Seating",
        description: "Configurable seating for compact and large living rooms.",
        image:
          "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=82",
        href: routes.collection("living-room-furniture"),
        meta: "L-shape / straight",
      },
      {
        id: "living-coffee-table",
        name: "Coffee Table",
        category: "Tables",
        description: "Low table options for seating zones, paired with side tables.",
        image:
          "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1000&q=82",
        href: routes.collection("living-room-furniture"),
        meta: "Wood / stone top",
      },
      {
        id: "living-display-unit",
        name: "Display Storage Unit",
        category: "Cabinets & Shelves",
        description: "A mix of closed storage, bookshelves, display niches, and wall shelves.",
        image:
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=82",
        href: routes.collection("living-room-furniture"),
        meta: "Open + closed",
      },
    ],
  },
  {
    id: "bedroom-wardrobes",
    label: "Bedroom Wardrobes",
    eyebrow: "Bedroom furniture",
    title: "Bedroom wardrobes and furniture built around storage.",
    description:
      "Plan hinged wardrobes, sliding wardrobes, beds, side tables, dressing tables, chest of drawers, and bedroom storage in one system.",
    image: wardrobeImages.hinged,
    typesTitle: "Bedroom categories",
    types: [
      {
        id: "hinged-wardrobes",
        name: "Hinged Wardrobes",
        description: "Classic wardrobe shutters in 1-door, 2-door, 3-door, and 4-door formats.",
        image: wardrobeImages.hinged,
        bestFor: "Flexible room sizes",
      },
      {
        id: "sliding-wardrobes",
        name: "Sliding Wardrobes",
        description: "Space-saving wardrobe fronts for tighter bedrooms and clean wall spans.",
        image: wardrobeImages.sliding,
        bestFor: "Compact circulation",
      },
      {
        id: "beds",
        name: "Beds & Storage Beds",
        description: "Beds with storage, upholstered options, and complete bed-wall planning.",
        image: wardrobeImages.loft,
        bestFor: "Sleeping and storage",
      },
      {
        id: "bedroom-tables",
        name: "Dressing & Bedside Tables",
        description: "Dressing tables, bedside tables, chest of drawers, and blanket boxes.",
        image: wardrobeImages.open,
        bestFor: "Daily bedroom utility",
      },
    ],
    productsTitle: "Bedroom products",
    products: [
      {
        id: "bedroom-hinged-wardrobe",
        name: "Full Height Hinged Wardrobe",
        category: "Wardrobes",
        description: "Made-to-measure wardrobe with internal shelves, drawers, and hanging sections.",
        image: wardrobeImages.hinged,
        href: routes.collection("bedroom-wardrobes"),
        meta: "1 to 4+ door",
      },
      {
        id: "bedroom-sliding-wardrobe",
        name: "Sliding Door Wardrobe",
        category: "Wardrobes",
        description: "Space-saving wardrobe solution with clean sliding fronts.",
        image: wardrobeImages.sliding,
        href: routes.collection("bedroom-wardrobes"),
        meta: "Custom width",
      },
      {
        id: "bedroom-storage-bed",
        name: "Storage Bed",
        category: "Beds",
        description: "Bed system with storage options for compact and master bedrooms.",
        image: wardrobeImages.loft,
        href: routes.collection("bedroom-wardrobes"),
        meta: "Hydraulic option",
      },
      {
        id: "bedroom-dresser",
        name: "Dressing Table",
        category: "Bedroom Tables",
        description: "Mirror-ready dresser with drawers and utility storage.",
        image: wardrobeImages.fluted,
        href: routes.collection("bedroom-wardrobes"),
        meta: "Drawer storage",
      },
    ],
  },
  {
    id: "other-furniture",
    label: "Other Furniture",
    eyebrow: "Dining, study and storage",
    title: "Additional furniture for dining, study, and storage.",
    description:
      "Complete the home with dining tables, dining chairs, crockery units, study tables, bookshelves, shoe racks, and utility cabinets.",
    image: webImages.otherFurniture,
    typesTitle: "Furniture categories",
    types: [
      {
        id: "dining",
        name: "Dining Furniture",
        description: "Dining sets, dining tables, chairs, benches, crockery units, and sideboards.",
        image: webImages.otherFurniture,
        bestFor: "Meal zones",
      },
      {
        id: "study",
        name: "Study Furniture",
        description: "Study tables, computer tables, folding desks, bookshelves, and study chairs.",
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=82",
        bestFor: "Work from home",
      },
      {
        id: "storage",
        name: "Storage Furniture",
        description: "Shoe racks, cabinets, sideboards, display units, wall shelves, and utility units.",
        image:
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=82",
        bestFor: "Daily organization",
      },
    ],
    productsTitle: "Furniture products",
    products: [
      {
        id: "other-dining-table",
        name: "Dining Table Set",
        category: "Dining",
        description: "Dining sets available as compact, 4-seater, 6-seater, and larger configurations.",
        image: webImages.otherFurniture,
        href: routes.collection("other-furniture"),
        meta: "2 to 8 seater",
      },
      {
        id: "other-crockery-unit",
        name: "Crockery Unit",
        category: "Dining Storage",
        description: "Display and closed storage for dining and kitchen-adjacent spaces.",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=82",
        href: routes.collection("other-furniture"),
        meta: "Display storage",
      },
      {
        id: "other-study-table",
        name: "Study Table",
        category: "Study",
        description: "Compact desks, wall-mounted study units, and work-from-home tables.",
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=82",
        href: routes.collection("other-furniture"),
        meta: "Compact / wall mounted",
      },
      {
        id: "other-shoe-rack",
        name: "Shoe Rack",
        category: "Storage",
        description: "Entryway storage for shoes, accessories, and everyday utility.",
        image:
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=82",
        href: routes.collection("other-furniture"),
        meta: "Entry storage",
      },
    ],
  },
];
