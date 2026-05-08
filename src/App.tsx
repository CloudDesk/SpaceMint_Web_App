import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  Menu,
  MessageCircle,
  Phone,
  Ruler,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { type CSSProperties, type FormEvent, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import kitchenWide from "../assests/kitchen/ChatGPT Image May 6, 2026, 01_07_06 PM.png";
import kitchenIsland from "../assests/kitchen/ChatGPT Image May 6, 2026, 02_04_55 PM.png";
import kitchenParallel from "../assests/kitchen/ChatGPT Image May 6, 2026, 02_06_55 PM.png";
import kitchenCompact from "../assests/kitchen/ChatGPT Image May 6, 2026, 04_16_03 PM.png";
import kitchenTall from "../assests/kitchen/ChatGPT Image May 6, 2026, 04_30_09 PM.png";
import kitchenSignature from "../assests/kitchen/ChatGPT Image May 6, 2026, 04_32_07 PM.png";
import kitchenLinear from "../assests/kitchen/ChatGPT Image May 6, 2026, 12_50_29 PM.png";
import kitchenSoft from "../assests/kitchen/ChatGPT Image May 6, 2026, 12_54_02 PM.png";
import kitchenUrban from "../assests/kitchen/ChatGPT Image May 6, 2026, 12_55_28 PM.png";
import kitchenGallery from "../assests/kitchen/ChatGPT Image May 6, 2026, 12_56_38 PM.png";
import wardrobeClassic from "../assests/wardrobe/ChatGPT Image May 7, 2026, 02_29_59 PM.png";
import wardrobeDisplay from "../assests/wardrobe/ChatGPT Image May 7, 2026, 02_30_57 PM.png";
import wardrobeLinear from "../assests/wardrobe/ChatGPT Image May 7, 2026, 02_32_04 PM.png";
import wardrobePanel from "../assests/wardrobe/ChatGPT Image May 7, 2026, 02_33_16 PM.png";
import wardrobeTall from "../assests/wardrobe/ChatGPT Image May 7, 2026, 02_34_13 PM.png";
import wardrobeSuite from "../assests/wardrobe/ChatGPT Image May 7, 2026, 11_11_06 AM.png";
import livingTvConsole from "../assests/livingroom/ChatGPT Image May 7, 2026, 02_38_03 PM.png";
import livingMediaUnit from "../assests/livingroom/ChatGPT Image May 7, 2026, 02_38_12 PM.png";
import livingCoffeeTable from "../assests/livingroom/ChatGPT Image May 7, 2026, 02_41_09 PM.png";
import livingDisplayConsole from "../assests/livingroom/ChatGPT Image May 7, 2026, 02_43_18 PM.png";
import livingRoundedTable from "../assests/livingroom/ChatGPT Image May 7, 2026, 02_45_23 PM.png";
import livingWallUnit from "../assests/livingroom/ChatGPT Image May 7, 2026, 02_46_13 PM.png";
import plywoodBwp from "../assests/plywoods/bwp.png";
import plywoodCommercial from "../assests/plywoods/commercial_ply.png";
import plywoodMatteLaminate from "../assests/plywoods/matte_laminate.png";
import plywoodWarmIvory from "../assests/plywoods/warm_ivory.png";
import plywoodStoneGrey from "../assests/plywoods/stone_grey.png";
import heroVideoCinematic from "../assests/video/A_second_cinematic_K_fps.mp4";
import heroVideoModularKitchen from "../assests/video/modular_kitchen_cinematic_shotmp_.mp4";
import { kitchenProducts, type KitchenProduct } from "./data/kitchenProducts";

const productFamilies = [
  {
    title: "Modular Kitchens",
    description: "Kitchens, islands, tall units.",
    image: kitchenSignature,
  },
  {
    title: "Wardrobes",
    description: "Sliding and hinged systems.",
    image: wardrobeClassic,
  },
  {
    title: "TV Units",
    description: "Wall panels and media storage.",
    image: livingTvConsole,
  },
  {
    title: "Utility",
    description: "Laundry and service modules.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Pantry Units",
    description: "Tall pull-out storage.",
    image: kitchenTall,
  },
  {
    title: "Island Counters",
    description: "Prep, dining and storage.",
    image: kitchenIsland,
  },
  {
    title: "Cabinet Walls",
    description: "Full-height storage runs.",
    image: kitchenWide,
  },
  {
    title: "Display Storage",
    description: "Glass, laminate and open shelving.",
    image: livingDisplayConsole,
  },
  {
    title: "Living Tables",
    description: "Low consoles and center tables.",
    image: livingCoffeeTable,
  },
  {
    title: "Rounded Tables",
    description: "Soft-edge living storage.",
    image: livingRoundedTable,
  },
  {
    title: "Media Consoles",
    description: "Drawers and device shelves.",
    image: livingMediaUnit,
  },
  {
    title: "Wall TV Units",
    description: "Panel-ready living systems.",
    image: livingWallUnit,
  },
  {
    title: "Wardrobe Walls",
    description: "Full-height bedroom storage.",
    image: wardrobeLinear,
  },
  {
    title: "Dresser Modules",
    description: "Shelves, drawers and niches.",
    image: wardrobePanel,
  },
  {
    title: "Tall Wardrobes",
    description: "Loft and vertical storage.",
    image: wardrobeTall,
  },
  {
    title: "Bedroom Suites",
    description: "Wardrobe with room styling.",
    image: wardrobeSuite,
  },
];

const menuGroups = [
  {
    label: "Products",
    items: ["Kitchens", "Wardrobes", "TV Units", "Storage", "Utility", "Custom Plywood"],
  },
  {
    label: "Spaces",
    items: ["Kitchen", "Bedroom", "Living", "Utility", "Commercial"],
  },
  {
    label: "Materials",
    items: ["BWP Plywood", "Commercial Ply", "Laminate", "Glass", "Hardware"],
  },
  {
    label: "Studio",
    items: ["Projects", "Process", "Design Visit", "Catalogue"],
  },
];

const finishes = [
  {
    label: "BWP plywood",
    color: [0.74, 0.58, 0.39, 1],
    image: plywoodBwp,
  },
  {
    label: "Commercial ply",
    color: [0.62, 0.45, 0.28, 1],
    image: plywoodCommercial,
  },
  {
    label: "Matte laminate",
    color: [0.49, 0.47, 0.41, 1],
    image: plywoodMatteLaminate,
  },
  {
    label: "Warm ivory",
    color: [0.92, 0.82, 0.64, 1],
    image: plywoodWarmIvory,
  },
  {
    label: "Stone grey",
    color: [0.38, 0.38, 0.36, 1],
    image: plywoodStoneGrey,
  },
];

const productColourGroups = [
  {
    group: "Wood Finish Laminates",
    options: [
      { label: "Walnut Brown", swatch: "#6f4a31", color: [0.44, 0.29, 0.19, 1] },
      { label: "Teak Wood", swatch: "#9b6736", color: [0.61, 0.4, 0.21, 1] },
      { label: "Oak Natural", swatch: "#c9a56e", color: [0.79, 0.65, 0.43, 1] },
    ],
  },
  {
    group: "Solid Matte Colours",
    options: [
      { label: "Warm Ivory", swatch: "#eadfc9", color: [0.92, 0.87, 0.79, 1] },
      { label: "Stone Grey", swatch: "#77736b", color: [0.47, 0.45, 0.42, 1] },
      { label: "Arctic White", swatch: "#f7f7f4", color: [0.97, 0.97, 0.96, 1] },
    ],
  },
  {
    group: "High Gloss Colours",
    options: [
      { label: "Pearl White", swatch: "#f4f1e8", color: [0.96, 0.95, 0.91, 1] },
      { label: "Champagne Gold", swatch: "#c8aa6a", color: [0.78, 0.67, 0.42, 1] },
      { label: "Metallic Grey", swatch: "#8f9090", color: [0.56, 0.56, 0.56, 1] },
    ],
  },
  {
    group: "Premium Texture Finishes",
    options: [
      { label: "Concrete Grey", swatch: "#8b8880", color: [0.55, 0.53, 0.5, 1] },
      { label: "Marble White", swatch: "#eeece6", color: [0.93, 0.93, 0.9, 1] },
      { label: "Slate Stone", swatch: "#4d5355", color: [0.3, 0.33, 0.33, 1] },
    ],
  },
  {
    group: "Luxury European Trending Colours",
    options: [
      { label: "Cashmere Beige", swatch: "#c7b8a2", color: [0.78, 0.72, 0.64, 1] },
      { label: "Taupe Grey", swatch: "#8c8177", color: [0.55, 0.51, 0.47, 1] },
      { label: "Mist White", swatch: "#ecebe6", color: [0.93, 0.92, 0.9, 1] },
    ],
  },
];

const productColourOptions = productColourGroups.flatMap((group) =>
  group.options.map((option) => ({ ...option, group: group.group })),
);

type ProductColourOption = (typeof productColourOptions)[number];

type CartItem = {
  id: string;
  productId: string;
  code: string;
  name: string;
  subcategory: string;
  sizeLabel: string;
  variant: string;
  colourLabel: string;
  colourSwatch: string;
  unitPrice: number;
  quantity: number;
};

type CheckoutForm = {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
};

type OrderConfirmation = {
  orderNumber: string;
  total: number;
  itemCount: number;
};

type AppPage = "home" | "kitchen" | "wardrobe" | "living" | "product-detail" | "cart" | "checkout" | "order";

const cartStorageKey = "space-mint-cart";

const emptyCheckoutForm: CheckoutForm = {
  fullName: "",
  phone: "",
  email: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: "",
  paymentMethod: "upi",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);

const getKitchenProductPrice = (product: KitchenProduct) => {
  const baseBySubcategory: Record<string, number> = {
    "Base shutter units": 18500,
    "Corner units": 24500,
    "Drawer units": 21500,
    "Lift-up wall units": 17200,
    "Pull-out storage": 11800,
    "Wall units": 14200,
  };
  const basePrice = baseBySubcategory[product.subcategory] ?? 15500;
  const sizePremium = product.size
    ? Math.round((product.size.width * product.size.height * product.size.depth) / 1000000) * 95
    : 3600;

  return Math.round((basePrice + sizePremium) / 100) * 100;
};

const getStoredCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const storedCart = window.localStorage.getItem(cartStorageKey);
    if (!storedCart) return [];
    const parsedCart = JSON.parse(storedCart);
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
};

