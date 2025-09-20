import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Play } from "../components/BotonPlay.jsx";
import "../styles/home.css";
import videoFondo from "../assets/videos/Hechizera.mp4";

export const Home = () => {
  const { store } = useGlobalReducer();
  const title = "M e c a M a g i A";
  const [colors, setColors] = useState([]);

  const neonColors = ["#ff00ff", "#00ffff", "#ffae00", "#ff0000", "#590ead"];

  useEffect(() => {
    // Cambia colores aleatorios de las letras cada 300ms
    const interval = setInterval(() => {
      setColors(
        title.split("").map(
          () => neonColors[Math.floor(Math.random() * neonColors.length)]
        )
      );
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const neonShadow = (color) =>
    `0 0 5px ${color}, 0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`;

  return (
    <div className="home-container">
      {/* Fondo de video */}
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src={videoFondo} type="video/mp4" />
        Tu navegador no soporta el vídeo.
      </video>

      <div className="home-overlay"></div>

      <div className="content-wrapper">
        {/* Título con efecto neon */}
        <svg className="title-svg" viewBox="0 0 800 150">
          <path id="curve" d="M 50 100 Q 400 0 750 100" fill="transparent" />
          <text fontSize="60" fontWeight="bold">
            <textPath href="#curve" startOffset="50%" textAnchor="middle">
              {title.split("").map((letter, i) => (
                <tspan
                  key={i}
                  className="letter"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    fill: colors[i] || "#fff",
                    textShadow: colors[i] ? neonShadow(colors[i]) : "0 0 5px #fff",
                  }}
                >
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
