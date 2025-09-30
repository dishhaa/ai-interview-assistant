// src/App.jsx
import React, { useState, useRef } from "react";
import { Layout, Tabs, Card, Input, Button, Upload, Typography, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import ChatWindow from "./components/ChatWindow";
import JobDescription from "./components/JobDescription";
import Dashboard from "./components/Dashboard";
import { addCandidate } from "./redux/candidateSlice";
import { parseResume } from "./utils/resumeParser";

const { Content } = Layout;
const { TabPane } = Tabs;
const { Title } = Typography;

export default function App() {
  const dispatch = useDispatch();
  const candidates = useSelector((s) => s.candidates.list || []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [jd, setJD] = useState("");

  const chatRef = useRef(null);
  const candidateRef = useRef(null);

  // Resume upload
  const handleFileUpload = async (file) => {
    try {
      const data = await parseResume(file);
      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setFile(file);
      setShowChat(false); // ensure chat hidden on new upload
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

  // Delete resume and reset details
  const deleteFile = () => {
    setFile(null);
    setName("");
    setEmail("");
    setPhone("");
    setSelectedCandidate(null);
    setShowChat(false);
  };

  // Create candidate
  const createCandidate = () => {
    if (!name || !email || !phone) {
      message.error("Please fill all candidate details before creating!");
      return;
    }
    const id = uuidv4();
    const candidate = { id, name, email, phone, score: 0, status: "Not Started", chat: [] };
    dispatch(addCandidate(candidate));
    setSelectedCandidate(id);
    setShowChat(false);
    message.success("Candidate created!");
  };

  // Start interview for interviewee tab
  const startInterview = () => {
    if (!selectedCandidate) return;
    setShowChat(true);

    setTimeout(() => {
      chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100); // scroll after render
  };

  const selected = candidates.find((c) => c.id === selectedCandidate);

  // Interviewer dashboard "View" button
  const handleViewCandidate = (id) => {
    setSelectedCandidate(id);
    setShowChat(false); // never show chat in interviewer tab
    setTimeout(() => {
      candidateRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <Layout style={{ minHeight: "100vh", padding: "20px", background: "#f5f7fa" }}>
      <Content style={{ maxWidth: 700, margin: "0 auto" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 30, color: "#1890ff" }}>
          AI-Powered Interview Assistant
        </Title>

        <Tabs defaultActiveKey="1" type="card" centered size="large">

          {/* Interviewee Tab */}
          <TabPane tab="Interviewee" key="1">
            <JobDescription candidateView={true} onJDParsed={(text) => setJD(text)} />

            <Card
              title="Candidate Information"
              bordered={false}
              style={{
                marginTop: 20,
                borderRadius: 10,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: 20,
              }}
            >
              <Upload showUploadList={false} beforeUpload={handleFileUpload} accept=".pdf,.docx">
                <Button
                  icon={<UploadOutlined />}
                  type="primary"
                  style={{ marginBottom: 8, borderRadius: 5 }}
                >
                  Upload Resume
                </Button>
              </Upload>

              {file && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                    background: "#f0f2f5",
                    padding: 10,
                    borderRadius: 5,
                  }}
                >
                  <span>{file.name}</span>
                  <Button size="small" onClick={viewFile}>View</Button>
                  <Button size="small" danger onClick={deleteFile}>Delete</Button>
                </div>
              )}

              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginBottom: 8, borderRadius: 5 }}
              />
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: 8, borderRadius: 5 }}
              />
              <Input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ marginBottom: 12, borderRadius: 5 }}
              />

              <div style={{ display: "flex", gap: 10 }}>
                <Button type="primary" onClick={createCandidate} style={{ borderRadius: 5 }}>
                  Create Candidate
                </Button>

                {selectedCandidate && !showChat && selected && (
                  <Button type="primary" onClick={startInterview} style={{ borderRadius: 5 }}>
                    Start Interview
                  </Button>
                )}
              </div>

              {showChat && selectedCandidate && (
                <div ref={chatRef}>
                  <ChatWindow candidateId={selectedCandidate} />
                </div>
              )}
            </Card>
          </TabPane>

          {/* Interviewer Dashboard */}
          <TabPane tab="Interviewer Dashboard" key="2">
            <JobDescription candidateView={false} onJDParsed={(text) => setJD(text)} />
            <Dashboard onOpenCandidate={handleViewCandidate} />

            {selectedCandidate && selected && (
              <div ref={candidateRef}>
                <Card
                  title={`Candidate: ${selected.name}`}
                  bordered={false}
                  style={{
                    marginTop: 20,
                    borderRadius: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    padding: 20,
                  }}
                >
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
      </Content>
    </Layout>
  );
}
