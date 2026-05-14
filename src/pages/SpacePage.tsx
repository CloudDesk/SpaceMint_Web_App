import { ArrowRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import {
  assets,
  livingDesigns,
  livingDetails,
  wardrobeDesigns,
  wardrobeDetails,
} from "../data/siteContent";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { ProcessQuoteSections } from "../components/sections/ProcessQuoteSections";

type SpacePageKind = "living" | "wardrobe";

type SpacePageProps = {
  kind: SpacePageKind;
};

export function SpacePage({ kind }: SpacePageProps) {
  const navigation = useAppNavigation();
  const [activeDesign, setActiveDesign] = useState(0);
  const content = getSpaceContent(kind);
  const currentDesign = content.designs[activeDesign];

  return (
    <main id="top">
      <section className={`kitchen-page-hero ${content.heroClassName}`}>
        <div>
          <button className="back-link" type="button" onClick={navigation.navigateHome}>
            <ChevronLeft size={16} />
            Back to home
          </button>
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </div>
        <img src={content.heroImage} alt={content.heroAlt} />
      </section>

      <section className={`kitchen-section ${content.sectionClassName}`} id={content.sectionId}>
        <div className="kitchen-intro">
          <div>
            <p className="eyebrow">{content.designEyebrow}</p>
            <h2>{content.designTitle}</h2>
          </div>
          <p>{content.designCopy}</p>
        </div>

        <div className="kitchen-layout-tabs" aria-label={content.tabsLabel}>
          {content.designs.map((design, index) => (
            <button
              key={design.title}
              className={activeDesign === index ? "active" : ""}
              onClick={() => setActiveDesign(index)}
              type="button"
            >
              <span>{design.layout}</span>
              {design.title}
            </button>
          ))}
        </div>

        <div className="kitchen-stage">
          <div className="kitchen-feature reveal" key={currentDesign.title}>
            <img src={currentDesign.image} alt={currentDesign.title} />
            <div className="kitchen-feature-meta">
              <span>{currentDesign.layout}</span>
              <strong>{currentDesign.price}</strong>
            </div>
          </div>
          <div className="kitchen-panel reveal">
            <p className="eyebrow">{content.featureEyebrow}</p>
            <h3>{currentDesign.title}</h3>
            <p>{currentDesign.description}</p>
            <div className="kitchen-spec-grid">
              {content.specs.map((spec) => (
                <span key={spec}>{spec}</span>
              ))}
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
          {content.details.map((detail, index) => (
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

      <ProcessQuoteSections />
    </main>
  );
}

function getSpaceContent(kind: SpacePageKind) {
  if (kind === "wardrobe") {
    return {
      description: "Hinged, display, loft and full-wall bedroom storage.",
      designCopy: "Browse wardrobe systems, then request an estimate.",
      designEyebrow: "Wardrobe designs",
      designTitle: "Choose your wardrobe style.",
      designs: wardrobeDesigns,
      details: wardrobeDetails,
      eyebrow: "Wardrobe spaces",
      featureEyebrow: "Featured wardrobe",
      heroAlt: "Space Mint bedroom wardrobe system",
      heroClassName: "wardrobe-page-hero",
      heroImage: assets.wardrobeClassic,
      sectionClassName: "wardrobe-section",
      sectionId: "wardrobe-spaces",
      specs: ["Plywood frame", "Loft storage", "Soft-close fittings", "Custom internals"],
      tabsLabel: "Wardrobe layout categories",
      title: "Wardrobe systems.",
    };
  }

  return {
    description: "Media consoles, wall units, tables and storage systems.",
    designCopy: "Browse TV units, tables and wall storage.",
    designEyebrow: "Living room designs",
    designTitle: "Choose your living system.",
    designs: livingDesigns,
    details: livingDetails,
    eyebrow: "Living room spaces",
    featureEyebrow: "Featured living system",
    heroAlt: "Space Mint living room TV unit",
    heroClassName: "living-page-hero",
    heroImage: assets.livingWallUnit,
    sectionClassName: "living-section",
    sectionId: "living-spaces",
    specs: ["Media-ready storage", "Drawer modules", "Soft-close fittings", "Custom finishes"],
    tabsLabel: "Living room categories",
    title: "TV units and living tables.",
  };
}
