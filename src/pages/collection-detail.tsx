import { ArrowLeft, ArrowUpRight, Grid2X2, Layers3 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { MouseEvent } from "react";
import { useState } from "react";
import type { CollectionPage } from "@/data/collections";
import { Container } from "@/components/primitives/container";
import { Section } from "@/components/primitives/section";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { easeLuxury, fadeUp, staggerContainer } from "@/lib/animation";
import { navigateToHash } from "@/lib/scroll";

const collectionProductVisibleCounts = new Map<string, number>();

export function CollectionDetailPage({ collection }: { collection: CollectionPage }) {
  const shouldShowProductsFirst = [
    "kitchens",
    "living-room-furniture",
    "bedroom-wardrobes",
  ].includes(collection.id);

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

      <section className="border-y bg-accent">
        <Container className="grid min-h-[34rem] gap-8 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <motion.div
            animate="visible"
            className="space-y-6"
            initial="hidden"
            variants={staggerContainer}
          >
            <motion.p className="text-eyebrow font-semibold uppercase text-muted-foreground" variants={fadeUp}>
              {collection.eyebrow}
            </motion.p>
            <motion.h1 className="max-w-4xl font-heading text-h1 font-light" variants={fadeUp}>
              {collection.title}
            </motion.h1>
            <motion.p className="max-w-2xl text-lead text-muted-foreground" variants={fadeUp}>
              {collection.description}
            </motion.p>
            <motion.div className="flex flex-col gap-3 sm:flex-row" variants={fadeUp}>
              <Button size="lg">
                Request Catalogue
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Button>
              {/*
              <Button size="lg" variant="secondary">
                Book Design Visit
              </Button>
              */}
            </motion.div>
          </motion.div>

          <motion.img
            alt={collection.label}
            className="sm-image-treatment aspect-[5/4] w-full rounded-lg border object-cover lg:aspect-[4/3]"
            initial={{ opacity: 0, scale: 0.985, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.78, ease: easeLuxury, delay: 0.12 }}
            src={collection.image}
          />
        </Container>
      </section>

      {shouldShowProductsFirst ? (
        <>
          <ProductsSection collection={collection} />
          <TypesSection collection={collection} muted />
        </>
      ) : (
        <>
          <TypesSection collection={collection} />
          <ProductsSection collection={collection} muted />
        </>
      )}
    </article>
  );
}

