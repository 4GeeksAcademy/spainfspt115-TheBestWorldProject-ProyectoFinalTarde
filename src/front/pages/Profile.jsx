import React from "react";

export const Profile = () => {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div
                        className="card bg-dark text-light p-4 rounded-4 shadow-lg"
                        style={{ boxShadow: "0 0 80px rgba(255, 7, 7, 0.6)" }}
                    >
                        {/* Foto */}
                        <div className="d-flex align-items-start">
                            <div className="ratio ratio-1x1" style={{ maxWidth: "120px" }}>
                                <img
                                    src="https://image.api.playstation.com/cdn/EP2097/CUSA00106_00/IC42y704aHKbO0sWS0WEkG9jCh8fCRey.png?w=440&thumb=false"
                                    alt="Perfil"
                                    className="w-100 h-100 rounded-circle object-fit-cover"
                                />
                            </div>
                        </div>

                        {/* Nombre */}
                        <h1 className="mt-3 text-center">User Name</h1>

                        {/* Datos básicos */}
                        <h5 className="mt-4 text-primary">Datos de usuario</h5>
                        <div className="mt-0">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item bg-dark text-light">
                                    <strong>Email:</strong> usuario@ejemplo.com
                                </li>
                                <li className="list-group-item bg-dark text-light">
                                    <strong>Ubicación:</strong> Ciudad, País
                                </li>
                                <li className="list-group-item bg-dark text-light">
                                    <strong>Miembro desde:</strong> Enero 2023
                                </li>
                            </ul>
                        </div>
                        {/* Estadisticas */}
                        <h5 className="mt-4 text-primary">Estadisticas</h5>
                        <div className="mt-0">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item bg-dark text-light">
                                    <strong>Partidas jugadas</strong> 37
                                </li>
                                <li className="list-group-item bg-dark text-light">
                                    <strong>Palabras correctas</strong> 84
                                </li>
                                <li className="list-group-item bg-dark text-light">
                                    <strong>Palabras erroneas</strong> 43
                                </li>
                                <li className="list-group-item bg-dark text-light">
                                    <strong>GreatRate</strong> 53%
                                </li>
                            </ul>
                        </div>
                        <h5 className="mt-4 text-primary">Historial de partidas</h5>
                        <div className="mt-3">
                            <div className="card bg-dark border-light">
                                <div
                                    className="card-body bg-dark text-light overflow-auto"
                                    style={{ maxHeight: "200px" }}
                                >
                                    <h5 className="card-title">Partida #1</h5>
                                    <p className="card-text">Jugado el 01/01/2023</p>
                                    <hr />

                                    <h5 className="card-title">Partida #2</h5>
                                    <p className="card-text">Jugado el 02/01/2023</p>
                                    <hr />

                                    <h5 className="card-title">Partida #3</h5>
                                    <p className="card-text">Jugado el 03/01/2023</p>
                                    <hr />

                                    <h5 className="card-title">Partida #4</h5>
                                    <p className="card-text">Jugado el 04/01/2023</p>
                                    <hr />

                                    <h5 className="card-title">Partida #5</h5>
                                    <p className="card-text">Jugado el 05/01/2023</p>
                                </div>
                            </div>
                        </div>

                        {/* Descripcion que quieras poner */}
                        <h5 className="mt-4 text-primary">Descripcion personalizada</h5>
                        <div className="UserInfo">
                            <textarea
                                className="bg-dark text-light w-100 mt-2 border-light text-light"
                                rows="3"
                                placeholder="Escribe aquí lo que quieras que los demás vean"
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

