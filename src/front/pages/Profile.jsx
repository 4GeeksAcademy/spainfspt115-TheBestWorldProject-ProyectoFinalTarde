import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/profile.css";
import { UpdateInfoStoreUser } from "../ApiServices";

export const Profile = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      if (store.isRegistered) dispatch({ type: "logout" });
      setShowModal(true);
    } else {
      UpdateInfoStoreUser(dispatch, token);
      setDescription(store.user?.description || "");
    }
  }, [store.isRegistered, dispatch]);

  const addMessage = (msg) => setMessages((prev) => [...prev, msg]);

  const handleSaveDescription = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      });
      const updateUser = await response.json();
      if (response.ok) {
        dispatch({ type: "set_user", payload: { user: updateUser, token } });
        setIsEditing(false);
        addMessage("Tu descripción ha sido actualizada correctamente");
      } else {
        addMessage(updateUser.error || "No se pudo guardar la descripción.");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      addMessage("Error de conexión al guardar la descripción.");
    }
  };

  return (
    <div className="profile-container">
      {/* 🔹 Video de fondo con URL optimizada */}
      <video
        className="bg-video"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="https://res.cloudinary.com/dixwk4tan/video/upload/f_auto,q_auto/Hechizero_cmmfss.jpg"
      >
        <source
          src="https://res.cloudinary.com/dixwk4tan/video/upload/v1758724121/Hechizero_cmmfss.mp4"
          type="video/mp4"
        />
      </video>
      <div className="home-overlay"></div>

      {/* Modal de acceso denegado */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 className="modal-title">Acceso denegado</h2>
            <p className="modal-message">
              Debes iniciar sesión o registrarte para acceder al perfil.
            </p>
            <div className="modal-buttons">
              <button className="profile-btn" onClick={() => navigate("/login")}>
                Entrar
              </button>
              <button className="profile-btn" onClick={() => navigate("/register")}>
                Registro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Perfil */}
      {!showModal && (
        <>
          <div className="profile-card profile-left">
            <div className="profile-header">
              <div className="profile-avatar">
                <img
                  src={
                    store?.user?.avatar_url ||
                    "https://res.cloudinary.com/dixwk4tan/image/upload/v1758709773/avatar1_w4e1wa.png"
                  }
                  alt="Avatar"
                />
              </div>
              <h3 className="profile-username">
                {store?.user?.username || "User Name"}
              </h3>
            </div>

            <div className="profile-centered-content">
              <p>
                <strong>País:</strong> {store?.user?.country || "No registrado"}
              </p>
              <p>
                <strong>Ciudad:</strong> {store?.user?.city || "No registrada"}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {store?.user?.email || "notengo@email.net"}
              </p>
              <p>
                <strong>Miembro desde:</strong>{" "}
                {store?.user?.created_at
                  ? new Date(store.user.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "No registrado"}
              </p>

              <h4>----------------</h4>

              {isEditing ? (
                <textarea
                  placeholder="Escribe aquí lo que quieras que los demás vean"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              ) : (
                <p className="profile-description">
                  {description || <i>Añade una descripción...</i>}
                </p>
              )}

              <div className="profile-buttons">
                {isEditing ? (
                  <button className="profile-btn" onClick={handleSaveDescription}>
                    Guardar
                  </button>
                ) : (
                  <button
                    className="profile-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar Descripción
                  </button>
                )}
                <button
                  className="profile-btn"
                  onClick={() => navigate("/edit-profile")}
                >
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>

          <div className="center-column-wrapper">
            <div className="profile-card profile-center">
              <h4>Estadísticas</h4>
              <p>
                <strong>Partidas jugadas:</strong>{" "}
                {store?.user?.games?.length || "Todavía no has jugado"}
              </p>
              <p>
                <strong>Palabras correctas:</strong>{" "}
                {store?.user?.correct_words || "0"}
              </p>
              <p>
                <strong>Palabras erróneas:</strong>{" "}
                {store?.user?.failed_words || "0"}
              </p>
              <p>
                <strong>Ratio:</strong>{" "}
                {store?.user?.average_precision || "0%"}
              </p>
            </div>

            <div className="profile-card profile-center-below"></div>
          </div>

          <div className="profile-card profile-right">
            <h4>Historial de partidas</h4>
            {store?.user?.games && store.user.games.length > 0 ? (
              [...store.user.games]
                .sort((a, b) => new Date(b.played_at) - new Date(a.played_at))
                .map((game) => (
                  <div key={game.id_game} className="game-card">
                    <p>
                      <strong>Partida #{game.id_game}</strong>
                    </p>
                    <p>
                      Jugado el{" "}
                      {new Date(game.played_at).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p>
                      <strong>Puntuación:</strong> {game.final_score}
                    </p>
                    <p>
                      <strong>Precisión:</strong> {game.average_precision}%
                    </p>
                    <hr />
                  </div>
                ))
            ) : (
              <p className="text-danger">Aún no tienes partidas registradas.</p>
            )}
          </div>
        </>
      )}

      {/* Renderizar todos los mensajes como modales */}
      {messages.map((msg, i) => (
        <div key={i} className="modal-overlay">
          <div className="modal-card">
            <h2 className="modal-title">Aviso</h2>
            <p className="modal-message">{msg}</p>
            <div className="modal-buttons">
              <button
                className="profile-btn"
                onClick={() =>
                  setMessages((prev) => prev.filter((_, idx) => idx !== i))
                }
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
