import React from "react";
import "../styles/about.css";

export const About = () => {
  return (
    <div className="about-container">
      {/* Imagen de fondo */}
      <img
        src="src/front/assets/img/rigo-baby.jpg"
        alt="Gameplay background"
        className="about-bg"
      />

      {/* Overlay oscuro */}
      <div className="about-overlay"></div>

      {/* Contenido principal */}
      <div className="about-card">
        <h1>Sobre el Juego</h1>
        <p className="lead">
          DESCRIPCIÓN DE NUESTRO FLAMANTE Y ESPECTACULAR JUEGO. PD: SALE SILKSONG Y QUIERO VICIAR.
        </p>

        <h3>Desarrolladores</h3>
        <ul>
          <li>Carlos – <a href="#">red1</a> | <a href="#">red2</a></li>
          <li>Javier – <a href="#">red1</a> | <a href="#">red2</a></li>
          <li>Konstantin – <a href="#">red1</a> | <a href="#">red2</a></li>
          <li>Arturo – <a href="#">red1</a> | <a href="#">red2</a></li>
          <li>Constantin – <a href="#">red1</a> | <a href="#">red2</a></li>
        </ul>

        <a href="#" className="btn mt-4">Ver Repositorio en GitHub</a>
      </div>
    </div>
  );
};
