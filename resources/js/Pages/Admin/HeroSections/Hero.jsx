import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import { 
  Search, Plus, Edit, Trash2, ExternalLink, Eye, ChevronLeft, ChevronRight, Coffee 
} from "lucide-react";
import AdminSidebar from "@/Components/AdminSidebar";

export default function HeroSections() {
  const { props } = usePage();
  const heroSections = props.Heros || { data: [], links: [] }; // Safe fallback
  const [searchQuery, setSearchQuery] = useState("");

  const admin = props.auth?.user || {};
  const adminName = admin.name || "Admin";

  // Search filtering
  const filteredHeroSections = (heroSections.data || []).filter(hero =>
    hero.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (hero.subtitle && hero.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head title="Hero Sections - Travel Nest Admin" />

      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Hero Sections Management</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search hero sections..."
                className="bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            <Link
              href="/admin/hero-sections/create"
              className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 shadow-lg hover:shadow-indigo-500/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Hero Section
            </Link>
          </div>
        </div>

        {/* Hero Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {filteredHeroSections.length > 0 ? (
            filteredHeroSections.map((hero) => (
              <div key={hero.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20">
                <div className="relative">
                  <img 
                    src={`/storage/${hero.image}`} 
                    alt={hero.title}
                    className="w-full h-64 object-cover" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/api/placeholder/800/400";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold mb-2">{hero.title}</h3>
                    {hero.subtitle && <p className="text-gray-300 mb-4">{hero.subtitle}</p>}
                    {hero.button_text && (
                      <div className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg">
                        {hero.button_text}
                      </div>
                    )}
                  </div>
                  <div className={`absolute top-4 right-4 ${
                    hero.is_active ? 'bg-green-600' : 'bg-gray-600'
                  } text-white px-3 py-1 rounded-full text-sm font-medium flex items-center`}>
                    <Eye className="w-4 h-4 mr-1" />
                    {hero.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div className="p-5 border-t border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    <Link 
                      href={`/admin/hero-sections/${hero.id}/edit`} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Link>
                    <Link 
                      href={`/admin/hero-sections/${hero.id}`}
                      method="delete"
                      as="button"
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Link>
                    {hero.button_link && (
                      <a 
                        href={hero.button_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Link
                      </a>
                    )}
                    <Link 
                      href={`/admin/hero-sections/${hero.id}/toggle-active`}
                      method="post"
                      as="button"
                      className={`${
                        hero.is_active ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'
                      } text-white px-3 py-1 rounded-lg flex items-center ml-auto`}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {hero.is_active ? 'Disable' : 'Enable'}
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-gray-800 rounded-lg p-6 text-center">
              <Coffee className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <h3 className="text-xl font-medium mb-1">No hero sections found</h3>
              <p className="text-gray-400">
                {searchQuery ? 'Try adjusting your search query' : 'Add your first hero section to get started'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {heroSections.links && heroSections.links.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="bg-gray-800 rounded-lg inline-flex overflow-hidden">
              {heroSections.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || "#"}
                  className={`px-4 py-2 border-r border-gray-700 last:border-r-0 flex items-center ${
                    link.active 
                      ? 'bg-indigo-600 text-white' 
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
