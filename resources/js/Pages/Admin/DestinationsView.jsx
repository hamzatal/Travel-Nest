import React, { useState, useEffect } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import {
    Search,
    Trash2,
    Plus,
    Edit2,
    ToggleLeft,
    ToggleRight,
    MapPin,
    X,
} from "lucide-react";
import AdminSidebar from "@/Components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

export default function DestinationsView() {
    const { props } = usePage();
    const { destinations = [], flash = {} } = props;

    const [searchQuery, setSearchQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const {
        data,
        setData,
        post,
        put,
        delete: deleteForm,
        patch,
        processing,
        reset,
        errors,
    } = useForm({
        name: "",
        location: "",
        description: "",
        image: null,
        price: "",
        discount_price: "",
        tag: "",
        rating: "",
        is_featured: false,
    });

    // Validate form fields
    const validateForm = (isAdd = false) => {
        const errors = {};
        if (data.name && (data.name.length < 3 || data.name.length > 255)) {
            errors.name = "Name must be between 3 and 255 characters.";
        }
        if (
            data.location &&
            (data.location.length < 3 || data.location.length > 255)
        ) {
            errors.location = "Location must be between 3 and 255 characters.";
        }
        if (data.description && data.description.length < 10) {
            errors.description = "Description must be at least 10 characters.";
        }
        if (data.price && (isNaN(data.price) || data.price < 0)) {
            errors.price =
                "Price must be a valid number greater than or equal to 0.";
        }
        if (
            data.discount_price &&
            (isNaN(data.discount_price) || data.discount_price < 0)
        ) {
            errors.discount_price =
                "Discount price must be a valid number greater than or equal to 0.";
        }
        if (data.tag && data.tag.length > 50) {
            errors.tag = "Tag must not exceed 50 characters.";
        }
        if (
            data.rating &&
            (isNaN(data.rating) || data.rating < 0 || data.rating > 5)
        ) {
            errors.rating = "Rating must be a number between 0 and 5.";
        }
        if (isAdd && !data.name) {
            errors.name = "Name is required.";
        }
        if (isAdd && !data.location) {
            errors.location = "Location is required.";
        }
        if (isAdd && !data.description) {
            errors.description = "Description is required.";
        }
        if (isAdd && !data.image) {
            errors.image = "Image is required.";
        }
        if (isAdd && !data.price) {
            errors.price = "Price is required.";
        }
        if (data.image) {
            const validTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
            ];
            if (!validTypes.includes(data.image.type)) {
                errors.image = "Image must be a JPEG, PNG, JPG, or GIF.";
            }
            if (data.image.size > 2 * 1024 * 1024) {
                errors.image = "Image size must be less than 2MB.";
            }
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle image preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData("image", file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(null);
        }
    };

    // Remove selected image
    const removeImage = () => {
        setData("image", null);
        setImagePreview(null);
    };

    // Filter destinations based on search query
    const filteredDestinations = destinations.filter(
        (destination) =>
            destination.name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            destination.location
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    // Handle add destination
    const handleAdd = (e) => {
        e.preventDefault();
        if (!validateForm(true)) {
            toast.error("Please fix the form errors.");
            return;
        }
        post(route("admin.destinations.store"), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setShowAddModal(false);
                reset();
                setImagePreview(null);
            },
            onError: () => {
                toast.error("Failed to add destination. Please try again.");
            },
        });
    };

    // Handle edit destination
    const handleEdit = (e) => {
        e.preventDefault();
        if (!validateForm(false)) {
            toast.error("Please fix the form errors.");
            return;
        }
        put(route("admin.destinations.update", selectedDestination.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setShowEditModal(false);
                reset();
                setImagePreview(null);
                setSelectedDestination(null);
            },
            onError: () => {
                toast.error("Failed to update destination. Please try again.");
            },
        });
    };

    // Handle delete destination
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this destination?")) {
            deleteForm(route("admin.destinations.destroy", id), {
                preserveScroll: true,
                onSuccess: () => {
                    // No toast here, rely on flash message
                },
                onError: () => {
                    toast.error(
                        "Failed to delete destination. Please try again."
                    );
                },
            });
        }
    };

    // Handle toggle featured status
    const handleToggleFeatured = (id) => {
        patch(route("admin.destinations.toggle", id), {
            preserveScroll: true,
            onSuccess: () => {
                // No toast here, rely on flash message
            },
            onError: () => {
                toast.error(
                    "Failed to toggle featured status. Please try again."
                );
            },
        });
    };

    // Open edit modal with destination data
    const openEditModal = (destination) => {
        setSelectedDestination(destination);
        setData({
            name: destination.name || "",
            location: destination.location || "",
            description: destination.description || "",
            image: null,
            price: destination.price || "",
            discount_price: destination.discount_price || "",
            tag: destination.tag || "",
            rating: destination.rating || "",
            is_featured: destination.is_featured || false,
        });
        setImagePreview(
            destination.image ? `/storage/${destination.image}` : null
        );
        setShowEditModal(true);
    };

    // Show flash messages as toasts
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Clean up image preview URL
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <Head title="Destinations - Travel Nest Admin" />
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <div className="lg:ml-64 p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h1 className="text-2xl font-bold text-white">
                        Destinations
                    </h1>
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
                                        <h3 className="text-lg font-semibold text-white">
                                            {destination.name || "N/A"}
                                        </h3>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    openEditModal(destination)
                                                }
                                                className="text-blue-400 hover:text-blue-300"
                                                disabled={processing}
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(destination.id)
                                                }
                                                className="text-red-400 hover:text-red-300"
                                                disabled={processing}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleToggleFeatured(
                                                        destination.id
                                                    )
                                                }
                                                className={`${
                                                    destination.is_featured
                                                        ? "text-green-400 hover:text-green-300"
                                                        : "text-gray-400 hover:text-gray-300"
                                                }`}
                                                disabled={processing}
                                                title={
                                                    destination.is_featured
                                                        ? "Remove from Featured"
                                                        : "Set as Featured"
                                                }
                                            >
                                                {destination.is_featured ? (
                                                    <ToggleRight className="w-5 h-5" />
                                                ) : (
                                                    <ToggleLeft className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2">
                                        {destination.location || "N/A"}
                                    </p>
                                    <p className="text-sm text-gray-400 mb-2 line-clamp-3">
                                        {destination.description ||
                                            "No description"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Price: ${destination.price || "N/A"} |
                                        Discount Price:{" "}
                                        {destination.discount_price
                                            ? `$${destination.discount_price}`
                                            : "N/A"}{" "}
                                        | Tag: {destination.tag || "None"} |
                                        Rating: {destination.rating || "0"} |
                                        Featured:{" "}
                                        {destination.is_featured ? "Yes" : "No"}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-400 py-8">
                            No destinations found
                        </div>
                    )}
                </div>

                {/* Add Destination Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-800 rounded-lg w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="p-4 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white">
                                        Add Destination
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setImagePreview(null);
                                            reset();
                                        }}
                                        className="text-gray-400 hover:text-gray-300"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <form
                                    onSubmit={handleAdd}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {validationErrors.name && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.name}
                                            </p>
                                        )}
                                        {errors.name && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="location"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={data.location}
                                            onChange={(e) =>
                                                setData(
                                                    "location",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {validationErrors.location && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.location}
                                            </p>
                                        )}
                                        {errors.location && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.location}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows="4"
                                        />
                                        {validationErrors.description && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.description}
                                            </p>
                                        )}
                                        {errors.description && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="image"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Image
                                        </label>
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg"
                                        />
                                        {imagePreview && (
                                            <div className="relative mt-2">
                                                <img
                                                    src={imagePreview}
                                                    alt="Image Preview"
                                                    className="w-full h-40 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        {validationErrors.image && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.image}
                                            </p>
                                        )}
                                        {errors.image && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.image}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="price"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Price ($)
                                            </label>
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                value={data.price}
                                                onChange={(e) =>
                                                    setData(
                                                        "price",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                step="0.01"
                                            />
                                            {validationErrors.price && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {validationErrors.price}
                                                </p>
                                            )}
                                            {errors.price && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {errors.price}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="discount_price"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Discount Price ($)
                                            </label>
                                            <input
                                                type="number"
                                                id="discount_price"
                                                name="discount_price"
                                                value={data.discount_price}
                                                onChange={(e) =>
                                                    setData(
                                                        "discount_price",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                step="0.01"
                                            />
                                            {validationErrors.discount_price && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {
                                                        validationErrors.discount_price
                                                    }
                                                </p>
                                            )}
                                            {errors.discount_price && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {errors.discount_price}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="tag"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Tag (e.g., Adventure)
                                        </label>
                                        <input
                                            type="text"
                                            id="tag"
                                            name="tag"
                                            value={data.tag}
                                            onChange={(e) =>
                                                setData("tag", e.target.value)
                                            }
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {validationErrors.tag && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.tag}
                                            </p>
                                        )}
                                        {errors.tag && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.tag}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="rating"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Rating (0-5)
                                        </label>
                                        <input
                                            type="number"
                                            id="rating"
                                            name="rating"
                                            value={data.rating}
                                            onChange={(e) =>
                                                setData(
                                                    "rating",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                        />
                                        {validationErrors.rating && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.rating}
                                            </p>
                                        )}
                                        {errors.rating && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.rating}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="is_featured"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Featured
                                        </label>
                                        <input
                                            type="checkbox"
                                            id="is_featured"
                                            name="is_featured"
                                            checked={data.is_featured}
                                            onChange={(e) =>
                                                setData(
                                                    "is_featured",
                                                    e.target.checked
                                                )
                                            }
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        {validationErrors.is_featured && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.is_featured}
                                            </p>
                                        )}
                                        {errors.is_featured && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.is_featured}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddModal(false);
                                                setImagePreview(null);
                                                reset();
                                            }}
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
                        <div className="bg-gray-800 rounded-lg w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="p-4 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white">
                                        Edit Destination
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setImagePreview(null);
                                            reset();
                                        }}
                                        className="text-gray-400 hover:text-gray-300"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <form
                                    onSubmit={handleEdit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {validationErrors.name && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.name}
                                            </p>
                                        )}
                                        {errors.name && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="location"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={data.location}
                                            onChange={(e) =>
                                                setData(
                                                    "location",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {validationErrors.location && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.location}
                                            </p>
                                        )}
                                        {errors.location && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.location}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows="4"
                                        />
                                        {validationErrors.description && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.description}
                                            </p>
                                        )}
                                        {errors.description && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="image"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Image
                                        </label>
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg"
                                        />
                                        {imagePreview && (
                                            <div className="relative mt-2">
                                                <img
                                                    src={imagePreview}
                                                    alt="Image Preview"
                                                    className="w-full h-40 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        {validationErrors.image && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.image}
                                            </p>
                                        )}
                                        {errors.image && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.image}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="price"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Price ($)
                                            </label>
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                value={data.price}
                                                onChange={(e) =>
                                                    setData(
                                                        "price",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                step="0.01"
                                            />
                                            {validationErrors.price && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {validationErrors.price}
                                                </p>
                                            )}
                                            {errors.price && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {errors.price}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="discount_price"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Discount Price ($)
                                            </label>
                                            <input
                                                type="number"
                                                id="discount_price"
                                                name="discount_price"
                                                value={data.discount_price}
                                                onChange={(e) =>
                                                    setData(
                                                        "discount_price",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                step="0.01"
                                            />
                                            {validationErrors.discount_price && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {
                                                        validationErrors.discount_price
                                                    }
                                                </p>
                                            )}
                                            {errors.discount_price && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {errors.discount_price}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="tag"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Tag (e.g., Adventure)
                                        </label>
                                        <input
                                            type="text"
                                            id="tag"
                                            name="tag"
                                            value={data.tag}
                                            onChange={(e) =>
                                                setData("tag", e.target.value)
                                            }
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {validationErrors.tag && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.tag}
                                            </p>
                                        )}
                                        {errors.tag && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.tag}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="rating"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Rating (0-5)
                                        </label>
                                        <input
                                            type="number"
                                            id="rating"
                                            name="rating"
                                            value={data.rating}
                                            onChange={(e) =>
                                                setData(
                                                    "rating",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                        />
                                        {validationErrors.rating && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.rating}
                                            </p>
                                        )}
                                        {errors.rating && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.rating}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="is_featured"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Featured
                                        </label>
                                        <input
                                            type="checkbox"
                                            id="is_featured"
                                            name="is_featured"
                                            checked={data.is_featured}
                                            onChange={(e) =>
                                                setData(
                                                    "is_featured",
                                                    e.target.checked
                                                )
                                            }
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        {validationErrors.is_featured && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.is_featured}
                                            </p>
                                        )}
                                        {errors.is_featured && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.is_featured}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowEditModal(false);
                                                setImagePreview(null);
                                                reset();
                                            }}
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
