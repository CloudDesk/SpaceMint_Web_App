import { ChevronLeft, ChevronRight, Cuboid, Image as ImageIcon } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const ModelViewer = lazy(() =>
  import("@/components/commerce/model-viewer").then((module) => ({
    default: module.ModelViewer,
  })),
);

type ProductMediaCarouselProps = {
  code: string;
  finishColor?: string;
  hasModel: boolean;
  images: string[];
  modelUrl: string | null;
  title: string;
};

type MediaSlide =
  | {
      id: string;
      kind: "model";
      label: string;
    }
  | {
      id: string;
      image: string;
      kind: "image";
      label: string;
    };

export function ProductMediaCarousel({
  code,
  finishColor,
  hasModel,
  images,
  modelUrl,
  title,
}: ProductMediaCarouselProps) {
  const slides = useMemo<MediaSlide[]>(() => {
    const imageSlides = images.map((image, index) => ({
      id: `${title}-image-${index}`,
      image,
      kind: "image" as const,
      label: `Image ${index + 1}`,
    }));

    if (!hasModel) {
      return imageSlides;
    }

    return [
      {
        id: `${code}-model`,
        kind: "model" as const,
        label: "Interactive 3D",
      },
      ...imageSlides,
    ];
  }, [code, hasModel, images, title]);
  const mediaKey = `${code}:${images.join("|")}`;
  const [selection, setSelection] = useState({ index: 0, key: mediaKey });
  const activeIndex = selection.key === mediaKey ? selection.index : 0;
  const activeSlide = slides[Math.min(activeIndex, slides.length - 1)];

  const move = (direction: -1 | 1) => {
    setSelection((currentSelection) => {
      if (!slides.length) {
        return { index: 0, key: mediaKey };
      }

      const currentIndex = currentSelection.key === mediaKey ? currentSelection.index : 0;

      return {
        index: (currentIndex + direction + slides.length) % slides.length,
        key: mediaKey,
      };
    });
  };

  if (!slides.length) {
    return (
      <div className="grid h-[26rem] place-items-center rounded-lg border bg-accent p-card-pad lg:h-[34rem]">
        <p className="text-sm text-muted-foreground">Media available on request.</p>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3">
      <div
        className={cn(
          "relative min-w-0 max-w-full overflow-hidden rounded-lg border bg-accent",
          activeSlide.kind === "model"
            ? "min-h-[min(34rem,72svh)] lg:min-h-[34rem]"
            : "h-[26rem] lg:h-[34rem]",
        )}
      >
        {activeSlide.kind === "model" ? (
          modelUrl ? (
            <Suspense fallback={<ModelViewerFallback code={code} />}>
              <ModelViewer
                code={code}
                finishColor={finishColor}
                modelUrl={modelUrl}
                title={title}
              />
            </Suspense>
          ) : (
            <ModelViewerFallback code={code} />
          )
        ) : (
          <img
            alt={`${title} ${activeSlide.label}`}
            className="sm-image-treatment absolute inset-0 size-full object-cover"
            src={activeSlide.image}
          />
        )}

        {slides.length > 1 ? (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4 sm:px-5">
            <CarouselButton label="Previous media" onClick={() => move(-1)}>
              <ChevronLeft className="size-5" aria-hidden="true" />
            </CarouselButton>
            <CarouselButton label="Next media" onClick={() => move(1)}>
              <ChevronRight className="size-5" aria-hidden="true" />
            </CarouselButton>
          </div>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1" data-lenis-prevent>
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                aria-label={`Show ${slide.label}`}
                aria-pressed={isActive}
                className={cn(
                  "relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-sm border bg-background text-xs transition-colors hover:bg-accent",
                  isActive && "border-foreground bg-accent",
                )}
                key={slide.id}
                onClick={() => setSelection({ index, key: mediaKey })}
                type="button"
              >
                {slide.kind === "model" ? (
                  <span className="grid gap-1 text-center">
                    <Cuboid className="mx-auto size-5" aria-hidden="true" />
                    <span>3D</span>
                  </span>
                ) : (
                  <>
                    <img
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                      src={slide.image}
                    />
                    <span className="absolute inset-0 bg-black/8" />
                    <ImageIcon className="relative size-4 text-white drop-shadow" aria-hidden="true" />
                  </>
                )}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function ModelViewerFallback({ code }: { code: string }) {
  return (
    <div className="grid size-full place-items-center bg-accent p-card-pad">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Loading interactive module
        </p>
        <p className="mt-2 font-heading text-3xl font-light">{code}</p>
      </div>
    </div>
  );
}

function CarouselButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="pointer-events-auto grid size-11 place-items-center rounded-sm border border-white bg-white text-foreground shadow-[0_14px_38px_rgba(17,17,17,0.34)] ring-1 ring-black/20 transition-colors hover:bg-primary hover:text-primary-foreground"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
