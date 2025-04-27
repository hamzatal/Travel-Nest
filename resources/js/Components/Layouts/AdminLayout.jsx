// components/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  Users, Film, Settings, 
  LogOut, Menu, X, Bell,
  BarChart2, Clapperboard, SquareStack
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { url } = usePage();

  const isActive = (path) => url.startsWith(`/admin/${path}`);

  const navigationItems = [
    { path: 'dashboard', icon: BarChart2, label: 'Dashboard' },
    { path: 'movies', icon: Film, label: 'Movies' },
    { path: 'users', icon: Users, label: 'Users' },
    { path: 'categories', icon: SquareStack, label: 'Categories' },
    { path: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 w-64 shadow-lg transform transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Clapperboard className="w-8 h-8 text-red-500" />
            <span className="text-xl font-bold dark:text-white">JO BEST</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navigationItems.map(({ path, icon: Icon, label }) => (
              <li key={path}>
                <Link
                  href={`/admin/${path}`}
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                    isActive(path)
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'lg:ml-64' : ''} transition-margin duration-300`}>
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <Link 
                href="/logout" 
                method="post" 
                as="button"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;