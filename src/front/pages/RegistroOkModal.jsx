import { createPortal } from "react-dom";
import "../styles/botonplay.css";

export const SuccessModal = ({ message, onClose }) => {
    return createPortal(
        <div className="modal-overlay">
            <div className="card-neon modal-card">
                <h3>Registrado con éxito. Puedes entrar con tu cuenta.</h3>
                <div className="modal-buttons">
                    <button className="close-btn" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")
    );
};