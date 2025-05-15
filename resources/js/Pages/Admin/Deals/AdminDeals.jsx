import React, { useState, useEffect } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import {
    Search,
    Trash2,
    Plus,
    Edit2,
    ToggleLeft,
    ToggleRight,
    Image,
    X,
} from "lucide-react";
import AdminSidebar from "@/Components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

export default function OffersView() {
    const { props } = usePage();
    const { offers = [], flash = {} } = props;

    const [searchQuery, setSearchQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
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
        title: "",
        description: "",
        image: null,
        price: "",
        discount_price: "",
        discount_type: "",
        start_date: "",
        end_date: "",
    });

    // Validate form fields
    const validateForm = (isAdd = false) => {
        const errors = {};
        if (data.title && (data.title.length < 3 || data.title.length > 255)) {
            errors.title = "Title must be between 3 and 255 characters.";
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
        if (data.discount_type && data.discount_type.length > 50) {
            errors.discount_type =
                "Discount type must not exceed 50 characters.";
        }
        if (data.start_date && !/^\d{4}-\d{2}-\d{2}$/.test(data.start_date)) {
            errors.start_date = "Start date must be a valid date (YYYY-MM-DD).";
        }
        if (data.end_date && !/^\d{4}-\d{2}-\d{2}$/.test(data.end_date)) {
            errors.end_date = "End date must be a valid date (YYYY-MM-DD).";
        }
        if (
            data.start_date &&
            data.end_date &&
            new Date(data.end_date) < new Date(data.start_date)
        ) {
            errors.end_date = "End date must be after or equal to start date.";
        }
        if (isAdd && !data.title) {
            errors.title = "Title is required.";
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

    // Filter offers based on search query
    const filteredOffers = offers.filter(
        (offer) =>
            offer.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            offer.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle add offer
    const handleAdd = (e) => {
        e.preventDefault();
        if (!validateForm(true)) {
            toast.error("Please fix the form errors.");
            return;
        }
        post(route("admin.offers.store"), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setShowAddModal(false);
                reset();
                setImagePreview(null);
                toast.success("Offer added successfully!");
            },
            onError: () => {
                toast.error("Failed to add offer. Please try again.");
            },
        });
    };

    // Handle edit offer
    const handleEdit = (e) => {
        e.preventDefault();
        if (!validateForm(false)) {
            toast.error("Please fix the form errors.");
            return;
        }
        put(route("admin.offers.update", selectedOffer.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setShowEditModal(false);
                reset();
                setImagePreview(null);
                setSelectedOffer(null);
                toast.success("Offer updated successfully!");
            },
            onError: () => {
                toast.error("Failed to update offer. Please try again.");
            },
        });
    };

    // Handle delete offer
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this offer?")) {
            deleteForm(route("admin.offers.destroy", id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Offer deleted successfully!");
                },
                onError: () => {
                    toast.error("Failed to delete offer. Please try again.");
                },
            });
        }
    };

    // Handle toggle active status
    const handleToggleActive = (id) => {
        patch(route("admin.offers.toggle", id), {
            preserveScroll: true,
            onSuccess: () => {
                const offer = offers.find((o) => o.id === id);
                const message = offer.is_active
                    ? "Offer deactivated successfully!"
                    : "Offer activated successfully!";
                toast.success(message);
            },
            onError: () => {
                toast.error("Failed to toggle offer status. Please try again.");
            },
        });
    };

    // Open edit modal with offer data
    const openEditModal = (offer) => {
        setSelectedOffer(offer);
        setData({
            title: offer.title || "",
            description: offer.description || "",
            image: null,
            price: offer.price || "",
            discount_price: offer.discount_price || "",
            discount_type: offer.discount_type || "",
            start_date: offer.start_date || "",
            end_date: offer.end_date || "",
        });
        setImagePreview(offer.image ? `/storage/${offer.image}` : null);
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
            <Head title="Offers - Travel Nest Admin" />
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOffers.length > 0 ? (
                        filteredOffers.map((offer) => (
                            <div
                                key={offer.id}
                                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                {offer.image ? (
                                    <img
                                        src={offer.image}
                                        alt={offer.title}
                                        className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                                        <Image className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-white">
                                            {offer.title || "N/A"}
                                        </h3>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    openEditModal(offer)
                                                }
                                                className="text-blue-400 hover:text-blue-300"
                                                disabled={processing}
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(offer.id)
                                                }
                                                className="text-red-400 hover:text-red-300"
                                                disabled={processing}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleToggleActive(offer.id)
                                                }
                                                className={`${
                                                    offer.is_active
                                                        ? "text-green-400 hover:text-green-300"
                                                        : "text-gray-400 hover:text-gray-300"
                                                }`}
                                                disabled={processing}
                                                title={
                                                    offer.is_active
                                                        ? "Deactivate"
                                                        : "Activate"
                                                }
                                            >
                                                {offer.is_active ? (
                                                    <ToggleRight className="w-5 h-5" />
                                                ) : (
                                                    <ToggleLeft className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2">
                                        {offer.description || "N/A"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Price: ${offer.price} | Discount Price:{" "}
                                        {offer.discount_price
                                            ? `$${offer.discount_price}`
                                            : "N/A"}{" "}
                                        |{offer.discount_type || "No Discount"}{" "}
                                        | Start: {offer.start_date || "N/A"} |
                                        End: {offer.end_date || "N/A"} | Status:{" "}
                                        {offer.is_active
                                            ? "Active"
                                            : "Inactive"}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-400 py-8">
                            No offers found
                        </div>
                    )}
                </div>

                {/* Add Offer Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-800 rounded-lg w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="p-4 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white">
                                        Add Offer
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
                                            htmlFor="title"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {validationErrors.title && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.title}
                                            </p>
                                        )}
                                        {errors.title && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.title}
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
                                            htmlFor="discount_type"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Discount Type (e.g., 30% OFF)
                                        </label>
                                        <input
                                            type="text"
                                            id="discount_type"
                                            name="discount_type"
                                            value={data.discount_type}
                                            onChange={(e) =>
                                                setData(
                                                    "discount_type",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {validationErrors.discount_type && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.discount_type}
                                            </p>
                                        )}
                                        {errors.discount_type && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.discount_type}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="start_date"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Start Date (YYYY-MM-DD)
                                            </label>
                                            <input
                                                type="date"
                                                id="start_date"
                                                name="start_date"
                                                value={data.start_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "start_date",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {validationErrors.start_date && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {
                                                        validationErrors.start_date
                                                    }
                                                </p>
                                            )}
                                            {errors.start_date && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {errors.start_date}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="end_date"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                End Date (YYYY-MM-DD)
                                            </label>
                                            <input
                                                type="date"
                                                id="end_date"
                                                name="end_date"
                                                value={data.end_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "end_date",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {validationErrors.end_date && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {validationErrors.end_date}
                                                </p>
                                            )}
                                            {errors.end_date && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {errors.end_date}
                                                </p>
                                            )}
                                        </div>
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

                {/* Edit Offer Modal */}
                {showEditModal && selectedOffer && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-800 rounded-lg w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="p-4 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white">
                                        Edit Offer
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
                                            htmlFor="title"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {validationErrors.title && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.title}
                                            </p>
                                        )}
                                        {errors.title && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.title}
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
                                                <p className="text-red考价400 text-xs mt-1">
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
                                            htmlFor="discount_type"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Discount Type (e.g., 30% OFF)
                                        </label>
                                        <input
                                            type="text"
                                            id="discount_type"
                                            name="discount_type"
                                            value={data.discount_type}
                                            onChange={(e) =>
                                                setData(
                                                    "discount_type",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {validationErrors.discount_type && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.discount_type}
                                            </p>
                                        )}
                                        {errors.discount_type && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.discount_type}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="start_date"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Start Date (YYYY-MM-DD)
                                            </label>
                                            <input
                                                type="date"
                                                id="start_date"
                                                name="start_date"
                                                value={data.start_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "start_date",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {validationErrors.start_date && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {
                                                        validationErrors.start_date
                                                    }
                                                </p>
                                            )}
                                            {errors.start_date && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {errors.start_date}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="end_date"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                End Date (YYYY-MM-DD)
                                            </label>
                                            <input
                                                type="date"
                                                id="end_date"
                                                name="end_date"
                                                value={data.end_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "end_date",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {validationErrors.end_date && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {validationErrors.end_date}
                                                </p>
                                            )}
                                            {errors.end_date && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {errors.end_date}
                                                </p>
                                            )}
                                        </div>
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
