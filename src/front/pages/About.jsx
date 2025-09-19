import React from "react";
import "../styles/about.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

export const About = () => {
  return (
    <div className="about-container">
      {/* Imagen de fondo */}
      {/* <img
        src="src/front/assets/img/rigo-baby.jpg"
        alt="Gameplay background"
        className="about-bg"
      /> */}

      {/* Overlay oscuro */}
      <div className="about-overlay"></div>

      {/* Contenido principal */}
      <div className="about-card">
        <h1>Sobre el Juego</h1>
        <p className="lead">Trabajo, trabajo.</p>

        <h3>Desarrolladores</h3>
        <ul>
          <li className="dev-carlos">
            Carlos –
            <a
              href="https://www.linkedin.com/in/carlos-moreira-chávez-911597259/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
            </a>{" "}
            |{" "}
            <a
              href="https://github.com/ByCarlosS"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faGithub} /> GitHub
            </a>
          </li>

          <li className="dev-javier">
            Javier –
            <a
              href="https://www.linkedin.com/in/javier-miguel-valenciano-896336107/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
            </a>{" "}
            |{" "}
            <a
              href="https://github.com/Jmvdev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faGithub} /> GitHub
            </a>
          </li>

          <li className="dev-konstantin">
            Konstantin –
            <a
              href="https://www.linkedin.com/in/kostantin-a-n-1b0427317"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
            </a>{" "}
            |{" "}
            <a
              href="https://github.com/K0ST4N"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faGithub} /> GitHub
            </a>
          </li>

          <li className="dev-arturo">
            Arturo –
            <a
              href="https://www.linkedin.com/in/arturo-duarte-a9646536b/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
            </a>{" "}
            |{" "}
            <a
              href="https://github.com/artureey"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faGithub} /> GitHub
            </a>
          </li>

          <li className="dev-constantin">
            Constantin –
            <a
              href="https://www.linkedin.com/in/constantin-s%C3%BArin-631331270/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
            </a>{" "}
            |{" "}
            <a
              href="https://github.com/trivmvirat"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faGithub} /> GitHub
            </a>
          </li>
        </ul>

        <a
          href="https://github.com/4GeeksAcademy/spainfspt115-TheBestWorldProject-ProyectoFinalTarde"
          target="_blank"
          rel="noopener noreferrer"
          className="btn mt-4"
        >
          <FontAwesomeIcon icon={faGithub} /> Ver Repositorio en GitHub
        </a>
      </div>
    </div>
  );
};
