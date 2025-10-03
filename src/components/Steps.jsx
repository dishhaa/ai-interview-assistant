import React from "react";
import { Card, Typography } from "antd";

const items = [
  { step: "1", title: "Upload JD", desc: "Tailor the interview to the role." },
  { step: "2", title: "Create Profile", desc: "Save details and start practice." },
  { step: "3", title: "Practice", desc: "Timed MCQ + subjective rounds with scoring." },
];

export default function Steps() {
  return (
    <section id="steps" style={{ padding: "32px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {items.map((s) => (
          <Card key={s.step}>
            <Typography.Title level={4} style={{ color: "#E7F2EF", marginBottom: 4 }}>
              {s.step}. {s.title}
            </Typography.Title>
            <Typography.Paragraph style={{ marginTop: 0 }}>{s.desc}</Typography.Paragraph>
          </Card>
        ))}
      </div>
    </section>
  );
}


