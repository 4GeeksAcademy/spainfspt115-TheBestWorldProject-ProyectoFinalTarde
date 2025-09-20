import { Navigate, Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect } from "react";

export const Layout = () => {
  const { store, dispatch } = useGlobalReducer();
  const location = useLocation();

  // Detectamos si estamos en Home
  const isHome = location.pathname === "/";

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");

      if (token && !store.user) {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/profile`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();

        if (response.ok) {
          dispatch({
            type: "set_user",
            payload: { user: data, token: token },
          });
        } else {
          localStorage.removeItem("token");
          dispatch({ type: "logout" });
        }
      }
    };
    checkSession();
  }, []);

  return (
    <ScrollToTop>
      <div className="d-flex flex-column">
        <Navbar />

        {/* Contenido principal */}
        <main
          className={`flex-grow-1 d-flex flex-column justify-content-center align-items-center`}
          style={{
            height: isHome
              ? "calc(100vh - 80px - 60px)" // Ajusta 80px navbar + 60px footer
              : "auto",
            overflow: isHome ? "hidden" : "visible",
          }}
        >
          <Outlet />
        </main>

        <Footer />
      </div>
    </ScrollToTop>
  );
};
