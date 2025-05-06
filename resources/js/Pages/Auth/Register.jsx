import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    Home,
    Building2,
    ChevronRight,
} from "lucide-react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [accountType, setAccountType] = useState("user");

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
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "user",
    });

    useEffect(() => {
        return () => reset("password", "password_confirmation");
    }, []);

    useEffect(() => {
        setData("role", accountType);
    }, [accountType]);

    // Validation Functions
    const validateName = (name) => {
        if (!name) return "Name is required";
        if (name.length < 2) return "Name must be at least 2 characters long";
        if (name.length > 50) return "Name cannot exceed 50 characters";
        if (!/^[a-zA-Z\s'-]+$/.test(name))
            return "Name can only contain letters, spaces, hyphens, and apostrophes";
        return null;
    };

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
            return "Password must be at least 8 characters long";
        if (password.length > 64) return "Password cannot exceed 64 characters";
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        if (!hasUpperCase)
            return "Password must contain at least one uppercase letter";
        if (!hasLowerCase)
            return "Password must contain at least one lowercase letter";
        if (!hasNumbers) return "Password must contain at least one number";
        if (!hasSpecialChar)
            return "Password must contain at least one special character";
        const commonPasswords = [
            "password",
            "123456",
            "qwerty",
            "admin",
            "letmein",
            "welcome",
            "monkey",
            "password1",
            "12345678",
        ];
        if (commonPasswords.includes(password.toLowerCase())) {
            return "This password is too common. Please choose a stronger password.";
        }
        return null;
    };

    const validateConfirmPassword = (password, confirmPassword) => {
        if (!confirmPassword) return "Please confirm your password";
        if (password !== confirmPassword) return "Passwords do not match";
        return null;
    };

    const validate = () => {
        const newErrors = {};
        if (currentStep === 1) {
            if (!accountType) newErrors.role = "Please select an account type";
        }
        if (currentStep === 2) {
            const nameError = validateName(data.name);
            if (nameError) newErrors.name = nameError;
            const emailError = validateEmail(data.email);
            if (emailError) newErrors.email = emailError;
        }
        if (currentStep === 3) {
            const passwordError = validatePassword(data.password);
            if (passwordError) newErrors.password = passwordError;
            const confirmPasswordError = validateConfirmPassword(
                data.password,
                data.password_confirmation
            );
            if (confirmPasswordError)
                newErrors.password_confirmation = confirmPasswordError;
        }
        return newErrors;
    };

    const handleNextStep = () => {
        clearErrors();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            Object.entries(validationErrors).forEach(([key, message]) =>
                setError(key, message)
            );
            setNotification({
                type: "error",
                message: "Please fix the errors below.",
            });
            setTimeout(() => setNotification(null), 3000);
            return;
        }
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        clearErrors();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            Object.entries(validationErrors).forEach(([key, message]) =>
                setError(key, message)
            );
            setNotification({
                type: "error",
                message: "Please fix the errors below.",
            });
            setTimeout(() => setNotification(null), 3000);
            return;
        }
        post(route("register"), {
            onSuccess: () => {
                setNotification({
                    type: "success",
                    message:
                        data.role === "admin"
                            ? "Admin registration successful! Redirecting to dashboard..."
                            : "Registration successful! Please verify your email.",
                });
                setTimeout(() => setNotification(null), 2000);
            },
            onError: (errors) => {
                setNotification({
                    type: "error",
                    message:
                        errors.email ||
                        "Registration failed. Please try again.",
                });
                setTimeout(() => setNotification(null), 3000);
            },
        });
    };

    const renderStepIndicator = () => {
        return (
            <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-2">
                    {[1, 2, 3].map((step) => (
                        <React.Fragment key={step}>
                            <div
                                className={`rounded-full h-10 w-10 flex items-center justify-center font-medium
                                    ${
                                        currentStep === step
                                            ? "bg-green-600 text-white"
                                            : currentStep > step
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-700 text-gray-300"
                                    }`}
                            >
                                {step}
                            </div>
                            {step < 3 && (
                                <ChevronRight
                                    className={`w-5 h-5 ${
                                        currentStep > step
                                            ? "text-green-500"
                                            : "text-gray-500"
                                    }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white">
                                Choose Account Type
                            </h3>
                            <p className="text-sm text-gray-400 mt-2">
                                Select the type of account you want to create
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className={`p-6 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center ${
                                    accountType === "user"
                                        ? "border-green-500 bg-green-600/20"
                                        : "border-gray-700 bg-gray-800/50 hover:border-gray-500"
                                }`}
                                onClick={() => setAccountType("user")}
                            >
                                <User
                                    className={`w-12 h-12 mb-4 ${
                                        accountType === "user"
                                            ? "text-green-400"
                                            : "text-gray-400"
                                    }`}
                                />
                                <h4 className="text-lg font-medium text-white">
                                    Individual
                                </h4>
                                <p className="text-sm text-gray-400 text-center mt-2">
                                    For personal travel and experiences
                                </p>
                            </div>
                            <div
                                className={`p-6 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center ${
                                    accountType === "admin"
                                        ? "border-green-500 bg-green-600/20"
                                        : "border-gray-700 bg-gray-800/50 hover:border-gray-500"
                                }`}
                                onClick={() => setAccountType("admin")}
                            >
                                <Building2
                                    className={`w-12 h-12 mb-4 ${
                                        accountType === "admin"
                                            ? "text-green-400"
                                            : "text-gray-400"
                                    }`}
                                />
                                <h4 className="text-lg font-medium text-white">
                                    Admin
                                </h4>
                                <p className="text-sm text-gray-400 text-center mt-2">
                                    For managing travel services
                                </p>
                            </div>
                        </div>
                        {errors.role && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.role}
                            </p>
                        )}
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white">
                                Personal Information
                            </h3>
                            <p className="text-sm text-gray-400 mt-2">
                                Tell us who you are
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className={`pl-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                                        errors.name ? "border-red-500" : ""
                                    }`}
                                    placeholder="Your Name"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name}
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
                                        setData("email", e.target.value)
                                    }
                                    className={`pl-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                                        errors.email ? "border-red-500" : ""
                                    }`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white">
                                Set Password
                            </h3>
                            <p className="text-sm text-gray-400 mt-2">
                                Create a secure password for your account
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className={`pl-10 pr-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                                        errors.password ? "border-red-500" : ""
                                    }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 pr-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                                        errors.password_confirmation
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderStepButtons = () => {
        return (
            <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                    <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all"
                    >
                        Back
                    </button>
                ) : (
                    <div></div>
                )}
                <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all disabled:opacity-50 flex items-center space-x-2"
                    disabled={processing}
                >
                    <span>
                        {currentStep === 3
                            ? processing
                                ? "Creating Account..."
                                : "Complete Registration"
                            : "Next"}
                    </span>
                    {currentStep < 3 && <ChevronRight className="w-5 h-5" />}
                </button>
            </div>
        );
    };

    return (
        <div
            className="min-h-screen flex bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: "url('/images/world.svg')" }}
        >
            <Head title="Register - Travel Nest" />
            <Link
                href="/"
                className="fixed top-6 left-6 z-50 flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all"
            >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
            </Link>
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white ${
                            notification.type === "success"
                                ? "bg-green-600"
                                : "bg-red-600"
                        }`}
                    >
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="hidden lg:flex w-1/2 items-center justify-center p-12">
                <div className="text-center space-y-8">
                    <div className="bg-green-600/20 p-6 rounded-full inline-block mx-auto">
                        {accountType === "admin" ? (
                            <Building2 className="w-20 h-20 text-green-500" />
                        ) : (
                            <User className="w-20 h-20 text-green-500" />
                        )}
                    </div>
                    <h1 className="text-5xl font-bold text-white">
                        Join <span className="text-green-500">Travel Nest</span>
                    </h1>
                    <p className="text-gray-300 max-w-md mx-auto text-lg">
                        {accountType === "admin"
                            ? "Create a business account to showcase your services and connect with travelers around the world."
                            : "Create an account to start planning your next adventure. Discover new destinations and explore the world with us."}
                    </p>
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6">
                <div className="w-full max-w-md p-8 rounded-xl shadow-xl bg-gray-800/90 backdrop-blur-sm">
                    {renderStepIndicator()}
                    {renderStepContent()}
                    {renderStepButtons()}
                    <p className="text-center text-sm text-gray-400 mt-6">
                        Already have an account?{" "}
                        <Link
                            href={route("login")}
                            className="text-green-400 font-medium hover:text-green-300 hover:underline transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
