/**
 * Dashboard Layout Component
 * Author: Ali Sohel <avesohel@gmail.com>
 */
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/auth-store";
import {
  Youtube,
  Home,
  Video,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
} from "lucide-react";
import toast from "react-hot-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Videos", href: "/videos", icon: Video },
    { name: "Channels", href: "/channels", icon: Youtube },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Youtube className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">YTReply</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}>
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Upgrade CTA */}
          <div className="p-4 m-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white">
            <div className="flex items-center mb-2">
              <Crown className="h-5 w-5 mr-2" />
              <span className="font-semibold">Upgrade to Pro</span>
            </div>
            <p className="text-sm text-indigo-100 mb-3">
              Get unlimited replies and advanced features
            </p>
            <Link
              to="/pricing"
              className="block w-full text-center px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition">
              View Plans
            </Link>
          </div>

          {/* User menu */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                  {user?.email?.[0].toUpperCase()}
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.user_metadata?.full_name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 mr-4">
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">
              {navigation.find((item) => item.href === location.pathname)
                ?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/pricing"
              className="hidden sm:block px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Upgrade
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
