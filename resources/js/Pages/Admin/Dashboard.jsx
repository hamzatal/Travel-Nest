import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, LogOut, Menu, X, Bell, Search,
  BarChart2, Clapperboard, MessageSquare, User,
  Shield, Calendar, ChevronLeft, ChevronRight,
  Activity, Settings, UploadCloud, Save, Eye, EyeOff
} from 'lucide-react';
import Swal from 'sweetalert2';
import { Transition } from '@headlessui/react';

const AdminDashboard = () => {
  // State Initialization
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [adminProfile, setAdminProfile] = useState({
    name: '',
    email: '',
    avatar: null
  });
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profileImage: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);

  // Animation Variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  // Utility Functions
  const getCsrfToken = () => {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#6366F1',
      background: isDarkMode ? '#1F2937' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonColor: '#6366F1',
      background: isDarkMode ? '#1F2937' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
    });
  };

  // Data Fetching
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const headers = {
        'X-CSRF-TOKEN': getCsrfToken(),
        'Accept': 'application/json',
      };

      // Fetch users
      const usersResponse = await fetch('/api/users', { headers });
      if (!usersResponse.ok) {
        const errorText = await usersResponse.text();
        console.error('Users API response:', errorText);
        throw new Error(`Failed to fetch users: ${usersResponse.status}`);
      }
      let usersData = await usersResponse.json();
      // Normalize data to array
      usersData = Array.isArray(usersData) ? usersData : 
                  Array.isArray(usersData.data) ? usersData.data : [];
      setUsers(usersData);
      setTotalUsers(usersData.length);
      setActiveUsers(usersData.filter(user => user.status === 'active').length);

      // Fetch contacts
      const contactsResponse = await fetch('/api/contacts', { headers });
      if (!contactsResponse.ok) {
        const errorText = await contactsResponse.text();
        console.error('Contacts API response:', errorText);
        throw new Error(`Failed to fetch contacts: ${contactsResponse.status}`);
      }
      let contactsData = await contactsResponse.json();
      // Normalize data to array
      contactsData = Array.isArray(contactsData) ? contactsData : 
                     Array.isArray(contactsData.data) ? contactsData.data : [];
      setContacts(contactsData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showErrorAlert(`Failed to load dashboard data: ${error.message}`);
      setUsers([]);
      setContacts([]);
      setTotalUsers(0);
      setActiveUsers(0);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminProfile = async () => {
    try {
        const headers = {
            'X-CSRF-TOKEN': getCsrfToken(),
            'Accept': 'application/json',
        };
        const response = await fetch('/admin/profile', { headers });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Profile API response:', errorText);
            throw new Error(`Failed to fetch profile: ${response.status}`);
        }
        const profileData = await response.json();
        setAdminProfile({
            name: profileData.name || '',
            email: profileData.email || '',
            avatar: profileData.avatar || null
        });
        setProfileForm({
            name: profileData.name || '',
            email: profileData.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            profileImage: null
        });
        setImagePreview(profileData.avatar || null);
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        showErrorAlert(`Failed to load profile: ${error.message}`);
    }
};

  // Handlers
  const handleLogout = async () => {
    try {
      const response = await fetch('/admin/logout', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': getCsrfToken(),
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        window.location.href = '/login';
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      showErrorAlert('Logout failed. Please try again.');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await fetch(`/users/${userId}/is`, {
        method: 'PUT',
        headers: {
          'X-CSRF-TOKEN': getCsrfToken(),
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating user status');
      }
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      setActiveUsers(newStatus === 'active' ? activeUsers + 1 : activeUsers - 1);
      showSuccessAlert(`User status changed to ${newStatus}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      showErrorAlert(error.message || 'Error updating user status');
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileForm(prev => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (profileForm.newPassword !== profileForm.confirmPassword) {
      showErrorAlert("New passwords don't match");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', profileForm.name);
      formData.append('email', profileForm.email);
      if (profileForm.currentPassword && profileForm.newPassword) {
        formData.append('current_password', profileForm.currentPassword);
        formData.append('new_password', profileForm.newPassword);
      }
      if (profileForm.profileImage) {
        formData.append('avatar', profileForm.profileImage);
      }
      formData.append('_method', 'PUT');

      const response = await fetch('/admin/profile', {
        method: 'POST', // Use POST with _method for Laravel
        headers: {
          'X-CSRF-TOKEN': getCsrfToken(),
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      const updatedProfile = await response.json();
      setAdminProfile({
        name: updatedProfile.name || '',
        email: updatedProfile.email || '',
        avatar: updatedProfile.avatar || null
      });
      setProfileForm({
        name: updatedProfile.name || '',
        email: updatedProfile.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        profileImage: null
      });
      setImagePreview(updatedProfile.avatar || null);
      showSuccessAlert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      showErrorAlert(error.message || 'Failed to update profile');
    }
  };

  // Pagination
  const totalPages = (data) => Math.ceil(data.length / itemsPerPage);

  const paginatedUsers = Array.isArray(users) ? users
    .filter(user =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

  const paginatedContacts = Array.isArray(contacts) ? contacts
    .filter(contact =>
      contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  // Dark Mode and Initial Load
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }

    fetchDashboardData();
    fetchAdminProfile();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  // Components
  const ContactsView = () => (
    <motion.div className="p-6" initial="hidden" animate="visible" variants={fadeIn}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold dark:text-white flex items-center">
              <MessageSquare className="w-6 h-6 mr-2 text-red-500" />
              Contact Messages
            </h2>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 transition duration-300"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Loading contacts...</p>
            </div>
          ) : paginatedContacts.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3 mx-auto" />
              <p className="text-gray-500 dark:text-gray-400">No contact messages found.</p>
            </div>
          ) : (
            <>
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="overflow-x-auto"
              >
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Message</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedContacts.map((contact) => (
                      <motion.tr 
                        key={contact.id}
                        variants={slideUp}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{contact.name || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{contact.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{contact.subject || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{contact.message || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {contact.created_at ? new Date(contact.created_at).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
              {totalPages(contacts.filter(contact =>
                contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.subject?.toLowerCase().includes(searchQuery.toLowerCase())
              )) > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 mt-4">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages(contacts.filter(contact =>
                        contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        contact.subject?.toLowerCase().includes(searchQuery.toLowerCase())
                      )), currentPage + 1))}
                      disabled={currentPage === totalPages(contacts.filter(contact =>
                        contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        contact.subject?.toLowerCase().includes(searchQuery.toLowerCase())
                      ))}
                      className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === totalPages(contacts.filter(contact =>
                          contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contact.subject?.toLowerCase().includes(searchQuery.toLowerCase())
                        )) 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, contacts.filter(contact =>
                            contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            contact.subject?.toLowerCase().includes(searchQuery.toLowerCase())
                          ).length)}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium">
                          {contacts.filter(contact =>
                            contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            contact.subject?.toLowerCase().includes(searchQuery.toLowerCase())
                          ).length}
                        </span>{' '}
                        results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 ${
                            currentPage === 1 
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
                              : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {[...Array(totalPages(contacts.filter(contact =>
                          contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contact.subject?.toLowerCase().includes(searchQuery.toLowerCase())
                        )))].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border ${
                              currentPage === i + 1
                                ? 'z-10 bg-red-50 dark:bg-red-900 border-red-500 dark:border-red-500 text-red-600 dark:text-red-200'
                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(Math.min(totalPages(contacts.filter(contact =>
                            contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            contact.subject?.toLowerCase().includes(searchQuery.toLowerCase())
                          )), currentPage + 1))}
                          disabled={currentPage === totalPages(contacts.filter(contact =>
                            contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            contact.subject?.toLowerCase().includes(searchQuery.toLowerCase())
                          ))}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 ${
                            currentPage === totalPages(contacts.filter(contact =>
                              contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              contact.subject?.toLowerCase().includes(searchQuery.toLowerCase())
                            )) 
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                              : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );

  const UsersView = () => (
    <motion.div className="p-6" initial="hidden" animate="visible" variants={fadeIn}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold dark:text-white flex items-center">
              <Users className="w-6 h-6 mr-2 text-red-500" />
              Users Management
            </h2>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 transition duration-300"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Loading users...</p>
            </div>
          ) : paginatedUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3 mx-auto" />
              <p className="text-gray-500 dark:text-gray-400">No users found.</p>
            </div>
          ) : (
            <>
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="overflow-x-auto"
              >
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedUsers.map((user) => (
                      <motion.tr 
                        key={user.id}
                        variants={slideUp}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email || 'N/A'}</div>
                        </td>
                       
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleToggleUserStatus(user.id, user.status)}
                            className={`px-3 py-1 rounded-md ${
                              user.status === 'active'
                                ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                                : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                            } transition-colors duration-300 flex items-center gap-1`}
                          >
                            {user.status === 'active' ? (
                              <>
                                <EyeOff className="w-4 h-4" />
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                <span>Activate</span>
                              </>
                            )}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
              {totalPages(users.filter(user =>
                user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase())
              )) > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 mt-4">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages(users.filter(user =>
                        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
                      )), currentPage + 1))}
                      disabled={currentPage === totalPages(users.filter(user =>
                        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
                      ))}
                      className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === totalPages(users.filter(user =>
                          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchQuery.toLowerCase())
                        )) 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, users.filter(user =>
                            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
                          ).length)}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium">
                          {users.filter(user =>
                            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
                          ).length}
                        </span>{' '}
                        results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 ${
                            currentPage === 1 
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
                              : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {[...Array(totalPages(users.filter(user =>
                          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchQuery.toLowerCase())
                        )))].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border ${
                              currentPage === i + 1
                                ? 'z-10 bg-red-50 dark:bg-red-900 border-red-500 dark:border-red-500 text-red-600 dark:text-red-200'
                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(Math.min(totalPages(users.filter(user =>
                            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
                          )), currentPage + 1))}
                          disabled={currentPage === totalPages(users.filter(user =>
                            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
                          ))}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 ${
                            currentPage === totalPages(users.filter(user =>
                              user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              user.email?.toLowerCase().includes(searchQuery.toLowerCase())
                            )) 
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                              : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );

  const ProfileView = () => (
    <motion.div className="p-6" initial="hidden" animate="visible" variants={fadeIn}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 dark:text-white flex items-center">
            <User className="w-6 h-6 mr-2 text-red-500" />
            Admin Profile
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <motion.div 
                className="flex flex-col items-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative group">
                  <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-red-100 dark:border-red-900/30 flex items-center justify-center">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-20 h-20 text-gray-400" />
                    )}
                  </div>
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition duration-300 flex items-center"
                >
                  <UploadCloud className="w-5 h-5 mr-2" />
                  Change Photo
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleProfileImageChange}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Recommended: Square image, at least 300x300 pixels
                </p>
              </motion.div>
            </div>
            <div className="lg:col-span-2">
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 transition duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 transition duration-300"
                    />
                  </div>
                </motion.div>
                <motion.div 
                  className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-medium dark:text-white">Change Password</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="currentPassword"
                        value={profileForm.currentPassword}
                        onChange={handleProfileInputChange}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 transition duration-300"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={profileForm.newPassword}
                      onChange={handleProfileInputChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 transition duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={profileForm.confirmPassword}
                      onChange={handleProfileInputChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 transition duration-300"
                    />
                  </div>
                </motion.div>
                <motion.div 
                  className="flex justify-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg flex items-center transition duration-300"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </button>
                </motion.div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const DashboardView = () => (
    <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6" variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div className="bg-gradient-to-r from-red-500 to-purple-600 rounded-lg shadow-lg overflow-hidden" variants={slideUp}>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-white text-opacity-70 text-sm uppercase font-medium tracking-wider">Total Users</p>
              <h3 className="text-3xl font-bold text-white mt-1">{totalUsers}</h3>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="bg-black bg-opacity-10 px-6 py-2">
            <p className="text-white text-opacity-80 text-sm flex items-center">
              <Activity className="w-4 h-4 mr-1" />
              {activeUsers} active users
            </p>
          </div>
        </motion.div>
        <motion.div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-lg shadow-lg overflow-hidden" variants={slideUp}>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-white text-opacity-70 text-sm uppercase font-medium tracking-wider">Messages</p>
              <h3 className="text-3xl font-bold text-white mt-1">{contacts.length}</h3>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="bg-black bg-opacity-10 px-6 py-2">
            <p className="text-white text-opacity-80 text-sm flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Updated today
            </p>
          </div>
        </motion.div>
        <motion.div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-lg overflow-hidden" variants={slideUp}>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-white text-opacity-70 text-sm uppercase font-medium tracking-wider">Active Rate</p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%
              </h3>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="bg-black bg-opacity-10 px-6 py-2">
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2" 
                style={{ width: `${totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%` }}
              ></div>
            </div>
          </div>
        </motion.div>
        <motion.div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg shadow-lg overflow-hidden" variants={slideUp}>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-white text-opacity-70 text-sm uppercase font-medium tracking-wider">Admin</p>
              <h3 className="text-2xl font-bold text-white mt-1 truncate">{adminProfile.name || 'Admin'}</h3>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="bg-black bg-opacity-10 px-6 py-2">
            <button 
              onClick={() => setActiveView('profile')}
              className="text-white text-opacity-80 text-sm flex items-center hover:text-opacity-100 transition duration-300"
            >
              <Settings className="w-4 h-4 mr-1" />
              Manage Profile
            </button>
          </div>
        </motion.div>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-red-500" />
              Recent Activity
            </h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Loading activity...</p>
              </div>
            ) : (
              <motion.div 
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {contacts.length > 0 && (
                  <motion.div 
                    variants={slideUp}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-pink-500" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">New contact message</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {contacts[0].name} sent a message about {contacts[0].subject}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400">
                        New
                      </span>
                    </div>
                  </motion.div>
                )}
                <motion.div 
                  variants={slideUp}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-red-500" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">User activity</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {totalUsers} total users in the system
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                      Today
                    </span>
                  </div>
                </motion.div>
                <motion.div 
                  variants={slideUp}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-emerald-500" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Active users</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activeUsers} active users out of {totalUsers} total users
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                      Updated
                    </span>
                  </div>
                </motion.div>
                <motion.div 
                  variants={slideUp}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-amber-500" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Admin login</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last login was {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                      Today
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold dark:text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-red-500" />
                Recent Messages
              </h2>
              <button 
                onClick={() => setActiveView('contacts')}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium flex items-center"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Loading messages...</p>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3 mx-auto" />
                <p className="text-gray-500 dark:text-gray-400">No messages found.</p>
              </div>
            ) : (
              <motion.div 
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {paginatedContacts.map((contact) => (
                  <motion.div 
                    key={contact.id}
                    variants={slideUp}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-red-500" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{contact.name || 'N/A'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{contact.message || 'N/A'}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        {contact.created_at ? new Date(contact.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Head title={activeView.charAt(0).toUpperCase() + activeView.slice(1)} />
      <div className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 w-64 shadow-lg transform transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Clapperboard className="w-8 h-8 text-red-500" />
            <span className="text-xl font-bold dark:text-white">JO BEST</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveView('dashboard')}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                  activeView === 'dashboard' 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                <BarChart2 className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('users')}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                  activeView === 'users'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Users</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('contacts')}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                  activeView === 'contacts'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Contacts</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('profile')}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                  activeView === 'profile'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
        
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 mt-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      <div className={`${isSidebarOpen ? 'lg:ml-64' : ''} transition-margin duration-300`}>
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex items-center space-x-4">
            
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {adminProfile.avatar ? (
                  <img 
                    src={adminProfile.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'users' && <UsersView />}
        {activeView === 'contacts' && <ContactsView />}
        {activeView === 'profile' && <ProfileView />}
      </div>
    </div>
  );
};

export default AdminDashboard;