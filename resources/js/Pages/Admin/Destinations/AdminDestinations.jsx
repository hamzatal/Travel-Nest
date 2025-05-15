import React, { useState, useEffect } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import {
    Search,
    Trash2,
    Plus,
    Edit2,
    Image,
    X,
    ToggleLeft,
    ToggleRight,
    MapPin,
    DollarSign,
    Star,
    Tag,
} from "lucide-react";
import AdminSidebar from "@/Components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

export default function AdminDestinations() {
    const { props } = usePage();
    const { destinations = [], flash = {} } = props;

    const [searchQuery, setSearchQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [charCount, setCharCount] = useState(0);

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
        price: "",
        discount_price: "",
        tag: "",
        rating: 0,
        is_featured: false,
        image: null,
    });

    const validateForm = (isAdd = false) => {
        const errors = {};
        if (!data.name) errors.name = "Name is required";
        else if (data.name.length < 3)
            errors.name = "Name must be at least 3 characters";
        else if (data.name.length > 255)
            errors.name = "Name must not exceed 255 characters";

        if (!data.location) errors.location = "Location is required";
        else if (data.location.length < 3)
            errors.location = "Location must be at least 3 characters";
        else if (data.location.length > 255)
            errors.location = "Location must not exceed 255 characters";

        if (!data.description) errors.description = "Description is required";
        else if (data.description.length < 10)
            errors.description = "Description must be at least 10 characters";

        if (!data.price) errors.price = "Price is required";
        else if (isNaN(parseFloat(data.price)) || parseFloat(data.price) < 0)
            errors.price = "Price must be a non-negative number";

        if (
            data.discount_price &&
            (isNaN(parseFloat(data.discount_price)) ||
                parseFloat(data.discount_price) < 0)
        ) {
            errors.discount_price =
                "Discount price must be a non-negative number";
        } else if (
            data.discount_price &&
            parseFloat(data.discount_price) >= parseFloat(data.price)
        ) {
            errors.discount_price =
                "Discount price must be less than regular price";
        }

        if (data.tag && data.tag.length > 50)
            errors.tag = "Tag must not exceed 50 characters";

        if (
            data.rating &&
            (isNaN(parseFloat(data.rating)) ||
                parseFloat(data.rating) < 0 ||
                parseFloat(data.rating) > 5)
        ) {
            errors.rating = "Rating must be between 0 and 5";
        }

        if (isAdd && !data.image) errors.image = "Image is required";
        if (data.image) {
            const validTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
            ];
            if (!validTypes.includes(data.image.type))
                errors.image = "Image must be JPEG, PNG, JPG, or GIF";
            if (data.image.size > 2 * 1024 * 1024)
                errors.image = "Image size must be less than 2MB";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData("image", file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const removeImage = () => {
        setData("image", null);
        setImagePreview(null);
    };

    const calculateDiscount = (original, discounted) => {
        if (!discounted || !original) return null;
        const percentage = Math.round(
            ((original - discounted) / original) * 100
        );
        return percentage;
    };

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
                setCharCount(0);
            },
            onError: () => {},
        });
    };

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
                setCharCount(0);
            },
            onError: () => {},
        });
    };

    const handleDelete = () => {
        deleteForm(
            route("admin.destinations.destroy", selectedDestination.id),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setSelectedDestination(null);
                },
                onError: () => {},
            }
        );
    };

    const handleToggleFeatured = (id) => {
        patch(route("admin.destinations.toggle-featured", id), {
            preserveScroll: true,
            onSuccess: () => {},
            onError: () => {},
        });
    };

    const openEditModal = (destination) => {
        setSelectedDestination(destination);
        setData({
            name: destination.name || "",
            location: destination.location || "",
            description: destination.description || "",
            price: destination.price || "",
            discount_price: destination.discount_price || "",
            tag: destination.tag || "",
            rating: destination.rating || 0,
            is_featured: destination.is_featured || false,
            image: null,
        });
        setImagePreview(
            destination.image ? `/storage/${destination.image}` : null
        );
        setCharCount(
            destination.description ? destination.description.length : 0
        );
        setShowEditModal(true);
    };

    const openDeleteModal = (destination) => {
        setSelectedDestination(destination);
        setShowDeleteModal(true);
    };

    const filteredDestinations = destinations.filter(
        (destination) =>
            destination.name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            destination.location
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    useEffect(() => {
        setCharCount(data.description.length);
    }, [data.description]);

    useEffect(() => {
        return () => {
            if (imagePreview && !imagePreview.startsWith("/storage")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <Head title="Destinations - Admin" />
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
                            onClick={() => {
                                reset();
                                setImagePreview(null);
                                setCharCount(0);
                                setShowAddModal(true);
                            }}
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
                                        <Image className="w-12 h-12 text-gray-400" />
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
                                                    openDeleteModal(destination)
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
                                                        ? "Remove from featured"
                                                        : "Add to featured"
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
                                    <div className="flex items-center mb-2">
                                        <DollarSign className="w-4 h-4 text-green-400 mr-1" />
                                        {destination.discount_price ? (
                                            <span>
                                                <span className="font-semibold text-green-400">
                                                    $
                                                    {destination.discount_price}
                                                </span>
                                                <span className="text-gray-400 text-sm line-through ml-2">
                                                    ${destination.price}
                                                </span>
                                                <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded ml-2">
                                                    {calculateDiscount(
                                                        destination.price,
                                                        destination.discount_price
                                                    )}
                                                    % OFF
                                                </span>
                                            </span>
                                        ) : (
                                            <span className="font-semibold">
                                                ${destination.price}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <Tag className="w-4 h-4 text-gray-400 mr-1" />
                                        <span className="text-sm text-gray-400">
                                            {destination.tag || "None"}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                        <span className="text-sm text-gray-400">
                                            {destination.rating || 0}/5
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        ID: {destination.id} | Featured:{" "}
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

                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white">
                                        Add Destination
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowAddModal(false);
                                            reset();
                                            setImagePreview(null);
                                            setCharCount(0);
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Name{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {(validationErrors.name ||
                                                errors.name) && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {validationErrors.name ||
                                                        errors.name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="location"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Location{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    id="location"
                                                    value={data.location}
                                                    onChange={(e) =>
                                                        setData(
                                                            "location",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full pl-10 p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            {(validationErrors.location ||
                                                errors.location) && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {validationErrors.location ||
                                                        errors.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Description{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                            <span className="text-gray-500 text-xs ml-2">
                                                ({charCount}/1000)
                                            </span>
                                        </label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            rows="4"
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {(validationErrors.description ||
                                            errors.description) && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.description ||
                                                    errors.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="price"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Price{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="number"
                                                    id="price"
                                                    value={data.price}
                                                    onChange={(e) =>
                                                        setData(
                                                            "price",
                                                            e.target.value
                                                        )
                                                    }
                                                    step="0.01"
                                                    min="0"
                                                    className="w-full pl-10 p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            {(validationErrors.price ||
                                                errors.price) && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {validationErrors.price ||
                                                        errors.price}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="discount_price"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Discount Price
                                            </label>
                                            <div className="relative">
                                                <Tag className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="number"
                                                    id="discount_price"
                                                    value={data.discount_price}
                                                    onChange={(e) =>
                                                        setData(
                                                            "discount_price",
                                                            e.target.value
                                                        )
                                                    }
                                                    step="0.01"
                                                    min="0"
                                                    className="w-full pl-10 p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            {(validationErrors.discount_price ||
                                                errors.discount_price) && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {validationErrors.discount_price ||
                                                        errors.discount_price}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="tag"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Tag
                                        </label>
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                id="tag"
                                                value={data.tag}
                                                onChange={(e) =>
                                                    setData(
                                                        "tag",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full pl-10 p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {(validationErrors.tag ||
                                                errors.tag) && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {validationErrors.tag ||
                                                        errors.tag}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="rating"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Rating (0-5)
                                            </label>
                                            <div className="relative">
                                                <Star className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="number"
                                                    id="rating"
                                                    value={data.rating}
                                                    onChange={(e) =>
                                                        setData(
                                                            "rating",
                                                            e.target.value
                                                        )
                                                    }
                                                    step="0.1"
                                                    min="0"
                                                    max="5"
                                                    className="w-full pl-10 p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            {(validationErrors.rating ||
                                                errors.rating) && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {validationErrors.rating ||
                                                        errors.rating}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center mt-6">
                                            <input
                                                type="checkbox"
                                                id="is_featured"
                                                checked={data.is_featured}
                                                onChange={(e) =>
                                                    setData(
                                                        "is_featured",
                                                        e.target.checked
                                                    )
                                                }
                                                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                                            />
                                            <label
                                                htmlFor="is_featured"
                                                className="ml-2 text-sm font-medium text-gray-400"
                                            >
                                                Featured
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="image"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Image{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="file"
                                            id="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg"
                                        />
                                        {imagePreview && (
                                            <div className="relative mt-2">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
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
                                        {(validationErrors.image ||
                                            errors.image) && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.image ||
                                                    errors.image}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddModal(false);
                                                reset();
                                                setImagePreview(null);
                                                setCharCount(0);
                                            }}
                                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {showEditModal && selectedDestination && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white">
                                        Edit Destination
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowEditModal(false);
                                            reset();
                                            setImagePreview(null);
                                            setSelectedDestination(null);
                                            setCharCount(0);
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Name{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {(validationErrors.name ||
                                                errors.name) && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {validationErrors.name ||
                                                        errors.name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="location"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Location{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    id="location"
                                                    value={data.location}
                                                    onChange={(e) =>
                                                        setData(
                                                            "location",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full pl-10 p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            {(validationErrors.location ||
                                                errors.location) && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {validationErrors.location ||
                                                        errors.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Description{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                            <span className="text-gray-500 text-xs ml-2">
                                                ({charCount}/1000)
                                            </span>
                                        </label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            rows="4"
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {(validationErrors.description ||
                                            errors.description) && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.description ||
                                                    errors.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="price"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Price{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="number"
                                                    id="price"
                                                    value={data.price}
                                                    onChange={(e) =>
                                                        setData(
                                                            "price",
                                                            e.target.value
                                                        )
                                                    }
                                                    step="0.01"
                                                    min="0"
                                                    className="w-full pl-10 p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            {(validationErrors.price ||
                                                errors.price) && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {validationErrors.price ||
                                                        errors.price}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="discount_price"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Discount Price
                                            </label>
                                            <div className="relative">
                                                <Tag className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="number"
                                                    id="discount_price"
                                                    value={data.discount_price}
                                                    onChange={(e) =>
                                                        setData(
                                                            "discount_price",
                                                            e.target.value
                                                        )
                                                    }
                                                    step="0.01"
                                                    min="0"
                                                    className="w-full pl-10 p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            {(validationErrors.discount_price ||
                                                errors.discount_price) && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {validationErrors.discount_price ||
                                                        errors.discount_price}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="tag"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Tag
                                        </label>
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                id="tag"
                                                value={data.tag}
                                                onChange={(e) =>
                                                    setData(
                                                        "tag",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full pl-10 p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {(validationErrors.tag ||
                                                errors.tag) && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {validationErrors.tag ||
                                                        errors.tag}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="rating"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Rating (0-5)
                                            </label>
                                            <div className="relative">
                                                <Star className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="number"
                                                    id="rating"
                                                    value={data.rating}
                                                    onChange={(e) =>
                                                        setData(
                                                            "rating",
                                                            e.target.value
                                                        )
                                                    }
                                                    step="0.1"
                                                    min="0"
                                                    max="5"
                                                    className="w-full pl-10 p-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            {(validationErrors.rating ||
                                                errors.rating) && (
                                                <p className="text-red-400 text-xs mt-1">
                                                    {validationErrors.rating ||
                                                        errors.rating}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center mt-6">
                                            <input
                                                type="checkbox"
                                                id="is_featured"
                                                checked={data.is_featured}
                                                onChange={(e) =>
                                                    setData(
                                                        "is_featured",
                                                        e.target.checked
                                                    )
                                                }
                                                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                                            />
                                            <label
                                                htmlFor="is_featured"
                                                className="ml-2 text-sm font-medium text-gray-400"
                                            >
                                                Featured
                                            </label>
                                        </div>
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
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg"
                                        />
                                        {imagePreview && (
                                            <div className="relative mt-2">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
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
                                        {(validationErrors.image ||
                                            errors.image) && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {validationErrors.image ||
                                                    errors.image}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowEditModal(false);
                                                reset();
                                                setImagePreview(null);
                                                setSelectedDestination(null);
                                                setCharCount(0);
                                            }}
                                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {showDeleteModal && selectedDestination && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-800 rounded-lg max-w-lg w-full">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white">
                                        Delete Destination
                                    </h3>
                                    <button
                                        onClick={() =>
                                            setShowDeleteModal(false)
                                        }
                                        className="text-gray-400 hover:text-gray-300"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <p className="text-gray-400 mb-6">
                                    Are you sure you want to delete "
                                    {selectedDestination.name}"? This action
                                    cannot be undone.
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowDeleteModal(false)
                                        }
                                        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={processing}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <AdminSidebar />
        </div>
    );
}
