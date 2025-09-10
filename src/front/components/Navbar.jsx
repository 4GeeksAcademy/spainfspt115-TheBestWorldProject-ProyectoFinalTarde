import { Link } from "react-router-dom";
import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();

	// Aplicar clases al body según el modo
	React.useEffect(() => {
		if (store?.mode === "dark") {
			document.body.classList.add("bg-dark", "text-light");
		} else {
			document.body.classList.remove("bg-dark", "text-light");
		}
	}, [store?.mode]);

	return (
		<>
			<nav className="navbar navbar-expand-lg border border-dark rounded px-3 fixed-top"
				style={{ backgroundColor: store?.mode === "dark" ? "#212529" : "#ffffff" }}>
				<div className="container-fluid">

					{/* Logo */}
					<div className="d-flex align-items-center justify-content-center border border-dark rounded-circle"
						style={{ height: "50px", width: "50px" }}>
						<Link to="/" className="text-decoration-none"
							style={{ color: store?.mode === "dark" ? "#fff" : "#000" }}>
							LOGO
						</Link>
					</div>

					{/* Botón hamburguesa */}
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
						<span className="navbar-toggler-icon"></span>
					</button>

					{/* Menú principal */}
					<div className="collapse navbar-collapse justify-content-center" id="navbarNav">
						<ul className="navbar-nav gap-4">
							<li className="nav-item">
								<a className="nav-link fw-bold" style={{ color: store?.mode === "dark" ? "#fff" : "#000" }} href="#">Play</a>
							</li>
							<li className="nav-item">
								<Link to="/about" className="nav-link fw-bold" style={{ color: store?.mode === "dark" ? "#fff" : "#000" }}>
									About
								</Link>
							</li>
							<li className="nav-item">
								<a className="nav-link fw-bold" style={{ color: store?.mode === "dark" ? "#fff" : "#000" }}
									href="#" data-bs-toggle="modal" data-bs-target="#supportModal">
									Support
								</a>
							</li>

							{/* Dropdown modo */}
							<li className="nav-item dropdown">
								<a className="nav-link dropdown-toggle fw-bold"
									style={{ color: store?.mode === "dark" ? "#fff" : "#000" }}
									href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
									Mode
								</a>
								<ul className="dropdown-menu">
									<li>
										<button className="dropdown-item" onClick={() => dispatch({ type: "SET_MODE", payload: "light" })}>
											Light
										</button>
									</li>
									<li>
										<button className="dropdown-item" onClick={() => dispatch({ type: "SET_MODE", payload: "dark" })}>
											Dark
										</button>
									</li>
								</ul>
							</li>
						</ul>
					</div>

					{/* Botones login/signup/profile */}
					<div className="d-flex gap-2">
						{!store?.isRegistered && (
							<Link to="/login" className="btn btn-primary w-100">LogIn</Link>
						)}
						{!store?.isRegistered && (
							<Link to="/signup" className="btn btn-outline-dark fw-bold">SignUp</Link>
						)}
						{store?.isRegistered && (
							<Link to="/profile" className="btn btn-primary mx-2">Profile</Link>
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
							<p>¿Tienes un problema? Escríbenos rápido aquí e infórmanos de tu problema.</p>
							<form>
								<div className="mb-3">
									<label htmlFor="email" className="form-label">Correo</label>
									<input type="email" className="form-control" id="email" placeholder="tu@email.com" />
								</div>
								<div className="mb-3">
									<label htmlFor="message" className="form-label">Mensaje</label>
									<textarea className="form-control" id="message" rows="3" placeholder="Escribe tu duda..."></textarea>
								</div>
							</form>
						</div>
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
