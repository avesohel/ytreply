/**
 * Supabase Client Configuration
 * Author: Ali Sohel <avesohel@gmail.com>
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  plan_type: "free" | "pro" | "business" | "enterprise";
  created_at: string;
}

export interface YouTubeChannel {
  id: string;
  user_id: string;
  channel_id: string;
  channel_title: string;
  auto_reply_enabled: boolean;
  created_at: string;
}

export interface Video {
  id: string;
  user_id: string;
  youtube_video_id: string;
  title: string;
  transcript: string | null;
  auto_reply_enabled: boolean;
  created_at: string;
}
