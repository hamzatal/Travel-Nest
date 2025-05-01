import React, { useState } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import { Search, Trash2, Plus, Edit2, CheckCircle, XCircle, Tag, X } from "lucide-react";
import AdminSidebar from "@/Components/AdminSidebar";

export default function OffersView() {
  const { props } = usePage();
  const { offers = [], flash = {} } = props;

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const { data, setData, post, put, delete: deleteForm, processing, reset, errors } = useForm({
    title: "",
    description: "",
    discount: "",
    expiry_date: "",
  });

  // Filter offers based on search query
  const filteredOffers = offers.filter(
    (offer) =>
      offer.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle add offer
  const handleAdd = (e) => {
    e.preventDefault();
    post(route("admin.offers.store"), {
      preserveScroll: true,
      onSuccess: () => {
        setShowAddModal(false);
        reset();
      },
    });
  };

  // Handle edit offer
  const handleEdit = (e) => {
    e.preventDefault();
    put(route("admin.offers.update", selectedOffer.id), {
      preserveScroll: true,
      onSuccess: () => {
        setShowEditModal(false);
        reset();
        setSelectedOffer(null);
      },
    });
  };

  // Handle delete offer
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this offer?")) {
      deleteForm(route("admin.offers.delete", id), {
        preserveScroll: true,
      });
    }
  };

  // Open edit modal with offer data
  const openEditModal = (offer) => {
    setSelectedOffer(offer);
    setData({
      title: offer.title || "",
      description: offer.description || "",
      discount: offer.discount || "",
      expiry_date: offer.expiry_date || "",
    });
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head title="Offers - Travel Nest Admin" />
      <div className="lg:ml-64 p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-white">Offers</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search offers..."
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
              Add Offer
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
          {filteredOffers.length > 0 ? (
            filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-white">{offer.title || "N/A"}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(offer)}
                        className="text-blue-400 hover:text-blue-300"
                        disabled={processing}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(offer.id)}
                        className="text-red-400 hover:text-red-300"
                        disabled={processing}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <Tag className="w-4 h-4 mr-2 text-pink-400" />
                    <span>{offer.discount}% Discount</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Expires: {offer.expiry_date || "N/A"}</p>
                  <p className="text-sm text-gray-400 line-clamp-3">{offer.description || "No description"}</p>
                  <p className="text-xs text-gray-500 mt-2">ID: {offer.id}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-8">No offers found</div>
          )}
        </div>

        {/* Add Offer Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-lg w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Add Offer</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-300">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={data.title}
                      onChange={(e) => setData("title", e.target.value)}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
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
                    <label className="block text-sm font-medium text-gray-400 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      value={data.discount}
                      onChange={(e) => setData("discount", e.target.value)}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min="0"
                      max="100"
                    />
                    {errors.discount && <p className="text-red-400 text-xs mt-1">{errors.discount}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={data.expiry_date}
                      onChange={(e) => setData("expiry_date", e.target.value)}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.expiry_date && <p className="text-red-400 text-xs mt-1">{errors.expiry_date}</p>}
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

        {/* Edit Offer Modal */}
        {showEditModal && selectedOffer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-lg w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Edit Offer</h3>
                  <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-300">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleEdit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={data.title}
                      onChange={(e) => setData("title", e.target.value)}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
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
                    <label className="block text-sm font-medium text-gray-400 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      value={data.discount}
                      onChange={(e) => setData("discount", e.target.value)}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min="0"
                      max="100"
                    />
                    {errors.discount && <p className="text-red-400 text-xs mt-1">{errors.discount}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={data.expiry_date}
                      onChange={(e) => setData("expiry_date", e.target.value)}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.expiry_date && <p className="text-red-400 text-xs mt-1">{errors.expiry_date}</p>}
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