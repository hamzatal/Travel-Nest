import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Notification = ({ message, type = "success", onClose }) => {
  const [show, setShow] = useState(!!message);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, 5000); // 5 ثوانٍ
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  // تحديد اللون بناءً على نوع الإشعار
  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600"; 

  // تحديد الأيقونة بناءً على نوع الإشعار
  const icon = type === "success" ? "✅" : "❌";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-full shadow-lg ${bgColor} text-white flex items-center space-x-3`} 
        >
          <span className="text-lg">{icon}</span> 
          <span>{message}</span>
          <button
            onClick={() => {
              setShow(false);
              if (onClose) onClose();
            }}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;