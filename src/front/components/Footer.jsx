import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate, Link } from "react-router-dom"; // 👈 si usas react-router
import "../index.css";

// Componente Footer
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
        <footer
            className="d-flex align-items-center justify-content-between px-4 py-2 border-top fixed-bottom"
            style={{
                backgroundColor: store?.mode === "dark" ? "#212529" : "#ffffff",
                color: store?.mode === "dark" ? "#fff" : "#343131ff",
            }}
        >
            {/* Menú desplegable de perfil */}
            {store?.isRegistered && (
                <div className="dropup">
                    <a
                        className="d-flex align-items-center dropdown-toggle text-decoration-none"
                        href="#"
                        role="button"
                        id="profileDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ color: store?.mode === "dark" ? "#fff" : "#343131ff" }}
                    >
                        <div className="d-flex flex-column">
                            <span className="fw-bold">{store?.user?.username || null}</span>
                            <span className="fw-bold">{store?.user?.email || "notengo@email.net"}</span>
                        </div>
                    </a>

                    {/* Opciones del menú de perfil */}
                    <ul
                        className="dropdown-menu"
                        aria-labelledby="profileDropdown"
                        style={{
                            backgroundColor: store?.mode === "dark" ? "#343a40" : "#ffffff",
                            color: store?.mode === "dark" ? "#fff" : "#000",
                        }}
                    >
                        <li>
                            <li>
                                <Link
                                    to="/profile"
                                    className="dropdown-item"
                                    style={{ color: store?.mode === "dark" ? "#fff" : "#000" }}
                                >
                                    <i className="bi bi-person-circle me-2"></i>Profile
                                </Link>
                            </li>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                href="#"
                                style={{ color: store?.mode === "dark" ? "#fff" : "#000" }}
                            >
                                <i className="bi bi-bell me-2"></i>Notifications
                            </a>
                        </li>
                        <li className="dropdown-divider"></li>
                        <li>
                            <button
                                className="dropdown-item text-danger"
                                onClick={handleLogout}
                            >
                                LogOut
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            {/* Texto de copyright */}
            <div>
                <p className="mb-0 fw-bold">
                    © 2025 Mi Proyecto
                </p>
            </div>

            {/* Botón (placeholder de logo o carga) */}
            <div>
                <button className="btn btn-sm btn-outline-primary">Logo loading</button>
            </div>
        </footer>
    );
};
