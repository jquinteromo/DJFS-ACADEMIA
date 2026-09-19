import { Navigate, useRoutes } from "react-router-dom";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import DjProfilePage from "./components/DjProfilePage";
import DjsPage from "./components/DjsPage";
import HomePage from "./components/HomePage";
import TiendaPage from "./components/Tiendapage";

export default function AppRoutes() {
  const routes = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/dj-profile", element: <DjProfilePage /> },
    { path: "/djs", element: <DjsPage /> },
    { path: "/tienda", element: <TiendaPage /> },
    { path: "/sobre-nosotros", element: <AboutPage /> },
    { path: "/contacto", element: <ContactPage /> },
    { path: "/about", element: <Navigate to="/sobre-nosotros" replace /> },
    { path: "*", element: <Navigate to="/" replace /> },
  ]);

  return routes;
}