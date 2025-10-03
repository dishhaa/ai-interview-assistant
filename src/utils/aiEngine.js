// src/utils/aiEngine.js

// ✅ Correct answers with keywords for subjective questions
export const correctAnswers = {
  "Explain the difference between var, let, and const in JavaScript.": {
    fullAnswer: "var is function-scoped, let and const are block-scoped. const cannot be reassigned, let can, and var hoists differently.",
    keywords: ["var", "let", "const", "block-scoped", "function-scoped", "hoist", "reassign"],
  },
  "What are React hooks and why are they useful?": {
    fullAnswer: "Hooks allow functional components to use state and lifecycle methods. useState, useEffect are common hooks.",
    keywords: ["hooks", "state", "useState", "useEffect", "lifecycle", "functional component"],
  },
  "How does the virtual DOM improve performance in React?": {
    fullAnswer: "Virtual DOM minimizes real DOM manipulation by diffing changes and updating only necessary elements.",
    keywords: ["virtual DOM", "diffing", "performance", "DOM manipulation", "update"],
  },
  "Can you explain the event loop in Node.js?": {
    fullAnswer: "Event loop allows Node.js to perform non-blocking asynchronous operations by handling callbacks in the loop.",
    keywords: ["event loop", "asynchronous", "callbacks", "non-blocking", "Node.js"],
  },
  "How would you optimize a large-scale React application?": {
    fullAnswer: "Optimize using memoization, code splitting, lazy loading, and avoiding unnecessary re-renders.",
    keywords: ["memoization", "code splitting", "lazy loading", "performance", "re-render"],
  },
  "Describe how to design a scalable REST API with Node.js.": {
    fullAnswer: "Use proper routing, middleware, database indexing, caching, pagination, and follow REST conventions.",
    keywords: ["routing", "middleware", "database", "caching", "pagination", "REST", "Node.js"],
  },
};

// ✅ Mixed MCQ and Subjective question bank organized by difficulty
const questionBank = {
  easy: [
    {
      type: "mcq",
      question: "Which keyword is block-scoped in JavaScript?",
      options: ["var", "let", "function", "with"],
      correctOption: "let",
    },
    {
      type: "subjective",
      question: "Explain the difference between var, let, and const in JavaScript.",
    },
  ],
  medium: [
    {
      type: "mcq",
      question: "Which hook is primarily used for side effects in React?",
      options: ["useMemo", "useEffect", "useRef", "useCallback"],
      correctOption: "useEffect",
    },
    {
      type: "subjective",
      question: "How does the virtual DOM improve performance in React?",
    },
  ],
  hard: [
    {
      type: "mcq",
      question: "Which is NOT typically a backend scaling strategy?",
      options: ["Sharding", "Indexing", "Code splitting", "Caching"],
      correctOption: "Code splitting",
    },
    {
      type: "subjective",
      question: "Describe how to design a scalable REST API with Node.js.",
    },
  ],
};

const timeLimits = { easy: 20, medium: 60, hard: 120 };

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ✅ Get 6 questions: 2 per difficulty (1 MCQ + 1 Subjective), with randomized type order per level
export function getInterviewQuestions(skillsText = "") {
  const skills = (skillsText || "")
    .split(/[\n,]/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const augmentedBank = JSON.parse(JSON.stringify(questionBank));

  if (skills.length) {
    const uniqueSkills = Array.from(new Set(skills)).slice(0, 4);
    uniqueSkills.forEach((skill, idx) => {
      const target = idx === 0 ? "easy" : idx === 1 ? "medium" : "hard";
      augmentedBank[target].push({ type: "subjective", question: `What are key concepts in ${skill}?` });
      augmentedBank[target].push({ type: "mcq", question: `Which is true about ${skill}?`, options: [
        `${skill} improves performance`, `${skill} is unrelated to web dev`, `${skill} is only for databases`, `None`
      ], correctOption: `${skill} improves performance` });
    });
  }

  const order = ["easy", "medium", "hard"];
  const result = [];
  order.forEach((level) => {
    const levelQs = augmentedBank[level];
    const randomized = shuffle(levelQs).slice(0, 2);
    randomized.forEach((q, idx) => {
      result.push({
        id: `${level}-${idx + 1}`,
      level,
      time: timeLimits[level],
        type: q.type,
        question: q.question,
        options: q.options || undefined,
        correctOption: q.correctOption || undefined,
      });
    });
  });
  return result; // total 6
}

// ✅ Evaluate answer for MCQ or Subjective
export function evaluateAnswer(userAnswer, questionObj) {
  if (questionObj.type === "mcq") {
    if (!userAnswer) return 0;
    return userAnswer === questionObj.correctOption ? 3 : 0;
  }

  // Subjective
  if (!userAnswer?.trim()) return 0;
  const keyData = correctAnswers[questionObj.question];
  if (!keyData) return 0;
  const { fullAnswer, keywords } = keyData;
  const answerLower = userAnswer.toLowerCase();
  if (answerLower.includes(fullAnswer.toLowerCase())) return 3;
  let matchedKeywords = 0;
  for (let kw of keywords) {
    if (answerLower.includes(kw.toLowerCase())) matchedKeywords++;
  }
  return Math.round((matchedKeywords / keywords.length) * 3);
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
