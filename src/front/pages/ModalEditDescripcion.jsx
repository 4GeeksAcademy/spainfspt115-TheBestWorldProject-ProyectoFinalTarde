import React from "react";
import { createPortal } from "react-dom";
import "../styles/confirmationModal.css";

export const ConfirmationModal = ({ message = "Acción completada", onClose }) => {
    if (typeof document === "undefined") return null;

    const modalRoot = document.getElementById("modal-root") || document.body;

    const modal = (
        <div className="confirmation-modal-overlay" onClick={onClose}>
            <div className="confirmation-modal-card" onClick={(e) => e.stopPropagation()}>
                <h3 className="confirmation-modal-title">Confirmación</h3>
                <p className="confirmation-modal-message">{message}</p>
                <div className="confirmation-modal-buttons">
                    <button onClick={onClose} className="confirmation-close-btn" autoFocus>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, modalRoot);
};
