<div align="center">
  
# 🚀 batuhdede.me | Premium Portfolio & CMS

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Framer_Motion-white?style=for-the-badge&logo=framer" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

A full-stack, ultra-modern, multilingual portfolio website with a built-in headless CMS - powered by Supabase and deployed on Vercel.

**Every piece of content is admin-editable. No code changes needed to update your portfolio.**

[🌐 Live Website](https://batuhdede.me) · [🐛 Report Bug](https://github.com/batuhd/batuhd.github.io/issues)

</div>

<br />

<div align="center">
  <img width="100%" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" alt="Project Preview" src="./c1.gif" />
</div>

---

## ✨ What Is This?

This is **not** a static portfolio template. It's a production-grade **Content Management System (CMS)** disguised as a premium developer portfolio. Everything you see on the public-facing website is dynamically fetched from a Supabase PostgreSQL database and fully manageable through a secure admin dashboard at `/admin`.

**Key idea:** Clone it, connect your Supabase, and you have a fully functional portfolio site with an admin panel - no backend code to write.

---

## 🌟 Feature Highlights

### 🛠️ Built-in Admin Dashboard (`/admin`)

A complete CMS dashboard with categorized sidebar navigation for managing every piece of your portfolio:

| Category               | What You Can Manage                                                    |
| ---------------------- | ---------------------------------------------------------------------- |
| **Profile & Identity** | Name, role, tagline, bio, profile photo, favorite quote, custom stats  |
| **Portfolio Content**  | Projects/works (with live links, GitHub, tags, images) and blog posts  |
| **Resume Data**        | Experience, education, skills, languages, certifications, activities   |
| **Configuration**      | Social links, section reordering, visibility toggles, maintenance mode |

Every field supports **4 languages** (EN, TR, DE, ES) with an intuitive language tab switcher. Sections can be individually hidden/shown and reordered with drag-style up/down controls.

### 🌍 Multilingual System (i18n)

- Real-time language switching without page reloads
- 4 languages supported out of the box: **English, Turkish, German, Spanish**
- Translations are managed per-field in the admin panel - not in JSON files
- Static UI strings use a typed `translations.ts` dictionary

### 🎨 Kinetic UI Design

- **Staggered fade-in animations** on every section via a reusable `<FadeIn />` component
- **Apple-style Dock navigation** with magnetic hover magnification effect
- **Spring-animated modals** for blog posts and project details
- Smooth page transitions powered by Framer Motion

### 🌓 Dark & Light Theme

Seamless theme switching via `next-themes` with system preference detection. All components are designed for both modes.

### 📊 Live GitHub Contribution Graph

A custom-built contribution heatmap that fetches your real GitHub activity through a serverless API route (`/api/github`), using the GitHub GraphQL API. Includes interactive tooltips with contribution counts per day.

### 📡 RSS Feed

Auto-generated RSS feed at `/feed.xml` for blog syndication, built as a Next.js Route Handler.

### 🔒 Enterprise-Grade Security

- **Row Level Security (RLS)** on every table - write access is locked to your specific user UUID
- **Sign-up disabled** - no one can create accounts on your Supabase instance
- **SQL injection impossible** - Supabase uses PostgREST with parameterized queries
- Public visitors get **read-only** access; all mutations require your admin session

### ⚡ Performance

- Server/Client component splitting with Next.js App Router
- Vercel Speed Insights & Analytics integration
- Optimized image loading with `next/image`
- Edge-deployed on Vercel's global CDN

---

## 💻 Tech Stack

| Layer               | Technology                                                           | Version |
| ------------------- | -------------------------------------------------------------------- | ------- |
| **Framework**       | [Next.js](https://nextjs.org/) (App Router)                          | 15      |
| **UI Library**      | [React](https://react.dev/)                                          | 19      |
| **Language**        | [TypeScript](https://www.typescriptlang.org/)                        | 5       |
| **Styling**         | [Tailwind CSS](https://tailwindcss.com/) + `tailwind-merge` + `clsx` | 4       |
| **Animations**      | [Framer Motion](https://www.framer.com/motion/)                      | 12      |
| **Icons**           | [Lucide React](https://lucide.dev/)                                  | Latest  |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS)          | Latest  |
| **Analytics**       | [Vercel Analytics](https://vercel.com/analytics) + Speed Insights    | Latest  |
| **Hosting**         | [Vercel](https://vercel.com/)                                        | -       |

---

## 📂 Project Architecture

```text
.
├── supabase_schema.sql          # Full database schema with RLS policies
├── .env.example                 # Environment variable template
│
└── src/
    ├── app/                     # Next.js App Router
    │   ├── page.tsx             # 🏠 Homepage - assembles all sections dynamically
    │   ├── admin/
    │   │   ├── login/           # 🔐 Auth gate (email/password)
    │   │   └── page.tsx         # 📋 Admin dashboard (full CMS)
    │   ├── blog/                # 📝 Blog feed with animated modals
    │   ├── works/               # 💼 Portfolio feed with animated modals
    │   ├── credits/             # 🏆 Tech credits & acknowledgments
    │   ├── api/github/          # 🔌 GitHub GraphQL API route handler
    │   └── feed.xml/            # 📡 RSS feed generator
    │
    ├── components/
    │   ├── admin/
    │   │   └── admin-tabs.tsx   # CMS forms: About, Skills, CRUD, Social, Layout
    │   ├── home/
    │   │   ├── info.tsx         # Hero section (name, photo, tagline)
    │   │   ├── about.tsx        # Bio + custom stats
    │   │   ├── skills.tsx       # Skill categories grid
    │   │   ├── profile-sections.tsx  # Experience, Education, Languages, etc.
    │   │   ├── github-contribution.tsx  # Live GitHub heatmap
    │   │   └── contact-form.tsx # Contact section
    │   ├── motion/
    │   │   └── fade-in.tsx      # Reusable staggered animation wrapper
    │   ├── navigation/
    │   │   └── dock.tsx         # Apple-style magnetic dock navigation
    │   └── theme-provider.tsx   # Dark/light mode provider
    │
    ├── config/
    │   ├── locales/             # Static UI translations (EN, TR, DE, ES)
    │   └── translations.ts     # Typed i18n dictionary
    │
    ├── context/
    │   ├── language-context.tsx # Global language provider with getLocalized()
    │   └── site-data-context.tsx  # Supabase data cache (fetches all tables once)
    │
    └── lib/
        ├── supabase.ts          # Supabase client singleton
        └── utils.ts             # cn() helper for Tailwind class merging
```

---

## 🗄️ Database Schema

The Supabase database consists of **11 tables**, all with Row Level Security enabled:

| Table              | Purpose                       | Key Fields                                            |
| ------------------ | ----------------------------- | ----------------------------------------------------- |
| `about_me`         | Profile information           | name, role, bio, photo, stats, quote + translations   |
| `skill_categories` | Grouped skills                | title, skills (JSON array) + translations             |
| `experiences`      | Work history                  | title, company, dates, description + translations     |
| `educations`       | Academic history              | university, degree, major, dates                      |
| `languages`        | Language proficiencies        | name, level                                           |
| `activities`       | Leadership & extracurriculars | organization, role, description + translations        |
| `certifications`   | Professional certifications   | name, issuer, date, link + translations               |
| `projects`         | Portfolio works               | title, description, links, tags (JSON) + translations |
| `blogs`            | Blog posts                    | title, excerpt, content, date + translations          |
| `social_links`     | Dock navigation links         | platform, URL                                         |
| `section_order`    | Homepage section ordering     | section_id, order_index                               |

Every content table supports **4-language translations** (EN, TR, DE, ES) with dedicated columns per language.

---

## 🔒 Security Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    PUBLIC VISITORS                       │
│              Can only READ data (SELECT)                 │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              SUPABASE ROW LEVEL SECURITY                 │
│                                                          │
│  SELECT  →  Anyone (public portfolio)                    │
│  INSERT  →  Only admin UUID                              │
│  UPDATE  →  Only admin UUID                              │
│  DELETE  →  Only admin UUID                              │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│                   ADMIN (you)                            │
│         Authenticated via Supabase Email Auth            │
│         Sign-ups disabled - only you can log in          │
└──────────────────────────────────────────────────────────┘
```

| Layer              | Protection                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **RLS Policies**   | All 11 tables have RLS enabled. Write operations (INSERT, UPDATE, DELETE) are locked to your specific user UUID - hardcoded in the schema. |
| **Authentication** | Supabase Email Auth. Sign-ups are disabled so no one else can create an account.                                                           |
| **SQL Injection**  | Impossible. Supabase uses PostgREST which parameterizes all queries automatically.                                                         |
| **API Keys**       | The `anon` key is safe to expose - it can only perform operations allowed by RLS policies (read-only for public).                          |

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- A free **[Supabase](https://supabase.com/)** account
- A **[GitHub Personal Access Token](https://github.com/settings/tokens)** (classic, with `read:user` scope) for the contribution graph
- A **[Vercel](https://vercel.com/)** account (for deployment, optional for local dev)

### 1. Clone & Install

```bash
git clone https://github.com/batuhd/batuhd.github.io.git
cd batuhd.github.io
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

```env
# Supabase - get these from your Supabase project dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# GitHub - create at https://github.com/settings/tokens (classic token, read:user scope)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

### 3. Database Setup

This is the most important step. The database uses **Row Level Security (RLS)** to ensure only you can modify data.

#### 3.1 - Create your admin account

Go to **Supabase Dashboard → Authentication → Users → Add user** and create your account with email and password. This is the account you'll use to log into the `/admin` dashboard.

#### 3.2 - Get your User UUID

Open **SQL Editor** in Supabase and run:

```sql
SELECT id, email FROM auth.users;
```

You'll see a result like this:

| id                                     | email             |
| -------------------------------------- | ----------------- |
| `a1b2c3d4-e5f6-7890-abcd-ef1234567890` | `you@example.com` |

Copy the `id` value. This is your **User UUID** - it uniquely identifies your admin account.

#### 3.3 - Configure the schema file

Open `supabase_schema.sql` in your editor and **find & replace all** occurrences of:

```
YOUR-USER-UUID-HERE
```

with the UUID you copied. For example:

```diff
- auth.uid() = 'YOUR-USER-UUID-HERE'::uuid
+ auth.uid() = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid
```

> **💡 Tip:** Use `Ctrl+H` (Windows) or `Cmd+H` (Mac) to replace all 33 occurrences at once.

#### 3.4 - Execute the schema

Copy the **entire** contents of your modified `supabase_schema.sql` and paste it into **Supabase SQL Editor → New Query**. Click **Run**. This creates all 11 tables, enables RLS, and sets up your security policies.

#### 3.5 - Lock down sign-ups

Go to **Authentication → Settings → Auth Providers → Email** and toggle off **"Allow new users to sign up"**.

> **⚠️ Critical:** Do NOT skip steps 3.3 and 3.5. Without them, anyone who discovers your Supabase URL could potentially create an account and modify your portfolio data.

### 4. Launch

```bash
npm run dev
```

| URL                              | Description            |
| -------------------------------- | ---------------------- |
| `http://localhost:3000`          | Your portfolio website |
| `http://localhost:3000/admin`    | CMS admin dashboard    |
| `http://localhost:3000/blog`     | Blog feed              |
| `http://localhost:3000/works`    | Portfolio works feed   |
| `http://localhost:3000/credits`  | Tech credits page      |
| `http://localhost:3000/feed.xml` | RSS feed               |

### 5. Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com/new)
3. Add the same environment variables from `.env.local` to your Vercel project settings
4. Deploy - Vercel will automatically build and serve your site

---

## 🎨 Customization Guide

| What                 | Where                        | How                                       |
| -------------------- | ---------------------------- | ----------------------------------------- |
| **All content**      | `/admin` dashboard           | Log in and edit everything from the UI    |
| **Colors & theme**   | `src/app/globals.css`        | Modify CSS custom properties              |
| **Static text**      | `src/config/translations.ts` | Edit/add translation keys                 |
| **Navigation links** | Admin → Social Links         | Add/remove/reorder from the dashboard     |
| **Section order**    | Admin → Page Layout          | Drag sections up/down or hide them        |
| **Profile photo**    | Admin → About Me             | Toggle visibility on/off with checkbox    |
| **Favorite quote**   | Admin → About Me             | Toggle visibility on/off with checkbox    |
| **Maintenance mode** | Admin → Page Layout          | Toggle to temporarily block public access |

---

## 📜 License

This project is licensed under the **[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)** (Creative Commons Attribution-NonCommercial 4.0).

**You can** freely use, modify, share, and deploy this project for personal or educational purposes.  
**You cannot** sell it, monetize it, or use it for any commercial purpose.

See the [LICENSE](./LICENSE) file for details.

---

<p align="center">
  Crafted with passion by <a href="https://github.com/batuhd">Batuhan</a>
  <br />
  <sub>If you found this useful, consider giving it a ⭐</sub>
</p>
