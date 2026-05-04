import React from "react";
import { Activity, Database, FileText, ShieldCheck } from "lucide-react";

const updates = [
  {
    icon: Activity,
    title: "Health Trend Tracking",
    text: "Users can save previous predictions and compare health changes over time."
  },
  {
    icon: FileText,
    title: "Downloadable Report",
    text: "Generate a simple PDF report that includes entered values and prediction result."
  },
  {
    icon: Database,
    title: "Larger Dataset",
    text: "Improve accuracy by training the model with a cleaner and larger medical dataset."
  },
  {
    icon: ShieldCheck,
    title: "User Login",
    text: "Add secure login so users can privately manage their own prediction history."
  }
];

function FutureUpdates() {
  return (
    <section className="future-page">
      <div className="section-heading">
        <p className="tagline">Project Scope</p>
        <h1>Future Updates</h1>
        <p>These features can be added later to make the Diabetes Detection System more useful and complete.</p>
      </div>

      <div className="info-grid">
        {updates.map((update) => {
          const Icon = update.icon;

          return (
            <article className="info-card" key={update.title}>
              <Icon size={28} />
              <h3>{update.title}</h3>
              <p>{update.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default FutureUpdates;
