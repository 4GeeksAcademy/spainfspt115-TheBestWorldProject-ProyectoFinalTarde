export const About = () => {
  return (
    <div className="position-relative">

      <img
        src="src/front/assets/img/rigo-baby.jpg"
        alt="Gameplay background"
        className="position-fixed top-0 start-0 w-100 vh-100 object-fit-cover"
        style={{ zIndex: -1 }}
      />
      <div
        className="position-fixed top-0 start-0 w-100 vh-100 bg-dark opacity-50"
        style={{ zIndex: -1 }}
      ></div>

      <div className="container position-relative text-white">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 text-center">
            <h1 className="mb-3">Sobre el Juego</h1>
            <p className="lead">
              DESCRIPCION DE NUESTRO FLAMANTE Y ESPECTACULAR JUEGO
              PD: SALE SILKSONG Y QUIERO VICIAR.
            </p>

            <h3 className="mt-5 mb-3">Desarrolladores</h3>
            <ul className="list-unstyled">
              <li>Carlos – <a href="#" className="text-info">red1</a> | <a href="#" className="text-info">red2</a></li>
              <li>Javier – <a href="#" className="text-info">red1</a> | <a href="#" className="text-info">red2</a></li>
              <li>Konstantin – <a href="#" className="text-info">red1</a> | <a href="#" className="text-info">red2</a></li>
              <li>Arturo – <a href="#" className="text-info">red1</a> | <a href="#" className="text-info">red2</a></li>
              <li>Constantin – <a href="#" className="text-info">red1</a> | <a href="#" className="text-info">red2</a></li>
            </ul>

            <a href="#" className="btn btn-outline-light mt-4">Ver Repositorio en GitHub</a>
          </div>
        </div>
      </div>
    </div>
  );
};
