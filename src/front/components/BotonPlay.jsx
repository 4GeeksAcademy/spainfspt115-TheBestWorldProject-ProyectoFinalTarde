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
        handleModalPlay();

        if (store.isRegistered) {
            navigate("/game");
        } else {
            setShowModal(true);
        }
    };

    const handleModalPlay = () => {
        if (showModal)
        {
            navigate("/game");
        }
    }

    return (
        <div>
            <button onClick={handleClick} className="btn btn-primary">
                Jugar
            </button>

            {showModal &&
                createPortal(
                    <div className="modal-overlay">
                        <div className="card-neon modal-card">
                            <h3 className="modal-title">¿ Quieres competir?  </h3>
                            <h4>Loguéate</h4>
                            <p>¿ A qué esperas ?</p>

                            <div className="modal-buttons">
                                <button
                                    onClick={handleClick}
                                    className="close-btn"
                                >
                                    Jugar
                                </button>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="close-btn"
                                >
                                    Entrar
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.getElementById("modal-root")
                )}
        </div>
    );
};
