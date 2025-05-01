import React, { useState } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import { Search, Trash2, Plus, Edit2, CheckCircle, XCircle, MapPin, X } from "lucide-react";
import AdminSidebar from "@/Components/AdminSidebar";

export default function DestinationsView() {
  const { props } = usePage();
  const { destinations = [], flash = {} } = props;

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const { data, setData, post, put, delete: deleteForm, processing, reset, errors } = useForm({
    name: "",
    location: "",
    description: "",
    image: null,
  });

  // Filter destinations based on search query
  const filteredDestinations = destinations.filter(
    (destination) =>
      destination.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle add destination
  const handleAdd = (e) => {
    e.preventDefault();
    post(route("admin.destinations.store"), {
      preserveScroll: true,
      onSuccess: () => {
        setShowAddModal(false);
        reset();
      },
    });
  };

  // Handle edit destination
  const handleEdit = (e) => {
    e.preventDefault();
    put(route("admin.destinations.update", selectedDestination.id), {
      preserveScroll: true,
      onSuccess: () => {
        setShowEditModal(false);
        reset();
        setSelectedDestination(null);
      },
    });
  };

  // Handle delete destination
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this destination?")) {
      deleteForm(route("admin.destinations.delete", id), {
        preserveScroll: true,
      });
    }
  };

  // Open edit modal with destination data
  const openEditModal = (destination) => {
    setSelectedDestination(destination);
    setData({
      name: destination.name || "",
      location: destination.location || "",
      description: destination.description || "",
      image: null,
    });
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head title="Destinations - Travel Nest Admin" />
      <div className="lg:ml-64 p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-white">Destinations</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Destination
            </button>
          </div>
        </div>

        {flash.success && (
          <div className="bg-green-600/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {flash.success}
          </div>
        )}
        {flash.error && (
          <div className="bg-red-600/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            {flash.error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((destination) => (
              <div
                key={destination.id}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {destination.image ? (
                  <img
                    src={`/storage/${destination.image}`}
                    alt={destination.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-white">{destination.name || "N/A"}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(destination)}
                        className="text-blue-400 hover:text-blue-300"
                        disabled={processing}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(destination.id)}
                        className="text-red-400 hover:text-red-300"
                        disabled={processing}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{destination.location || "N/A"}</p>
                  <p className="text-sm text-gray-400 line-clamp-3">{destination.description || "No description"}</p>
                  <p className="text-xs text-gray-500 mt-2">ID: {destination.id}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-8">No destinations found</div>
          )}
        </div>

        {/* Add Destination Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-lg w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Add Destination</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-300">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => setData("name", e.target.value)}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={data.location}
                      onChange={(e) => setData("location", e.target.value)}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <textarea
                      value={data.description}
                      onChange={(e) => setData("description", e.target.value)}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setData("image", e.target.files[0])}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg"
                    />
                    {errors.image && <p className="text-red-400 text-xs mt-1">{errors.image}</p>}
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Destination Modal */}
        {showEditModal && selectedDestination && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-lg w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Edit Destination</h3>
                  <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-300">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleEdit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => setData("name", e.target.value)}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={data.location}
                      onChange={(e) => setData("location", e.target.value)}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <textarea
                      value={data.description}
                      onChange={(e) => setData("description", e.target.value)}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setData("image", e.target.files[0])}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg"
                    />
                    {errors.image && <p className="text-red-400 text-xs mt-1">{errors.image}</p>}
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <AdminSidebar />
    </div>
  );
}