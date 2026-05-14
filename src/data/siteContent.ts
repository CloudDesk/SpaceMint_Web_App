import kitchenWide from "../../assests/kitchen/ChatGPT Image May 6, 2026, 01_07_06 PM.png";
import kitchenIsland from "../../assests/kitchen/ChatGPT Image May 6, 2026, 02_04_55 PM.png";
import kitchenParallel from "../../assests/kitchen/ChatGPT Image May 6, 2026, 02_06_55 PM.png";
import kitchenCompact from "../../assests/kitchen/ChatGPT Image May 6, 2026, 04_16_03 PM.png";
import kitchenTall from "../../assests/kitchen/ChatGPT Image May 6, 2026, 04_30_09 PM.png";
import kitchenSignature from "../../assests/kitchen/ChatGPT Image May 6, 2026, 04_32_07 PM.png";
import kitchenLinear from "../../assests/kitchen/ChatGPT Image May 6, 2026, 12_50_29 PM.png";
import kitchenSoft from "../../assests/kitchen/ChatGPT Image May 6, 2026, 12_54_02 PM.png";
import kitchenUrban from "../../assests/kitchen/ChatGPT Image May 6, 2026, 12_55_28 PM.png";
import kitchenGallery from "../../assests/kitchen/ChatGPT Image May 6, 2026, 12_56_38 PM.png";
import wardrobeClassic from "../../assests/wardrobe/ChatGPT Image May 7, 2026, 02_29_59 PM.png";
import wardrobeDisplay from "../../assests/wardrobe/ChatGPT Image May 7, 2026, 02_30_57 PM.png";
import wardrobeLinear from "../../assests/wardrobe/ChatGPT Image May 7, 2026, 02_32_04 PM.png";
import wardrobePanel from "../../assests/wardrobe/ChatGPT Image May 7, 2026, 02_33_16 PM.png";
import wardrobeTall from "../../assests/wardrobe/ChatGPT Image May 7, 2026, 02_34_13 PM.png";
import wardrobeSuite from "../../assests/wardrobe/ChatGPT Image May 7, 2026, 11_11_06 AM.png";
import livingTvConsole from "../../assests/livingroom/ChatGPT Image May 7, 2026, 02_38_03 PM.png";
import livingMediaUnit from "../../assests/livingroom/ChatGPT Image May 7, 2026, 02_38_12 PM.png";
import livingCoffeeTable from "../../assests/livingroom/ChatGPT Image May 7, 2026, 02_41_09 PM.png";
import livingDisplayConsole from "../../assests/livingroom/ChatGPT Image May 7, 2026, 02_43_18 PM.png";
import livingRoundedTable from "../../assests/livingroom/ChatGPT Image May 7, 2026, 02_45_23 PM.png";
import livingWallUnit from "../../assests/livingroom/ChatGPT Image May 7, 2026, 02_46_13 PM.png";
import plywoodBwp from "../../assests/plywoods/bwp.png";
import plywoodCommercial from "../../assests/plywoods/commercial_ply.png";
import plywoodMatteLaminate from "../../assests/plywoods/matte_laminate.png";
import plywoodWarmIvory from "../../assests/plywoods/warm_ivory.png";
import plywoodStoneGrey from "../../assests/plywoods/stone_grey.png";
import heroVideoCinematic from "../../assests/video/A_second_cinematic_K_fps.mp4";
import heroVideoModularKitchen from "../../assests/video/modular_kitchen_cinematic_shotmp_.mp4";
import type { FinishOption, ProductColourOption } from "../types/commerce";

export const assets = {
  heroVideoCinematic,
  heroVideoModularKitchen,
  kitchenCompact,
  kitchenGallery,
  kitchenIsland,
  kitchenLinear,
  kitchenParallel,
  kitchenSignature,
  kitchenSoft,
  kitchenTall,
  kitchenUrban,
  kitchenWide,
  livingCoffeeTable,
  livingDisplayConsole,
  livingMediaUnit,
  livingRoundedTable,
  livingTvConsole,
  livingWallUnit,
  wardrobeClassic,
  wardrobeDisplay,
  wardrobeLinear,
  wardrobePanel,
  wardrobeSuite,
  wardrobeTall,
};

export const finishes: FinishOption[] = [
  { label: "BWP plywood", color: [0.74, 0.58, 0.39, 1], image: plywoodBwp },
  { label: "Commercial ply", color: [0.62, 0.45, 0.28, 1], image: plywoodCommercial },
  { label: "Matte laminate", color: [0.49, 0.47, 0.41, 1], image: plywoodMatteLaminate },
  { label: "Warm ivory", color: [0.92, 0.82, 0.64, 1], image: plywoodWarmIvory },
  { label: "Stone grey", color: [0.38, 0.38, 0.36, 1], image: plywoodStoneGrey },
];

