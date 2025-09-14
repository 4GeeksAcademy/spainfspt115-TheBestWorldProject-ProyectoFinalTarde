import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";


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
    }


    return (
        <div>
            <button onClick={handleClick} className="btn btn-primary">
                Play
            </button>

            {showModal && (
                <div className="modal" tabIndex="-1" style={{ display: "block" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">¡Juega Ahora!</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Elige como quieres continuar para empezar a jugar.</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowModal(false)
                                        navigate("/game")
                                    }}
                                >
                                    Jugar Como Invitado
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setShowModal(false);
                                        navigate("/login");
                                    }}>
                                    Iniciar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};