import React from "react";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Prediction from "./pages/Prediction.jsx";
import FutureUpdates from "./pages/FutureUpdates.jsx";

function App() {
  const [page, setPage] = useState("home");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="app">
      <Navbar page={page} setPage={setPage} theme={theme} toggleTheme={toggleTheme} />
      <main>
        {page === "home" && <Home setPage={setPage} />}
        {page === "prediction" && <Prediction />}
        {page === "future" && <FutureUpdates />}
      </main>
    </div>
  );
}

export default App;