export const productColourGroups = [
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
] satisfies Array<{
  group: string;
  options: Array<Omit<ProductColourOption, "group">>;
}>;

export const productColourOptions: ProductColourOption[] = productColourGroups.flatMap((group) =>
  group.options.map((option) => ({ ...option, group: group.group })),
);

export const heroSlides = [
  {
    copy: "Straight, L-shaped, parallel, island and tall-unit systems.",
    cta: "Explore Layouts",
    eyebrow: "Layouts for every home",
    media: heroVideoModularKitchen,
    mediaType: "video",
    title: "Kitchens by layout, finish and space.",
  },
  {
    copy: "Plywood cores with warm architectural finishes.",
    cta: "Get Free Estimate",
    eyebrow: "Premium material promise",
    media: heroVideoCinematic,
    mediaType: "video",
    title: "Factory-built. Clean. Durable.",
  },
] as const;

export const homeSpaceSlides = [
  {
    copy: "TV units, wall panels and display storage.",
    image: livingWallUnit,
    label: "Living room",
    route: "/living",
    title: "Living room systems",
  },
  {
    copy: "Sliding, hinged and full-height wardrobe systems.",
    image: wardrobeClassic,
    label: "Bedroom wardrobes",
    route: "/wardrobe",
    title: "Bedroom wardrobes",
  },
  {
    copy: "Explore cabinet walls, islands, pantry and utility modules.",
    image: kitchenSignature,
    label: "Kitchen",
    route: "/kitchen",
    title: "Kitchen systems",
  },
] as const;

export const productFamilies = [
  { title: "Modular Kitchens", description: "Kitchens, islands, tall units.", image: kitchenSignature, route: "/kitchen" },
  { title: "Wardrobes", description: "Sliding and hinged systems.", image: wardrobeClassic, route: "/wardrobe" },
  { title: "TV Units", description: "Wall panels and media storage.", image: livingTvConsole, route: "/living" },
  {
    title: "Utility",
    description: "Laundry and service modules.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
    route: "/kitchen",
  },
  { title: "Pantry Units", description: "Tall pull-out storage.", image: kitchenTall, route: "/kitchen" },
  { title: "Island Counters", description: "Prep, dining and storage.", image: kitchenIsland, route: "/kitchen" },
  { title: "Cabinet Walls", description: "Full-height storage runs.", image: kitchenWide, route: "/kitchen" },
  { title: "Display Storage", description: "Glass, laminate and open shelving.", image: livingDisplayConsole, route: "/living" },
  { title: "Living Tables", description: "Low consoles and center tables.", image: livingCoffeeTable, route: "/living" },
  { title: "Rounded Tables", description: "Soft-edge living storage.", image: livingRoundedTable, route: "/living" },
  { title: "Media Consoles", description: "Drawers and device shelves.", image: livingMediaUnit, route: "/living" },
  { title: "Wall TV Units", description: "Panel-ready living systems.", image: livingWallUnit, route: "/living" },
  { title: "Wardrobe Walls", description: "Full-height bedroom storage.", image: wardrobeLinear, route: "/wardrobe" },
  { title: "Dresser Modules", description: "Shelves, drawers and niches.", image: wardrobePanel, route: "/wardrobe" },
  { title: "Tall Wardrobes", description: "Loft and vertical storage.", image: wardrobeTall, route: "/wardrobe" },
  { title: "Bedroom Suites", description: "Wardrobe with room styling.", image: wardrobeSuite, route: "/wardrobe" },
] as const;

export const kitchenDesigns = [
  {
    description: "A clean wall-to-wall cabinet run with overhead storage, integrated hob zone and tall appliance tower.",
    image: kitchenWide,
    layout: "Straight",
    price: "From 2.8L",
    title: "Linear Cabinet Wall",
  },
  {
    description: "Island-led planning with breakfast seating, warm under-cabinet light and tall storage on the perimeter.",
    image: kitchenIsland,
    layout: "Island",
    price: "From 4.6L",
    title: "Island Work Kitchen",
  },
  {
    description: "Efficient dual-counter planning for compact homes that need heavy storage and clear movement.",
    image: kitchenParallel,
    layout: "Parallel",
    price: "From 3.4L",
    title: "Parallel Utility Kitchen",
  },
  {
    description: "A space-saving corner system with easy-reach overheads, drawers and integrated appliance pockets.",
    image: kitchenCompact,
    layout: "L-Shaped",
    price: "From 2.5L",
    title: "Compact Apartment Kitchen",
  },
  {
    description: "Full-height pantry, oven and utility columns designed around a plywood modular carcass.",
    image: kitchenTall,
    layout: "Tall Units",
    price: "From 3.9L",
    title: "Tall Storage System",
  },
  {
    description: "A premium island composition with symmetrical storage, large prep counter and refined black hardware.",
    image: kitchenSignature,
    layout: "Island",
    price: "From 5.2L",
    title: "Signature Island Suite",
  },
] as const;