const systemDetails = [
  "16 mm BWP plywood core",
  "Water, termite and moisture resistant",
  "Soft-close channels and premium hardware",
  "Factory-built modules with site installation",
];

const steps = [
  { title: "Measure", copy: "Site visit and dimensions." },
  { title: "Compose", copy: "Layout, modules, finishes." },
  { title: "Build", copy: "Factory-made plywood modules." },
  { title: "Install", copy: "Fitting and handover." },
];

const heroSlides = [
  
  {
    eyebrow: "Layouts for every home",
    title: "Kitchens by layout, finish and space.",
    copy: "Straight, L-shaped, parallel, island and tall-unit systems.",
    mediaType: "video",
    media: heroVideoModularKitchen,
    cta: "Explore Layouts",
  },
  {
    eyebrow: "Premium material promise",
    title: "Factory-built. Clean. Durable.",
    copy: "Plywood cores with warm architectural finishes.",
    mediaType: "video",
    media: heroVideoCinematic,
    cta: "Get Free Estimate",
  },
];

const homeSpaceSlides = [
  {
    label: "Living room",
    title: "Living room systems",
    copy: "TV units, wall panels and display storage.",
    image: livingWallUnit,
  },
  {
    label: "Bedroom wardrobes",
    title: "Bedroom wardrobes",
    copy: "Sliding, hinged and full-height wardrobe systems.",
    image: wardrobeClassic,
  },
  {
    label: "Kitchen",
    title: "Kitchen systems",
    copy: "Explore cabinet walls, islands, pantry and utility modules.",
    image: kitchenSignature,
  },
];

const kitchenDesigns = [
  {
    title: "Linear Cabinet Wall",
    layout: "Straight",
    price: "From 2.8L",
    image: kitchenWide,
    description: "A clean wall-to-wall cabinet run with overhead storage, integrated hob zone and tall appliance tower.",
  },
  {
    title: "Island Work Kitchen",
    layout: "Island",
    price: "From 4.6L",
    image: kitchenIsland,
    description: "Island-led planning with breakfast seating, warm under-cabinet light and tall storage on the perimeter.",
  },
  {
    title: "Parallel Utility Kitchen",
    layout: "Parallel",
    price: "From 3.4L",
    image: kitchenParallel,
    description: "Efficient dual-counter planning for compact homes that need heavy storage and clear movement.",
  },
  {
    title: "Compact Apartment Kitchen",
    layout: "L-Shaped",
    price: "From 2.5L",
    image: kitchenCompact,
    description: "A space-saving corner system with easy-reach overheads, drawers and integrated appliance pockets.",
  },
  {
    title: "Tall Storage System",
    layout: "Tall Units",
    price: "From 3.9L",
    image: kitchenTall,
    description: "Full-height pantry, oven and utility columns designed around a plywood modular carcass.",
  },
  {
    title: "Signature Island Suite",
    layout: "Island",
    price: "From 5.2L",
    image: kitchenSignature,
    description: "A premium island composition with symmetrical storage, large prep counter and refined black hardware.",
  },
];

const kitchenCabinetDetails = [
  { title: "Soft-close drawers", copy: "Deep plywood drawer modules for cookware, plates and daily staples." },
  { title: "Overhead shutters", copy: "Slim profile cabinets with concealed lighting and clean horizontal lines." },
  { title: "Tall appliance wall", copy: "Oven, microwave, pantry and refrigerator zones planned as one surface." },
  { title: "Island storage", copy: "Counter-facing drawers and concealed utility volume below the island slab." },
];

const wardrobeDesigns = [
  {
    title: "Classic Hinged Wardrobe",
    layout: "Hinged",
    price: "From 1.9L",
    image: wardrobeClassic,
    description: "Full-wall hinged shutters with open display shelves and integrated drawers.",
  },
  {
    title: "Display Wardrobe",
    layout: "Display",
    price: "From 2.2L",
    image: wardrobeDisplay,
    description: "Wardrobe storage with warm niche lighting, display shelves and dresser volume.",
  },
  {
    title: "Linear Wardrobe Wall",
    layout: "Linear",
    price: "From 2.4L",
    image: wardrobeLinear,
    description: "A clean wall-to-wall wardrobe run with loft storage and slim black handles.",
  },
  {
    title: "Panel Wardrobe System",
    layout: "Panel",
    price: "From 2.6L",
    image: wardrobePanel,
    description: "Minimal vertical panels with concealed storage and bedroom-matched finish.",
  },
  {
    title: "Tall Loft Wardrobe",
    layout: "Tall",
    price: "From 2.8L",
    image: wardrobeTall,
    description: "Floor-to-ceiling wardrobe planning for maximum storage in compact rooms.",
  },
  {
    title: "Bedroom Suite Wardrobe",
    layout: "Suite",
    price: "From 3.1L",
    image: wardrobeSuite,
    description: "Wardrobe, drawers and display zones planned as one bedroom composition.",
  },
];

const wardrobeDetails = [
  { title: "Hinged shutters", copy: "Clean vertical fronts with long black handles." },
  { title: "Open display", copy: "Lit shelves for decor, bags and daily accessories." },
  { title: "Loft storage", copy: "Upper cabinets for seasonal storage." },
  { title: "Drawer stack", copy: "Integrated drawers for folded garments and linens." },
];

const livingDesigns = [
  {
    title: "Floating TV Console",
    layout: "TV Unit",
    price: "From 1.4L",
    image: livingTvConsole,
    description: "Low media console with drawers, soft lighting and clean wall-mounted TV planning.",
  },
  {
    title: "Media Storage Unit",
    layout: "Media",
    price: "From 1.6L",
    image: livingMediaUnit,
    description: "Device shelf, drawers and decor surface planned as one living room unit.",
  },
  {
    title: "Living Table Console",
    layout: "Table",
    price: "From 90K",
    image: livingCoffeeTable,
    description: "Low living table and console storage for books, decor and everyday use.",
  },
  {
    title: "Display Console",
    layout: "Display",
    price: "From 1.2L",
    image: livingDisplayConsole,
    description: "Open shelf and drawer combination with warm display detailing.",
  },
  {
    title: "Rounded Storage Table",
    layout: "Rounded",
    price: "From 1.1L",
    image: livingRoundedTable,
    description: "Soft-edge living storage with drawers, open niche and warm accent lighting.",
  },
  {
    title: "Wall TV System",
    layout: "Wall Unit",
    price: "From 2.1L",
    image: livingWallUnit,
    description: "A complete wall-unit composition for TV, storage and display.",
  },
];

const livingDetails = [
  { title: "TV console drawers", copy: "Wide drawers for remotes, devices and accessories." },
  { title: "Open media shelf", copy: "Device-ready shelf with clean cable planning." },
  { title: "Living table storage", copy: "Low modules for books, decor and daily objects." },
  { title: "Wall unit planning", copy: "Panels, lighting and storage composed as one surface." },
];

const getKitchenProductVariant = (product: KitchenProduct) => {
  if (product.name.includes("3 Drawers")) return "3 Drawer";
  if (product.name.includes("2 Drawers")) return "2 Drawer";
  if (product.name.includes("2 Door")) return "2 Door";
  if (product.name.includes("1 Door")) return "1 Door";
  if (product.name.includes("Bottle Pullout")) return "Bottle Pullout";
  if (product.name.includes("Corner Unit")) return "Corner Unit";
  if (product.name.includes("Up Lift")) return "Lift-up Wall";

  return product.subcategory;
};

const getKitchenProductVariantOptions = (product: KitchenProduct) => {
  if (product.name.includes("Door") || product.subcategory.toLowerCase().includes("shutter")) {
    return ["1 Door", "2 Door"];
  }

  if (product.name.includes("Drawer") || product.subcategory.toLowerCase().includes("drawer")) {
    return ["2 Drawer", "3 Drawer"];
  }

  if (product.subcategory === "Pull-out storage") {
    return ["150mm", "200mm", "300mm"];
  }

  if (product.subcategory === "Corner units") {
    return ["L Shaped", "Left Side", "Right Side"];
  }

  if (product.subcategory === "Lift-up wall units") {
    return ["600mm", "750mm"];
  }

  return [getKitchenProductVariant(product)];
};

const findKitchenVariantProduct = (variant: string, currentProduct: KitchenProduct) => {
  const matchingProducts = kitchenProducts.filter((product) => getKitchenProductVariant(product) === variant);

  if (matchingProducts.length === 0) return null;

  return (
    matchingProducts.find((product) => product.subcategory === currentProduct.subcategory) ??
    matchingProducts.find((product) => product.category === currentProduct.category) ??
    matchingProducts[0]
  );
};

const getKitchenProductInitialOption = (product: KitchenProduct) => {
  const variant = getKitchenProductVariant(product);
  const options = getKitchenProductVariantOptions(product);

  if (options.includes(variant)) return variant;

  const sizeMatch = product.name.match(/(\d{3,4}mm)/i);
  if (sizeMatch && options.includes(sizeMatch[1])) return sizeMatch[1];

  if (product.name.includes("Left")) return "Left Side";
  if (product.name.includes("Right")) return "Right Side";
  if (product.name.includes("L Shaped")) return "L Shaped";

  return options[0];
};

