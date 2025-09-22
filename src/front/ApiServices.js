export const UpdateUser = async (dispatch, token) => {

    if (!token) return;

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
            payload: {user, token},
        });
    } catch (err) {
        console.error("Error Al la informacion del usuario", err);
        localStorage.removeItem("token");
        dispatch({type: "logout"});
    };
}