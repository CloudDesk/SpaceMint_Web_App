import {
  ArrowRight,
  Check,
  ChevronLeft,
  Grid3X3,
  Ruler,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { KitchenProduct } from "../data/kitchenProducts";
import { productColourGroups, productColourOptions } from "../data/siteContent";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useModelMaterial } from "../hooks/useModelMaterial";
import {
  findKitchenVariantProduct,
  formatCurrency,
  getKitchenProductInitialOption,
  getKitchenProductPrice,
  getKitchenProductVariantOptions,
  getProductStageBackground,
} from "../lib/commerce";
import type { ProductActionHandlers } from "../types/commerce";

type ProductDetailPageProps = ProductActionHandlers & {
  products: KitchenProduct[];
};

export function ProductDetailPage({
  addProductToCart,
  buyProductNow,
  products,
}: ProductDetailPageProps) {
  const { productId = "" } = useParams();
  const navigation = useAppNavigation();
  const routeProduct = products.find((item) => item.id === productId);
  const [activeProduct, setActiveProduct] = useState<KitchenProduct | null>(routeProduct ?? null);
  const [selectedVariant, setSelectedVariant] = useState(
    routeProduct ? getKitchenProductInitialOption(routeProduct) : "",
  );
  const [selectedColour, setSelectedColour] = useState(productColourOptions[0]);
  const detailModelViewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!routeProduct) {
      setActiveProduct(null);
      return;
    }

    setActiveProduct(routeProduct);
    setSelectedVariant(getKitchenProductInitialOption(routeProduct));
    setSelectedColour(productColourOptions[0]);
  }, [routeProduct]);

  useModelMaterial(detailModelViewerRef, activeProduct?.modelUrl, selectedColour);

  const detailHighlights = activeProduct
    ? activeProduct.specs.highlights ?? activeProduct.specs.hardware
    : [];
  const specSections = useMemo(
    () => (activeProduct ? buildSpecSections(activeProduct, selectedColour.label, detailHighlights) : []),
    [activeProduct, detailHighlights, selectedColour.label],
  );

  if (!activeProduct) {
    return (
      <section className="page-flow product-detail-page" aria-label="Product not found">
        <div className="product-detail-panel">
          <div className="product-detail-header">
            <div className="product-detail-title">
              <span>Not found</span>
              <h3>Product unavailable</h3>
              <p>This module is not available in the current catalogue.</p>
            </div>
            <button type="button" onClick={navigation.navigateKitchen}>
              <ChevronLeft size={16} />
              Back to catalogue
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-flow product-detail-page" aria-label={`${activeProduct.name} details`}>
      <div className="product-detail-panel">
        <div className="product-detail-header">
          <div className="product-detail-title">
            <span>{activeProduct.code}</span>
            <h3>{activeProduct.name}</h3>
            <p>
              {activeProduct.subcategory} / {activeProduct.size?.label ?? "Size to be confirmed"}
            </p>
          </div>
          <button type="button" onClick={navigation.navigateKitchen}>
            <ChevronLeft size={16} />
            Back to catalogue
          </button>
        </div>

        <div className="product-detail-body">
          <div className="product-detail-model-stage" style={getProductStageBackground(selectedColour)}>
            {activeProduct.modelUrl ? (
              <model-viewer
                ref={detailModelViewerRef}
                src={activeProduct.modelUrl}
                alt={`${activeProduct.name} 3D modular unit`}
                auto-rotate="true"
                camera-controls="true"
                camera-orbit="45deg 58deg auto"
                environment-image="neutral"
                exposure="1"
                field-of-view="28deg"
                max-camera-orbit="auto auto 12m"
                max-field-of-view="48deg"
                min-camera-orbit="auto auto 0.22m"
                min-field-of-view="8deg"
                loading="eager"
                reveal="auto"
                shadow-intensity="0.9"
                shadow-softness="0.82"
              />
            ) : (
              <div className="model-placeholder">
                <span>3D model pending</span>
              </div>
            )}
            <div className="model-stage-label">
              <span>Space Mint module</span>
              <strong>{activeProduct.code}</strong>
            </div>
            <div className="product-model-badges">
              <span>{selectedVariant}</span>
              <span>{selectedColour.label}</span>
            </div>
            <div className="selected-material-swatch" style={{ background: selectedColour.swatch }} />
          </div>

          <div className="product-detail-copy">
            <div className="detail-summary-card">
              <p className="eyebrow">Module snapshot</p>
              <h2>{activeProduct.name}</h2>
              <p>{activeProduct.specs.summary}</p>
              <div className="detail-price-line">
                <span>Unit price</span>
                <strong>{formatCurrency(getKitchenProductPrice(activeProduct))}</strong>
              </div>
              <div className="detail-status-row">
                <span>Plywood core</span>
                <span>{activeProduct.modelUrl ? "3D ready" : "3D pending"}</span>
                <span>Quote ready</span>
              </div>
            </div>

            <div className="product-detail-meta">
              <span>
                <small>Code</small>
                {activeProduct.code}
              </span>
              <span>
                <small>Size</small>
                {activeProduct.size?.label ?? "To be confirmed"}
              </span>
              <span>
                <small>Category</small>
                {activeProduct.subcategory}
              </span>
              <span>
                <small>Unit price</small>
                {formatCurrency(getKitchenProductPrice(activeProduct))}
              </span>
            </div>

            <div className="detail-actions">
              <button
                className="primary-action dark"
                type="button"
                onClick={() => addProductToCart(activeProduct, selectedVariant, selectedColour)}
              >
                Add to Cart
                <ArrowRight size={18} />
              </button>
              <button
                className="buy-now-button"
                type="button"
                onClick={() => buyProductNow(activeProduct, selectedVariant, selectedColour)}
              >
                Buy Now
                <ShoppingBag size={18} />
              </button>
            </div>

            <div className="variant-section">
              <h4>Choose a Variant</h4>
              <div className="variant-grid">
                {getKitchenProductVariantOptions(activeProduct).map((variant) => {
                  const variantProduct = findKitchenVariantProduct(variant, activeProduct, products);

                  return (
                    <button
                      key={variant}
                      type="button"
                      className={selectedVariant === variant ? "active" : ""}
                      disabled={!variantProduct}
                      onClick={() => {
                        if (!variantProduct) return;
                        setActiveProduct(variantProduct);
                        setSelectedVariant(variant);
                      }}
                    >
                      {variant}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="variant-section">
              <h4>Choose Colour Finish</h4>
              <div className="colour-group-list">
                {productColourGroups.map((group) => (
                  <div className="colour-group" key={group.group}>
                    <h5>{group.group}</h5>
                    <div className="colour-option-grid">
                      {group.options.map((colour) => (
                        <button
                          key={colour.label}
                          type="button"
                          className={selectedColour.label === colour.label ? "active" : ""}
                          onClick={() => setSelectedColour({ ...colour, group: group.group })}
                        >
                          <span style={{ background: colour.swatch }} />
                          {colour.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="selected-config-panel">
              <span>Selected configuration</span>
              <strong>{selectedVariant} / {selectedColour.label}</strong>
              <p>{activeProduct.size?.label ?? "Size to be confirmed"}</p>
            </div>

            <div className="detail-spec-map" aria-label="Product detail sections">
              {specSections.map((section, index) => (
                <a href={`#${section.id}`} key={section.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </a>
              ))}
            </div>

            <div className="product-spec-card-grid">
              <section className="product-spec-card detail-description-section" id="detail-overview">
                <div className="product-spec-card-heading">
                  <span>00</span>
                  <div>{renderSpecIcon("highlights")}</div>
                </div>
                <h4>Overview</h4>
                <p>
                  A made-to-order Space Mint kitchen module designed for clean alignment, daily durability
                  and a refined built-in look. Configure the shutter variant and finish to match your kitchen
                  palette before adding it to your estimate cart.
                </p>
                <div className="detail-feature-grid">
                  <span>Factory-built plywood body</span>
                  <span>Premium modular finish</span>
                  <span>Soft neutral kitchen styling</span>
                  <span>Ready for quotation flow</span>
                </div>
              </section>

              {specSections.map((section, index) => (
                <section className="product-spec-card" id={section.id} key={section.id}>
                  <div className="product-spec-card-heading">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>{renderSpecIcon(section.icon)}</div>
                  </div>
                  <h4>{section.title}</h4>
                  <p>{section.summary}</p>
                  <div className="product-spec-row-list">
                    {section.rows.map((row) => (
                      <span key={row}>
                        <Check size={14} />
                        {row}
                      </span>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="variant-section detail-spec-list-section">
              <h4>Quick Specifications</h4>
              <div className="detail-spec-list">
                <span>{activeProduct.specs.coreMaterial ?? "Core material to be confirmed"}</span>
                <span>{activeProduct.specs.finish ?? "Finish to be confirmed"}</span>
                {detailHighlights.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function buildSpecSections(product: KitchenProduct, selectedColour: string, highlights: string[]) {
  return [
    {
      id: "detail-material",
      icon: "material",
      title: "Core Material",
      summary: product.specs.coreMaterial ?? "Core material to be confirmed",
      rows: [
        product.specs.coreMaterial ?? "Core material to be confirmed",
        "Factory-built carcass",
        "Kitchen-grade modular body",
      ],
    },
    {
      id: "detail-dimensions",
      icon: "dimensions",
      title: "Dimensions",
      summary: product.size?.label ?? "Size to be confirmed",
      rows: product.size
        ? [
            `Width ${product.size.width} ${product.size.unit}`,
            `Height ${product.size.height} ${product.size.unit}`,
            `Depth ${product.size.depth} ${product.size.unit}`,
          ]
        : ["Final dimensions to be confirmed during site measurement"],
    },
    {
      id: "detail-finish",
      icon: "finish",
      title: "Finish",
      summary: selectedColour,
      rows: [
        product.specs.finish ?? "Finish to be confirmed",
        `Selected colour: ${selectedColour}`,
      ],
    },
    {
      id: "detail-hardware",
      icon: "hardware",
      title: "Hardware & Comfort",
      summary: product.specs.hardware.length ? product.specs.hardware.join(" / ") : "Hardware to be confirmed",
      rows: product.specs.hardware.length ? product.specs.hardware : ["Hardware to be confirmed"],
    },
    {
      id: "detail-highlights",
      icon: "highlights",
      title: "Product Highlights",
      summary: highlights.length ? highlights[0] : "Highlights to be confirmed",
      rows: highlights.length ? highlights : ["Highlights to be confirmed"],
    },
  ];
}

function renderSpecIcon(icon: string) {
  if (icon === "material") return <Grid3X3 size={18} />;
  if (icon === "dimensions") return <Ruler size={18} />;
  if (icon === "finish") return <Sparkles size={18} />;
  if (icon === "hardware") return <SlidersHorizontal size={18} />;
  return <Check size={18} />;
}
