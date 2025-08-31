import React from "react";
import { Link } from "react-router-dom";

export const Login = () => {

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <h2 className="mb-4 text-center">Iniciar Sesión</h2>

              <form>
                <div className="mb-3">
                  <label htmlFor="emailLogin" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailLogin"
                    placeholder="Ingresa tu correo"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Ingresa tu contraseña"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Entrar
                </button>
              </form>

              <p className="mt-3 text-center">
                ¿No tienes cuenta?{" "}
                <Link to="/signup" className="text-decoration-none">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
