const express = require("express");
const axios = require("axios");

const router = express.Router();
const CHATBOT_SERVICE_URL = process.env.CHATBOT_SERVICE_URL || "http://localhost:8000";

function handleProxyError(error, res) {
  if (error.response) {
    return res.status(error.response.status).json(error.response.data);
  }

  console.error("Chatbot admin proxy error:", error.message);
  return res.status(502).json({ error: "Chatbot service is unavailable." });
}

router.post("/upload", async (req, res) => {
  try {
    const response = await axios({
      method: "post",
      url: `${CHATBOT_SERVICE_URL}/upload`,
      data: req,
      headers: {
        "content-type": req.headers["content-type"],
        ...(req.headers["content-length"]
          ? { "content-length": req.headers["content-length"] }
          : {}),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    return handleProxyError(error, res);
  }
});

router.post("/add", async (req, res) => {
  try {
    const response = await axios.post(`${CHATBOT_SERVICE_URL}/add`, req.body);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return handleProxyError(error, res);
  }
});

router.get("/list", async (_req, res) => {
  try {
    const response = await axios.get(`${CHATBOT_SERVICE_URL}/list`);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return handleProxyError(error, res);
  }
});

router.delete("/delete/:name", async (req, res) => {
  try {
    const safeName = encodeURIComponent(req.params.name);
    const response = await axios.delete(`${CHATBOT_SERVICE_URL}/delete/${safeName}`);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return handleProxyError(error, res);
  }
});

router.post("/clear_history", async (req, res) => {
  try {
    const response = await axios.post(`${CHATBOT_SERVICE_URL}/clear_history`, req.body || {});
    return res.status(response.status).json(response.data);
  } catch (error) {
    return handleProxyError(error, res);
  }
});

module.exports = router;
