import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/editprofile.css";
import { ConfirmationModal } from "./ModalEditDescripcion";
// Avatares
import avatar1 from "../assets/avatars/avatar1.png";
import avatar2 from "../assets/avatars/avatar2.png";
import avatar3 from "../assets/avatars/avatar3.png";
import avatar4 from "../assets/avatars/avatar4.png";
import avatar5 from "../assets/avatars/avatar5.png";
import avatar6 from "../assets/avatars/avatar6.png";
import avatar7 from "../assets/avatars/avatar7.png";
import avatar8 from "../assets/avatars/avatar8.png";
import avatar9 from "../assets/avatars/avatar9.png";
import avatar10 from "../assets/avatars/avatar10.png";
import avatar11 from "../assets/avatars/avatar11.png";
import avatar12 from "../assets/avatars/avatar12.png";
import avatar13 from "../assets/avatars/avatar13.png";
import avatar14 from "../assets/avatars/avatar14.png";

export const EditProfile = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // Nuevo estado para modal

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const avatarOptions = [
    avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7,
    avatar8, avatar9, avatar10, avatar11, avatar12, avatar13, avatar14,
  ];

  useEffect(() => {
    if (store?.user) {
      setUsername(store.user.username || "");
      setEmail(store.user.email || "");
      setCountry(store.user.country || "");
      setCity(store.user.city || "");
      setAvatar(store.user.avatar_url || "");
    }
  }, [store.user]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/countries`)
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (country) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cities/${country}`)
        .then(res => res.json())
        .then(data => setCities(data))
        .catch(err => console.error(err));
    } else setCities([]);
  }, [country]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No tienes sesión activa.");
      return;
    }

    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          username,
          email,
          password: password || undefined,
          country,
          city,
          avatar_url: avatar,
        }),
      });

      const data = await resp.json();

      if (resp.ok) {
        dispatch({ type: "set_user", payload: { user: data, token } });
        setShowModal(true); // Mostramos el modal al guardar
      } else {
        setError(data.error || data.msg || "Error al actualizar el perfil");
      }
    } catch {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="edit-container">
      <div className="edit-card">
        <h2>Editar Perfil</h2>

        <form onSubmit={handleUpdate}>
          {/* Avatares */}
          <div className="avatar-selection">
            {avatarOptions.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`avatar${i + 1}`}
                className={avatar === img ? "selected" : ""}
                onClick={() => setAvatar(img)}
              />
            ))}
          </div>

          {/* Username */}
          <label className="form-label">Usuario</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Email */}
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <label className="form-label">Nueva contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Deja en blanco para no cambiarla"
          />

          {/* País */}
          <label className="form-label">País</label>
          <select
            className="form-select"
            value={country}
            onChange={(e) => { setCountry(e.target.value); setCity(""); }}
          >
            <option value="">Selecciona un país</option>
            {countries.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>

          {/* Ciudad */}
          <label className="form-label">Ciudad</label>
          <select
            className="form-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!country}
          >
            <option value="">Selecciona una ciudad</option>
            {cities.map((cityName, i) => <option key={i} value={cityName}>{cityName}</option>)}
          </select>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-flex justify-content-between mt-3">
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/profile")}>Cancelar</button>
            <button type="submit" className="btn btn-success">Guardar cambios</button>
          </div>
        </form>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <ConfirmationModal
          message="Perfil actualizado correctamente"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
