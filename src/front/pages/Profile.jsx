import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/profile.css";

export const Profile = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Acceso denegado. Por favor, inicia sesión.");
      if (store.isRegistered) dispatch({ type: "logout" });
      navigate("/login");
    }
  }, [store.isRegistered, navigate, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "logout" });
    alert("Has cerrado sesión.");
    navigate("/");
  };

  return (
    <div className="profile-container">
      {/* Columna izquierda */}
      <div className="card-neon profile-card">
        <div className="profile-left">
          <div className="profile-header">
            <div className="profile-avatar">
              <img
                src={store?.user?.avatar_url || "/src/front/assets/avatars/avatar1.png"}
                alt="Avatar"
              />
            </div>
            <h2 className="profile-username">
              {store?.user?.username || "User Name"}
            </h2>
          </div>

          <h4>Datos de usuario</h4>
          <p><strong>Email:</strong> {store?.user?.email || "notengo@email.net"}</p>
          <p>
            <strong>Ubicación:</strong>{" "}
            {store?.user?.city && store?.user?.country
              ? `${store.user.city}, ${store.user.country}`
              : "Ubicación no registrada"}
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

          <h4>Descripción personalizada</h4>
          <textarea placeholder="Escribe aquí lo que quieras que los demás vean"></textarea>
        </div>
      </div>

      {/* Columna central */}
      <div className="card-neon profile-card">
        <div className="profile-center">
          <h4>Estadísticas</h4>
          <p>
            <strong>Partidas jugadas:</strong>{" "}
            {store?.user?.games?.length || "Todavía no has jugado, ¿por qué no?"}
          </p>
          <p>
            <strong>Palabras correctas:</strong>{" "}
            {store?.user?.correct_words || "Ni una todavía"}
          </p>
          <p>
            <strong>Palabras erróneas:</strong>{" "}
            {store?.user?.failed_words || "Eres un máquina, ni una has fallado"}
          </p>
          <p>
            <strong>Ratio:</strong>{" "}
            {store?.user?.average_precision || "0%"}
          </p>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="card-neon profile-card">
        <div className="profile-right">
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
      </div>

      {/* Botones abajo */}
      <div className="profile-buttons">
        <button className="nav-link fw-bold profile-btn" onClick={handleLogout}>
          LogOut
        </button>
        <button
          className="nav-link fw-bold profile-btn warning"
          onClick={() => navigate("/edit-profile")}
        >
          Editar Perfil
        </button>
      </div>
    </div>
  );
};
