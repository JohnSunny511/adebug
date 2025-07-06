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
    title: "Area Calculation Bug",
    language: "Python",
    code: `def calculate_area(radius):
area = 3.14 * r ** 2
print("Area is: " + area)

calculatearea(5)`,
    expected: "Should print the area of the circle correctly"
  },
  medium: {
    id: 2,
    title: "Factorial Logic Error",
    language: "Python",
    code: `def factorial(n):
    result = 1
    for i in range(n):
        result *= i
    return result

print(factorial(5))`,
    expected: "Should print factorial of 5"
  },
  hard: {
    id: 3,
    title: "Fibonacci Sequence Bug",
    language: "Python",
    code: `def fibonacci(n):
    a, b = 0, 1
    for i in range(n):
        a = b
        b = a + b
    print(b)

fibonacci(5)`,
    expected: "Should print first n Fibonacci numbers"
  }
};


const correctAnswers = {
  1: `def calculate_area(radius):
    area = 3.14 * radius ** 2
    print("Area is: " + str(area))

calculate_area(5)`,

  2: `def factorial(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

print(factorial(5))`,

  3: `def fibonacci(n):
    a, b = 0, 1
    for i in range(n):
        print(a)
        a, b = b, a + b

fibonacci(5)`
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
