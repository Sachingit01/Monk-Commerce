import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const ProductPicker = ({ isOpen, onClose, onProductsSelected }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const containerRef = useRef();

  const fetchProducts = useCallback(async (query, pageNum) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://stageapi.monkcommerce.app/task/products/search?search=Hat&page=2&limit=1`,
        {
          params: {
            search: query,
            page: pageNum,
            limit: 10,
          },
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "72njgfa948d9aS7gs5",
          },
        }
      );
      const fetched = response.data || [];
      const formatted = fetched.map((p) => ({
        ...p,
        variants: p.variants.map((v) => ({ ...v, selected: false })),
      }));

      if (pageNum === 1) {
        setProducts(formatted);
      } else {
        setProducts((prev) => [...prev, ...formatted]);
      }

      setHasMore(fetched.length === 10);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("error", err);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setPage(1);
    fetchProducts(searchQuery, 1);
  }, [isOpen, searchQuery, fetchProducts]);

  // Handle scroll to load more
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (loading || !hasMore) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop <= clientHeight + 100) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(searchQuery, nextPage);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page, searchQuery, fetchProducts]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const toggleProductSelection = (productId, selected) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              variants: product.variants.map((v) => ({
                ...v,
                selected,
              })),
            }
          : product
      )
    );
  };

  const toggleVariantSelection = (productId, variantId, selected) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              variants: product.variants.map((v) =>
                v.id === variantId ? { ...v, selected } : v
              ),
            }
          : product
      )
    );
  };

  const handleConfirm = () => {
    const selected = products
      .map((p) => ({
        ...p,
        variants: p.variants.filter((v) => v.selected),
      }))
      .filter((p) => p.variants.length > 0);
    onProductsSelected(selected);
  };

  const selectedCount = products.reduce(
    (count, p) => count + (p.variants.some((v) => v.selected) ? 1 : 0),
    0
  );

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2 className="dialog-title">Select Products</h2>
        </div>

        <div>
          <input
            placeholder="Search product"
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div ref={containerRef} className="product-picker-list">
          {products.map((product) => (
            <div key={product.id} className="picker-product">
              <div className="picker-product-header">
                <input
                  type="checkbox"
                  id={`product-${product.id}`}
                  checked={product.variants.every((v) => v.selected)}
                  onChange={(e) =>
                    toggleProductSelection(product.id, e.target.checked)
                  }
                  className="checkbox"
                />
                <div className="picker-product-info">
                  {product.image?.src && (
                    <img
                      src={product.image.src}
                      alt={product.title}
                      className="product-image"
                    />
                  )}
                  <label
                    htmlFor={`product-${product.id}`}
                    className="picker-product-name"
                  >
                    {product.title}
                  </label>
                </div>
              </div>

              <div className="picker-variants">
                {product.variants.map((variant) => (
                  <div key={variant.id} className="picker-variant">
                    <div className="picker-variant-info">
                      <input
                        type="checkbox"
                        id={`variant-${variant.id}`}
                        checked={variant.selected}
                        onChange={(e) =>
                          toggleVariantSelection(
                            product.id,
                            variant.id,
                            e.target.checked
                          )
                        }
                        className="checkbox"
                      />
                      <label
                        htmlFor={`variant-${variant.id}`}
                        className="picker-variant-name"
                      >
                        {variant.title}
                      </label>
                    </div>
                    <div className="picker-variant-details">
                      <span className="picker-variant-availability">
                        {variant.available && `${variant.available} available`}
                      </span>
                      <span className="picker-variant-price">
                        ₹{variant.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {loading && (
            <div className="loading-message">
              <ClipLoader color="#28a745" size={35} />
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="empty-message">No products found</div>
          )}
        </div>

        <div className="dialog-footer">
          <div className="selection-count">
            {selectedCount} {selectedCount === 1 ? "product" : "products"}{" "}
            selected
          </div>
          <div className="dialog-actions">
            <button className="button button-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedCount === 0}
              className="button button-primary"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPicker;
