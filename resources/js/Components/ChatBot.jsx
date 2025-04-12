// resources/js/Components/ChatBot.jsx
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

  // إخفاء النص التوضيحي بعد 5 ثوانٍ
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // التمرير للأسفل عند تغيير الرسائل
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

  const planeAnimation = {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 6,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages((prev) => [...prev, { text: inputMessage, sender: "user" }]);
    setInputMessage("");
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "I’ll get back to you soon! For now, try the suggestions below.", sender: "bot" },
      ]);
      setIsLoading(false);
    }, 800);
  };

  const handleSuggestionClick = (suggestion) => {
    setMessages((prev) => [...prev, { text: suggestion, sender: "user" }]);
    setIsLoading(true);

    setTimeout(() => {
      let botResponse;
      switch (suggestion.toLowerCase()) {
        case "destinations":
          botResponse = "Looking for a destination? Tell me more about what you like!";
          break;
        case "budget":
          botResponse = "What’s your budget? I can help find options that fit!";
          break;
        case "best time":
          botResponse = "When are you planning to travel? I’ll find the best time!";
          break;
        case "help":
          botResponse = "I’m here to assist! What do you need help with?";
          break;
        default:
          botResponse = "Great choice! Tell me more so I can assist you better.";
      }

      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
      setIsLoading(false);
    }, 800);
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
      {/* Chatbot Toggle Button with Tooltip */}
      <div className="relative">
        <AnimatePresence>
          {showTooltip && !isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-20 right-6 bg-gradient-to-r from-blue-900 to-blue-950 bg-opacity-90 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
            >
              <span>Your Travel Buddy</span>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-blue-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleChat}
          aria-label="Toggle chat assistant"
          className="w-16 h-16 bg-gradient-to-br from-blue-950 to-gray-900 hover:from-blue-900 hover:to-gray-800 rounded-tl-full shadow-lg transition-all duration-300 flex items-center justify-center relative overflow-hidden"
        >
          {/* نصف كرة أرضية واقعية */}
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

      {/* Chatbot Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            variants={chatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-80 h-screen bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
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

            {/* Messages Area */}
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

            {/* Suggestions Area */}
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

            {/* Input Area */}
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