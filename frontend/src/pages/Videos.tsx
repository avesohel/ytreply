/**
 * Videos Management Page
 * Author: Ali Sohel <avesohel@gmail.com>
 */
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Video as VideoIcon,
  Play,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import toast from "react-hot-toast";

interface Video {
  id: string;
  youtube_video_id: string;
  title: string;
  transcript: string | null;
  auto_reply_enabled: boolean;
  created_at: string;
}

export default function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error("Error loading videos:", error);
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const addVideo = async () => {
    if (!newVideoUrl.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    setAdding(true);
    try {
      // Extract video ID from URL
      const videoId = extractVideoId(newVideoUrl);
      if (!videoId) {
        toast.error("Invalid YouTube URL");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Check plan limits
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan_type")
        .eq("id", user.id)
        .single();

      const { count } = await supabase
        .from("videos")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const limits = { free: 5, pro: 100, business: 999, enterprise: 9999 };
      if ((count || 0) >= limits[profile?.plan_type || "free"]) {
        toast.error("Video limit reached. Please upgrade your plan.");
        return;
      }

      // Fetch video details from YouTube
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${
          import.meta.env.VITE_YOUTUBE_API_KEY
        }`
      );
      const data = await response.json();

      if (!data.items?.length) {
        toast.error("Video not found");
        return;
      }

      const videoTitle = data.items[0].snippet.title;

      // Insert video into database
      const { error } = await supabase.from("videos").insert({
        user_id: user.id,
        youtube_video_id: videoId,
        title: videoTitle,
        auto_reply_enabled: true,
      });

      if (error) throw error;

      // Trigger n8n transcription workflow
      await fetch(`${import.meta.env.VITE_N8N_WEBHOOK_BASE}/transcribe-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, userId: user.id }),
      });

      toast.success("Video added successfully! Transcription in progress...");
      setNewVideoUrl("");
      loadVideos();
    } catch (error) {
      console.error("Error adding video:", error);
      toast.error("Failed to add video");
    } finally {
      setAdding(false);
    }
  };

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const toggleAutoReply = async (videoId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("videos")
        .update({ auto_reply_enabled: !currentState })
        .eq("id", videoId);

      if (error) throw error;

      toast.success(`Auto-reply ${!currentState ? "enabled" : "disabled"}`);
      loadVideos();
    } catch (error) {
      console.error("Error toggling auto-reply:", error);
      toast.error("Failed to update settings");
    }
  };

  const deleteVideo = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const { error } = await supabase
        .from("videos")
        .delete()
        .eq("id", videoId);

      if (error) throw error;

      toast.success("Video deleted");
      loadVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Videos</h1>
          <p className="text-gray-600 mt-2">
            Manage your YouTube videos and auto-reply settings
          </p>
        </div>

        {/* Add Video Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add New Video
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={addVideo}
              disabled={adding}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {adding ? "Adding..." : "Add Video"}
            </button>
          </div>
        </div>

        {/* Videos List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : videos.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <VideoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No videos yet
              </h3>
              <p className="text-gray-600">
                Add your first YouTube video to get started
              </p>
            </div>
          ) : (
            videos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <img
                        src={`https://img.youtube.com/vi/${video.youtube_video_id}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-32 h-20 rounded object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {video.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>
                          Added{" "}
                          {new Date(video.created_at).toLocaleDateString()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded ${
                            video.transcript
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                          {video.transcript ? "Transcribed" : "Processing..."}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() =>
                        toggleAutoReply(video.id, video.auto_reply_enabled)
                      }
                      className="p-2 hover:bg-gray-100 rounded"
                      title={
                        video.auto_reply_enabled
                          ? "Disable auto-reply"
                          : "Enable auto-reply"
                      }>
                      {video.auto_reply_enabled ? (
                        <ToggleRight className="h-6 w-6 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                      )}
                    </button>
                    <a
                      href={`https://youtube.com/watch?v=${video.youtube_video_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Watch on YouTube">
                      <Play className="h-6 w-6 text-gray-600" />
                    </a>
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="p-2 hover:bg-red-100 rounded"
                      title="Delete video">
                      <Trash2 className="h-6 w-6 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
