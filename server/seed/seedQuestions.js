// seed.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Question = require("../models/Question");

dotenv.config(); // load .env

const questions = [
  {
    id: 1,
    level: "easy",
    title: "Area Calculation Bug",
    language: "Python",
    code: `def calculate_area(radius):
area = 3.14 * r ** 2
print("Area is: " + area)

calculatearea(5)`,
    expected: "Should print the area of the circle correctly",
    correctAnswer: `def calculate_area(radius):
    area = 3.14 * radius ** 2
    print("Area is: " + str(area))

calculate_area(5)`,
  },
  {
    id: 2,
    level: "medium",
    title: "Factorial Logic Error",
    language: "Python",
    code: `def factorial(n):
    result = 1
    for i in range(n):
        result *= i
    return result

print(factorial(5))`,
    expected: "Should print factorial of 5",
    correctAnswer: `def factorial(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

print(factorial(5))`,
  },
  {
    id: 3,
    level: "hard",
    title: "Fibonacci Sequence Bug",
    language: "Python",
    code: `def fibonacci(n):
    a, b = 0, 1
    for i in range(n):
        a = b
        b = a + b
    print(b)

fibonacci(5)`,
    expected: "Should print first n Fibonacci numbers",
    correctAnswer: `def fibonacci(n):
    a, b = 0, 1
    for i in range(n):
        print(a)
        a, b = b, a + b

fibonacci(5)`,
  },
];

const seedDB = async () => {
  try {
    await connectDB(); // connect to MongoDB
    await Question.deleteMany({});
    await Question.insertMany(questions);
    console.log("✅ Sample questions inserted");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding DB:", err);
    process.exit(1);
  }
};

seedDB();
