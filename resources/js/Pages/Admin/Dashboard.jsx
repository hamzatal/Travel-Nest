import React from "react";
import { Head, usePage } from "@inertiajs/react";
import Navbar from "../../Components/Navbar";

export default function Dashboard() {
  const { props } = usePage();
  const user = props.auth?.user || null;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <Head title="Error" />
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-400">You must be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  if (!user.is_admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <Head title="Error" />
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-400">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Head title="Admin Dashboard - Travel Nest" />
      <Navbar user={user} />

      <div className="pt-20 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>

          <div className="space-y-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Welcome, {user.name}!</h3>
              <p className="text-gray-400 mt-2">
                This is your admin dashboard. From here, you can manage users, destinations, and more.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-md font-semibold">Total Users</h4>
                <p className="text-2xl font-bold text-blue-400 mt-2">150</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-md font-semibold">Total Destinations</h4>
                <p className="text-2xl font-bold text-blue-400 mt-2">25</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}