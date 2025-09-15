import { Link } from "react-router-dom";
import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import logo from "../assets/logo.jpg";
import { Play } from "./BotonPlay";
import "../styles/mode.css";
import "../styles/navbar.css";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();

  // Aplicar clases globales al body según el modo
  React.useEffect(() => {
    if (store?.mode === "dark") {
      document.body.classList.add("bg-dark", "text-light");
    } else {
      document.body.classList.remove("bg-dark", "text-light");
    }
  }, [store?.mode]);

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg navbar-custom px-3 fixed-top ${
          store?.mode === "dark" ? "navbar-dark" : "navbar-light"
        }`}
      >
        <div className="container-fluid">
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

          {/* Botón hamburguesa */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menú principal */}
          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarNav"
          >
            <ul className="navbar-nav gap-4">
              <li className="nav-item">
                <a
                  className="nav-link fw-bold"
                  style={{ color: store?.mode === "dark" ? "#fff" : "#000" }}
                  href="#"
                >
                  Play
                </a>
              </li>
              <li className="nav-item">
                <Link
                  to="/about"
                  className="nav-link fw-bold"
                  style={{ color: store?.mode === "dark" ? "#fff" : "#000" }}
                >
                  About
                </Link>
              </li>

              {/* Switch modo */}
              <li className="nav-item d-flex align-items-center">
                <label className="switch">
                  <input
                    id="input"
                    type="checkbox"
                    checked={store?.mode === "dark"}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_MODE",
                        payload: e.target.checked ? "dark" : "light",
                      })
                    }
                  />
                  <div className="slider round">
                    <div className="sun-moon">
                      <svg id="moon-dot-1" className="moon-dot" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="moon-dot-2" className="moon-dot" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="moon-dot-3" className="moon-dot" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="light-ray-1" className="light-ray" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="light-ray-2" className="light-ray" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="light-ray-3" className="light-ray" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>

                      <svg id="cloud-1" className="cloud-dark" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="cloud-2" className="cloud-dark" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="cloud-3" className="cloud-dark" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="cloud-4" className="cloud-light" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="cloud-5" className="cloud-light" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="cloud-6" className="cloud-light" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                    </div>
                    <div className="stars">
                      <svg id="star-1" className="star" viewBox="0 0 20 20">
                        <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                      </svg>
                      <svg id="star-2" className="star" viewBox="0 0 20 20">
                        <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                      </svg>
                      <svg id="star-3" className="star" viewBox="0 0 20 20">
                        <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                      </svg>
                      <svg id="star-4" className="star" viewBox="0 0 20 20">
                        <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                      </svg>
                    </div>
                  </div>
                </label>
              </li>
            </ul>
          </div>

          {/* Botones login/signup/profile */}
          <div className="d-flex gap-2">
            {!store?.isRegistered && (
              <Link to="/login" className="btn btn-primary w-100">
                LogIn
              </Link>
            )}
            {!store?.isRegistered && (
              <Link to="/signup" className="btn btn-primary fw-bold">
                SignUp
              </Link>
            )}
            {store?.isRegistered && (
              <Link to="/profile" className="btn btn-primary mx-2">
                Profile
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Modal soporte */}
      <div className="modal fade" id="supportModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">Soporte Rápido</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <p>
                ¿Tienes un problema? Escríbenos rápido aquí e infórmanos de tu problema.
              </p>
              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Mensaje
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    rows="3"
                    placeholder="Escribe tu duda..."
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger">
                Cancelar
              </button>
              <button type="button" className="btn btn-dark">
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
