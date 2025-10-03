import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button, Input, Progress, Space, Tag, Tooltip, Typography, Radio } from "antd";
import { getInterviewQuestions, evaluateAnswer, generateSummary } from "../utils/aiEngine";
import { updateCandidate } from "../redux/candidateSlice";

export default function ChatWindow({ candidateId, jd }) {
  const dispatch = useDispatch();
  const candidate = useSelector((s) =>
    s.candidates.list.find((c) => c.id === candidateId)
  );

  const [questions] = useState(getInterviewQuestions(jd));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chat, setChat] = useState([]);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.time || 20);
  const [interviewDone, setInterviewDone] = useState(false);
  const [paused, setPaused] = useState(false);
  const charLimit = 500;

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (interviewDone || paused) return;
    if (timeLeft <= 0) {
      handleSubmitAnswer();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, interviewDone, paused]);

  const handleSubmitAnswer = () => {
    const isMcq = currentQ.type === "mcq";
    const userAnswer = isMcq ? answer : (answer.trim() || "(No answer)");
    const score = evaluateAnswer(userAnswer, currentQ);

    const newChat = [
      ...chat,
      { role: "bot", text: currentQ.question, type: currentQ.type, options: currentQ.options },
      { role: "user", text: userAnswer, score },
    ];
    setChat(newChat);
    setAnswer("");

    if (currentIndex === questions.length - 1) {
      finishInterview(newChat);
    } else {
      setCurrentIndex((i) => i + 1);
      setTimeLeft(questions[currentIndex + 1]?.time || 20);
    }
  };

  const handleSkip = () => {
    const newChat = [...chat, { role: "bot", text: currentQ.question }, { role: "user", text: "(Skipped)", score: 0 }];
    setChat(newChat);
    setAnswer("");
    if (currentIndex === questions.length - 1) {
      finishInterview(newChat);
    } else {
      setCurrentIndex((i) => i + 1);
      setTimeLeft(questions[currentIndex + 1]?.time || 20);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setChat([]);
    setAnswer("");
    setTimeLeft(questions[0]?.time || 20);
    setInterviewDone(false);
    setPaused(false);
  };

  const progressOverall = useMemo(() => Math.round(((currentIndex) / questions.length) * 100), [currentIndex, questions.length]);

  const finishInterview = (finalChat) => {
    setInterviewDone(true);
    const totalScore = finalChat
      .filter((m) => m.role === "user")
      .reduce((sum, m) => sum + (m.score || 0), 0);

    const summary = generateSummary(finalChat);

    dispatch(
      updateCandidate({
        id: candidateId,
        data: { score: totalScore, status: "Completed", summary, chat: finalChat },
      })
    );
  };

  if (!candidate) return <p>Loading candidate...</p>;

  return (
    <Card title={`Interview for ${candidate.name}`} style={{ marginTop: 20 }}>
      {!interviewDone ? (
        <>
          <Typography.Paragraph style={{ color: "#708993", fontSize: 16, marginBottom: 8, fontWeight: 600 }}>
            Practice with AI
          </Typography.Paragraph>
          <Typography.Paragraph style={{ marginTop: -8 }}>
            Timed questions help you focus on what matters.
          </Typography.Paragraph>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Tag color="blue">Question {currentIndex + 1} / {questions.length}</Tag>
            <Tag color={paused ? "orange" : timeLeft < currentQ.time * 0.3 ? "red" : "green"}>
              {paused ? "Paused" : `Time left: ${timeLeft}s`}
            </Tag>
          </Space>
          <Progress percent={(timeLeft / currentQ.time) * 100} showInfo={false} />
          <p><strong>Q{currentIndex + 1}:</strong> {currentQ.question}</p>
          {currentQ.type === "mcq" ? (
            <Radio.Group
              onChange={(e) => { setAnswer(e.target.value); setTimeout(handleSubmitAnswer, 50); }}
              value={answer}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
           >
              {currentQ.options?.map((opt) => (
                <Radio key={opt} value={opt}>{opt}</Radio>
              ))}
            </Radio.Group>
          ) : (
            <>
              <Input.TextArea
                rows={4}
                maxLength={charLimit}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={`Type your answer... (${charLimit} chars max)`}
                showCount
              />
              <Space style={{ marginTop: 10 }}>
                <Button type="primary" onClick={handleSubmitAnswer}>Submit Answer</Button>
              </Space>
            </>
          )}
          <Space style={{ marginTop: 10 }}>
            <Button onClick={() => setPaused((p) => !p)}>{paused ? "Resume" : "Pause"}</Button>
            <Tooltip title="Skip this question and move to next">
              <Button danger onClick={handleSkip}>Skip</Button>
            </Tooltip>
            <Button onClick={handleRestart}>Restart</Button>
          </Space>
        </>
      ) : (
        <>
          <h3>Interview Completed</h3>
          <p><strong>Final Score:</strong> {candidate.score}</p>
          <p><strong>Summary:</strong> {candidate.summary}</p>
          <Space style={{ marginBottom: 10 }}>
            <Tag color="blue">Questions: {questions.length}</Tag>
            <Tag color="purple">Progress: {progressOverall}%</Tag>
          </Space>
          <Button onClick={handleRestart}>Restart Interview</Button>
        </>
      )}

      <div style={{ marginTop: 20, maxHeight: 200, overflowY: "auto", borderTop: "1px solid #eee", paddingTop: 10 }}>
        {chat.map((m, i) => (
          <p key={i}>
            <strong>{m.role === "bot" ? "AI:" : "You:"}</strong> {m.text}
            {m.score !== undefined && <span style={{ color: "blue" }}> (Score: {m.score})</span>}
          </p>
        ))}
      </div>
    </Card>
  );
}