import { Navigate, Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect } from "react";

// Componente Layout: mantiene Navbar, Footer y scroll-to-top en toda la app
export const Layout = () => {
  const { store, dispatch } = useGlobalReducer();

  useEffect(() =>{
    const checkSession = async () => {
      const token = localStorage.getItem("token");

      if (token && !store.user) {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}`}
        });

        const data = await response.json();

        if (response.ok) {
          dispatch({
            type: "set_user",
            payload: {user: data, token: token}
          });
        } else {
          localStorage.removeItem("token");
          dispatch({type: "logout"})
        }
      }
    }
    checkSession()
  },[])

  return (
    <ScrollToTop>
      <div className="d-flex flex-column min-vh-100">

        <Navbar />

        {/* Contenido principal (ajustado con padding para no tapar con navbar/footer) */}
        <main
          className="flex-grow-1 d-flex flex-column justify-content-center"
          style={{ paddingTop: '80px', paddingBottom: '70px' }}
        >
          {/* {store.isRegistered ? <Outlet /> : <Navigate to="/signup" />} */}
          {<Outlet />}

        </main>

        <Footer />
      </div>
    </ScrollToTop>
  );
};
