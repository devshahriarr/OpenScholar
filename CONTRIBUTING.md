# Contributing to OpenScholar

Thank you for your interest in contributing to OpenScholar! This document provides guidelines for contributing to the project.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Messages](#commit-messages)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [Reporting Issues](#reporting-issues)

---

## 🤝 Code of Conduct

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

---

## 🚀 Getting Started

### 1. Fork the repository

```bash
# On GitHub, click the "Fork" button
```

### 2. Clone your fork

```bash
git clone https://github.com/YOUR-USERNAME/OpenScholar.git
cd OpenScholar
```

### 3. Add upstream remote

```bash
git remote add upstream https://github.com/original-repo/OpenScholar.git
git fetch upstream
```

### 4. Create a feature branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number
```

### 5. Setup local environment

```bash
npm install
# Create .env.local with your configuration
npx prisma migrate dev
npm run dev
```

---

## 💻 Development Workflow

### Before Starting

1. Check the [Project Status Report](docs/Project\ Status/project_status_report.md)
2. Review the [Implementation Plan](docs/implementation_plan.md)
3. Look at [existing issues](https://github.com/your-repo/issues)
4. Read relevant [documentation](docs/)

### While Developing

1. Create a feature branch from `main`
2. Make small, focused commits
3. Follow coding standards (see below)
4. Test your changes locally
5. Keep your branch up-to-date

```bash
# Update your branch with latest changes
git fetch upstream
git rebase upstream/main
```

### Before Submitting

1. Run linting: `npm run lint`
2. Run type check: `npx tsc --noEmit`
3. Run build: `npm run build`
4. Test your changes thoroughly
5. Write/update tests if applicable

---

## 📝 Coding Standards

**Please follow the project's coding standards strictly:**

- Read: [docs/engineering/coding-standards.md](docs/engineering/coding-standards.md)
- Read: [docs/engineering/best-practices.md](docs/engineering/best-practices.md)
- Read: [docs/engineering/security-guidelines.md](docs/engineering/security-guidelines.md)

### Key Rules

#### File & Folder Naming
```
✅ kebab-case for files/folders
❌ camelCase or PascalCase for files/folders

Examples:
- user-service.ts ✅
- userService.ts ❌
- UserService.ts ❌
```

#### Variable & Function Naming
```
✅ camelCase for variables and functions
Examples:
- const userEmail = "..."
- function getUserById() {}
```

#### Component Naming
```
✅ PascalCase for React components
Examples:
- export default function UserCard() {}
- export default function PaperList() {}
```

#### Constants
```
✅ UPPER_SNAKE_CASE for constants
Examples:
- const MAX_FILE_SIZE = 50 * 1024 * 1024
- const API_TIMEOUT = 5000
```

#### TypeScript
```
✅ Use strict types, avoid `any`
interface User {
  id: string
  email: string
  name: string
}

❌ Don't use any
const data: any = ...
```

#### Max Line Length
- Keep lines under 100 characters
- Break long lines for readability

#### Indentation
- Use 2 spaces (not tabs)

#### Imports
```
✅ Group imports
import React from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { prisma } from '@/lib/db'

❌ Random order
```

---

## 📮 Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance, dependency updates
- `ci`: CI/CD configuration changes

### Scope

- `auth`: Authentication module
- `paper`: Paper management
- `search`: Search functionality
- `engagement`: Comments, reactions
- `admin`: Admin features
- `ui`: UI components
- `db`: Database schema
- etc.

### Examples

```bash
# Good examples
git commit -m "feat(auth): add email verification flow"
git commit -m "fix(search): filter approved papers only"
git commit -m "refactor(paper): simplify version tracking"
git commit -m "docs(readme): add installation guide"
git commit -m "test(auth): add login test cases"

# Avoid
git commit -m "fixed stuff"
git commit -m "Update"
git commit -m "Changes"
```

### Subject Line

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- Don't end with a period
- Limit to 50 characters

### Body

- Explain _what_ and _why_, not _how_
- Wrap at 72 characters
- Separate from subject with a blank line

### Example

```
feat(search): implement full-text search

Add PostgreSQL full-text search to paper searching.
This improves search performance and relevance.

- Use GIN index for faster queries
- Support keyword and title search
- Add sorting by relevance

Closes #123
```

---

## 🔄 Pull Request Process

### 1. Keep commits clean

```bash
# Before submitting, squash related commits if needed
git rebase -i upstream/main
```

### 2. Push to your fork

```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request on GitHub

Include:
- **Title**: Clear, descriptive title
- **Description**: What does this PR do?
- **Why**: Why is this change needed?
- **Related Issues**: Closes #123
- **Testing**: How to test the changes?
- **Screenshots**: If UI changes

### PR Template

```markdown
## What does this PR do?
Brief description of changes

## Why?
Explain the motivation

## How to test?
1. Step 1
2. Step 2
3. Expected result

## Related Issues
Closes #123

## Checklist
- [ ] Code follows project standards
- [ ] No console errors
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Commits are clean and descriptive
```

### 4. Address review feedback

- Respond to comments
- Make requested changes
- Push updates
- Request re-review

### 5. Merge

Once approved, your PR will be merged by a maintainer.

---

## 🧪 Testing

### Run Tests

```bash
# Lint check
npm run lint

# Type check
npx tsc --noEmit

# Build
npm run build
```

### Manual Testing

Before submitting:
1. Test in development: `npm run dev`
2. Test the specific feature you changed
3. Test related features
4. Check for console errors (F12)
5. Check database (if applicable)

### When to Write Tests

- New API endpoints
- Complex business logic
- Bug fixes (add test to prevent regression)
- Shared utilities

---

## 🐛 Reporting Issues

### When Reporting Bugs

Include:
1. **Description**: What is the bug?
2. **Steps to reproduce**: How to trigger it?
3. **Expected behavior**: What should happen?
4. **Actual behavior**: What actually happened?
5. **Environment**:
   - OS (Windows/macOS/Linux)
   - Node version
   - Browser (if applicable)
6. **Screenshots**: If visual issue
7. **Logs**: Console errors or server logs

### When Requesting Features

Include:
1. **Description**: What feature?
2. **Use case**: Why is it needed?
3. **Alternative solutions**: Any workarounds?
4. **Related issues**: Similar requests?

---

## 📚 Project Structure for Contributors

```
src/
├── app/                  # Pages & API routes
│   ├── (auth)/           # Authentication pages
│   ├── (dashboard)/      # User pages
│   ├── admin/            # Admin pages
│   └── api/              # REST API endpoints
├── modules/              # Business logic (feature-based)
│   ├── auth/
│   ├── paper/
│   ├── search/
│   └── ...
├── components/           # React components
│   ├── ui/               # Reusable UI components
│   ├── admin/
│   └── dashboard/
├── lib/                  # Utilities
│   ├── auth.ts           # JWT helpers
│   ├── db.ts             # Prisma client
│   └── storage.ts        # File upload
├── types/                # TypeScript types
├── middleware.ts         # Route protection
└── config/               # Configuration

prisma/
├── schema.prisma         # Main schema
├── *.prisma              # Module-specific schemas
└── migrations/           # Database migrations

docs/
├── product/              # Product requirements
├── requirements/         # Technical specs
├── design/               # Architecture & design
└── engineering/          # Code standards
```

---

## 🎯 Priority Areas for Contribution

Based on the [Project Status](docs/Project\ Status/project_status_report.md), these areas need help:

### High Priority (Needs Work)

1. **Paper Management APIs** - Implement missing endpoints
2. **Search Functionality** - Full-text search implementation
3. **Engagement APIs** - Comments, reactions, saves
4. **Admin Moderation** - Approval workflow
5. **Analytics Tracking** - Event logging and dashboards
6. **Notifications** - Real-time notification system

### Medium Priority

1. **Error Handling** - Improve error messages
2. **Performance** - Database query optimization
3. **Testing** - Unit & integration tests
4. **Documentation** - API docs, setup guides

### Low Priority

1. **UI Polish** - Minor styling improvements
2. **Accessibility** - a11y enhancements
3. **Performance** - Optimization for mature features

---

## 📞 Questions?

- Ask in GitHub discussions
- Check existing documentation in `/docs`
- Review similar code in the codebase
- Contact project maintainer

---

## ✨ Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- GitHub contributors page
- Release notes

---

**Thank you for contributing to OpenScholar! 🎉**

Your efforts help make academic research more accessible to everyone.
