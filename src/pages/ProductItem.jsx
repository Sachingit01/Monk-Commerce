import React from "react";
import { Pencil, GripVertical, Trash2 } from "lucide-react";

const ProductItem = ({ product, index, onUpdate, onRemove }) => {
  return (
    <div className="product-row">
      <div className="product-handle">
        <div className="dots">
          <GripVertical className="grip-icon" size={20} color="#888" />
        </div>
        <span className="product-index">{index + 1}.</span>
      </div>

      <div className="product-details">
        <div className="select-with-button">
          <input
            type="text"
            placeholder="Product Name"
            className="product-input"
            value={product.name}
            onChange={(e) => onUpdate(product.id, "name", e.target.value)}
          />
          <button className="edit-button">
            <Pencil size={16} />
          </button>
        </div>

        <div className="select-with-button">
          <input
            type="number"
            placeholder="Price"
            className="product-input"
            value={product.price}
            onChange={(e) => onUpdate(product.id, "price", e.target.value)}
          />
          <button className="edit-button">
            <Pencil size={16} />
          </button>
        </div>

        <div className="select-with-button">
          <input
            type="number"
            placeholder="Stock"
            className="product-input"
            value={product.stock}
            onChange={(e) => onUpdate(product.id, "stock", e.target.value)}
          />
          <button className="edit-button">
            <Pencil size={16} />
          </button>
        </div>
      </div>

      <button className="remove-button" onClick={() => onRemove(product.id)}>
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default ProductItem;
