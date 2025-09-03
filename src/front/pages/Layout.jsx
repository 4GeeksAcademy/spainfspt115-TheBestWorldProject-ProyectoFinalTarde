import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

// Componente Layout: mantiene Navbar, Footer y scroll-to-top en toda la app
export const Layout = () => {
  return (
    <ScrollToTop>
      <div className="d-flex flex-column min-vh-100">

        <Navbar />

        {/* Contenido principal (ajustado con padding para no tapar con navbar/footer) */}
        <main
          className="flex-grow-1 d-flex flex-column justify-content-center"
          style={{ paddingTop: '80px', paddingBottom: '70px' }}
        >
          <Outlet />
        </main>

        <Footer />
      </div>
    </ScrollToTop>
  );
};
