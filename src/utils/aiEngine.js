// src/utils/aiEngine.js

// ✅ Correct answers with keywords
export const correctAnswers = {
  "Explain the difference between var, let, and const in JavaScript.": {
    fullAnswer: "var is function-scoped, let and const are block-scoped. const cannot be reassigned, let can, and var hoists differently.",
    keywords: ["var", "let", "const", "block-scoped", "function-scoped", "hoist", "reassign"]
  },
  "What are React hooks and why are they useful?": {
    fullAnswer: "Hooks allow functional components to use state and lifecycle methods. useState, useEffect are common hooks.",
    keywords: ["hooks", "state", "useState", "useEffect", "lifecycle", "functional component"]
  },
  "How does the virtual DOM improve performance in React?": {
    fullAnswer: "Virtual DOM minimizes real DOM manipulation by diffing changes and updating only necessary elements.",
    keywords: ["virtual DOM", "diffing", "performance", "DOM manipulation", "update"]
  },
  "Can you explain the event loop in Node.js?": {
    fullAnswer: "Event loop allows Node.js to perform non-blocking asynchronous operations by handling callbacks in the loop.",
    keywords: ["event loop", "asynchronous", "callbacks", "non-blocking", "Node.js"]
  },
  "How would you optimize a large-scale React application?": {
    fullAnswer: "Optimize using memoization, code splitting, lazy loading, and avoiding unnecessary re-renders.",
    keywords: ["memoization", "code splitting", "lazy loading", "performance", "re-render"]
  },
  "Describe how to design a scalable REST API with Node.js.": {
    fullAnswer: "Use proper routing, middleware, database indexing, caching, pagination, and follow REST conventions.",
    keywords: ["routing", "middleware", "database", "caching", "pagination", "REST", "Node.js"]
  }
};

// ✅ Interview questions with levels and time
const questionBank = {
  easy: [
    "Explain the difference between var, let, and const in JavaScript.",
    "What are React hooks and why are they useful?",
  ],
  medium: [
    "How does the virtual DOM improve performance in React?",
    "Can you explain the event loop in Node.js?",
  ],
  hard: [
    "How would you optimize a large-scale React application?",
    "Describe how to design a scalable REST API with Node.js.",
  ],
};

const timeLimits = { easy: 20, medium: 60, hard: 120 };

// ✅ Get interview questions
export function getInterviewQuestions() {
  return Object.entries(questionBank).flatMap(([level, qs]) =>
    qs.map((q, i) => ({
      id: `${level}-${i + 1}`,
      level,
      time: timeLimits[level],
      question: q,
    }))
  );
}

// ✅ Evaluate answer based on keywords and full match
export function evaluateAnswer(userAnswer, question) {
  if (!userAnswer?.trim()) return 0;

  const keyData = correctAnswers[question];
  if (!keyData) return 0;

  const { fullAnswer, keywords } = keyData;
  const answerLower = userAnswer.toLowerCase();

  // Full answer match → full marks
  if (answerLower.includes(fullAnswer.toLowerCase())) return 3;

  // Partial match based on keywords
  let matchedKeywords = 0;
  for (let kw of keywords) {
    if (answerLower.includes(kw.toLowerCase())) matchedKeywords++;
  }

  // Score proportional to matched keywords
  const score = Math.round((matchedKeywords / keywords.length) * 3);
  return score; // 0–3 marks
}

// ✅ Generate summary based on average score
export function generateSummary(chat) {
  const totalAnswers = chat.filter((m) => m.role === "user").length;
  const avgScore =
    chat.filter((m) => m.role === "user").reduce((s, m) => s + (m.score || 0), 0) /
    (totalAnswers || 1);

  if (avgScore > 2.5) return "Excellent candidate with strong technical skills.";
  if (avgScore > 1.5) return "Good candidate with decent understanding.";
  return "Needs improvement. Basic concepts not clear.";
}
