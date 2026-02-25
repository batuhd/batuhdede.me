// portfolio data

const SITE_DATA = {

  // profile
  profile: {
    name: "Batuhan DEDE",
    role: "Developer",
    field: "Web / Software / Design",
    heroTitle: "HELLO WORLD",
    heroSubtitle: "Front-end Dev & Designer",
    copyright: "©batuhd"
  },

  // intro boot sequence lines
  bootLines: [
    { text: "Initializing system...", delay: 0 },
    { text: "Loading environment...", delay: 400 },
    { text: "Setting up render pipeline...", delay: 800 },
    { text: "Compiling shaders...", delay: 1200 },
    { text: "Optimizing assets...", delay: 1600 },
    { text: "Connecting to server...", delay: 2000 },
    { text: "> System ready.", delay: 2600 },
  ],

  // welcome card
  welcomeCard: {
    name: "Batuhan Dede",
    role: "Developer",
    field: "Web / Software / Design",
    location: "Turkey"
  },

  // about
  about: [
    {
      id: "01",
      title: "ABOUT ME",
      content: `I am a front-end developer and designer with a passion for creating unique and interactive web experiences. I am a self-taught developer and I am always learning new things. I always try to do my best.`
    },
    {
      id: "02",
      title: "MY SKILLS",
      content: `Python, HTML, CSS, JavaScript, TypeScript, Java, React, Next.js, Node.js, Figma, Adobe Photoshop/Illustrator/Premiere Pro/After Effects`
    },
    {
      id: "03",
      title: "FAVORITE QUOTE",
      content: `Those who hate themselves, cannot love or trust others. -Hideaki Anno`
    }
  ],

  // projects
  projects: [
    {
      title: "Spotify Toolbox",
      year: "2026",
      category: "Web Application",
      description: "A web-based application built with Python (Flask & Spotipy) to manage and organize your Spotify playlists.",
      image: "https://github.com/batuhd/Spotify-Toolbox/raw/main/ss1.png",
      link: "https://github.com/batuhd/Spotify-Toolbox"
    },
    {
      title: "Moti UI",
      year: "2026",
      category: "Digital Archive",
      description: "An interactive digital archive featuring Turkish motifs presented with a modern interface, developed with Vite + TypeScript, and created entirely out of sheer boredom. 🇹🇷 ",
      image: "https://private-user-images.githubusercontent.com/224399391/554458646-876a55fb-31ea-4440-b134-e50dd2e61494.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzE5Nzg2NzUsIm5iZiI6MTc3MTk3ODM3NSwicGF0aCI6Ii8yMjQzOTkzOTEvNTU0NDU4NjQ2LTg3NmE1NWZiLTMxZWEtNDQ0MC1iMTM0LWU1MGRkMmU2MTQ5NC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwMjI1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDIyNVQwMDEyNTVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0zMmZlNzUzOThlZGNmZTMyZjU0MDU5ODQ5Y2YxODNkZDIxMmMwMzA5YTA0YzQ2MDEyNThhMTA5ZTM4NmU3ZWIyJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.XqbWQam7Khzx7q0dFMWA4wb7OA5gUvAY3y4s73t2l0w",
      link: "https://github.com/batuhd/motiui"
    },
    {
      title: "CV Olustur",
      year: "2026",
      category: "Web Application",
      description: "Windows 95-themed, browser-based resume builder. Enter your information, check it with live preview, and download it as a PDF.",
      image: "https://github.com/batuhd/cv-olustur/raw/main/img/Ads%C4%B1z.png",
      link: "https://github.com/batuhd/cv-olustur"
    },
    {
      title: "Sinop Private Share (SPS)",
      year: "2026",
      category: "Software",
      description: "A minimalist, secure (i guess), personal note-taking and link-sharing feed. SPS is designed as a private micro-blogging tool for a single user. It allows you to quickly drop notes, save links, and view them in a real-time feed from any device. Its primary focus is simplicity and robust security, ensuring your personal data remains completely private.",
      image: "https://private-user-images.githubusercontent.com/224399391/554459587-858628c8-b1f9-429c-bd9f-fff448f29451.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzE5Nzg4NjMsIm5iZiI6MTc3MTk3ODU2MywicGF0aCI6Ii8yMjQzOTkzOTEvNTU0NDU5NTg3LTg1ODYyOGM4LWIxZjktNDI5Yy1iZDlmLWZmZjQ0OGYyOTQ1MS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwMjI1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDIyNVQwMDE2MDNaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT01YTlkMGYxZTk2YTJkOTBhOTg4ZDQ3MTY5MGNmZGYxNjM5ODhlZDQ0MDg5MmNlZTQ1MWE1MGNlNTc4NDI2ZjM1JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.qeTxzloqaec1NaksOakesSuDWJ_v4-iDhsoPlHmUsxM",
      link: "https://github.com/batuhd/SPS"
    }
  ],

  // social links
  links: [
    { label: "GitHub", url: "https://github.com/batuhd", icon: "github" }
  ],

  // contact form (Formspree)
  contact: {
    email: "batuhan@example.com",
    formspreeEndpoint: "https://formspree.io/f/YOUR_FORM_ID"
  },

  // firebase config (replace with your own)
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  },

  // admin email (for Firebase Auth login)
  adminEmail: "batuhan@example.com",

  // resume PDF URL
  resumeURL: "https://github.com/batuhd/cv-olustur"
};
