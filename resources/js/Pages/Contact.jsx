// resources/js/Pages/Contact.jsx
import React from "react";
import { Head } from "@inertiajs/react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Contact = ({ auth }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transition-all duration-300">
      <Head title="Contact Us" />
      <Navbar user={auth.user} />
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 mt-16">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        <p className="text-gray-400">Get in touch with us for any inquiries or support.</p>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;