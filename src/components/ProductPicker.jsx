import React, { useState, useEffect, useRef } from "react";
import mockProducts from "../mockProducts.json";

const ProductPicker = ({ isOpen, onClose, onProductsSelected }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);

  // Mock API function to fetch products
  const fetchProducts = async (query, pageNum) => {
    setLoading(true);

    // Simulating API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulating end of results after page 3
    const hasMoreResults = pageNum < 3;

    setLoading(false);
    return { products: mockProducts, hasMore: hasMoreResults };
  };

  // Initial fetch
  useEffect(() => {
    if (isOpen) {
      fetchProducts(searchQuery, 1).then(({ products, hasMore }) => {
        setProducts(products);
        setHasMore(hasMore);
        setPage(1);
      });
    } else {
      setProducts([]);
      setPage(1);
    }
  }, [isOpen, searchQuery]);

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
        fetchProducts(searchQuery, nextPage).then(
          ({ products: newProducts, hasMore: moreResults }) => {
            setProducts((prev) => [...prev, ...newProducts]);
            setHasMore(moreResults);
          }
        );
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page, searchQuery]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Toggle product selection
  const toggleProductSelection = (productId, selected) => {
    setProducts(
      products.map((product) => {
        if (product.id === productId) {
          // Update all variants
          const updatedVariants = product.variants.map((variant) => ({
            ...variant,
            selected,
          }));

          return {
            ...product,
            variants: updatedVariants,
          };
        }
        return product;
      })
    );
  };

  // Toggle variant selection
  const toggleVariantSelection = (productId, variantId, selected) => {
    setProducts(
      products.map((product) => {
        if (product.id === productId) {
          const updatedVariants = product.variants.map((variant) => {
            if (variant.id === variantId) {
              return {
                ...variant,
                selected,
              };
            }
            return variant;
          });

          return {
            ...product,
            variants: updatedVariants,
          };
        }
        return product;
      })
    );
  };

  // Handle confirm selection
  const handleConfirm = () => {
    const selectedProducts = [];

    products.forEach((product) => {
      const selectedVariants = product.variants.filter(
        (variant) => variant.selected
      );

      if (selectedVariants.length > 0) {
        selectedProducts.push({
          ...product,
          variants: selectedVariants,
        });
      }
    });

    onProductsSelected(selectedProducts);
  };

  // Count selected products
  const selectedCount = products.reduce((count, product) => {
    const variantCount = product.variants.filter((v) => v.selected).length;
    return count + (variantCount > 0 ? 1 : 0);
  }, 0);

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
                  {product.image && (
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
                        ${variant?.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {loading && <div className="loading-message">Loading...</div>}

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