function TypesSection({
  collection,
  muted = false,
}: {
  collection: CollectionPage;
  muted?: boolean;
}) {
  if (collection.id === "kitchens") {
    return <KitchenTypesSection collection={collection} muted={muted} />;
  }

  return (
    <Section className={muted ? "border-t bg-muted" : undefined} spacing="sm">
      <Container className="space-y-8">
        <motion.div
          className="flex items-end justify-between gap-5"
          initial="hidden"
          variants={fadeUp}
          viewport={{ once: true, amount: 0.35 }}
          whileInView="visible"
        >
          <div>
            <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
              <Grid2X2 className="mr-2 inline size-4" aria-hidden="true" />
              {collection.typesTitle}
            </p>
            <h2 className="mt-2 font-heading text-3xl font-light sm:text-4xl">
              Choose by room, shape, or use.
            </h2>
          </div>
        </motion.div>

        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.18 }}
          whileInView="visible"
        >
          {collection.types.map((type) => (
            <motion.article className="group overflow-hidden rounded-lg border bg-card" key={type.id} variants={fadeUp}>
              <img
                alt={type.name}
                className="sm-image-treatment aspect-[4/3] w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.035]"
                loading="lazy"
                src={type.image}
              />
              <div className="grid gap-3 p-card-pad">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {type.bestFor}
                </p>
                <h3 className="font-heading text-2xl font-light">{type.name}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{type.description}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}

function KitchenTypesSection({
  collection,
  muted = false,
}: {
  collection: CollectionPage;
  muted?: boolean;
}) {
  const [activeTypeId, setActiveTypeId] = useState(collection.types[0]?.id ?? "");
  const activeType = collection.types.find((type) => type.id === activeTypeId) ?? collection.types[0];

  if (!activeType) {
    return null;
  }

  return (
    <Section className={muted ? "border-t bg-muted" : undefined} spacing="sm">
      <Container className="space-y-8">
        <motion.div
          className="grid gap-6 lg:grid-cols-[minmax(0,0.58fr)_minmax(18rem,0.42fr)] lg:items-end"
          initial="hidden"
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.28 }}
          whileInView="visible"
        >
          <div>
            <motion.p className="text-eyebrow font-semibold uppercase text-muted-foreground" variants={fadeUp}>
              {collection.typesTitle}
            </motion.p>
            <motion.h2 className="mt-3 max-w-2xl font-heading text-h1 font-light" variants={fadeUp}>
              Choose your kitchen layout.
            </motion.h2>
          </div>
          <motion.p className="max-w-sm text-sm leading-6 text-muted-foreground lg:justify-self-end" variants={fadeUp}>
            Browse real cabinet visuals, compare layouts, then choose modules that match your room
            size.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-2 md:grid-cols-3 lg:grid-cols-6"
          initial="hidden"
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.25 }}
          whileInView="visible"
        >
          {collection.types.map((type) => {
            const isActive = type.id === activeType.id;

            return (
              <motion.button
                aria-pressed={isActive}
                className={`grid min-h-20 content-start gap-2 border p-3 text-left transition-colors ${
                  isActive
                    ? "border-foreground bg-primary text-primary-foreground"
                    : "bg-card hover:bg-accent"
                }`}
                key={type.id}
                onClick={() => setActiveTypeId(type.id)}
                type="button"
                variants={fadeUp}
              >
                <span
                  className={`text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${
                    isActive ? "text-white/70" : "text-muted-foreground"
                  }`}
                >
                  {type.name.replace(" Kitchen", "").replace("-Shaped", "")}
                </span>
                <span className="text-sm leading-5">{type.name}</span>
              </motion.button>
            );
          })}
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.38fr)]">
          <div className="group relative aspect-[16/10] overflow-hidden border bg-card">
            <AnimatePresence mode="wait">
              <motion.img
                alt={activeType.name}
                className="sm-image-treatment absolute inset-0 size-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.02]"
                initial={{ opacity: 0, scale: 1.015 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                key={activeType.id}
                transition={{ duration: 0.48, ease: easeLuxury }}
                src={activeType.image}
              />
            </AnimatePresence>
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span className="bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
                {activeType.name.split(" ")[0]}
              </span>
              <span className="bg-accent px-3 py-2 text-sm font-medium">
                {activeType.bestFor}
              </span>
            </div>
          </div>

          <aside className="grid content-start gap-5 border bg-card p-card-pad">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeType.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.36, ease: easeLuxury }}
              >
                <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
                  Featured kitchen
                </p>
                <h3 className="mt-3 font-heading text-4xl font-light">{activeType.name}</h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {activeType.description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-2">
              {[
                "16 mm ply carcass",
                "Stone-ready counter",
                "Soft-close hardware",
                "Factory-fitted modules",
              ].map((detail) => (
                <p className="border bg-background p-3 text-xs leading-5" key={detail}>
                  {detail}
                </p>
              ))}
            </div>

            <Button asChild>
              <a href={routes.collection("kitchens")}>
                Explore Modules
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

function ProductsSection({
  collection,
  muted = false,
}: {
  collection: CollectionPage;
  muted?: boolean;
}) {
  const initialVisibleCount = collection.id === "kitchens" ? 8 : collection.products.length;
  const visibleStep = collection.id === "kitchens" ? 8 : collection.products.length;
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(
      collectionProductVisibleCounts.get(collection.id) ?? initialVisibleCount,
      collection.products.length,
    ),
  );
  const visibleProducts = collection.products.slice(0, visibleCount);
  const hasMoreProducts = visibleCount < collection.products.length;
  const hasLoadedMoreProducts = visibleCount > initialVisibleCount;
  const showMoreProducts = () => {
    setVisibleCount((currentCount) => {
      const nextCount = Math.min(currentCount + visibleStep, collection.products.length);
      collectionProductVisibleCounts.set(collection.id, nextCount);
      return nextCount;
    });
  };

  return (
    <Section className={muted ? "border-t bg-muted" : undefined} spacing="sm">
      <Container className="space-y-8">
        <motion.div
          className="flex items-end justify-between gap-5"
          initial="hidden"
          variants={fadeUp}
          viewport={{ once: true, amount: 0.35 }}
          whileInView="visible"
        >
          <div>
            <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
              <Layers3 className="mr-2 inline size-4" aria-hidden="true" />
              {collection.productsTitle}
            </p>
            <h2 className="mt-2 font-heading text-3xl font-light sm:text-4xl">
              Product listing
            </h2>
          </div>
          <p className="hidden max-w-sm text-sm leading-6 text-muted-foreground md:block">
            {collection.id === "kitchens"
              ? "Kitchen modules use the normalized Space Mint product JSON."
              : "These categories follow common online furniture structures and can be replaced with SKU-level JSON when available."}
          </p>
        </motion.div>

        <motion.div
          animate={hasLoadedMoreProducts ? "visible" : undefined}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          layout
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.14 }}
          whileInView="visible"
        >
          {visibleProducts.map((product) => (
            <motion.a
              className="group overflow-hidden rounded-lg border bg-background"
              href={product.href}
              key={product.id}
              layout
              onClick={(event) => handleCollectionProductNavigation(event, product.href)}
              variants={fadeUp}
            >
              <img
                alt={product.name}
                className="sm-image-treatment aspect-[4/3] w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.035]"
                loading="lazy"
                src={product.image}
              />
              <div className="grid gap-3 p-card-pad">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {product.category}
                </p>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-heading text-2xl font-light">{product.name}</h3>
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{product.description}</p>
                {product.meta ? <p className="text-sm font-medium">{product.meta}</p> : null}
              </div>
            </motion.a>
          ))}
        </motion.div>

        {hasMoreProducts ? (
          <motion.div
            className="flex justify-center border-t pt-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: easeLuxury }}
          >
            <Button
              onClick={showMoreProducts}
              variant="secondary"
            >
              View More
              <span className="text-muted-foreground">
                {collection.products.length - visibleCount} left
              </span>
            </Button>
          </motion.div>
        ) : null}
      </Container>
    </Section>
  );
}

function handleCollectionProductNavigation(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("#")) {
    return;
  }

  event.preventDefault();
  navigateToHash(href);
}
