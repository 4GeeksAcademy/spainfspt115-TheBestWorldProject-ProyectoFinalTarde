import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useState } from "react";

export const Signup = () => {

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password }),
        }
      );
            const data = await response.json();
            if (response.ok) {
                alert("Usuario creado correctamente. Ahora inicia sesión.");
                navigate("/login");
            } else {
                alert(data.msg || "Error al registrar usuario");
            }
        } catch {
            alert("Error de conexión con el servidor");
        }
    };

  return (
    <div className="container mt-5">
      <div
        className="card row shadow d-flex justify-content-center"
        style={{ width: "25rem" }}
      >
        <div className="card-body">
          <div className="card-title justify-content-center d-flex fs-1 border-bottom border-dark">
            Regístrate
          </div>
          <div className="card-body mt-4">
            <form onSubmit={handleSubmit}>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label className="form-label mt-2">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label className="form-label mt-2">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <label className="form-label mt-2">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <div className="d-flex gap-2">
                <button className="btn btn-success mt-3" type="submit">
                  Registrar
                </button>
                <Link to="/login">
                  <button type="button" className="btn btn-primary mt-3">
                    Login
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
