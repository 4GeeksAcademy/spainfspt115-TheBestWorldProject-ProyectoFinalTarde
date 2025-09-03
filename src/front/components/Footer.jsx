import React from "react";

// Componente Footer
export const Footer = () => (
    <footer className="d-flex align-items-center justify-content-between px-4 py-2 bg-light border-top border-secondary fixed-bottom">
        
        {/* Menú desplegable de perfil (CONVERTIR EN COMPONENTE UNICO PARA SU FUNCIONALIDAD)*/}
        <div className="dropup">
            <a 
                className="d-flex align-items-center dropdown-toggle text-decoration-none text-dark" 
                href="#" 
                role="button" 
                id="profileDropdown" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
            >
                {/* Avatar de usuario */}
                <img 
                    src="https://via.placeholder.com/40" 
                    alt="Avatar" 
                    className="rounded-circle me-2" 
                    width="40" 
                    height="40" 
                />
                
                {/* Información del usuario */}
                <div className="d-flex flex-column">
                    <span className="fw-bold">User Name</span>
                    <span className="text-muted small">Email@example.com</span>
                </div>
            </a>

            {/* Opciones del menú de perfil */}
            <ul className="dropdown-menu" aria-labelledby="profileDropdown">
                <li><a className="dropdown-item" href="#"><i className="bi bi-star me-2"></i>Upgrade to Pro</a></li>
                <li><a className="dropdown-item" href="#"><i className="bi bi-person-circle me-2"></i>Account</a></li>
                <li><a className="dropdown-item" href="#"><i className="bi bi-credit-card me-2"></i>Billing</a></li>
                <li><a className="dropdown-item" href="#"><i className="bi bi-bell me-2"></i>Notifications</a></li>
                <li className="dropdown-divider"></li>
                <li><a className="dropdown-item text-danger" href="#"><i className="bi bi-box-arrow-right me-2"></i>Log out</a></li>
            </ul>
        </div>

        {/* Texto de copyright */}
        <div>
            <p className="text-muted mb-0">"© [Año] [Nombre del Titular de los Derechos]"</p>
        </div>

        {/* Botón (placeholder de logo o carga) */}
        <div>
            <button className="btn btn-sm btn-outline-primary">Logo loading</button>
        </div>
    </footer>
);
