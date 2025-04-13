// resources/js/api/gemini.js
export const fetchGeminiResponse = async (messages) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const systemPrompt = `You are a travel assistant. You only help with travel-related questions: destinations, trip packages, restaurant recommendations, best time to visit, activities, budgeting, and local tips. Don't answer unrelated questions.`;
  
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: messages.join("\n") }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 1024,
      },
      safetySettings: [],
    };
  
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
  
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't find a suitable response.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "An error occurred while trying to get a response.";
    }
  };
  