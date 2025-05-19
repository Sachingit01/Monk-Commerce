import { useState } from "react";
import ProductListManager from "../components/ProductListManager";

const BundleProductCreator = () => {
  const [applyComparePrice, setApplyComparePrice] = useState(false);
  const [enableTimer, setEnableTimer] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  return (
    <div className="bundle-creator-container">
      <div className="bundle-creator">
        <h2 className="bundle-title">Add Bundle Products (Max. 4 Products)</h2>
        <div className="info-banner">
          <span className="info-icon">ℹ️</span>
          <span>
            Offer Bundle will be shown to the customer whenever any of the
            bundle products are added to the cart.
          </span>
        </div>

        <ProductListManager />

        <div className="pricing-options">
          <div className="checkbox-row">
            <input
              type="checkbox"
              id="comparePrice"
              checked={applyComparePrice}
              onChange={() => setApplyComparePrice(!applyComparePrice)}
            />
            <label htmlFor="comparePrice">
              Apply discount on compare price.{" "}
              <span className="question-icon">❓</span>
            </label>
          </div>
          <p className="pricing-info">
            Discount will be applied on compare price of the product. Discount
            set inside the upsell offer should be more than or equal to the
            discount set on a product in your store.
          </p>
        </div>

        <div className="advanced-section">
          <div
            className="advanced-header"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          >
            <h3>Advanced offer customizations {isAdvancedOpen ? "▾" : "▴"}</h3>
          </div>

          <div className="checkbox-row">
            <input
              type="checkbox"
              id="enableTimer"
              checked={enableTimer}
              onChange={() => setEnableTimer(!enableTimer)}
            />
            <label htmlFor="enableTimer">Enable timer for this offer.</label>
          </div>

          {enableTimer && <div className="offer-timer">Offer Timer</div>}
        </div>
      </div>
    </div>
  );
};

export default BundleProductCreator;