const getProductStageBackground = (colour: ProductColourOption): CSSProperties => {
  const [red, green, blue] = colour.color;
  const r = Math.round(red * 255);
  const g = Math.round(green * 255);
  const b = Math.round(blue * 255);
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  const isLightFinish = luminance > 0.78;
  const isDarkFinish = luminance < 0.34;
  const base = isLightFinish ? "#d8d8d3" : isDarkFinish ? "#f2ecdf" : "#ebe7df";
  const edge = isLightFinish ? "#c8c9c4" : isDarkFinish ? "#fff8ec" : "#f5efe5";
  const tintOpacity = isLightFinish ? 0.08 : isDarkFinish ? 0.1 : 0.22;
  const highlight = isLightFinish ? "rgba(255, 255, 255, 0.52)" : "rgba(255, 255, 255, 0.76)";
  const floorShadow = isLightFinish ? "rgba(0, 0, 0, 0.16)" : "rgba(0, 0, 0, 0.1)";

  return {
    background: `
      radial-gradient(circle at 50% 36%, ${highlight} 0%, rgba(255, 255, 255, 0.28) 30%, transparent 56%),
      radial-gradient(ellipse at 50% 88%, ${floorShadow} 0%, transparent 34%),
      linear-gradient(135deg, rgba(${r}, ${g}, ${b}, ${tintOpacity}) 0%, ${base} 48%, ${edge} 100%)
    `,
  };
};

