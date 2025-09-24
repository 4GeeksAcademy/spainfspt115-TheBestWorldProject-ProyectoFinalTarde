import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/signup.css";
import { SuccessModal } from "./RegistroOkModal";
import { signup } from "../ApiServices";

export const Signup = () => {
  const { dispatch } = useGlobalReducer();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    signup({ email, username, password })
        .then(data => {
          setShowModal(true);
        })
        .catch(err => {
          setError(err.message || "Error al registrar el usuario");
        });
    
  };

  return (
    <div className="home-container">
      <video className="bg-video" autoPlay muted loop>
        <source src="src/front/assets/videos/Hechizera.mp4" type="video/mp4" />
      </video>
      <div className="home-overlay"></div>

      <div className="home-content">
        <div className="card-neon">
          <h2>Regístrate</h2>
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && <div className="error">{error}</div>}

            <button type="submit">Registrar</button>
          </form>

          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>

      {showModal && (
        <SuccessModal
          message="Usuario creado correctamente. Ahora inicia sesión."
          onClose={() => navigate("/login")}
        />
      )}
    </div>
  );
};
