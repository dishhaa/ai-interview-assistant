// src/components/ChatWindow.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button, Input, Progress, Space, Tag, Radio, Typography, Tooltip } from "antd";
import { getInterviewQuestions, evaluateAnswer, generateSummary } from "../utils/aiEngine";
import { updateCandidate } from "../redux/candidateSlice";

export default function ChatWindow({ candidateId }) {
  const dispatch = useDispatch();
  const candidate = useSelector((s) =>
    s.candidates.list.find((c) => c.id === candidateId)
  );

  const [chat, setChat] = useState(candidate?.chat || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(candidate?.score || 0);

  const questions = useMemo(() => getInterviewQuestions(), []);

  const handleNext = () => {
    const q = questions[currentQuestionIndex];
    const evalScore = evaluateAnswer(q, answer);

    const newChat = [
      ...chat,
      { question: q, answer, score: evalScore },
    ];

    setChat(newChat);
    setScore(score + evalScore);
    setAnswer("");

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions done
      const summary = generateSummary(newChat);
      dispatch(
        updateCandidate({
          id: candidateId,
          changes: { chat: newChat, score: score + evalScore, status: "Completed", summary },
        })
      );
    }
  };

  if (!candidate) return null;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card title={`Interview with ${candidate.name}`} bordered={false} style={{ marginTop: 16, borderRadius: 10 }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Progress percent={Math.round((currentQuestionIndex / questions.length) * 100)} size="small" />
        {chat.map((c, idx) => (
          <Card type="inner" size="small" key={idx} title={`Q${idx + 1}: ${c.question}`}>
            <p><strong>Answer:</strong> {c.answer}</p>
            <Tag color={c.score > 0 ? "green" : "red"}>Score: {c.score}</Tag>
          </Card>
        ))}

        {currentQuestionIndex < questions.length ? (
          <>
            <Card type="inner" size="small" title={`Q${currentQuestionIndex + 1}: ${currentQuestion}`}>
              <Input.TextArea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Card>
            <Button type="primary" onClick={handleNext} style={{ marginTop: 8 }}>
              Submit Answer
            </Button>
          </>
        ) : (
          <Typography.Paragraph style={{ color: "green", fontWeight: 600 }}>
            Interview Completed! Total Score: {score}
          </Typography.Paragraph>
        )}
      </Space>
    </Card>
  );
}
