// Footer.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate, Link } from "react-router-dom";
import { LogoutModal } from "../pages/LogOutModal";
import "../styles/footer.css";

export const Footer = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "logout" });
    setShowLogoutModal(true);
  };

  return (
    <footer className="footer-custom fixed-bottom">
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

          <ul className="dropdown-menu" aria-labelledby="profileDropdown">
            <li>
              <Link to="/profile" className="dropdown-item">
                <i className="bi bi-person-circle me-2"></i>Perfil
              </Link>
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

      <div className="footer-center">
        <p className="mb-0">
          <FontAwesomeIcon icon={faCopyright} /> All rights reserved
        </p>
      </div>

      {showLogoutModal && (
        <LogoutModal
          message="Has cerrado sesión correctamente"
          onClose={() => {
            setShowLogoutModal(false);
            navigate("/");
          }}
        />
      )}
    </footer>
  );
};
