import { Link } from "react-router-dom";
import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import logo from "../assets/LogoMago.png";
import "../styles/navbar.css";

export const Navbar = () => {
  const { store } = useGlobalReducer();

  return (
    <nav className="navbar navbar-expand-lg navbar-custom px-3 fixed-top">
      <div className="container-fluid position-relative">
        {/* Logo */}
        <div
          className="d-flex align-items-center justify-content-center border border-dark rounded-circle"
          style={{ height: "80px", width: "80px", overflow: "hidden" }}
        >
          <Link to="/" className="text-decoration-none">
            <img
              src={logo}
              alt="Logo"
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
            />
          </Link>
        </div>

        {/* Botón hamburguesa*/}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENÚ CENTRADO */}
        <ul className="navbar-nav gap-4 navbar-center d-none d-lg-flex">
          <li className="nav-item">
            <a className="nav-link fw-bold" href="#">
              Play
            </a>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link fw-bold">
              About
            </Link>
          </li>
          {store?.isRegistered && (
            <li className="nav-item">
              <Link to="/profile" className="nav-link fw-bold">
                Profile
              </Link>
            </li>
          )}
        </ul>
        {/* BOTONES LOGIN/SIGNUP DERECHA*/}
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
          // Espaciador derecho para equilibrar el logo cuando está logueado
          <div className="d-none d-lg-block" style={{ width: "80px" }} />
        )}
      </div>
    </nav>
  );
};
