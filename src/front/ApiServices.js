const API_URL = import.meta.env.VITE_BACKEND_URL;

//FUNCION PARA MANEJAR RESPUESTAS Y ERRORES DE LA API//
const handleApiResponse = async (response) => {
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.msg || data.error || "Ocurtrio un error en la solicitud.")
    }
    return data;

};
//funcion para datos del perfil de un usuario logueado
export const getProfileData = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No se encontró token de autenticación.");

    const response = await fetch(`${API_URL}/api/profile`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
    });
    return handleApiResponse(response);
};

//funcion para obtener el perfil publico de otro jugador
export const getPublicProfile = async (userId) => {
    const response = await fetch(`${API_URL}/api/public-profile/${userId}`);
    return handleApiResponse(response);
}

//funcion para actualizar los datos del usuario 
export const updateUserProfile = async (userData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No se encontró token de autenticación.");

    const response = await fetch(`${API_URL}/api/user`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData) 
    });
    return handleApiResponse(response);
};

//funcion para los paises y ciudades
export const getCountries = async() =>{
    const response = await fetch(`${API_URL}/api/countries`);
    return handleApiResponse(response);
};

export const getCitiesByCountry = async (countryName) => {
    if (!countryName) return [];

    const response = await fetch(`${API_URL}/api/cities/${countryName}`);
    return handleApiResponse(response);
}

//-----------------------------------------------------------------------------//

export const UpdateInfoStoreUser = async (dispatch, token) => {
  if (!token) return null;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("No se pudo cargar el usuario");
    }

    const user = await response.json();

    dispatch({
      type: "update_user",
      payload: { user, token },
    });

    return user;
  } catch (err) {
    console.error("Error al cargar la info del usuario", err);
    localStorage.removeItem("token");
    dispatch({ type: "logout" });
    return null;
  }
};


// funcion de login
export const login = async (credentials) => {
    const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(credentials),
    });
    return handleApiResponse(response);
}

//funcion de signup
export const signup = async (newUserData) => {
    const response = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(newUserData)
    });
    return handleApiResponse(response);
}

//============== SERVICIOS DEL JUEGO =========== // 

export const getLeaderboard = async () => {
    const response = await fetch (`${API_URL}/api/leaderboard`);
    return handleApiResponse(response);
}