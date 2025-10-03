import React from "react";
import { Card, Typography } from "antd";

const features = [
  {
    title: "Plan Smarter",
    subtitle: "Why it matters",
    desc: "AI-curated interviews mix MCQs and subjective questions for balanced prep.",
  },
  {
    title: "Score Instantly",
    subtitle: "Immediate feedback",
    desc: "Keyword and correctness-based scoring helps you learn faster.",
  },
  {
    title: "Stay Focused",
    subtitle: "Time-bound practice",
    desc: "Per-question timers simulate real interview pressure.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" style={{ padding: "32px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>
        <div style={{ gridColumn: "span 12" }}>
          <Typography.Title level={3} style={{ margin: 0, color: "#E7F2EF", textAlign: "left" }}>Features</Typography.Title>
        </div>
        <div style={{ gridColumn: "span 12", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {features.map((f) => (
          <Card key={f.title} hoverable style={{ transition: "transform 300ms ease, box-shadow 300ms ease" }}>
            <Typography.Paragraph style={{ color: "#708993", fontWeight: 600, marginBottom: 4 }}>
              {f.subtitle}
            </Typography.Paragraph>
            <Typography.Title level={4} style={{ marginTop: 0, color: "#E7F2EF" }}>{f.title}</Typography.Title>
            <Typography.Paragraph>{f.desc}</Typography.Paragraph>
          </Card>
        ))}
        </div>
      </div>
    </section>
  );
}


