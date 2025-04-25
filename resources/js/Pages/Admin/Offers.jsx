import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import { 
  Users, MessageSquare, MapPin, Tag, Image, 
  Bell, Settings, Grid, LogOut, Edit, Trash2,
  Plus, Search, ChevronLeft, ChevronRight, Calendar,
  Clock, AlertCircle, CheckCircle, Coffee,  Eye
} from "lucide-react";
import AdminSidebar from "@/Components/AdminSidebar";

export default function Offers() {
  const { props } = usePage();
  const { offers } = props;
  const [searchQuery, setSearchQuery] = useState("");
  
  // Safe access to user name with fallback
  const admin = props.auth?.user || {};
  const adminName = admin?.name || "Admin";
  const adminInitial = adminName.charAt(0).toUpperCase() || "A";

  // Filter offers based on search query
  const filteredOffers = offers.data.filter(offer => 
    offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Helper function to check if an offer is current
  const isCurrentOffer = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  // Helper function to calculate discount percentage
  const calculateDiscountPercentage = (originalPrice, discountPrice) => {
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head title="Offers - Travel Nest Admin" />

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Special Offers Management</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search offers..."
                className="bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            <Link
              href="/admin/offers/create"
              className="bg-gradient-to-r from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 shadow-lg hover:shadow-pink-500/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Offer
            </Link>
          </div>
        </div>

        {/* Offers Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredOffers.length > 0 ? (
            filteredOffers.map((offer) => {
              const isCurrentlyActive = isCurrentOffer(offer.start_date, offer.end_date);
              const discountPercentage = calculateDiscountPercentage(offer.price, offer.discount_price);
              
              return (
                <div key={offer.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-pink-500/20">
                  <div className="relative">
                    <img 
                      src={`/storage/${offer.image}`} 
                      alt={offer.title}
                      className="w-full h-48 object-cover" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/400/300";
                      }}
                    />
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-pink-600 to-pink-800 text-white py-1 px-4 rounded-bl-lg font-bold">
                      {discountPercentage}% OFF
                    </div>
                    <div className={`absolute bottom-0 left-0 right-0 py-2 px-4 ${
                      isCurrentlyActive && offer.is_active 
                        ? 'bg-green-600' 
                        : 'bg-gray-700'
                    } flex items-center justify-center`}>
                      {isCurrentlyActive && offer.is_active ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span>Currently Active</span>
                        </>
                      ) : offer.is_active ? (
                        <>
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{new Date(offer.start_date) > new Date() ? 'Upcoming Offer' : 'Expired Offer'}</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 mr-2" />
                          <span>Offer Disabled</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {offer.description}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <span className="text-gray-400 text-sm line-through mr-2">${offer.price}</span>
                        <span className="text-lg font-bold text-pink-400">${offer.discount_price}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-sm mb-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(offer.start_date)} - {formatDate(offer.end_date)}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Link 
                        href={`/admin/offers/${offer.id}/edit`} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center transition-colors duration-300"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                      <Link 
                        href={`/admin/offers/${offer.id}`}
                        method="delete"
                        as="button"
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg flex items-center transition-colors duration-300"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Link>
                      <Link 
                        href={`/admin/offers/${offer.id}/toggle-active`}
                        method="post"
                        as="button"
                        className={`${
                          offer.is_active ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'
                        } text-white px-3 py-1 rounded-lg flex items-center transition-colors duration-300 ml-auto`}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {offer.is_active ? 'Disable' : 'Enable'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 bg-gray-800 rounded-lg p-6 text-center">
              <Coffee className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <h3 className="text-xl font-medium mb-1">No offers found</h3>
              <p className="text-gray-400">
                {searchQuery ? 'Try adjusting your search query' : 'Create your first special offer to get started'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {offers.links && offers.links.length > 3 && (
          <div className="flex justify-center mt-8">
            <div className="bg-gray-800 rounded-lg inline-flex overflow-hidden">
              {offers.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || "#"}
                  className={`px-4 py-2 border-r border-gray-700 last:border-r-0 flex items-center ${
                    link.active 
                      ? 'bg-pink-600 text-white' 
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