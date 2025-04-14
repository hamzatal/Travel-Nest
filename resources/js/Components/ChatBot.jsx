import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";

const ChatBot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hey there! How can I assist you today? Try one of the suggestions below!", sender: "bot" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const messagesEndRef = useRef(null);
  const conversationHistory = useRef([
    { role: "assistant", parts: [{ text: "Hey there! How can I assist you today? Try one of the suggestions below!" }] }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.3 } },
  };

  const messageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  };

  const suggestionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Function to call Gemini API
  const callGeminiAPI = async (userMessage) => {
    try {
      // Use VITE_GEMINI_API_KEY for Vite projects
      const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!geminiApiKey) {
        console.error("Gemini API key is missing");
        return "I can't connect to my brain right now. Please check the API configuration.";
      }
      
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`;
      
      // Update conversation history for context
      conversationHistory.current.push({ role: "user", parts: [{ text: userMessage }] });
      
      // Create history-aware prompt with full conversation context
      const contents = conversationHistory.current.map(entry => ({
        role: entry.role,
        parts: entry.parts
      }));

      // Prepend system message if it doesn't exist
      if (!contents.some(entry => entry.role === "system")) {
        contents.unshift({
          role: "system",
          parts: [{ text: "You are Travel Nest Bot, a helpful and friendly travel assistant. Keep responses concise, engaging, and travel-focused." }]
        });
      }
      
      console.log("Sending request to Gemini API with contents:", contents);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API error:", errorData);
        throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log("Gemini API response:", data);
      
      // Extract response text from Gemini API response
      let botReply = "I'm having trouble connecting to my brain. Please try again later.";
      
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        botReply = data.candidates[0].content.parts[0].text;
      }
      
      // Store bot response in conversation history
      conversationHistory.current.push({ role: "assistant", parts: [{ text: botReply }] });
      
      return botReply;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "I'm having trouble connecting right now. Please try again later.";
    }
  };

  // Fallback function to use if API fails
  const getFallbackResponse = (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes("destination") || lowerCaseMessage.includes("place") || lowerCaseMessage.includes("where")) {
      return "I'd recommend checking out Bali, Japan, Portugal, or Costa Rica - all amazing destinations! What kind of travel experience are you looking for?";
    } else if (lowerCaseMessage.includes("budget") || lowerCaseMessage.includes("cost") || lowerCaseMessage.includes("price")) {
      return "Budget planning is important! What's your price range? I can suggest affordable destinations or luxury getaways depending on what you're looking for.";
    } else if (lowerCaseMessage.includes("time") || lowerCaseMessage.includes("when") || lowerCaseMessage.includes("season")) {
      return "The best time to travel depends on your destination. Europe is lovely in spring/fall, Southeast Asia is great in winter, and tropical islands are year-round. When are you thinking of traveling?";
    } else if (lowerCaseMessage.includes("help") || lowerCaseMessage.includes("assist")) {
      return "I can help with destination ideas, budget planning, finding the best time to travel, or suggesting activities. What are you most interested in?";
    } else {
      return "I'd love to help with your travel plans! Tell me more about what you're looking for - destinations, activities, budget, or timing?";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage.trim();
    setMessages((prev) => [...prev, { text: userMsg, sender: "user" }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      let botResponse = await callGeminiAPI(userMsg);
      
      // If we got an error response, try the fallback
      if (botResponse.includes("trouble connecting") || botResponse.includes("can't connect")) {
        console.log("Using fallback response system");
        botResponse = getFallbackResponse(userMsg);
      }
      
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Error in chat submission:", error);
      const fallbackResponse = getFallbackResponse(userMsg);
      setMessages((prev) => [
        ...prev,
        { text: fallbackResponse, sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setMessages((prev) => [...prev, { text: suggestion, sender: "user" }]);
    setIsLoading(true);

    try {
      let botResponse = await callGeminiAPI(suggestion);
      
      // If we got an error response, try the fallback
      if (botResponse.includes("trouble connecting") || botResponse.includes("can't connect")) {
        console.log("Using fallback response system for suggestion");
        botResponse = getFallbackResponse(suggestion);
      }
      
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Error in suggestion click:", error);
      const fallbackResponse = getFallbackResponse(suggestion);
      setMessages((prev) => [
        ...prev,
        { text: fallbackResponse, sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const suggestions = ["Destinations", "Budget", "Best Time", "Help"];

  return (
    <div className="fixed bottom-0 right-0 z-50">
      <div className="relative">
       
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleChat}
          aria-label="Toggle chat assistant"
          className="w-16 h-16 bg-gradient-to-br from-blue-950 to-gray-900 hover:from-blue-900 hover:to-gray-800 rounded-tl-full shadow-lg transition-all duration-300 flex items-center justify-center relative overflow-hidden"
        >
          <div
            className="absolute inset-0 rounded-tl-full"
            style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #4b5e8a 50%, #2d3748 100%)",
              borderBottom: "2px solid #4b5e8a",
              boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div
              className="absolute w-8 h-4 bg-green-900 opacity-50 rounded-full"
              style={{ top: "20%", left: "30%" }}
            />
            <div
              className="absolute w-6 h-3 bg-green-900 opacity-50 rounded-full"
              style={{ top: "40%", left: "20%" }}
            />
          </div>
          {!isChatOpen && (
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{
                repeat: Infinity,
                duration: 12,
                ease: "linear",
              }}
              className="absolute w-32 h-32"
              style={{ transformOrigin: "80% 80%" }}
            >
              <div className="absolute left-full top-1/2 -translate-y-1/2 rotate-[90deg]">
                <span className="text-white text-xl">✈️</span>
              </div>
            </motion.div>
          )}

          {isChatOpen && <X className="w-6 h-6 text-white z-10" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            variants={chatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-80 h-screen bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-4 bg-gradient-to-r from-blue-950 to-blue-900 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center">
                  <span className="text-xl text-white">✈️</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Travel Nest Bot</h4>
                  <p className="text-xs text-blue-300">Your travel planner</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/80">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg shadow-md ${
                      msg.sender === "user"
                        ? "bg-gray-700 text-white"
                        : "bg-gradient-to-r from-blue-900 to-blue-950 text-white"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    {msg.sender === "bot" && (
                      <p className="text-xs mt-1 text-blue-300 opacity-80">— Travel Nest Bot</p>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-start gap-2"
                >
                  <div className="flex items-center gap-1 p-3 rounded-lg bg-blue-900">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className="w-2 h-2 bg-blue-300 rounded-full"
                    />
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                      className="w-2 h-2 bg-blue-300 rounded-full"
                    />
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                      className="w-2 h-2 bg-blue-300 rounded-full"
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-gray-900 border-t border-gray-800">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    variants={suggestionVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 bg-gradient-to-r from-blue-900 to-blue-950 text-white text-sm rounded-full hover:from-blue-800 hover:to-blue-900 transition-all duration-300"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-gray-900 border-t border-gray-800">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  className="w-full p-3 pr-12 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-900 placeholder-gray-400 text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  disabled={isLoading}
                  className={`absolute right-3 p-2 rounded-full bg-blue-950 hover:bg-blue-900 transition-all duration-300 ${
                    isLoading ? "opacity-50" : ""
                  }`}
                >
                  <Send className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;