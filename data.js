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
      content: `Python, HTML, CSS, JavaScript, TypeScript, Java, React, Next.js, Node.js, Firebase, SQL, Figma, Adobe Photoshop/Illustrator/Premiere Pro/After Effects`
    },
    {
      id: "03",
      title: "FAVORITE QUOTE",
      content: `Those who hate themselves, cannot love or trust others. -Hideaki Anno`
    }
  ],

  // projects
  projects: [

  ],

  // social links
  links: [
    { label: "GitHub", url: "https://github.com/batuhd", icon: "github" },
    { label: "Instagram", url: "https://www.instagram.com/batuhdede/", icon: "instagram" },
    { label: "Linkedin", url: "https://www.linkedin.com/in/batuhdede/", icon: "linkedin" }
  ],

  // contact form (Formspree)
  contact: {
    email: "batuhdede@gmail.com",
    formspreeEndpoint: "https://formspree.io/f/xdalyqan"
  },

  // firebase config — loaded from /api/config (Vercel env variables)
  // DO NOT put API keys here — they go in Vercel Dashboard → Settings → Environment Variables
  firebase: null,

  // admin email (for Firebase Auth login)
  adminEmail: "batuhdede@gmail.com",

  // resume PDF URL
  resumeURL: "https://github.com/batuhd/cv-olustur"
};
