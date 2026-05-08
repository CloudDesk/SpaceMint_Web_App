import { primaryNavigation } from "@/config/navigation";
import { routes } from "@/config/routes";
import { webImages } from "@/data/web-images";

export type Category = {
  id: string;
  name: string;
  description: string;
  href: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  image: string;
  finish: string;
};

export const navigation = primaryNavigation;

export const categories: Category[] = [
  {
    id: "kitchens",
    name: "Stainless Kitchens",
    description: "Precise modular kitchens built around hygiene, warmth, and long-life materials.",
    href: routes.collection("kitchens"),
    image: webImages.kitchenModular,
  },
  {
    id: "wardrobes",
    name: "Bedroom Wardrobes",
    description: "Quiet storage systems with tailored proportions and disciplined material palettes.",
    href: routes.collection("bedroom-wardrobes"),
    image: webImages.wardrobe,
  },
  {
    id: "living",
    name: "Living Room Furniture",
    description: "Wall units, consoles, and room-defining pieces for refined everyday use.",
    href: routes.collection("living-room-furniture"),
    image: webImages.livingRoom,
  },
];

export const products: Product[] = [
  {
    id: "sm-k01",
    name: "Milano Steel Kitchen",
    category: "Kitchen",
    description: "A stainless steel kitchen system with warm beige interior panels and soft-close hardware.",
    price: "From Rs. 4.8L",
    finish: "Brushed steel, warm beige",
    image: webImages.kitchenModular,
  },
  {
    id: "sm-w01",
    name: "Como Wardrobe Wall",
    category: "Wardrobe",
    description: "Full-height wardrobe modules with slim shadow lines and configurable accessories.",
    price: "From Rs. 2.2L",
    finish: "Matte white, black reveal",
    image: webImages.wardrobe,
  },
  {
    id: "sm-l01",
    name: "Verona Media System",
    category: "Living",
    description: "A modular living wall with concealed cable channels, display shelving, and floating storage.",
    price: "From Rs. 1.6L",
    finish: "Warm beige, black frame",
    image: webImages.tvUnit,
  },
];

export const processSteps = [
  "Measure",
  "Design",
  "Manufacture",
  "Install",
] as const;
