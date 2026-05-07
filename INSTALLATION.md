# OpenScholar - Installation & Setup Guide

> **Last Updated:** May 7, 2026  
> **For:** Next.js 16.2.4 + PostgreSQL + Prisma

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Clone Repository](#clone-repository)
3. [Environment Setup](#environment-setup)
4. [Install Dependencies](#install-dependencies)
5. [Database Setup](#database-setup)
6. [Generate Prisma Client](#generate-prisma-client)
7. [Run Development Server](#run-development-server)
8. [Verify Installation](#verify-installation)
9. [Troubleshooting](#troubleshooting)
10. [Production Build](#production-build)

---

## 📦 Prerequisites

### System Requirements

- **Node.js**: 18.0.0 or higher
  - [Download Node.js](https://nodejs.org/)
  - Verify: `node --version`

- **npm**: 9.0.0 or higher
  - Comes with Node.js
  - Verify: `npm --version`

- **PostgreSQL**: 15.0 or higher
  - [Download PostgreSQL](https://www.postgresql.org/download/)
  - Verify: `psql --version`

- **Git**: Any recent version
  - [Download Git](https://git-scm.com/)
  - Verify: `git --version`

### Operating System

- ✅ Windows (10, 11)
- ✅ macOS (10.15+)
- ✅ Linux (Ubuntu 18.04+, Debian, etc.)

### Optional but Recommended

- **VS Code**: Code editor
  - [Download VS Code](https://code.visualstudio.com/)
  - Extensions:
    - ES7+ React/Redux/React-Native snippets
    - Prettier - Code formatter
    - ESLint
    - Database Client (for PostgreSQL)

---

## 🔄 Clone Repository

### 1. Choose a directory for the project

```bash
# Example: Create a projects folder
mkdir ~/projects
cd ~/projects
```

### 2. Clone the repository

```bash
git clone https://github.com/yourusername/OpenScholar.git
cd OpenScholar
```

> **Note:** Replace `yourusername` with the actual GitHub repository URL

### 3. Verify the structure

```bash
ls -la
# You should see: src/, prisma/, docs/, package.json, etc.
```

---

## 🔧 Environment Setup

### 1. Create `.env.local` file

In the project root directory, create a new file named `.env.local`:

```bash
# Windows (PowerShell)
New-Item -Name ".env.local" -ItemType "file"

# macOS/Linux
touch .env.local
```

### 2. Configure environment variables

Add the following variables to `.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/openscholar"

# JWT Secret (generate a random string)
JWT_SECRET="your-secret-key-change-this-in-production"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email Service (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Optional: Storage (for file uploads)
STORAGE_TYPE="local"
# For S3/MinIO (if using cloud storage):
# S3_ENDPOINT="http://localhost:9000"
# S3_ACCESS_KEY="minioadmin"
# S3_SECRET_KEY="minioadmin"
# S3_BUCKET_NAME="openscholar"
```

### 3. Database credentials

Replace the placeholders in `DATABASE_URL`:
- `username` - Your PostgreSQL user (default: `postgres`)
- `password` - Your PostgreSQL password
- `localhost` - Database host (local: `localhost`)
- `5432` - PostgreSQL port (default: 5432)
- `openscholar` - Database name

**Example:**
```env
DATABASE_URL="postgresql://postgres:password123@localhost:5432/openscholar"
```

### 4. JWT Secret

Generate a secure random string:

**On Linux/macOS:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -Minimum 1000000 -Maximum 9999999)))
```

Or use any online [random generator](https://www.random.org/strings/) and paste the result.

---

## 📥 Install Dependencies

### 1. Install Node packages

```bash
npm install
```

This will install:
- Next.js 16.2.4
- React 19.2.4
- TypeScript
- Prisma 7.8.0
- Tailwind CSS
- And other dependencies

**Expected duration:** 2-5 minutes (depends on internet speed)

### 2. Verify installation

```bash
npm list next prisma react
# Should show version numbers without errors
```

---

## 🗄️ Database Setup

### 1. Create PostgreSQL database

**Option A: Using psql (Command Line)**

```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql prompt:
CREATE DATABASE openscholar;
\q
```

**Option B: Using pgAdmin (GUI)**

1. Open pgAdmin 4
2. Right-click "Databases" → Create → Database
3. Enter name: `openscholar`
4. Click Save

**Option C: Using DBeaver (GUI)**

1. Open DBeaver
2. Connect to PostgreSQL server
3. Right-click server → Create New Database
4. Name: `openscholar`

### 2. Test database connection

```bash
psql -U postgres -d openscholar -c "SELECT version();"
```

You should see the PostgreSQL version if connected successfully.

---

## 🔄 Generate Prisma Client

### 1. Run Prisma migrations

```bash
npx prisma migrate dev --name init
```

This will:
- Create all database tables
- Generate Prisma client
- **Prompts:** You may be asked if you want to generate seed data (optional)

### 2. Verify database tables

```bash
npx prisma studio
```

This opens a visual database browser at `http://localhost:5555`

### 3. Expected tables

You should see these tables:
- `users`
- `papers`
- `paper_versions`
- `comments`
- `reactions`
- `categories`
- `roles`
- And others...

---

## 🚀 Run Development Server

### 1. Start the development server

```bash
npm run dev
```

**Output should show:**
```
▲ Next.js 16.2.4
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

### 2. Open in browser

```
http://localhost:3000
```

You should see the OpenScholar landing page.

### 3. Stop the server

Press `Ctrl + C` in the terminal

---

## ✅ Verify Installation

### Test the following features:

#### 1. **Landing Page**
- Navigate to `http://localhost:3000`
- Should display hero section, stats, featured papers
- ✅ Page loads without errors

#### 2. **Search Page**
- Navigate to `http://localhost:3000/search`
- Should display search interface
- ✅ No console errors

#### 3. **Register Page**
- Navigate to `http://localhost:3000/register`
- Fill in form with:
  - Name: `Test User`
  - Email: `test@example.com`
  - Password: `test123456`
- Click "Sign Up"
- ✅ Should show success message

#### 4. **Login Page**
- Navigate to `http://localhost:3000/login`
- Enter credentials:
  - Email: `test@example.com`
  - Password: `test123456`
- Click "Sign In"
- ✅ Should redirect to `/search` after successful login

#### 5. **Check Database**
- Run: `npx prisma studio`
- Should show data in `users` table
- ✅ New user created successfully

---

## 🛠️ Troubleshooting

### Issue: "Cannot find module '@/lib/db'"

**Solution:**
```bash
npm install
npx prisma generate
```

---

### Issue: "Database connection refused"

**Check:**
```bash
# Verify PostgreSQL is running
# Windows:
sc query postgresql-x64-15
# macOS:
brew services list | grep postgresql
# Linux:
sudo systemctl status postgresql
```

**Start PostgreSQL:**
- **Windows:** Start "PostgreSQL" from Services
- **macOS:** `brew services start postgresql`
- **Linux:** `sudo systemctl start postgresql`

---

### Issue: "DATABASE_URL is not set"

**Solution:**
1. Verify `.env.local` exists in project root
2. Check file has: `DATABASE_URL="postgresql://..."`
3. Restart dev server: `npm run dev`

---

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Kill the process using port 3000
# Windows (PowerShell):
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

Or use a different port:
```bash
npm run dev -- -p 3001
# Then visit http://localhost:3001
```

---

### Issue: "Missing SMTP credentials for email"

**Solution:**
If you see email sending errors, either:

1. **Skip email verification (Development only):**
   - Update `.env.local`:
   ```env
   SKIP_EMAIL_VERIFICATION=true
   ```

2. **Setup Gmail SMTP:**
   - Enable 2-factor authentication on Gmail
   - Generate app password: https://myaccount.google.com/apppasswords
   - Add to `.env.local`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-digit-app-password
   ```

---

### Issue: "Prisma migration error"

**Solution:**
```bash
# Reset database (deletes all data!)
npx prisma migrate reset

# Or manually:
npx prisma migrate deploy
npx prisma generate
```

---

### Issue: "TypeScript errors in VS Code"

**Solution:**
```bash
# Rebuild TypeScript
npm run build

# Check for type errors
npx tsc --noEmit
```

---

## 🏗️ Production Build

### 1. Create production build

```bash
npm run build
```

### 2. Start production server

```bash
npm start
```

### 3. Expected output

```
▲ Next.js 16.2.4
  - Local:        http://localhost:3000

✓ Ready in 1.2s
```

---

## 📁 Project Structure (Quick Reference)

```
OpenScholar/
├── src/
│   ├── app/              # Next.js pages & API routes
│   ├── components/       # React components
│   ├── lib/              # Utilities (auth, db, storage)
│   ├── modules/          # Business logic
│   ├── types/            # TypeScript types
│   └── middleware.ts     # Route protection
├── prisma/               # Database schema & migrations
├── public/               # Static files
├── docs/                 # Documentation
├── .env.local            # Environment variables (create this)
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── next.config.mjs       # Next.js config
└── README.md             # Project overview
```

---

## 🔑 Key Files to Know

| File | Purpose |
|------|---------|
| `.env.local` | Secret credentials (create manually) |
| `prisma/schema.prisma` | Database schema |
| `src/middleware.ts` | Route protection |
| `src/lib/auth.ts` | JWT authentication |
| `src/lib/db.ts` | Prisma client |
| `src/app/layout.tsx` | Root layout |

---

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Project Documentation
- [README.md](README.md) - Project overview
- [docs/product/PRD.md](docs/product/PRD.md) - Product requirements
- [docs/requirements/SRS.md](docs/requirements/SRS.md) - Specifications
- [docs/engineering/coding-standards.md](docs/engineering/coding-standards.md) - Code standards

### Helpful Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npx prisma studio       # Visual database browser
npx prisma migrate dev  # Create migration
npx prisma db seed      # Seed sample data

# Production
npm run build            # Create production build
npm start                # Start production server

# Debugging
npm run lint             # Check for linting errors
npx tsc --noEmit         # Check TypeScript errors

# Cleanup
npm install              # Reinstall all dependencies
npx prisma generate      # Regenerate Prisma client
```

---

## ✨ Next Steps After Installation

1. ✅ **Verify Setup** - Follow [Verify Installation](#verify-installation)
2. 📖 **Read Documentation** - Check [docs/](docs/) folder
3. 🎨 **Explore UI** - Visit all pages to see the interface
4. 🗄️ **Check Database** - Run `npx prisma studio`
5. 👥 **Create Test Users** - Register and login
6. 📝 **Review Code** - Explore [src/](src/) folder
7. 🚀 **Start Development** - Make your first changes!

---

## 🆘 Need Help?

### Check These First
1. Review [Troubleshooting](#troubleshooting) section
2. Read error messages carefully
3. Check browser console (F12) for errors
4. Run `npm run build` to check for TypeScript errors

### Ask for Help
- Create an issue on GitHub
- Contact project maintainer
- Check project documentation in `/docs` folder

---

## 📝 Installation Checklist

Before you start developing, ensure:

- [ ] Node.js 18+ installed
- [ ] PostgreSQL 15+ running locally
- [ ] Repository cloned
- [ ] `.env.local` file created with credentials
- [ ] `npm install` completed
- [ ] `npx prisma migrate dev` completed
- [ ] Development server starts: `npm run dev`
- [ ] Can access `http://localhost:3000`
- [ ] Can register and login
- [ ] Database contains new user

✅ **Ready to develop!**

---

**Last Updated:** May 7, 2026  
**Version:** 1.0  
**Compatibility:** Next.js 16.2.4 + PostgreSQL 15+
