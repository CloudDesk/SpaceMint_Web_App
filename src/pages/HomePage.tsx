import { ArrowRight, Check, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { ProcessQuoteSections } from "../components/sections/ProcessQuoteSections";
import {
  assets,
  finishes,
  heroSlides,
  homeSpaceSlides,
  productFamilies,
  systemDetails,
} from "../data/siteContent";
import type { FinishOption } from "../types/commerce";

export function HomePage() {
  const navigation = useAppNavigation();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeSpace, setActiveSpace] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState<FinishOption>(finishes[0]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((slide) => (slide + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSpace((space) => (space + 1) % homeSpaceSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  const currentSlide = heroSlides[activeSlide];
  const currentSpace = homeSpaceSlides[activeSpace];
  const selectedFinishIndex = Math.max(0, finishes.findIndex((finish) => finish.label === selectedFinish.label));

  return (
    <main id="top">
      <section className="hero-section">
        <div className="hero-media" key={currentSlide.title}>
          {currentSlide.mediaType === "video" ? (
            <video
              src={currentSlide.media}
              autoPlay
              muted
              loop
              playsInline
              aria-label="Space Mint modular interior video"
            />
          ) : (
            <img src={currentSlide.media} alt={currentSlide.title} />
          )}
        </div>
        <div className="carousel-controls" aria-label="Hero carousel controls">
          <button type="button" onClick={() => setActiveSlide((slide) => (slide === 0 ? heroSlides.length - 1 : slide - 1))} aria-label="Previous slide">
            <ChevronLeft size={20} />
          </button>
          <div className="carousel-dots">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                className={activeSlide === index ? "active" : ""}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`}
              />
            ))}
          </div>
          <button type="button" onClick={() => setActiveSlide((slide) => (slide + 1) % heroSlides.length)} aria-label="Next slide">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="hero-strip">
          <span>Water resistant</span>
          <span>Termite proof</span>
          <span>Factory built</span>
          <span>Custom fitted</span>
        </div>
      </section>

      <section className="home-space-carousel" id="spaces">
        <div className="home-space-media reveal" key={currentSpace.title}>
          <img src={currentSpace.image} alt={currentSpace.title} />
        </div>
        <div className="home-space-content reveal">
          <p className="eyebrow">Spaces</p>
          <h2>{currentSpace.title}</h2>
          <p>{currentSpace.copy}</p>
          <div className="space-selector" aria-label="Home space carousel">
            {homeSpaceSlides.map((space, index) => (
              <button
                key={space.label}
                className={activeSpace === index ? "active" : ""}
                type="button"
                onClick={() => setActiveSpace(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {space.label}
              </button>
            ))}
          </div>
          <button
            className="text-action"
            type="button"
            onClick={() => navigation.navigateToTarget({ path: currentSpace.route })}
          >
            Open {currentSpace.label}
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className="category-band" id="systems">
        <div className="section-heading">
          <p className="eyebrow">Products</p>
          <h2>Explore more systems.</h2>
        </div>
        <div className="category-grid">
          {productFamilies.map((family) => (
            <article className="category-card reveal" key={family.title}>
              <img src={family.image} alt={family.title} />
              <div>
                <h3>{family.title}</h3>
                <p>{family.description}</p>
                <button
                  className="card-link-button"
                  type="button"
                  onClick={() => navigation.navigateToTarget({ path: family.route })}
                >
                  View system
                  <ArrowRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="material-story" id="materials">
        <div className="material-copy reveal">
          <p className="eyebrow">Material</p>
          <h2>Plywood for everyday luxury.</h2>
          <p>Strong inside, refined outside: clean modules, durable finishes and easy care.</p>
          <div className="metric-row">
            <span>
              <strong>16</strong>
              mm plywood
            </span>
            <span>
              <strong>15+</strong>
              finish options
            </span>
            <span>
              <strong>4</strong>
              week proposal flow
            </span>
          </div>
        </div>
        <div className="finish-panel reveal">
          <div className="finish-carousel">
            <button type="button" aria-label="Previous material" onClick={() => rotateFinish(-1, selectedFinish, setSelectedFinish)}>
              <ChevronLeft size={18} />
            </button>
            <div
              className="finish-preview"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.08), rgba(252, 242, 220, 0.18)), url("${selectedFinish.image}")`,
              }}
            >
              <span>{selectedFinish.label}</span>
            </div>
            <button type="button" aria-label="Next material" onClick={() => rotateFinish(1, selectedFinish, setSelectedFinish)}>
              <ChevronRight size={18} />
            </button>
            <div className="finish-dots" aria-label="Material carousel position">
              {finishes.map((finish, index) => (
                <button
                  type="button"
                  key={finish.label}
                  className={selectedFinishIndex === index ? "active" : ""}
                  aria-label={`Show ${finish.label}`}
                  onClick={() => setSelectedFinish(finish)}
                />
              ))}
            </div>
          </div>
          <div className="finish-list" aria-label="Finish options">
            {finishes.map((finish) => (
              <button
                key={finish.label}
                className={selectedFinish === finish ? "finish-chip selected" : "finish-chip"}
                onClick={() => setSelectedFinish(finish)}
              >
                {finish.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <FeaturedSystem />
      <ProcessQuoteSections />
    </main>
  );
}

function FeaturedSystem() {
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

function rotateFinish(
  direction: -1 | 1,
  currentFinish: FinishOption,
  setSelectedFinish: (finish: FinishOption) => void,
) {
  const currentIndex = finishes.findIndex((item) => item.label === currentFinish.label);
  const nextIndex = (currentIndex + direction + finishes.length) % finishes.length;
  setSelectedFinish(finishes[nextIndex]);
}
