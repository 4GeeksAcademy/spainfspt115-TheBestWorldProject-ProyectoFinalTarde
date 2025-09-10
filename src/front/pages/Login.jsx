import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
  const { dispatch } = useGlobalReducer();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );
      const data = await response.json();

      if (response.ok && data.token) {
        // Guardar el token en localStorage
        localStorage.setItem("token", data.token);

        // Guardar usuario y token en el estado global
        dispatch({
          type: "set_user",
          payload: { user: data.user, token: data.token },
        });

        // Redirigir al perfil
        navigate("/profile");
      } else {
        setError(data.msg || "Credenciales inválidas");
      }
    } catch {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="card shadow p-4" style={{ maxWidth: 400, width: "100%" }}>
        <h2 className="mb-4 text-center">Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button className="btn btn-primary w-100" type="submit">
            Iniciar sesión
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
  );
};
console.log(import.meta.env.VITE_BACKEND_URL)
