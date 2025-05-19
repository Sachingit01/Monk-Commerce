export const DragHandle = ({ className = "" }) => {
  return (
    <div className={`drag-handle ${className}`}>
      <div className="drag-handle-dots">
        <div className="drag-handle-dot"></div>
        <div className="drag-handle-dot"></div>
      </div>
      <div className="drag-handle-dots">
        <div className="drag-handle-dot"></div>
        <div className="drag-handle-dot"></div>
      </div>
      <div className="drag-handle-dots">
        <div className="drag-handle-dot"></div>
        <div className="drag-handle-dot"></div>
      </div>
    </div>
  );
};
