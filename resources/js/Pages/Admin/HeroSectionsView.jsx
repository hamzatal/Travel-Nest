import React, { useState } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import { Search, Trash2, Plus, Edit2, CheckCircle, XCircle, Image, X } from "lucide-react";
import AdminSidebar from "@/Components/AdminSidebar";

export default function HeroSectionsView() {
  const { props } = usePage();
  const { heroSections = [], flash = {} } = props;

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  const { data, setData, post, put, delete: deleteForm, processing, reset, errors } = useForm({
    title: "",
    subtitle: "",
    cta_text: "",
    image: null,
  });

  // Filter hero sections based on search query
  const filteredHeroSections = heroSections.filter(
    (section) =>
      section.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle add hero section
  const handleAdd = (e) => {
    e.preventDefault();
    post(route("admin.hero.store"), {
      preserveScroll: true,
      onSuccess: () => {
        setShowAddModal(false);
        reset();
      },
    });
  };

  // Handle edit hero section
  const handleEdit = (e) => {
    e.preventDefault();
    put(route("admin.hero.update", selectedSection.id), {
      preserveScroll: true,
      onSuccess: () => {
        setShowEditModal(false);
        reset();
        setSelectedSection(null);
      },
    });
  };

  // Handle delete hero section
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this hero section?")) {
      deleteForm(route("admin.hero.delete", id), {
        preserveScroll: true,
      });
    }
  };

  // Open edit modal with hero section data
  const openEditModal = (section) => {
    setSelectedSection(section);
    setData({
      title: section.title || "",
      subtitle: section.subtitle || "",
      cta_text: section.cta_text || "",
      image: null,
    });
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head title="Hero Sections - Travel Nest Admin" />
      <div className="lg:ml-64 p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-white">Hero Sections</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search hero sections..."
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
              Add Hero Section
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
          {filteredHeroSections.length > 0 ? (
            filteredHeroSections.map((section) => (
              <div
                key={section.id}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {section.image ? (
                  <img
                    src={`/storage/${section.image}`}
                    alt={section.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                    <Image className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-white">{section.title || "N/A"}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(section)}
                        className="text-blue-400 hover:text-blue-300"
                        disabled={processing}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(section.id)}
                        className="text-red-400 hover:text-red-300"
                        disabled={processing}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{section.subtitle || "N/A"}</p>
                  <p className="text-sm text-gray-400 mb-2">CTA: {section.cta_text || "N/A"}</p>
                  <p className="text-xs text-gray-500 mt-2">ID: {section.id}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-8">No hero sections found</div>
          )}
        </div>

        {/* Add Hero Section Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-lg w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Add Hero Section</h3>
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
                    <label className="block text-sm font-medium text-gray-400 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={data.subtitle}
                      onChange={(e) => setData("subtitle", e.target.value)}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">CTA Text</label>
                    <input
                      type="text"
                      value={data.cta_text}
                      onChange={(e) => setData("cta_text", e.target.value)}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Edit Hero Section Modal */}
        {showEditModal && selectedSection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-lg w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Edit Hero Section</h3>
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
                    <label className="block text-sm font-medium text-gray-400 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={data.subtitle}
                      onChange={(e) => setData("subtitle", e.target.value)}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">CTA Text</label>
                    <input
                      type="text"
                      value={data.cta_text}
                      onChange={(e) => setData("cta_text", e.target.value)}
                      className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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