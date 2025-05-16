// resources/js/Pages/Auth/ConfirmPassword.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Home, LogIn, PhoneCall } from "lucide-react";
import { Head, Link, useForm } from "@inertiajs/react";

const ConfirmPassword = () => {
    const [notification, setNotification] = useState(null);

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
        password: "",
    });

    useEffect(() => {
        return () => reset("password");
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!data.password) newErrors.password = "Password is required";
        else if (data.password.length < 8)
            newErrors.password = "Password must be at least 8 characters";
        else if (data.password.length > 50)
            newErrors.password = "Password cannot exceed 50 characters";
        return newErrors;
    };

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            Object.entries(validationErrors).forEach(([key, message]) =>
                setError(key, message)
            );
            setNotification({
                type: "error",
                message: "Please enter a valid password.",
            });
            setTimeout(() => setNotification(null), 3000);
            return;
        }

        post(route("password.confirm"), {
            onSuccess: () => {
                setNotification({
                    type: "success",
                    message: "Password confirmed successfully!",
                });
                setTimeout(() => setNotification(null), 2000);
            },
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black relative">
            <Head title="Confirm Password - Travel Nest" />

            {/* Back to Home Button */}
            <Link
                href="/"
                className="fixed top-6 left-6 z-50 flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all"
            >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
            </Link>

            <Link
                href="/ContactPage"
                className="fixed top-20 left-6 z-50 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all"
            >
                <PhoneCall className="w-5 h-5" />
                <span className="font-medium">Contact Us</span>
            </Link>

            {/* Back to Login Button */}
            <Link
                href={route("login")}
                className="fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
            >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
            </Link>

            {/* Notification */}
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

            {/* Form */}
            <div className="w-full flex flex-col justify-center items-center p-6">
                <div className="w-full max-w-md p-8 rounded-xl shadow-xl bg-gray-800">
                    <h2 className="text-2xl font-bold mb-6 text-white">
                        Confirm Your Password
                    </h2>
                    <p className="mb-4 text-sm text-gray-400">
                        This is a secure area. Please confirm your password to
                        continue.
                    </p>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className={`pl-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 ${
                                        errors.password ? "border-red-500" : ""
                                    }`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {processing ? "Confirming..." : "Confirm"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPassword;
