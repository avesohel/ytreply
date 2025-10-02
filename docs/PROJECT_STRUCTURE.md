# Project Structure

This document explains the organization of the YTReply project.

```
ytreply/
├── .github/                    # GitHub configuration
│   └── workflows/              # CI/CD workflows
│       └── ci.yml              # Build and test automation
│
├── docs/                       # Documentation
│   ├── guides/                 # Setup and configuration guides
│   │   ├── SETUP.md            # Complete setup guide
│   │   └── N8N_SETUP.md        # n8n workflow configuration
│   ├── api/                    # API documentation (future)
│   ├── QUICKSTART.md           # Quick start guide (15 min)
│   └── PROJECT_STRUCTURE.md    # This file
│
├── frontend/                   # React frontend application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/              # Page components
│   │   │   ├── Home.tsx        # Landing page
│   │   │   ├── Login.tsx       # Authentication
│   │   │   ├── Signup.tsx      # User registration
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── Dashboard.tsx   # Main dashboard
│   │   │   ├── Videos.tsx      # Video management
│   │   │   ├── Channels.tsx    # Channel management
│   │   │   ├── Settings.tsx    # User settings
│   │   │   └── Pricing.tsx     # Pricing page
│   │   ├── lib/                # Utilities and configuration
│   │   │   ├── supabase.ts     # Supabase client
│   │   │   └── auth-store.ts   # Zustand auth store
│   │   ├── App.tsx             # Main app with routing
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── .env                    # Environment variables (gitignored)
│   ├── .env.example            # Environment template
│   ├── package.json            # Dependencies
│   ├── tsconfig.json           # TypeScript config
│   ├── tailwind.config.js      # Tailwind config
│   ├── postcss.config.js       # PostCSS config
│   ├── vite.config.ts          # Vite config
│   └── vercel.json             # Vercel deployment config
│
├── n8n/                        # n8n automation workflows
│   ├── docker-compose.yml      # Docker setup
│   ├── .env                    # n8n credentials
│   ├── wf1_comment_monitor.json      # Comment monitoring workflow
│   └── wf2_video_transcript.json     # Video transcription workflow
│
├── scripts/                    # Utility scripts
│   ├── supabase-schema.sql     # Database schema
│   └── check-db.mjs            # Database checker (dev tool)
│
├── .gitignore                  # Git ignore rules
├── README.md                   # Project overview
└── LICENSE                     # License file (future)
```

---

## Directory Purposes

### Root Level

**Configuration files only** - Keep the root clean with just essential config files and README.

### `/docs`

**All documentation** organized by type:
- `guides/` - Step-by-step setup and configuration
- `api/` - API documentation (planned)
- General docs like QUICKSTART.md at root of docs/

### `/frontend`

**Complete React application** with clear separation:
- `src/components/` - Reusable UI components
- `src/pages/` - Route-level page components
- `src/lib/` - Utilities, configs, stores

### `/n8n`

**Automation workflows** with:
- Docker configuration
- Workflow definitions (JSON)
- Environment configuration

### `/scripts`

**Utility scripts** for:
- Database setup/migration
- Development tools
- Deployment helpers

### `/.github`

**GitHub-specific files**:
- CI/CD workflows
- Issue templates (future)
- Pull request templates (future)

---

## File Naming Conventions

### React Components
- **PascalCase**: `DashboardLayout.tsx`, `ProtectedRoute.tsx`
- One component per file
- Colocate styles/tests if needed

### Pages
- **PascalCase**: `Dashboard.tsx`, `Videos.tsx`
- One page per file
- Named after the route

### Utilities
- **kebab-case**: `auth-store.ts`, `supabase.ts`
- Descriptive names
- Keep focused and small

### Documentation
- **SCREAMING_SNAKE_CASE**: `README.md`, `SETUP.md`
- Clear, descriptive names
- Markdown format

### Scripts
- **kebab-case**: `supabase-schema.sql`
- Include file extension
- Document usage in comments

---

## Adding New Features

### New Page
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Add navigation link in `DashboardLayout.tsx` if protected

### New Component
1. Create in `frontend/src/components/`
2. Export default
3. Import where needed

### New Workflow
1. Create workflow in n8n UI
2. Export as JSON
3. Save to `n8n/` directory
4. Document in `N8N_SETUP.md`

### New Script
1. Create in `scripts/` directory
2. Add usage documentation
3. Update this file

---

## Clean Code Principles

1. **Single Responsibility** - Each file/component does one thing
2. **DRY** - Don't repeat yourself, extract common logic
3. **Clear Naming** - Names should be self-documenting
4. **Small Functions** - Keep functions under 50 lines
5. **Type Safety** - Use TypeScript types everywhere
6. **Documentation** - Add JSDoc for complex functions

---

## Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes
# ... edit files ...

# 3. Test locally
cd frontend && npm run dev

# 4. Build and check
npm run build

# 5. Commit with clear message
git commit -m "feat: add new feature"

# 6. Push and create PR
git push origin feature/new-feature
```

---

## Maintenance

### Regular Tasks

- **Update dependencies** monthly
- **Review and archive** old documentation
- **Clean up unused** files and imports
- **Refactor** when files get too large (>300 lines)
- **Document** new patterns and conventions

### When to Refactor

- Component exceeds 300 lines
- Function exceeds 50 lines
- File has >5 dependencies
- Code is duplicated >3 times
- Tests are hard to write

---

**Keep it clean, keep it simple, keep it maintainable!**
