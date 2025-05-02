import React, { useState, useRef } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import AdminSidebar from "@/Components/AdminSidebar";
import {
    CheckCircle,
    XCircle,
    User,
    Mail,
    Camera,
    Calendar,
    Save,
} from "lucide-react";

export default function AdminProfile() {
    const { props } = usePage();
    const { admin, flash } = props;
    const [avatarPreview, setAvatarPreview] = useState(
        admin?.avatar ? `/storage/avatars/${admin.avatar}` : null
    );
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        name: admin?.name || "",
        email: admin?.email || "",
        avatar: null,
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("avatar", file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.profile.update"), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setAvatarPreview(null);
                fileInputRef.current.value = null;
            },
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
            <Head title="Admin Profile - Travel Nest Admin" />

            <div className="ml-64 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold text-blue-400">
                            Admin Profile
                        </h1>
                    </div>

                    {/* Flash Messages */}
                    {flash.success && (
                        <div className="bg-green-600/20 border border-green-500 text-green-200 px-4 py-3 rounded mb-6 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div className="bg-red-600/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6 flex items-center">
                            <XCircle className="w-5 h-5 mr-2" />
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-2xl p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Avatar Section */}
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Avatar Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : admin?.avatar ? (
                                            <img
                                                src={`/storage/avatars/${admin.avatar}`}
                                                alt={admin.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-4xl font-medium text-gray-400">
                                                {admin?.name
                                                    ?.charAt(0)
                                                    .toUpperCase() || "A"}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current.click()
                                        }
                                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                                    >
                                        <Camera className="w-5 h-5" />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleAvatarChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                                {errors.avatar && (
                                    <span className="text-red-500 text-sm mt-2 block">
                                        {errors.avatar}
                                    </span>
                                )}
                            </div>

                            {/* Profile Info and Form */}
                            <div className="flex-1">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* Editable Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-medium text-gray-300 mb-2"
                                            >
                                                Name
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`pl-10 w-full p-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                                        errors.name
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    placeholder="Admin Name"
                                                />
                                            </div>
                                            {errors.name && (
                                                <span className="text-red-500 text-sm mt-1">
                                                    {errors.name}
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-300 mb-2"
                                            >
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`pl-10 w-full p-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                                        errors.email
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    placeholder="admin@example.com"
                                                />
                                            </div>
                                            {errors.email && (
                                                <span className="text-red-500 text-sm mt-1">
                                                    {errors.email}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Read-only Fields */}
                                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                ID
                                            </label>
                                            <input
                                                type="text"
                                                value={admin?.id || "N/A"}
                                                disabled
                                                className="w-full p-3 rounded-lg border bg-gray-700 text-gray-400 border-gray-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Last Login
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={
                                                        admin?.last_login
                                                            ? new Date(
                                                                  admin.last_login
                                                              ).toLocaleString()
                                                            : "N/A"
                                                    }
                                                    disabled
                                                    className="pl-10 w-full p-3 rounded-lg border bg-gray-700 text-gray-400 border-gray-600"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Created At
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={
                                                        admin?.created_at
                                                            ? new Date(
                                                                  admin.created_at
                                                              ).toLocaleString()
                                                            : "N/A"
                                                    }
                                                    disabled
                                                    className="pl-10 w-full p-3 rounded-lg border bg-gray-700 text-gray-400 border-gray-600"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Updated At
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={
                                                        admin?.updated_at
                                                            ? new Date(
                                                                  admin.updated_at
                                                              ).toLocaleString()
                                                            : "N/A"
                                                    }
                                                    disabled
                                                    className="pl-10 w-full p-3 rounded-lg border bg-gray-700 text-gray-400 border-gray-600"
                                                />
                                            </div>
                                        </div>
                                    </div> */}

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full md:w-auto px-6 py-3 mt-6 flex items-center justify-center bg-blue-600 text-white rounded-lg font-medium transition-all hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        <Save className="w-5 h-5 mr-2" />
                                        {processing
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AdminSidebar />
        </div>
    );
}
