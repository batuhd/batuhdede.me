export type Locale = "tr" | "en" | "de" | "ja";

export const localeLabels: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  de: "DE",
  ja: "JA",
};

export const translations: Record<Locale, Record<string, string>> = {
  // ═══════════════════════════════════════════════
  //  TURKISH
  // ═══════════════════════════════════════════════
  tr: {
    // Navigation
    "nav.home": "Ana Sayfa",
    "nav.works": "Projeler",
    "nav.blog": "Blog",
    "nav.credits": "Credits",
    "nav.theme": "Tema",
    "nav.language": "Dil",

    // User / Hero
    "user.heroTagline":
      "Kod, sistemler ve görsel tasarımın kesişim noktasına odaklanıyor.",
    "user.about":
      "Frontend geliştirme ve görsel tasarıma odaklanan bir Yönetim Bilişim Sistemleri (YBS) öğrencisiyim. React ve Next.js kullanarak web uygulamaları geliştiriyor, aynı zamanda Python kodlama, Linux özelleştirme (ricing) ve oyun modlama gibi konularda deneyim kazanıyorum. Temiz, işlevsel ve iyi yapılandırılmış dijital projeler oluşturmaktan keyif alıyorum.",
    "user.quote.text":
      "Kendinden nefret edenler başkalarını sevemez ve onlara güvenemez.",
    "user.quote.author": "Hideaki Anno",
    "user.skill.frontend": "Frontend Geliştirme",
    "user.skill.backend": "Backend Geliştirme",
    "user.skill.systems": "Sistemler & Multimedya",

    // Home
    "home.about": "Hakkımda",
    "home.skills": "Yetenekler",
    "home.github": "GitHub Katkıları",
    "home.github.contributions": "Son bir yılda {count} katkı",
    "home.github.nodata":
      "(Gerçek verileri görmek için .env'ye GITHUB_TOKEN ekleyin)",
    "home.github.less": "Az",
    "home.github.more": "Çok",
    "home.contact": "İletişime Geçin",
    "home.contact.name": "İsim",
    "home.contact.email": "E-posta",
    "home.contact.message": "Mesaj",
    "home.contact.send": "Mesaj Gönder",
    "home.contact.sending": "Gönderiliyor...",
    "home.contact.sent": "Gönderildi!",
    "home.contact.error": "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
    "home.contact.namePlaceholder": "Adınız",
    "home.contact.emailPlaceholder": "siz@ornek.com",
    "home.contact.messagePlaceholder": "Mesajınız...",
    "home.footer": "Sinop'ta ❤️ ile yapıldı",

    // Works
    "works.title": "Projeler",
    "works.subtitle": "Projelerim ve üzerinde çalıştığım şeyler.",
    "works.empty": "Henüz proje yok",
    "works.emptyDesc": "Admin panelinden eklenen projeler burada görünecek.",
    "works.loading": "Projeler yükleniyor...",
    "works.liveDemo": "Canlı Demo",
    "works.source": "Kaynak",

    // Blog
    "blog.title": "Blog",
    "blog.subtitle": "Düşünceler, öğrenmeler ve web geliştirme yazıları.",
    "blog.empty": "Henüz yazı yok",
    "blog.emptyDesc": "Admin panelinden eklenen yazılar burada görünecek.",
    "blog.loading": "Yazılar yükleniyor...",

    // Credits
    "credits.title": "Credits",
    "credits.subtitle":
      "Bu siteyi güçlendiren açık kaynak araçları, tipografi ve kaynaklar.",
    "credits.sourceCode": "Kaynak Kodu",
    "credits.sourceCodeDesc":
      "Bu web sitesinin kaynak kodu açık kaynaklıdır ve GitHub'da mevcuttur.",
    "credits.techStack": "Teknoloji Yığını",
    "credits.tech.frontend": "Frontend",
    "credits.tech.database": "Veritabanı",
    "credits.tech.auth": "Kimlik Doğrulama",
    "credits.tech.hosting": "Barındırma",
    "credits.tech.forms": "Formlar",
    "credits.tech.icons": "İkonlar",
    "credits.typography": "Tipografi",
    "credits.typo.sans": "Sans",
    "credits.typo.mono": "Mono",
    "credits.typo.logo": "Logo",
    "credits.typo.logoNote":
      "İntro videosunda kullanılan yazı tipi A Typography tarafından geliştirilen Epetri'dir. Ticari amaçla kullanılmamaktadır.",
    "credits.media": "Medya & Video",
    "credits.media.introTitle": "İNTRO VİDEO",
    "credits.media.introDesc":
      "Sayfa yüklendiğinde gösterilen giriş sekansı videosu.",
    "credits.media.introCredit": "Özel / Kendi üretimimdir",
    "credits.footer":
      "Batuhan Dede tarafından tasarlandı ve geliştirildi, Antigravity IDE destekli Claude Opus 4.6 kullanılarak inşa edildi.",
    "credits.translationTitle": "Çeviri",
    "credits.translationNote":
      "Orijinal olarak İngilizce kodlandı, DeepL ile çevrildi.",
  },

  // ═══════════════════════════════════════════════
  //  ENGLISH
  // ═══════════════════════════════════════════════
  en: {
    "nav.home": "Home",
    "nav.works": "Works",
    "nav.blog": "Blog",
    "nav.credits": "Credits",
    "nav.theme": "Theme",
    "nav.language": "Language",

    "user.heroTagline":
      "Focusing on the intersection of code, systems, and visual design.",
    "user.about":
      "I am an MIS student with a focus on frontend development and visual design. My work involves building web applications using React and Next.js, alongside exploring Python scripting and system customization through Linux ricing and game modding. I enjoy creating clean, functional, and well-structured digital projects.",
    "user.quote.text":
      "Those who hate themselves, cannot love or trust others.",
    "user.quote.author": "Hideaki Anno",
    "user.skill.frontend": "Frontend Excellence",
    "user.skill.backend": "Backend Development",
    "user.skill.systems": "Systems & Multimedia",

    "home.about": "About",
    "home.skills": "Skills",
    "home.github": "GitHub Contribution",
    "home.github.contributions": "{count} contributions in the last year",
    "home.github.nodata": "(Add GITHUB_TOKEN to .env to see real data)",
    "home.github.less": "Less",
    "home.github.more": "More",
    "home.contact": "Get in Touch",
    "home.contact.name": "Name",
    "home.contact.email": "Email",
    "home.contact.message": "Message",
    "home.contact.send": "Send Message",
    "home.contact.sending": "Sending...",
    "home.contact.sent": "Sent!",
    "home.contact.error": "Error sending message. Please try again.",
    "home.contact.namePlaceholder": "Your name",
    "home.contact.emailPlaceholder": "you@example.com",
    "home.contact.messagePlaceholder": "Your message...",
    "home.footer": "Made in Sinop with ❤️",

    "works.title": "Works",
    "works.subtitle": "A collection of my projects and things I've built.",
    "works.empty": "No projects yet",
    "works.emptyDesc": "Projects added via Admin Panel will appear here.",
    "works.loading": "Loading projects...",
    "works.liveDemo": "Live Demo",
    "works.source": "Source",

    "blog.title": "Blog",
    "blog.subtitle": "Thoughts, learnings, and web development articles.",
    "blog.empty": "No posts yet",
    "blog.emptyDesc": "Blog posts added via Admin Panel will appear here.",
    "blog.loading": "Loading posts...",

    "credits.title": "Credits",
    "credits.subtitle":
      "Acknowledging the open-source tools, typography, and resources that power this site.",
    "credits.sourceCode": "Source Code",
    "credits.sourceCodeDesc":
      "The source code of this website is open-source and available on GitHub.",
    "credits.techStack": "Tech Stack",
    "credits.tech.frontend": "Frontend",
    "credits.tech.database": "Database",
    "credits.tech.auth": "Auth",
    "credits.tech.hosting": "Hosting",
    "credits.tech.forms": "Forms",
    "credits.tech.icons": "Icons",
    "credits.typography": "Typography",
    "credits.typo.sans": "Sans",
    "credits.typo.mono": "Mono",
    "credits.typo.logo": "Logo",
    "credits.typo.logoNote":
      "The font used in the intro video is Epetri by A Typography. It is not used for any commercial purpose.",
    "credits.media": "Media & Video",
    "credits.media.introTitle": "INTRO VIDEO",
    "credits.media.introDesc":
      "The intro sequence video displayed on page load.",
    "credits.media.introCredit": "Custom / Self-produced",
    "credits.footer":
      "Designed and developed by Batuhan Dede, built using Antigravity IDE powered by Claude Opus 4.6.",
    "credits.translationTitle": "Translation",
    "credits.translationNote":
      "Originally coded in English, translated with DeepL.",
  },

  // ═══════════════════════════════════════════════
  //  GERMAN
  // ═══════════════════════════════════════════════
  de: {
    "nav.home": "Startseite",
    "nav.works": "Projekte",
    "nav.blog": "Blog",
    "nav.credits": "Credits",
    "nav.theme": "Design",
    "nav.language": "Sprache",

    "user.heroTagline":
      "Fokus auf die Schnittstelle von Code, Systemen und visuellem Design.",
    "user.about":
      "Ich bin ein MIS-Student mit Schwerpunkt auf Frontend-Entwicklung und visuellem Design. Meine Arbeit umfasst die Erstellung von Webanwendungen mit React und Next.js sowie das Erkunden von Python-Scripting und Systemanpassung durch Linux-Ricing und Game-Modding. Ich genieße es, saubere, funktionale und gut strukturierte digitale Projekte zu erstellen.",
    "user.quote.text":
      "Wer sich selbst hasst, kann andere nicht lieben oder ihnen vertrauen.",
    "user.quote.author": "Hideaki Anno",
    "user.skill.frontend": "Frontend-Exzellenz",
    "user.skill.backend": "Backend-Entwicklung",
    "user.skill.systems": "Systeme & Multimedia",

    "home.about": "Über mich",
    "home.skills": "Fähigkeiten",
    "home.github": "GitHub-Beiträge",
    "home.github.contributions": "{count} Beiträge im letzten Jahr",
    "home.github.nodata":
      "(GITHUB_TOKEN in .env hinzufügen, um echte Daten zu sehen)",
    "home.github.less": "Weniger",
    "home.github.more": "Mehr",
    "home.contact": "Kontakt",
    "home.contact.name": "Name",
    "home.contact.email": "E-Mail",
    "home.contact.message": "Nachricht",
    "home.contact.send": "Nachricht senden",
    "home.contact.sending": "Wird gesendet...",
    "home.contact.sent": "Gesendet!",
    "home.contact.error": "Fehler beim Senden. Bitte versuchen Sie es erneut.",
    "home.contact.namePlaceholder": "Ihr Name",
    "home.contact.emailPlaceholder": "sie@beispiel.de",
    "home.contact.messagePlaceholder": "Ihre Nachricht...",
    "home.footer": "Mit ❤️ in Sinop gemacht",

    "works.title": "Projekte",
    "works.subtitle": "Eine Sammlung meiner Projekte und Arbeiten.",
    "works.empty": "Noch keine Projekte",
    "works.emptyDesc":
      "Über das Admin-Panel hinzugefügte Projekte werden hier angezeigt.",
    "works.loading": "Projekte werden geladen...",
    "works.liveDemo": "Live-Demo",
    "works.source": "Quellcode",

    "blog.title": "Blog",
    "blog.subtitle": "Gedanken, Erkenntnisse und Webentwicklungsartikel.",
    "blog.empty": "Noch keine Beiträge",
    "blog.emptyDesc":
      "Über das Admin-Panel hinzugefügte Beiträge werden hier angezeigt.",
    "blog.loading": "Beiträge werden geladen...",

    "credits.title": "Credits",
    "credits.subtitle":
      "Anerkennung der Open-Source-Tools, Typografie und Ressourcen, die diese Seite antreiben.",
    "credits.sourceCode": "Quellcode",
    "credits.sourceCodeDesc":
      "Der Quellcode dieser Website ist Open-Source und auf GitHub verfügbar.",
    "credits.techStack": "Technologie-Stack",
    "credits.tech.frontend": "Frontend",
    "credits.tech.database": "Datenbank",
    "credits.tech.auth": "Authentifizierung",
    "credits.tech.hosting": "Hosting",
    "credits.tech.forms": "Formulare",
    "credits.tech.icons": "Symbole",
    "credits.typography": "Typografie",
    "credits.typo.sans": "Sans",
    "credits.typo.mono": "Mono",
    "credits.typo.logo": "Logo",
    "credits.typo.logoNote":
      "Die im Intro-Video verwendete Schriftart ist Epetri von A Typography. Sie wird nicht für kommerzielle Zwecke verwendet.",
    "credits.media": "Medien & Video",
    "credits.media.introTitle": "INTRO-VIDEO",
    "credits.media.introDesc":
      "Die beim Seitenladevorgangs angezeigte Introsequenz.",
    "credits.media.introCredit": "Eigenproduktion",
    "credits.footer":
      "Entworfen und entwickelt von Batuhan Dede, erstellt mit Antigravity IDE powered by Claude Opus 4.6.",
    "credits.translationTitle": "Übersetzung",
    "credits.translationNote":
      "Ursprünglich auf Englisch programmiert, mit DeepL übersetzt.",
  },

  // ═══════════════════════════════════════════════
  //  JAPANESE
  // ═══════════════════════════════════════════════
  ja: {
    "nav.home": "ホーム",
    "nav.works": "作品",
    "nav.blog": "ブログ",
    "nav.credits": "クレジット",
    "nav.theme": "テーマ",
    "nav.language": "言語",

    "user.heroTagline":
      "コード、システム、ビジュアルデザインの交差点に焦点を当てる。",
    "user.about":
      "フロントエンド開発とビジュアルデザインに注力するMIS学生です。ReactとNext.jsを使用したWebアプリケーション開発、Pythonスクリプティング、Linuxカスタマイズ（ライシング）やゲームモディングなどのシステムカスタマイズに取り組んでいます。クリーンで機能的、構造化されたデジタルプロジェクトの制作を楽しんでいます。",
    "user.quote.text":
      "自分を憎む者は、他者を愛することも信頼することもできない。",
    "user.quote.author": "庵野秀明",
    "user.skill.frontend": "フロントエンド",
    "user.skill.backend": "バックエンド開発",
    "user.skill.systems": "システム＆マルチメディア",

    "home.about": "自己紹介",
    "home.skills": "スキル",
    "home.github": "GitHubコントリビューション",
    "home.github.contributions": "過去1年間で{count}件の貢献",
    "home.github.nodata":
      "（実データを表示するには.envにGITHUB_TOKENを追加してください）",
    "home.github.less": "少",
    "home.github.more": "多",
    "home.contact": "お問い合わせ",
    "home.contact.name": "名前",
    "home.contact.email": "メール",
    "home.contact.message": "メッセージ",
    "home.contact.send": "送信",
    "home.contact.sending": "送信中...",
    "home.contact.sent": "送信完了！",
    "home.contact.error": "送信に失敗しました。再試行してください。",
    "home.contact.namePlaceholder": "お名前",
    "home.contact.emailPlaceholder": "mail@example.com",
    "home.contact.messagePlaceholder": "メッセージを入力...",
    "home.footer": "シノプで❤️を込めて制作",

    "works.title": "作品",
    "works.subtitle": "プロジェクトと制作物のコレクション。",
    "works.empty": "まだ作品がありません",
    "works.emptyDesc": "管理パネルから追加された作品がここに表示されます。",
    "works.loading": "作品を読み込み中...",
    "works.liveDemo": "デモ",
    "works.source": "ソース",

    "blog.title": "ブログ",
    "blog.subtitle": "考え、学び、ウェブ開発に関する記事。",
    "blog.empty": "まだ投稿がありません",
    "blog.emptyDesc": "管理パネルから追加された投稿がここに表示されます。",
    "blog.loading": "投稿を読み込み中...",

    "credits.title": "クレジット",
    "credits.subtitle":
      "このサイトを支えるオープンソースツール、タイポグラフィ、リソースへの感謝。",
    "credits.sourceCode": "ソースコード",
    "credits.sourceCodeDesc":
      "このウェブサイトのソースコードはオープンソースであり、GitHubで公開されています。",
    "credits.techStack": "技術スタック",
    "credits.tech.frontend": "フロントエンド",
    "credits.tech.database": "データベース",
    "credits.tech.auth": "認証",
    "credits.tech.hosting": "ホスティング",
    "credits.tech.forms": "フォーム",
    "credits.tech.icons": "アイコン",
    "credits.typography": "タイポグラフィ",
    "credits.typo.sans": "サンセリフ",
    "credits.typo.mono": "モノ",
    "credits.typo.logo": "ロゴ",
    "credits.typo.logoNote":
      "イントロ動画で使用されているフォントはA TypographyのEpetriです。商業目的では使用されていません。",
    "credits.media": "メディア＆ビデオ",
    "credits.media.introTitle": "イントロビデオ",
    "credits.media.introDesc":
      "ページ読み込み時に表示されるイントロシーケンス動画。",
    "credits.media.introCredit": "自主制作",
    "credits.footer":
      "Batuhan Dedeがデザイン・開発。Antigravity IDE（Claude Opus 4.6搭載）で構築。",
    "credits.translationTitle": "翻訳",
    "credits.translationNote":
      "元々英語でコーディングされ、DeepLで翻訳されました。",
  },
};
