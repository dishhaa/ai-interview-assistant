import React from "react";
import { Button, Typography, Card } from "antd";

export default function Hero() {
  return (
    <section id="top" style={{ padding: "48px 0", background: "#19183B", borderRadius: 12 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24, alignItems: "center" }}>
        <div>
          <Typography.Title level={1} style={{ color: "#E7F2EF", marginBottom: 8, textAlign: "left", fontSize: 48, fontFamily: 'Montserrat, Inter, sans-serif', fontWeight: 700 }}>
            Interview smarter with AI
          </Typography.Title>
          <Typography.Paragraph style={{ color: "#E7F2EF", opacity: 0.9, fontSize: 16, marginBottom: 24, textAlign: "left" }}>
            Practice MCQs and real questions, get instant scoring, and track progress.
          </Typography.Paragraph>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-start", alignItems: "center" }}>
            <Typography.Title level={4} style={{ margin: 0, color: "#E5E7EB" }}>Start Practicing</Typography.Title>
          </div>
        </div>
        <div>
          <Card style={{ background: "#A1C2BD", transition: "transform 300ms ease, box-shadow 300ms ease" }} hoverable>
            <Typography.Paragraph style={{ margin: 0, transition: "color 300ms ease" }}>
              "Skills over credentials." Build interview confidence with a modern, balanced prep.
            </Typography.Paragraph>
          </Card>
        </div>
      </div>
    </section>
  );
}


