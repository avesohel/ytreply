# Contributing to YTReply

First off, thank you for considering contributing to YTReply! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

---

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and professional in all interactions.

---

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a branch** for your changes
4. **Make your changes** with clear commits
5. **Push to your fork** and submit a pull request

---

## Development Setup

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Supabase account
- Git

### Initial Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ytreply.git
cd ytreply

# Install frontend dependencies
cd frontend
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

### Running the Full Stack

```bash
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: n8n
cd n8n && docker-compose up

# Terminal 3: Database checker
node scripts/check-db.mjs
```

---

## Project Structure

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for detailed explanation.

**Key directories:**
- `frontend/src/pages/` - Page components
- `frontend/src/components/` - Reusable components
- `frontend/src/lib/` - Utilities and stores
- `n8n/` - Automation workflows
- `scripts/` - Utility scripts
- `docs/` - Documentation

---

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define interfaces for all data structures
- Avoid `any` type - use `unknown` if necessary
- Enable strict mode

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  name: string | null;
}

const user: User = await getUser();

// ❌ Bad
const user: any = await getUser();
```

### React Components

- Use functional components with hooks
- One component per file
- Use named exports for components
- Add JSDoc comments for complex logic

```typescript
/**
 * Dashboard component showing user statistics
 * @returns Dashboard page
 */
export default function Dashboard() {
  // Component logic
}
```

### Styling

- Use Tailwind CSS utility classes
- Keep classes alphabetically sorted when possible
- Extract repeated patterns into components
- Use responsive design (mobile-first)

```tsx
// ✅ Good
<button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
  Click me
</button>

// ❌ Bad - inline styles
<button style={{ background: 'blue', padding: '8px' }}>
  Click me
</button>
```

### File Naming

- **Components**: `PascalCase.tsx`
- **Utilities**: `kebab-case.ts`
- **Pages**: `PascalCase.tsx`
- **Documentation**: `SCREAMING_SNAKE_CASE.md`

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <subject>

# Examples
feat(auth): add Google OAuth login
fix(dashboard): correct stats calculation
docs(setup): update API key instructions
style(videos): improve mobile responsiveness
refactor(components): extract common button styles
test(auth): add login flow tests
chore(deps): update dependencies
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

---

## Pull Request Process

### Before Submitting

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Run linter**: `npm run lint`
4. **Build successfully**: `npm run build`
5. **Test locally** - verify your changes work

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Build passes successfully
- [ ] Tested on multiple browsers (if UI change)
- [ ] Mobile responsive (if UI change)

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tests added/updated
```

---

## Testing

### Manual Testing

Before submitting a PR:

1. **Test the happy path** - normal user flow
2. **Test edge cases** - empty states, errors
3. **Test different screen sizes** - mobile, tablet, desktop
4. **Test different browsers** - Chrome, Firefox, Safari

### Automated Testing (Future)

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

---

## Common Tasks

### Adding a New Page

1. Create component in `frontend/src/pages/NewPage.tsx`
2. Add route in `frontend/src/App.tsx`
3. Add navigation link in `DashboardLayout.tsx` (if protected)
4. Test the page thoroughly
5. Update documentation if needed

### Adding a New API Endpoint

1. Create Supabase Edge Function (future)
2. Add TypeScript types
3. Update API documentation
4. Add error handling
5. Test with different inputs

### Updating Database Schema

1. Modify `scripts/supabase-schema.sql`
2. Test migration on dev database
3. Document breaking changes
4. Update TypeScript interfaces
5. Run `node scripts/check-db.mjs`

---

## Questions?

- **Documentation**: Check [docs/](docs/) first
- **Issues**: Search [existing issues](https://github.com/yourusername/ytreply/issues)
- **Email**: avesohel@gmail.com
- **Discussions**: Use GitHub Discussions (future)

---

## Recognition

Contributors will be added to the README.md in the Contributors section.

Thank you for contributing to YTReply! 🚀

---

_By contributing, you agree that your contributions will be licensed under the same license as the project._
