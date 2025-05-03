import React, { useState, useEffect } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    ChevronLeft,
    Calendar,
    Image as ImageIcon,
    X,
    Star,
    DollarSign,
    Tag,
    Save,
    Info,
} from "lucide-react";
import AdminSidebar from "@/Components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

export default function CreatePackage() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        subtitle: "",
        description: "",
        price: "",
        discount_price: "",
        discount_type: "percentage",
        start_date: "",
        end_date: "",
        image: null,
        rating: 0,
        is_featured: false,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [charCount, setCharCount] = useState(0);

    // Handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData("image", file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    // Calculate discount percentage
    const calculateSavings = () => {
        if (!data.price || !data.discount_price) return null;

        const original = parseFloat(data.price);
        const discounted = parseFloat(data.discount_price);

        if (isNaN(original) || isNaN(discounted) || original <= discounted)
            return null;

        const savings = original - discounted;
        const percentage = Math.round((savings / original) * 100);

        return {
            amount: savings.toFixed(2),
            percentage: percentage,
        };
    };

    // Handle form validation
    const validateForm = () => {
        const errors = {};

        if (!data.title) errors.title = "Title is required";
        else if (data.title.length < 3)
            errors.title = "Title must be at least 3 characters";

        if (!data.subtitle) errors.subtitle = "Subtitle is required";
        else if (data.subtitle.length < 3)
            errors.subtitle = "Subtitle must be at least 3 characters";

        if (!data.description) errors.description = "Description is required";
        else if (data.description.length < 10)
            errors.description = "Description must be at least 10 characters";

        if (!data.price) errors.price = "Price is required";
        else if (isNaN(parseFloat(data.price)) || parseFloat(data.price) <= 0)
            errors.price = "Price must be a positive number";

        if (
            data.discount_price &&
            (isNaN(parseFloat(data.discount_price)) ||
                parseFloat(data.discount_price) <= 0 ||
                parseFloat(data.discount_price) >= parseFloat(data.price))
        ) {
            errors.discount_price =
                "Discount price must be a positive number less than the regular price";
        }

        if (!data.start_date) errors.start_date = "Start date is required";
        if (!data.end_date) errors.end_date = "End date is required";

        if (data.start_date && data.end_date) {
            const start = new Date(data.start_date);
            const end = new Date(data.end_date);
            if (end <= start)
                errors.end_date = "End date must be after start date";
        }

        if (!data.image) errors.image = "Package image is required";

        if (
            data.rating &&
            (isNaN(parseFloat(data.rating)) ||
                parseFloat(data.rating) < 0 ||
                parseFloat(data.rating) > 5)
        ) {
            errors.rating = "Rating must be between 0 and 5";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the form errors before submitting");
            return;
        }

        post(route("admin.packages.store"), {
            forceFormData: true,
            onSuccess: () => {
                toast.success("Package created successfully!");
                reset();
                setImagePreview(null);
                // Redirect with a small delay to ensure the toast is seen
                setTimeout(() => {
                    window.location.href = route("admin.packages.index");
                }, 1500);
            },
            onError: (errors) => {
                toast.error(
                    "Failed to create package. Please check the form for errors."
                );
                console.error(errors);
            },
        });
    };

    // Remove image
    const removeImage = () => {
        setData("image", null);
        setImagePreview(null);
    };

    // Update character count for description
    useEffect(() => {
        setCharCount(data.description.length);
    }, [data.description]);

    const savings = calculateSavings();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <Head title="Create Package - Travel Nest Admin" />
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
                                Create New Package
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 bg-opacity-50 rounded-lg shadow-lg p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Basic Info */}
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium text-gray-400 mb-1"
                                    >
                                        Package Title{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        className="w-full p-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter package title"
                                    />
                                    {(errors.title ||
                                        validationErrors.title) && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.title ||
                                                validationErrors.title}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="subtitle"
                                        className="block text-sm font-medium text-gray-400 mb-1"
                                    >
                                        Subtitle{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="subtitle"
                                        value={data.subtitle}
                                        onChange={(e) =>
                                            setData("subtitle", e.target.value)
                                        }
                                        className="w-full p-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter a brief subtitle"
                                    />
                                    {(errors.subtitle ||
                                        validationErrors.subtitle) && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.subtitle ||
                                                validationErrors.subtitle}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-400 mb-1"
                                    >
                                        Description{" "}
                                        <span className="text-red-500">*</span>
                                        <span className="text-gray-500 text-xs ml-2">
                                            ({charCount} characters)
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
                                        rows="8"
                                        className="w-full p-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter detailed package description"
                                    ></textarea>
                                    {(errors.description ||
                                        validationErrors.description) && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.description ||
                                                validationErrors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="start_date"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            Start Date{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                            <input
                                                type="date"
                                                id="start_date"
                                                value={data.start_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "start_date",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full pl-10 p-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        {(errors.start_date ||
                                            validationErrors.start_date) && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.start_date ||
                                                    validationErrors.start_date}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="end_date"
                                            className="block text-sm font-medium text-gray-400 mb-1"
                                        >
                                            End Date{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                            <input
                                                type="date"
                                                id="end_date"
                                                value={data.end_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "end_date",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full pl-10 p-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        {(errors.end_date ||
                                            validationErrors.end_date) && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.end_date ||
                                                    validationErrors.end_date}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Images, Pricing, Features */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        Package Image{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 bg-gray-700 bg-opacity-50">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Package preview"
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-48">
                                                <ImageIcon className="w-12 h-12 text-gray-500 mb-2" />
                                                <p className="text-sm text-gray-400 mb-2">
                                                    Upload package image
                                                </p>
                                                <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                                                    <span>Select Image</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={
                                                            handleImageChange
                                                        }
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                    {(errors.image ||
                                        validationErrors.image) && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.image ||
                                                validationErrors.image}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="price"
                                        className="block text-sm font-medium text-gray-400 mb-1"
                                    >
                                        Price{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                        <input
                                            type="number"
                                            id="price"
                                            value={data.price}
                                            onChange={(e) =>
                                                setData("price", e.target.value)
                                            }
                                            className="w-full pl-10 p-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {(errors.price ||
                                        validationErrors.price) && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.price ||
                                                validationErrors.price}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="discount_price"
                                        className="block text-sm font-medium text-gray-400 mb-1"
                                    >
                                        Discount Price{" "}
                                        <span className="text-gray-500 text-xs">
                                            (optional)
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
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
                                            className="w-full pl-10 p-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {(errors.discount_price ||
                                        validationErrors.discount_price) && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.discount_price ||
                                                validationErrors.discount_price}
                                        </p>
                                    )}

                                    {savings && (
                                        <div className="mt-2 flex items-center text-green-400 text-sm">
                                            <Info className="w-4 h-4 mr-1" />
                                            <span>
                                                Save ${savings.amount} (
                                                {savings.percentage}%)
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="rating"
                                        className="block text-sm font-medium text-gray-400 mb-1"
                                    >
                                        Rating{" "}
                                        <span className="text-gray-500 text-xs">
                                            (0-5)
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <Star className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
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
                                            className="w-full pl-10 p-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                            placeholder="0.0"
                                        />
                                    </div>
                                    {(errors.rating ||
                                        validationErrors.rating) && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.rating ||
                                                validationErrors.rating}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center mt-2">
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
                                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="is_featured"
                                        className="ml-2 text-sm font-medium text-gray-300"
                                    >
                                        Featured Package
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <Save className="w-5 h-5 mr-1" />
                                {processing ? "Creating..." : "Create Package"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
