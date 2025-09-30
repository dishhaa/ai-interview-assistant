// src/utils/jdParser.js

export function parseJD(text) {
  // Simple mock parser: extract skills by splitting on commas or newlines
  if (!text) return { skills: [], experience: "", role: "" };

  const lines = text.split("\n").map(line => line.trim()).filter(Boolean);

  const skillsLine = lines.find(line => line.toLowerCase().includes("skills:"));
  const experienceLine = lines.find(line => line.toLowerCase().includes("experience:"));
  const roleLine = lines.find(line => line.toLowerCase().includes("role:"));

  const skills = skillsLine ? skillsLine.split(":")[1].split(",").map(s => s.trim()) : [];
  const experience = experienceLine ? experienceLine.split(":")[1].trim() : "";
  const role = roleLine ? roleLine.split(":")[1].trim() : "";

  return { skills, experience, role };
}
