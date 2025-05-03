import React, { useState, useEffect } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import {
    Search,
    Trash2,
    Plus,
    Edit2,
    Image,
    ChevronDown,
    ToggleLeft,
    ToggleRight,
    Calendar,
    DollarSign,
    Star,
} from "lucide-react";
import AdminSidebar from "@/Components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function PackagesIndex() {
    const { props } = usePage();
    const { packages = [], flash = {} } = props;

    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Handle delete package
    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this package?")) {
            setIsDeleting(true);
            setDeletingId(id);

            try {
                await axios.delete(route("admin.packages.destroy", id));
                toast.success("Package deleted successfully!");
                // Refresh the page to show updated list
                window.location.reload();
            } catch (error) {
                toast.error("Failed to delete package. Please try again.");
            } finally {
                setIsDeleting(false);
                setDeletingId(null);
            }
        }
    };

    // Handle toggle featured status
    const handleToggleFeatured = async (id, currentStatus) => {
        try {
            await axios.patch(route("admin.packages.toggle-featured", id));
            toast.success(
                `Package ${
                    currentStatus ? "removed from" : "added to"
                } featured successfully!`
            );
            // Refresh the page to show updated list
            window.location.reload();
        } catch (error) {
            toast.error("Failed to update featured status. Please try again.");
        }
    };

    // Calculate discount percentage
    const calculateDiscount = (original, discounted) => {
        if (!discounted) return null;
        const percentage = Math.round(
            ((original - discounted) / original) * 100
        );
        return percentage;
    };

    // Filter packages based on search query
    const filteredPackages = packages.filter(
        (pkg) =>
            pkg.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pkg.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Show flash messages as toasts
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <Head title="Manage Packages - Travel Nest Admin" />
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <div className="lg:ml-64 p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h1 className="text-2xl font-bold text-white">
                        Manage Packages
                    </h1>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search packages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                        <Link
                            href={route("admin.packages.create")}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Package
                        </Link>
                    </div>
                </div>

                {filteredPackages.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full bg-gray-800 bg-opacity-50 rounded-lg shadow-lg">
                            <thead>
                                <tr className="text-left text-gray-400 border-b border-gray-700">
                                    <th className="px-6 py-3 font-medium">
                                        Image
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Package Details
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Dates
                                    </th>
                                    <th className="px-6 py-3 font-medium text-center">
                                        Rating
                                    </th>
                                    <th className="px-6 py-3 font-medium text-center">
                                        Featured
                                    </th>
                                    <th className="px-6 py-3 font-medium text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredPackages.map((pkg) => (
                                    <tr
                                        key={pkg.id}
                                        className="hover:bg-gray-700 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            {pkg.image ? (
                                                <img
                                                    src={`/storage/${pkg.image}`}
                                                    alt={pkg.title}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-700 flex items-center justify-center rounded-md">
                                                    <Image className="w-8 h-8 text-gray-500" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white">
                                                {pkg.title}
                                            </div>
                                            <div className="text-gray-400 text-sm">
                                                {pkg.subtitle}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <DollarSign className="w-4 h-4 text-green-400 mr-1" />
                                                {pkg.discount_price ? (
                                                    <div>
                                                        <span className="font-semibold text-green-400">
                                                            $
                                                            {pkg.discount_price}
                                                        </span>
                                                        <span className="text-gray-400 text-sm line-through ml-2">
                                                            ${pkg.price}
                                                        </span>
                                                        <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded ml-2">
                                                            {calculateDiscount(
                                                                pkg.price,
                                                                pkg.discount_price
                                                            )}
                                                            % OFF
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="font-semibold">
                                                        ${pkg.price}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-gray-300">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {formatDate(pkg.start_date)} -{" "}
                                                {formatDate(pkg.end_date)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span className="ml-1">
                                                    {pkg.rating || 0}/5
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() =>
                                                    handleToggleFeatured(
                                                        pkg.id,
                                                        pkg.is_featured
                                                    )
                                                }
                                                className={`${
                                                    pkg.is_featured
                                                        ? "text-green-400 hover:text-green-300"
                                                        : "text-gray-400 hover:text-gray-300"
                                                }`}
                                                title={
                                                    pkg.is_featured
                                                        ? "Remove from featured"
                                                        : "Add to featured"
                                                }
                                            >
                                                {pkg.is_featured ? (
                                                    <ToggleRight className="w-6 h-6" />
                                                ) : (
                                                    <ToggleLeft className="w-6 h-6" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={route(
                                                        "admin.packages.edit",
                                                        pkg.id
                                                    )}
                                                    className="text-blue-400 hover:text-blue-300 p-1"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(pkg.id)
                                                    }
                                                    className="text-red-400 hover:text-red-300 p-1"
                                                    disabled={
                                                        isDeleting &&
                                                        deletingId === pkg.id
                                                    }
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-gray-800 bg-opacity-50 rounded-lg shadow-lg p-8 text-center">
                        <Image className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                            No Packages Found
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {searchQuery
                                ? "No packages match your search criteria. Try different keywords."
                                : "You haven't created any packages yet. Start by adding your first package!"}
                        </p>
                        <Link
                            href={route("admin.packages.create")}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Your First Package
                        </Link>
                    </div>
                )}
            </div>
            <AdminSidebar />
        </div>
    );
}
