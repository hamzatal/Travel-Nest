import React, { useState, useEffect } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Trash2,
    Plus,
    Edit2,
    Image,
    X,
    ToggleLeft,
    ToggleRight,
    Calendar,
    DollarSign,
    Star,
    Tag,
    User,
    Building2,
    MapPin,
    BookAIcon,
    BookOpenCheck,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../Components/Nav";
import Footer from "../../Components/Footer";

// Custom Scrollbar Styles
const styles = `
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #1f2937;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 4px;
    transition: background 0.2s;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #2563eb;
  }
  ::-webkit-scrollbar-corner {
    background: #1f2937;
  }
  * {
    scrollbar-width: thin;
    scrollbar-color: #4b5563 #1f2937;
  }
`;

// Inject styles with cleanup
const injectStyles = () => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
        document.head.removeChild(styleSheet);
    };
};

// Format date
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return "N/A";
    }
};

// Format ISO date to yyyy-MM-dd
const formatISOToDateInput = (isoString) => {
    if (!isoString) return "";
    try {
        return isoString.split("T")[0];
    } catch {
        return "";
    }
};

// Calculate discount percentage
const calculateDiscount = (original, discounted) => {
    if (!discounted || !original) return null;
    const percentage = Math.round(((original - discounted) / original) * 100);
    return percentage;
};

// Render stars
const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round((rating || 0) * 2) / 2;
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <Star
                key={i}
                size={14}
                className={
                    i <= roundedRating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-500"
                }
            />
        );
    }
    return stars;
};

