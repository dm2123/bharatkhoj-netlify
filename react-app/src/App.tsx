import { HashRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { AIPage } from "./pages/AIPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { BottomNav } from "./components/BottomNav";
import { Toast } from "./components/Toast";

function Nav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active =
    pathname === "/" ? "home" : pathname.startsWith("/discover") ? "discover" : "search";

  return (
    <BottomNav
      active={active}
      onNavigate={(to) => {
        if (to === "home") navigate("/");
        else if (to === "discover") navigate("/discover");
        else {
          const q = new URLSearchParams(window.location.hash.split("?")[1] ?? "").get("q");
          navigate(q ? `/search?q=${encodeURIComponent(q)}&tab=all` : "/");
        }
      }}
    />
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
      </Routes>
      <Nav />
      <Toast />
    </HashRouter>
  );
}
