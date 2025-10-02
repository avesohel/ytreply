# n8n Configuration Guide for YTReply

**Author:** Ali Sohel <avesohel@gmail.com>

This guide walks you through configuring your n8n workflows for the YTReply auto-reply system.

---

## Table of Contents

1. [Start n8n](#start-n8n)
2. [Import Workflows](#import-workflows)
3. [Configure YouTube OAuth](#configure-youtube-oauth)
4. [Configure Supabase](#configure-supabase)
5. [Configure OpenAI](#configure-openai)
6. [Test Workflows](#test-workflows)
7. [Monitoring & Logs](#monitoring--logs)

---

## Start n8n

### Using Docker (Recommended)

```bash
cd n8n
docker-compose up -d
```

### Check if Running

```bash
docker-compose ps
```

### Access n8n

Open your browser and go to: `http://localhost:5678`

**Login credentials:**
- Username: `admin`
- Password: `@nmAdminn8n` (from `n8n/.env`)

---

## Import Workflows

### Workflow 1: Comment Monitor

1. Click the "+" button in top right
2. Select "Import from File"
3. Choose `n8n/wf1_comment_monitor.json`
4. Click "Import"

**This workflow:**
- Runs every 5 minutes
- Fetches user's YouTube videos
- Gets new comments
- Checks if already replied (in Supabase)
- Fetches video transcript
- Generates AI reply with GPT-4
- Posts reply to YouTube
- Logs reply in Supabase

### Workflow 2: Video Transcription

1. Click the "+" button
2. Select "Import from File"
3. Choose `n8n/wf2_video_transcript.json`
4. Click "Import"

**This workflow:**
- Triggered by webhook from frontend
- Downloads video from YouTube
- Transcribes with OpenAI Whisper
- Saves transcript to Supabase

---

## Configure YouTube OAuth

### Prerequisites

You need YouTube Data API v3 enabled and OAuth credentials from Google Cloud Console.

### Steps

1. **In n8n, click on any YouTube node** (e.g., "Get User Videos")

2. **Click "Create New Credentials"**

3. **Select "YouTube OAuth2 API"**

4. **Fill in the form:**
   - **Name:** `YouTube API`
   - **Client ID:** `your-google-oauth-client-id`
   - **Client Secret:** `your-google-oauth-client-secret`
   - **Authorization URL:** `https://accounts.google.com/o/oauth2/v2/auth`
   - **Access Token URL:** `https://oauth2.googleapis.com/token`
   - **Scope:** `https://www.googleapis.com/auth/youtube.force-ssl`

5. **Click "Connect my account"**

6. **Complete OAuth flow:**
   - You'll be redirected to Google
   - Select your YouTube channel
   - Grant permissions
   - You'll be redirected back to n8n

7. **Apply to all YouTube nodes:**
   - Go to each YouTube node in both workflows
   - Select the credentials you just created

---

## Configure Supabase

### Get Supabase Service Key

1. Go to your Supabase project
2. Navigate to Settings → API
3. Copy the `service_role` key (not the `anon` key!)
4. **⚠️ Keep this key secret - it bypasses RLS!**

### Configure in n8n

1. **Click on any Supabase node** (e.g., "Check If Replied")

2. **Create new credentials:**
   - **Credential Type:** `Supabase API`
   - **Name:** `Supabase YTReply`
   - **Host:** `your-project.supabase.co` (without https://)
   - **Service Role Key:** `your-service-role-key`

3. **Test the connection:**
   - Click "Test" button
   - Should show "Connection successful"

4. **Apply to all Supabase nodes**

---

## Configure OpenAI

### Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Navigate to API Keys
3. Click "Create new secret key"
4. Copy the key (save it somewhere safe - you won't see it again!)

### Add Billing

⚠️ **Important:** Add credits to your OpenAI account or API calls will fail!

1. Go to Billing → Payment methods
2. Add a credit card
3. Add credits (recommend $10+ for testing)

### Configure in n8n

#### For GPT-4 (Comment Replies)

1. **Click on "Generate AI Reply" node**

2. **Create credentials:**
   - **Credential Type:** `OpenAI API`
   - **Name:** `OpenAI GPT-4`
   - **API Key:** `your-openai-api-key`

3. **Model Settings:**
   - **Model:** `gpt-4` or `gpt-4-turbo-preview`
   - **Temperature:** `0.7` (creativity level)
   - **Max Tokens:** `150` (reply length limit)

#### For Whisper (Transcription)

1. **Click on "Transcribe with Whisper" node**

2. **Use same credentials** as GPT-4

3. **Model Settings:**
   - **Model:** `whisper-1`
   - **Language:** `en` (or leave blank for auto-detect)

---

## Test Workflows

### Test Comment Monitor Workflow

1. **Open Workflow 1** (Comment Monitor)

2. **Click "Execute Workflow" button**

3. **Check execution:**
   - All nodes should be green
   - Check output data in each node
   - Verify no errors

4. **If errors:**
   - Red nodes indicate failures
   - Click on the node to see error message
   - Common issues:
     - Invalid credentials
     - API quota exceeded
     - Missing permissions

### Test Transcription Workflow

1. **Open Workflow 2** (Video Transcription)

2. **Click on "Webhook" node**

3. **Copy webhook URL** (e.g., `http://localhost:5678/webhook/transcribe-video`)

4. **Test with curl:**

```bash
curl -X POST http://localhost:5678/webhook/transcribe-video \
  -H "Content-Type: application/json" \
  -d '{
    "videoId": "dQw4w9WgXcQ",
    "userId": "your-user-id"
  }'
```

5. **Check Supabase:**
   - Verify transcript saved in `videos` table

### Manual Test with Real Data

1. **Add a video in the frontend**

2. **Add a test comment** on that YouTube video

3. **Wait 5 minutes** (or manually trigger workflow)

4. **Verify:**
   - Check `comment_replies` table in Supabase
   - Check YouTube for the AI reply
   - Check n8n execution history

---

## Monitoring & Logs

### View Execution History

1. In n8n sidebar, click "Executions"
2. See all past workflow runs
3. Click on any execution to see details

### Check Docker Logs

```bash
# View all logs
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100

# View logs for specific container
docker logs n8n-ytreply -f
```

### Common Error Messages

**"401 Unauthorized"**
- Credentials expired or invalid
- Re-authenticate with YouTube OAuth

**"429 Too Many Requests"**
- YouTube API quota exceeded
- Wait for quota reset (midnight Pacific Time)
- Request quota increase in Google Cloud Console

**"insufficient_quota"** (OpenAI)
- Out of OpenAI credits
- Add more credits in OpenAI billing

**"relation does not exist"** (Supabase)
- Table not found
- Run `supabase-schema.sql` to create tables

---

## Production Deployment

### Deploy n8n to Cloud

**Option 1: Railway**

1. Create account at [railway.app](https://railway.app/)
2. New Project → Deploy from GitHub
3. Add environment variables from `n8n/.env`
4. Set webhook URL in frontend `.env`

**Option 2: DigitalOcean**

1. Create a Droplet (Ubuntu 22.04)
2. Install Docker
3. Clone repo and run `docker-compose up -d`
4. Configure domain and SSL
5. Update webhook URLs

**Option 3: n8n Cloud**

1. Sign up at [n8n.cloud](https://n8n.cloud/)
2. Import workflows
3. Configure credentials
4. Much easier but costs $20/month

### Update Frontend .env

```env
# Change from localhost to production URL
VITE_N8N_WEBHOOK_BASE=https://your-n8n-domain.com/webhook
```

### Secure Your n8n Instance

1. **Enable HTTPS** (required for OAuth)
2. **Change default password** in `n8n/.env`
3. **Limit IP access** if possible
4. **Regular backups** of workflow configs
5. **Monitor logs** for suspicious activity

---

## Troubleshooting

### Workflow Not Running

**Check:**
1. Is workflow "Active"? (toggle switch)
2. Is n8n container running? (`docker-compose ps`)
3. Check execution history for errors

### YouTube OAuth Issues

**Problem:** "redirect_uri_mismatch"

**Solution:**
1. Go to Google Cloud Console
2. OAuth credentials → Edit
3. Add n8n callback URL: `http://localhost:5678/rest/oauth2-credential/callback`

### Webhook Not Receiving Data

**Check:**
1. Is workflow activated?
2. Is webhook URL correct in frontend?
3. Test with curl command
4. Check n8n logs for incoming requests

---

## Workflow Customization

### Change Comment Check Frequency

1. Open "Comment Monitor" workflow
2. Click "Schedule Trigger" node
3. Change "Minutes Interval" (default: 5)
4. Save workflow

### Customize AI Reply Prompt

1. Open "Comment Monitor" workflow
2. Click "Generate AI Reply" node
3. Edit the "System" message under "Messages"
4. Adjust tone, length, or guidelines
5. Test and save

### Add Sentiment Analysis

Already included in the AI prompt! The system considers:
- Comment sentiment (positive/neutral/negative)
- Video context
- Your brand voice

---

## Cost Optimization

### Reduce API Costs

1. **YouTube API:**
   - Free tier: 10,000 units/day
   - Listing comments: ~1 unit per request
   - Stay within limits: ~2,000 checks/day

2. **OpenAI Costs:**
   - GPT-4: ~$0.03 per reply
   - Whisper: ~$0.006 per minute
   - Limit transcription to new videos only

3. **n8n:**
   - Self-hosted: Free (just server costs)
   - n8n Cloud: $20/month for unlimited workflows

### Optimize Workflow

1. **Cache transcripts** - don't re-transcribe
2. **Batch comment checks** - fewer API calls
3. **Filter spam** - don't reply to obvious spam
4. **Rate limit** - prevent accidental API overuse

---

## Support

**n8n Community:**
- [n8n Community Forum](https://community.n8n.io/)
- [n8n Docs](https://docs.n8n.io/)

**Project Issues:**
- GitHub Issues
- Email: avesohel@gmail.com

---

## Next Steps

After n8n is configured:

1. Test end-to-end flow with real YouTube video
2. Monitor first few executions for errors
3. Adjust AI prompt based on reply quality
4. Set up alerts for failed executions
5. Plan for scaling (if needed)

---

**Happy Automating! 🚀**
