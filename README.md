# Batuhan D. — Creative Developer Portfolio

<div align="center">
  <img src="media/yuvarlaklogobeyaz.png" alt="Logo" width="100"/>
  <br>
  <p>A highly interactive, terminal-inspired, and secure portfolio website built with vanilla web technologies, Firebase, and Vercel Serverless Functions.</p>
</div>

---

## 🌟 Features

- **Immersive Intro Sequence**: A terminal-style boot sequence that transitions into a cinematic video background.
- **Dynamic Content Management (CMS)**: Firebase Realtime Database integration for managing `WORKS` and `BLOG` sections.
- **Secure Admin Panel**: A built-in, fully authenticated admin dashboard for CRUD operations on blog posts and portfolio projects.
- **Formspree Contact Form**: Serverless contact form handling.
- **Responsive Architecture**: Fluid typographies using `clamp()`, adaptable grid layouts, and mobile-specific navigations.
- **Custom Aesthetic**: Glitch effects, scanline & grain overlays, custom cursors, and glowing terminal interfaces.
- **Client-Side Routing & Smooth Scroll**: Seamless transitions between sections with a custom `requestAnimationFrame` smooth scroller.

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3 (Custom Properties & Flexbox/Grid).
- **Backend / Database**: Firebase Realtime Database.
- **Authentication**: Firebase Authentication (Email/Password).
- **Serverless API**: Vercel Serverless Functions (Node.js) for secure API key delivery.
- **Hosting**: Vercel.
- **Forms**: Formspree API.

---

## 🛡️ Security Architecture

This project implements a strict security posture to protect the database and admin panel from unauthorized access and brute-force attacks.

### 1. Firebase Authentication & Sign-Up Locking

- **Sign-up Disabled**: New user registration has been completely disabled at the Firebase console level. The API will reject any programmatic sign-up attempt (`auth/operation-not-allowed`).
- **Single Admin**: Only the pre-configured administrator email can log in to the admin panel.

### 2. Firestore / Realtime Database Security Rules (Whitelist)

The database rules check the authenticated user's email against a hardcoded whitelist.

- **Rule**: `allow write: if request.auth !== null && request.auth.token.email === 'admin@email.com';`
- **Result**: Even if credentials leak, write access is strictly tied to the verified email address. Read access remains public (`.read: true`) for the frontend to render.

### 3. API Key Domain & CORS Locking

- **Google Cloud Restrictions**: The Firebase API keys are locked via Google Cloud Console to only accept requests from specific `HTTP referrers` (e.g., `https://batuhdede.me/*` and the specific Vercel deployment URL).
- **Vercel Serverless Function**: The Firebase config is NOT hardcoded in the frontend repository. It is loaded at runtime via a Vercel Serverless Function (`/api/config`) which pulls from Vercel Environment Variables. This function uses strict CORS policies to only respond to allowed origins.

### 4. Admin Login Protection

- **Custom CAPTCHA**: The admin login page features a 6-character, randomized CAPTCHA that must be solved on every login attempt.
- **Rate Limiting / Lockout**: The client implements a 3-strike rule. Three consecutive failed login attempts (wrong password or CAPTCHA) trigger a mandatory 60-second cooldown lockout.

---

## 📁 Project Structure

```text
├── index.html       # Main landing page (Hero, About, Contact)
├── works.html       # Projects page (Firebase powered)
├── blog.html        # Blog page (Firebase powered)
├── admin.html       # Secure admin dashboard
├── style.css        # Global stylesheet & design system
├── main.js          # Core application logic & UI interactions
├── data.js          # Static configuration & fallback data
├── vercel.json      # Vercel deployment configuration
├── api/
│   └── config.js    # Vercel Serverless function for config delivery
└── media/           # Images, videos, and icons
```

## 🚀 Deployment

1. Set up a **Firebase Project** and enable Authentication (Email/Password only) and Realtime Database.
2. Configure **Firebase Security Rules** for your admin email.
3. Restrict your Firebase API Key to your production domains in **Google Cloud Console**.
4. Push code to GitHub and link to **Vercel**.
5. Add the following Environment Variables in Vercel:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_DATABASE_URL`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`

## 📄 License

Designed and developed by Batuhan Dede. All rights reserved.
