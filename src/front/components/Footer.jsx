import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../index.css";

// Componente Footer
export const Footer = () => {
    const { store } = useGlobalReducer();

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
                            <span className="fw-bold">User Name</span>
                            <span className="fw-bold">Email@example.com</span>
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
                            <a
                                className="dropdown-item"
                                href="#"
                                style={{ color: store?.mode === "dark" ? "#fff" : "#000" }}
                            >
                                <i className="bi bi-star me-2"></i>Upgrade to Pro
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                href="#"
                                style={{ color: store?.mode === "dark" ? "#fff" : "#000" }}
                            >
                                <i className="bi bi-person-circle me-2"></i>Account
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                href="#"
                                style={{ color: store?.mode === "dark" ? "#fff" : "#000" }}
                            >
                                <i className="bi bi-credit-card me-2"></i>Billing
                            </a>
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
                            <a className="dropdown-item text-danger" href="#">
                                <i className="bi bi-box-arrow-right me-2"></i>Log out
                            </a>
                        </li>
                    </ul>
                </div>
            )}

            {/* Texto de copyright */}
            <div>
                <p
                    className="mb-0 fw-bold"
                    style={{ color: store?.mode === "dark" ? "#fff" : "#343131ff" }}
                >
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
