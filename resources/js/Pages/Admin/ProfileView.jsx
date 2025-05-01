import React, { useState, useEffect } from 'react';
import { Save, User, Mail, Lock, Camera } from 'lucide-react';
import Swal from 'sweetalert2';
import { Head, usePage } from '@inertiajs/react';

const ProfileView = () => {
    const { props } = usePage();
    const { csrf_token } = props;

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        avatar: '',
        currentPassword: '',
        newPassword: '',
        newPassword_confirmation: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/admin/profile');
            if (!response.ok) throw new Error('Failed to fetch profile');
            const data = await response.json();
            setProfileData(prevData => ({
                ...prevData,
                name: data.name,
                email: data.email,
                avatar: data.avatar,
            }));
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load profile data',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', profileData.name);
        formData.append('email', profileData.email);
        formData.append('currentPassword', profileData.currentPassword);
        formData.append('newPassword', profileData.newPassword);
        formData.append('newPassword_confirmation', profileData.newPassword_confirmation);
        if (file) {
            formData.append('avatar', file);
        }
        formData.append('_method', 'PUT'); // Spoof PUT request

        try {
            const response = await fetch('/admin/profile', {
                method: 'POST', // Laravel expects POST with _method=PUT
                headers: {
                    'X-CSRF-TOKEN': csrf_token,
                },
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update profile');
            }

            const data = await response.json();
            setProfileData(prevData => ({
                ...prevData,
                name: data.name,
                email: data.email,
                avatar: data.avatar,
                currentPassword: '',
                newPassword: '',
                newPassword_confirmation: '',
            }));
            setFile(null);
            setAvatarPreview(null);
            setIsEditing(false);
            setShowPasswordFields(false);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: data.message || 'Profile updated successfully!',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to update profile',
            });
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const previewUrl = URL.createObjectURL(selectedFile);
            setAvatarPreview(previewUrl);
        } else {
            setAvatarPreview(null);
        }
    };

    if (loading) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <Head title="Admin Profile - Travel Nest" />
            <div className="p-6 ml-64">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-gray-800 rounded-lg shadow">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-white">Admin Profile</h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex justify-center mb-6">
                                    <div className="relative w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Avatar Preview"
                                                className="w-32 h-32 rounded-full object-cover"
                                            />
                                        ) : profileData.avatar ? (
                                            <img
                                                src={profileData.avatar}
                                                alt="User Avatar"
                                                className="w-32 h-32 rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-16 h-16 text-gray-400" />
                                        )}
                                        {isEditing && (
                                            <label
                                                htmlFor="avatar"
                                                className="absolute bottom-0 right-0 bg-gray-700 text-white rounded-full p-1 cursor-pointer"
                                            >
                                                <Camera className="w-6 h-6" />
                                            </label>
                                        )}
                                        <input
                                            type="file"
                                            id="avatar"
                                            name="avatar"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) =>
                                                    setProfileData({ ...profileData, name: e.target.value })
                                                }
                                                disabled={!isEditing}
                                                className="w-full p-2 bg-gray-700 rounded-lg text-white disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) =>
                                                    setProfileData({ ...profileData, email: e.target.value })
                                                }
                                                disabled={!isEditing}
                                                className="w-full p-2 bg-gray-700 rounded-lg text-white disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="mt-6">
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswordFields(!showPasswordFields)}
                                                className="text-red-400 hover:text-red-300 flex items-center space-x-2"
                                            >
                                                <Lock className="w-4 h-4" />
                                                <span>
                                                    {showPasswordFields ? 'Hide' : 'Change'} Password
                                                </span>
                                            </button>

                                            {showPasswordFields && (
                                                <div className="mt-4 space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                                            Current Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            value={profileData.currentPassword}
                                                            onChange={(e) =>
                                                                setProfileData({
                                                                    ...profileData,
                                                                    currentPassword: e.target.value,
                                                                })
                                                            }
                                                            className="w-full p-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                                            New Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            value={profileData.newPassword}
                                                            onChange={(e) =>
                                                                setProfileData({
                                                                    ...profileData,
                                                                    newPassword: e.target.value,
                                                                })
                                                            }
                                                            className="w-full p-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                                            Confirm New Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            value={profileData.newPassword_confirmation}
                                                            onChange={(e) =>
                                                                setProfileData({
                                                                    ...profileData,
                                                                    newPassword_confirmation: e.target.value,
                                                                })
                                                            }
                                                            className="w-full p-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end mt-6">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            <span>Save Changes</span>
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;