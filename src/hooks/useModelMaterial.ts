import { useEffect, type RefObject } from "react";
import type { ProductColourOption } from "../types/commerce";

type ModelViewerElement = HTMLElement & {
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

export function useModelMaterial(
  modelViewerRef: RefObject<HTMLElement | null>,
  modelUrl: string | undefined,
  colour: ProductColourOption,
) {
  useEffect(() => {
    const modelViewer = modelViewerRef.current as ModelViewerElement | null;

    if (!modelViewer || !modelUrl) return;

    let isCancelled = false;

    const applySelectedMaterial = async () => {
      await modelViewer.updateComplete;
      if (isCancelled) return;

      modelViewer.model?.materials?.forEach((material) => {
        material.pbrMetallicRoughness?.setBaseColorFactor?.(colour.color);
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
  }, [colour, modelUrl, modelViewerRef]);
}
