import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<>
			<nav className="navbar navbar-expand-lg bg-white border border-dark rounded px-3">
				<div className="container-fluid">
					<div
						className="d-flex align-items-center justify-content-center border border-dark rounded-circle"
						style={{ height: "50px", width: "50px" }}
					>
						<span className="fw-bold">Logo</span>
					</div>

					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNav"
					>
						<span className="navbar-toggler-icon"></span>
					</button>

					<div className="collapse navbar-collapse justify-content-center" id="navbarNav">
						<ul className="navbar-nav gap-4">
							<li className="nav-item">
								<a className="nav-link fw-bold text-dark" href="#">Play</a>
							</li>
							<li className="nav-item">
								<a className="nav-link fw-bold text-dark" href="#">About</a>
							</li>
							<li className="nav-item">
								<a
									className="nav-link fw-bold text-dark"
									href="#"
									data-bs-toggle="modal"
									data-bs-target="#supportModal"
								>
									Support
								</a>
							</li>

							{/* Dropdown para Mode */}
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
									<li>
										<a className="dropdown-item" href="#">Light</a>
									</li>
									<li>
										<a className="dropdown-item" href="#">Dark</a>
									</li>
								</ul>
							</li>
						</ul>
					</div>

					<div className="d-flex gap-2">
						<button className="btn btn-outline-dark fw-bold">LogIn</button>
						<button className="btn btn-outline-dark fw-bold"> SignUp</button>
					</div>
				</div>
			</nav>

			{/* Modal Soporte */}
			<div className="modal fade" id="supportModal" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title fw-bold">Soporte Rápido</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
						</div>
						<div className="modal-body">
							<p>¿Tienes un problema? Escríbenos rápido aquí e informanos de tu problema.</p>
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
