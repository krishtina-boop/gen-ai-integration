const express = require("express");
const router = express.Router();
const googlegenai = require("@google/genai");
const { context, faq } = require("../config/context.js");
router.get("/", async (req, res) => {
  res.render("index");
});

const ai = new googlegenai.GoogleGenAI({ apiKey: process.env.GEN_API });
// const qanda = {
//   hi: "hello",
//   hello: "hi, what do you want to know today?",
//   whatdoyoudo: "I help you understand about this web page",
//   bye: "have a nice day",
// };
let chathistory = [];

router.post("/chat", async (req, res) => {
  const userMsg = req.body.message;

  // Create a strict prompt with context
  const prompt = `
  You are a customer support assistant for Job Finder. 
  You must answer questions based ONLY on the information provided below.
  
  CONTEXT INFORMATION:
  ${context}
  
  FAQ LIST:
  ${faq}
  
  STRICT RULES:
  1. ONLY use information from the CONTEXT INFORMATION and FAQ LIST above.
  2. If the answer is not in the provided information, reply EXACTLY: "I don't know based on the provided context."
  3. Do NOT use any outside knowledge or general information.
  4. Do NOT explain or elaborate beyond what's in the context.
  5. For FAQ questions, use the exact FAQ format and wording.
  
  Now, answer this question based ONLY on the information above:
  
  Question: "${userMsg}"
  
  Answer:`;

  console.log("FAQ being used:", faq); // Debug: Check what FAQ contains

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [{ type: "text", text: prompt }],
        },
      ],
      config: {
        temperature: 0.1,
        topP: 0.1,
        maxOutputTokens: 300,
        topK: 1, // More deterministic
      },
    });

    const apiResponse = response?.candidates?.[0];
    const parts = apiResponse?.content?.parts || [];
    const text = parts
      .map((p) => (typeof p.text === "string" ? p.text : ""))
      .join("")
      .trim();

    res.json({
      reply: text || "no response",
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Chatbot failed" });
  }
});
module.exports = router;
