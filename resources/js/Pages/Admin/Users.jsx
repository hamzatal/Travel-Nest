import React, { useState, useEffect } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import { 
  Bell, Settings, Search, CheckCircle, XCircle, ShieldCheck, ShieldOff 
} from "lucide-react";
import AdminSidebar from "@/Components/AdminSidebar";

export default function AdminUsers() {
  const { props } = usePage();
  
  const admin = props.admin || props.auth?.user || {};
  const users = props.users || { data: [] };
  const flash = props.flash || {};

  const [search, setSearch] = useState(props.filters?.search || '');
  const [status, setStatus] = useState(props.filters?.status || '');
  const [flashMessage, setFlashMessage] = useState(flash.success || flash.error || null);

  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => setFlashMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  // Real-time Search and Filter with State Preserving
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      router.get('/admin/users', { search, status }, { preserveState: true, preserveScroll: true, replace: true });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, status]);

  const toggleUserStatus = (userId) => {
    router.post(`/admin/users/${userId}/toggle-status`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        // Show success message when status is toggled
        setFlashMessage("User status updated successfully.");
      },
      onError: (error) => {
        console.error("Error updating user status:", error);
        setFlashMessage("Failed to update user status.");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head title="User Management - Travel Nest Admin" />

      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <div className="flex space-x-2">
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Flash Messages */}
        {flashMessage && (
          <div className={`px-4 py-3 rounded mb-6 flex items-center ${
            flashMessage.includes("success") ? 'bg-green-600/20 border border-green-500 text-green-200' :
            'bg-red-600/20 border border-red-500 text-red-200'
          }`}>
            {flashMessage.includes("success") ? <CheckCircle className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />}
            {flashMessage}
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Users</option>
              <option value="active">Active Users</option>
              <option value="inactive">Inactive Users</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Joined Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.data.length > 0 ? (
                users.data.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-700 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                        {(user.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{user.name || "Unknown User"}</p>
                        <p className="text-xs text-gray-400">ID: {user.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{user.email || "No email"}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown date"}</td>
                    <td className="px-6 py-4">
                      {user.is_active ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {!user.is_admin && (
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`flex items-center justify-center mx-auto px-3 py-1 rounded-full ${
                            user.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                          } text-white text-xs`}
                        >
                          {user.is_active ? <ShieldOff className="w-4 h-4 mr-1" /> : <ShieldCheck className="w-4 h-4 mr-1" />}
                          {user.is_active ? "Deactivate" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {users.links && users.links.length > 3 && (
          <div className="flex justify-between items-center mt-6 bg-gray-800 rounded-lg px-4 py-3">
            <div className="text-sm text-gray-400">
              Showing <span className="font-medium">{users.from || 0}</span> to <span className="font-medium">{users.to || 0}</span> of <span className="font-medium">{users.total || 0}</span> results
            </div>
            <div className="flex space-x-1">
              {users.links.map((link, i) => (
                link.url && (
                  <Link
                    key={i}
                    href={link.url}
                    className={`px-3 py-1 rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                )
              ))}
            </div>
          </div>
        )}

        <AdminSidebar />
      </div>
    </div>
  );
}
