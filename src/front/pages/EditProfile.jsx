import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

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

  // Estados
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");

  // Avatares disponibles
  const avatarOptions = [
    avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7,
    avatar8, avatar9, avatar10, avatar11, avatar12, avatar13, avatar14,
  ];

  // Cargar datos del usuario actual
  useEffect(() => {
    if (store?.user) {
      setUsername(store.user.username || "");
      setEmail(store.user.email || "");
      setCountry(store.user.country || "");
      setCity(store.user.city || "");
      setAvatar(store.user.avatar_url || "");
    }
  }, [store.user]);

  // Proteger acceso si no hay token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No tienes sesión activa.");
      return;
    }

    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/user`, {
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
        alert("Perfil actualizado correctamente");
        navigate("/profile");
      } else {
        setError(data.error || data.msg || "Error al actualizar el perfil");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow p-4">
            <h2 className="mb-4 text-center">Editar Perfil</h2>

            <form onSubmit={handleUpdate}>
              {/* Avatar arriba */}
              <div className="mb-3 text-center">
                <label className="form-label">Selecciona tu Avatar</label>
                <div className="d-flex gap-3 flex-wrap justify-content-center">
                  {avatarOptions.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`avatar${i + 1}`}
                      className={`rounded-circle border ${
                        avatar === img ? "border-primary border-3" : "border-light"
                      }`}
                      style={{
                        width: "70px",
                        height: "70px",
                        cursor: "pointer",
                        objectFit: "cover",
                      }}
                      onClick={() => setAvatar(img)}
                    />
                  ))}
                </div>
              </div>

              {/* Username */}
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">Nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Deja en blanco para no cambiarla"
                />
              </div>

              {/* País */}
              <div className="mb-3">
                <label className="form-label">País</label>
                <input
                  type="text"
                  className="form-control"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Escribe tu país"
                />
              </div>

              {/* Ciudad */}
              <div className="mb-3">
                <label className="form-label">Ciudad</label>
                <input
                  type="text"
                  className="form-control"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Escribe tu ciudad"
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/profile")}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
