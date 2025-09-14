import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Profile = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Acceso denegado. Por favor, inicia sesión.");

            if (store.isRegistered) {
                dispatch({ type: "logout" });
            }
            navigate("/login");
        }
    }, [store.isRegistered, navigate, dispatch]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch({ type: "logout" });
        alert("Has cerrado sesión.");
        navigate("/");
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div
                        className="card bg-dark text-light p-4 rounded-4 shadow-lg"
                        style={{ boxShadow: "0 0 80px rgba(255, 7, 7, 0.6)" }}
                    >
                        {/* Foto de perfil */}
                        <div className="d-flex align-items-start">
                            <div style={{ width: "120px", height: "120px" }}>
                                <img
                                    src={
                                        store?.user?.avatar_url ||
                                        "/src/front/assets/avatars/avatar1.png"
                                    }
                                    alt="Avatar"
                                    className="rounded-circle object-fit-cover"
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </div>
                        </div>

                        {/* Nombre */}
                        <h1 className="mt-3 text-center">
                            {store?.user?.username || "User Name"}
                        </h1>

                        {/* Datos básicos */}
                        <h5 className="mt-4 text-primary">Datos de usuario</h5>
                        <div className="mt-0">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item bg-dark text-light">
                                    <strong>Email:</strong>{" "}
                                    {store?.user?.email || "notengo@email.net"}
                                </li>
                                <li className="list-group-item bg-dark text-light">
                                    <strong>Ubicación:</strong>{" "}
                                    {store?.user?.city && store?.user?.country
                                        ? `${store.user.city}, ${store.user.country}`
                                        : "Ubicación no registrada"}
                                </li>
                                <li className="list-group-item bg-dark text-light">
                                    <strong>Miembro desde:</strong>{" "}
                                    {store?.user?.created_at
                                        ? new Date(store.user.created_at).toLocaleDateString(
                                            "es-ES",
                                            { year: "numeric", month: "long", day: "numeric" }
                                        )
                                        : "No registrado"}
                                </li>
                            </ul>
                        </div>

                        {/* Estadísticas */}
                        <h5 className="mt-4 text-primary">Estadísticas</h5>
                        <div className="mt-0">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item bg-dark text-light">
                                    <strong>Partidas jugadas:</strong>{" "}
                                    {store?.user?.games?.length ||
                                        "Todavía no has jugado, ¿por qué no?"}
                                </li>
                                <li className="list-group-item bg-dark text-light">
                                    <strong>Palabras correctas:</strong>{" "}
                                    {store?.user?.correct_words || "Ni una todavía"}
                                </li>
                                <li className="list-group-item bg-dark text-light">
                                    <strong>Palabras erróneas:</strong>{" "}
                                    {store?.user?.failed_words ||
                                        "Eres un máquina, ni una has fallado"}
                                </li>
                                <li className="list-group-item bg-dark text-light">
                                    <strong>Ratio :</strong>{" "}
                                    {store?.user?.average_precision || "0%"}
                                </li>
                            </ul>
                        </div>

                        {/* Historial de partidas */}
                        <h5 className="mt-4 text-primary">Historial de partidas</h5>
                        <div className="mt-3">
                            <div className="card bg-dark border-light">
                                <div
                                    className="card-body bg-dark text-light overflow-auto"
                                    style={{ maxHeight: "200px" }}
                                >
                                    {store?.user?.games && store.user.games.length > 0 ? (
                                        [...store.user.games]
                                            .sort(
                                                (a, b) => new Date(b.played_at) - new Date(a.played_at)
                                            )
                                            .map((game) => (
                                                <div key={game.id_game}>
                                                    <h5 className="card-title">Partida #{game.id_game}</h5>
                                                    <p className="card-text">
                                                        Jugado el{" "}
                                                        {new Date(game.played_at).toLocaleDateString(
                                                            "es-ES",
                                                            {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                    <p className="card-text">
                                                        <strong>Puntuación:</strong> {game.final_score}
                                                    </p>
                                                    <p className="card-text">
                                                        <strong>Precisión:</strong>{" "}
                                                        {game.average_precision}%
                                                    </p>
                                                    <hr />
                                                </div>
                                            ))
                                    ) : (
                                        <p className="text-danger mt-2">
                                            Aún no tienes partidas registradas.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Descripción personalizada */}
                        <h5 className="mt-4 text-primary">Descripción personalizada</h5>
                        <div className="UserInfo">
                            <textarea
                                className="bg-dark text-light w-100 mt-2 border-light"
                                rows="3"
                                placeholder="Escribe aquí lo que quieras que los demás vean"
                            ></textarea>
                        </div>

                        {/* Botones */}
                        <div className="d-flex justify-content-around gap-5 mt-3">
                            <button className="btn btn-primary" onClick={handleLogout}>
                                LogOut
                            </button>
                            <button
                                className="btn btn-warning"
                                onClick={() => navigate("/edit-profile")}
                            >
                                Editar Perfil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
