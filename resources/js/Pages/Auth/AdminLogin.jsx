import React, { useState, useEffect } from "react";
import { SunMedium, Moon, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { Head, Link, useForm } from "@inertiajs/react";

const AdminLoginPage = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    // Validation Functions
    const validateEmail = (email) => {
        if (!email) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
            return "Please enter a valid email address";
        if (email.length > 100) return "Email cannot exceed 100 characters";
        return null;
    };

    const validatePassword = (password) => {
        if (!password) return "Password is required";
        if (password.length < 8)
            return "Admin password must be at least 8 characters long";
        return null;
    };

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        setError,
        clearErrors,
    } = useForm({
        email: "",
        password: "",
        remember: true,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const validateForm = () => {
        const newErrors = {};
        const emailError = validateEmail(data.email);
        if (emailError) newErrors.email = emailError;
        const passwordError = validatePassword(data.password);
        if (passwordError) newErrors.password = passwordError;
        return newErrors;
    };

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        const validationErrors = validateForm();
        
        if (Object.keys(validationErrors).length > 0) {
            Object.keys(validationErrors).forEach((key) => {
                setError(key, validationErrors[key]);
            });
            return;
        }
        
        post(route("admin.login"));
    };

    return (
        <div className={`min-h-screen flex transition-colors duration-300 ${
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}>
            <Head title="Admin Login" />

            {/* Left Side */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12">
                <div className="flex items-center mb-8 animate-fade-in">
                    <Shield className="w-10 h-10 text-red-500 mr-3" />
                    <h1 className={`text-4xl font-bold ml-2 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                    }`}>
                        Admin <span className="text-red-500">Portal</span>
                    </h1>
                </div>
                <p className={`text-xl text-center max-w-md ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                    Secure administrative access for Travel Nest. 
                    Authorized personnel only.
                </p>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
                <div className={`w-full max-w-md p-8 rounded-xl shadow-lg transition-colors duration-300 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                }`}>
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center mb-8">
                        <Shield className="w-10 h-10 text-red-500 mr-3" />
                        <h1 className={`text-3xl font-bold ml-2 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                        }`}>
                            Admin <span className="text-red-500">Portal</span>
                        </h1>
                    </div>

                    <h2 className={`text-2xl font-bold mb-6 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                    }`}>
                        Administrator Login
                    </h2>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}>
                                Admin Email
                            </label>
                            <div className="relative">
                                <Mail className={`absolute left-3 top-3 w-5 h-5 ${
                                    isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`} />
                                <input
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    className={`pl-10 w-full p-3 rounded-lg border transition-colors focus:ring-2 focus:ring-red-500 ${
                                        isDarkMode
                                            ? "bg-gray-700 border-gray-600 text-white"
                                            : "bg-white border-gray-300 text-gray-900"
                                    } ${errors.email ? "border-red-500" : ""}`}
                                    placeholder="Enter admin email"
                                    autoComplete="username"
                                />
                            </div>
                            {errors.email && (
                                <span className="text-red-500 text-sm mt-1">
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}>
                                Admin Password
                            </label>
                            <div className="relative">
                                <Lock className={`absolute left-3 top-3 w-5 h-5 ${
                                    isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    className={`pl-10 w-full p-3 rounded-lg border transition-colors focus:ring-2 focus:ring-red-500 ${
                                        isDarkMode
                                            ? "bg-gray-700 border-gray-600 text-white"
                                            : "bg-white border-gray-300 text-gray-900"
                                    } ${errors.password ? "border-red-500" : ""}`}
                                    placeholder="Enter admin password"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3"
                                >
                                    {showPassword ? (
                                        <EyeOff className={`w-5 h-5 ${
                                            isDarkMode ? "text-gray-400" : "text-gray-500"
                                        }`} />
                                    ) : (
                                        <Eye className={`w-5 h-5 ${
                                            isDarkMode ? "text-gray-400" : "text-gray-500"
                                        }`} />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="text-red-500 text-sm mt-1">
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <Link
                                href={route("password.request")}
                                className={`text-sm font-medium hover:underline ${
                                    isDarkMode
                                        ? "text-red-400 hover:text-red-300"
                                        : "text-red-600 hover:text-red-700"
                                }`}
                            >
                                Reset admin credentials
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
                                isDarkMode
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-red-500 text-white hover:bg-red-600"
                            } ${processing && "opacity-50 cursor-not-allowed"}`}
                        >
                            Access Admin Panel
                        </button>

                        <p className={`text-center text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}>
                            Return to{" "}
                            <Link
                                href={route("login")}
                                className={`font-medium hover:underline ${
                                    isDarkMode
                                        ? "text-red-400 hover:text-red-300"
                                        : "text-red-600 hover:text-red-700"
                                }`}
                            >
                                user login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;