import { Link, useLocation } from "react-router-dom";
import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/navbar.css";

export const Navbar = () => {
  const { store } = useGlobalReducer();
  const location = useLocation();

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
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links centrados */}
        <ul className="navbar-nav gap-4 navbar-center d-none d-lg-flex">
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-link fw-bold ${location.pathname === "/" ? "active-link" : ""}`}
            >
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/about"
              className={`nav-link fw-bold ${location.pathname === "/about" ? "active-link" : ""}`}
            >
              Info
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/profile"
              className={`nav-link fw-bold ${location.pathname === "/profile" ? "active-link" : ""}`}
            >
              Perfil
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/ranking"
              className={`nav-link fw-bold ${location.pathname === "/ranking" ? "active-link" : ""}`}
            >
              Ranking
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/donations"
              className={`nav-link fw-bold ${location.pathname === "/donations" ? "active-link" : ""}`}
            >
              Donaciones
            </Link>
          </li>
        </ul>

        {/* LogIn / SignUp */}
        <div className="d-none d-lg-flex ms-auto align-items-center gap-3">
          {!store?.isRegistered ? (
            <>
              <Link
                to="/login"
                className={`nav-link fw-bold ${location.pathname === "/login" ? "active-link" : ""}`}
              >
                Entrar
              </Link>
              <Link
                to="/signup"
                className={`nav-link fw-bold ${location.pathname === "/signup" ? "active-link" : ""}`}
              >
                Registro
              </Link>
            </>
          ) : (
            <div style={{ width: "160px" }} />
          )}
        </div>
      </div>
    </nav>
  );
};
