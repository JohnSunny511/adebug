const express = require("express");
const {
  listAdminQuestions,
  createAdminQuestion,
  deleteAdminQuestion,
} = require("../controllers/adminQuestionController");

const router = express.Router();

router.get("/", listAdminQuestions);
router.post("/", createAdminQuestion);
router.delete("/:id", deleteAdminQuestion);

module.exports = router;
