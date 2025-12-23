const express = require("express");
const router = express.Router();
const googlegenai = require("@google/genai");

router.get("/", async (req, res) => {
  const api = process.env.GEN_API;
  // console.log(api);
  const ai = new googlegenai.GoogleGenAI({ apiKey: process.env.GEN_API });

  // const chat = ai.chats.create({
  //   model: "gemini-2.5-flash",
  //   history: [
  //     {
  //       role: "user",
  //       parts: [{ text: "Hello" }],
  //     },
  //     {
  //       role: "model",
  //       parts: [
  //         { text: "Hi its great to meet you. What would you like to know" },
  //       ],
  //     },
  //   ],
  // });

  // const response1 = await chat.sendMessage({
  //   message: "I have 2 dogs in my house.",
  // });
  // console.log("Chat response 1:", response1.text);

  // const response2 = await chat.sendMessage({
  //   message: "How many paws are in my house?",
  // });
  // console.log("Chat response 2:", response2.text);

  res.render("index");
});

module.exports = router;
