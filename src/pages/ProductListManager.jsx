import React, { useState } from "react";
import { Pencil, GripVertical, Plus } from "lucide-react";
import ProductItem from "./ProductItem";

const ProductListManager = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "", price: "", stock: "" },
    { id: 2, name: "", price: "", stock: "" },
  ]);

  const addProduct = () => {
    setProducts([
      ...products,
      { id: products.length + 1, name: "", price: "", stock: "" },
    ]);
  };

  const updateProduct = (id, field, value) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const removeProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="product-manager-container">
      <div className="product-manager">
        <h2 className="product-title">Product List Manager</h2>
        <div className="info-banner">
          <span className="info-icon">ℹ️</span>
          <span>
            Manage your product list here. You can add, edit, and remove
            products.
          </span>
        </div>

        <div className="product-list">
          {products.map((product, index) => (
            <ProductItem
              key={product.id}
              product={product}
              index={index}
              onUpdate={updateProduct}
              onRemove={removeProduct}
            />
          ))}
        </div>

        <div className="add-product-container">
          <button className="add-product-button" onClick={addProduct}>
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductListManager;
