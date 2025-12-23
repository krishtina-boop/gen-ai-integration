const express = require("express");
const router = express.Router();
const googlegenai = require("@google/genai");

router.get("/", async (req, res) => {
  res.render("index");
});

const ai = new googlegenai.GoogleGenAI({ apiKey: process.env.GEN_API });
const qanda = {
  hi: "hello",
  hello: "hi, what do you want to know today?",
  whatdoyoudo: "I help you understand about this web page",
  bye: "have a nice day",
};

let chathistory = [];

router.post("/chat", async (req, res) => {
  const userMsg = req.body.message;

  if (qanda[userMsg]) {
    return res.json({
      reply: qanda[userMsg],
      source: "rule-based",
    });
  }
  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: chathistory,
    });

    const response = await chat.sendMessage({
      message: userMsg,
    });

    chathistory.push(
      {
        role: "user",
        parts: [{ text: userMsg }],
      },
      {
        role: "user",
        parts: [{ text: response.text }],
      }
    );

    res.json({
      reply: response.text,
      source: "ai",
    });
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Chatbot failed" });
  }
});
module.exports = router;
