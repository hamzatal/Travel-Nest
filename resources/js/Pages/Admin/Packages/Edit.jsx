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

export default function EditPackage({ package: packageData }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: packageData.title || "",
        subtitle: packageData.subtitle || "",
        description: packageData.description || "",
        price: packageData.price || "",
        discount_price: packageData.discount_price || "",
        discount_type: packageData.discount_type || "percentage",
        start_date: packageData.start_date || "",
        end_date: packageData.end_date || "",
        image: null,
        _method: "PUT",
        rating: packageData.rating || 0,
        is_featured: packageData.is_featured || false,
    });

    const [imagePreview, setImagePreview] = useState(
        packageData.image_url || null
    );
    const [validationErrors, setValidationErrors] = useState({});
    const [charCount, setCharCount] = useState(
        packageData.description ? packageData.description.length : 0
    );

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

        post(route("admin.packages.update", packageData.id), {
            forceFormData: true,
            onSuccess: () => {
                toast.success("Package updated successfully!");
                // Redirect with a small delay to ensure the toast is seen
                setTimeout(() => {
                    window.location.href = route("admin.packages.index");
                }, 1500);
            },
            onError: (errors) => {
                toast.error(
                    "Failed to update package. Please check the form for errors."
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
            <Head
                title={`Edit Package: ${packageData.title} - Travel Nest Admin`}
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
                                Edit Package: {packageData.title}
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
                                        placeholder="Enter package description"
                                    />
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
                                            <Calendar className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
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
                                                className="w-full p-2 pl-8 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                            <Calendar className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
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
                                                className="w-full p-2 pl-8 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                            {/* Right Column - Image & Pricing */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Package Image
                                    </label>
                                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 bg-gray-700 bg-opacity-50">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Package preview"
                                                    className="w-full h-44 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-44">
                                                <ImageIcon className="w-12 h-12 text-gray-500 mb-2" />
                                                <p className="text-gray-400 text-sm mb-2">
                                                    Drop your image here, or
                                                    browse
                                                </p>
                                                <label className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm cursor-pointer transition-colors">
                                                    Upload Image
                                                    <input
                                                        type="file"
                                                        onChange={
                                                            handleImageChange
                                                        }
                                                        className="hidden"
                                                        accept="image/*"
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                    {errors.image && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.image}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="price"
                                        className="block text-sm font-medium text-gray-400 mb-1"
                                    >
                                        Regular Price{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
                                        <input
                                            type="number"
                                            id="price"
                                            value={data.price}
                                            onChange={(e) =>
                                                setData("price", e.target.value)
                                            }
                                            min="0"
                                            step="0.01"
                                            className="w-full p-2 pl-8 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        Discount Price
                                    </label>
                                    <div className="relative">
                                        <Tag className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
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
                                            min="0"
                                            step="0.01"
                                            className="w-full p-2 pl-8 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        <div className="mt-2 text-sm text-emerald-400">
                                            <p>
                                                Savings: ${savings.amount} (
                                                {savings.percentage}% off)
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="rating"
                                        className="block text-sm font-medium text-gray-400 mb-1"
                                    >
                                        Rating (0-5)
                                    </label>
                                    <div className="relative">
                                        <Star className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
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
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            className="w-full p-2 pl-8 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                                <div className="flex items-center">
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
                                        className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="is_featured"
                                        className="ml-2 text-sm font-medium text-gray-400"
                                    >
                                        Featured Package
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Link
                                href={route("admin.packages.index")}
                                className="px-4 py-2 text-gray-300 hover:text-white transition-colors mr-4"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? "Saving..." : "Update Package"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-4 p-4 bg-blue-900 bg-opacity-30 rounded-lg flex items-start">
                    <Info className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-200">
                        <p>
                            Make sure all details are accurate before updating.
                            All fields marked with{" "}
                            <span className="text-red-500">*</span> are
                            required.
                        </p>
                        <p className="mt-1">
                            For best results, use high-quality images with a
                            16:9 aspect ratio.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
