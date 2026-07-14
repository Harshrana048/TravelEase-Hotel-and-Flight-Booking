require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testModel() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Say hello in one sentence."
    });

    console.log("✅ Gemini API Working");
    console.log(response.text);
  } catch (error) {
    console.error("❌ Error:");
    console.error(error.message);

    if (error.response) {
      console.log(error.response.data);
    }
  }
}

testModel();