import { Link, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import logo from "../assets/LogoMago.png";
import moneda from "../assets/img/Moneda.png";
import "../styles/navbar.css";

export const Navbar = () => {
  const { store } = useGlobalReducer();
  const location = useLocation();

  // Renderizar botón PayPal y asignar animación con desfase aleatorio
  useEffect(() => {
    // Evitar cargar el script más de una vez
    if (!document.getElementById("paypal-sdk")) {
      const script = document.createElement("script");
      script.src = "https://www.paypalobjects.com/donate/sdk/donate-sdk.js";
      script.id = "paypal-sdk";
      script.async = true;
      script.onload = () => {
        if (window.PayPal) {
          const container = document.getElementById("donate-button");
          container.innerHTML = "";
          window.PayPal.Donation.Button({
            env: "production",
            hosted_button_id: "JZPMUB4B2P3RA",
            image: {
              src: moneda,
              alt: "Donate with PayPal button",
              title: "PayPal - The safer, easier way to pay online!",
              width: 80,
              height: 80,
              border: 2,
              radius: 50,
            },
          }).render("#donate-button");
        }
      };
      document.body.appendChild(script);
    }

    // Aplicar desfase aleatorio a todos los elementos
    const animatedElements = document.querySelectorAll(
      ".navbar-custom .nav-link, .logo-img, #donate-button img"
    );
    animatedElements.forEach((el) => {
      const delay = Math.random() * 1.5; // retraso entre 0 y 1.5s
      el.style.animationDelay = `${delay}s`;
    });
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-custom px-3 fixed-top">
      <div className="container-fluid position-relative">
        {/* Logo */}
        <div id="logo-button" className="logo-circle">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo-img" />
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
              className={`nav-link fw-bold ${location.pathname === "/" ? "active-link" : ""
                }`}
            >
              Inicio
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/about"
              className={`nav-link fw-bold ${location.pathname === "/about" ? "active-link" : ""
                }`}
            >
              Info
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/profile"
              className={`nav-link fw-bold ${location.pathname === "/profile" ? "active-link" : ""
                }`}
            >
              Perfil
            </Link>
          </li>
        </ul>

        {/* LogIn / SignUp y PayPal */}
        <div className="d-none d-lg-flex ms-auto align-items-center gap-3">
          {!store?.isRegistered ? (
            <>
              <Link
                to="/login"
                className={`nav-link fw-bold ${location.pathname === "/login" ? "active-link" : ""
                  }`}
              >
                Entrar
              </Link>
              <Link
                to="/signup"
                className={`nav-link fw-bold ${location.pathname === "/signup" ? "active-link" : ""
                  }`}
              >
                Registro
              </Link>
            </>
          ) : (
            <div style={{ width: "160px" }} />
          )}

          {/* Botón PayPal */}
          <div id="donate-button" style={{ width: "80px", height: "80px" }}></div>
        </div>
      </div>
    </nav>
  );
};
