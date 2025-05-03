import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { ChevronLeft, AlertTriangle, X, Trash2 } from "lucide-react";
import AdminSidebar from "@/Components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

export default function DeletePackage({ package: packageData }) {
    const { post, processing } = useForm({
        _method: "DELETE",
    });

    const [isConfirming, setIsConfirming] = useState(false);

    // Handle delete confirmation
    const handleConfirmDelete = () => {
        setIsConfirming(true);
    };

    // Handle cancel delete
    const handleCancelDelete = () => {
        setIsConfirming(false);
    };

    // Handle delete submission
    const handleDelete = () => {
        post(route("admin.packages.destroy", packageData.id), {
            onSuccess: () => {
                toast.success("Package deleted successfully!");
                // Redirect with a small delay to ensure the toast is seen
                setTimeout(() => {
                    window.location.href = route("admin.packages.index");
                }, 1500);
            },
            onError: (errors) => {
                toast.error("Failed to delete package.");
                console.error(errors);
                setIsConfirming(false);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <Head
                title={`Delete Package: ${packageData.title} - Travel Nest Admin`}
            />
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

            <AdminSidebar />

            <div className="lg:ml-64 p-6 lg:p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                href={route("admin.packages.index")}
                                className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span>Back to Packages</span>
                            </Link>
                            <h1 className="text-2xl font-bold">
                                Delete Package: {packageData.title}
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 bg-opacity-50 rounded-lg shadow-lg p-6">
                    <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>

                        <h2 className="text-xl font-bold mb-2">
                            Delete Package
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to delete this package? This
                            action cannot be undone.
                        </p>

                        <div className="w-full max-w-md bg-gray-700 bg-opacity-50 rounded-lg p-6 mb-6">
                            <div className="flex items-center mb-4">
                                {packageData.image_url ? (
                                    <img
                                        src={packageData.image_url}
                                        alt={packageData.title}
                                        className="w-16 h-16 object-cover rounded-md mr-4"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-600 rounded-md flex items-center justify-center mr-4">
                                        <X className="w-6 h-6 text-gray-400" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">
                                        {packageData.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        {packageData.subtitle}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-400">Price:</p>
                                    <p className="font-semibold">
                                        ${packageData.price}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">
                                        Discount Price:
                                    </p>
                                    <p className="font-semibold">
                                        ${packageData.discount_price || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Start Date:</p>
                                    <p className="font-semibold">
                                        {new Date(
                                            packageData.start_date
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">End Date:</p>
                                    <p className="font-semibold">
                                        {new Date(
                                            packageData.end_date
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {!isConfirming ? (
                            <div className="flex space-x-4">
                                <Link
                                    href={route("admin.packages.index")}
                                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Package
                                </button>
                            </div>
                        ) : (
                            <div className="border border-red-500 rounded-lg p-6 bg-red-500 bg-opacity-10 max-w-md w-full">
                                <p className="font-bold text-lg mb-4">
                                    Are you absolutely sure?
                                </p>
                                <p className="text-gray-300 mb-6">
                                    This will permanently delete the package "
                                    {packageData.title}" and all associated
                                    data. This action cannot be undone.
                                </p>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleCancelDelete}
                                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                        disabled={processing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <span>Deleting...</span>
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Yes, Delete Package
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
