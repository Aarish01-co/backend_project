import React from "react";
import { ShoppingBag, LogIn, UserPlus, LogOut, User } from "lucide-react";

export function Navbar({ user, onOpenLogin, onOpenRegister, onLogout }) {
  return (
    <nav className="navbar">
      <a href="#" className="brand">
        <div className="brand-icon">
          <ShoppingBag size={20} />
        </div>
        <span>ShopCraft</span>
      </a>

      <div className="nav-controls">
        {user ? (
          <>
            <div className="user-badge">
              <User size={16} />
              <span>
                <strong>{user.name}</strong> ({user.email})
              </span>
            </div>
            <button className="btn btn-secondary" onClick={onLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary" onClick={onOpenLogin}>
              <LogIn size={16} />
              Login
            </button>
            <button className="btn btn-primary" onClick={onOpenRegister}>
              <UserPlus size={16} />
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
