import React from "react";
import { ArrowRight, ClipboardCheck, HeartPulse, Server } from "lucide-react";

function Home({ setPage }) {
  return (
    <section className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <p className="tagline">Final Year College Project</p>
          <h1>Diabetes Detection System</h1>
          <p className="hero-text">
            A simple and practical web application that uses health parameters to provide early diabetes prediction support.
            The website collects user input, sends it to the backend, and shows the machine learning prediction clearly.
          </p>
          <button className="primary-btn" onClick={() => setPage("prediction")}>
            Start Prediction <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="info-grid">
        <article className="info-card highlight-card">
          <HeartPulse size={28} />
          <h3>Early Risk Support</h3>
          <p>This system is only for early prediction support. It is not a final medical diagnosis.</p>
        </article>
        <article className="info-card">
          <ClipboardCheck size={28} />
          <h3>Enter Health Details</h3>
          <p>Users fill basic medical parameters such as glucose, BMI, insulin and age.</p>
        </article>
        <article className="info-card">
          <Server size={28} />
          <h3>Backend Processing</h3>
          <p>The Express server receives the data and forwards it to the ML service safely.</p>
        </article>
        <article className="info-card">
          <HeartPulse size={28} />
          <h3>Prediction Result</h3>
          <p>The trained model returns whether diabetes risk is likely or not likely.</p>
        </article>
      </div>
    </section>
  );
}

export default Home;
