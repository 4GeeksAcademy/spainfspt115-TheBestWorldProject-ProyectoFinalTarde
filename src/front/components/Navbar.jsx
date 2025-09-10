import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

// Barra de navegación principal
export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	return (
		<>
			<nav className="navbar navbar-expand-lg bg-white border border-dark rounded px-3 fixed-top">
				<div className="container-fluid">

					{/* Logo redondo con enlace al home */}
					<div
						className="d-flex align-items-center justify-content-center border border-dark rounded-circle"
						style={{ height: "50px", width: "50px" }}
					>
						<Link to="/" className="text-decoration-none">
							LOGO
						</Link>
					</div>

					{/* Botón hamburguesa (vista móvil) */}
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNav"
					>
						<span className="navbar-toggler-icon"></span>
					</button>

					{/* Menú principal */}
					<div className="collapse navbar-collapse justify-content-center" id="navbarNav">
						<ul className="navbar-nav gap-4">
							<li className="nav-item">
								<a className="nav-link fw-bold text-dark" href="#">Play</a>
							</li>
							<li className="nav-item">
								<Link to="/about" className="nav-link fw-bold text-dark">
									About
								</Link>
							</li>
							<li className="nav-item">
								{/* Botón para abrir modal de soporte */}
								<a
									className="nav-link fw-bold text-dark"
									href="#"
									data-bs-toggle="modal"
									data-bs-target="#supportModal"
								>
									Support
								</a>
							</li>

							{/* Dropdown para seleccionar modo */}
							<li className="nav-item dropdown">
								<a
									className="nav-link dropdown-toggle fw-bold text-dark"
									href="#"
									role="button"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									Mode
								</a>
								<ul className="dropdown-menu">
									<li><a className="dropdown-item" href="#">Light</a></li>
									<li><a className="dropdown-item" href="#">Dark</a></li>
								</ul>
							</li>
						</ul>
					</div>

					{/* Botones de login/signup/profile */}
					<div className="d-flex gap-2">
						<Link to="/login" className="btn btn-primary w-100">
							LogIn
						</Link>
						<Link to="/signup" className="btn btn-outline-dark fw-bold">
							SignUp
						</Link>
					</div>
					{store?.isRegistered && (
						<Link to="/profile" className="btn btn-primary mx-2">
							Profile
						</Link>
					)}
				</div>
			</nav>

			{/* Modal de soporte */}
			<div className="modal fade" id="supportModal" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title fw-bold">Soporte Rápido</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
						</div>

						<div className="modal-body">
							<p>¿Tienes un problema? Escríbenos rápido aquí e infórmanos de tu problema.</p>
							<form>
								{/* Campo correo */}
								<div className="mb-3">
									<label htmlFor="email" className="form-label">Correo</label>
									<input type="email" className="form-control" id="email" placeholder="tu@email.com" />
								</div>
								{/* Campo mensaje */}
								<div className="mb-3">
									<label htmlFor="message" className="form-label">Mensaje</label>
									<textarea className="form-control" id="message" rows="3" placeholder="Escribe tu duda..."></textarea>
								</div>
							</form>
						</div>

						{/* Botones del modal */}
						<div className="modal-footer">
							<button type="button" className="btn btn-danger">Cancelar</button>
							<button type="button" className="btn btn-dark">Enviar</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
