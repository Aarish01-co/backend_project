import React, { useState, useEffect } from "react";
import { X, Tag, Package, User, ImageOff } from "lucide-react";
import { apiFetch } from "../api";

export function ProductDetailModal({ productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiFetch(`/products/${productId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to load product");
        } else {
          setProduct(data.product);
        }
      } catch (err) {
        setError("Network error loading product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!productId) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Product Details</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>Loading product details...</p>
        ) : error ? (
          <div className="alert-box alert-error">{error}</div>
        ) : product ? (
          <div>
            {product.imageUrl ? (
              <div className="modal-image-wrap">
                <img src={product.imageUrl} alt={product.name} className="modal-image" />
              </div>
            ) : null}

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <span className="card-category">
                <Tag size={12} style={{ marginRight: 4 }} />
                {product.category}
              </span>
            </div>

            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.75rem", color: "white" }}>{product.name}</h3>

            <p style={{ color: "#9ca3af", marginBottom: "1.5rem", lineHeight: "1.6" }}>{product.description}</p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                background: "#0b0f19",
                padding: "1rem",
                borderRadius: "10px",
                marginBottom: "1.5rem"
              }}
            >
              <div>
                <span style={{ fontSize: "0.8rem", color: "#9ca3af", display: "block" }}>Price</span>
                <strong style={{ fontSize: "1.25rem", color: "white" }}>${Number(product.price).toFixed(2)}</strong>
              </div>

              <div>
                <span style={{ fontSize: "0.8rem", color: "#9ca3af", display: "block" }}>Stock Level</span>
                <strong style={{ fontSize: "1.25rem", color: product.stock < 5 ? "#f59e0b" : "#10b981" }}>
                  <Package size={14} style={{ marginRight: 4 }} />
                  {product.stock} units
                </strong>
              </div>
            </div>

            {product.user && (
              <div style={{ fontSize: "0.85rem", color: "#9ca3af", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <User size={14} />
                <span>Listed by: {product.user.name || product.user.email}</span>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
