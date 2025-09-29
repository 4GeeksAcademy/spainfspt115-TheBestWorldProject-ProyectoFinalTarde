import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "../styles/botonplay.css";

export const LogoutModal = ({ message = "Acción completada", onClose }) => {
    if (typeof document === "undefined") return null;

    const modalRoot = document.getElementById("modal-root") || document.body;

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        document.addEventListener("keydown", handleKey);

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = originalOverflow;
        };
    }, [onClose]);

    const modal = (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="card-neon modal-card"
                role="dialog"
                aria-modal="true"
                aria-labelledby="logout-modal-title"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 id="logout-modal-title" className="modal-title">
                    Atención
                </h3>
                <p className="modal-message">{message}</p>
                <div className="modal-buttons">
                    <button onClick={onClose} className="close-btn" autoFocus>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, modalRoot);
};
