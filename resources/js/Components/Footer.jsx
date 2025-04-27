import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LegalPopup = ({ type, isDarkMode, onClose }) => {
  const content = {
    privacyPolicy: {
      title: 'Privacy Policy',
      text: `
       At Travel Nest, we value your privacy. This Privacy Policy outlines how we collect, use, and protect your information.
       1. Information We Collect
       • Personal Information: Name, email address, phone number, etc.
       • Usage Data: Information about how you use our services, including IP address, browser type, and pages visited.
       2. How We Use Your Information
       • To provide and maintain our services
       • To notify you about changes to our services
       • To allow you to participate in interactive features of our services
       • To provide customer support
       • To gather analysis or valuable information so that we can improve our services
       • To monitor the usage of our services
       • To detect, prevent, and address technical issues
       3. Data Security
       We take the security of your data seriously. We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, use, or disclosure.
       4. Your Rights
       You have the right to:
       • Access your personal information
       • Request correction of your personal information
       • Request deletion of your personal information
       • Object to the processing of your personal information
       • Withdraw consent at any time where we rely on your consent to process your personal information
       5. Changes to This Privacy Policy
       We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
       We will let you know via email and/or a prominent notice on our services, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.
       You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
       6. Contact Us
       If you have any questions about this Privacy Policy, please contact us:
       • By email: [email protected]
       • By phone: +1 (123) 456-7890
      `
    },
    termsOfService: {
      title: 'Terms of Service',
      text: `
        Welcome to Travel Nest. By using our services, you agree to the following terms and conditions:
        1. Acceptance of Terms
        By accessing or using our services, you agree to be bound by these terms and conditions. If you do not agree to these terms, please do not use our services.
        2. Intellectual Property
        All content, including text, graphics, logos, and images, is the property of Travel Nest or its licensors and is protected by intellectual property laws.
        3. User Conduct
        You agree to use our services for lawful purposes and in a manner that does not violate any applicable laws or regulations.
        4. Privacy Policy
        We collect and use your information in accordance with our Privacy Policy.
        5. Limitation of Liability
        We shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use or inability to use our services.
        6. Indemnification
        You agree to indemnify and hold harmless Travel Nest and its affiliates, licensors, and suppliers from any claims, damages, or liabilities arising from your use of our services.
        7. Governing Law
        These terms and conditions shall be governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising from these terms and conditions shall be subject to the exclusive jurisdiction of the courts located in [Your Jurisdiction].   
        8. Changes to Terms
        We may update these terms and conditions from time to time. We will notify you of any changes by posting the new terms on this page.
        You are advised to review these terms periodically for any changes. Changes to these terms are effective when they are posted on this page.
        9. Contact Us
        If you have any questions about these terms and conditions, please contact us:
        • By email: [email protected]
        • By phone: +1 (123) 456-7890
      
      `
    }
  };

  const { title, text } = content[type];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`relative w-full max-w-2xl mx-auto rounded-lg shadow-2xl ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
              : 'bg-gradient-to-br from-white to-gray-100'
          }`}
        >
          {/* Header with Title and Close Button */}
          <div className={`flex justify-between items-center p-5 border-b ${
            isDarkMode 
              ? 'border-gray-700 text-white' 
              : 'border-gray-200 text-gray-900'
          }`}>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <button 
              onClick={onClose} 
              className={`p-2 rounded-full transition-all duration-300 ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-white' 
                  : 'hover:bg-gray-200 text-black'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content Container */}
          <div className="p-6  max-h-[500px] overflow-y-auto">
            <div className={`text-base ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                {text}
              </pre>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Footer = ({ isDarkMode }) => {
  const [activePopup, setActivePopup] = useState(null);

  return (
    <>
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`py-6 mt-12 text-center ${
          isDarkMode
            ? 'bg-gray-800 text-gray-300'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        <p>© 2024 Travel Nest. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          <button 
            onClick={() => setActivePopup('privacyPolicy')} 
            className="hover:text-blue-500"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => setActivePopup('termsOfService')} 
            className="hover:text-blue-500"
          >
            Terms of Service
          </button>
          <a href="ContactPage" className="hover:text-blue-500">Contact</a>
        </div>
      </motion.footer>

      {activePopup && (
        <LegalPopup 
          type={activePopup} 
          isDarkMode={isDarkMode} 
          onClose={() => setActivePopup(null)} 
        />
      )}
    </>
  );
};

export default Footer;