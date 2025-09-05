// Componente About
export const About = () => {
  
  return (
    <div className="position-relative">

      {/* Imagen de fondo fija ocupando toda la pantalla */}
      <img
        src="src/front/assets/img/rigo-baby.jpg"
        alt="Gameplay background"
        className="position-fixed top-0 start-0 w-100 vh-100 object-fit-cover"
        style={{ zIndex: -1 }}
      />

      {/* Capa oscura semitransparente sobre la imagen de fondo */}
      <div
        className="position-fixed top-0 start-0 w-100 vh-100 bg-dark opacity-50"
        style={{ zIndex: -1 }}
      ></div>

      {/* Contenedor principal con el contenido principal de la pagina */}
      <div className="container position-relative text-white">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 text-center">
            
            {/* Título principal */}
            <h1 className="mb-3">Sobre el Juego</h1>
            
            {/* Descripción del juego */}
            <p className="lead">
              DESCRIPCION DE NUESTRO FLAMANTE Y ESPECTACULAR JUEGO
              PD: SALE SILKSONG Y QUIERO VICIAR.
            </p>

            {/* Sección de desarrolladores con enlaces a sus Redes*/}
            <h3 className="mt-5 mb-3">Desarrolladores</h3>
            <ul className="list-unstyled">
              <li>Carlos – <a href="#" className="text-info">red1</a> | <a href="#" className="text-info">red2</a></li>
              <li>Javier – <a href="#" className="text-info">red1</a> | <a href="#" className="text-info">red2</a></li>
              <li>Konstantin – <a href="#" className="text-info">red1</a> | <a href="#" className="text-info">red2</a></li>
              <li>Arturo – <a href="#" className="text-info">red1</a> | <a href="#" className="text-info">red2</a></li>
              <li>Constantin – <a href="#" className="text-info">red1</a> | <a href="#" className="text-info">red2</a></li>
            </ul>

            {/* Botón para ir al repositorio */}
            <a href="#" className="btn btn-outline-light mt-4">Ver Repositorio en GitHub</a>
          </div>
        </div>
      </div>
    </div>
  );
};
