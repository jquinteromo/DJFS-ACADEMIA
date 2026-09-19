import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import SiteLayout from "./components/SiteLayout";

export default function App() {
  return (
    <BrowserRouter>
      <SiteLayout>
        <AppRoutes />
      </SiteLayout>
    </BrowserRouter>
  );
}