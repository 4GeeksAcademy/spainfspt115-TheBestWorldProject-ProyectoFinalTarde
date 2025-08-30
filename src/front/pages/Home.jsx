import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<>
			<div className="d-flex flex-column justify-content-center align-items-center ">
				<h1 className="mb-4 mt-5">Bienvenido a Nombrejuego</h1>
				<div className="position-absolute top-50 start-50 translate-middle">
					<div className="card " style={{ width: "38rem" }}>
						<div className="card-body text-center">
							<h3 className="card-title">User Name</h3>
							<p className="card-text">
								Si te registras podrás obtener varias bonificaciones y podrás acceder a tus estadísticas
							</p>
							<a href="#" className="btn btn-primary w-100">Play</a>
						</div>
					</div>
					<div className="Creadores d-flex flex-column justify-content-center align-items-center mt-5">
						<h5>Created By: Carlos, Arturo, Constantin, Javier y Kostantin</h5>
					</div>
				</div>
			</div>
		</>

	);
}; 