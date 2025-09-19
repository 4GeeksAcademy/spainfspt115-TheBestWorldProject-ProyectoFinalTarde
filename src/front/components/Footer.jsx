import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate, Link } from "react-router-dom";
import "../styles/footer.css";

export const Footer = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "logout" });
    alert("Has cerrado sesión.");
    navigate("/");
  };

  return (
    <footer className="footer-custom fixed-bottom">
      {/* Avatar y dropdown */}
      {store?.isRegistered && (
        <div className="dropup d-flex align-items-center">
          <a
            className="d-flex align-items-center dropdown-toggle text-decoration-none"
            href="#"
            role="button"
            id="profileDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src={
                store?.user?.avatar_url ||
                "/src/front/assets/avatars/avatar1.png"
              }
              alt="Avatar"
              className="footer-avatar me-2"
            />
            <div className="d-flex flex-column">
              <span className="fw-bold">{store?.user?.username || null}</span>
              <span className="fw-bold">
                {store?.user?.email || "notengo@email.net"}
              </span>
            </div>
          </a>

          {/* Opciones del menú de perfil */}
          <ul className="dropdown-menu" aria-labelledby="profileDropdown">
            <li>
              <Link to="/profile" className="dropdown-item">
                <i className="bi bi-person-circle me-2"></i>Profile
              </Link>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                <i className="bi bi-bell me-2"></i>Notifications
              </a>
            </li>
            <li className="dropdown-divider"></li>
            <li>
              <button
                className="dropdown-item text-danger"
                onClick={handleLogout}
              >
                Salir
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Texto de copyright centrado */}
      <div className="footer-center">
        <p className="mb-0">© 2025 Mi Proyecto</p>
      </div>
    </footer>
  );
};
