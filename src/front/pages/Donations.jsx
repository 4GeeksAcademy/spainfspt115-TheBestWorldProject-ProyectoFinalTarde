import React, { useState } from "react";
import "../styles/donations.css";

export const Donations = () => {
    const [hoverIndex, setHoverIndex] = useState(null);

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
            {monedas.map((moneda, index) => (
                <a
                    key={index}
                    href={moneda.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                    className="donate-link"
                >
                    <img
                        src={moneda.src}
                        alt="Dona con PayPal"
                        className={`donate-img ${hoverIndex === index ? "hover spin" : ""}`}
                    />
                </a>
            ))}
        </div>
    );
};