export const kitchenCabinetDetails = [
  { copy: "Deep plywood drawer modules for cookware, plates and daily staples.", image: kitchenLinear, title: "Soft-close drawers" },
  { copy: "Slim profile cabinets with concealed lighting and clean horizontal lines.", image: kitchenSoft, title: "Overhead shutters" },
  { copy: "Oven, microwave, pantry and refrigerator zones planned as one surface.", image: kitchenUrban, title: "Tall appliance wall" },
  { copy: "Counter-facing drawers and concealed utility volume below the island slab.", image: kitchenGallery, title: "Island storage" },
] as const;

export const wardrobeDesigns = [
  { title: "Classic Hinged Wardrobe", layout: "Hinged", price: "From 1.9L", image: wardrobeClassic, description: "Full-wall hinged shutters with open display shelves and integrated drawers." },
  { title: "Display Wardrobe", layout: "Display", price: "From 2.2L", image: wardrobeDisplay, description: "Wardrobe storage with warm niche lighting, display shelves and dresser volume." },
  { title: "Linear Wardrobe Wall", layout: "Linear", price: "From 2.4L", image: wardrobeLinear, description: "A clean wall-to-wall wardrobe run with loft storage and slim black handles." },
  { title: "Panel Wardrobe System", layout: "Panel", price: "From 2.6L", image: wardrobePanel, description: "Minimal vertical panels with concealed storage and bedroom-matched finish." },
  { title: "Tall Loft Wardrobe", layout: "Tall", price: "From 2.8L", image: wardrobeTall, description: "Floor-to-ceiling wardrobe planning for maximum storage in compact rooms." },
  { title: "Bedroom Suite Wardrobe", layout: "Suite", price: "From 3.1L", image: wardrobeSuite, description: "Wardrobe, drawers and display zones planned as one bedroom composition." },
] as const;

export const wardrobeDetails = [
  { title: "Hinged shutters", copy: "Clean vertical fronts with long black handles.", image: wardrobeDisplay },
  { title: "Open display", copy: "Lit shelves for decor, bags and daily accessories.", image: wardrobeLinear },
  { title: "Loft storage", copy: "Upper cabinets for seasonal storage.", image: wardrobeTall },
  { title: "Drawer stack", copy: "Integrated drawers for folded garments and linens.", image: wardrobeSuite },
] as const;

export const livingDesigns = [
  { title: "Floating TV Console", layout: "TV Unit", price: "From 1.4L", image: livingTvConsole, description: "Low media console with drawers, soft lighting and clean wall-mounted TV planning." },
  { title: "Media Storage Unit", layout: "Media", price: "From 1.6L", image: livingMediaUnit, description: "Device shelf, drawers and decor surface planned as one living room unit." },
  { title: "Living Table Console", layout: "Table", price: "From 90K", image: livingCoffeeTable, description: "Low living table and console storage for books, decor and everyday use." },
  { title: "Display Console", layout: "Display", price: "From 1.2L", image: livingDisplayConsole, description: "Open shelf and drawer combination with warm display detailing." },
  { title: "Rounded Storage Table", layout: "Rounded", price: "From 1.1L", image: livingRoundedTable, description: "Soft-edge living storage with drawers, open niche and warm accent lighting." },
  { title: "Wall TV System", layout: "Wall Unit", price: "From 2.1L", image: livingWallUnit, description: "A complete wall-unit composition for TV, storage and display." },
] as const;

export const livingDetails = [
  { title: "TV console drawers", copy: "Wide drawers for remotes, devices and accessories.", image: livingTvConsole },
  { title: "Open media shelf", copy: "Device-ready shelf with clean cable planning.", image: livingMediaUnit },
  { title: "Living table storage", copy: "Low modules for books, decor and daily objects.", image: livingCoffeeTable },
  { title: "Wall unit planning", copy: "Panels, lighting and storage composed as one surface.", image: livingDisplayConsole },
] as const;

export const systemDetails = [
  "16 mm BWP plywood core",
  "Water, termite and moisture resistant",
  "Soft-close channels and premium hardware",
  "Factory-built modules with site installation",
];

export const steps = [
  { title: "Measure", copy: "Site visit and dimensions." },
  { title: "Compose", copy: "Layout, modules, finishes." },
  { title: "Build", copy: "Factory-made plywood modules." },
  { title: "Install", copy: "Fitting and handover." },
];
