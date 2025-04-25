import React from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import { 
  Users, MessageSquare, MapPin, Tag, Image, 
  Bell, Settings, LogOut, Grid, 
  ArrowLeft, User, Mail, Clock, Trash2
} from "lucide-react";
import AdminSidebar from "@/Components/AdminSidebar";


export default function MessageShow() {
  const { props } = usePage();
  const { message, auth } = props;
  
  // Safe access to user name with fallback
  const admin = auth?.user || {};
  const adminName = admin?.name || "Admin";
  const adminInitial = adminName.charAt(0).toUpperCase() || "A";

  // Format date
  const formattedDate = message?.created_at 
    ? new Date(message.created_at).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
    : "Unknown date";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head title={`Message from ${message?.name || 'Unknown'} - Travel Nest Admin`} />


      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin/messages" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold">Message Details</h1>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold">Message Content</h2>
              </div>
              <div className="p-6">
                <div className="bg-gray-900 rounded-lg p-6 shadow-inner">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {message?.message || "No message content"}
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-gray-700 flex justify-end space-x-3">
                <Link 
                  href={`/admin/messages/${message?.id}`} 
                  method="delete" 
                  as="button"
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Message</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sender Details */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold">Sender Information</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex flex-col items-center p-6 bg-gray-900 rounded-lg">
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                    {(message?.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold">{message?.name || "Unknown Sender"}</h3>
                </div>

                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center space-x-3 p-2">
                    <User className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Name</p>
                      <p>{message?.name || "Unknown"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center space-x-3 p-2">
                    <Mail className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p>{message?.email || "No email"}</p>
                    </div>
                  </div>
                </div>
                <AdminSidebar />

                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center space-x-3 p-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Date Received</p>
                      <p>{formattedDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}