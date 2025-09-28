import React, { useState, useEffect } from "react";
import "../styles/donations.css";

export const Donations = () => {
    const [hoverIndex, setHoverIndex] = useState(null);
    const [displayedText, setDisplayedText] = useState("");

    const fullText = `Ves las monedas a los lados, puedes brindarnos tu ayuda pinchando en la que más te conviene. Gracias de todo corazón.
    Quiero agradecerte tu interés mostrado en este juego. Quiero decirte que tu opinión nos importa y queremos saberla, escríbemos a la siguiente dirección email@email.com. `;

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
            src: "https://res.cloudinary.com/dixwk4tan/image/upload/v1758889456/Moneda2_snl8yh.png",
            url: "https://gofund.me/05f63abdf"
        }
    ];

    return (
        <div className="donations-container">
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

            <div className="line-container">
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
                        className={`coin-img ${hoverIndex === 0 ? "hover spin" : ""}`}
                    />
                </a>

                {/* Cuadro central */}
                <div className="box">
                    {/* Título */}
                    <h1 className="text-title">Hola querido amigo nuestro</h1>

                    {/* Texto animado letra por letra */}
                    <span className="text">
                        {displayedText}
                        <span className={`cursor ${displayedText.length === fullText.length ? "hidden" : ""}`}>|</span>
                    </span>
                </div>

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
                        className={`coin-img ${hoverIndex === 1 ? "hover spin" : ""}`}
                    />
                </a>
            </div>
        </div>
    );
};
