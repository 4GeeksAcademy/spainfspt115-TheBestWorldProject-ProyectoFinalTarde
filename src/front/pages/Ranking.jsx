import React, { useEffect, useState } from "react";
import "../styles/ranking.css";
import { getLeaderboard } from "../ApiServices";

export const Ranking = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    useEffect(() => {
        getLeaderboard()
            .then(data => {
                setPlayers(data);
            })
            .catch(err => {
                console.error("Error al obtener el ranking:", err);
                setError("No se pudo cargar el ranking. Intente de nuevo más tarde.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);



    return (
        <div className="ranking-container">
                <video
                className="bg-video"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                poster="https://res.cloudinary.com/dixwk4tan/video/upload/f_auto,q_auto/Hechizero_cmmfss.jpg"
            >
                <source
                src="https://res.cloudinary.com/dixwk4tan/video/upload/v1758724121/Hechizero_cmmfss.mp4"
                type="video/mp4"
                />
            </video>
            <div className="ranking-overlay"></div>

            <div className="ranking-wrapper">
                <h1 className="ranking-title"> Ranking de Jugadores </h1>

                <div className="ranking-card">
                    {loading ? (
                        <p className="ranking-loading">Cargando...</p>
                    ) : players.length > 0 ? (
                        <table className="ranking-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Jugador</th>
                                    <th>Puntuación</th>
                                    <th>Precisión</th>
                                </tr>
                            </thead>
                            <tbody>
                                {players.map((game, index) => (
                                    <tr key={game.id_game}>
                                        <td>{index + 1}</td>
                                        <td>{game.user.username}</td>
                                        <td>{game.final_score}</td>
                                        <td>{game.average_precision}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="ranking-empty">No hay jugadores en el ranking todavía.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
