import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import { 
  Users, MessageSquare, MapPin, Tag, Image, 
  Bell, Settings, Grid, LogOut, Eye, Edit, Trash2,
  Plus, Search, ChevronLeft, ChevronRight, Star, Coffee
} from "lucide-react";
import AdminSidebar from "@/Components/AdminSidebar";

export default function Destinations() {
  const { props } = usePage();
  const destinations = props.destinations || { data: [], links: [] };
  const [searchQuery, setSearchQuery] = useState("");

  const admin = props.auth?.user || {};
  const adminName = admin?.name || "Admin";
  const adminInitial = adminName.charAt(0).toUpperCase() || "A";

  // Filter destinations safely
  const filteredDestinations = destinations?.data?.filter(destination =>
    destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.location.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head title="Destinations - Travel Nest Admin" />

      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Destinations Management</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search destinations..."
                className="bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            <Link
              href="/admin/destinations/create"
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Destination
            </Link>
          </div>
        </div>

        {/* Destinations Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((destination) => (
              <div key={destination.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/20">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={`/storage/${destination.image}`} 
                    alt={destination.name}
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/api/placeholder/400/300";
                    }}
                  />
                  {destination.is_featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black rounded-full px-3 py-1 text-xs font-bold flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{destination.name}</h3>
                    <span className="text-lg font-bold text-green-400">${destination.price}</span>
                  </div>
                  <div className="flex items-center text-gray-400 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{destination.location}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {destination.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/admin/destinations/${destination.id}/edit`} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center transition-colors duration-300"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                      <Link 
                        href={`/admin/destinations/${destination.id}`}
                        method="delete"
                        as="button"
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg flex items-center transition-colors duration-300"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Link>
                    </div>
                    <Link 
                      href={`/admin/destinations/${destination.id}/toggle-featured`}
                      method="post"
                      as="button"
                      className={`${
                        destination.is_featured ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-600 hover:bg-gray-700'
                      } text-white px-3 py-1 rounded-lg flex items-center transition-colors duration-300`}
                    >
                      <Star className="w-4 h-4 mr-1" />
                      {destination.is_featured ? 'Unfeature' : 'Feature'}
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 bg-gray-800 rounded-lg p-6 text-center">
              <Coffee className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <h3 className="text-xl font-medium mb-1">Welcome to the Destinations Dashboard</h3>
              <p className="text-gray-400">
                No destinations found. Start by adding destinations to feature them on the homepage.
              </p>
              <Link
                href="/admin/destinations/create"
                className="mt-4 inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
              >
                <Plus className="w-5 h-5 mr-2 inline" />
                Add Destination
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {destinations.links && destinations.links.length > 3 && (
          <div className="flex justify-center mt-8">
            <div className="bg-gray-800 rounded-lg inline-flex overflow-hidden">
              {destinations.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || "#"}
                  className={`px-4 py-2 border-r border-gray-700 last:border-r-0 flex items-center ${
                    link.active 
                      ? 'bg-purple-600 text-white' 
                      : link.url 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-500 cursor-not-allowed'
                  }`}
                  preserveScroll
                >
                  {link.label.includes('Previous') ? (
                    <ChevronLeft className="w-5 h-5" />
                  ) : link.label.includes('Next') ? (
                    <ChevronRight className="w-5 h-5" />
                  ) : (
                    link.label
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        <AdminSidebar />
      </div>
    </div>
  );
}
