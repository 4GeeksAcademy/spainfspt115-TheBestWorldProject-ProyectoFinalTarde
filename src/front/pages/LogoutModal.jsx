import { createPortal } from "react-dom";
import "../styles/botonplay.css";

export const LogoutModal = ({ message, onClose }) => {
    return createPortal(
        <div className="modal-overlay">
            <div className="card-neon modal-card">
                <h3 className="modal-title">Atención</h3>
                <div className="modal-buttons">
                    <button onClick={onClose} className="close-btn">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")
    );
};
