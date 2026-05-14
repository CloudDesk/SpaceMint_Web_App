import { ArrowRight } from "lucide-react";
import { steps } from "../../data/siteContent";

export function ProcessQuoteSections() {
  return (
    <>
      <section className="process-section" id="process">
        <div className="section-heading">
          <p className="eyebrow">Design flow</p>
          <h2>Simple process.</h2>
        </div>
        <div className="process-grid">
          {steps.map((step, index) => (
            <article className="process-card reveal" key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="quote-section" id="quote">
        <div>
          <p className="eyebrow">Start a project</p>
          <h2>Book a Space Mint design consultation.</h2>
          <p>Share your space. We will plan the next step.</p>
        </div>
        <form className="quote-form">
          <label>
            Space type
            <select>
              <option>Modular kitchen</option>
              <option>Wardrobe system</option>
              <option>Living storage</option>
              <option>Utility module</option>
            </select>
          </label>
          <label>
            Mobile number
            <input placeholder="+91 98765 43210" type="tel" />
          </label>
          <button type="button">
            Request callback
            <ArrowRight size={18} />
          </button>
        </form>
      </section>
    </>
  );
}
