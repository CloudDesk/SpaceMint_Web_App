/// <reference types="vite/client" />

import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        "auto-rotate"?: string;
        "camera-controls"?: string;
        "camera-orbit"?: string;
        "environment-image"?: string;
        exposure?: string;
        "field-of-view"?: string;
        loading?: string;
        reveal?: string;
        "shadow-intensity"?: string;
        "shadow-softness"?: string;
      };
    }
  }
}
