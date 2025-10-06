import { Navigate, Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect } from "react";
import { getProfileData } from "../ApiServices";

export const Layout = () => {

  const { store, dispatch } = useGlobalReducer();
  const location = useLocation();

  // Detectamos si estamos en Home
  const isHome = location.pathname === "/";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !store.user) {
      getProfileData()
      .then(user => {
        dispatch({
          type: "set_user",
          payload: { user: user, token: token}
        });
    })
      .catch(error => {
        console.error("Fallo al verificar la sesión:", error.message);
        localStorage.removeItem("token");
        dispatch({ type: "logout"})
      })
  }
}, []);


  const hideLayout = location.pathname === "/game";

  return (
    <ScrollToTop>
      <div className="d-flex flex-column">
        {!hideLayout && <Navbar />}

        {/* Contenido principal */}
        <main
          className={`flex-grow-1 d-flex flex-column justify-content-center align-items-center`}
          style={{
            height: isHome
              ? "calc(100vh - 80px - 60px)"
              : "auto",
            overflow: isHome ? "hidden" : "visible",
          }}
        >
          <Outlet />
        </main>

        {!hideLayout && <Footer />}
      </div>
    </ScrollToTop>
  );
};