// src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import { Layout, Tabs, Card, Input, Button, Upload, Typography, message, ConfigProvider, Modal } from "antd";
import { theme as antdTheme } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import ChatWindow from "./components/ChatWindow";
import Dashboard from "./components/Dashboard";
import Hero from "./components/Hero";
import FeatureGrid from "./components/FeatureGrid";
import SiteFooter from "./components/Footer";
import { addCandidate } from "./redux/candidateSlice";
import { parseResume } from "./utils/resumeParser";

const { Content } = Layout;
const { TabPane } = Tabs;
const { Title } = Typography;

export default function App() {
  const dispatch = useDispatch();
  const candidates = useSelector((s) => s.candidates.list || []);

  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [isStartOpen, setIsStartOpen] = useState(false);

  const chatRef = useRef(null);
  const candidateRef = useRef(null);

  useEffect(() => {
    document.body.style.background = "#0B1020";
    document.body.style.color = "#E5E7EB";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Resume upload
  const handleFileUpload = async (file) => {
    try {
      const data = await parseResume(file);
      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setFile(file);
      setShowChat(false);
      message.success("Resume uploaded successfully!");
    } catch (err) {
      console.error(err);
      message.error("Failed to parse resume.");
    }
    return false;
  };

  const viewFile = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  const deleteFile = () => {
    setFile(null);
    setName("");
    setEmail("");
    setPhone("");
    setSelectedCandidate(null);
    setShowChat(false);
  };

  const createCandidate = () => {
    if (!name || !email || !phone) {
      message.error("Please fill all candidate details!");
      return;
    }
    const id = uuidv4();
    const candidate = { id, name, email, phone, score: 0, status: "Not Started", chat: [] };
    dispatch(addCandidate(candidate));
    setSelectedCandidate(id);
    setShowChat(false);
    message.success("Candidate created!");
  };

  const startInterview = () => {
    if (!selectedCandidate) return;
    setShowChat(true);
    setTimeout(() => {
      chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const selected = candidates.find((c) => c.id === selectedCandidate);

  const handleViewCandidate = (id) => {
    setSelectedCandidate(id);
    setShowChat(false);
    setTimeout(() => {
      candidateRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <ConfigProvider theme={{
      algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorBgBase: "#0B1020",
        colorBgContainer: "#111827",
        colorText: "#E5E7EB",
        colorPrimary: "#7C3AED",
        colorInfo: "#22D3EE",
        colorBorder: "#1F2937",
        borderRadius: 8,
      },
      components: {
        Card: { headerBg: "#111827", colorBorderSecondary: "#1F2937" },
        Button: { colorPrimary: "#7C3AED", colorPrimaryHover: "#6D28D9", colorPrimaryActive: "#5B21B6" },
        Tabs: { itemSelectedColor: "#E5E7EB" },
      },
    }}>
      <Layout style={{ minHeight: "100vh", padding: "20px", background: "#0B1020" }}>
        <Content style={{ maxWidth: 1200, margin: "0 auto" }}>
          <header style={{ marginBottom: 16 }}>
            <Title level={3} style={{ margin: 0, color: "#E5E7EB" }}>AI Interview Assistant</Title>
          </header>

          <Hero />
          <FeatureGrid />

          <div style={{ display: "flex", justifyContent: "center", marginTop: 20, marginBottom: 8 }}>
            <Button
              onClick={() => setIsStartOpen(true)}
              style={{
                background: "#22D3EE",
                color: "#0B1020",
                padding: "14px 28px",
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 10,
                border: "none",
                boxShadow: "0 8px 24px rgba(34, 211, 238, 0.35)",
              }}
              size="large"
            >
              Start Interview
            </Button>
          </div>

          <Modal title="Start Interview" open={isStartOpen} onCancel={() => setIsStartOpen(false)} footer={null} width={980}>
            <Tabs defaultActiveKey="1" centered>
              <TabPane tab="Interviewee" key="1">
                <Typography.Paragraph style={{ color: "#7C3AED", fontSize: 16, marginBottom: 8, fontWeight: 600 }}>
                  Tailor your practice
                </Typography.Paragraph>
                <Typography.Paragraph style={{ marginTop: -8 }}>
                  Upload your resume to auto-fill candidate details.
                </Typography.Paragraph>

                {/* Resume Upload */}
                <div style={{ marginBottom: 16 }}>
                  <Upload 
                    showUploadList={false} 
                    beforeUpload={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                  >
                    <Button icon={<UploadOutlined />}>Upload Resume</Button>
                  </Upload>
                  {file && (
                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                      <strong>{file.name}</strong>
                      <Button onClick={viewFile}>View</Button>
                      <Button danger onClick={deleteFile}>Delete</Button>
                    </div>
                  )}
                </div>

                {/* Candidate Info */}
                <Card title="Candidate Information" bordered={false} style={{ marginTop: 20, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ borderRadius: 5 }} />
                    <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ borderRadius: 5 }} />
                    <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ borderRadius: 5 }} />
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    <Button type="primary" onClick={createCandidate} style={{ borderRadius: 5 }}>Create Candidate</Button>
                    {selectedCandidate && !showChat && selected && (
                      <Button type="primary" onClick={startInterview} style={{ borderRadius: 5 }}>Start Interview</Button>
                    )}
                  </div>

                  {showChat && selectedCandidate && <div ref={chatRef}><ChatWindow candidateId={selectedCandidate} /></div>}
                </Card>
              </TabPane>

              <TabPane tab="Interviewer Dashboard" key="2">
                <Typography.Paragraph style={{ color: "#7C3AED", fontSize: 16, marginBottom: 8, fontWeight: 600 }}>
                  Assess faster
                </Typography.Paragraph>
                <Typography.Paragraph style={{ marginTop: -8 }}>
                  Filter and review candidates at a glance.
                </Typography.Paragraph>
                <Dashboard onOpenCandidate={handleViewCandidate} />

                {selectedCandidate && selected && (
                  <div ref={candidateRef}>
                    <Card title={`Candidate: ${selected.name}`} bordered={false} style={{ marginTop: 20, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: 20 }}>
                      <p><strong>Email:</strong> {selected.email}</p>
                      <p><strong>Phone:</strong> {selected.phone}</p>
                      <p><strong>Status:</strong> {selected.status}</p>
                      <p><strong>Score:</strong> {selected.score}</p>
                      {selected.summary && <p><strong>Summary:</strong> {selected.summary}</p>}
                    </Card>
                  </div>
                )}
              </TabPane>
            </Tabs>
          </Modal>

          <SiteFooter />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
