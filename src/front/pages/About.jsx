import React from "react";
import "../styles/about.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

export const About = () => {
  return (
    <div className="about-container">
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
      <div className="about-overlay"></div>

      <div className="about-card">
        <h1>Sobre el Juego</h1>
        <p className="lead">La pagina es un proyecto hecho por 5 estudiantes de 4GeeksAcademy que tuvieron la idea de crear un juego para practicar la mecanografia de una manera creativa. Es un juego en el que eres un mago al que intentaran derribar a no ser que escribas la palabra que tienen las criaturas asociadas, teninedo como apoyo 3 habilidades que puedes utilizar siempre que las necesites.</p>

        <h3>Desarrolladores</h3>
        <ul>
          <li className="dev-carlos">
            Carlos –{" "}
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
            <span>Javier</span> –{" "}
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
            Konstantin –{" "}
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
            Arturo –{" "}
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
            Constantin –{" "}
            <a
              href="https://www.linkedin.com/in/constantin-súrin-631331270/"
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
