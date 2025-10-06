import React, { useState, useEffect } from "react";
import "../styles/donations.css";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Donations = () => {
    const [hoverIndex, setHoverIndex] = useState(null);
    const [displayedText, setDisplayedText] = useState("");
    const {store} = useGlobalReducer();

    const fullText = `¿Ves las monedas a los lados? Puedes brindarnos tu ayuda pinchando en la que más te convenga. No es necesario pero nos ayudaria mucho a avanzar con este proyecto y sobre todo nos motivaria a seguir mejorando y crear cosas nuevas. ¡Gracias por tu apoyo!`;
    
    useEffect(() => {
        let index = 0;

        const interval = setInterval(() => {
            if (index < fullText.length) {
                const char = fullText[index];
                if (char !== undefined) {
                    setDisplayedText(prev => prev + char);
                }
                index++;
            } else {
                clearInterval(interval);
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);

    const monedas = [
        {
            src: "https://res.cloudinary.com/dixwk4tan/image/upload/v1758889504/Moneda_cg7jvy.png",
            url: "https://www.paypal.com/donate/?hosted_button_id=6YDTSL4RFEXKQ"
        },
        {
            src: "https://res.cloudinary.com/dcau19bj1/image/upload/v1759769680/Moneda_chica_sin_bordes_wb0wla.png",
            url: "https://gofund.me/05f63abdf"
        }
    ];

    return (
        <div className="donations-container ">
            <video
                className="bg-video"
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                poster="https://res.cloudinary.com/dixwk4tan/video/upload/f_auto,q_auto/Hechizera_jaqeny.jpg"
            >
                <source
                    src="https://res.cloudinary.com/dixwk4tan/video/upload/v1758724121/Hechizera_jaqeny.mp4"
                    type="video/mp4"
                />
            </video>

            <div className="dontaions">
                <div className="monedas">
                {/* Moneda izquierda */}
                <a
                    href={monedas[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setHoverIndex(0)}
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    <img
                        src={monedas[0].src}
                        alt="Moneda izquierda"
                        className={`moneda-mago ${hoverIndex === 0 ? "hover spin" : ""}`}
                    />
                </a>

                {/* Moneda derecha */}
                <a
                    href={monedas[1].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setHoverIndex(1)}
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    <img
                        src={monedas[1].src}
                        alt="Moneda derecha"
                        className={`moneda-maga ${hoverIndex === 1 ? "hover spin" : ""}`}
                    />
                </a>
            </div>
            <div className="contenido">
                

                {/* Cuadro central */}
                <div className="box">
                    {/* Título */}
                    <h1 className="text-title">Hola {store.isRegistered ? store.user?.username : "Usuario"}</h1>

                    {/* Texto animado letra por letra */}
                    <span className="text">
                        {displayedText}
                        <span className={`cursor ${displayedText.length === fullText.length ? "hidden" : ""}`}>|</span>
                    </span>
                </div>

            </div>
            </div>
        </div>
    );
};
