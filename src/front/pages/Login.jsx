import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/login.css";

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
        localStorage.setItem("token", data.token);
        dispatch({
          type: "set_user",
          payload: { user: data.user, token: data.token },
        });
        navigate("/profile");
      } else {
        setError(data.msg || "Credenciales inválidas");
      }
    } catch {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="home-container">
      <video className="bg-video" autoPlay muted loop>
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>
      <div className="home-overlay"></div>

      <div className="home-content">
        <div className="card-neon">
          <h2>Iniciar sesión</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label>Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit">Iniciar sesión</button>
          </form>
          <p>
            ¿No tienes cuenta aún?{" "}
            <Link to="/signup">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
