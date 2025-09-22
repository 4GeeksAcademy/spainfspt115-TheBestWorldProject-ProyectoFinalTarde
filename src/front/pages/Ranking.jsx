import React, { useEffect, useState } from "react";
import "../styles/ranking.css";

export const Ranking = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/leaderboard`, {
                });
                if (!res.ok) throw new Error("Error al obtener el ranking");
                const data = await res.json();
                setPlayers(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRanking();
    }, []);

    return (
        <div className="ranking-container">
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
