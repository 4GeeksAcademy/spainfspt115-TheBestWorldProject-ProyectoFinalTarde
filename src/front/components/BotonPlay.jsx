import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import "../styles/botonplay.css";

export const Play = () => {
    const { store } = useGlobalReducer();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleClick = () => {
        if (store.isRegistered) {
            navigate("/game");
        } else {
            setShowModal(true);
        }
    };

    return (
        <div>
            <button onClick={handleClick} className="btn btn-primary">
                Play
            </button>

            {showModal &&
                createPortal(
                    <div className="modal-overlay">
                        <div className="card-neon modal-card">
                            <h5 className="modal-title">¿ Aún no estás registrado ?</h5>
                            <p>¿ A qué esperas ?</p>

                            <div className="modal-buttons">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="close-btn"
                                >
                                    Jugar
                                </button>
                                <button
                                    onClick={() => navigate("/signup")}
                                    className="close-btn"
                                >
                                    Registrarse
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.getElementById("modal-root")
                )}
        </div>
    );
};
