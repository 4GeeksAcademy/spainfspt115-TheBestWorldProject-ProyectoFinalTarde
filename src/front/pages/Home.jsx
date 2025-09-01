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
			<div className="container text-center">
			<h1 className="mb-4">Bienvenido a Nombrejuego</h1>

			<div className="row justify-content-center">
				<div className="col-12 col-md-8 col-lg-6">
				<div className="card shadow-sm">
					<div className="card-body">
					<h3 className="card-title">User Name</h3>
					<p className="card-text">
						Si te registras podrás obtener varias bonificaciones y podrás acceder a tus estadísticas
					</p>
					<a href="#" className="btn btn-primary w-100">
						Play
					</a>
					</div>
				</div>

				<div className="mt-4">
					<h5>Created By: Carlos, Arturo, Constantin, Javier y Kostantin</h5>
				</div>
				</div>
			</div>
			</div>
		</>
	);
}; 