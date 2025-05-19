import { X, ChevronDown, ChevronUp, GripVertical, Pencil } from "lucide-react";
import { DragHandle } from "./DragHandle";
import DiscountInput from "./DiscountInput";
import { Droppable, Draggable } from "@hello-pangea/dnd";

const ProductItem = ({
  product,
  index,
  onEdit,
  onRemove,
  showRemoveButton,
  onAddDiscount,
  onUpdateDiscount,
  onRemoveDiscount,
  onToggleVariants,
}) => {
  const hasVariants = product.variants && product.variants.length > 1;

  return (
    <div>
      <div className="product-list">
        <div className="product-row" key={product.id}>
          <div className="product-handle">
            <div className="dots">
              <GripVertical className="grip-icon" size={20} color="#888" />
            </div>
            <span className="product-index">{index + 1}.</span>
          </div>
          <div className="product-selector">
            <div className="select-with-button">
              <span className="product-input">
                {product.title ? product.title : product.name}
              </span>
              <button className="edit-button" onClick={onEdit}>
                <Pencil size={16} />
              </button>
            </div>
          </div>
          {showRemoveButton && (
            <button onClick={onRemove} className="icon-button">
              <X size={16} />
            </button>
          )}

          <div>
            {product.discountType ? (
              <DiscountInput
                type={product.discountType}
                value={product.discountValue || 0}
                onUpdateType={(type) =>
                  onUpdateDiscount(type, product.discountValue || 0)
                }
                onUpdateValue={(value) =>
                  onUpdateDiscount(product.discountType, value)
                }
                onRemove={onRemoveDiscount}
              />
            ) : (
              <button className="discount-button" onClick={onAddDiscount}>
                Add Discount
              </button>
            )}
          </div>
        </div>
      </div>

      {hasVariants && (
        <div className="variants-section">
          {!product.showVariants ? (
            <button
              className="variants-toggle-button"
              onClick={onToggleVariants}
            >
              Show variants <ChevronDown className="ml-1" />
            </button>
          ) : (
            <>
              <button
                className="variants-toggle-button"
                onClick={onToggleVariants}
              >
                Hide variants <ChevronUp className="ml-1" />
              </button>
              <Droppable droppableId={`variants-${index}`} type="VARIANT">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="variants-list"
                  >
                    {product.variants.map((variant, variantIndex) => (
                      <Draggable
                        key={`variant-${variant.id}-${variantIndex}`}
                        draggableId={`variant-${variant.id}-${variantIndex}`}
                        index={variantIndex}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="variant-item"
                          >
                            <div className="variant-info">
                              <DragHandle className="" />
                              <span className="variant-name">
                                {variant.title}
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductItem;
