import React, { useState, useEffect } from "react";
import { X, PlusCircle, Check } from "lucide-react";
import { apiFetch } from "../api";

export function ProductFormModal({ isOpen, onClose, productToEdit, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "Electronics",
    imageUrl: ""
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || "",
        description: productToEdit.description || "",
        price: productToEdit.price !== undefined ? productToEdit.price : "",
        stock: productToEdit.stock !== undefined ? productToEdit.stock : "",
        category: productToEdit.category || "Electronics",
        imageUrl: productToEdit.imageUrl || ""
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "Electronics",
        imageUrl: ""
      });
    }
    setFieldErrors({});
    setGeneralError("");
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");
    setLoading(true);

    const isEdit = Boolean(productToEdit);
    const endpoint = isEdit ? `/products/${productToEdit._id}` : "/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const map = {};
          data.errors.forEach((err) => {
            map[err.field] = err.message;
          });
          setFieldErrors(map);
        } else {
          setGeneralError(data.message || "Failed to save product");
        }
      } else {
        onSuccess();
      }
    } catch (err) {
      setGeneralError("An error occurred while saving product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{productToEdit ? "Edit Product" : "Add New Product"}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {generalError && <div className="alert-box alert-error">{generalError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Wireless Headphones"
              required
            />
            {fieldErrors.name && <div className="error-text">{fieldErrors.name}</div>}
          </div>

          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..."
            />
            {fieldErrors.imageUrl && <div className="error-text">{fieldErrors.imageUrl}</div>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="High quality audio with noise cancellation..."
              required
            />
            {fieldErrors.description && <div className="error-text">{fieldErrors.description}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="99.99"
                required
              />
              {fieldErrors.price && <div className="error-text">{fieldErrors.price}</div>}
            </div>

            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="25"
                required
              />
              {fieldErrors.stock && <div className="error-text">{fieldErrors.stock}</div>}
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Electronics">Electronics</option>
              <option value="Apparel">Apparel</option>
              <option value="Books">Books</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Accessories">Accessories</option>
            </select>
            {fieldErrors.category && <div className="error-text">{fieldErrors.category}</div>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {productToEdit ? <Check size={16} /> : <PlusCircle size={16} />}
            {loading ? "Saving..." : productToEdit ? "Update Product" : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
