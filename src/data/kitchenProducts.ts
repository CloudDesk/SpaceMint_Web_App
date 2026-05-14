export type KitchenProduct = {
  id: string;
  serialNumber: number;
  name: string;
  code: string;
  size: {
    width: number;
    height: number;
    depth: number;
    unit: string;
    label: string;
  } | null;
  hasSketchupModel: boolean;
  sketchupFile?: string;
  modelUrl?: string;
  category: string;
  subcategory: string;
  pricing?: {
    basePrice?: number | null;
    currency?: string | null;
  };
  specs: {
    summary: string;
    coreMaterial: string | null;
    finish: string | null;
    hardware: string[];
    highlights?: string[];
  };
};

const sketchupFileByCode: Record<string, string> = {
  "1DSWU450-01": "1DSWU450-01.skp",
  "2DSU750-01": "2DSU750-01.skp",
  "2DSU800-02": "2DSU800-02.skp",
  "2DSU900-03": "2DSU900-03.skp",
  "2DSWU600": "2DSWU600-01.skp",
  "2DSWU750": "2DSWU750-01.skp",
  "2DTU600-01": "2DTU600-01.skp",
  "2DTU750-02": "2DTU750-02.skp",
  "2DTU900-03": "2DTU900-03.skp",
  "3DTU600-01": "3DTU600-01.skp",
  "3DTU750-02": "3DTU750-02.skp",
  "3DTU900-03": "3DTU900-03.skp",
  "BPO150-01": "BPO150-01.skp",
  "BPO200-02": "BPO200-02.skp",
  "BPO300-03": "BPO300-03.skp",
  CUL003: "CUL003.skp",
  CULS001: "CULS001.skp",
  CURS002: "CURS002.skp",
  ULWU600: "ULWU600-01.skp",
  ULWU750: "ULWU750-01.skp",
};

