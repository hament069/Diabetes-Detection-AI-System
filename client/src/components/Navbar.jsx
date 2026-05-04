import React from "react";
import { Moon, Sun } from "lucide-react";

function Navbar({ page, setPage, theme, toggleTheme }) {
  return (
    <header className="navbar">
      <button className="brand" onClick={() => setPage("home")}>
        Diabetes Detection System
      </button>

      <nav className="nav-actions">
        <button className={page === "home" ? "nav-link active" : "nav-link"} onClick={() => setPage("home")}>
          Home
        </button>
        <button className={page === "prediction" ? "nav-link active" : "nav-link"} onClick={() => setPage("prediction")}>
          Prediction
        </button>
        <button className={page === "future" ? "nav-link active" : "nav-link"} onClick={() => setPage("future")}>
          Future Updates
        </button>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode" title="Toggle dark mode">
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
