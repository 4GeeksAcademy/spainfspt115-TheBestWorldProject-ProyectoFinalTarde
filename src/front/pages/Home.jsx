import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Play } from "../components/BotonPlay.jsx";
import "../styles/home.css";

export const Home = () => {
  const { store } = useGlobalReducer();
  const title = "M     E     C     A     M     A     G     I     C";

  return (
    <div className="home-container">
      {/* Fondo de video desde URL */}
      <video
        className="bg-video"
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        poster="https://res.cloudinary.com/dixwk4tan/video/upload/f_auto,q_auto/Hechizera_jaqeny.jpg"
      >
        <source
          src="https://res.cloudinary.com/dixwk4tan/video/upload/v1758724121/Hechizera_jaqeny.mp4"
          type="video/mp4"
        />
      </video>

      <div className="home-overlay"></div>

      <div className="content-wrapper">
        {/* Título MECAMAGIA con mismo estilo que INVITADO */}
        <svg className="title-svg" viewBox="0 0 800 150">
          <path id="curve" d="M 50 100 Q 400 0 750 100" fill="transparent" />
          <text fontSize="60" fontWeight="bold">
            <textPath href="#curve" startOffset="50%" textAnchor="middle">
              {title.split("").map((letter, i) => (
                <tspan key={i} className="card-title">
                  {letter === " " ? "\u00A0" : letter}
                </tspan>
              ))}
            </textPath>
          </text>
        </svg>

        {/* Caja debajo del título */}
        <div className="card-neon">
          <div className="card-body">
            <h3 className="card-title">
              {store.isRegistered ? store.user?.username : "Invitado"}
            </h3>
            {!store.isRegistered && (
              <p className="card-text">
                Regístrate, accede a tus estadísticas y compite con el resto de jugadores.
              </p>
            )}
            <Play />
          </div>
        </div>
      </div>
    </div>
  );
};
