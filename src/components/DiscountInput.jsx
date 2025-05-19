import { X } from "lucide-react";

const DiscountInput = ({
  type,
  value,
  onUpdateType,
  onUpdateValue,
  onRemove,
}) => {
  const handleValueChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onUpdateValue(newValue);
    }
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    onUpdateType(newType);
  };

  return (
    <div className="discount-input-container">
      <input
        type="number"
        value={value}
        onChange={handleValueChange}
        className="discount-input"
      />
      <select
        value={type}
        onChange={handleTypeChange}
        className="discount-type-select"
      >
        <option value="flat">Flat</option>
        <option value="percentage">% Off</option>
      </select>
      <button onClick={onRemove} className="icon-button">
        <X size={16} />
      </button>
    </div>
  );
};

export default DiscountInput;
