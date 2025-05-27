import React, { useState, useEffect } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Trash2,
    Plus,
    Edit2,
    Image as ImageIcon, // Renamed to avoid conflict with Image component
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
    BookOpenCheck,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../Components/Nav";
import Footer from "../../Components/Footer";

// Placeholder image URL - ensure this path is correct relative to your public directory
const defaultImage = "/images/placeholder.jpg";

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
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "N/A";
        }
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return "N/A";
    }
};

// Format ISO date to YYYY-MM-dd
const formatISOToDateInput = (isoString) => {
    if (!isoString) return "";
    try {
        // Handle both 'YYYY-MM-DD HH:MM:SS' and 'YYYY-MM-DDTHH:MM:SS.sssZ' formats
        const datePart = isoString.split("T")[0].split(" ")[0];
        return datePart;
    } catch {
        return "";
    }
};

// Calculate discount percentage
const calculateDiscount = (original, discounted) => {
    const originalPrice = parseFloat(original);
    const discountedPrice = parseFloat(discounted);

    if (
        isNaN(originalPrice) ||
        isNaN(discountedPrice) ||
        originalPrice <= 0 ||
        discountedPrice >= originalPrice
    ) {
        return null;
    }
    const percentage = Math.round(
        ((originalPrice - discountedPrice) / originalPrice) * 100
    );
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
        destinations = { data: [] },
        offers = { data: [] },
        packages = { data: [] },
        bookings = { data: [] },
        flash = {},
        auth = { user: null },
    } = props;
    const user = auth?.user || null;

    // State management
    const [activeTab, setActiveTab] = useState("bookings");
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(null); // 'destination', 'offer', 'package'
    const [showEditModal, setShowEditModal] = useState(null); // 'destination', 'offer', 'package'
    const [showDeleteModal, setShowDeleteModal] = useState(false); // true/false
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
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
        errors, // Inertia.js errors
    } = useForm({
        // Common fields
        description: "",
        price: "",
        discount_price: "",
        image: null,
        is_featured: false,
        is_active: true,

        // Destination specific fields
        name: "", // maps to 'title' in DB for destinations
        location: "",
        tag: "", // maps to 'category' in DB for destinations

        // Offer/Package specific fields
        title: "",
        subtitle: "", // for packages
        discount_type: "percentage",
        start_date: "",
        end_date: "",
        rating: "",
        destination_id: "", // for offers and packages
    });

    // Inject custom scrollbar styles
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

    // Update charCount when description changes
    useEffect(() => {
        setCharCount(data.description ? data.description.length : 0);
    }, [data.description]);

    // Update form errors whenever Inertia.js errors object changes
    // This allows backend validation errors to be displayed
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            // Toast error only if there are actual validation errors that haven't been shown
            const validationKeys = [
                "name",
                "title",
                "description",
                "price",
                "discount_price",
                "start_date",
                "end_date",
                "image",
                "location",
                "rating",
                "tag",
                "destination_id",
            ];
            const hasValidationErrors = validationKeys.some(
                (key) => errors[key]
            );
            if (hasValidationErrors) {
                toast.error("Please fix the form errors.");
            }
        }
    }, [errors]);

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

    // Handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData("image", file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    // Remove image
    const removeImage = () => {
        setData("image", null);
        setImagePreview(null);
    };

    // Handle add
    const handleAdd = (e, type) => {
        e.preventDefault();

        // Client-side validation
        if (type === "destination" && !data.name) {
            toast.error("Destination name is required");
            return;
        }
        if (type !== "destination" && !data.title) {
            toast.error("Title is required");
            return;
        }
        if (!data.description) {
            toast.error("Description is required");
            return;
        }
        if (!data.price || data.price <= 0) {
            toast.error("Valid price is required");
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
                toast.success(
                    `${
                        type.charAt(0).toUpperCase() + type.slice(1)
                    } created successfully!`
                );
            },
            onError: (inertiaErrors) => {
                toast.error(
                    "Failed to create. Please check the form for errors."
                );
            },
        });
    };

    // Handle edit
    const handleEdit = (e, type) => {
        e.preventDefault();
        if (!selectedItem) return;

        // Filter out empty or unchanged fields
        const updatedData = {};
        Object.keys(data).forEach((key) => {
            if (
                data[key] !== "" &&
                data[key] !== null &&
                data[key] !== undefined
            ) {
                updatedData[key] = data[key];
            }
        });

        const routeName = `company.${type}s.update`;
        put(route(routeName, selectedItem.id), {
            data: updatedData, // Send only updated fields
            preserveScroll: true,
            forceFormData: true, // Important for file uploads
            onSuccess: () => {
                setShowEditModal(null);
                setSelectedItem(null);
                reset();
                setImagePreview(null);
                toast.success(
                    `${
                        type.charAt(0).toUpperCase() + type.slice(1)
                    } updated successfully!`
                );
            },
            onError: (inertiaErrors) => {
                toast.error(
                    "Failed to update. Please check the form for errors."
                );
            },
        });
    };

    // Handle delete
    const handleDelete = () => {
        if (!itemToDelete) return;

        const type = itemToDelete.type;
        const routeName = `company.${type}s.destroy`;
        deleteForm(route(routeName, itemToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
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
            field === "is_featured" ? "toggle-featured" : "toggle-active"
        }`;
        // Use patch for partial updates (toggling a single field)
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
        reset(); // Clear form data
        setImagePreview(null); // Clear image preview
        setShowAddModal(type);
    };

    // Open edit modal
    const openEditModal = (item, type) => {
        setSelectedItem(item);
        // Map backend data to frontend form data structure
        const commonData = {
            description: item.description || "",
            price: item.price || "",
            discount_price: item.discount_price || "",
            image: null, // Image input needs to be null for security, user re-uploads
            is_featured: item.is_featured || false,
            is_active: item.is_active !== undefined ? item.is_active : true, // Ensure boolean for offers/packages
            rating: item.rating || "",
        };

        let specificData = {};
        if (type === "destination") {
            specificData = {
                name: item.name || "", // DB 'title' is 'name' in frontend
                location: item.location || "",
                tag: item.category || "", // DB 'category' is 'tag' in frontend
            };
        } else if (type === "offer" || type === "package") {
            specificData = {
                title: item.title || "",
                subtitle: item.subtitle || "", // Only for package
                discount_type: item.discount_type || "percentage",
                start_date: formatISOToDateInput(item.start_date) || "",
                end_date: formatISOToDateInput(item.end_date) || "",
                destination_id: item.destination_id || "",
            };
        }
        setData({ ...commonData, ...specificData });
        setImagePreview(item.image ? item.image : null); // Show current image if exists
        setShowEditModal(type);
    };

    // Open delete modal
    const openDeleteModal = (item, type) => {
        setItemToDelete({ id: item.id, type });
        setShowDeleteModal(true);
    };

    // Filter items
    const filterItems = (items, type) => {
        return items.filter((item) => {
            const query = searchQuery.toLowerCase();
            if (type === "destination") {
                return (
                    item.name?.toLowerCase().includes(query) ||
                    item.location?.toLowerCase().includes(query) ||
                    item.description?.toLowerCase().includes(query) ||
                    item.category?.toLowerCase().includes(query)
                );
            } else if (type === "offer" || type === "package") {
                return (
                    item.title?.toLowerCase().includes(query) ||
                    item.subtitle?.toLowerCase().includes(query) || // for packages
                    item.description?.toLowerCase().includes(query) ||
                    item.location?.toLowerCase().includes(query) ||
                    item.category?.toLowerCase().includes(query)
                );
            } else if (type === "booking") {
                return (
                    item.user?.name?.toLowerCase().includes(query) ||
                    item.user?.email?.toLowerCase().includes(query) ||
                    item.destination?.name?.toLowerCase().includes(query) ||
                    item.package?.title?.toLowerCase().includes(query) ||
                    item.offer?.title?.toLowerCase().includes(query)
                );
            }
            return false;
        });
    };

    const filteredDestinations = filterItems(destinations.data, "destination");
    const filteredOffers = filterItems(offers.data, "offer");
    const filteredPackages = filterItems(packages.data, "package");
    const filteredBookings = filterItems(bookings.data, "booking");

    // Render form fields
    const renderFormFields = (type) => {
        const isDestination = type === "destination";
        const isOffer = type === "offer";
        const isPackage = type === "package";

        // Get available destinations for offers/packages dropdown
        const availableDestinations = destinations.data.map((d) => ({
            id: d.id,
            name: d.name, // Use the 'name' property as returned by the controller for display
        }));

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
                                    errors.name ? "border-red-500" : ""
                                }`}
                                placeholder="Enter destination name"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>
                ) : (
                    <>
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
                                        errors.title ? "border-red-500" : ""
                                    }`}
                                    placeholder="Enter title"
                                />
                            </div>
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.title}
                                </p>
                            )}
                        </div>
                        {isPackage && (
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
                        {(isOffer || isPackage) && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Associated Destination
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400" />
                                    <select
                                        value={data.destination_id}
                                        onChange={(e) =>
                                            setData(
                                                "destination_id",
                                                e.target.value
                                            )
                                        }
                                        className={`pl-10 w-full py-3 rounded-lg border bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                            errors.destination_id
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    >
                                        <option value="">
                                            Select a destination
                                        </option>
                                        {availableDestinations.map((dest) => (
                                            <option
                                                key={dest.id}
                                                value={dest.id}
                                            >
                                                {dest.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.destination_id && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.destination_id}
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                    </label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        className={`w-full py-3 px-4 rounded-lg border bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y min-h-[100px] ${
                            errors.description ? "border-red-500" : ""
                        }`}
                        placeholder="Enter description"
                        maxLength={5000}
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                        <span>{charCount}/5000</span>
                        {errors.description && (
                            <p className="text-red-500">{errors.description}</p>
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
                                    errors.price ? "border-red-500" : ""
                                }`}
                                placeholder="Enter price"
                                step="0.01"
                                min="0.01"
                            />
                        </div>
                        {errors.price && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.price}
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
                                    errors.discount_price
                                        ? "border-red-500"
                                        : ""
                                }`}
                                placeholder="Enter discount price"
                                step="0.01"
                                min="0"
                            />
                        </div>
                        {errors.discount_price && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.discount_price}
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
                                            errors.start_date
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {errors.start_date && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.start_date}
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
                                            errors.end_date
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {errors.end_date && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.end_date}
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
                            Category (Tag)
                        </label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-3 text-gray-400" />
                            <select
                                value={data.tag}
                                onChange={(e) => setData("tag", e.target.value)}
                                className={`pl-10 w-full py-3 rounded-lg border bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                    errors.tag ? "border-red-500" : ""
                                }`}
                            >
                                <option value="">Select a category</option>
                                {[
                                    "Beach",
                                    "Mountain",
                                    "City",
                                    "Cultural",
                                    "Adventure",
                                    "Historical",
                                    "Wildlife",
                                ].map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.tag && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.tag}
                            </p>
                        )}
                    </div>
                )}
                {type !== "offer" && ( // Offers don't have direct rating/tag in card, but rating can be used
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            {isDestination ? "Category (Tag)" : "Rating"}
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
                                    errors[isDestination ? "tag" : "rating"]
                                        ? "border-red-500"
                                        : ""
                                }`}
                                placeholder={
                                    isDestination
                                        ? "Enter category (e.g., Beach, City)"
                                        : "Enter rating (0-5)"
                                }
                                step={isDestination ? undefined : "0.1"}
                                min={isDestination ? undefined : "0"}
                                max={isDestination ? undefined : "5"}
                            />
                        </div>
                        {errors[isDestination ? "tag" : "rating"] && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors[isDestination ? "tag" : "rating"]}
                            </p>
                        )}
                    </div>
                )}
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
                    {errors.image && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.image}
                        </p>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                    {(isDestination || isPackage) && (
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
                    )}
                    {(isOffer || isPackage) && (
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
        const isPackage = type === "package";
        const isBooking = type === "booking";

        if (items.length === 0) {
            return (
                <motion.div
                    variants={fadeIn}
                    className="col-span-full text-center py-16"
                >
                    <div className="max-w-md mx-auto">
                        <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <h3 className="text-2xl font-bold mb-2 text-white">
                            No {type.charAt(0).toUpperCase() + type.slice(1)}s
                            Found
                        </h3>
                        <p className="text-base mb-6 text-gray-400">
                            {isBooking
                                ? "There are no bookings to display."
                                : `Add new ${type}s to manage your offerings.`}
                        </p>
                    </div>
                </motion.div>
            );
        }

        return items.map((item) => {
            const entity = isBooking
                ? item.destination || item.offer || item.package
                : item;
            const itemTitle = isDestination ? item.name : item.title;
            const itemDescription = item.description;
            const itemPrice = parseFloat(item.price);
            const itemDiscountPrice = parseFloat(item.discount_price);
            const itemRating = item.rating || 0;
            const itemImage = entity?.image || defaultImage; // Use entity image for bookings, item image for others
            const displayTag = isDestination
                ? item.category
                : item.discount_type;

            return (
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
                            src={itemImage}
                            alt={itemTitle || "Image"}
                            className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                        />
                        {isBooking ? (
                            <span className="absolute top-3 right-3 px-3 py-1 bg-green-600 rounded-full text-xs font-medium text-white">
                                {item.status}
                            </span>
                        ) : (
                            <>
                                {displayTag && (
                                    <span className="absolute top-3 left-3 px-3 py-1 bg-blue-600 rounded-full text-xs font-medium text-white">
                                        {displayTag}
                                    </span>
                                )}
                                {calculateDiscount(
                                    itemPrice,
                                    itemDiscountPrice
                                ) !== null && (
                                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                        {calculateDiscount(
                                            itemPrice,
                                            itemDiscountPrice
                                        )}
                                        % OFF
                                    </div>
                                )}
                            </>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold line-clamp-1 text-white">
                                {itemTitle ||
                                    (isBooking &&
                                        (entity?.name || entity?.title)) ||
                                    "N/A"}
                            </h3>
                        </div>
                        {isBooking && item.user && (
                            <div className="flex items-center gap-2 mb-3">
                                <User
                                    size={16}
                                    className="text-blue-500 flex-shrink-0"
                                />
                                <span className="text-sm text-gray-300">
                                    {item.user?.name || "N/A"}
                                </span>
                            </div>
                        )}
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
                        {isBooking && (
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar size={16} className="text-blue-500" />
                                <span className="text-sm text-gray-300">
                                    {formatDate(item.check_in)} -{" "}
                                    {formatDate(item.check_out)}
                                </span>
                            </div>
                        )}
                        {isBooking && (
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-sm text-gray-300">
                                    Guests: {item.guests}
                                </span>
                            </div>
                        )}
                        {!isBooking && (
                            <div className="flex items-center gap-1 mb-4">
                                {renderStars(itemRating)}
                                <span className="text-sm ml-2 text-gray-400">
                                    ({itemRating}/5)
                                </span>
                            </div>
                        )}
                        {!isBooking && (
                            <p className="text-sm mb-4 line-clamp-2 text-gray-300">
                                {itemDescription || "No description available."}
                            </p>
                        )}
                        {(isOffer || isPackage) && item.end_date && (
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
                                        {isBooking
                                            ? "Total Price"
                                            : "Starting from"}
                                    </span>
                                    <div className="flex items-baseline gap-2">
                                        {item.discount_price && !isBooking ? (
                                            <>
                                                <span className="text-lg font-bold text-blue-500">
                                                    $
                                                    {parseFloat(
                                                        item.discount_price
                                                    ).toFixed(2)}
                                                </span>
                                                <span className="text-sm line-through text-gray-400">
                                                    $
                                                    {parseFloat(
                                                        item.price
                                                    ).toFixed(2)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-lg font-bold text-blue-500">
                                                $
                                                {parseFloat(
                                                    item.price ||
                                                        item.total_price ||
                                                        0
                                                ).toFixed(2)}
                                            </span>
                                        )}
                                        {!isBooking && (
                                            <span className="text-xs text-gray-400">
                                                / person
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {!isBooking && (
                                <>
                                    <div className="flex items-center space-x-2 mb-4">
                                        {(isDestination || isPackage) && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() =>
                                                    handleToggle(
                                                        item,
                                                        type,
                                                        "is_featured"
                                                    )
                                                }
                                                className="text-gray-400 hover:text-blue-500"
                                                title="Toggle Featured"
                                            >
                                                {item.is_featured ? (
                                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                                ) : (
                                                    <Star className="w-5 h-5" />
                                                )}
                                            </motion.button>
                                        )}
                                        {(isOffer ||
                                            isPackage ||
                                            isDestination) && (
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
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() =>
                                                openEditModal(item, type)
                                            }
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform group-hover:shadow-lg"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() =>
                                                openDeleteModal(item, type)
                                            }
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-base font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300 transform group-hover:shadow-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </motion.button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            );
        });
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
                                    placeholder={`Search ${activeTab}...`}
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
                                Showing{" "}
                                {activeTab === "bookings"
                                    ? filteredBookings.length
                                    : activeTab === "destinations"
                                    ? filteredDestinations.length
                                    : activeTab === "offers"
                                    ? filteredOffers.length
                                    : filteredPackages.length}{" "}
                                {activeTab}
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
                                renderCards(filteredBookings, "booking")}
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
                            {renderFormFields(showAddModal)}
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
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
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
                                onClick={() => setShowDeleteModal(false)}
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
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
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
