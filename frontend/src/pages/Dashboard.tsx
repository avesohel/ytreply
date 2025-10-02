/**
 * Main Dashboard
 * Author: Ali Sohel <avesohel@gmail.com>
 */
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Video, MessageSquare, TrendingUp, Settings } from "lucide-react";
import toast from "react-hot-toast";

interface DashboardStats {
  totalVideos: number;
  totalReplies: number;
  thisMonth: {
    replies: number;
    limit: number;
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get video count
      const { count: videoCount } = await supabase
        .from("videos")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Get reply count
      const { count: replyCount } = await supabase
        .from("comment_replies")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Get this month's usage
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: usage } = await supabase
        .from("usage_stats")
        .select("auto_replies_count")
        .eq("user_id", user.id)
        .eq("month", currentMonth)
        .single();

      // Get user's plan
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan_type")
        .eq("id", user.id)
        .single();

      const limits: Record<string, number> = {
        free: 25,
        pro: 500,
        business: 2500,
        enterprise: 999999,
      };

      const planType = (profile?.plan_type || "free") as keyof typeof limits;

      setStats({
        totalVideos: videoCount || 0,
        totalReplies: replyCount || 0,
        thisMonth: {
          replies: usage?.auto_replies_count || 0,
          limit: limits[planType],
        },
      });
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's your comment automation overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Videos
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalVideos}
                </p>
              </div>
              <Video className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Replies
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalReplies}
                </p>
              </div>
              <MessageSquare className="h-12 w-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.thisMonth.replies}/{stats?.thisMonth.limit}
                </p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${
                        ((stats?.thisMonth.replies || 0) /
                          (stats?.thisMonth.limit || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/videos"
              className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all">
              <Video className="h-6 w-6 mr-2" />
              Manage Videos
            </a>
            <a
              href="/channels"
              className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all">
              <Settings className="h-6 w-6 mr-2" />
              Manage Channels
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