export default function Dashboard() {
    const { props } = usePage();
    const {
        destinations = [],
        offers = [],
        packages = [],
        bookings = [],
        flash = {},
        auth = { user: null },
    } = props;
    const user = auth?.user || null;

    // State management
    const [activeTab, setActiveTab] = useState("bookings");
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(null);
    const [showEditModal, setShowEditModal] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [charCount, setCharCount] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(true);

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
        subtitle: "",
        description: "",
        price: "",
        discount_price: "",
        discount_type: "percentage",
        start_date: "",
        end_date: "",
        image: null,
        location: "",
        rating: "",
        is_featured: false,
        is_active: true,
        name: "",
        tag: "",
    });

    // Inject styles
    useEffect(() => {
        const cleanup = injectStyles();
        return cleanup;
    }, []);

    // Handle flash messages
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
    };

    // Validation
    const validateForm = (type, isAdd = false) => {
        const errors = {};
        if (["destination", "offer", "package"].includes(type)) {
            if (!data.title && type !== "destination") {
                errors.title = "Title is required";
            }
            if (!data.name && type === "destination") {
                errors.name = "Name is required";
            }
            if (!data.description) {
                errors.description = "Description is required";
            }
            if (!data.price) {
                errors.price = "Price is required";
            }
            if (
                data.price &&
                (isNaN(parseFloat(data.price)) || parseFloat(data.price) <= 0)
            ) {
                errors.price = "Price must be a positive number";
            }
            if (data.discount_price) {
                if (
                    isNaN(parseFloat(data.discount_price)) ||
                    parseFloat(data.discount_price) <= 0 ||
                    parseFloat(data.discount_price) >= parseFloat(data.price)
                ) {
                    errors.discount_price =
                        "Discount price must be less than regular price";
                }
            }
            if (type !== "destination") {
                if (isAdd && !data.start_date) {
                    errors.start_date = "Start date is required";
                }
                if (isAdd && !data.end_date) {
                    errors.end_date = "End date is required";
                }
                if (
                    data.start_date &&
                    data.end_date &&
                    new Date(data.end_date) < new Date(data.start_date)
                ) {
                    errors.end_date =
                        "End date must be after or equal to start date";
                }
            }
            if (type === "destination" && !data.location) {
                errors.location = "Location is required";
            }
            if (isAdd && type !== "offer" && !data.image) {
                errors.image = "Image is required";
            }
            if (data.image) {
                const validTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/jpg",
                    "image/gif",
                ];
                if (
                    typeof data.image === "object" &&
                    !validTypes.includes(data.image.type)
                ) {
                    errors.image = "Image must be JPEG, PNG, JPG, or GIF";
                }
                if (
                    typeof data.image === "object" &&
                    data.image.size > 2 * 1024 * 1024
                ) {
                    errors.image = "Image size must be less than 2MB";
                }
            }
            if (data.rating) {
                const rating = parseFloat(data.rating);
                if (isNaN(rating) || rating < 0 || rating > 5) {
                    errors.rating = "Rating must be between 0 and 5";
                }
            }
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData("image", file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
        setValidationErrors((prev) => ({ ...prev, image: null }));
    };

    // Remove image
    const removeImage = () => {
        setData("image", null);
        setImagePreview(null);
    };

    // Handle add
    const handleAdd = (e, type) => {
        e.preventDefault();
        if (!validateForm(type, true)) {
            toast.error("Please fix the form errors.");
            return;
        }
        const routeName = `company.${type}s.store`;
        post(route(routeName), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setShowAddModal(null);
                reset();
                setImagePreview(null);
                setCharCount(0);
                setValidationErrors({});
                toast.success(
                    `${
                        type.charAt(0).toUpperCase() + type.slice(1)
                    } created successfully!`
                );
            },
            onError: (errors) => {
                setValidationErrors(errors);
                toast.error("Failed to create. Please check the form.");
            },
        });
    };

    // Handle edit
    const handleEdit = (e, type) => {
        e.preventDefault();
        if (!validateForm(type)) {
            toast.error("Please fix the form errors.");
            return;
        }
        const routeName = `company.${type}s.update`;
        put(route(routeName, selectedItem.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setShowEditModal(null);
                reset();
                setImagePreview(null);
                setCharCount(0);
                setValidationErrors({});
                toast.success(
                    `${
                        type.charAt(0).toUpperCase() + type.slice(1)
                    } updated successfully!`
                );
            },
            onError: (errors) => {
                setValidationErrors(errors);
                toast.error("Failed to update. Please check the form.");
            },
        });
    };

    // Handle delete
    const handleDelete = () => {
        const type = itemToDelete.type;
        const routeName = `company.${type}s.destroy`;
        deleteForm(route(routeName, itemToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(null);
                setItemToDelete(null);
                toast.success(
                    `${
                        type.charAt(0).toUpperCase() + type.slice(1)
                    } deleted successfully!`
                );
            },
            onError: () => {
                toast.error("Failed to delete. Please try again.");
            },
        });
    };

    // Handle toggle featured/active
    const handleToggle = (item, type, field) => {
        const routeName = `company.${type}s.${
            field === "is_featured" ? "toggle-featured" : "toggle"
        }`;
        patch(route(routeName, item.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    `${
                        field === "is_featured" ? "Featured" : "Active"
                    } status toggled!`
                );
            },
            onError: () => {
                toast.error("Failed to toggle status.");
            },
        });
    };

    // Open add modal
    const openAddModal = (type) => {
        reset();
        setImagePreview(null);
        setCharCount(0);
        setValidationErrors({});
        setShowAddModal(type);
    };

    // Open edit modal
    const openEditModal = (item, type) => {
        setSelectedItem(item);
        setData({
            title: item.title || "",
            subtitle: item.subtitle || "",
            description: item.description || "",
            price: item.price || "",
            discount_price: item.discount_price || "",
            discount_type: item.discount_type || "percentage",
            start_date: formatISOToDateInput(item.start_date) || "",
            end_date: formatISOToDateInput(item.end_date) || "",
            image: null,
            location: item.location || "",
            rating: item.rating || "",
            is_featured: item.is_featured || false,
            is_active: item.is_active || true,
            name: item.name || "",
            tag: item.tag || "",
        });
        setImagePreview(item.image ? `/storage/${item.image}` : null);
        setCharCount(item.description ? item.description.length : 0);
        setValidationErrors({});
        setShowEditModal(type);
    };

    // Open delete modal
    const openDeleteModal = (item, type) => {
        setItemToDelete({ id: item.id, type });
        setShowDeleteModal(true);
    };

    // Filter items
    const filteredDestinations = destinations.filter(
        (item) =>
            (item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.location
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())) &&
            item.is_active !== false
    );
    const filteredOffers = offers.filter(
        (item) =>
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
            item.is_active !== false
    );
    const filteredPackages = packages.filter(
        (item) =>
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
            item.is_active !== false
    );
    const filteredBookings = bookings.filter(
        (item) =>
            (item.user?.name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
                item.user?.email
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                item.destination?.name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                item.package?.title
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                item.offer?.title
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())) &&
            item.is_active !== false
    );

    // Render form fields
    const renderFormFields = (type, isAdd = false) => {
        const isDestination = type === "destination";
        return (
            <div className="space-y-6">
                {isDestination ? (
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Destination Name
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className={`pl-10 w-full py-3 rounded-lg border bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                    validationErrors.name
                                        ? "border-red-500"
                                        : ""
                                }`}
                                placeholder="Enter destination name"
                            />
                        </div>
                        {validationErrors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {validationErrors.name}
                            </p>
                        )}
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Title
                        </label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                className={`pl-10 w-full py-3 rounded-lg border bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                    validationErrors.title
                                        ? "border-red-500"
                                        : ""
                                }`}
                                placeholder="Enter title"
                            />
                        </div>
                        {validationErrors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {validationErrors.title}
                            </p>
                        )}
                    </div>
                )}
                {type === "package" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Subtitle
                        </label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                value={data.subtitle}
                                onChange={(e) =>
                                    setData("subtitle", e.target.value)
                                }
                                className="pl-10 w-full py-3 rounded-lg border bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter subtitle"
                            />
                        </div>
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                    </label>
                    <textarea
                        value={data.description}
                        onChange={(e) => {
                            setData("description", e.target.value);
                            setCharCount(e.target.value.length);
                        }}
                        className={`w-full py-3 px-4 rounded-lg border bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y min-h-[100px] ${
                            validationErrors.description ? "border-red-500" : ""
                        }`}
                        placeholder="Enter description"
                        maxLength={500}
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                        <span>{charCount}/500</span>
                        {validationErrors.description && (
                            <p className="text-red-500">
                                {validationErrors.description}
                            </p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Price
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="number"
                                value={data.price}
                                onChange={(e) =>
                                    setData("price", e.target.value)
                                }
                                className={`pl-10 w-full py-3 rounded-lg border bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                    validationErrors.price
                                        ? "border-red-500"
                                        : ""
                                }`}
                                placeholder="Enter price"
                                step="0.01"
                                min="0"
                            />
                        </div>
                        {validationErrors.price && (
                            <p className="text-red-500 text-sm mt-1">
                                {validationErrors.price}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Discount Price
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="number"
                                value={data.discount_price}
                                onChange={(e) =>
                                    setData("discount_price", e.target.value)
                                }
                                className={`pl-10 w-full py-3 rounded-lg border bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                    validationErrors.discount_price
                                        ? "border-red-500"
                                        : ""
                                }`}
                                placeholder="Enter discount price"
                                step="0.01"
                                min="0"
                            />
                        </div>
                        {validationErrors.discount_price && (
                            <p className="text-red-500 text-sm mt-1">
                                {validationErrors.discount_price}
                            </p>
                        )}
                    </div>
                </div>
                {type !== "destination" && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Start Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) =>
                                            setData(
                                                "start_date",
                                                e.target.value
                                            )
                                        }
                                        className={`pl-10 w-full py-3 rounded-lg border bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                            validationErrors.start_date
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {validationErrors.start_date && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {validationErrors.start_date}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    End Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) =>
                                            setData("end_date", e.target.value)
                                        }
                                        className={`pl-10 w-full py-3 rounded-lg border bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                            validationErrors.end_date
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {validationErrors.end_date && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {validationErrors.end_date}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Discount Type
                            </label>
                            <select
                                value={data.discount_type}
                                onChange={(e) =>
                                    setData("discount_type", e.target.value)
                                }
                                className="w-full py-3 rounded-lg border bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                            </select>
                        </div>
                    </>
                )}
                {isDestination && (
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Location
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                value={data.location}
                                onChange={(e) =>
                                    setData("location", e.target.value)
                                }
                                className={`pl-10 w-full py-3 rounded-lg border bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                    validationErrors.location
                                        ? "border-red-500"
                                        : ""
                                }`}
                                placeholder="Enter location"
                            />
                        </div>
                        {validationErrors.location && (
                            <p className="text-red-500 text-sm mt-1">
                                {validationErrors.location}
                            </p>
                        )}
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        {isDestination ? "Tag" : "Rating"}
                    </label>
                    <div className="relative">
                        {isDestination ? (
                            <Tag className="absolute left-3 top-3 text-gray-400" />
                        ) : (
                            <Star className="absolute left-3 top-3 text-gray-400" />
                        )}
                        <input
                            type={isDestination ? "text" : "number"}
                            value={isDestination ? data.tag : data.rating}
                            onChange={(e) =>
                                setData(
                                    isDestination ? "tag" : "rating",
                                    e.target.value
                                )
                            }
                            className={`pl-10 w-full py-3 rounded-lg border bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                validationErrors[
                                    isDestination ? "tag" : "rating"
                                ]
                                    ? "border-red-500"
                                    : ""
                            }`}
                            placeholder={
                                isDestination
                                    ? "Enter tag"
                                    : "Enter rating (0-5)"
                            }
                            step={isDestination ? undefined : "0.1"}
                            min={isDestination ? undefined : "0"}
                            max={isDestination ? undefined : "5"}
                        />
                    </div>
                    {validationErrors[isDestination ? "tag" : "rating"] && (
                        <p className="text-red-500 text-sm mt-1">
                            {validationErrors[isDestination ? "tag" : "rating"]}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Image
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full py-3 rounded-lg border bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-600 file:text-white hover:file:bg-gray-500"
                        />
                    </div>
                    {imagePreview && (
                        <div className="mt-4 relative">
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
                    {validationErrors.image && (
                        <p className="text-red-500 text-sm mt-1">
                            {validationErrors.image}
                        </p>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center text-sm text-gray-300">
                        <input
                            type="checkbox"
                            checked={data.is_featured}
                            onChange={(e) =>
                                setData("is_featured", e.target.checked)
                            }
                            className="mr-2 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                        />
                        Featured
                    </label>
                    {type !== "destination" && (
                        <label className="flex items-center text-sm text-gray-300">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData("is_active", e.target.checked)
                                }
                                className="mr-2 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                            />
                            Active
                        </label>
                    )}
                </div>
            </div>
        );
    };

    // Render cards
    const renderCards = (items, type) => {
        const isDestination = type === "destination";
        const isOffer = type === "offer";
        const isBooking = type === "booking";
        if (isBooking) {
            return items.map((item) => {
                const entity = item.destination || item.offer || item.package;
                return (
                    <motion.div
                        key={`booking-${item.id}`}
                        variants={cardVariants}
                        layout
                        whileHover={{
                            y: -8,
                            transition: { duration: 0.3 },
                        }}
                        className="rounded-2xl overflow-hidden shadow-lg bg-gray-800 hover:bg-gray-750 border border-gray-700 flex flex-col group transition-all duration-300"
                    >
                        <div className="relative overflow-hidden">
                            <img
                                src={
                                    entity?.image
                                        ? `/storage/${entity.image}`
                                        : "https://via.placeholder.com/640x480?text=No+Image"
                                }
                                alt={entity?.name || entity?.title || "Booking"}
                                className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.src =
                                        "https://via.placeholder.com/640x480?text=No+Image";
                                }}
                            />
                            <span className="absolute top-3 right-3 px-3 py-1 bg-green-600 rounded-full text-xs font-medium text-white">
                                {item.status}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-bold line-clamp-1 text-white">
                                    {entity?.name || entity?.title || "N/A"}
                                </h3>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <User
                                    size={16}
                                    className="text-blue-500 flex-shrink-0"
                                />
                                <span className="text-sm text-gray-300">
                                    {item.user?.name || "N/A"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar size={16} className="text-blue-500" />
                                <span className="text-sm text-gray-300">
                                    {formatDate(item.check_in)} -{" "}
                                    {formatDate(item.check_out)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-sm text-gray-300">
                                    Guests: {item.guests}
                                </span>
                            </div>
                            <div className="mt-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <span className="block text-xs font-medium text-gray-400">
                                            Total Price
                                        </span>
                                        <span className="text-lg font-bold text-blue-500">
                                            $
                                            {parseFloat(
                                                item.total_price
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            });
        }
        return items.map((item) => (
            <motion.div
                key={`${type}-${item.id}`}
                variants={cardVariants}
                layout
                whileHover={{
                    y: -8,
                    transition: { duration: 0.3 },
                }}
                className="rounded-2xl overflow-hidden shadow-lg bg-gray-800 hover:bg-gray-750 border border-gray-700 flex flex-col group transition-all duration-300"
            >
                <div className="relative overflow-hidden">
                    <img
                        src={
                            item.image
                                ? `/storage/${item.image}`
                                : "https://via.placeholder.com/640x480?text=No+Image"
                        }
                        alt={isDestination ? item.name : item.title}
                        className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                            e.target.src =
                                "https://via.placeholder.com/640x480?text=No+Image";
                        }}
                    />
                    {(item.tag || item.discount_type) && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-blue-600 rounded-full text-xs font-medium text-white">
                            {item.tag || item.discount_type}
                        </span>
                    )}
                    {calculateDiscount(item.price, item.discount_price) && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {calculateDiscount(item.price, item.discount_price)}
                            % OFF
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold line-clamp-1 text-white">
                            {isDestination ? item.name : item.title}
                        </h3>
                    </div>
                    {isDestination && item.location && (
                        <div className="flex items-center gap-2 mb-3">
                            <MapPin
                                size={16}
                                className="text-blue-500 flex-shrink-0"
                            />
                            <span className="text-sm text-gray-300">
                                {item.location}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center gap-1 mb-4">
                        {renderStars(item.rating || 0)}
                        <span className="text-sm ml-2 text-gray-400">
                            ({item.rating || 0}/5)
                        </span>
                    </div>
                    <p className="text-sm mb-4 line-clamp-2 text-gray-300">
                        {item.description || "No description available."}
                    </p>
                    {isOffer && item.end_date && (
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar size={16} className="text-blue-500" />
                            <span className="text-sm text-gray-300">
                                Valid until {formatDate(item.end_date)}
                            </span>
                        </div>
                    )}
                    <div className="mt-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="block text-xs font-medium text-gray-400">
                                    Starting from
                                </span>
                                <div className="flex items-baseline gap-2">
                                    {item.discount_price ? (
                                        <>
                                            <span className="text-lg font-bold text-blue-500">
                                                $
                                                {parseFloat(
                                                    item.discount_price
                                                ).toFixed(2)}
                                            </span>
                                            <span className="text-sm line-through text-gray-400">
                                                $
                                                {parseFloat(item.price).toFixed(
                                                    2
                                                )}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-lg font-bold text-blue-500">
                                            ${parseFloat(item.price).toFixed(2)}
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-400">
                                        / person
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                        handleToggle(item, type, "is_featured")
                                    }
                                    className="text-gray-400 hover:text-blue-500"
                                    title="Toggle Featured"
                                >
                                    {item.is_featured ? (
                                        <Star className="w-5 h-5 text-yellow-400" />
                                    ) : (
                                        <Star className="w-5 h-5" />
                                    )}
                                </motion.button>
                                {isOffer && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() =>
                                            handleToggle(
                                                item,
                                                type,
                                                "is_active"
                                            )
                                        }
                                        className="text-gray-400 hover:text-blue-500"
                                        title="Toggle Active"
                                    >
                                        {item.is_active ? (
                                            <ToggleRight className="w-5 h-5 text-blue-500" />
                                        ) : (
                                            <ToggleLeft className="w-5 h-5" />
                                        )}
                                    </motion.button>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openEditModal(item, type)}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform group-hover:shadow-lg"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openDeleteModal(item, type)}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-base font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300 transform group-hover:shadow-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        ));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <Head>
                <title>Company Dashboard - Travel Nest</title>
                <meta
                    name="description"
                    content="Manage your bookings, destinations, offers, and packages with Travel Nest."
                />
            </Head>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

            <Navbar
                user={user}
                isDarkMode={isDarkMode}
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            />

            {/* Hero Section */}
            <section className="relative h-80 md:h-88 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-800/80"></div>
                <div className="absolute inset-0 bg-[url('/images/world.svg')] bg-no-repeat bg-center opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
                            Company{" "}
                            <span className="text-green-500">Dashboard</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                            Manage your bookings, destinations, offers, and
                            packages with ease
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-14 bg-gray-900">
                <div className="max-w-7xl mx-auto px-6 md:px-16">
                    {/* Tabs */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="mb-8"
                    >
                        <div className="flex justify-center border-b border-gray-700/50">
                            <button
                                onClick={() => setActiveTab("bookings")}
                                className={`flex-1 sm:flex-none py-3 px-6 text-center font-semibold text-lg transition-all duration-300 rounded-t-lg ${
                                    activeTab === "bookings"
                                        ? "bg-green-600 text-white shadow-md"
                                        : "text-gray-400 hover:text-gray-300"
                                }`}
                            >
                                <BookOpenCheck className="inline-block w-5 h-5 mr-2" />
                                Bookings
                            </button>
                            <button
                                onClick={() => setActiveTab("destinations")}
                                className={`flex-1 sm:flex-none py-3 px-6 text-center font-semibold text-lg transition-all duration-300 rounded-t-lg ${
                                    activeTab === "destinations"
                                        ? "bg-green-600 text-white shadow-md"
                                        : "text-gray-400 hover:text-gray-300"
                                }`}
                            >
                                <MapPin className="inline-block w-5 h-5 mr-2" />
                                Destinations
                            </button>
                            <button
                                onClick={() => setActiveTab("offers")}
                                className={`flex-1 sm:flex-none py-3 px-6 text-center font-semibold text-lg transition-all duration-300 rounded-t-lg ${
                                    activeTab === "offers"
                                        ? "bg-green-600 text-white shadow-md"
                                        : "text-gray-400 hover:text-gray-300"
                                }`}
                            >
                                <Tag className="inline-block w-5 h-5 mr-2" />
                                Offers
                            </button>
                            <button
                                onClick={() => setActiveTab("packages")}
                                className={`flex-1 sm:flex-none py-3 px-6 text-center font-semibold text-lg transition-all duration-300 rounded-t-lg ${
                                    activeTab === "packages"
                                        ? "bg-green-600 text-white shadow-md"
                                        : "text-gray-400 hover:text-gray-300"
                                }`}
                            >
                                <Building2 className="inline-block w-5 h-5 mr-2" />
                                Packages
                            </button>
                        </div>
                    </motion.div>

                    {/* Search and Add Button */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="mb-12"
                    >
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                            <div className="relative w-full md:w-96">
                                <input
                                    type="text"
                                    placeholder="Search bookings, destinations, offers, or packages..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-12 pr-4 py-3 rounded-full text-lg bg-gray-800 text-gray-300 border-gray-700 border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                                />
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            </div>
                            {activeTab !== "bookings" && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                        openAddModal(activeTab.slice(0, -1))
                                    }
                                    className="flex items-center gap-2 px-4 py-3 rounded-full text-lg bg-green-600 text-white hover:bg-green-700 border border-gray-700 transition-all duration-300"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Add {activeTab.slice(0, -1)}</span>
                                </motion.button>
                            )}
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-sm text-gray-400">
                                Showing {filteredBookings.length} {activeTab}
                            </p>
                        </div>
                    </motion.div>

                    {/* Cards Grid */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                    >
                        <AnimatePresence mode="popLayout">
                            {activeTab === "bookings" &&
                            filteredBookings.length === 0 ? (
                                <motion.div
                                    variants={fadeIn}
                                    className="col-span-full text-center py-16"
                                >
                                    <div className="max-w-md mx-auto">
                                        <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                                        <h3 className="text-2xl font-bold mb-2 text-white">
                                            No Bookings Found
                                        </h3>
                                        <p className="text-base mb-6 text-gray-400">
                                            There are no bookings to display.
                                        </p>
                                    </div>
                                </motion.div>
                            ) : activeTab === "destinations" &&
                              filteredDestinations.length === 0 ? (
                                <motion.div
                                    variants={fadeIn}
                                    className="col-span-full text-center py-16"
                                >
                                    <div className="max-w-md mx-auto">
                                        <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                                        <h3 className="text-2xl font-bold mb-2 text-white">
                                            No Destinations Found
                                        </h3>
                                        <p className="text-base mb-6 text-gray-400">
                                            Add new destinations to manage your
                                            offerings.
                                        </p>
                                    </div>
                                </motion.div>
                            ) : activeTab === "offers" &&
                              filteredOffers.length === 0 ? (
                                <motion.div
                                    variants={fadeIn}
                                    className="col-span-full text-center py-16"
                                >
                                    <div className="max-w-md mx-auto">
                                        <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                                        <h3 className="text-2xl font-bold mb-2 text-white">
                                            No Offers Found
                                        </h3>
                                        <p className="text-base mb-6 text-gray-400">
                                            Add new offers to attract customers.
                                        </p>
                                    </div>
                                </motion.div>
                            ) : activeTab === "packages" &&
                              filteredPackages.length === 0 ? (
                                <motion.div
                                    variants={fadeIn}
                                    className="col-span-full text-center py-16"
                                >
                                    <div className="max-w-md mx-auto">
                                        <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                                        <h3 className="text-2xl font-bold mb-2 text-white">
                                            No Packages Found
                                        </h3>
                                        <p className="text-base mb-6 text-gray-400">
                                            Add new packages to expand your
                                            services.
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                activeTab === "bookings" &&
                                renderCards(filteredBookings, "booking")
                            )}
                            {activeTab === "destinations" &&
                                renderCards(
                                    filteredDestinations,
                                    "destination"
                                )}
                            {activeTab === "offers" &&
                                renderCards(filteredOffers, "offer")}
                            {activeTab === "packages" &&
                                renderCards(filteredPackages, "package")}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">
                                Add{" "}
                                {showAddModal.charAt(0).toUpperCase() +
                                    showAddModal.slice(1)}
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowAddModal(null)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </motion.button>
                        </div>
                        <form onSubmit={(e) => handleAdd(e, showAddModal)}>
                            {renderFormFields(showAddModal, true)}
                            <div className="flex justify-end mt-6 space-x-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => setShowAddModal(null)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                                >
                                    {processing && (
                                        <span className="animate-spin">⟳</span>
                                    )}
                                    <span>Create</span>
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">
                                Edit{" "}
                                {showEditModal.charAt(0).toUpperCase() +
                                    showEditModal.slice(1)}
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowEditModal(null)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </motion.button>
                        </div>
                        <form onSubmit={(e) => handleEdit(e, showEditModal)}>
                            {renderFormFields(showEditModal)}
                            <div className="flex justify-end mt-6 space-x-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => setShowEditModal(null)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                                >
                                    {processing && (
                                        <span className="animate-spin">⟳</span>
                                    )}
                                    <span>Update</span>
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && itemToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">
                                Confirm Deletion
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowDeleteModal(null)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </motion.button>
                        </div>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete this{" "}
                            {itemToDelete.type}? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowDeleteModal(null)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                            >
                                <Trash2 className="w-5 h-5" />
                                <span>Delete</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
