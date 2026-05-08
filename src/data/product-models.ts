type ModelLoader = () => Promise<string>;

const modelModules = import.meta.glob("../../glb_files/*.{glb,gltf}", {
  import: "default",
  query: "?url",
}) as Record<string, ModelLoader>;

function getCodeFromPath(path: string) {
  const fileName = path.split("/").pop() ?? "";
  return fileName.replace(/\.(glb|gltf)$/i, "").toUpperCase();
}

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

const modelLoadersByCode = Object.fromEntries(
  Object.entries(modelModules).map(([path, loader]) => [getCodeFromPath(path), loader]),
);

export function getProductModelLoader(code: string | null | undefined) {
  if (!code) {
    return null;
  }

  const normalizedCode = normalizeCode(code);
  const exactMatch = modelLoadersByCode[normalizedCode];

  if (exactMatch) {
    return exactMatch;
  }

  const versionedMatch = Object.entries(modelLoadersByCode).find(([modelCode]) =>
    modelCode.startsWith(`${normalizedCode}-`),
  );

  return versionedMatch?.[1] ?? null;
}

export function getAvailableProductModelCodes() {
  return Object.keys(modelLoadersByCode);
}
