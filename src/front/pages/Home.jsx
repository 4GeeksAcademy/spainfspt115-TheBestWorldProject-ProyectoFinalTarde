import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Play } from "../components/BotonPlay.jsx";
import Game from "../../game/Game.jsx";
import "../styles/home.css";
import videoFondo from "../assets/videos/Hechizera.mp4";

export const Home = () => {
  const { store } = useGlobalReducer();

  return (
    <div className="home-container">
      {/* 🔹 Primer video de fondo */}
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src={videoFondo} type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      {/* 🔹 Contenido encima de los videos */}
      <div className="container text-center content">
        <h1 className="mb-4">Bienvenido a Nombrejuego</h1>

        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="card-title">
                  {store.isRegistered ? store.user?.username : "Invitado"}
                </h3>
                <p className="card-text">
                  Si te registras podrás obtener varias bonificaciones y podrás acceder a tus estadísticas
                </p>
                <a>
                  <Play />
                </a>
              </div>
            </div>

            <div className="mt-4">
              <h5>Created By: Carlos, Arturo, Constantin, Javier y Kostantin</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
