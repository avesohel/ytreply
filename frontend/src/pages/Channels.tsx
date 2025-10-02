/**
 * YouTube Channels Management Page
 * Author: Ali Sohel <avesohel@gmail.com>
 */
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Youtube,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

interface Channel {
  id: string;
  channel_id: string;
  channel_title: string;
  channel_description: string | null;
  thumbnail_url: string | null;
  subscriber_count: number;
  video_count: number;
  auto_reply_enabled: boolean;
  created_at: string;
}

export default function Channels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("youtube_channels")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setChannels(data || []);
    } catch (error) {
      console.error("Error loading channels:", error);
      toast.error("Failed to load channels");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectChannel = async () => {
    toast.error(
      "YouTube OAuth integration coming soon! Please add your channel via the YouTube API console for now."
    );
    // TODO: Implement YouTube OAuth flow
    // This would redirect to Google OAuth consent screen
    // and then save the channel info + tokens
  };

  const toggleAutoReply = async (channelId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("youtube_channels")
        .update({ auto_reply_enabled: !currentState })
        .eq("id", channelId);

      if (error) throw error;

      toast.success(`Auto-reply ${!currentState ? "enabled" : "disabled"}`);
      loadChannels();
    } catch (error) {
      console.error("Error toggling auto-reply:", error);
      toast.error("Failed to update settings");
    }
  };

  const deleteChannel = async (channelId: string) => {
    if (!confirm("Are you sure you want to remove this channel?")) return;

    try {
      const { error } = await supabase
        .from("youtube_channels")
        .delete()
        .eq("id", channelId);

      if (error) throw error;

      toast.success("Channel removed successfully");
      loadChannels();
    } catch (error) {
      console.error("Error deleting channel:", error);
      toast.error("Failed to remove channel");
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">YouTube Channels</h1>
        <p className="text-gray-600 mt-2">
          Connect and manage your YouTube channels for auto-replies
        </p>
      </div>

      {/* Add Channel Button */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connect Your Channel
            </h2>
            <p className="text-gray-600 text-sm">
              Securely connect your YouTube channel via Google OAuth
            </p>
          </div>
          <button
            onClick={handleConnectChannel}
            className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md">
            <Youtube className="h-5 w-5 mr-2" />
            Connect with YouTube
          </button>
        </div>
      </div>

      {/* Channels List */}
      <div className="space-y-4">
        {channels.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Youtube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No channels connected yet
            </h3>
            <p className="text-gray-600 mb-6">
              Connect your first YouTube channel to start automating replies
            </p>
            <button
              onClick={handleConnectChannel}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              <Plus className="h-5 w-5 mr-2" />
              Connect Channel
            </button>
          </div>
        ) : (
          channels.map((channel) => (
            <div key={channel.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    {channel.thumbnail_url ? (
                      <img
                        src={channel.thumbnail_url}
                        alt={channel.channel_title}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                        <Youtube className="h-10 w-10 text-red-600" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {channel.channel_title}
                      </h3>
                      <a
                        href={`https://youtube.com/channel/${channel.channel_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>

                    {channel.channel_description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {channel.channel_description}
                      </p>
                    )}

                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {channel.subscriber_count.toLocaleString()} subscribers
                      </div>
                      <div className="flex items-center">
                        <Youtube className="h-4 w-4 mr-1" />
                        {channel.video_count.toLocaleString()} videos
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          channel.auto_reply_enabled
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                        {channel.auto_reply_enabled ? "Active" : "Paused"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() =>
                      toggleAutoReply(channel.id, channel.auto_reply_enabled)
                    }
                    className="p-2 hover:bg-gray-100 rounded"
                    title={
                      channel.auto_reply_enabled
                        ? "Disable auto-reply"
                        : "Enable auto-reply"
                    }>
                    {channel.auto_reply_enabled ? (
                      <ToggleRight className="h-6 w-6 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-400" />
                    )}
                  </button>

                  <button
                    onClick={() => deleteChannel(channel.id)}
                    className="p-2 hover:bg-red-100 rounded"
                    title="Remove channel">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Connected{" "}
                  {new Date(channel.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          How channel connection works
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              We use Google OAuth for secure authentication - we never store
              your password
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              You can enable/disable auto-replies per channel at any time
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Free plan allows 1 channel, upgrade for more channels
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>You can disconnect channels whenever you want</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
