import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/navbar.css";
import { LogoutModal } from "../pages/LogoutModal";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const location = useLocation();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "logout" });
    setShowLogoutModal(true);
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom px-3 fixed-top">
      <div className="container-fluid position-relative">
        {/* Logo */}
        <div id="logo-button" className="logo-circle">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dixwk4tan/image/upload/v1758724159/LogoMago_z6ydja.png"
              alt="Logo"
              className="logo-img"
            />
          </Link>
        </div>

        {/* Toggle responsive */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Links centrales */}
          <ul className="navbar-nav gap-4 navbar-center">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link fw-bold ${
                  location.pathname === "/" ? "active-link" : ""
                }`}
              >
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/about"
                className={`nav-link fw-bold ${
                  location.pathname === "/about" ? "active-link" : ""
                }`}
              >
                Info
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/profile"
                className={`nav-link fw-bold ${
                  location.pathname === "/profile" ? "active-link" : ""
                }`}
              >
                Perfil
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/ranking"
                className={`nav-link fw-bold ${
                  location.pathname === "/ranking" ? "active-link" : ""
                }`}
              >
                Ranking
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/donations"
                className={`nav-link fw-bold ${
                  location.pathname === "/donations" ? "active-link" : ""
                }`}
              >
                Donaciones
              </Link>
            </li>
          </ul>

          {/* Botones a la derecha */}
          <div className="navbar-right ms-auto">
            {!store?.isRegistered ? (
              <>
                <Link
                  to="/login"
                  className={`nav-link fw-bold ${
                    location.pathname === "/login" ? "active-link" : ""
                  }`}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/signup"
                  className={`nav-link fw-bold ${
                    location.pathname === "/signup" ? "active-link" : ""
                  }`}
                >
                  Registro
                </Link>
              </>
            ) : (
              <button className="nav-link fw-bold" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>

        {/* Modal de logout */}
        {showLogoutModal && (
          <LogoutModal
            message="Has cerrado sesión correctamente"
            onClose={handleCloseModal}
          />
        )}
      </div>
    </nav>
  );
};
