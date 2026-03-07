// routes/authRoutes.js (MUST look like this)
const express = require("express");
const { signup, login } = require("../controllers/authController"); // <-- MUST BE IMPORTED
const { googleLogin } = require("../controllers/googleAuthController");

const router = express.Router();

// 🛑 THESE TWO ROUTES ARE CRITICAL AND MUST BE PRESENT
router.post("/signup", signup); 
router.post("/login", login); 

router.post("/google-login", googleLogin); 

module.exports = router;