import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/profile.css";

export const Profile = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  const [description, setDescription] = useState(store?.user?.description || "");
  const [modalDescription, setModalDescription] = useState(description);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDescription(store?.user?.description || "");
  }, [store.user]);

  const handleSaveDescription = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: modalDescription }),
      });
      const updateUser = await response.json();

      if (response.ok) {
        dispatch({ type: "set_user", payload: { user: updateUser, token } });
        setDescription(modalDescription);
        setShowModal(false); // Cierra el modal al guardar
      } else {
        alert(updateUser.error || "No se pudo guardar la descripción.");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error de conexión al guardar la descripción.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-container">
      {/* ESTADÍSTICAS */}
      <div className="profile-card profile-left">
        <h4>Estadísticas</h4>
        <p><strong>Partidas jugadas:</strong> {store?.user?.games?.length || 0}</p>
        <p><strong>Palabras correctas:</strong> {store?.user?.correct_words || 0}</p>
        <p><strong>Palabras erróneas:</strong> {store?.user?.failed_words || 0}</p>
        <p><strong>Ratio:</strong> {store?.user?.average_precision || "0%"} </p>
      </div>

      {/* PERFIL CENTRO */}
      <div className="profile-centered">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <img
                src={store?.user?.avatar_url || "/src/front/assets/avatars/avatar1.png"}
                alt="Avatar"
              />
            </div>
            <h3 className="profile-username">{store?.user?.username || "Usuario"}</h3>
          </div>

          <div className="profile-centered-content">
            <p><strong>País:</strong> {store?.user?.country || "No registrado"}</p>
            <p><strong>Ciudad:</strong> {store?.user?.city || "No registrada"}</p>
            <p><strong>Email:</strong> {store?.user?.email || "email@dominio.com"}</p>
            <p className="profile-description">
              {description || <i>Añade una descripción...</i>}
            </p>
            <div className="profile-buttons">
              <button
                className="profile-btn"
                onClick={() => {
                  setModalDescription(description);
                  setShowModal(true);
                }}
              >
                Editar descripción
              </button>
              <button
                className="profile-btn warning"
                onClick={() => navigate("/edit-profile")}
              >
                Editar Perfil
              </button>
            </div>
          </div>
        </div>

        <div className="profile-card profile-center-below">
          <h4>Aquí puedes añadir contenido debajo del perfil</h4>
        </div>
      </div>

      {/* HISTORIAL DERECHA */}
      <div className="profile-card profile-right">
        <h4>Historial de partidas</h4>
        <div className="game-list">
          {store?.user?.games && store.user.games.length > 0 ? (
            [...store.user.games]
              .sort((a, b) => new Date(b.played_at) - new Date(a.played_at))
              .map((game) => (
                <div key={game.id_game} className="game-card">
                  <p><strong>Partida #{game.id_game}</strong></p>
                  <p>
                    Jugado el{" "}
                    {new Date(game.played_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p><strong>Puntuación:</strong> {game.final_score}</p>
                  <p><strong>Precisión:</strong> {game.average_precision}%</p>
                  <hr />
                </div>
              ))
          ) : (
            <p className="text-danger">Aún no tienes partidas registradas.</p>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 className="modal-title">Editar descripción</h2>
            <textarea
              value={modalDescription}
              onChange={(e) => setModalDescription(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="profile-btn" onClick={handleSaveDescription} disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button
                className="profile-btn warning"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
