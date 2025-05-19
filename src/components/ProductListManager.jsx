import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ProductItem from "./ProductItem";
import ProductPicker from "./ProductPicker";
import { Plus } from "lucide-react";

const ProductListManager = () => {
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Select Product",
      variants: [],
      discountType: null,
      discountValue: null,
    },
  ]);
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleEditProduct = (index) => {
    setEditingProductIndex(index);
    setIsPickerOpen(true);
  };

  const handleRemoveProduct = (index) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        id: `new-${Date.now()}`,
        name: "Select Product",
        variants: [],
        discountType: null,
        discountValue: null,
      },
    ]);
  };

  const handleAddDiscount = (productIndex, variantIndex) => {
    const newProducts = [...products];

    // If variantIndex is provided, update the variant's discount
    if (
      variantIndex !== undefined &&
      newProducts[productIndex].variants[variantIndex]
    ) {
      const variant = newProducts[productIndex].variants[variantIndex];
      if (!variant.discountType) {
        variant.discountType = "percentage";
        variant.discountValue = 0;
      }
    } else {
      // Otherwise, update the product's discount
      if (!newProducts[productIndex].discountType) {
        newProducts[productIndex].discountType = "percentage";
        newProducts[productIndex].discountValue = 0;
      }
    }

    setProducts(newProducts);
  };

  const handleUpdateDiscount = (productIndex, type, value, variantIndex) => {
    const newProducts = [...products];

    // If variantIndex is provided, update the variant's discount
    if (
      variantIndex !== undefined &&
      newProducts[productIndex].variants[variantIndex]
    ) {
      const variant = newProducts[productIndex].variants[variantIndex];
      variant.discountType = type;
      variant.discountValue = value;
    } else {
      // Otherwise, update the product's discount
      newProducts[productIndex].discountType = type;
      newProducts[productIndex].discountValue = value;
    }

    setProducts(newProducts);
  };

  const handleRemoveDiscount = (productIndex, variantIndex) => {
    const newProducts = [...products];

    // If variantIndex is provided, remove the variant's discount
    if (
      variantIndex !== undefined &&
      newProducts[productIndex].variants[variantIndex]
    ) {
      const variant = newProducts[productIndex].variants[variantIndex];
      variant.discountType = null;
      variant.discountValue = null;
    } else {
      // Otherwise, remove the product's discount
      newProducts[productIndex].discountType = null;
      newProducts[productIndex].discountValue = null;
    }

    setProducts(newProducts);
  };

  const toggleVariantsVisibility = (index) => {
    const newProducts = [...products];
    newProducts[index].showVariants = !newProducts[index].showVariants;
    setProducts(newProducts);
  };

  const handleProductsSelected = (selectedProducts) => {
    if (editingProductIndex === null) return;

    const newProductsList = [...products];
    // Replace the product at editingProductIndex with the selected products
    newProductsList.splice(editingProductIndex, 1, ...selectedProducts);

    setProducts(newProductsList);
    setIsPickerOpen(false);
    setEditingProductIndex(null);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // Check if we're reordering a variant or a product
    if (result.type === "VARIANT") {
      // Extract the product index from the droppableId
      const productIndex = parseInt(result.source.droppableId.split("-")[1]);
      const newProducts = [...products];
      const variants = [...newProducts[productIndex].variants];

      const [removed] = variants.splice(sourceIndex, 1);
      variants.splice(destinationIndex, 0, removed);

      newProducts[productIndex].variants = variants;
      setProducts(newProducts);
    } else {
      // Reordering products
      const newProducts = [...products];
      const [removed] = newProducts.splice(sourceIndex, 1);
      newProducts.splice(destinationIndex, 0, removed);
      setProducts(newProducts);
    }
  };

  return (
    <div>
      <div className="product-list-header">
        <div>Product</div>
        <div>Discount</div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="products-list" type="PRODUCT">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="products-container"
            >
              {products.map((product, index) => (
                <Draggable
                  key={`product-${product.id}-${index}`}
                  draggableId={`product-${product.id}-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ProductItem
                        product={product}
                        index={index}
                        onEdit={() => handleEditProduct(index)}
                        onRemove={() => handleRemoveProduct(index)}
                        showRemoveButton={products.length > 1}
                        onAddDiscount={() => handleAddDiscount(index)}
                        onUpdateDiscount={(type, value) =>
                          handleUpdateDiscount(index, type, value)
                        }
                        onRemoveDiscount={() => handleRemoveDiscount(index)}
                        onToggleVariants={() => toggleVariantsVisibility(index)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="add-product-button-container">
        <button className="add-product-button" onClick={handleAddProduct}>
          <Plus className="mr-2" /> Add Product
        </button>
      </div>

      {isPickerOpen && (
        <ProductPicker
          isOpen={isPickerOpen}
          onClose={() => {
            setIsPickerOpen(false);
            setEditingProductIndex(null);
          }}
          onProductsSelected={handleProductsSelected}
        />
      )}
    </div>
  );
};

export default ProductListManager;
