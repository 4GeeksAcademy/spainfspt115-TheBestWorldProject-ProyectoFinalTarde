import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/login.css";
import { login } from "../ApiServices";


export const Login = () => {
  const { dispatch } = useGlobalReducer();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");

        login({ username, password })
            .then(data => {
                localStorage.setItem("token", data.token);
                dispatch({
                    type: "set_user",
                    payload: { user: data.user, token: data.token },
                });
                navigate("/profile");
            })
            .catch(err => {
                setError(err.message || "Credenciales inválidas");
            });
    };


  return (
    <div className="home-container">
      <video className="bg-video" autoPlay muted loop>
        <source src="src/front/assets/videos/Hechizero.mp4" type="video/mp4" />
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
