import React, { useState } from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react"; // Added Link
import {
    User,
    Building2,
    Key,
    Mail,
    Save,
    Home,
    Phone,
    Globe,
    MapPin,
    Shield,
    LogOut,
    Menu, // Keep Menu/X if NavBar component exposes mobile state control, otherwise might remove
    X,
    ChevronRight, // Keep ChevronRight if used elsewhere or remove if only in old breadcrumbs
    Facebook, // Keep social icons if Footer uses them, otherwise remove
    Twitter,
    Instagram,
    Linkedin,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion"; // Added framer-motion imports

// استيراد مكونات Navbar و Footer
import NavBar from "../../Components/Nav";
import Footer from "../../Components/Footer";

export default function CompanyProfile() {
    const { props } = usePage();
    const { company } = props;
    // Removed mobileMenuOpen state - assumed handled by NavBar
    // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: company.name || "",
        company_name: company.company_name || "",
        license_number: company.license_number || "",
        email: company.email || "",
        // Add other fields if they exist in company data and you want to edit them
        // phone: company.phone || "",
        // address: company.address || "",
        // website: company.website || "",
    });

    const [validationErrors, setValidationErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        if (!data.name) errors.name = "Contact person name is required";
        if (!data.company_name)
            errors.company_name = "Company name is required";
        if (!data.license_number)
            errors.license_number = "License number is required";
        if (!data.email) errors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
            errors.email = "Invalid email format";
        // Add validation for other fields if included
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fix the form errors.");
            return;
        }
        // Assuming 'company.profile.update' is the correct route name for PUT request
        put(route("company.profile.update"), {
            onSuccess: () => {
                toast.success("Profile updated successfully!");
                // Optionally reset validation errors on success
                setValidationErrors({});
            },
            onError: (errors) => {
                // Inertia errors object usually has message under 'field_name'
                setValidationErrors(errors);
                toast.error("Failed to update profile.");
            },
        });
    };

    // Tabs functionality
    const [activeTab, setActiveTab] = useState("profile");

    // Function to render content based on active tab (optional but good practice)
    // For simplicity, we will only show the profile form for now,
    // and add comments where other tab content would go.

    return (
        // Updated background gradient to match the Contact page slightly
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transition-all duration-300 relative">
            <Head title="Company Profile - Travel Nest" />
            <Toaster position="top-right" />

            {/* Navbar Component */}
            <NavBar isDarkMode={true} />

            {/* Home Button (Optional - copied from Contact page style) */}
            {/* You might remove this if your NavBar already has navigation */}
            {/* <Link
                 href={route('dashboard')} // Update to your actual dashboard route
                 className="fixed top-6 left-6 z-50 flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all"
             >
                 <Home className="w-5 h-5" />
                 <span className="font-medium">Dashboard</span>
             </Link> */}

            {/* Hero Section (Copied from Contact page, adapted for Company Profile) */}
            <div className="relative h-64 md:h-80 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
                {/* Replace with a company-themed background image if available, otherwise keep world map */}
                <div className="absolute inset-0 bg-[url('/images/world.svg')] bg-no-repeat bg-center opacity-30 bg-cover"></div>{" "}
                {/* Used bg-cover instead of bg-fill */}
                <div className="relative z-10 text-center px-4">
                    {" "}
                    {/* Added relative z-10 */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-5xl md:text-6xl font-extrabold mb-2 leading-tight" // Adjusted text size for better fit
                    >
                        Company <span className="text-green-400">Profile</span>
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                    >
                        {/* Optional subtitle */}
                        <p className="text-xl text-gray-300 mb-4">
                            Manage your company information
                        </p>
                        <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
                    </motion.div>
                </div>
            </div>
            {/* End Hero Section */}

            {/* Main Content */}
            {/* Removed pt-24 as Hero provides space. Added py-10 to inner container */}
            <main className="pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {" "}
                    {/* py-10 added here */}
                    {/* Removed original Breadcrumbs */}
                    {/* Removed original Page Header (h1, p, save button) */}
                    {/* The Save button is now placed here, before the tabs, as it applies to the form content below */}
                    <div className="flex justify-end mb-0">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 shadow-lg transition-all"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {processing ? "Saving..." : "Save Profile"}
                        </button>
                    </div>
                    {/* Tabs */}
                    <div className="border-b border-gray-700 mb-8">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`py-4 px-6 font-medium flex items-center transition-all ${
                                    activeTab === "profile"
                                        ? "border-b-2 border-green-500 text-green-500"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <Building2 className="w-5 h-5 mr-2" />
                                Profile
                            </button>
                          
                            <button
                                onClick={() => setActiveTab("settings")}
                                className={`py-4 px-6 font-medium flex items-center transition-all ${
                                    activeTab === "settings"
                                        ? "border-b-2 border-green-500 text-green-500"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <Shield className="w-5 h-5 mr-2" />
                                Settings
                            </button>
                        </nav>
                    </div>
                    {/* Main Content Area - Conditional Rendering Based on Tab */}
                    {activeTab === "profile" && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Company Logo & Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                                    <div className="flex flex-col items-center text-center mb-6">
                                        <div className="h-32 w-32 mb-4 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-green-600">
                                            <Building2 className="h-16 w-16 text-green-500" />
                                        </div>
                                        <h2 className="text-xl font-bold">
                                            {data.company_name ||
                                                "Your Company"}
                                        </h2>
                                        <p className="text-gray-400 mt-1">
                                            Tourism & Travel Agency{" "}
                                            {/* This should ideally be dynamic */}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-gray-700">
                                        <div className="flex items-center mb-4">
                                            <Shield className="h-5 w-5 text-green-500 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-400">
                                                    License Number
                                                </p>
                                                <p className="font-medium">
                                                    {data.license_number ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center mb-4">
                                            <User className="h-5 w-5 text-green-500 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-400">
                                                    Contact Person
                                                </p>
                                                <p className="font-medium">
                                                    {data.name ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Mail className="h-5 w-5 text-green-500 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-400">
                                                    Email Address
                                                </p>
                                                <p className="font-medium">
                                                    {data.email ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Placeholder for other contact info display */}
                                        {/* <div className="flex items-center mt-4">...</div> */}
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-700">
                                        <h3 className="text-md font-semibold mb-3">
                                            Company Status
                                        </h3>
                                        <div className="bg-green-900 bg-opacity-30 text-green-400 py-2 px-3 rounded-md flex items-center">
                                            <Shield className="h-5 w-5 mr-2" />
                                            Active & Verified{" "}
                                            {/* This should come from company data */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="lg:col-span-2">
                                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                                    {/* The form itself */}
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Contact Person Name
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`pl-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                                                        validationErrors.name ||
                                                        errors.name
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    placeholder="Enter contact person name"
                                                />
                                            </div>
                                            {(validationErrors.name ||
                                                errors.name) && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {validationErrors.name ||
                                                        errors.name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Company Name
                                            </label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.company_name}
                                                    onChange={(e) =>
                                                        setData(
                                                            "company_name",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`pl-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                                                        validationErrors.company_name ||
                                                        errors.company_name
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    placeholder="Enter company name"
                                                />
                                            </div>
                                            {(validationErrors.company_name ||
                                                errors.company_name) && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {validationErrors.company_name ||
                                                        errors.company_name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                License Number
                                            </label>
                                            <div className="relative">
                                                <Key className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.license_number}
                                                    onChange={(e) =>
                                                        setData(
                                                            "license_number",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`pl-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                                                        validationErrors.license_number ||
                                                        errors.license_number
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    placeholder="Enter license number"
                                                />
                                            </div>
                                            {(validationErrors.license_number ||
                                                errors.license_number) && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {validationErrors.license_number ||
                                                        errors.license_number}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`pl-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                                                        validationErrors.email ||
                                                        errors.email
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    placeholder="Enter email address"
                                                />
                                            </div>
                                            {(validationErrors.email ||
                                                errors.email) && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {validationErrors.email ||
                                                        errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Add other form fields (phone, address, website) here if needed */}
                                        {/* Example:
                                        <div>
                                             <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                                             <input type="tel" ... />
                                             {errors.phone && (<p>...</p>)}
                                        </div>
                                         */}

                                        {/* The Save button is now outside the form element */}
                                        {/* If you prefer it inside, move the button here and change its type to "submit" */}
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Content for Contacts tab would go here */}
                    {activeTab === "contacts" && (
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                            <h2 className="text-xl font-bold text-white mb-4">
                                Contact Information
                            </h2>
                            {/* Add form fields or display for contact info */}
                            <p className="text-gray-400">
                                Contact details form/display...
                            </p>
                            {/* Example:
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                <input type="tel" className="w-full bg-gray-700 border..." />
                              </div>
                             */}
                        </div>
                    )}
                    {/* Content for Settings tab would go here */}
                    {activeTab === "settings" && (
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                            <h2 className="text-xl font-bold text-white mb-4">
                                Account Settings
                            </h2>
                            {/* Add settings options like change password (similar to UserProfile security tab) */}
                            <p className="text-gray-400">
                                Settings options form/display...
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer Component */}
            <Footer />
        </div>
    );
}
