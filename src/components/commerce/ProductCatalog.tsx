import { ArrowRight, ChevronLeft, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import type { KitchenProduct } from "../../data/kitchenProducts";
import { productColourOptions } from "../../data/siteContent";
import {
  formatCurrency,
  getKitchenProductInitialOption,
  getKitchenProductPrice,
} from "../../lib/commerce";
import { routes } from "../../config/routes";
import type { ProductActionHandlers } from "../../types/commerce";
import { useAppNavigation } from "../../hooks/useAppNavigation";

type ProductCatalogProps = ProductActionHandlers & {
  products: KitchenProduct[];
};

export function ProductCatalog({ addProductToCart, products }: ProductCatalogProps) {
  const navigation = useAppNavigation();
  const [activeSubcategory, setActiveSubcategory] = useState("All");
  const [allProductLimit, setAllProductLimit] = useState(4);
  const subcategories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.subcategory)))],
    [products],
  );
  const visibleProducts =
    activeSubcategory === "All"
      ? products
      : products.filter((product) => product.subcategory === activeSubcategory);
  const displayedProducts =
    activeSubcategory === "All" ? visibleProducts.slice(0, allProductLimit) : visibleProducts;
  const canToggleProducts = activeSubcategory === "All" && visibleProducts.length > 4;
  const hasMoreProducts = activeSubcategory === "All" && allProductLimit < visibleProducts.length;
  const canShowFewerProducts = activeSubcategory === "All" && allProductLimit > 4;

  const showMoreProducts = () => {
    setAllProductLimit((limit) => Math.min(limit + 4, visibleProducts.length));
  };

  const showFewerProducts = () => {
    setAllProductLimit((limit) => {
      const nextLimit = Math.max(4, limit - 4);
      if (nextLimit === 4) {
        window.setTimeout(() => {
          document.getElementById("kitchen-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      }

      return nextLimit;
    });
  };

  return (
    <section className="kitchen-catalog-section" id="kitchen-products">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Kitchen product catalogue</p>
          <h2>Kitchen modules.</h2>
        </div>
        <p>{products.length} modules with size, code, material specs and 3D model slots.</p>
      </div>

      <div className="catalog-filters" aria-label="Kitchen product filters">
        {subcategories.map((subcategory) => (
          <button
            key={subcategory}
            className={activeSubcategory === subcategory ? "active" : ""}
            type="button"
            onClick={() => {
              setActiveSubcategory(subcategory);
              setAllProductLimit(4);
            }}
          >
            {subcategory}
          </button>
        ))}
      </div>

      <div className="kitchen-product-grid">
        {displayedProducts.map((product) => (
          <article
            className="kitchen-product-card"
            key={product.id}
            role="button"
            tabIndex={0}
            onClick={() => navigation.navigateToTarget({ path: routes.product(product.id) })}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigation.navigateToTarget({ path: routes.product(product.id) });
              }
            }}
          >
            <div className="product-card-model" aria-hidden="true">
              {product.modelUrl ? (
                <model-viewer
                  src={product.modelUrl}
                  alt={`${product.name} 3D modular unit`}
                  auto-rotate="true"
                  camera-orbit="35deg 62deg auto"
                  environment-image="neutral"
                  exposure="1"
                  field-of-view="30deg"
                  loading="lazy"
                  reveal="auto"
                  shadow-intensity="0.78"
                  shadow-softness="0.84"
                />
              ) : (
                <div className="product-card-model-placeholder">
                  <span>3D model pending</span>
                </div>
              )}
            </div>
            <div className="product-card-details">
              <div className="product-card-topline">
                <span>{String(product.serialNumber).padStart(2, "0")}</span>
                <strong>{product.code}</strong>
              </div>
              <div className="product-price-line">{formatCurrency(getKitchenProductPrice(product))}</div>
              <h3>{product.name}</h3>
              <p>{product.specs.summary}</p>
              <div className="product-meta-grid">
                <span>
                  <small>Subcategory</small>
                  {product.subcategory}
                </span>
                <span>
                  <small>Size</small>
                  {product.size?.label ?? "To be confirmed"}
                </span>
              </div>
              <div className="product-highlights">
                {(product.specs.highlights ?? product.specs.hardware).slice(0, 3).map((highlight) => (
                  <span key={highlight}>{highlight}</span>
                ))}
              </div>
              <button
                className="product-card-cart-button"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  addProductToCart(product, getKitchenProductInitialOption(product), productColourOptions[0]);
                }}
              >
                Add to Cart
                <ShoppingBag size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {canToggleProducts ? (
        <div className="catalog-more">
          {canShowFewerProducts ? (
            <button type="button" onClick={showFewerProducts}>
              <ChevronLeft size={18} />
              View less
            </button>
          ) : null}
          {hasMoreProducts ? (
            <button type="button" onClick={showMoreProducts}>
              View more
              <ArrowRight size={18} />
            </button>
          ) : null}
          <span>
            Showing {displayedProducts.length} of {visibleProducts.length}
          </span>
        </div>
      ) : null}
    </section>
  );
}
