import React from "react";
import { Edit2, Trash2, Eye, ImageOff } from "lucide-react";

export function ProductCard({ product, isAuthenticated, onSelect, onEdit, onDelete }) {
  return (
    <div className="product-card">
      <div>
        <div className="card-image-wrap">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="card-image"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="card-image-placeholder"
            style={{ display: product.imageUrl ? "none" : "flex" }}
          >
            <ImageOff size={24} />
          </div>
        </div>

        <div className="card-header">
          <span className="card-category">{product.category}</span>
          <span className={`stock-badge ${product.stock < 5 ? "low" : ""}`}>
            {product.stock} in stock
          </span>
        </div>
        <h3 className="card-title">{product.name}</h3>
        <p className="card-desc">{product.description}</p>
      </div>

      <div>
        <div className="card-footer">
          <span className="price-tag">${Number(product.price).toFixed(2)}</span>
          <button className="btn btn-secondary" onClick={() => onSelect(product._id)} style={{ padding: "0.4rem 0.75rem" }}>
            <Eye size={14} /> View
          </button>
        </div>

        {isAuthenticated && (
          <div className="card-actions">
            <button className="btn btn-secondary" onClick={() => onEdit(product)} style={{ flex: 1 }}>
              <Edit2 size={14} /> Edit
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(product._id)} style={{ padding: "0.6rem" }}>
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
