import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Bookmark, BookOpen, Mail, User, LogOut, Menu, X, MapPin, LogIn, Package as PackageIcon } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import LiveSearch from "../Components/LiveSearch";

const Navbar = ({ user = null }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { url } = usePage();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Destinations", href: "/destinations", icon: Bookmark },
    { label: "Packages", href: "/packages", icon: PackageIcon },
    { label: "About", href: "/about", icon: BookOpen },
    { label: "Contact", href: "/contact", icon: Mail },
  ];

  const dropdownItems = user
    ? [
        {
          label: "Profile",
          href: user.is_admin ? route("admin.dashboard") : route("user.profile"),
          icon: User,
        },
        {
          label: "Logout",
          href: user.is_admin ? route("admin.logout") : route("user.logout"),
          icon: LogOut,
          method: "post",
        },
      ]
    : [];

  const isActive = (href) => url === href;

  const ProfileButton = () => (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 focus:outline-none"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-600">
            <User className="w-6 h-6 text-gray-300" />
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg bg-gray-800 text-white border border-gray-700 overflow-hidden z-50"
          >
            {dropdownItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                method={item.method || "get"}
                as={item.method ? "button" : "a"}
                className={`flex items-center space-x-2 px-4 py-3 text-sm w-full text-left transition-colors ${
                  isActive(item.href)
                    ? "bg-gray-700"
                    : "hover:bg-gray-700 focus:bg-gray-700"
                }`}
                onClick={() => setIsDropdownOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const AuthButtons = () => (
    <div className="flex items-center space-x-4">
      <Link
        href={route("user.login")}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-300"
      >
        <LogIn className="w-5 h-5" />
        <span>Sign In</span>
      </Link>
      
    </div>
  );

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 400 }}
      className="fixed top-0 left-0 right-0 z-20 px-5 md:px-10 py-3 flex justify-between items-center bg-gradient-to-br from-gray-900 to-black text-white backdrop-blur-xl border-b border-gray-800/50"
    >
      <div className="flex items-center space-x-4">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link href="/">
            <img
              src="/images/logo.png"
              alt="Travel Nest Logo"
              className="h-12 w-auto"
            />
          </Link>
        </motion.div>
      </div>

      <div className="hidden md:block w-90 max-w-md">
        <LiveSearch />
      </div>

      <nav className="hidden lg:flex items-center space-x-6 mr-8">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center space-x-2 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
              isActive(item.href)
                ? "bg-gray-800 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <item.icon
              className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                isActive(item.href) ? "text-white" : "text-gray-400"
              }`}
            />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="flex items-center space-x-4">
        {user ? <ProfileButton /> : <AuthButtons />}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 py-4"
          >
            <div className="px-4 mb-4">
              <LiveSearch />
            </div>
            <div className="space-y-2 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium w-full ${
                    isActive(item.href)
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              {!user ? (
                <>
                  <Link
                    href={route("user.login")}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium w-full text-gray-300 hover:bg-gray-800 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href={route("register")}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium w-full text-gray-300 hover:bg-gray-800 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Sign Up</span>
                  </Link>
                </>
              ) : (
                dropdownItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    method={item.method || "get"}
                    as={item.method ? "button" : "a"}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium w-full ${
                      isActive(item.href)
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;