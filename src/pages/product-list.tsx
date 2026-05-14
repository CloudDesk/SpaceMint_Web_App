import {
  ArrowLeft,
  ArrowUpRight,
  Grid2X2,
  LayoutList,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Container } from "@/components/primitives/container";
import { Section } from "@/components/primitives/section";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { buildCollectionPages } from "@/data/collections";
import type { CollectionProduct } from "@/data/collections";
import { useProducts } from "@/hooks/use-products";
import { fadeUp, staggerContainer } from "@/lib/animation";
import { cn } from "@/lib/utils";

type CatalogItem = CollectionProduct & {
  collectionId: string;
  collectionLabel: string;
  searchText: string;
};

type SortId = "featured" | "name" | "category";
type ViewMode = "grid" | "compact";

export function ProductListPage() {
  const { products } = useProducts();
  const collectionPages = useMemo(() => buildCollectionPages(products), [products]);
  const catalogItems = useMemo(
    () => collectionPages.flatMap((collection) =>
      collection.products.map((product) => ({
        ...product,
        collectionId: collection.id,
        collectionLabel: collection.label,
        searchText: [
          product.name,
          product.category,
          product.description,
          product.meta,
          collection.label,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
      })),
    ),
    [collectionPages],
  );
  const categoryFilters = useMemo(
    () => [
      { id: "all", label: "All" },
      ...collectionPages.map((collection) => ({
        id: collection.id,
        label: collection.label,
      })),
    ],
    [collectionPages],
  );
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortId, setSortId] = useState<SortId>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const normalizedQuery = query.trim().toLowerCase();
  const visibleProducts = useMemo(() => {
    const filteredProducts = catalogItems.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.collectionId === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        normalizedQuery
          .split(/\s+/)
          .every((token) => product.searchText.includes(token));

      return matchesCategory && matchesQuery;
    });

    return [...filteredProducts].sort((first, second) => {
      if (sortId === "name") {
        return first.name.localeCompare(second.name);
      }

      if (sortId === "category") {
        return first.category.localeCompare(second.category);
      }

      return catalogItems.indexOf(first) - catalogItems.indexOf(second);
    });
  }, [activeCategory, catalogItems, normalizedQuery, sortId]);

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
        <Container className="grid gap-8">
          <motion.div
            animate="visible"
            className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
            initial="hidden"
            variants={staggerContainer}
          >
            <motion.div className="space-y-4" variants={fadeUp}>
              <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
                Product index
              </p>
              <h1 className="max-w-4xl font-heading text-h1 font-light">
                All Space Mint systems in one place.
              </h1>
            </motion.div>
            <motion.div className="grid gap-1 border-l pl-5" variants={fadeUp}>
              <span className="font-heading text-4xl font-light">
                {visibleProducts.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {visibleProducts.length === 1 ? "product" : "products"}
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            animate="visible"
            className="grid gap-3 border bg-background p-3 lg:grid-cols-[minmax(18rem,1fr)_auto_auto]"
            initial="hidden"
            variants={fadeUp}
          >
            <label className="relative block">
              <span className="sr-only">Search products</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                className="h-12 w-full border bg-background pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search modules, categories, sizes, or systems"
                type="search"
                value={query}
              />
            </label>

            <label className="relative block">
              <span className="sr-only">Sort products</span>
              <SlidersHorizontal
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <select
                className="h-12 min-w-44 appearance-none border bg-background pl-11 pr-8 text-sm outline-none transition-colors focus:border-foreground"
                onChange={(event) => setSortId(event.target.value as SortId)}
                value={sortId}
              >
                <option value="featured">Featured</option>
                <option value="name">Name</option>
                <option value="category">Category</option>
              </select>
            </label>

            <div className="grid grid-cols-2 border">
              <ProductViewButton
                isActive={viewMode === "grid"}
                label="Grid view"
                onClick={() => setViewMode("grid")}
              >
                <Grid2X2 className="size-4" aria-hidden="true" />
              </ProductViewButton>
              <ProductViewButton
                isActive={viewMode === "compact"}
                label="Compact view"
                onClick={() => setViewMode("compact")}
              >
                <LayoutList className="size-4" aria-hidden="true" />
              </ProductViewButton>
            </div>
          </motion.div>

          <motion.div
            animate="visible"
            className="flex flex-wrap gap-2"
            initial="hidden"
            variants={staggerContainer}
          >
            {categoryFilters.map((category) => (
              <motion.button
                className={cn(
                  "h-10 border px-4 text-sm transition-colors",
                  activeCategory === category.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background hover:bg-accent",
                )}
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                type="button"
                variants={fadeUp}
              >
                {category.label}
              </motion.button>
            ))}
          </motion.div>
        </Container>
      </Section>

      <Section spacing="sm">
        <Container>
          {visibleProducts.length ? (
            <motion.div
              animate="visible"
              className={cn(
                "grid gap-4",
                viewMode === "grid" && "sm:grid-cols-2 lg:grid-cols-4",
                viewMode === "compact" && "lg:grid-cols-2",
              )}
              initial="hidden"
              variants={staggerContainer}
            >
              {visibleProducts.map((product) => (
                <ProductIndexCard
                  key={`${product.collectionId}-${product.id}`}
                  product={product}
                  viewMode={viewMode}
                />
              ))}
            </motion.div>
          ) : (
            <div className="grid min-h-72 place-items-center border bg-muted p-8 text-center">
              <div>
                <p className="font-heading text-3xl font-light">
                  No products found
                </p>
                <Button
                  className="mt-5"
                  onClick={() => {
                    setQuery("");
                    setActiveCategory("all");
                  }}
                  variant="secondary"
                >
                  Reset filters
                </Button>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </article>
  );
}

function ProductIndexCard({
  product,
  viewMode,
}: {
  product: CatalogItem;
  viewMode: ViewMode;
}) {
  return (
    <motion.a
      className={cn(
        "group overflow-hidden rounded-lg border bg-background transition-colors hover:bg-accent",
        viewMode === "compact" && "grid sm:grid-cols-[13rem_1fr]",
      )}
      href={product.href}
      variants={fadeUp}
    >
      <img
        alt={product.name}
        className={cn(
          "sm-image-treatment w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.035]",
          viewMode === "grid" && "aspect-[4/3]",
          viewMode === "compact" && "aspect-[4/3] h-full",
        )}
        loading="lazy"
        src={product.image}
      />
      <div className="grid content-between gap-4 p-card-pad">
        <div className="grid gap-3">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {product.collectionLabel} / {product.category}
            </p>
            <ArrowUpRight
              className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
              aria-hidden="true"
            />
          </div>
          <h2 className="font-heading text-2xl font-light">{product.name}</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {product.description}
          </p>
        </div>
        {product.meta ? (
          <p className="w-fit border bg-background px-3 py-2 text-sm font-medium">
            {product.meta}
          </p>
        ) : null}
      </div>
    </motion.a>
  );
}

function ProductViewButton({
  children,
  isActive,
  label,
  onClick,
}: {
  children: ReactNode;
  isActive: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={isActive}
      className={cn(
        "grid h-12 w-12 place-items-center transition-colors",
        isActive ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
