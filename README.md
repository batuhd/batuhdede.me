# batuhdede.me

Personal portfolio website built with Next.js, React, and Tailwind CSS.
<img width="1920" height="1042" alt="11" src="https://github.com/user-attachments/assets/e6625b4e-0683-4706-8a6b-538fc43c480d" />

## Features

- **Multi-language support** — Turkish, English, German, Japanese
- **Admin panel** — Manage Works and Blog posts with multi-language content
- **Dark / Light theme** — Toggle via the bottom dock
- **GitHub contribution graph** — Live data via GitHub API
- **Contact form** — Powered by Formspree
- **Intro animation** — Custom video sequence on first visit
- **Responsive design** — Optimized for all screen sizes

## Tech Stack

| Category  | Technology                      |
| --------- | ------------------------------- |
| Frontend  | React, Next.js, Tailwind CSS    |
| Database  | Firebase Realtime Database      |
| Auth      | Firebase Authentication         |
| Hosting   | Vercel                          |
| Forms     | Formspree                       |
| Icons     | Lucide React                    |
| Animation | Framer Motion                   |
| Fonts     | Geist Sans, Geist Mono (Vercel) |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Production build
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
GITHUB_TOKEN=              # Optional, for contribution graph
```

## Project Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── admin/             # Admin dashboard & login
│   ├── api/github/        # GitHub API route
│   ├── blog/              # Blog page
│   ├── credits/           # Credits page
│   └── works/             # Works/Projects page
├── components/
│   ├── home/              # Home page sections
│   ├── motion/            # Animation components
│   └── navigation/        # Bottom dock navigation
├── config/
│   ├── site.ts            # Site metadata
│   ├── translations.ts    # i18n translations (TR/EN/DE/JA)
│   └── user.ts            # User configuration
├── context/
│   └── language-context.tsx  # Language provider
└── lib/
    ├── firebase.ts        # Firebase initialization
    └── utils.ts           # Utility functions
```

## Deploy

Deploy to Vercel by connecting the GitHub repository. Set all environment variables in the Vercel dashboard.

## License

MIT
