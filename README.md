<div align="center">
  
# 🚀 batuhdede.me | Premium Portfolio & CMS

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Framer_Motion-white?style=for-the-badge&logo=framer" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
</p>

An ultra-modern, deeply interactive, multilingual personal space built with the latest React paradigms, powered by a bespoke headless CMS via Supabase.

[Live Website](https://batuhdede.me) · [Report Bug](https://github.com/batuhd/batuhd.github.io/issues)

</div>

<br />

<div align="center">
  <img width="100%" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" alt="Project Preview" src="https://github.com/user-attachments/assets/e6625b4e-0683-4706-8a6b-538fc43c480d" />
</div>

## ✨ The Vision

This repository is not just a static template; it is a full-stack **Content Management System (CMS)** disguised as a premium developer portfolio. Everything you see—from the about text and skill bars to the blog posts and works—is dynamically fetched from a database and fully translatable.

## 🌟 Core Features

- 🌍 **Native Multilingual Architecture:** A sophisticated custom `LanguageContext` handles real-time switching between **English (EN), Turkish (TR), German (DE), and Spanish (ES)** without page reloads.
- 🛠️ **The Admin Core (`/admin`):** A remarkably detailed, secure admin dashboard built from scratch to handle full CRUD operations for:
  - Personal Data (Hero text, Bio, Stats, Quotes)
  - Education & Timeline Experiences
  - Language Proficiencies & Certifications
  - Works/Projects (with tags, live links, and GitHub sources)
  - Blog Posts (with rich content and computed read times)
  - Social Links configuration
- 🎨 **Kinetic UI Design:** Utilizing `framer-motion` for fluid page transitions, staggered `<FadeIn />` reveals, Apple-esque interactive Dock magnification, and beautifully crafted spring-animated modals.
- 🌓 **Dynamic Theming:** Seamless dark/light mode toggling implemented via `next-themes`.
- 📊 **Live GitHub Activity:** A custom-built GitHub contribution graph fetching live data through a dedicated Next.js Route Handler (`/api/github`), complete with interactive tooltips.
- ⚡ **Optimized Edge Performance:** Built on Next.js App Router, using Server/Client component splitting, Vercel Speed Insights, and RSS Feed generation (`feed.xml`).

---

## 💻 Tech Stack Deep Dive

- **Core Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language:** TypeScript (Strict Mode)
- **Styling Engine:** Tailwind CSS v4 alongside `tailwind-merge` and `clsx` for dynamic class resolution.
- **Animation Engine:** [Framer Motion](https://www.framer.com/motion/)
- **Iconography:** [Lucide React](https://lucide.dev/)
- **Database & Backend:** [Supabase](https://supabase.com/) (PostgreSQL real-time backend) with Firebase SDK retained for localized legacy/auth implementations.
- **Infrastructure:** Vercel Hosting & Analytics.

---

## 📂 Source Code Architecture

The codebase is meticulously organized to separate UI from state and configuration.

```text
src/
├── app/                      # Next.js 14+ App Router Logic
│   ├── admin/                # The Secure CMS interface
│   ├── api/github/           # Serverless function to route GitHub GraphQL requests
│   ├── blog/                 # Blog post Feed & Spring-Animated Modals
│   ├── works/                # Portfolio Highlight Feed & Modals
│   ├── credits/              # Acknowledgements page
│   ├── feed.xml/             # Dynamic RSS generator route
│   └── page.tsx              # The Main Full-Assembly Landing Page
│
├── components/               
│   ├── admin/                # Highly abstracted logic-heavy CMS tab forms (admin-tabs.tsx)
│   ├── home/                 # Reusable blocks (Skills, Educations, Timeline, GitHub Graph)
│   ├── motion/               # Reusable declarative Framer Motion wrappers
│   ├── navigation/           # The iconic, animated, stateful Bottom Dock
│   └── theme-provider.tsx    # Global NextThemes initialization wrapper
│
├── config/                   
│   ├── locales/              # Hardcoded localizations for static UI elements
│   └── translations.ts       # Strictly typed localization dictionary mapped for EN, TR, DE, ES
│
├── context/                  
│   ├── language-context.tsx  # Global robust provider for seamless i18n switching
│   └── site-data-context.tsx # Global cache provider syncing Supabase profile state
│
└── lib/                      
    ├── supabase.ts           # Supabase DB Client Singleton
    └── utils.ts              # Global Tailwind logic helper functions
```

---

## 🚦 Local Development Guide

### 1. Requirements

- Node.js (v18+)
- A Supabase Instance
- A GitHub Personal Access Token

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/batuhd/batuhd.github.io.git
cd batuhd.github.io
npm install
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Populate `.env.local`:

```env
# Primary Database (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Fallback Services (Optional, if transitioning)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
#...

# Live Data Fetching
GITHUB_TOKEN=your_github_classic_token
```

### 4. Database Initialization

Execute the SQL script located at the project root (`supabase_schema.sql`) inside your Supabase SQL Editor. This will instantly scaffold:
`about_me`, `skill_categories`, `social_links`, `experiences`, `educations`, `languages`, `activities`, `certifications`, `projects`, and `blogs`.

### 5. Launch

Start the development server:

```bash
npm run dev
```

- View Site: `http://localhost:3000`
- Access the CMS: `http://localhost:3000/admin`

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="center">Crafted with passion by <a href="https://github.com/batuhd">Batuhan</a></p>
