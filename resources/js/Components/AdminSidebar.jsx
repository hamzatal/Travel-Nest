import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  Grid,
  Users,
  MessageSquare,
  MapPin,
  Tag,
  Image,
  LogOut,
  Home,
} from "lucide-react";

export default function AdminSidebar() {
  const { props } = usePage();
  const admin = props.auth?.user || {};
  const adminName = admin?.name || "Admin";
  const adminInitial = adminName.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 shadow-lg z-10">
      <div className="flex flex-col h-full">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-blue-400">Travel Nest</h2>
          <p className="text-sm text-gray-400">Admin Portal</p>
        </div>
        <div className="p-5 flex-grow overflow-auto">
          <nav className="space-y-1">
            <SidebarLink href="/admin/dashboard" label="Dashboard" icon={<Grid className="w-5 h-5 text-blue-400" />} />
            <SidebarLink href="/admin/users" label="Users" icon={<Users className="w-5 h-5 text-green-400" />} />
            <SidebarLink href="/admin/messages" label="Messages" icon={<MessageSquare className="w-5 h-5 text-yellow-400" />} />
            <SidebarLink href="/admin/destinations" label="Destinations" icon={<MapPin className="w-5 h-5 text-purple-400" />} />
            <SidebarLink href="/admin/offers" label="Offers" icon={<Tag className="w-5 h-5 text-pink-400" />} />
            <SidebarLink href="/admin/hero" label="Hero Sections" icon={<Image className="w-5 h-5 text-indigo-400" />} />
          </nav>
        </div>
        <div className="p-5 border-t border-gray-800">
          {/* home link */}
          <SidebarLink 
            href="/" 
            label="Home" 
            icon={<Home className="w-5 h-5 text-blue-400" />} 
          />

          {/* logout link */}
          <Link
  href={route('admin.logout')}

            method="post"
            as="button"
            className="flex items-center w-full space-x-3 text-gray-300 p-2 rounded-lg hover:bg-gray-800 mt-3"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <span>Log Out</span>
          </Link>

          {/* divider */}
          <div className="border-t border-gray-800 my-4"></div>

          {/* admin info */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
              {adminInitial}
            </div>
            <div>
              <p className="font-medium">{adminName}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ href, label, icon }) {
  const isActive = window.location.pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 text-gray-300 p-2 rounded-lg hover:bg-gray-800 ${
        isActive ? "bg-gray-800" : ""
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
