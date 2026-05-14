import {
  ArrowLeft,
  Box,
  Check,
  Cuboid,
  FileText,
  Layers3,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { getProductModelLoader } from "@/data/product-models";
import { ProductMediaCarousel } from "@/components/commerce/product-media-carousel";
import { Container } from "@/components/primitives/container";
import { Section } from "@/components/primitives/section";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { routes } from "@/config/routes";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { fadeUp, staggerContainer } from "@/lib/animation";
import { navigateToHash, scrollToElement } from "@/lib/scroll";

const subcategoryImages: Record<string, string[]> = {
  "Wall units": [
    "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=1400&q=84",
    "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1200&q=84",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=84",
  ],
  "Base shutter units": [
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=84",
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=84",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=84",
  ],
  "Drawer units": [
    "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1400&q=84",
    "https://images.unsplash.com/photo-1600566752229-250ed79470a0?auto=format&fit=crop&w=1200&q=84",
    "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=1200&q=84",
  ],
  "Pull-out storage": [
    "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1400&q=84",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=84",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=84",
  ],
  "Corner units": [
    "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1400&q=84",
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=84",
    "https://images.unsplash.com/photo-1600566753052-d0ecba81fb05?auto=format&fit=crop&w=1200&q=84",
  ],
  "Lift-up wall units": [
    "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=1400&q=84",
    "https://images.unsplash.com/photo-1600607688066-890987f18a86?auto=format&fit=crop&w=1200&q=84",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=84",
  ],
};

const finishOptions = [
  {
    color: "#8a6644",
    description: "Visible walnut-style laminate for cabinet shutters and drawer faces.",
    label: "Walnut Grain",
  },
  {
    color: "#b58a5f",
    description: "Warm oak tone for a lighter natural wood cabinet front.",
    label: "Natural Oak",
  },
  {
    color: "#6b4932",
    description: "Deep wood tone for premium cabinet shutter faces.",
    label: "Smoked Walnut",
  },
  {
    color: "#d9c3a3",
    description: "Soft ash wood tone for calm modular interiors.",
    label: "Light Ash",
  },
  {
    color: "#4b3327",
    description: "Rich espresso wood tone for dark architectural cabinetry.",
    label: "Espresso Wood",
  },
];

function getImages(product: Product) {
  return subcategoryImages[product.subcategory] ?? subcategoryImages["Wall units"];
}

function getRelatedProducts(product: Product, products: Product[]) {
  return products
    .filter((item) => item.id !== product.id && item.subcategory === product.subcategory)
    .slice(0, 3);
}

function getVariantFamilyName(product: Product) {
  return product.name
    .replace(/\s+\d+(?:\.\d+)?\s*mm$/i, "")
    .replace(/\s+\d+\s*x\s*\d+\s*x\s*\d+\s*mm$/i, "")
    .trim();
}

function getVariantGroups(product: Product, products: Product[]) {
  const grouped = products
    .filter((item) => item.category === product.category && item.subcategory === product.subcategory)
    .reduce<Record<string, Product[]>>((groups, item) => {
      const familyName = getVariantFamilyName(item);
      groups[familyName] = [...(groups[familyName] ?? []), item];
      return groups;
    }, {});

  return Object.entries(grouped).map(([name, items]) => ({
    items: [...items].sort((first, second) => (first.size?.width ?? 0) - (second.size?.width ?? 0)),
    name,
  }));
}

function parseSpecification(raw: string | null) {
  if (!raw) {
    return [];
  }

  const lines = raw.split("\n").map((line) => line.trim()).filter(Boolean);
  const sections: Array<{ title: string; items: string[] }> = [];

  for (const line of lines) {
    const numberedMatch = line.match(/^\d+\.\s*(.+)$/);
    const isAllCapsHeading = /^[A-Z][A-Z\s()&/-]+$/.test(line) && line.length <= 28;

    if (numberedMatch || isAllCapsHeading) {
      sections.push({
        title: numberedMatch ? numberedMatch[1] : line,
        items: [],
      });
      continue;
    }

    if (!sections.length) {
      sections.push({ title: "Specification", items: [] });
    }

    sections[sections.length - 1].items.push(line);
  }

  return sections;
}

type ProductDetailPageProps = {
  product: Product;
  products: Product[];
};

type ProductDetailRoutePageProps = {
  isLoading: boolean;
  productId: string;
  products: Product[];
};

export function ProductDetailRoutePage({
  isLoading,
  productId,
  products,
}: ProductDetailRoutePageProps) {
  const product = findProductByRouteId(productId, products);

  if (!product) {
    return (
      <article className="bg-background pt-20">
        <Container className="py-6">
          <Button asChild variant="ghost">
            <a href={routes.products}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Products
            </a>
          </Button>
        </Container>
        <Section className="border-y bg-accent" spacing="sm">
          <Container className="grid min-h-[40vh] place-items-center text-center">
            <div className="grid gap-3">
              <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
                {isLoading ? "Loading product" : "Product not found"}
              </p>
              <h1 className="font-heading text-h1 font-light">
                {isLoading ? "Fetching product details." : "This product is not available."}
              </h1>
            </div>
          </Container>
        </Section>
      </article>
    );
  }

  return <ProductDetailPage key={product.id} product={product} products={products} />;
}

export function ProductDetailPage({ product, products }: ProductDetailPageProps) {
  const { addItem } = useCart();
  const images = getImages(product);
  const modelLoader = getProductModelLoader(product.code);
  const [loadedModel, setLoadedModel] = useState<{ productId: string; url: string } | null>(null);
  const modelUrl = loadedModel?.productId === product.id ? loadedModel.url : null;
  const relatedProducts = getRelatedProducts(product, products);
  const specSections = parseSpecification(product.specs.raw ?? null);
  const variantGroups = getVariantGroups(product, products);

  useEffect(() => {
    let isCurrentProduct = true;

    if (!modelLoader) {
      return () => {
        isCurrentProduct = false;
      };
    }

    modelLoader().then((url) => {
      if (isCurrentProduct) {
        setLoadedModel({ productId: product.id, url });
      }
    });

    return () => {
      isCurrentProduct = false;
    };
  }, [modelLoader, product.id]);

  return (
    <article className="bg-background pt-20">
      <Container className="py-6">
        <Button asChild variant="ghost">
          <a href={routes.home}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to Home
          </a>
        </Button>
      </Container>

      <Section className="border-y bg-accent" spacing="sm">
        <Container className="grid min-w-0 grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="min-w-0 lg:sticky lg:top-24 lg:self-start"
            initial={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductMediaCarousel
              code={product.code ?? product.name}
              hasModel={Boolean(modelLoader)}
              images={images}
              modelUrl={modelUrl}
              title={product.name}
            />
          </motion.div>

          <motion.div
            animate="visible"
            className="grid min-w-0 grid-cols-1 gap-8"
            initial="hidden"
            variants={staggerContainer}
          >
            <motion.div className="space-y-4" variants={fadeUp}>
              <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
                {product.category} / {product.subcategory}
              </p>
              <h1 className="font-heading text-h2 font-light">{product.name}</h1>
              <p className="text-lead text-muted-foreground">
                {product.specs.summary}
              </p>
            </motion.div>

            <motion.div className="grid gap-3 border-y py-5 sm:grid-cols-2" variants={fadeUp}>
              <SpecItem icon={FileText} label="Product Code" value={product.code ?? "To be assigned"} />
              <SpecItem icon={Ruler} label="Size" value={product.size?.label ?? "Custom sizing"} />
              <SpecItem icon={Cuboid} label="3D Model" value={modelLoader ? "Interactive GLB available" : product.hasSketchupModel ? "SketchUp available" : "On request"} />
              <SpecItem icon={Box} label="Finish" value={product.specs.finish ?? "Laminated"} />
            </motion.div>

            <motion.div className="grid gap-3 sm:grid-cols-2" variants={fadeUp}>
              {/*
              <Button size="lg">Request Quote</Button>
              */}
              <Button
                className="group h-14 w-full justify-between px-5 shadow-[0_18px_42px_rgba(17,17,17,0.18)] hover:-translate-y-0.5"
                onClick={() =>
                  addItem({
                    category: product.category,
                    code: product.code,
                    id: product.id,
                    name: product.name,
                    sizeLabel: product.size?.label,
                    subcategory: product.subcategory,
                  })
                }
                size="lg"
              >
                <span className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-sm bg-white/12 transition-colors group-hover:bg-white/18">
                    <ShoppingBag className="size-4" aria-hidden="true" />
                  </span>
                  Add to Cart
                </span>
              </Button>
              <VariantChooserModal
                currentProduct={product}
                key={product.id}
                triggerClassName="group h-14 w-full justify-between border-foreground/18 bg-background px-5 hover:-translate-y-0.5 hover:border-foreground hover:bg-accent"
                variantGroups={variantGroups}
              />
              {/*
              <Button size="lg" variant="secondary">Book Design Visit</Button>
              */}
            </motion.div>

            <motion.div variants={fadeUp}>
              <SpecificationStudio product={product} sections={specSections} />
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {(product.specs.highlights ?? []).length ? (
        <Section spacing="sm">
          <Container className="grid gap-8">
            <motion.div
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              variants={staggerContainer}
              viewport={{ once: true, amount: 0.24 }}
              whileInView="visible"
            >
              {(product.specs.highlights ?? []).map((highlight) => (
                <motion.div className="flex gap-3 border-t pt-4" key={highlight} variants={fadeUp}>
                  <Check className="mt-1 size-4 shrink-0" aria-hidden="true" />
                  <p className="text-sm leading-6 text-muted-foreground">{highlight}</p>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </Section>
      ) : null}

      {relatedProducts.length ? (
        <Section className="border-t bg-muted" spacing="sm">
          <Container className="space-y-8">
            <motion.div
              initial="hidden"
              variants={fadeUp}
              viewport={{ once: true, amount: 0.35 }}
              whileInView="visible"
            >
              <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
                Related modules
              </p>
              <h2 className="mt-2 font-heading text-3xl font-light">
                More from {product.subcategory}
              </h2>
            </motion.div>
            <motion.div
              className="grid gap-4 md:grid-cols-3"
              initial="hidden"
              variants={staggerContainer}
              viewport={{ once: true, amount: 0.18 }}
              whileInView="visible"
            >
              {relatedProducts.map((relatedProduct) => (
                <motion.a
                  className="group grid gap-4 rounded-lg border bg-background p-card-pad transition-colors hover:bg-accent"
                  href={routes.product(relatedProduct.id)}
                  key={relatedProduct.id}
                  onClick={(event) => handleProductNavigation(event, relatedProduct.id)}
                  variants={fadeUp}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {relatedProduct.code}
                  </p>
                  <h3 className="font-heading text-2xl font-light">{relatedProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {relatedProduct.size?.label ?? "Custom sizing"}
                  </p>
                </motion.a>
              ))}
            </motion.div>
          </Container>
        </Section>
      ) : null}
    </article>
  );
}

function findProductByRouteId(productId: string, products: Product[]) {
  return products.find((item) => item.id === productId || item.code === productId) ?? null;
}

function VariantChooserModal({
  currentProduct,
  triggerClassName,
  variantGroups,
}: {
  currentProduct: Product;
  triggerClassName?: string;
  variantGroups: Array<{ name: string; items: Product[] }>;
}) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(currentProduct);
  const [selectedFinish, setSelectedFinish] = useState(finishOptions[0]);
  const [loadedVariantModel, setLoadedVariantModel] = useState<{ productId: string; url: string } | null>(null);
  const selectedImages = getImages(selectedVariant);
  const selectedModelLoader = getProductModelLoader(selectedVariant.code);
  const selectedModelUrl =
    loadedVariantModel?.productId === selectedVariant.id ? loadedVariantModel.url : null;

  useEffect(() => {
    let isCurrentVariant = true;

    if (!selectedModelLoader) {
      return () => {
        isCurrentVariant = false;
      };
    }

    selectedModelLoader().then((url) => {
      if (isCurrentVariant) {
        setLoadedVariantModel({ productId: selectedVariant.id, url });
      }
    });

    return () => {
      isCurrentVariant = false;
    };
  }, [selectedModelLoader, selectedVariant.id]);

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button className={triggerClassName} size="lg" variant="secondary">
          <span className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-sm border bg-background transition-colors group-hover:border-foreground">
              <SlidersHorizontal className="size-4" aria-hidden="true" />
            </span>
            Choose Variant
          </span>
        </Button>
      </ModalTrigger>
      <ModalContent className="top-2 h-[calc(100dvh-1rem)] max-h-none w-[calc(100vw-1rem)] max-w-[min(1720px,98vw)] translate-y-0 gap-0 overflow-hidden p-0">
        <div
          className="grid h-full overflow-auto overscroll-contain lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
          data-lenis-prevent
        >
          <div className="grid content-start gap-4 border-b bg-accent p-5 lg:border-b-0 lg:border-r lg:p-6">
            <ModalHeader>
              <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
                Visual configuration
              </p>
              <ModalTitle className="font-heading text-3xl font-light">
                {selectedVariant.name}
              </ModalTitle>
              <ModalDescription className="text-sm leading-6 text-muted-foreground">
                Review the module preview, room references, and finish direction before selecting
                the final variant.
              </ModalDescription>
            </ModalHeader>

            <ProductMediaCarousel
              code={selectedVariant.code ?? selectedVariant.name}
              finishColor={selectedFinish.color}
              hasModel={Boolean(selectedModelLoader)}
              images={selectedImages}
              modelUrl={selectedModelUrl}
              title={selectedVariant.name}
            />

            <div className="grid gap-3 rounded-lg border bg-background p-4 text-sm sm:grid-cols-3">
              <SpecPill label="Selected" value={selectedVariant.code ?? "TBA"} />
              <SpecPill label="Size" value={selectedVariant.size?.label ?? "Custom"} />
              <SpecPill label="Finish" value={selectedFinish.label} />
            </div>

            {selectedVariant.id !== currentProduct.id ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  onClick={() =>
                    addItem({
                      category: selectedVariant.category,
                      code: selectedVariant.code,
                      finishColor: selectedFinish.color,
                      finishLabel: selectedFinish.label,
                      id: selectedVariant.id,
                      name: selectedVariant.name,
                      sizeLabel: selectedVariant.size?.label,
                      subcategory: selectedVariant.subcategory,
                    })
                  }
                >
                  Add Selected to Cart
                </Button>
                <Button asChild variant="secondary">
                  <a
                    href={routes.product(selectedVariant.id)}
                    onClick={(event) => handleProductNavigation(event, selectedVariant.id)}
                  >
                    Open selected detail page
                  </a>
                </Button>
              </div>
            ) : (
              <Button
                onClick={() =>
                  addItem({
                    category: selectedVariant.category,
                    code: selectedVariant.code,
                    finishColor: selectedFinish.color,
                    finishLabel: selectedFinish.label,
                    id: selectedVariant.id,
                    name: selectedVariant.name,
                    sizeLabel: selectedVariant.size?.label,
                    subcategory: selectedVariant.subcategory,
                  })
                }
              >
                Add Selected to Cart
              </Button>
            )}
          </div>

          <div className="grid content-start gap-7 p-5 lg:p-6">
            <section className="grid gap-4">
              <div>
                <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
                  Grouped variants
                </p>
                <h3 className="mt-2 font-heading text-3xl font-light">
                  Select a module size.
                </h3>
              </div>

              <div className="grid gap-4">
                {variantGroups.map((group) => (
                  <div className="rounded-lg border bg-card p-4" key={group.name}>
                    <h4 className="font-heading text-2xl font-light">{group.name}</h4>
                    <div className="mt-4 grid gap-2">
                      {group.items.map((variant) => {
                        const isActive = variant.id === selectedVariant.id;

                        return (
                          <button
                            className={`grid gap-1 rounded-sm border px-3 py-3 text-left text-sm transition-colors hover:bg-accent ${
                              isActive ? "border-foreground bg-accent" : "bg-background"
                            }`}
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant)}
                            type="button"
                          >
                            <span className="flex items-center justify-between gap-3">
                              <strong className="font-medium">{variant.name}</strong>
                              {isActive ? (
                                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                  Previewing
                                </span>
                              ) : null}
                            </span>
                            <span className="text-muted-foreground">
                              {variant.size?.label ?? "Custom size"} / {variant.code}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
                    Finish
                  </p>
                  <h3 className="mt-2 font-heading text-3xl font-light">
                    Choose a surface.
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFinish.label}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-5">
                {finishOptions.map((finish) => {
                  const isActive = finish.label === selectedFinish.label;

                  return (
                    <button
                      aria-pressed={isActive}
                      className={`grid min-h-24 content-start overflow-hidden rounded-sm border text-left transition-colors hover:bg-accent ${
                        isActive ? "border-foreground bg-accent" : "bg-background"
                      }`}
                      key={finish.label}
                      onClick={() => setSelectedFinish(finish)}
                      type="button"
                    >
                      <span
                        className="block h-12 border-b"
                        style={{ backgroundColor: finish.color }}
                        aria-hidden="true"
                      />
                      <span className="flex min-h-12 items-center justify-between gap-2 px-2.5 py-2">
                        <span className="text-xs font-medium leading-4">{finish.label}</span>
                        <span
                          className={`size-2 shrink-0 rounded-full ${
                            isActive ? "bg-foreground" : "bg-border"
                          }`}
                          aria-hidden="true"
                        />
                        <span className="sr-only">
                          {finish.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

function handleProductNavigation(event: MouseEvent<HTMLAnchorElement>, productId: string) {
  event.preventDefault();
  navigateToHash(routes.product(productId));
}

function SpecificationStudio({
  product,
  sections,
}: {
  product: Product;
  sections: Array<{ title: string; items: string[] }>;
}) {
  const availableSections = sections.length ? sections : [{ title: "Specification", items: [] }];
  const featuredSections = availableSections.slice(0, 6);
  const sectionCount = featuredSections.length;
  const [activeSpecIndex, setActiveSpecIndex] = useState(0);

  useEffect(() => {
    const specElements = Array.from({ length: sectionCount }, (_, index) =>
      document.getElementById(`spec-${index}`),
    )
      .filter((element): element is HTMLElement => Boolean(element));

    if (!specElements.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        const nextIndex = Number(visibleEntry?.target.getAttribute("data-spec-index"));

        if (Number.isFinite(nextIndex)) {
          setActiveSpecIndex(nextIndex);
        }
      },
      {
        rootMargin: "-24% 0px -52% 0px",
        threshold: [0.12, 0.32, 0.56],
      },
    );

    specElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sectionCount]);

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 border-t pt-8">
      <div className="grid gap-5">
        <div className="space-y-3">
          <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
            Specification studio
          </p>
          <h2 className="font-heading text-3xl font-light">Built for quick decisions</h2>
          <p className="max-w-prose text-sm leading-6 text-muted-foreground">
            Material, finish, hardware, and durability notes are separated into visual checkpoints
            so the specification feels worth scanning.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <SpecFeature
          icon={Layers3}
          label="Core"
          value={product.specs.coreMaterial ?? "Material to be confirmed"}
        />
        <SpecFeature
          icon={Sparkles}
          label="Finish"
          value={product.specs.finish ?? "Laminated finish"}
        />
        <SpecFeature
          icon={ShieldCheck}
          label="Reliability"
          value="Moisture-sealed edges and daily-use hardware"
        />
      </div>

      <div className="grid gap-4" id="technical-specs">
        <div className="flex flex-col gap-2 rounded-lg border bg-background p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Technical details
            </p>
            <h3 className="mt-1 font-heading text-2xl font-light">
              What this module is made of
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {sectionCount} sections
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[11.5rem_minmax(0,1fr)] xl:items-start">
          <SpecTimeline
            activeIndex={activeSpecIndex}
            sections={featuredSections}
          />

          <div className="grid min-w-0 grid-cols-1 gap-4">
            {featuredSections.map((section, index) => (
              <motion.section
                className="min-w-0 scroll-mt-28 overflow-hidden rounded-lg border bg-background shadow-soft"
                data-spec-index={index}
                id={`spec-${index}`}
                initial={{ opacity: 0, y: 18 }}
                key={`${section.title}-${index}`}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, amount: 0.28 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="grid grid-cols-[auto_1fr_auto] items-start gap-4 border-b bg-card p-4">
                  <span className="grid size-10 place-items-center rounded-sm bg-primary text-sm font-semibold text-primary-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-heading text-2xl font-light">{section.title}</h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {section.items.length || 1} {section.items.length === 1 ? "checkpoint" : "checkpoints"}
                    </p>
                  </div>
                  <Check className="mt-1 size-5 shrink-0" aria-hidden="true" />
                </div>
                {section.items.length ? (
                  <ul className="divide-y">
                    {section.items.map((item) => (
                      <li className="flex gap-3 px-4 py-3 text-sm leading-6 text-muted-foreground" key={item}>
                        <Check className="mt-1 size-4 shrink-0 text-foreground" aria-hidden="true" />
                        <span className="min-w-0">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-3 text-sm text-muted-foreground">
                    Details available on request.
                  </p>
                )}
              </motion.section>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-background p-4 shadow-soft">
        <div className="mb-4 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-sm bg-accent">
            <Wrench className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Included fittings
            </p>
            <h3 className="font-heading text-2xl font-light">Hardware Kit</h3>
          </div>
        </div>
        {product.specs.hardware.length ? (
          <div className="flex flex-wrap gap-2">
            {product.specs.hardware.map((item) => (
              <span className="rounded-sm border bg-card px-3 py-2 text-sm" key={item}>
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Hardware details to be confirmed.</p>
        )}
      </div>

      {product.specs.raw ? (
        <details className="group rounded-lg border bg-background p-4 shadow-soft">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <span className="font-heading text-2xl font-light">Original Specification Transcript</span>
            <span className="text-sm text-muted-foreground group-open:hidden">Open</span>
            <span className="hidden text-sm text-muted-foreground group-open:inline">Close</span>
          </summary>
          <pre className="mt-5 max-h-[28rem] overflow-auto whitespace-pre-wrap border-t pt-5 text-sm leading-7 text-muted-foreground">
            {product.specs.raw}
          </pre>
        </details>
      ) : null}
    </div>
  );
}

function SpecTimeline({
  activeIndex,
  sections,
}: {
  activeIndex: number;
  sections: Array<{ title: string; items: string[] }>;
}) {
  const handleTimelineClick = (index: number) => {
    scrollToElement(`#spec-${index}`);
  };

  return (
    <div className="min-w-0 xl:sticky xl:top-24">
      <div className="flex max-w-full gap-2 overflow-x-auto pb-1 xl:hidden" data-lenis-prevent>
        {sections.map((section, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              aria-current={isActive ? "step" : undefined}
              className={`flex min-w-max items-center gap-2 rounded-sm border px-3 py-2 text-left text-sm transition-colors ${
                isActive
                  ? "border-foreground bg-primary text-primary-foreground"
                  : "bg-background hover:border-foreground hover:bg-accent"
              }`}
              key={`${section.title}-mobile-timeline-${index}`}
              onClick={() => handleTimelineClick(index)}
              type="button"
            >
              <span className="text-xs font-semibold">{String(index + 1).padStart(2, "0")}</span>
              <span>{section.title}</span>
            </button>
          );
        })}
      </div>

      <div className="hidden rounded-lg border bg-background p-3 shadow-soft xl:block">
        <p className="px-2 pb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Spec timeline
        </p>
        <ol className="grid">
          {sections.map((section, index) => {
            const isActive = index === activeIndex;
            const isComplete = index < activeIndex;
            const isLast = index === sections.length - 1;

            return (
              <li
                className="grid grid-cols-[1.75rem_1fr] gap-2"
                key={`${section.title}-timeline-${index}`}
              >
                <div className="grid justify-center">
                  <span
                    className={`mt-1 grid size-5 place-items-center rounded-full border text-[0.6rem] font-semibold transition-colors ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : isComplete
                          ? "border-primary bg-foreground text-primary-foreground"
                          : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {!isLast ? (
                    <span
                      className={`mx-auto min-h-10 w-px ${
                        isComplete ? "bg-foreground" : "bg-border"
                      }`}
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
                <button
                  aria-current={isActive ? "step" : undefined}
                  className={`mb-2 grid rounded-sm px-2 py-1.5 text-left transition-colors ${
                    isActive ? "bg-accent" : "hover:bg-accent"
                  }`}
                  onClick={() => handleTimelineClick(index)}
                  type="button"
                >
                  <span className="text-sm font-medium leading-5">{section.title}</span>
                  <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {section.items.length || 1} {section.items.length === 1 ? "point" : "points"}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function SpecPill({ label, value }: { label: string; value: string }) {
  return (
    <p className="rounded-sm border bg-background px-3 py-2">
      <span className="block text-xs text-muted-foreground">{label}</span>
      <strong className="font-medium">{value}</strong>
    </p>
  );
}

function SpecFeature({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-4 rounded-lg border bg-background p-4">
      <Icon className="size-5" aria-hidden="true" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

function SpecItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-1 size-4 shrink-0" aria-hidden="true" />
      <p className="text-sm">
        <span className="block text-muted-foreground">{label}</span>
        <strong className="font-medium">{value}</strong>
      </p>
    </div>
  );
}
