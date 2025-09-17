import { Link, useLocation } from "react-router-dom";
import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import logo from "../assets/LogoMago.png";
import "../styles/navbar.css";

export const Navbar = () => {
  const { store } = useGlobalReducer();
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-custom px-3 fixed-top">
      <div className="container-fluid position-relative">

        {/* Logo */}
        <div
          className="d-flex align-items-center justify-content-center logo-circle"
        >
          <Link to="/" className="text-decoration-none">
            <img
              src={logo}
              alt="Logo"
              className="logo-img"
            />
          </Link>
        </div>

        {/* Botón toggle responsive */}
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
          {location.pathname !== "/" && (
            <li className="nav-item">
              <a className="nav-link fw-bold" href="#">
                Play
              </a>
            </li>
          )}
          {location.pathname !== "/about" && (
            <li className="nav-item">
              <Link to="/about" className="nav-link fw-bold">
                About
              </Link>
            </li>
          )}
          {store?.isRegistered && location.pathname !== "/profile" && (
            <li className="nav-item">
              <Link to="/profile" className="nav-link fw-bold">
                Profile
              </Link>
            </li>
          )}
        </ul>

        {/* LogIn / SignUp */}
        {!store?.isRegistered ? (
          <ul className="navbar-nav ms-auto gap-3 d-none d-lg-flex">
            <li className="nav-item">
              <Link to="/login" className="nav-link fw-bold">
                LogIn
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/signup" className="nav-link fw-bold">
                SignUp
              </Link>
            </li>
          </ul>
        ) : (
          <div className="d-none d-lg-block" style={{ width: "80px" }} />
        )}

      </div>
    </nav>
  );
};
