import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Play } from "../components/BotonPlay.jsx";
import "../styles/home.css";
import videoFondo from "../assets/videos/Hechizera.mp4";

export const Home = () => {
  const { store } = useGlobalReducer();

  return (
    <div className="home-container">
      {/* Video de fondo */}
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src={videoFondo} type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      {/* Capa oscura  */}
      <div className="home-overlay"></div>

      {/* Contenido de card */}
      <div className="home-content">
        <h1>M  e  c  a  M  a  g  i  C</h1>

        <div className="card-neon">
          <div className="card-body">
            <h3 className="card-title">
              {store.isRegistered ? store.user?.username : "Invitado"}
            </h3>
            <p className="card-text">
<<<<<<< HEAD
              Si te registras, podrás obtener varias bonificaciones y podrás acceder a tus estadísticas.
=======
              Si te registras podrás acceder a tus estadisticas a parte de obtener varias bonificaciones.
>>>>>>> b11c5937f576fa53cc4bfa6454f634e4ab3c6082
            </p>
            <Play />
          </div>
        </div>

        <div className="created-by">
          <h5>Created By: Carlos, Arturo, Constantin, Javier y Kostantin</h5>
        </div>
      </div>
    </div>
  );
};
