import React, { useEffect, useState } from "react";
import { Card, Input, Button, Progress } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateCandidate } from "../redux/candidateSlice";
import { getInterviewQuestions, evaluateAnswer, generateSummary } from "../utils/aiEngine";

export default function ChatWindow({ candidateId }) {
  const dispatch = useDispatch();
  const candidate = useSelector((s) => s.candidates.list.find(c => c.id === candidateId));

  const [questions] = useState(getInterviewQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [chat, setChat] = useState([]);
  const [timeLeft, setTimeLeft] = useState(questions[0]?.time || 20);
  const [interviewDone, setInterviewDone] = useState(false);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (interviewDone) return;
    if (timeLeft <= 0) return handleSubmitAnswer();
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, interviewDone]);

  const handleSubmitAnswer = () => {
    const userAnswer = answer.trim() || "(No answer)";
    const score = evaluateAnswer(userAnswer, currentQ.level);
    const newChat = [...chat, { role: "bot", text: currentQ.question }, { role: "user", text: userAnswer, score }];
    setChat(newChat);
    setAnswer("");

    if (currentIndex === questions.length - 1) return finishInterview(newChat);

    setCurrentIndex(currentIndex + 1);
    setTimeLeft(questions[currentIndex + 1]?.time || 20);
  };

  const finishInterview = (finalChat) => {
    setInterviewDone(true);
    const totalScore = finalChat.filter(m => m.role === "user").reduce((sum, m) => sum + (m.score || 0), 0);
    const summary = generateSummary(finalChat);
    dispatch(updateCandidate({ id: candidateId, data: { score: totalScore, status: "Completed", summary, chat: finalChat } }));
  };

  if (!candidate) return <p>Loading candidate...</p>;

  return (
    <Card title={`Interview for ${candidate.name}`} style={{ marginTop: 20 }}>
      {!interviewDone ? (
        <>
          <p><strong>Q{currentIndex + 1}:</strong> {currentQ.question}</p>
          <Progress percent={(timeLeft / currentQ.time) * 100} showInfo={false} />
          <p>Time left: {timeLeft}s</p>
          <Input.TextArea rows={3} value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer..." />
          <Button type="primary" onClick={handleSubmitAnswer} style={{ marginTop: 10 }}>Submit Answer</Button>
        </>
      ) : (
        <>
          <h3>Interview Completed</h3>
          <p><strong>Score:</strong> {candidate.score}</p>
          <p><strong>Summary:</strong> {candidate.summary}</p>
        </>
      )}

      <div style={{ marginTop: 20, maxHeight: 200, overflowY: "auto", borderTop: "1px solid #eee", paddingTop: 10 }}>
        {chat.map((m, i) => (
          <p key={i}><strong>{m.role === "bot" ? "AI:" : "You:"}</strong> {m.text}{m.score !== undefined && ` (Score: ${m.score})`}</p>
        ))}
      </div>
    </Card>
  );
}