const glbModels = import.meta.glob("../../assests/sketch.glb/*.glb", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const modelUrlByFileBase = Object.fromEntries(
  Object.entries(glbModels).map(([path, url]) => {
    const fileName = path.split("/").pop() ?? "";
    return [fileName.replace(/\.glb$/i, ""), url];
  })
);

const getModelUrl = (productCode: string) => {
  const sketchupFile = sketchupFileByCode[productCode];
  const sketchupBase = sketchupFile?.replace(/\.skp$/i, "");

  return modelUrlByFileBase[productCode] ?? (sketchupBase ? modelUrlByFileBase[sketchupBase] : undefined);
};

export const getKitchenProductModelUrl = (productCode: string, sourceUrl?: string | null) => {
  const sourceBase = getModelBaseName(sourceUrl);

  return (sourceBase ? modelUrlByFileBase[sourceBase] : undefined) ?? getModelUrl(productCode) ?? sourceUrl ?? undefined;
};

function getModelBaseName(sourceUrl?: string | null) {
  if (!sourceUrl) {
    return "";
  }

  const pathWithoutQuery = sourceUrl.split("?")[0] ?? sourceUrl;
  const fileName = pathWithoutQuery.split("/").pop() ?? "";

  return fileName.replace(/\.glb$/i, "");
}

const rawKitchenProducts: KitchenProduct[] = [
  {
    id: "sm-001",
    serialNumber: 1,
    name: "1 Door Shutter Wall Unit 450mm",
    code: "1DSWU450-01",
    size: { width: 450, height: 600, depth: 350, unit: "mm", label: "450 x 600 x 350 mm" },
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Wall units",
    specs: {
      summary: "Made from 16 mm Commercial Grade Plywood",
      coreMaterial: "Made from 16 mm Commercial Grade Plywood",
      finish: "Smooth matte/gloss surface (customizable)",
      hardware: ["Mini Fix", "Hinges", "Shelf pin", "Handles"],
      highlights: ["0.8 mm decorative laminate", "Soft-close hardware", "PVC edge banding"],
    },
  },
  {
    id: "sm-002",
    serialNumber: 2,
    name: "2 Door Shutter Unit 750mm",
    code: "2DSU750-01",
    size: { width: 750, height: 600, depth: 560, unit: "mm", label: "750 x 600 x 560 mm" },
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Base shutter units",
    specs: {
      summary: "Made from 16 mm BWP Ply",
      coreMaterial: "Made from 16 mm BWP Ply",
      finish: "Shutter smooth matte/gloss surface (customizable)",
      hardware: ["Mini Fix", "Hinges", "Shelf pin", "Handles"],
      highlights: ["0.8 mm decorative laminate", "Soft-close hardware", "PVC edge banding"],
    },
  },
  {
    id: "sm-003",
    serialNumber: 3,
    name: "2 Door Shutter Unit 800mm",
    code: "2DSU800-02",
    size: { width: 800, height: 600, depth: 350, unit: "mm", label: "800 x 600 x 350 mm" },
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Base shutter units",
    specs: {
      summary: "Made from 16 mm BWP Ply",
      coreMaterial: "Made from 16 mm BWP Ply",
      finish: "Shutter smooth matte/gloss surface (customizable)",
      hardware: ["Mini Fix", "Hinges", "Shelf pin", "Handles"],
      highlights: ["0.8 mm decorative laminate", "Soft-close hardware", "PVC edge banding"],
    },
  },
  {
    id: "sm-004",
    serialNumber: 4,
    name: "2 Door Shutter Unit 900mm",
    code: "2DSU900-03",
    size: { width: 900, height: 600, depth: 560, unit: "mm", label: "900 x 600 x 560 mm" },
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Base shutter units",
    specs: {
      summary: "Made from 16 mm BWP Ply",
      coreMaterial: "Made from 16 mm BWP Ply",
      finish: "Shutter smooth matte/gloss surface (customizable)",
      hardware: ["Mini Fix", "Hinges", "Shelf pin", "Handles"],
      highlights: ["0.8 mm decorative laminate", "Soft-close hardware", "PVC edge banding"],
    },
  },
  {
    id: "sm-005",
    serialNumber: 5,
    name: "2 Door Shutter Wall Unit 600mm",
    code: "2DSWU600",
    size: { width: 600, height: 600, depth: 350, unit: "mm", label: "600 x 600 x 350 mm" },
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Wall units",
    specs: {
      summary: "Made from 16 mm Commercial Grade Plywood",
      coreMaterial: "Made from 16 mm Commercial Grade Plywood",
      finish: "Smooth matte/gloss surface (customizable)",
      hardware: ["Mini Fix", "Hinges", "Shelf pin", "Handles"],
      highlights: ["0.8 mm decorative laminate", "Soft-close hardware", "PVC edge banding"],
    },
  },
  {
    id: "sm-006",
    serialNumber: 6,
    name: "2 Door Shutter Wall Unit 750mm",
    code: "2DSWU750",
    size: { width: 750, height: 600, depth: 350, unit: "mm", label: "750 x 600 x 350 mm" },
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Wall units",
    specs: {
      summary: "Made from 16 mm Commercial Grade Plywood",
      coreMaterial: "Made from 16 mm Commercial Grade Plywood",
      finish: "Smooth matte/gloss surface (customizable)",
      hardware: ["Mini Fix", "Hinges", "Shelf pin", "Handles"],
      highlights: ["0.8 mm decorative laminate", "Soft-close hardware", "PVC edge banding"],
    },
  },
  {
    id: "sm-007",
    serialNumber: 7,
    name: "2 Drawers Tandem Unit 600mm",
    code: "2DTU600-01",
    size: null,
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Drawer units",
    specs: { summary: "Specifications to be confirmed.", coreMaterial: null, finish: null, hardware: [] },
  },
  {
    id: "sm-008",
    serialNumber: 8,
    name: "2 Drawers Tandem Unit 750mm",
    code: "2DTU750-02",
    size: null,
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Drawer units",
    specs: { summary: "Specifications to be confirmed.", coreMaterial: null, finish: null, hardware: [] },
  },
  {
    id: "sm-009",
    serialNumber: 9,
    name: "2 Drawers Tandem Unit 900mm",
    code: "2DTU900-03",
    size: null,
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Drawer units",
    specs: { summary: "Specifications to be confirmed.", coreMaterial: null, finish: null, hardware: [] },
  },
  {
    id: "sm-010",
    serialNumber: 10,
    name: "3 Drawers Tandem Unit 600mm",
    code: "3DTU600-01",
    size: null,
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Drawer units",
    specs: { summary: "Specifications to be confirmed.", coreMaterial: null, finish: null, hardware: [] },
  },
  {
    id: "sm-011",
    serialNumber: 11,
    name: "3 Drawers Tandem Unit 750mm",
    code: "3DTU750-02",
    size: null,
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Drawer units",
    specs: { summary: "Specifications to be confirmed.", coreMaterial: null, finish: null, hardware: [] },
  },
  {
    id: "sm-012",
    serialNumber: 12,
    name: "3 Drawers Tandem Unit 900mm",
    code: "3DTU900-03",
    size: null,
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Drawer units",
    specs: { summary: "Specifications to be confirmed.", coreMaterial: null, finish: null, hardware: [] },
  },
  {
    id: "sm-013",
    serialNumber: 13,
    name: "Bottle Pullout 150mm",
    code: "BPO150-01",
    size: null,
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Pull-out storage",
    specs: { summary: "Specifications to be confirmed.", coreMaterial: null, finish: null, hardware: [] },
  },
  {
    id: "sm-014",
    serialNumber: 14,
    name: "Bottle Pullout 200mm",
    code: "BPO200-02",
    size: null,
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Pull-out storage",
    specs: { summary: "Specifications to be confirmed.", coreMaterial: null, finish: null, hardware: [] },
  },
  {
    id: "sm-015",
    serialNumber: 15,
    name: "Bottle Pullout 300mm",
    code: "BPO300-03",
    size: null,
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Pull-out storage",
    specs: { summary: "Specifications to be confirmed.", coreMaterial: null, finish: null, hardware: [] },
  },
  {
    id: "sm-016",
    serialNumber: 16,
    name: "Corner Unit L Shaped 1100mm",
    code: "CUL003",
    size: null,
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Corner units",
    specs: { summary: "Specifications to be confirmed.", coreMaterial: null, finish: null, hardware: [] },
  },
  {
    id: "sm-017",
    serialNumber: 17,
    name: "Corner Unit Left Side 1100mm",
    code: "CULS001",
    size: null,
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Corner units",
    specs: { summary: "Specifications to be confirmed.", coreMaterial: null, finish: null, hardware: [] },
  },
  {
    id: "sm-018",
    serialNumber: 18,
    name: "Corner Unit Right Side 1100mm",
    code: "CURS002",
    size: null,
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Corner units",
    specs: { summary: "Specifications to be confirmed.", coreMaterial: null, finish: null, hardware: [] },
  },
  {
    id: "sm-019",
    serialNumber: 19,
    name: "Up Lift Wall Unit 600mm",
    code: "ULWU600",
    size: { width: 600, height: 600, depth: 350, unit: "mm", label: "600 x 600 x 350 mm" },
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Lift-up wall units",
    specs: {
      summary: "Made from 16 mm Commercial Grade Plywood",
      coreMaterial: "Made from 16 mm Commercial Grade Plywood",
      finish: "Smooth matte/gloss surface (customizable)",
      hardware: ["Mini Fix", "Hinges", "Shelf pin", "Handles", "Hydraulic lift ups"],
      highlights: ["0.8 mm decorative laminate", "Soft-close hardware", "PVC edge banding"],
    },
  },
  {
    id: "sm-020",
    serialNumber: 20,
    name: "Up Lift Wall Unit 750mm",
    code: "ULWU750",
    size: { width: 750, height: 600, depth: 350, unit: "mm", label: "750 x 600 x 350 mm" },
    hasSketchupModel: true,
    category: "Kitchens",
    subcategory: "Lift-up wall units",
    specs: {
      summary: "Made from 16 mm Commercial Grade Plywood",
      coreMaterial: "Made from 16 mm Commercial Grade Plywood",
      finish: "Smooth matte/gloss surface (customizable)",
      hardware: ["Mini Fix", "Hinges", "Shelf pin", "Handles", "Hydraulic lift ups"],
      highlights: ["0.8 mm decorative laminate", "Soft-close hardware", "PVC edge banding"],
    },
  },
];

export const kitchenProducts: KitchenProduct[] = rawKitchenProducts.map((product) => ({
  ...product,
  sketchupFile: sketchupFileByCode[product.code],
  modelUrl: getKitchenProductModelUrl(product.code),
}));
