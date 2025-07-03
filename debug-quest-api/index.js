// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());             // Allows frontend to access the API
app.use(express.json());     // important for POST body parsing

// Hardcoded questions
const questions = {
  easy: {
    id: 1,
    title: "Sum Function Bug",
    language: "Python",
    code: "def add(a, b):\n    return a - b",
    expected: "Should return sum of a and b"
  },
  medium: {
    id: 2,
    title: "Loop Logic Error",
    language: "JavaScript",
    code: "for(let i = 0; i <= 5; i++) {\n  console.log(i * i);\n}",
    expected: "Should print square of numbers 1 to 5"
  },
  hard: {
    id: 3,
    title: "Fibonacci Fault",
    language: "C",
    code: "#include <stdio.h>\nvoid fib(int n) {\n int a=0, b=1, c;\n for(int i=2;i<n;i++){\n  c=a+b;\n  a=b;\n  b=c;\n }\n printf(\"%d\", c);\n}",
    expected: "Should print all n Fibonacci numbers"
  }
};

const correctAnswers = {
  1: "def add(a, b):\n    return a + b",
  2: "print('Hello, World!')",
  3: "def square(n):\n    return n * n"
};


// Endpoints
app.get('/api/easy', (req, res) => {
  res.json(questions.easy);
});

app.get('/api/medium', (req, res) => {
  res.json(questions.medium);
});

app.get('/api/hard', (req, res) => {
  res.json(questions.hard);
});

app.post('/api/submit', (req, res) => {
  const { id, code } = req.body;

  const expected = correctAnswers[id];

  // Normalize by trimming whitespace
  const normalize = (str) =>
    str.replace(/\r/g, "").trim(); // remove carriage returns and trim

  const isCorrect = normalize(code) === normalize(expected);

  if (isCorrect) {
    res.json({ passed: true, message: "✅ Code is correct!" });
  } else {
    res.json({
      passed: false,
      message: "❌ Code is incorrect.",
      correctAnswer: expected
    });
  }
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
