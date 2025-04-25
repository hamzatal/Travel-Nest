import React from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import { 
  Users, MessageSquare, MapPin, Tag, Image, 
  Bell, Settings, Briefcase, LogOut, Grid, BarChart2,
  Eye, Inbox, Calendar, CheckCircle, XCircle, Trash2, RefreshCw
} from "lucide-react";
import AdminSidebar from "@/Components/AdminSidebar";


export default function MessagesIndex() {
  const { props } = usePage();
  const { messages, auth } = props;
  
  // Safe access to user name with fallback
  const admin = auth?.user || {};
  const adminName = admin?.name || "Admin";
  const adminInitial = adminName.charAt(0).toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head title="Messages - Travel Nest Admin" />
      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Messages</h1>
          <div className="flex space-x-2">
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-600 to-amber-700 rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:scale-105">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-yellow-200">Total Messages</p>
                <h3 className="text-3xl font-bold mt-1">{messages?.total || 0}</h3>
              </div>
              <div className="bg-yellow-500/30 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-yellow-200 text-sm">
              <Inbox className="w-4 h-4 mr-1" />
              <span>All inquiries from users</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:scale-105">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-red-200">Unread Messages</p>
                <h3 className="text-3xl font-bold mt-1">
                  {messages?.data?.filter(msg => !msg.is_read)?.length || 0}
                </h3>
              </div>
              <div className="bg-red-500/30 p-3 rounded-lg">
                <XCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-red-200 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Requiring attention</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:scale-105">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-200">Read Messages</p>
                <h3 className="text-3xl font-bold mt-1">
                  {messages?.data?.filter(msg => msg.is_read)?.length || 0}
                </h3>
              </div>
              <div className="bg-green-500/30 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-green-200 text-sm">
              <Eye className="w-4 h-4 mr-1" />
              <span>Already processed</span>
            </div>
          </div>
        </div>

        {/* Messages Table */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-bold">All Messages</h3>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {messages?.data?.length > 0 ? (
                  messages.data.map((message) => (
                    <tr key={message.id} className={`${!message.is_read ? 'bg-gray-900' : 'bg-gray-800'} hover:bg-gray-700 transition-colors`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {message.is_read ? (
                          <span className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                            <span className="text-green-500">Read</span>
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-blue-500">New</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                            {(message.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <span>{message.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{message.email || "No email"}</td>
                      <td className="px-6 py-4">
                        <p className="truncate max-w-xs">{message.message || "No content"}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {message.created_at ? new Date(message.created_at).toLocaleDateString() : "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Link href={`/admin/messages/${message.id}`} className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                            <Eye className="w-4 h-4" />
                          </Link>
                          {message.is_read ? (
                            <Link href={`/admin/messages/${message.id}/mark-unread`} method="post" as="button" className="p-2 bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors">
                              <RefreshCw className="w-4 h-4" />
                            </Link>
                          ) : (
                            <Link href={`/admin/messages/${message.id}/mark-read`} method="post" as="button" className="p-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                              <CheckCircle className="w-4 h-4" />
                            </Link>
                          )}
                          <Link href={`/admin/messages/${message.id}`} method="delete" as="button" className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                      No messages found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {messages?.links && messages.links.length > 3 && (
            <div className="px-6 py-4 border-t border-gray-700 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Showing {messages.from || 0} to {messages.to || 0} of {messages.total || 0} messages
              </div>
              <div className="flex space-x-1">
                {messages.links.map((link, i) => (
                  <Link
                    key={i}
                    href={link.url || '#'}
                    className={`px-3 py-1 rounded ${
                      link.active
                        ? 'bg-blue-600 text-white'
                        : link.url
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
              <AdminSidebar />

        </div>
      </div>
    </div>
  );
}