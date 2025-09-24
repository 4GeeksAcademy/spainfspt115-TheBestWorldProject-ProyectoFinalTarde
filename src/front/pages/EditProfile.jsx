import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/editprofile.css";
import { ConfirmationModal } from "./ModalEditDescripcion";
import { getCountries, getCitiesByCountry, updateUserProfile } from "../ApiServices";
// Avatares
import avatar1 from "../assets/avatars/avatar1.png";
import avatar2 from "../assets/avatars/avatar2.png";
import avatar3 from "../assets/avatars/avatar3.png";
import avatar4 from "../assets/avatars/avatar4.png";
import avatar5 from "../assets/avatars/avatar5.png";
import avatar6 from "../assets/avatars/avatar6.png";
import avatar7 from "../assets/avatars/avatar7.png";
import avatar8 from "../assets/avatars/avatar8.png";
import avatar9 from "../assets/avatars/avatar9.png";
import avatar10 from "../assets/avatars/avatar10.png";
import avatar11 from "../assets/avatars/avatar11.png";
import avatar12 from "../assets/avatars/avatar12.png";
import avatar13 from "../assets/avatars/avatar13.png";
import avatar14 from "../assets/avatars/avatar14.png";

export const EditProfile = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
    city: "",
    avatar_url: ""
  });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // Nuevo estado para modal

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const avatarOptions = [
    avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7,
    avatar8, avatar9, avatar10, avatar11, avatar12, avatar13, avatar14,
  ];

  useEffect(() => {
    if (store?.user) {
      setFormData({
        username: store.user.username || "",
        email: store.user.email || "",
        password: "",
        country: store.user.country || "",
        city: store.user.city || "",
        avatar_url: store.user.avatar_url || ""
      });
    }
  }, [store.user]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

    useEffect(() => {
        getCountries()
            .then(data => {
                setCountries(data);
            })
            .catch(err => console.error("Error al cargar países:", err));
    }, []);

    useEffect(() => {
        if (formData.country) {
            getCitiesByCountry(formData.country)
                .then(data => {
                    setCities(data);
                })
                .catch(err => console.error("Error al cargar ciudades:", err));
        } else {
            setCities([]);
        }
    }, [formData.country]);

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev =>({...prev, [name]: value}));
  if (name === "country") {
    setFormData(prev => ({...prev, city: ""}))
  }
}

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No tienes sesión activa.");
      return;
    }
    const dataToUpdate = {...formData};
    if (!dataToUpdate.password){
      delete dataToUpdate.password
    }
    updateUserProfile(dataToUpdate)
      .then(updatedUser => {
        dispatch({type: "set_user",
                  payload: {user: updatedUser, token: localStorage.getItem("token")}
        });
        setShowModal(true);
      })
      .catch(err => {
        setError(err.message);
      });

  };

  return (
    <div className="edit-container">
      <div className="edit-card">
        <h2>Editar Perfil</h2>

        <form onSubmit={handleUpdate}>
          {/* Avatares */}
          <div className="avatar-selection">
            {avatarOptions.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`avatar${i + 1}`}
                className={formData.avatar_url === img ? "selected": ""}
                onClick={() => setFormData(prev => ({...prev, avatar_url: img}))}
              />
            ))}
          </div>

          {/* Username */}
          <label className="form-label">Usuario</label>
          <input
          name="username"
            type="text"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <label className="form-label">Email</label>
          <input
            name= "email"
            type="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <label className="form-label">Nueva contraseña</label>
          <input
            name="password"
            type="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            placeholder="Deja en blanco para no cambiarla"
          />

          {/* País */}
          <label className="form-label">País</label>
          <select
            name="country"
            className="form-select"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="">Selecciona un país</option>
            {countries.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>

          {/* Ciudad */}
          <label className="form-label">Ciudad</label>
          <select
            name="city"
            className="form-select"
            value={formData.city}
            onChange={handleChange}
            disabled={!formData.country}
          >
            <option value="">Selecciona una ciudad</option>
            {cities.map((cityName, i) => <option key={i} value={cityName}>{cityName}</option>)}
          </select>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-flex justify-content-between mt-3">
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/profile")}>Cancelar</button>
            <button type="submit" className="btn btn-success" >Guardar cambios</button>
          </div>
        </form>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <ConfirmationModal
          message="Perfil actualizado correctamente"
          onClose={() => {
            setShowModal(false);
            navigate("/profile");
          }}
        />
      )}
    </div>
  );
};
