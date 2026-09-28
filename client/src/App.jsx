import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, RefreshCw } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { ProductCard } from "./components/ProductCard";
import { RegisterModal } from "./components/RegisterModal";
import { LoginModal } from "./components/LoginModal";
import { ProductFormModal } from "./components/ProductFormModal";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { apiFetch, getAccessToken, setAccessToken } from "./api";

export default function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchUserProfile = async () => {
    const token = getAccessToken();
    if (!token) return;

    try {
      const res = await apiFetch("/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
        setAccessToken(null);
      }
    } catch (err) {
      setUser(null);
      setAccessToken(null);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (category) queryParams.append("category", category);

      const res = await apiFetch(`/products?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      showToast("Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (err) {
    } finally {
      setAccessToken(null);
      setUser(null);
      showToast("Logged out successfully");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await apiFetch(`/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Product deleted successfully");
        fetchProducts();
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to delete product", "error");
      }
    } catch (err) {
      showToast("Error deleting product", "error");
    }
  };

  return (
    <div className="app-container">
      <Navbar
        user={user}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onLogout={handleLogout}
      />

      {toastMessage && (
        <div
          className={`alert-box ${toastMessage.type === "error" ? "alert-error" : "alert-success"}`}
          style={{ marginBottom: "1.5rem" }}
        >
          {toastMessage.message}
        </div>
      )}

      <div className="hero-section">
        <div className="hero-title">
          <h1>Product Directory</h1>
          <p>Browse, manage and inspect e-commerce inventory items seamlessly.</p>
        </div>

        {user && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setProductToEdit(null);
              setIsProductFormOpen(true);
            }}
          >
            <Plus size={18} /> Add Product
          </button>
        )}
      </div>

      <div className="controls-bar">
        <div className="search-input-wrap">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Apparel">Apparel</option>
          <option value="Books">Books</option>
          <option value="Home & Kitchen">Home & Kitchen</option>
          <option value="Accessories">Accessories</option>
        </select>

        <button className="btn btn-secondary" onClick={fetchProducts}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="empty-state">
          <h3>Loading products...</h3>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try clearing filters or add a new product to get started.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((item) => (
            <ProductCard
              key={item._id}
              product={item}
              isAuthenticated={Boolean(user)}
              onSelect={(id) => setSelectedProductId(id)}
              onEdit={(prod) => {
                setProductToEdit(prod);
                setIsProductFormOpen(true);
              }}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
          showToast("Registration successful! Please login.");
        }}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={(loggedUser) => {
          setIsLoginOpen(false);
          setUser(loggedUser);
          showToast(`Welcome back, ${loggedUser.name}!`);
          fetchProducts();
        }}
      />

      <ProductFormModal
        isOpen={isProductFormOpen}
        onClose={() => {
          setIsProductFormOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onSuccess={() => {
          setIsProductFormOpen(false);
          setProductToEdit(null);
          showToast(productToEdit ? "Product updated!" : "Product created!");
          fetchProducts();
        }}
      />

      <ProductDetailModal
        productId={selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </div>
  );
}