export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState("Products");
  const [selectedFinish, setSelectedFinish] = useState(finishes[0]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeSpace, setActiveSpace] = useState(0);
  const [activeKitchen, setActiveKitchen] = useState(0);
  const [activeKitchenProductSubcategory, setActiveKitchenProductSubcategory] = useState("All");
  const [allKitchenProductLimit, setAllKitchenProductLimit] = useState(4);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDetailProduct, setActiveDetailProduct] = useState<KitchenProduct | null>(null);
  const [selectedProductVariant, setSelectedProductVariant] = useState("");
  const [selectedProductColour, setSelectedProductColour] = useState(productColourOptions[0]);
  const [activeModelProduct, setActiveModelProduct] = useState<KitchenProduct | null>(null);
  const [activeModelColour, setActiveModelColour] = useState(productColourOptions[0]);
  const [cartItems, setCartItems] = useState<CartItem[]>(getStoredCart);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>(emptyCheckoutForm);
  const [checkoutErrors, setCheckoutErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);
  const [activeWardrobe, setActiveWardrobe] = useState(0);
  const [activeLiving, setActiveLiving] = useState(0);
  const detailModelViewerRef = useRef<HTMLElement | null>(null);
  const modelViewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((slide) => (slide + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSpace((space) => (space + 1) % homeSpaceSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  }, [cartItems]);

  const productRouteMatch = location.pathname.match(/^\/products\/([^/]+)$/);
  const routeProductId = productRouteMatch?.[1] ?? "";
  const currentPage: AppPage =
    productRouteMatch ? "product-detail" :
    location.pathname === "/kitchen" ? "kitchen" :
    location.pathname === "/wardrobe" ? "wardrobe" :
    location.pathname === "/living" ? "living" :
    location.pathname === "/cart" ? "cart" :
    location.pathname === "/checkout" ? "checkout" :
    location.pathname === "/order-confirmation" ? "order" :
    "home";

  useEffect(() => {
    if (currentPage !== "product-detail") {
      setActiveDetailProduct(null);
      return;
    }

    const product = kitchenProducts.find((item) => item.id === routeProductId);
    if (!product) {
      navigate("/kitchen", { replace: true });
      return;
    }

    setActiveDetailProduct(product);
    setSelectedProductColour(productColourOptions[0]);
    setSelectedProductVariant(getKitchenProductInitialOption(product));
  }, [currentPage, navigate, routeProductId]);

  useEffect(() => {
    if (currentPage === "checkout" && !cartItems.length && !isPaymentGatewayOpen) {
      navigate("/cart", { replace: true });
    }

    if (currentPage === "order" && !orderConfirmation) {
      navigate("/", { replace: true });
    }
  }, [cartItems.length, currentPage, isPaymentGatewayOpen, navigate, orderConfirmation]);

  const currentSlide = heroSlides[activeSlide];
  const currentSpace = homeSpaceSlides[activeSpace];
  const currentKitchen = kitchenDesigns[activeKitchen];
  const currentWardrobe = wardrobeDesigns[activeWardrobe];
  const currentLiving = livingDesigns[activeLiving];
  const isCommerceFlowPage =
    currentPage === "product-detail" || currentPage === "cart" || currentPage === "checkout" || currentPage === "order";
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const cartInstallCare = cartSubtotal > 0 ? Math.round(cartSubtotal * 0.05) : 0;
  const cartTotal = cartSubtotal + cartInstallCare;
  const kitchenProductSubcategories = ["All", ...Array.from(new Set(kitchenProducts.map((product) => product.subcategory)))];
  const selectedFinishIndex = Math.max(0, finishes.findIndex((finish) => finish.label === selectedFinish.label));
  const visibleKitchenProducts =
    activeKitchenProductSubcategory === "All"
      ? kitchenProducts
      : kitchenProducts.filter((product) => product.subcategory === activeKitchenProductSubcategory);
  const displayedKitchenProducts =
    activeKitchenProductSubcategory === "All"
      ? visibleKitchenProducts.slice(0, allKitchenProductLimit)
      : visibleKitchenProducts;
  const canToggleKitchenProducts =
    activeKitchenProductSubcategory === "All" && visibleKitchenProducts.length > 4;
  const hasMoreKitchenProducts =
    activeKitchenProductSubcategory === "All" && allKitchenProductLimit < visibleKitchenProducts.length;
  const canShowFewerKitchenProducts =
    activeKitchenProductSubcategory === "All" && allKitchenProductLimit > 4;
  const showMoreKitchenProducts = () => {
    setAllKitchenProductLimit((limit) => Math.min(limit + 4, visibleKitchenProducts.length));
  };
  const showFewerKitchenProducts = () => {
    setAllKitchenProductLimit((limit) => {
      const nextLimit = Math.max(4, limit - 4);
      if (nextLimit === 4) {
        window.setTimeout(() => {
          document.getElementById("kitchen-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      }

      return nextLimit;
    });
  };
  const openProductDetails = (product: KitchenProduct) => {
    setActiveDetailProduct(product);
    setSelectedProductColour(productColourOptions[0]);
    setSelectedProductVariant(getKitchenProductInitialOption(product));
    setIsSearchOpen(false);
    navigate(`/products/${product.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateCart = () => {
    setIsMenuOpen(false);
    setIsMegaMenuOpen(false);
    setIsSearchOpen(false);
    navigate("/cart");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateCheckout = () => {
    if (!cartItems.length) return;
    setCheckoutErrors({});
    setIsMenuOpen(false);
    setIsMegaMenuOpen(false);
    setIsSearchOpen(false);
    navigate("/checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateOrder = () => {
    setIsMenuOpen(false);
    setIsMegaMenuOpen(false);
    setIsSearchOpen(false);
    navigate("/order-confirmation");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addProductToCart = (product: KitchenProduct, variant: string, colour: ProductColourOption) => {
    const itemId = `${product.id}-${variant}-${colour.label}`;

    setCartItems((items) => {
      const existingItem = items.find((item) => item.id === itemId);
      if (existingItem) {
        return items.map((item) =>
          item.id === itemId ? { ...item, quantity: Math.min(item.quantity + 1, 20) } : item,
        );
      }

      return [
        ...items,
        {
          id: itemId,
          productId: product.id,
          code: product.code,
          name: product.name,
          subcategory: product.subcategory,
          sizeLabel: product.size?.label ?? "Size to be confirmed",
          variant,
          colourLabel: colour.label,
          colourSwatch: colour.swatch,
          unitPrice: getKitchenProductPrice(product),
          quantity: 1,
        },
      ];
    });

    navigateCart();
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    setCartItems((items) =>
      items
        .map((item) => (item.id === itemId ? { ...item, quantity: Math.max(0, Math.min(quantity, 20)) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeCartItem = (itemId: string) => {
    setCartItems((items) => items.filter((item) => item.id !== itemId));
  };

  const startCheckout = () => {
    navigateCheckout();
  };

  const updateCheckoutField = (field: keyof CheckoutForm, value: string) => {
    setCheckoutForm((form) => ({ ...form, [field]: value }));
    setCheckoutErrors((errors) => ({ ...errors, [field]: "" }));
  };

  const validateCheckout = () => {
    const errors: Partial<Record<keyof CheckoutForm, string>> = {};

    if (!checkoutForm.fullName.trim()) errors.fullName = "Full name is required.";
    if (!/^[6-9]\d{9}$/.test(checkoutForm.phone.trim())) errors.phone = "Enter a valid 10 digit mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutForm.email.trim())) errors.email = "Enter a valid email address.";
    if (!checkoutForm.addressLine1.trim()) errors.addressLine1 = "Shipping address is required.";
    if (!checkoutForm.city.trim()) errors.city = "City is required.";
    if (!checkoutForm.state.trim()) errors.state = "State is required.";
    if (!/^\d{6}$/.test(checkoutForm.pincode.trim())) errors.pincode = "Enter a valid 6 digit pincode.";
    if (!checkoutForm.paymentMethod) errors.paymentMethod = "Select a payment method.";

    setCheckoutErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const placeOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cartItems.length || !validateCheckout()) return;

    setIsPaymentGatewayOpen(true);
  };

  const completePayment = () => {
    if (!cartItems.length) return;
    const orderNumber = `SM-${Date.now().toString().slice(-8)}`;
    setOrderConfirmation({ itemCount: cartItemCount, orderNumber, total: cartTotal });
    setCartItems([]);
    setCheckoutForm(emptyCheckoutForm);
    setIsPaymentGatewayOpen(false);
    navigateOrder();
  };

  useEffect(() => {
    const modelViewer = detailModelViewerRef.current as HTMLElement & {
      updateComplete?: Promise<unknown>;
      model?: {
        materials?: Array<{
          pbrMetallicRoughness?: {
            setBaseColorFactor?: (color: number[]) => void;
            setMetallicFactor?: (value: number) => void;
            setRoughnessFactor?: (value: number) => void;
          };
        }>;
      };
    };

    if (!modelViewer || !activeDetailProduct?.modelUrl) return;

    let isCancelled = false;

    const applySelectedMaterial = async () => {
      await modelViewer.updateComplete;
      if (isCancelled) return;

      modelViewer.model?.materials?.forEach((material) => {
        material.pbrMetallicRoughness?.setBaseColorFactor?.(selectedProductColour.color);
        material.pbrMetallicRoughness?.setMetallicFactor?.(0);
        material.pbrMetallicRoughness?.setRoughnessFactor?.(0.72);
      });
    };

    const scheduleMaterialUpdate = () => {
      window.requestAnimationFrame(() => {
        void applySelectedMaterial();
        window.setTimeout(() => void applySelectedMaterial(), 120);
      });
    };

    scheduleMaterialUpdate();
    modelViewer.addEventListener("load", scheduleMaterialUpdate);
    modelViewer.addEventListener("model-visibility", scheduleMaterialUpdate);

    return () => {
      isCancelled = true;
      modelViewer.removeEventListener("load", scheduleMaterialUpdate);
      modelViewer.removeEventListener("model-visibility", scheduleMaterialUpdate);
    };
  }, [activeDetailProduct?.modelUrl, selectedProductColour]);

  useEffect(() => {
    const modelViewer = modelViewerRef.current as HTMLElement & {
      updateComplete?: Promise<unknown>;
      model?: {
        materials?: Array<{
          pbrMetallicRoughness?: {
            setBaseColorFactor?: (color: number[]) => void;
            setMetallicFactor?: (value: number) => void;
            setRoughnessFactor?: (value: number) => void;
          };
        }>;
      };
    };

    if (!modelViewer || !activeModelProduct?.modelUrl) return;

    let isCancelled = false;

    const applySelectedMaterial = async () => {
      await modelViewer.updateComplete;
      if (isCancelled) return;

      modelViewer.model?.materials?.forEach((material) => {
        material.pbrMetallicRoughness?.setBaseColorFactor?.(activeModelColour.color);
        material.pbrMetallicRoughness?.setMetallicFactor?.(0);
        material.pbrMetallicRoughness?.setRoughnessFactor?.(0.72);
      });
    };

    const scheduleMaterialUpdate = () => {
      window.requestAnimationFrame(() => {
        void applySelectedMaterial();
        window.setTimeout(() => void applySelectedMaterial(), 120);
      });
    };

    scheduleMaterialUpdate();
    modelViewer.addEventListener("load", scheduleMaterialUpdate);
    modelViewer.addEventListener("model-visibility", scheduleMaterialUpdate);

    return () => {
      isCancelled = true;
      modelViewer.removeEventListener("load", scheduleMaterialUpdate);
      modelViewer.removeEventListener("model-visibility", scheduleMaterialUpdate);
    };
  }, [activeModelProduct?.modelUrl, activeModelColour]);

  const navigateHome = () => {
    setActiveDetailProduct(null);
    setIsMenuOpen(false);
    setIsMegaMenuOpen(false);
    setIsSearchOpen(false);
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateKitchen = () => {
    setActiveDetailProduct(null);
    setIsMenuOpen(false);
    setIsMegaMenuOpen(false);
    setIsSearchOpen(false);
    navigate("/kitchen");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateWardrobe = () => {
    setActiveDetailProduct(null);
    setIsMenuOpen(false);
    setIsMegaMenuOpen(false);
    setIsSearchOpen(false);
    navigate("/wardrobe");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateLiving = () => {
    setActiveDetailProduct(null);
    setIsMenuOpen(false);
    setIsMegaMenuOpen(false);
    setIsSearchOpen(false);
    navigate("/living");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isKitchenMenuItem = (item: string) => item === "Kitchens" || item === "Kitchen";
  const isWardrobeMenuItem = (item: string) => item === "Wardrobes" || item === "Bedroom";
  const isLivingMenuItem = (item: string) => item === "TV Units" || item === "Living" || item === "Storage";
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const staticSearchResults = [
    {
      id: "kitchen-spaces",
      label: "Kitchen cabinet systems",
      meta: "Spaces / kitchens",
      tokens: "kitchen kitchens modular cabinet cabinets layout island straight parallel l shaped",
      onSelect: navigateKitchen,
    },
    {
      id: "wardrobe-spaces",
      label: "Wardrobe systems",
      meta: "Spaces / wardrobes",
      tokens: "wardrobe wardrobes bedroom sliding hinged loft dresser storage",
      onSelect: navigateWardrobe,
    },
    {
      id: "living-spaces",
      label: "TV units and living tables",
      meta: "Spaces / living",
      tokens: "living tv unit units media console wall table storage",
      onSelect: navigateLiving,
    },
    {
      id: "materials",
      label: "Plywood and finishes",
      meta: "Materials",
      tokens: `material materials plywood bwp commercial laminate finish finishes ${finishes.map((finish) => finish.label).join(" ")}`,
      onSelect: () => {
        navigateHome();
        window.setTimeout(() => {
          document.querySelector(".material-story")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      },
    },
    {
      id: "cart",
      label: "Cart",
      meta: `${cartItemCount} selected module${cartItemCount === 1 ? "" : "s"}`,
      tokens: "cart basket selected modules checkout order",
      onSelect: navigateCart,
    },
  ];
  const productSearchResults = kitchenProducts.map((product) => ({
    id: product.id,
    label: product.name,
    meta: `${product.code} / ${product.subcategory}`,
    tokens: `${product.name} ${product.code} ${product.subcategory} ${product.category} ${product.size?.label ?? ""} ${product.specs.summary} ${product.specs.highlights?.join(" ") ?? ""}`,
    onSelect: () => openProductDetails(product),
  }));
  const searchResults = (normalizedSearchQuery
    ? [...staticSearchResults, ...productSearchResults].filter((result) =>
        `${result.label} ${result.meta} ${result.tokens}`.toLowerCase().includes(normalizedSearchQuery),
      )
    : staticSearchResults
  ).slice(0, 8);
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSearchOpen) {
      setIsSearchOpen(true);
      return;
    }

    searchResults[0]?.onSelect();
  };

  const goToPreviousSlide = () => {
    setActiveSlide((slide) => (slide === 0 ? heroSlides.length - 1 : slide - 1));
  };

  const goToNextSlide = () => {
    setActiveSlide((slide) => (slide + 1) % heroSlides.length);
  };

  const goToPreviousFinish = () => {
    setSelectedFinish((finish) => {
      const currentIndex = finishes.findIndex((item) => item.label === finish.label);
      return finishes[(currentIndex - 1 + finishes.length) % finishes.length];
    });
  };

  const goToNextFinish = () => {
    setSelectedFinish((finish) => {
      const currentIndex = finishes.findIndex((item) => item.label === finish.label);
      return finishes[(currentIndex + 1) % finishes.length];
    });
  };

  return (
    <div className="site-shell">
      <header className="site-header" onMouseLeave={() => setIsMegaMenuOpen(false)}>
        <a className="brand-mark" href="#top" aria-label="Space Mint home" onClick={(event) => {
          event.preventDefault();
          navigateHome();
        }} onMouseEnter={() => setIsMegaMenuOpen(false)}>
          <span>Space</span>
          <span>Mint</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {menuGroups.map((group) => (
            <a
              href={`#${group.label.toLowerCase()}`}
              key={group.label}
              className={isMegaMenuOpen && activeMegaMenu === group.label ? "nav-link active" : "nav-link"}
              onMouseEnter={() => {
                setActiveMegaMenu(group.label);
                setIsMegaMenuOpen(true);
              }}
              onFocus={() => {
                setActiveMegaMenu(group.label);
                setIsMegaMenuOpen(true);
              }}
            >
              {group.label}
              <ChevronDown size={14} aria-hidden="true" />
            </a>
          ))}
        </nav>

        <div className="header-actions" onMouseEnter={() => setIsMegaMenuOpen(false)}>
          <div className={isSearchOpen ? "header-search open" : "header-search"}>
            <form onSubmit={submitSearch}>
              <button
                className="icon-button"
                type="button"
                aria-label={isSearchOpen ? "Close search" : "Open search"}
                onClick={() => {
                  setIsSearchOpen((isOpen) => !isOpen);
                  setSearchQuery("");
                }}
              >
                <Search size={18} />
              </button>
              {isSearchOpen ? (
                <input
                  autoFocus
                  aria-label="Search Space Mint"
                  placeholder="Search products, spaces, materials"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              ) : null}
            </form>
            {isSearchOpen ? (
              <div className="search-results" role="listbox" aria-label="Search results">
                {searchResults.length ? (
                  searchResults.map((result) => (
                    <button key={result.id} type="button" onClick={result.onSelect}>
                      <span>{result.meta}</span>
                      {result.label}
                    </button>
                  ))
                ) : (
                  <p>No matches found.</p>
                )}
              </div>
            ) : null}
          </div>
          <button className="cart-button" type="button" onClick={navigateCart} aria-label={`Open cart with ${cartItemCount} items`}>
            <ShoppingBag size={17} />
            <span>Cart</span>
            {cartItemCount > 0 ? <strong>{cartItemCount}</strong> : null}
          </button>
          <button
            className="icon-button mobile-menu-button"
            aria-label="Open menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>

        <div
          className={isMegaMenuOpen ? "mega-menu open" : "mega-menu"}
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          onMouseLeave={() => setIsMegaMenuOpen(false)}
        >
          <div>
            <p className="eyebrow">{activeMegaMenu}</p>
            <h2>{activeMegaMenu}</h2>
          </div>
          <div className="mega-links">
            {menuGroups
              .find((group) => group.label === activeMegaMenu)
              ?.items.map((item) => (
                <a
                  href={
                    isKitchenMenuItem(item)
                      ? "/kitchen"
                      : isWardrobeMenuItem(item)
                        ? "/wardrobe"
                        : isLivingMenuItem(item)
                          ? "/living"
                          : "#systems"
                  }
                  key={item}
                  onClick={(event) => {
                    if (isKitchenMenuItem(item)) {
                      event.preventDefault();
                      navigateKitchen();
                      return;
                    }

                    if (isWardrobeMenuItem(item)) {
                      event.preventDefault();
                      navigateWardrobe();
                      return;
                    }

                    if (isLivingMenuItem(item)) {
                      event.preventDefault();
                      navigateLiving();
                    }
                  }}
                >
                  {item}
                  <ArrowRight size={14} />
                </a>
              ))}
          </div>
          <div className="mega-preview">
            <img
              src="https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=85"
              alt="Minimal modern interior with cabinetry"
            />
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div className="drawer-top">
            <span className="brand-mark compact">
              <span>Space</span>
              <span>Mint</span>
            </span>
            <button className="icon-button inverted" aria-label="Close menu" onClick={() => setIsMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>
          {menuGroups.map((group) => (
            <details key={group.label} open={group.label === "Products"}>
              <summary>
                {group.label}
                <ChevronDown size={16} />
              </summary>
              {group.items.map((item) => (
                <a
                  href={
                    isKitchenMenuItem(item)
                      ? "/kitchen"
                      : isWardrobeMenuItem(item)
                        ? "/wardrobe"
                        : isLivingMenuItem(item)
                          ? "/living"
                          : "#systems"
                  }
                  key={item}
                  onClick={(event) => {
                    if (isKitchenMenuItem(item)) {
                      event.preventDefault();
                      navigateKitchen();
                      return;
                    }

                    if (isWardrobeMenuItem(item)) {
                      event.preventDefault();
                      navigateWardrobe();
                      return;
                    }

                    if (isLivingMenuItem(item)) {
                      event.preventDefault();
                      navigateLiving();
                      return;
                    }

                    setIsMenuOpen(false);
                  }}
                >
                  {item}
                </a>
              ))}
            </details>
          ))}
          <button
            className="drawer-cart-button"
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              navigateCart();
            }}
          >
            <ShoppingBag size={18} />
            Cart
            {cartItemCount > 0 ? <span>{cartItemCount}</span> : null}
          </button>
          <a className="drawer-cta" href="#quote" onClick={() => setIsMenuOpen(false)}>
            Book Design Visit
          </a>
        </div>
      )}

      <main id="top">
        {currentPage === "home" ? (
          <>
            <section className="hero-section">
          <div className="hero-media" key={currentSlide.title}>
            {currentSlide.mediaType === "video" ? (
              <video src={currentSlide.media} autoPlay muted loop playsInline aria-label="Space Mint modular interior video" />
            ) : (
              <img src={currentSlide.media} alt={currentSlide.title} />
            )}
          </div>
          <div className="carousel-controls" aria-label="Hero carousel controls">
            <button type="button" onClick={goToPreviousSlide} aria-label="Previous slide">
              <ChevronLeft size={20} />
            </button>
            <div className="carousel-dots">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  className={activeSlide === index ? "active" : ""}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`}
                />
              ))}
            </div>
            <button type="button" onClick={goToNextSlide} aria-label="Next slide">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="hero-strip">
            <span>Water resistant</span>
            <span>Termite proof</span>
            <span>Factory built</span>
            <span>Custom fitted</span>
          </div>
        </section>

            <section className="home-space-carousel" id="spaces">
              <div className="home-space-media reveal" key={currentSpace.title}>
                <img src={currentSpace.image} alt={currentSpace.title} />
              </div>
              <div className="home-space-content reveal">
                <p className="eyebrow">Spaces</p>
                <h2>{currentSpace.title}</h2>
                <p>{currentSpace.copy}</p>
                <div className="space-selector" aria-label="Home space carousel">
                  {homeSpaceSlides.map((space, index) => (
                    <button
                      key={space.label}
                      className={activeSpace === index ? "active" : ""}
                      type="button"
                      onClick={() => setActiveSpace(index)}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {space.label}
                    </button>
                  ))}
                </div>
                {currentSpace.label === "Kitchen" ? (
                  <button className="text-action" type="button" onClick={navigateKitchen}>
                    Open Kitchen Spaces
                    <ArrowRight size={16} />
                  </button>
                ) : currentSpace.label === "Bedroom wardrobes" ? (
                  <button className="text-action" type="button" onClick={navigateWardrobe}>
                    Open Wardrobe Spaces
                    <ArrowRight size={16} />
                  </button>
                ) : currentSpace.label === "Living room" ? (
                  <button className="text-action" type="button" onClick={navigateLiving}>
                    Open Living Spaces
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <a className="text-action" href="#systems">
                    Explore Systems
                    <ArrowRight size={16} />
                  </a>
                )}
              </div>
            </section>

        <section className="category-band" id="systems">
          <div className="section-heading">
            <p className="eyebrow">Products</p>
            <h2>Explore more systems.</h2>
          </div>
          <div className="category-grid">
            {productFamilies.map((family) => (
              <article className="category-card reveal" key={family.title}>
                <img src={family.image} alt={family.title} />
                <div>
                  <h3>{family.title}</h3>
                  <p>{family.description}</p>
                  {family.title === "Modular Kitchens" ? (
                    <button className="card-link-button" type="button" onClick={navigateKitchen}>
                      View kitchen spaces
                      <ArrowRight size={15} />
                    </button>
                  ) : family.title.includes("Wardrobe") || family.title === "Wardrobes" || family.title === "Bedroom Suites" ? (
                    <button className="card-link-button" type="button" onClick={navigateWardrobe}>
                      View wardrobe spaces
                      <ArrowRight size={15} />
                    </button>
                  ) : family.title === "TV Units" || family.title.includes("Living") || family.title.includes("Console") || family.title.includes("Tables") || family.title === "Display Storage" || family.title === "Wall TV Units" ? (
                    <button className="card-link-button" type="button" onClick={navigateLiving}>
                      View living spaces
                      <ArrowRight size={15} />
                    </button>
                  ) : (
                    <a href="#product">
                      View system
                      <ArrowRight size={15} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="material-story">
          <div className="material-copy reveal">
            <p className="eyebrow">Material</p>
            <h2>Plywood for everyday luxury.</h2>
            <p>
              Strong inside, refined outside: clean modules, durable finishes and easy care.
            </p>
            <div className="metric-row">
              <span>
                <strong>16</strong>
                mm plywood
              </span>
              <span>
                <strong>15+</strong>
                finish options
              </span>
              <span>
                <strong>4</strong>
                week proposal flow
              </span>
            </div>
          </div>
          <div className="finish-panel reveal">
            <div className="finish-carousel">
              <button type="button" aria-label="Previous material" onClick={goToPreviousFinish}>
                <ChevronLeft size={18} />
              </button>
              <div
                className="finish-preview"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.08), rgba(252, 242, 220, 0.18)), url("${selectedFinish.image}")`,
                }}
              >
                <span>{selectedFinish.label}</span>
              </div>
              <button type="button" aria-label="Next material" onClick={goToNextFinish}>
                <ChevronRight size={18} />
              </button>
              <div className="finish-dots" aria-label="Material carousel position">
                {finishes.map((finish, index) => (
                  <button
                    type="button"
                    key={finish.label}
                    className={selectedFinishIndex === index ? "active" : ""}
                    aria-label={`Show ${finish.label}`}
                    onClick={() => setSelectedFinish(finish)}
                  />
                ))}
              </div>
            </div>
            <div className="finish-list" aria-label="Finish options">
              {finishes.map((finish) => (
                <button
                  key={finish.label}
                  className={selectedFinish === finish ? "finish-chip selected" : "finish-chip"}
                  onClick={() => setSelectedFinish(finish)}
                >
                  {finish.label}
                </button>
              ))}
            </div>
          </div>
        </section>
          </>
        ) : currentPage === "kitchen" ? (
          <>
            <section className="kitchen-page-hero">
              <div>
                <button className="back-link" type="button" onClick={navigateHome}>
                  <ChevronLeft size={16} />
                  Back to home
                </button>
                <p className="eyebrow">Kitchen spaces</p>
                <h1>Kitchen cabinet systems.</h1>
                <p>
                  Layouts, cabinet details and estimate-ready modules.
                </p>
              </div>
              <img src={kitchenWide} alt="Space Mint linear modular kitchen" />
            </section>

            <section className="kitchen-section" id="kitchen-spaces">
          <div className="kitchen-intro">
            <div>
              <p className="eyebrow">Kitchen cabinet designs</p>
              <h2>Choose your kitchen layout.</h2>
            </div>
            <p>Browse real cabinet visuals, then request an estimate.</p>
          </div>

          <div className="kitchen-layout-tabs" aria-label="Kitchen layout categories">
            {kitchenDesigns.map((design, index) => (
              <button
                key={design.title}
                className={activeKitchen === index ? "active" : ""}
                onClick={() => setActiveKitchen(index)}
                type="button"
              >
                <span>{design.layout}</span>
                {design.title}
              </button>
            ))}
          </div>

          <div className="kitchen-stage">
            <div className="kitchen-feature reveal" key={currentKitchen.title}>
              <img src={currentKitchen.image} alt={currentKitchen.title} />
              <div className="kitchen-feature-meta">
                <span>{currentKitchen.layout}</span>
                <strong>{currentKitchen.price}</strong>
              </div>
            </div>
            <div className="kitchen-panel reveal">
              <p className="eyebrow">Featured kitchen</p>
              <h3>{currentKitchen.title}</h3>
              <p>{currentKitchen.description}</p>
              <div className="kitchen-spec-grid">
                <span>16 mm plywood carcass</span>
                <span>Stone-ready counter</span>
                <span>Soft-close hardware</span>
                <span>Factory-fitted modules</span>
              </div>
              <div className="kitchen-panel-actions">
                <a className="primary-action dark" href="#quote">
                  Get Free Estimate
                  <ArrowRight size={18} />
                </a>
                <a className="secondary-action dark" href="#process">
                  How it works
                </a>
              </div>
            </div>
          </div>

          <div className="cabinet-detail-grid">
            {kitchenCabinetDetails.map((detail, index) => (
              <article className="cabinet-detail-card reveal" key={detail.title}>
                <img
                  src={[kitchenLinear, kitchenSoft, kitchenUrban, kitchenGallery][index]}
                  alt={detail.title}
                />
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{detail.title}</h3>
                  <p>{detail.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="kitchen-catalog-section" id="kitchen-products">
          <div className="catalog-heading">
            <div>
              <p className="eyebrow">Kitchen product catalogue</p>
              <h2>Kitchen modules.</h2>
            </div>
            <p>20 modules with size, code, material specs and 3D model slots.</p>
          </div>

          <div className="catalog-filters" aria-label="Kitchen product filters">
            {kitchenProductSubcategories.map((subcategory) => (
              <button
                key={subcategory}
                className={activeKitchenProductSubcategory === subcategory ? "active" : ""}
                type="button"
                onClick={() => {
                  setActiveKitchenProductSubcategory(subcategory);
                  setAllKitchenProductLimit(4);
                }}
              >
                {subcategory}
              </button>
            ))}
          </div>

          <div className="kitchen-product-grid">
            {displayedKitchenProducts.map((product) => (
              <article
                className="kitchen-product-card"
                key={product.id}
                role="button"
                tabIndex={0}
                onClick={() => openProductDetails(product)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openProductDetails(product);
                  }
                }}
              >
                <div className="product-card-model" aria-hidden="true">
                  {product.modelUrl ? (
                    <model-viewer
                      src={product.modelUrl}
                      alt={`${product.name} 3D modular unit`}
                      auto-rotate="true"
                      camera-orbit="35deg 62deg auto"
                      environment-image="neutral"
                      exposure="1"
                      field-of-view="30deg"
                      loading="lazy"
                      reveal="auto"
                      shadow-intensity="0.78"
                      shadow-softness="0.84"
                    />
                  ) : (
                    <div className="product-card-model-placeholder">
                      <span>3D model pending</span>
                    </div>
                  )}
                </div>
                <div className="product-card-details">
                  <div className="product-card-topline">
                    <span>{String(product.serialNumber).padStart(2, "0")}</span>
                    <strong>{product.code}</strong>
                  </div>
                  <div className="product-price-line">{formatCurrency(getKitchenProductPrice(product))}</div>
                  <h3>{product.name}</h3>
                  <p>{product.specs.summary}</p>
                  <div className="product-meta-grid">
                    <span>
                      <small>Subcategory</small>
                      {product.subcategory}
                    </span>
                    <span>
                      <small>Size</small>
                      {product.size?.label ?? "To be confirmed"}
                    </span>
                  </div>
                  <div className="product-highlights">
                    {(product.specs.highlights ?? product.specs.hardware).slice(0, 3).map((highlight) => (
                      <span key={highlight}>{highlight}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {canToggleKitchenProducts ? (
            <div className="catalog-more">
              {canShowFewerKitchenProducts ? (
                <button type="button" onClick={showFewerKitchenProducts}>
                  <ChevronLeft size={18} />
                  View less
                </button>
              ) : null}
              {hasMoreKitchenProducts ? (
                <button type="button" onClick={showMoreKitchenProducts}>
                  View more
                  <ArrowRight size={18} />
                </button>
              ) : null}
              <span>
                Showing {displayedKitchenProducts.length} of {visibleKitchenProducts.length}
              </span>
            </div>
          ) : null}
        </section>

        <section className="product-section" id="product">
          <div className="product-gallery reveal">
            <img
              className="main-product-image"
              src={kitchenIsland}
              alt="Premium kitchen with island and modular cabinetry"
            />
            <div className="thumb-grid">
              <img
                src={kitchenTall}
                alt="Kitchen cabinet detail"
              />
              <img
                src={kitchenLinear}
                alt="Interior storage detail"
              />
            </div>
          </div>
          <div className="product-copy reveal">
            <p className="eyebrow">Featured system</p>
            <h2>Astra Plywood Kitchen System</h2>
            <p>
              Gallery, specs and consultation in one place.
            </p>
            <div className="spec-list">
              {systemDetails.map((detail) => (
                <span key={detail}>
                  <Check size={16} />
                  {detail}
                </span>
              ))}
            </div>
            <div className="config-panel">
              <div>
                <SlidersHorizontal size={18} />
                <span>Configuration</span>
              </div>
              <p>Island, tall pantry, appliance tower, under-counter drawers, overhead shutters.</p>
            </div>
            <div className="product-actions">
              <a className="primary-action dark" href="#quote">
                Request Quote
                <ArrowRight size={18} />
              </a>
              <a className="secondary-action dark" href="#process">
                View Process
              </a>
            </div>
          </div>
        </section>
          </>
        ) : currentPage === "wardrobe" ? (
          <>
            <section className="kitchen-page-hero wardrobe-page-hero">
              <div>
                <button className="back-link" type="button" onClick={navigateHome}>
                  <ChevronLeft size={16} />
                  Back to home
                </button>
                <p className="eyebrow">Wardrobe spaces</p>
                <h1>Wardrobe systems.</h1>
                <p>Hinged, display, loft and full-wall bedroom storage.</p>
              </div>
              <img src={wardrobeClassic} alt="Space Mint bedroom wardrobe system" />
            </section>

            <section className="kitchen-section wardrobe-section" id="wardrobe-spaces">
              <div className="kitchen-intro">
                <div>
                  <p className="eyebrow">Wardrobe designs</p>
                  <h2>Choose your wardrobe style.</h2>
                </div>
                <p>Browse wardrobe systems, then request an estimate.</p>
              </div>

              <div className="kitchen-layout-tabs" aria-label="Wardrobe layout categories">
                {wardrobeDesigns.map((design, index) => (
                  <button
                    key={design.title}
                    className={activeWardrobe === index ? "active" : ""}
                    onClick={() => setActiveWardrobe(index)}
                    type="button"
                  >
                    <span>{design.layout}</span>
                    {design.title}
                  </button>
                ))}
              </div>

              <div className="kitchen-stage">
                <div className="kitchen-feature reveal" key={currentWardrobe.title}>
                  <img src={currentWardrobe.image} alt={currentWardrobe.title} />
                  <div className="kitchen-feature-meta">
                    <span>{currentWardrobe.layout}</span>
                    <strong>{currentWardrobe.price}</strong>
                  </div>
                </div>
                <div className="kitchen-panel reveal">
                  <p className="eyebrow">Featured wardrobe</p>
                  <h3>{currentWardrobe.title}</h3>
                  <p>{currentWardrobe.description}</p>
                  <div className="kitchen-spec-grid">
                    <span>Plywood frame</span>
                    <span>Loft storage</span>
                    <span>Soft-close fittings</span>
                    <span>Custom internals</span>
                  </div>
                  <div className="kitchen-panel-actions">
                    <a className="primary-action dark" href="#quote">
                      Get Free Estimate
                      <ArrowRight size={18} />
                    </a>
                    <a className="secondary-action dark" href="#process">
                      How it works
                    </a>
                  </div>
                </div>
              </div>

              <div className="cabinet-detail-grid">
                {wardrobeDetails.map((detail, index) => (
                  <article className="cabinet-detail-card reveal" key={detail.title}>
                    <img
                      src={[wardrobeDisplay, wardrobeLinear, wardrobeTall, wardrobeSuite][index]}
                      alt={detail.title}
                    />
                    <div>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <h3>{detail.title}</h3>
                      <p>{detail.copy}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : currentPage === "living" ? (
          <>
            <section className="kitchen-page-hero living-page-hero">
              <div>
                <button className="back-link" type="button" onClick={navigateHome}>
                  <ChevronLeft size={16} />
                  Back to home
                </button>
                <p className="eyebrow">Living room spaces</p>
                <h1>TV units and living tables.</h1>
                <p>Media consoles, wall units, tables and storage systems.</p>
              </div>
              <img src={livingWallUnit} alt="Space Mint living room TV unit" />
            </section>

            <section className="kitchen-section living-section" id="living-spaces">
              <div className="kitchen-intro">
                <div>
                  <p className="eyebrow">Living room designs</p>
                  <h2>Choose your living system.</h2>
                </div>
                <p>Browse TV units, tables and wall storage.</p>
              </div>

              <div className="kitchen-layout-tabs" aria-label="Living room categories">
                {livingDesigns.map((design, index) => (
                  <button
                    key={design.title}
                    className={activeLiving === index ? "active" : ""}
                    onClick={() => setActiveLiving(index)}
                    type="button"
                  >
                    <span>{design.layout}</span>
                    {design.title}
                  </button>
                ))}
              </div>

              <div className="kitchen-stage">
                <div className="kitchen-feature reveal" key={currentLiving.title}>
                  <img src={currentLiving.image} alt={currentLiving.title} />
                  <div className="kitchen-feature-meta">
                    <span>{currentLiving.layout}</span>
                    <strong>{currentLiving.price}</strong>
                  </div>
                </div>
                <div className="kitchen-panel reveal">
                  <p className="eyebrow">Featured living system</p>
                  <h3>{currentLiving.title}</h3>
                  <p>{currentLiving.description}</p>
                  <div className="kitchen-spec-grid">
                    <span>Media-ready storage</span>
                    <span>Drawer modules</span>
                    <span>Soft-close fittings</span>
                    <span>Custom finishes</span>
                  </div>
                  <div className="kitchen-panel-actions">
                    <a className="primary-action dark" href="#quote">
                      Get Free Estimate
                      <ArrowRight size={18} />
                    </a>
                    <a className="secondary-action dark" href="#process">
                      How it works
                    </a>
                  </div>
                </div>
              </div>

              <div className="cabinet-detail-grid">
                {livingDetails.map((detail, index) => (
                  <article className="cabinet-detail-card reveal" key={detail.title}>
                    <img
                      src={[livingTvConsole, livingMediaUnit, livingCoffeeTable, livingDisplayConsole][index]}
                      alt={detail.title}
                    />
                    <div>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <h3>{detail.title}</h3>
                      <p>{detail.copy}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {!isCommerceFlowPage ? (
          <>
            <section className="process-section" id="process">
              <div className="section-heading">
                <p className="eyebrow">Design flow</p>
                <h2>Simple process.</h2>
              </div>
              <div className="process-grid">
                {steps.map((step, index) => (
                  <article className="process-card reveal" key={step.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="quote-section" id="quote">
              <div>
                <p className="eyebrow">Start a project</p>
                <h2>Book a Space Mint design consultation.</h2>
                <p>
                  Share your space. We will plan the next step.
                </p>
              </div>
              <form className="quote-form">
                <label>
                  Space type
                  <select>
                    <option>Modular kitchen</option>
                    <option>Wardrobe system</option>
                    <option>Living storage</option>
                    <option>Utility module</option>
                  </select>
                </label>
                <label>
                  Mobile number
                  <input placeholder="+91 98765 43210" type="tel" />
                </label>
                <button type="button">
                  Request callback
                  <ArrowRight size={18} />
                </button>
              </form>
            </section>
          </>
        ) : null}
      </main>

      {currentPage === "product-detail" && activeDetailProduct ? (
        <section className="page-flow product-detail-page" aria-label={`${activeDetailProduct.name} details`}>
          <div className="product-detail-panel">
            <div className="product-detail-header">
              <div className="product-detail-title">
                <span>{activeDetailProduct.code}</span>
                <h3>{activeDetailProduct.name}</h3>
                <p>
                  {activeDetailProduct.subcategory} / {activeDetailProduct.size?.label ?? "Size to be confirmed"}
                </p>
              </div>
              <button type="button" onClick={navigateKitchen}>
                <ChevronLeft size={16} />
                Back to catalogue
              </button>
            </div>

            <div className="product-detail-body">
              <div
                className="product-detail-model-stage"
                style={getProductStageBackground(selectedProductColour)}
              >
                {activeDetailProduct.modelUrl ? (
                  <model-viewer
                    ref={detailModelViewerRef}
                    src={activeDetailProduct.modelUrl}
                    alt={`${activeDetailProduct.name} 3D modular unit`}
                    auto-rotate="true"
                    camera-controls="true"
                    camera-orbit="45deg 58deg auto"
                    environment-image="neutral"
                    exposure="1"
                    field-of-view="28deg"
                    loading="eager"
                    reveal="auto"
                    shadow-intensity="0.9"
                    shadow-softness="0.82"
                  />
                ) : (
                  <div className="model-placeholder">
                    <span>3D model pending</span>
                  </div>
                )}
                <div className="model-stage-label">
                  <span>Space Mint module</span>
                  <strong>{activeDetailProduct.code}</strong>
                </div>
                <div className="product-model-badges">
                  <span>{selectedProductVariant}</span>
                  <span>{selectedProductColour.label}</span>
                </div>
                <div
                  className="selected-material-swatch"
                  style={{
                    background: selectedProductColour.swatch,
                  }}
                />
              </div>

              <div className="product-detail-copy">
                <div className="detail-summary-card">
                  <p className="eyebrow">Module snapshot</p>
                  <h2>{activeDetailProduct.name}</h2>
                  <p>{activeDetailProduct.specs.summary}</p>
                  <div className="detail-status-row">
                    <span>Plywood core</span>
                    <span>{activeDetailProduct.modelUrl ? "3D ready" : "3D pending"}</span>
                    <span>Quote ready</span>
                  </div>
                </div>

                <div className="product-detail-meta">
                  <span>
                    <small>Code</small>
                    {activeDetailProduct.code}
                  </span>
                  <span>
                    <small>Size</small>
                    {activeDetailProduct.size?.label ?? "To be confirmed"}
                  </span>
                  <span>
                    <small>Category</small>
                    {activeDetailProduct.subcategory}
                  </span>
                  <span>
                    <small>Unit price</small>
                    {formatCurrency(getKitchenProductPrice(activeDetailProduct))}
                  </span>
                </div>

                <div className="variant-section">
                  <h4>Choose a Variant</h4>
                  <div className="variant-grid">
                    {getKitchenProductVariantOptions(activeDetailProduct).map((variant) => {
                      const variantProduct = findKitchenVariantProduct(variant, activeDetailProduct);

                      return (
                        <button
                          key={variant}
                          type="button"
                          className={selectedProductVariant === variant ? "active" : ""}
                          disabled={!variantProduct}
                          onClick={() => {
                            if (!variantProduct) return;
                            setActiveDetailProduct(variantProduct);
                            setSelectedProductVariant(variant);
                          }}
                        >
                          {variant}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="variant-section">
                  <h4>Manufacturing Material</h4>
                  <div className="manufacturing-grid">
                    <span>
                      <small>Core material</small>
                      {activeDetailProduct.specs.coreMaterial ?? "Core material to be confirmed"}
                    </span>
                    <span>
                      <small>Finish</small>
                      {activeDetailProduct.specs.finish ?? "Finish to be confirmed"}
                    </span>
                  </div>
                </div>

                <div className="variant-section">
                  <h4>Choose Colour Finish</h4>
                  <div className="colour-group-list">
                    {productColourGroups.map((group) => (
                      <div className="colour-group" key={group.group}>
                        <h5>{group.group}</h5>
                        <div className="colour-option-grid">
                          {group.options.map((colour) => (
                            <button
                              key={colour.label}
                              type="button"
                              className={selectedProductColour.label === colour.label ? "active" : ""}
                              onClick={() => setSelectedProductColour({ ...colour, group: group.group })}
                            >
                              <span style={{ background: colour.swatch }} />
                              {colour.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="selected-config-panel">
                  <span>Selected configuration</span>
                  <strong>{selectedProductVariant} / {selectedProductColour.label}</strong>
                  <p>{activeDetailProduct.size?.label ?? "Size to be confirmed"}</p>
                </div>

                <div className="variant-section">
                  <h4>Specifications</h4>
                  <div className="detail-spec-list">
                    <span>{activeDetailProduct.specs.coreMaterial ?? "Core material to be confirmed"}</span>
                    <span>{activeDetailProduct.specs.finish ?? "Finish to be confirmed"}</span>
                    {(activeDetailProduct.specs.highlights ?? activeDetailProduct.specs.hardware).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>

                <div className="detail-actions">
                  <button
                    className="primary-action dark"
                    type="button"
                    onClick={() => addProductToCart(activeDetailProduct, selectedProductVariant, selectedProductColour)}
                  >
                    Add to Cart
                    <ArrowRight size={18} />
                  </button>
                  {activeDetailProduct.modelUrl ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModelColour(selectedProductColour);
                        setActiveModelProduct(activeDetailProduct);
                      }}
                    >
                      View 3D
                    </button>
                  ) : null}
                  <a className="secondary-action light" href="#quote" onClick={(event) => {
                    event.preventDefault();
                    setActiveDetailProduct(null);
                    navigateHome();
                    window.setTimeout(() => {
                      document.getElementById("quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 0);
                  }}>
                    Request Quote
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {currentPage === "cart" ? (
        <section className="page-flow commerce-page cart-page" aria-label="Shopping cart">
          <div className="commerce-panel cart-panel">
            <div className="commerce-header">
              <div>
                <span>Cart</span>
                <h3>Your selected modules</h3>
              </div>
              <button type="button" onClick={navigateKitchen}>
                <ChevronLeft size={16} />
                Continue browsing
              </button>
            </div>

            <div className="cart-content">
              {cartItems.length ? (
                <>
                  <div className="cart-item-list">
                    {cartItems.map((item) => (
                      <article className="cart-item" key={item.id}>
                        <div className="cart-item-swatch" style={{ background: item.colourSwatch }} />
                        <div>
                          <span>{item.code}</span>
                          <h4>{item.name}</h4>
                          <p>
                            {item.variant} / {item.colourLabel} / {item.sizeLabel}
                          </p>
                          <strong>{formatCurrency(item.unitPrice)}</strong>
                        </div>
                        <div className="quantity-control" aria-label={`${item.name} quantity`}>
                          <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>
                            -
                          </button>
                          <input
                            aria-label="Quantity"
                            min="1"
                            max="20"
                            type="number"
                            value={item.quantity}
                            onChange={(event) => updateCartQuantity(item.id, Number(event.target.value))}
                          />
                          <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>
                            +
                          </button>
                        </div>
                        <button className="remove-item" type="button" onClick={() => removeCartItem(item.id)}>
                          Remove
                        </button>
                        <strong className="line-total">{formatCurrency(item.unitPrice * item.quantity)}</strong>
                      </article>
                    ))}
                  </div>

                  <aside className="cart-summary">
                    <h4>Order summary</h4>
                    <p>
                      <span>Items</span>
                      <strong>{cartItemCount}</strong>
                    </p>
                    <p>
                      <span>Subtotal</span>
                      <strong>{formatCurrency(cartSubtotal)}</strong>
                    </p>
                    <p>
                      <span>Installation care</span>
                      <strong>{formatCurrency(cartInstallCare)}</strong>
                    </p>
                    <p className="cart-total">
                      <span>Total</span>
                      <strong>{formatCurrency(cartTotal)}</strong>
                    </p>
                    <button type="button" onClick={startCheckout}>
                      Proceed to Checkout
                      <ArrowRight size={18} />
                    </button>
                  </aside>
                </>
              ) : (
                <div className="empty-cart">
                  <ShoppingBag size={30} />
                  <h4>Your cart is empty.</h4>
                  <p>Open a kitchen module and add a variant to begin checkout.</p>
                    <button type="button" onClick={navigateKitchen}>
                    Continue browsing
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {currentPage === "checkout" ? (
        <section className="page-flow commerce-page checkout-page" aria-label="Checkout">
          <form className="commerce-panel checkout-panel" onSubmit={placeOrder}>
            <div className="commerce-header">
              <div>
                <span>Checkout</span>
                <h3>Complete your order</h3>
              </div>
              <button type="button" onClick={navigateCart}>
                <ChevronLeft size={16} />
                Back to cart
              </button>
            </div>

            <div className="checkout-layout">
              <div className="checkout-form-sections">
                <section className="checkout-section">
                  <h4>Customer details</h4>
                  <label>
                    Full name
                    <input value={checkoutForm.fullName} onChange={(event) => updateCheckoutField("fullName", event.target.value)} />
                    {checkoutErrors.fullName ? <small>{checkoutErrors.fullName}</small> : null}
                  </label>
                  <label>
                    Mobile number
                    <input value={checkoutForm.phone} onChange={(event) => updateCheckoutField("phone", event.target.value)} />
                    {checkoutErrors.phone ? <small>{checkoutErrors.phone}</small> : null}
                  </label>
                  <label>
                    Email
                    <input value={checkoutForm.email} onChange={(event) => updateCheckoutField("email", event.target.value)} />
                    {checkoutErrors.email ? <small>{checkoutErrors.email}</small> : null}
                  </label>
                </section>

                <section className="checkout-section">
                  <h4>Shipping address</h4>
                  <label className="wide-field">
                    Address
                    <input value={checkoutForm.addressLine1} onChange={(event) => updateCheckoutField("addressLine1", event.target.value)} />
                    {checkoutErrors.addressLine1 ? <small>{checkoutErrors.addressLine1}</small> : null}
                  </label>
                  <label>
                    City
                    <input value={checkoutForm.city} onChange={(event) => updateCheckoutField("city", event.target.value)} />
                    {checkoutErrors.city ? <small>{checkoutErrors.city}</small> : null}
                  </label>
                  <label>
                    State
                    <input value={checkoutForm.state} onChange={(event) => updateCheckoutField("state", event.target.value)} />
                    {checkoutErrors.state ? <small>{checkoutErrors.state}</small> : null}
                  </label>
                  <label>
                    Pincode
                    <input value={checkoutForm.pincode} onChange={(event) => updateCheckoutField("pincode", event.target.value)} />
                    {checkoutErrors.pincode ? <small>{checkoutErrors.pincode}</small> : null}
                  </label>
                </section>

                <section className="checkout-section payment-section">
                  <h4>Payment step</h4>
                  {["upi", "card", "pay-on-visit"].map((method) => (
                    <button
                      className={checkoutForm.paymentMethod === method ? "active" : ""}
                      key={method}
                      type="button"
                      onClick={() => updateCheckoutField("paymentMethod", method)}
                    >
                      {method === "upi" ? "UPI" : method === "card" ? "Credit / Debit Card" : "Pay after design visit"}
                    </button>
                  ))}
                  {checkoutErrors.paymentMethod ? <small>{checkoutErrors.paymentMethod}</small> : null}
                </section>
              </div>

              <aside className="checkout-summary">
                <h4>Order summary</h4>
                <div className="checkout-items">
                  {cartItems.map((item) => (
                    <p key={item.id}>
                      <span>
                        {item.name}
                        <small>
                          {item.quantity} x {item.colourLabel}
                        </small>
                      </span>
                      <strong>{formatCurrency(item.unitPrice * item.quantity)}</strong>
                    </p>
                  ))}
                </div>
                <div className="summary-lines">
                  <p>
                    <span>Subtotal</span>
                    <strong>{formatCurrency(cartSubtotal)}</strong>
                  </p>
                  <p>
                    <span>Installation care</span>
                    <strong>{formatCurrency(cartInstallCare)}</strong>
                  </p>
                  <p className="cart-total">
                    <span>Total</span>
                    <strong>{formatCurrency(cartTotal)}</strong>
                  </p>
                </div>
                <button type="submit">Place Order</button>
              </aside>
            </div>
          </form>
        </section>
      ) : null}

      {currentPage === "order" && orderConfirmation ? (
        <section className="page-flow commerce-page order-page" aria-label="Order confirmation">
          <div className="commerce-panel confirmation-panel">
            <button type="button" onClick={navigateHome}>
              <ChevronLeft size={16} />
              Home
            </button>
            <Check size={34} />
            <span>Order confirmed</span>
            <h3>{orderConfirmation.orderNumber}</h3>
            <p>
              Your order for {orderConfirmation.itemCount} module{orderConfirmation.itemCount === 1 ? "" : "s"} has been placed.
            </p>
            <strong>{formatCurrency(orderConfirmation.total)}</strong>
            <button type="button" onClick={navigateKitchen}>
              Continue browsing
            </button>
          </div>
        </section>
      ) : null}

      {isPaymentGatewayOpen ? (
        <div className="payment-gateway-modal" role="dialog" aria-modal="true" aria-label="Payment gateway">
          <div className="payment-gateway-backdrop" onClick={() => setIsPaymentGatewayOpen(false)} />
          <div className="payment-gateway-panel">
            <div className="payment-gateway-header">
              <div>
                <span>Secure payment</span>
                <h3>Space Mint Checkout</h3>
              </div>
              <button type="button" aria-label="Close payment gateway" onClick={() => setIsPaymentGatewayOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="payment-gateway-body">
              <div className="payment-method-card">
                <span>Payment method</span>
                <strong>
                  {checkoutForm.paymentMethod === "upi"
                    ? "UPI"
                    : checkoutForm.paymentMethod === "card"
                      ? "Credit / Debit Card"
                      : "Pay after design visit"}
                </strong>
                <p>{checkoutForm.fullName} / {checkoutForm.phone}</p>
              </div>
              <div className="payment-total-card">
                <span>Total payable</span>
                <strong>{formatCurrency(cartTotal)}</strong>
                <p>Includes installation care and selected module total.</p>
              </div>
              {checkoutForm.paymentMethod === "upi" ? (
                <label>
                  UPI ID
                  <input placeholder="name@bank" />
                </label>
              ) : checkoutForm.paymentMethod === "card" ? (
                <div className="gateway-card-fields">
                  <label>
                    Card number
                    <input inputMode="numeric" placeholder="1234 5678 9012 3456" />
                  </label>
                  <label>
                    Expiry
                    <input placeholder="MM/YY" />
                  </label>
                  <label>
                    CVV
                    <input inputMode="numeric" placeholder="123" />
                  </label>
                </div>
              ) : (
                <p className="gateway-note">Your order will be placed now and payment will be collected after the design visit.</p>
              )}
            </div>
            <div className="payment-gateway-actions">
              <button type="button" onClick={() => setIsPaymentGatewayOpen(false)}>
                Cancel
              </button>
              <button type="button" onClick={completePayment}>
                {checkoutForm.paymentMethod === "pay-on-visit" ? "Confirm Order" : `Pay ${formatCurrency(cartTotal)}`}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {activeModelProduct?.modelUrl ? (
        <div className="model-modal" role="dialog" aria-modal="true" aria-label={`${activeModelProduct.name} 3D model`}>
          <div className="model-modal-backdrop" onClick={() => setActiveModelProduct(null)} />
          <div className="model-modal-panel">
            <div className="model-modal-header">
              <div>
                <span>{activeModelProduct.code}</span>
                <h3>{activeModelProduct.name}</h3>
              </div>
              <button type="button" aria-label="Close 3D model" onClick={() => setActiveModelProduct(null)}>
                <X size={20} />
              </button>
            </div>
            <model-viewer
              ref={modelViewerRef}
              src={activeModelProduct.modelUrl}
              alt={`${activeModelProduct.name} 3D modular unit`}
              auto-rotate="true"
              camera-controls="true"
              camera-orbit="45deg 58deg auto"
              environment-image="neutral"
              exposure="1"
              field-of-view="28deg"
              loading="eager"
              reveal="auto"
              shadow-intensity="0.9"
              shadow-softness="0.82"
            />
            <div className="model-modal-footer">
              <span>{activeModelProduct.size?.label ?? "Size to be confirmed"}</span>
              <span>{activeModelColour.label}</span>
              <span>{activeModelProduct.subcategory}</span>
            </div>
          </div>
        </div>
      ) : null}

      <aside className="bottom-actions" aria-label="Quick actions">
        <a href="#systems">
          <Grid3X3 size={18} />
          Explore
        </a>
        <a href="#quote">
          <Ruler size={18} />
          Quote
        </a>
        <a href="tel:+910000000000">
          <Phone size={18} />
          Call
        </a>
        <a href="#quote">
          <MessageCircle size={18} />
          Chat
        </a>
      </aside>

      <footer className="site-footer">
        <span>Space Mint</span>
        <p>Premium plywood modular interiors for kitchens, wardrobes and living spaces.</p>
        <div>
          <a href="#systems">
            <ShoppingBag size={16} />
            Systems
          </a>
          <a href="#quote">
            <Sparkles size={16} />
            Consultation
          </a>
        </div>
      </footer>
    </div>
  );
}
