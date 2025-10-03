import React from "react";
import { Card, Typography } from "antd";

const stats = [
  { label: "Questions", value: "6/Session" },
  { label: "Avg. Time", value: "~4 min" },
  { label: "Formats", value: "MCQ + Subjective" },
];

export default function Stats() {
  return (
    <section id="stats" style={{ padding: "32px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        {stats.map((s) => (
          <Card key={s.label} style={{ textAlign: "center" }}>
            <Typography.Title level={3} style={{ color: "#E7F2EF", marginBottom: 0 }}>{s.value}</Typography.Title>
            <Typography.Paragraph style={{ color: "#708993", marginTop: 4 }}>{s.label}</Typography.Paragraph>
          </Card>
        ))}
      </div>
    </section>
  );
}


