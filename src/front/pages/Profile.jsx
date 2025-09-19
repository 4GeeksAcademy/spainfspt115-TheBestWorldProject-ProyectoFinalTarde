import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/profile.css";


export const Profile = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      if (store.isRegistered) dispatch({ type: "logout" });
      setShowModal(true);
    } else {
      setDescription(store.user?.description || "");
    }
  }, [store.isRegistered, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "logout" });
    navigate("/");
  };

  const handleSaveDescription = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ description: description })
      })

      const updateUser = await response.json();

      if (response.ok) {
        alert("descripción guardada con éxito");
        dispatch({
          type: 'set_user',
          payload: { user: updateUser, token: token }
        });
        setIsEditing(false);
      } else {
        alert(updateUser.error || "No se pudo guardar la descripción.");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error de conexión al guardar la descripción.")
    }
  }

  return (
    <div className="profile-container">
      {/* Video de fondo y overlay opcional */}
      <video className="bg-video" autoPlay muted loop>
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>
      <div className="home-overlay"></div>

      {/* --- MODAL DE LOGIN/REGISTER --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Acceso denegado</h2>
            <p>Debes iniciar sesión o registrarte para acceder al perfil.</p>
            <div className="modal-buttons">
              <button
                className="close-btn"
                onClick={() => navigate("/login")}
              >
                Entrar
              </button>
              <button
                className="close-btn"
                onClick={() => navigate("/register")}
              >
                Registro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PERFIL SOLO SI ESTÁ LOGUEADO --- */}
      {!showModal && (
        <>
          {/* Columna izquierda */}
          <div className="card-neon profile-card profile-left">
            <div className="profile-header">
              <div className="profile-avatar">
                <img
                  src={
                    store?.user?.avatar_url ||
                    "/src/front/assets/avatars/avatar1.png"
                  }
                  alt="Avatar"
                />
              </div>
              <h3 className="profile-username">
                {store?.user?.username || "User Name"}
              </h3>
            </div>

            <p><strong>País:</strong> {store?.user?.country || "No registrado"}</p>
            <p><strong>Ciudad:</strong> {store?.user?.city || "No registrada"}</p>
            <p><strong>Email:</strong> {store?.user?.email || "notengo@email.net"}</p>
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
              // MODO EDICIÓN
              <>
                <textarea
                  placeholder="Escribe aquí lo que quieras que los demás vean"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <button className="profile-btn save-btn mt-2" onClick={handleSaveDescription}>
                  Guardar
                </button>
              </>
            ) : (
              // MODO VISTA
              <>
                <p className="profile-description">
                  {description || <i>Añade una descripción...</i>}
                </p>
                <button className="profile-btn edit-btn mt-2" onClick={() => setIsEditing(true)}>
                  Editar Descripción
                </button>
              </>
            )}

          </div>

          {/* Columna central */}
          <div className="card-neon profile-card profile-center">
            <h4>Estadísticas</h4>
            <p><strong>Partidas jugadas:</strong> {store?.user?.games?.length || "Todavía no has jugado"}</p>
            <p><strong>Palabras correctas:</strong> {store?.user?.correct_words || "0"}</p>
            <p><strong>Palabras erróneas:</strong> {store?.user?.failed_words || "0"}</p>
            <p><strong>Ratio:</strong> {store?.user?.average_precision || "0%"}</p>
          </div>

          {/* Columna derecha */}
          <div className="card-neon profile-card profile-right">
            <h4>Historial de partidas</h4>
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

          {/* Botones abajo */}
          <div className="profile-buttons">
            <button className="profile-btn" onClick={handleLogout}>
              Salir
            </button>
            <button
              className="profile-btn warning"
              onClick={() => navigate("/edit-profile")}
            >
              Editar Perfil
            </button>
          </div>
        </>
      )}
    </div>
  );
};
