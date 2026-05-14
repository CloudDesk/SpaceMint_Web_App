import { ArrowRight, Check, ChevronLeft, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import type { KitchenProduct } from "../data/kitchenProducts";
import { ProductCatalog } from "../components/commerce/ProductCatalog";
import { ProcessQuoteSections } from "../components/sections/ProcessQuoteSections";
import {
  assets,
  kitchenCabinetDetails,
  kitchenDesigns,
  systemDetails,
} from "../data/siteContent";
import { useAppNavigation } from "../hooks/useAppNavigation";
import type { ProductActionHandlers } from "../types/commerce";

type KitchenPageProps = ProductActionHandlers & {
  products: KitchenProduct[];
};

export function KitchenPage({ addProductToCart, buyProductNow, products }: KitchenPageProps) {
  const navigation = useAppNavigation();
  const [activeKitchen, setActiveKitchen] = useState(0);
  const currentKitchen = kitchenDesigns[activeKitchen];

  return (
    <>
      <main id="top">
        <div className="kitchen-page-content">
          <section className="kitchen-page-hero">
            <div>
              <button className="back-link" type="button" onClick={navigation.navigateHome}>
                <ChevronLeft size={16} />
                Back to home
              </button>
              <p className="eyebrow">Kitchen spaces</p>
              <h1>Kitchen cabinet systems.</h1>
              <p>Layouts, cabinet details and estimate-ready modules.</p>
            </div>
            <img src={assets.kitchenWide} alt="Space Mint linear modular kitchen" />
          </section>

          <section className="kitchen-section" id="kitchen-spaces">
            <div className="kitchen-intro">
              <div>
                <p className="eyebrow">Kitchen cabinet designs</p>
                <h2>Choose your kitchen layout.</h2>
              </div>
              <p>Browse real cabinet visuals, then request an estimate.</p>
            </div>

            <div className="kitchen-layout-tabs" aria-label="Kitchen layout categories">
              {kitchenDesigns.map((design, index) => (
                <button
                  key={design.title}
                  className={activeKitchen === index ? "active" : ""}
                  onClick={() => setActiveKitchen(index)}
                  type="button"
                >
                  <span>{design.layout}</span>
                  {design.title}
                </button>
              ))}
            </div>

            <div className="kitchen-stage">
              <div className="kitchen-feature reveal" key={currentKitchen.title}>
                <img src={currentKitchen.image} alt={currentKitchen.title} />
                <div className="kitchen-feature-meta">
                  <span>{currentKitchen.layout}</span>
                  <strong>{currentKitchen.price}</strong>
                </div>
              </div>
              <div className="kitchen-panel reveal">
                <p className="eyebrow">Featured kitchen</p>
                <h3>{currentKitchen.title}</h3>
                <p>{currentKitchen.description}</p>
                <div className="kitchen-spec-grid">
                  <span>16 mm plywood carcass</span>
                  <span>Stone-ready counter</span>
                  <span>Soft-close hardware</span>
                  <span>Factory-fitted modules</span>
                </div>
                <div className="kitchen-panel-actions">
                  <a className="primary-action dark" href="#quote">
                    Get Free Estimate
                    <ArrowRight size={18} />
                  </a>
                  <a className="secondary-action dark" href="#process">
                    How it works
                  </a>
                </div>
              </div>
            </div>

            <div className="cabinet-detail-grid">
              {kitchenCabinetDetails.map((detail, index) => (
                <article className="cabinet-detail-card reveal" key={detail.title}>
                  <img src={detail.image} alt={detail.title} />
                  <div>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{detail.title}</h3>
                    <p>{detail.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <ProductCatalog
            addProductToCart={addProductToCart}
            buyProductNow={buyProductNow}
            products={products}
          />

          <FeaturedKitchenSystem />
        </div>
        <ProcessQuoteSections />
      </main>
    </>
  );
}

function FeaturedKitchenSystem() {
  return (
    <section className="product-section" id="product">
      <div className="product-gallery reveal">
        <img
          className="main-product-image"
          src={assets.kitchenIsland}
          alt="Premium kitchen with island and modular cabinetry"
        />
        <div className="thumb-grid">
          <img src={assets.kitchenTall} alt="Kitchen cabinet detail" />
          <img src={assets.kitchenLinear} alt="Interior storage detail" />
        </div>
      </div>
      <div className="product-copy reveal">
        <p className="eyebrow">Featured system</p>
        <h2>Astra Plywood Kitchen System</h2>
        <p>Gallery, specs and consultation in one place.</p>
        <div className="spec-list">
          {systemDetails.map((detail) => (
            <span key={detail}>
              <Check size={16} />
              {detail}
            </span>
          ))}
        </div>
        <div className="config-panel">
          <div>
            <SlidersHorizontal size={18} />
            <span>Configuration</span>
          </div>
          <p>Island, tall pantry, appliance tower, under-counter drawers, overhead shutters.</p>
        </div>
        <div className="product-actions">
          <a className="primary-action dark" href="#quote">
            Request Quote
            <ArrowRight size={18} />
          </a>
          <a className="secondary-action dark" href="#process">
            View Process
          </a>
        </div>
      </div>
    </section>
  );
}
