/**
 * Settings/Profile Page
 * Author: Ali Sohel <avesohel@gmail.com>
 */
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../lib/auth-store";
import { User, CreditCard, Bell, Shield, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  plan_type: string;
  created_at: string;
}

export default function Settings() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFullName(data.full_name || "");
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      loadProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={profile?.email || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
              {saving ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>

        {/* Subscription Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                Subscription
              </h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                profile?.plan_type === "free"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-indigo-100 text-indigo-700"
              }`}>
              {profile?.plan_type?.toUpperCase() || "FREE"}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-gray-700">Current Plan</span>
              <span className="font-semibold text-gray-900">
                {profile?.plan_type === "free"
                  ? "Free Plan"
                  : `${profile?.plan_type} Plan`}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-gray-700">Member Since</span>
              <span className="font-semibold text-gray-900">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>

            {profile?.plan_type === "free" && (
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <h3 className="font-semibold text-indigo-900 mb-2">
                  Upgrade to unlock more features
                </h3>
                <p className="text-sm text-indigo-700 mb-4">
                  Get unlimited auto-replies, advanced analytics, and priority
                  support
                </p>
                <a
                  href="/pricing"
                  className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  View Plans
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Bell className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "Email notifications",
                description: "Receive email updates about your replies",
              },
              {
                title: "Usage alerts",
                description: "Get notified when reaching usage limits",
              },
              {
                title: "Weekly reports",
                description: "Receive weekly engagement reports",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Shield className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Security</h2>
          </div>

          <div className="space-y-4">
            <button className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
              Change Password
            </button>
            <button className="w-full sm:w-auto px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition ml-0 sm:ml-4">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
