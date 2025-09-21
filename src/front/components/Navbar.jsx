import { Link, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import logo from "../assets/LogoMago.png";
import "../styles/navbar.css";
import moneda from "../assets/img/Moneda.png";

export const Navbar = () => {
  const { store } = useGlobalReducer();
  const location = useLocation();

  useEffect(() => {
    const renderPayPalButton = () => {
      const container = document.getElementById("donate-button");
      if (!container || !window.PayPal?.Donation) return;

      container.innerHTML = "";
      window.PayPal.Donation.Button({
        env: "production",
        hosted_button_id: "8LTQ55BVVBCH4",
        image: {
          src: moneda,
          alt: "Donate with PayPal button",
          title: "PayPal - The safer, easier way to pay online!",
        },
      }).render("#donate-button");
    };

    if (!document.getElementById("paypal-sdk")) {
      const script = document.createElement("script");
      script.src = "https://www.paypalobjects.com/donate/sdk/donate-sdk.js";
      script.id = "paypal-sdk";
      script.async = true;
      script.onload = renderPayPalButton;
      document.body.appendChild(script);
    } else {
      renderPayPalButton();
    }
  }, [store]);

  return (
    <nav className="navbar-custom">
      {/* Logo */}
      <div id="logo-button">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      {/* Links centrados */}
      <ul className="navbar-center">
        <li>
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active-link" : ""}`}
          >
            Inicio
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className={`nav-link ${location.pathname === "/about" ? "active-link" : ""}`}
          >
            Info
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className={`nav-link ${location.pathname === "/profile" ? "active-link" : ""}`}
          >
            Perfil
          </Link>
        </li>
        <li>
          <Link
            to="/ranking"
            className={`nav-link ${location.pathname === "/ranking" ? "active-link" : ""}`}
          >
            Ranking
          </Link>
        </li>
      </ul>

      {/* Bloque derecho */}
      <div className="navbar-right">
        {!store?.isRegistered ? (
          <>
            <Link
              to="/login"
              className={`nav-link ${location.pathname === "/login" ? "active-link" : ""}`}
            >
              Entrar
            </Link>
            <Link
              to="/signup"
              className={`nav-link ${location.pathname === "/signup" ? "active-link" : ""}`}
            >
              Registro
            </Link>
          </>
        ) : null}
        <div id="donate-button-container">
          <div id="donate-button"></div>
        </div>
      </div>
    </nav>
  );
};
