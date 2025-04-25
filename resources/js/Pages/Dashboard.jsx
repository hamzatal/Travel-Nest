// resources/js/Pages/Admin/Dashboard.jsx
import React from 'react';
import { Head } from '@inertiajs/react';
import { Link } from 'react-router-dom';
import { Users, MessageCircle, Image, PlusCircle } from 'lucide-react'; 
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

const Dashboard = ({ auth }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Head title="Admin Dashboard - Travel Nest" />
      <Navbar user={auth.user} />

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 mt-16">
        <h1 className="text-5xl font-extrabold mb-6">Welcome to the Admin Dashboard</h1>

        {/* Navigation Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/admin/users" className="bg-gray-700 p-6 rounded-lg shadow-lg hover:bg-gray-600">
            <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h2 className="text-xl font-semibold">Manage Users</h2>
          </Link>
          <Link to="/admin/messages" className="bg-gray-700 p-6 rounded-lg shadow-lg hover:bg-gray-600">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h2 className="text-xl font-semibold">Messages</h2>
          </Link>
          <Link to="/admin/deals" className="bg-gray-700 p-6 rounded-lg shadow-lg hover:bg-gray-600">
            <PlusCircle className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h2 className="text-xl font-semibold">Add Deals</h2>
          </Link>
          <Link to="/admin/hero" className="bg-gray-700 p-6 rounded-lg shadow-lg hover:bg-gray-600">
            <Image className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h2 className="text-xl font-semibold">Hero Section</h2>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
