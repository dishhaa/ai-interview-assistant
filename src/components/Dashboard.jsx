import React, { useState } from "react";
import { Button, Table, Input, Card } from "antd";
import { useSelector } from "react-redux";

export default function Dashboard({ onOpenCandidate }) {
  const candidates = useSelector((s) => s.candidates.list || []);
  const [search, setSearch] = useState("");

  // ✅ Sort by score (descending)
  const sorted = [...candidates].sort((a, b) => (b.score || 0) - (a.score || 0));

  // ✅ Apply search filter
  const filtered = sorted.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (c.name || "").toLowerCase().includes(s) ||
      (c.email || "").toLowerCase().includes(s)
    );
  });

  // ✅ Data for table
  const data = filtered.map((c) => ({
    key: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    score: c.score ?? "In Progress",
    status: c.status || "Pending",
    id: c.id,
  }));

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      sorter: (a, b) =>
        (a.score === "In Progress" ? -1 : a.score) -
        (b.score === "In Progress" ? -1 : b.score),
      defaultSortOrder: "descend",
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
       title: "Actions",
  key: "actions",
  render: (_, record) => (
    <Button
      type="primary"
      style={{
        borderRadius: 5,
        padding: "4px 12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      }}
      onClick={() => onOpenCandidate(record.id)}
    >
      View
    </Button>
      ),
    },
  ];

  return (
    <Card
      title="Candidates Dashboard"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
    >
      <Input
        placeholder="Search by name/email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: 300, marginBottom: 12 }}
      />
      <Table columns={columns} dataSource={data} />
    </Card>
  );
}
