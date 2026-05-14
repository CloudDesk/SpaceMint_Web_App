import { Search } from "lucide-react";
import type { FormEvent, MouseEvent } from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { routes } from "@/config/routes";
import type { Product } from "@/data/products";
import { useProducts } from "@/hooks/use-products";
import { navigateToHash } from "@/lib/scroll";

type ProductSearchModalProps = {
  triggerClassName?: string;
};

const FEATURED_RESULT_COUNT = 6;
const MAX_RESULT_COUNT = 12;

export function ProductSearchModal({ triggerClassName }: ProductSearchModalProps) {
  const { products } = useProducts();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const normalizedQuery = normalizeSearchValue(query);
  const results = useMemo(
    () => getProductSearchResults(normalizedQuery, products),
    [normalizedQuery, products],
  );
  const isSearching = normalizedQuery.length > 0;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setQuery("");
    }
  };

  const handleResultClick = (
    event: MouseEvent<HTMLAnchorElement>,
    productId: string,
  ) => {
    event.preventDefault();
    setOpen(false);
    setQuery("");
    navigateToHash(routes.product(productId));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!results.length) {
      return;
    }

    setOpen(false);
    setQuery("");
    navigateToHash(routes.product(results[0].product.id));
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalTrigger asChild>
        <Button
          aria-label="Search products"
          className={triggerClassName}
          size="icon"
          variant="ghost"
        >
          <Search className="size-4" aria-hidden="true" />
        </Button>
      </ModalTrigger>
      <ModalContent className="max-w-5xl gap-6 p-0">
        <ModalHeader className="border-b px-6 pb-5 pt-6 sm:px-8 sm:pt-8">
          <ModalTitle className="font-heading text-3xl font-light">
            Search products
          </ModalTitle>
          <ModalDescription className="sr-only">
            Search Space Mint products by name, product code, size, category, or material.
          </ModalDescription>
        </ModalHeader>

        <form className="px-6 sm:px-8" onSubmit={handleSubmit}>
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              autoFocus
              className="h-14 w-full rounded-sm border border-border bg-background pl-11 pr-4 font-heading text-lg font-light outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by product, code, size, or module"
              type="search"
              value={query}
            />
          </label>
        </form>

        <div className="grid gap-3 px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="flex items-center justify-between gap-4 border-b pb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {isSearching ? "Results" : "Featured modules"}
            </p>
            <p className="text-xs text-muted-foreground">
              {results.length} {results.length === 1 ? "product" : "products"}
            </p>
          </div>

          {results.length ? (
            <ul className="grid max-h-[min(52vh,34rem)] gap-2 overflow-auto pr-1 lg:grid-cols-2">
              {results.map(({ product }) => (
                <li key={product.id}>
                  <a
                    className="group grid gap-2 rounded-sm border bg-background p-4 transition-colors hover:border-foreground hover:bg-accent"
                    href={routes.product(product.id)}
                    onClick={(event) => handleResultClick(event, product.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-heading text-xl font-light">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {product.category} / {product.subcategory}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                        {product.code}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {product.size?.label ? (
                        <span className="border bg-background px-2.5 py-1">
                          {product.size.label}
                        </span>
                      ) : null}
                      <span className="border bg-background px-2.5 py-1">
                        {product.specs.coreMaterial ?? product.specs.summary}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid min-h-40 place-items-center border bg-muted p-6 text-center">
              <p className="font-heading text-2xl font-light">
                No products found
              </p>
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}

function getProductSearchResults(query: string, products: Product[]) {
  if (!query) {
    return products.slice(0, FEATURED_RESULT_COUNT).map((product) => ({
      product,
      score: 0,
    }));
  }

  return products
    .map((product) => ({
      product,
      score: getProductSearchScore(product, query),
    }))
    .filter((result) => result.score > 0)
    .sort((first, second) => {
      if (second.score !== first.score) {
        return second.score - first.score;
      }

      return first.product.serialNumber - second.product.serialNumber;
    })
    .slice(0, MAX_RESULT_COUNT);
}

function getProductSearchScore(product: Product, query: string) {
  const tokens = query.split(" ").filter(Boolean);
  const searchableText = normalizeSearchValue(
    [
      product.name,
      product.code,
      product.category,
      product.subcategory,
      product.size?.label,
      product.specs.summary,
      product.specs.coreMaterial,
      product.specs.finish,
      product.specs.hardware?.join(" "),
    ]
      .filter(Boolean)
      .join(" "),
  );

  if (!tokens.every((token) => searchableText.includes(token))) {
    return 0;
  }

  let score = 1;

  if (normalizeSearchValue(product.code ?? "").includes(query)) {
    score += 42;
  }

  if (normalizeSearchValue(product.name).startsWith(query)) {
    score += 36;
  } else if (normalizeSearchValue(product.name).includes(query)) {
    score += 24;
  }

  if (normalizeSearchValue(product.subcategory).includes(query)) {
    score += 16;
  }

  if (normalizeSearchValue(product.size?.label ?? "").includes(query)) {
    score += 10;
  }

  return score;
}

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
