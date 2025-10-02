# YTReply - AI-Powered YouTube Comment Automation

**Automate your YouTube comments with GPT-4 and save hours every week.**

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-19.1-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/supabase-latest-3ECF8E?logo=supabase)](https://supabase.com/)

---

## 🚀 Features

- **AI-Powered Replies**: GPT-4 generates context-aware responses based on video content
- **Real-Time Monitoring**: Automatically checks for new comments every 5 minutes
- **Video Transcription**: Uses OpenAI Whisper to understand video context
- **Multi-Channel Support**: Manage multiple YouTube channels (plan-dependent)
- **Custom Templates**: Create reply templates that match your brand voice
- **Sentiment Analysis**: AI detects comment sentiment for appropriate responses
- **Usage Analytics**: Track reply stats and engagement metrics
- **Secure Authentication**: Email + Google OAuth via Supabase
- **Flexible Pricing**: Free forever plan available, upgrade as you grow

---

## 📋 Table of Contents

- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [API Costs](#api-costs)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## 🎥 Demo

🔗 **Live Demo:** [Coming Soon]

**Test Account:**
- Email: `demo@ytreply.com`
- Password: `demo123456`

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool (using Rolldown)
- **Tailwind CSS 4** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **React Hot Toast** - Notifications
- **Lucide Icons** - Icon library

### Backend & Database
- **Supabase** - PostgreSQL + Auth + Storage
- **n8n** - Workflow automation (self-hosted)
- **Edge Functions** - Serverless functions (planned)

### APIs & Services
- **YouTube Data API v3** - Comment management
- **OpenAI GPT-4** - AI reply generation
- **OpenAI Whisper** - Video transcription
- **Stripe** - Payment processing

### Infrastructure
- **Vercel** - Frontend hosting
- **Docker** - n8n containerization
- **GitHub Actions** - CI/CD (planned)

---

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Supabase account
- Google Cloud account (YouTube API)
- OpenAI API key

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/ytreply.git
cd ytreply
```

### 2. Setup Supabase

```bash
# Run the schema SQL in Supabase SQL Editor
cat scripts/supabase-schema.sql
```

### 3. Configure Environment

```bash
cd frontend
cp .env.example .env
# Edit .env with your credentials
```

### 4. Install & Run Frontend

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### 5. Start n8n

```bash
cd ../n8n
docker-compose up -d
```

n8n runs at `http://localhost:5678`

### 6. Configure n8n Workflows

See [N8N_SETUP.md](docs/guides/N8N_SETUP.md) for detailed workflow configuration.

---

## 📚 Documentation

- **[Quick Start Guide](docs/QUICKSTART.md)** - Get running in 15 minutes
- **[Complete Setup Guide](docs/guides/SETUP.md)** - Full setup with all APIs
- **[n8n Configuration](docs/guides/N8N_SETUP.md)** - Workflow setup
- **[Project Structure](docs/PROJECT_STRUCTURE.md)** - Codebase organization
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute

---

## 📁 Project Structure

```
ytreply/
├── .github/                 # GitHub configuration
│   └── workflows/           # CI/CD pipelines
│
├── docs/                    # Documentation
│   ├── guides/              # Setup guides
│   │   ├── SETUP.md         # Complete setup
│   │   └── N8N_SETUP.md     # n8n configuration
│   ├── QUICKSTART.md        # Quick start (15 min)
│   └── PROJECT_STRUCTURE.md # This file
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── lib/             # Utilities & config
│   │   ├── App.tsx          # Main app with routing
│   │   └── main.tsx         # Entry point
│   ├── .env.example         # Environment template
│   ├── vercel.json          # Vercel config
│   └── package.json
│
├── n8n/                     # n8n automation
│   ├── docker-compose.yml   # Docker config
│   ├── .env                 # n8n credentials
│   ├── wf1_comment_monitor.json
│   └── wf2_video_transcript.json
│
├── scripts/                 # Utility scripts
│   ├── supabase-schema.sql  # Database schema
│   └── check-db.mjs         # DB checker
│
├── .gitignore               # Git ignore rules
├── LICENSE                  # MIT License
├── CONTRIBUTING.md          # Contribution guide
└── README.md                # This file
```

📖 **[View detailed structure →](docs/PROJECT_STRUCTURE.md)**

---

## 💰 API Costs

### YouTube Data API
- **Free Tier:** 10,000 units/day
- **Comment operations:** ~1-5 units each
- **Cost:** FREE (within limits)

### OpenAI API
- **GPT-4:** ~$0.03 per reply (depends on length)
- **Whisper:** ~$0.006 per minute of audio
- **Estimated:** $10-50/month for moderate usage

### Supabase
- **Free Tier:**
  - 500MB database
  - 50,000 monthly active users
  - 2GB bandwidth
- **Pro:** $25/month for more resources

### n8n
- **Self-hosted:** FREE (just server costs ~$5/month)
- **n8n Cloud:** $20/month

**Total Estimated Cost:** $15-100/month depending on usage

---

## 🗺 Roadmap

### Phase 1: MVP ✅
- [x] Authentication system
- [x] Video management
- [x] Basic dashboard
- [x] n8n workflows
- [x] Database schema

### Phase 2: Core Features 🚧
- [ ] YouTube OAuth integration
- [ ] Stripe payment processing
- [ ] Reply templates
- [ ] Sentiment analysis display
- [ ] Email notifications

### Phase 3: Advanced Features 📋
- [ ] Team collaboration
- [ ] Advanced analytics
- [ ] Custom AI prompts
- [ ] White-label branding
- [ ] Mobile app

### Phase 4: Scale 🚀
- [ ] Multi-language support
- [ ] A/B testing for replies
- [ ] AI training on your data
- [ ] API for developers
- [ ] Webhook integrations

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright © 2025 Ali Sohel

---

## 👨‍💻 Author

**Ali Sohel**
- Email: avesohel@gmail.com
- GitHub: [@avesohel](https://github.com/avesohel)
- Twitter: [@avesohel](https://twitter.com/avesohel)

---

## 🙏 Acknowledgments

- OpenAI for GPT-4 and Whisper APIs
- Supabase for amazing backend infrastructure
- n8n for workflow automation
- Vercel for hosting

---

## 📞 Support

Need help?
- 📧 Email: avesohel@gmail.com
- 💬 Discord: [Join Community](https://discord.gg/ytreply) (coming soon)
- 📖 Docs: [Read Documentation](./SETUP.md)

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Made with ❤️ by Ali Sohel**
