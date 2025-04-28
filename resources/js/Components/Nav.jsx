import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Hotel,
    Plane,
    BookOpen,
    Bookmark,
    LogOut,
    User,
    Map,
    Mail,
    Menu,
    X,
    Search,
    PlaneIcon
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";

const Nav = ({ isDarkMode = true, wishlist = [], handleLogout, user }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { url } = usePage();
    
    // Handle scroll effect with a smoother transition
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle search submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Implement your search functionality here
        console.log("Searching for:", searchQuery);
        // You could redirect to search results page
        // window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    };

    const navItems = [
        {
            label: "Home",
            href: "/home",
            icon: Hotel,
        },
        {
            label: "Packages",
            href: "/Packages",
            icon: Bookmark,
        },
        {
            label: "Destinations",
            href: "/destinations",
            icon: Map,
        },
        {
            label: "About Us",
            href: "/about-us",
            icon: BookOpen,
        },
        {
            label: "Contact",
            href: "/ContactPage",
            icon: Mail,
        },
    ];

    const dropdownItems = [
        {
            label: "Profile",
            href: "/UserProfile",
            icon: User,
        },
        {
            label: "Logout",
            href: route("logout"),
            icon: LogOut,
            method: "post"
        }
    ];

    const isActive = (href) => url === href;

    // Profile Button Component
  const ProfileButton = () => {
    const displayAvatar = user?.avatar_url ? user.avatar_url : '/images/avatar.webp';

    return (
        <div className="relative">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600/20 focus:outline-none border-2 border-green-500 hover:bg-green-600/30 transition-colors"
            >
                {user?.avatar_url ? (
                    <img 
                        src={displayAvatar}
                        alt="User Avatar"
                        className="w-full h-full rounded-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                    </div>
                )}
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg bg-black/80 backdrop-blur-lg text-white border border-green-500/30 overflow-hidden z-50">
                    {dropdownItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            method={item.method || 'get'}
                            as={item.method ? 'button' : 'a'}
                            className={`flex items-center px-4 py-3 text-sm w-full text-left transition-colors ${isActive(item.href) ? 'bg-green-600/30' : 'hover:bg-green-600/20 focus:bg-green-600/20'}`}
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <item.icon className="w-5 h-5 mr-2" />
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

    

    return (
        <header
            className={`
                fixed top-0 left-0 right-0 z-20
                px-6 md:px-10 py-4
                flex justify-between items-center
                transition-all duration-200
                ${isScrolled ? 'bg-black/80 backdrop-blur-lg' : 'bg-transparent'}
                border-b border-green-500/20
            `}
        >
            {/* Logo */}
            <div className="flex items-center">
                <div className="flex items-center">
                    <PlaneIcon className="w-10 h-10 text-green-500 mr-3" />
                    <h1 className="text-3xl font-bold text-white">
                        Travel <span className="text-green-500">Nest</span>
                    </h1>
                </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`
                            flex items-center space-x-2
                            px-4 py-2
                            rounded-full
                            text-sm
                            font-medium
                            transition-all
                            duration-200
                            ${isActive(item.href) ? 
                                'bg-green-600 text-white' : 
                                'text-gray-300 hover:bg-green-600/20 hover:text-white'}
                        `}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Right Section with Search, Profile and Mobile Menu Button */}
            <div className="flex items-center space-x-4">
                {/* Desktop Search */}
                <div className="hidden md:block relative">
                    {isSearchOpen ? (
                        <form onSubmit={handleSearchSubmit} className="flex items-center">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search destinations..."
                                className="w-48 px-4 py-2 pl-10 rounded-full bg-black/50 border border-green-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                autoFocus
                            />
                            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <button 
                                type="button" 
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                                onClick={() => setIsSearchOpen(false)}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600/20 focus:outline-none border border-green-500/30 hover:bg-green-600/30 transition-colors"
                        >
                            <Search className="w-5 h-5 text-white" />
                        </button>
                    )}
                </div>
                
                {/* Book Now Button */}
                <Link
                    href="/booking"
                    className="hidden md:flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-colors"
                >
                    Book Now <Plane className="ml-2 w-5 h-5" />
                </Link>

                {/* Profile Button - Always Visible */}
                <ProfileButton />

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-green-600/20 border border-green-500/30 hover:bg-green-600/30 transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <X className="w-6 h-6 text-white" />
                    ) : (
                        <Menu className="w-6 h-6 text-white" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-lg border-b border-green-500/30 py-4"
                >
                    {/* Mobile Search */}
                    <div className="px-6 mb-4">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search destinations..."
                                className="w-full px-4 py-2 pl-10 rounded-full bg-green-600/10 border border-green-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                            />
                            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <button 
                                type="submit"
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                            >
                                <Plane className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                    {/* Mobile Nav Items */}
                    <div className="space-y-2 px-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`
                                    flex items-center
                                    px-4 py-3
                                    rounded-lg
                                    text-sm
                                    font-medium
                                    w-full
                                    transition-colors duration-200
                                    ${isActive(item.href) ? 
                                        'bg-green-600 text-white' : 
                                        'text-gray-300 hover:bg-green-600/20 hover:text-white'}
                                `}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <item.icon className="w-5 h-5 mr-2" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Book Now Button on Mobile */}
                    <div className="px-6 mt-4">
                        <Link
                            href="/booking"
                            className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Book Now <Plane className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Nav;