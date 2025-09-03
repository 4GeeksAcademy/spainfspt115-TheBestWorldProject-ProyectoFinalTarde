import React from "react";
import { Link } from "react-router-dom";

// Componente de formulario de LogIn
export const Login = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          
          {/* Tarjeta de login */}
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              
              {/* Título */}
              <h2 className="mb-4 text-center">Iniciar Sesión</h2>

              {/* Formulario de login */}
              <form>
                {/* Campo de email */}
                <div className="mb-3">
                  <label htmlFor="emailLogin" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailLogin"
                    placeholder="Ingresa tu correo"
                  />
                </div>

                {/* Campo de contraseña */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Ingresa tu contraseña"
                  />
                </div>

                {/* Botón para enviar */}
                <button type="submit" className="btn btn-primary w-100">
                  Entrar
                </button>
              </form>

              {/* Link a registro */}
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
