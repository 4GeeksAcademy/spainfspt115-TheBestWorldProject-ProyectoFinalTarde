import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const EditProfile = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  // Inicializar los estados con la info del usuario logueado
  const [username, setUsername] = useState(store?.user?.username || "");
  const [email, setEmail] = useState(store?.user?.email || "");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState(store?.user?.country || "");
  const [city, setCity] = useState(store?.user?.city || "");
  const [error, setError] = useState("");

  // Redirigir si no hay token
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
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/user`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            username,
            email,
            password: password || undefined, // si no escribe nada, no se cambia
            country,
            city,
          }),
        }
      );

      const data = await resp.json();

      if (resp.ok) {
        // Actualizamos el estado global con los nuevos datos
        dispatch({
          type: "set_user",
          payload: { user: data, token },
        });
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

              <div className="mb-3">
                <label className="form-label">País</label>
                <input
                  type="text"
                  className="form-control"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Ciudad</label>
                <input
                  type="text"
                  className="form-control"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-success">
                  Guardar cambios
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/profile")}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
