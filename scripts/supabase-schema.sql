-- YTReply Database Schema - Clean Install
-- Author: Ali Sohel <avesohel@gmail.com>
-- Created: 2025

-- Clean slate: Drop all tables in reverse dependency order
DROP TABLE IF EXISTS public.comment_replies CASCADE;
DROP TABLE IF EXISTS public.usage_stats CASCADE;
DROP TABLE IF EXISTS public.subscription_events CASCADE;
DROP TABLE IF EXISTS public.reply_templates CASCADE;
DROP TABLE IF EXISTS public.videos CASCADE;
DROP TABLE IF EXISTS public.youtube_channels CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Begin transaction for atomic execution
BEGIN;

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'business', 'enterprise')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid')),
  trial_ends_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- YOUTUBE CHANNELS TABLE
-- ============================================
CREATE TABLE public.youtube_channels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  channel_id TEXT UNIQUE NOT NULL,
  channel_title TEXT NOT NULL,
  channel_description TEXT,
  thumbnail_url TEXT,
  subscriber_count INTEGER DEFAULT 0,
  video_count INTEGER DEFAULT 0,
  auto_reply_enabled BOOLEAN DEFAULT true,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VIDEOS TABLE
-- ============================================
CREATE TABLE public.videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  channel_id UUID REFERENCES public.youtube_channels(id) ON DELETE SET NULL,
  youtube_video_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration INTEGER,
  view_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  transcript TEXT,
  transcript_language TEXT DEFAULT 'en',
  transcription_status TEXT DEFAULT 'pending' CHECK (transcription_status IN ('pending', 'processing', 'completed', 'failed')),
  auto_reply_enabled BOOLEAN DEFAULT true,
  last_comment_check_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMMENT REPLIES TABLE
-- ============================================
CREATE TABLE public.comment_replies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  youtube_comment_id TEXT UNIQUE NOT NULL,
  youtube_reply_id TEXT,
  comment_author TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  reply_text TEXT NOT NULL,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  replied_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USAGE STATS TABLE
-- ============================================
CREATE TABLE public.usage_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  month TEXT NOT NULL, -- Format: YYYY-MM
  auto_replies_count INTEGER DEFAULT 0,
  transcriptions_count INTEGER DEFAULT 0,
  videos_added_count INTEGER DEFAULT 0,
  channels_added_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- ============================================
-- SUBSCRIPTION EVENTS TABLE (for audit log)
-- ============================================
CREATE TABLE public.subscription_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  stripe_event_id TEXT UNIQUE,
  plan_type TEXT,
  amount INTEGER,
  currency TEXT DEFAULT 'usd',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUTO REPLY TEMPLATES TABLE (optional feature)
-- ============================================
CREATE TABLE public.reply_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  template TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_channels_user_id ON public.youtube_channels(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_youtube_id ON public.videos(youtube_video_id);
CREATE INDEX IF NOT EXISTS idx_comment_replies_video_id ON public.comment_replies(video_id);
CREATE INDEX IF NOT EXISTS idx_comment_replies_youtube_comment ON public.comment_replies(youtube_comment_id);
CREATE INDEX IF NOT EXISTS idx_usage_stats_user_month ON public.usage_stats(user_id, month);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reply_templates ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- YouTube Channels policies
CREATE POLICY "Users can view own channels" ON public.youtube_channels
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own channels" ON public.youtube_channels
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own channels" ON public.youtube_channels
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own channels" ON public.youtube_channels
  FOR DELETE USING (auth.uid() = user_id);

-- Videos policies
CREATE POLICY "Users can view own videos" ON public.videos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own videos" ON public.videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own videos" ON public.videos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own videos" ON public.videos
  FOR DELETE USING (auth.uid() = user_id);

-- Comment replies policies
CREATE POLICY "Users can view own replies" ON public.comment_replies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own replies" ON public.comment_replies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usage stats policies
CREATE POLICY "Users can view own usage" ON public.usage_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON public.usage_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON public.usage_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Subscription events policies
CREATE POLICY "Users can view own subscription events" ON public.subscription_events
  FOR SELECT USING (auth.uid() = user_id);

-- Reply templates policies
CREATE POLICY "Users can view own templates" ON public.reply_templates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own templates" ON public.reply_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" ON public.reply_templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON public.reply_templates
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON public.youtube_channels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_stats_updated_at BEFORE UPDATE ON public.usage_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.reply_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to increment usage stats
DROP FUNCTION IF EXISTS public.increment_usage(uuid,text,integer);
CREATE OR REPLACE FUNCTION public.increment_usage(
  p_user_id UUID,
  p_field TEXT,
  p_amount INTEGER DEFAULT 1
)
RETURNS VOID AS $$
DECLARE
  current_month TEXT;
BEGIN
  current_month := TO_CHAR(NOW(), 'YYYY-MM');

  INSERT INTO public.usage_stats (user_id, month, auto_replies_count, transcriptions_count, videos_added_count, channels_added_count)
  VALUES (
    p_user_id,
    current_month,
    CASE WHEN p_field = 'auto_replies_count' THEN p_amount ELSE 0 END,
    CASE WHEN p_field = 'transcriptions_count' THEN p_amount ELSE 0 END,
    CASE WHEN p_field = 'videos_added_count' THEN p_amount ELSE 0 END,
    CASE WHEN p_field = 'channels_added_count' THEN p_amount ELSE 0 END
  )
  ON CONFLICT (user_id, month) DO UPDATE SET
    auto_replies_count = CASE WHEN p_field = 'auto_replies_count' THEN public.usage_stats.auto_replies_count + p_amount ELSE public.usage_stats.auto_replies_count END,
    transcriptions_count = CASE WHEN p_field = 'transcriptions_count' THEN public.usage_stats.transcriptions_count + p_amount ELSE public.usage_stats.transcriptions_count END,
    videos_added_count = CASE WHEN p_field = 'videos_added_count' THEN public.usage_stats.videos_added_count + p_amount ELSE public.usage_stats.videos_added_count END,
    channels_added_count = CASE WHEN p_field = 'channels_added_count' THEN public.usage_stats.channels_added_count + p_amount ELSE public.usage_stats.channels_added_count END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SEED DATA (Optional default templates)
-- ============================================

-- You can add default reply templates here if needed

-- Commit transaction
COMMIT;
