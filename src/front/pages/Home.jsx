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
        Tu navegador no soporta el vídeo.
      </video>

      {/* Capa oscura  */}
      <div className="home-overlay"></div>

      {/* Contenido de card */}
      <h1 className="mecamagic-title">
        {"M e c a M a g i C".split("").map((letter, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </h1>

      <div className="card-neon">
        <div className="card-body">
          <h3 className="card-title">
            {store.isRegistered ? store.user?.username : "Invitado"}
          </h3>
          <p className="card-text">
            Si te registras podrás acceder a tus estadísticas a parte de obtener varias bonificaciones.
          </p>
          <Play />
        </div>
      </div>

      <div className="created-by">
        <h5>Creado por: Carlos, Arturo, Constantin, Javier y Kostantin</h5>
      </div>
    </div>

  );
};
