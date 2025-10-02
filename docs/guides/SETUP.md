# YTReply - Complete Setup Guide

**Author:** Ali Sohel <avesohel@gmail.com>
**Project:** YouTube Comment Auto-Reply SaaS Platform

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Supabase Setup](#supabase-setup)
4. [Frontend Setup](#frontend-setup)
5. [n8n Automation Setup](#n8n-automation-setup)
6. [YouTube API Setup](#youtube-api-setup)
7. [OpenAI API Setup](#openai-api-setup)
8. [Stripe Setup (Optional)](#stripe-setup-optional)
9. [Deployment](#deployment)
10. [Testing](#testing)

---

## Overview

YTReply is a SaaS platform that automates YouTube comment replies using AI. The system:

- Monitors YouTube videos for new comments (every 5 minutes)
- Transcribes videos using OpenAI Whisper
- Generates context-aware replies using GPT-4
- Posts replies automatically to YouTube

**Tech Stack:**
- Frontend: React 19 + TypeScript + Vite + Tailwind CSS
- Backend: Supabase (PostgreSQL + Auth + Edge Functions)
- Automation: n8n (workflow automation)
- APIs: YouTube Data API v3, OpenAI (GPT-4 + Whisper), Stripe

---

## Prerequisites

Before starting, ensure you have:

- [Node.js](https://nodejs.org/) 18+ installed
- [Docker](https://www.docker.com/) installed (for n8n)
- A [Supabase](https://supabase.com/) account (free tier works)
- A [Google Cloud](https://console.cloud.google.com/) account
- An [OpenAI](https://platform.openai.com/) API key
- (Optional) A [Stripe](https://stripe.com/) account for payments

---

## Supabase Setup

### 1. Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com/) and create a new project
2. Choose a region closest to your users
3. Save your project URL and anon key (you'll need these later)

### 2. Run Database Schema

1. Open Supabase SQL Editor
2. Copy the contents of `supabase-schema.sql` from the project root
3. Run the SQL to create all tables, indexes, RLS policies, and functions

### 3. Enable Email Auth

1. Go to Authentication → Providers
2. Enable "Email" provider
3. (Optional) Enable "Google" OAuth provider:
   - Add Google OAuth credentials from Google Cloud Console
   - Set redirect URL to `https://your-project.supabase.co/auth/v1/callback`

### 4. Configure Email Templates (Optional)

1. Go to Authentication → Email Templates
2. Customize signup confirmation and password reset emails

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create `/frontend/.env` file:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# n8n Webhook Base URL
VITE_N8N_WEBHOOK_BASE=http://localhost:5678/webhook

# YouTube API (from Google Cloud Console)
VITE_YOUTUBE_API_KEY=your-youtube-api-key

# Stripe (Optional - use test keys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## n8n Automation Setup

### 1. Start n8n with Docker

```bash
cd n8n
docker-compose up -d
```

n8n will be available at `http://localhost:5678`

**Default credentials:**
- Username: `admin`
- Password: `@nmAdminn8n` (from `.env` file)

### 2. Import Workflows

1. Open n8n at `http://localhost:5678`
2. Click "Import from File"
3. Import `wf1_comment_monitor.json` (Comment Monitoring)
4. Import `wf2_video_transcript.json` (Video Transcription)

### 3. Configure Workflow Credentials

#### Workflow 1: Comment Monitor

**YouTube OAuth2:**
1. Click on any YouTube node
2. Add new credentials
3. Use OAuth2 with these settings:
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)
   - Authorization URL: `https://accounts.google.com/o/oauth2/v2/auth`
   - Token URL: `https://oauth2.googleapis.com/token`
   - Scope: `https://www.googleapis.com/auth/youtube.force-ssl`

**Supabase:**
1. Click on Supabase node
2. Add credentials:
   - Host: `your-project.supabase.co`
   - Service Key: (from Supabase Settings → API → service_role key)

**OpenAI:**
1. Click on OpenAI node
2. Add API Key from [platform.openai.com](https://platform.openai.com/api-keys)

### 4. Activate Workflows

1. Toggle "Active" switch on both workflows
2. Test by manually triggering the workflow

---

## YouTube API Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one

### 2. Enable YouTube Data API v3

1. Go to "APIs & Services" → "Library"
2. Search for "YouTube Data API v3"
3. Click "Enable"

### 3. Create API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the key and add to `.env` file

### 4. Create OAuth 2.0 Client ID

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Authorized redirect URIs:
   - `http://localhost:5678/rest/oauth2-credential/callback` (for n8n)
   - `https://your-supabase-project.supabase.co/auth/v1/callback` (for Supabase Auth)
5. Save Client ID and Client Secret

---

## OpenAI API Setup

### 1. Create API Key

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Navigate to API Keys
3. Create a new API key
4. Add to n8n OpenAI credentials

### 2. Add Credits

1. Go to Billing
2. Add payment method
3. Add credits (minimum $5 recommended for testing)

**Note:**
- GPT-4 costs ~$0.03-0.06 per reply
- Whisper costs ~$0.006 per minute of audio

---

## Stripe Setup (Optional)

### 1. Create Stripe Account

1. Sign up at [stripe.com](https://stripe.com/)
2. Use test mode for development

### 2. Create Products & Prices

Create these products in Stripe Dashboard:

**Pro Plan:**
- Price: $49/month
- Price ID: `price_pro_monthly`

**Business Plan:**
- Price: $149/month
- Price ID: `price_business_monthly`

### 3. Get API Keys

1. Go to Developers → API Keys
2. Copy "Publishable key" to `.env`
3. Copy "Secret key" (for backend/webhooks)

### 4. Setup Webhooks

1. Go to Developers → Webhooks
2. Add endpoint: `https://your-project.supabase.co/functions/v1/stripe-webhook`
3. Listen for events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret

---

## Deployment

### Option 1: Vercel (Recommended for Frontend)

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Deploy Frontend

```bash
cd frontend
vercel
```

#### 3. Add Environment Variables

In Vercel Dashboard:
- Add all variables from `.env`
- Deploy again to apply changes

### Option 2: Railway (for n8n)

1. Sign up at [railway.app](https://railway.app/)
2. Create new project from Docker
3. Add environment variables from `n8n/.env`
4. Deploy

### Supabase Edge Functions (for Stripe Webhooks)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy function
supabase functions deploy stripe-webhook
```

---

## Testing

### 1. Test Authentication

1. Go to `http://localhost:5173/signup`
2. Create an account
3. Check email for verification
4. Login

### 2. Test Video Addition

1. Navigate to Videos page
2. Add a YouTube video URL
3. Check Supabase `videos` table for entry
4. Verify transcription workflow runs

### 3. Test Comment Monitoring

1. Add a test comment to your YouTube video
2. Wait 5 minutes for workflow to run
3. Check `comment_replies` table in Supabase
4. Verify reply appears on YouTube

### 4. Test Dashboard

1. Check stats are loading correctly
2. Verify usage limits are calculated
3. Test Quick Actions buttons

---

## Troubleshooting

### YouTube API Errors

**"Invalid API Key"**
- Verify API key in `.env` is correct
- Ensure YouTube Data API v3 is enabled in Google Cloud

**"Access Not Configured"**
- Enable YouTube Data API v3 in Google Cloud Console

### n8n Workflow Errors

**"Credentials not found"**
- Reconfigure credentials in n8n
- Ensure all OAuth flows are completed

**"Webhook timeout"**
- Increase timeout in workflow settings
- Check n8n logs: `docker-compose logs -f`

### Supabase Errors

**"Row Level Security policy violation"**
- Run `supabase-schema.sql` again
- Verify RLS policies are enabled

**"Foreign key constraint violation"**
- Ensure user profile exists before adding videos
- Check `handle_new_user()` trigger is active

---

## Production Checklist

Before going live:

- [ ] Update Supabase RLS policies for production
- [ ] Use production Stripe keys
- [ ] Configure custom domain in Vercel
- [ ] Enable Supabase email rate limiting
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure backup strategy for Supabase
- [ ] Set up n8n on production server (not localhost)
- [ ] Enable HTTPS for all endpoints
- [ ] Review YouTube API quota limits
- [ ] Add error tracking and logging
- [ ] Set up status page (e.g., statuspage.io)

---

## Support

For issues or questions:
- GitHub Issues: [Create Issue](https://github.com/your-repo/issues)
- Email: avesohel@gmail.com

---

## License

© 2025 Ali Sohel. All rights reserved.
