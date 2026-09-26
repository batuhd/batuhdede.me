# AI Agent Instructions

This file defines how AI agents should behave in this repository.

---

## 🎯 Project Goal

This project is a full-stack, multilingual portfolio website and headless CMS built with Next.js 16.3, React 19.2, TypeScript, Tailwind CSS v4, Supabase, and Motion (formerly Framer Motion).

The AI agent should help with:

- Writing clean, maintainable, and type-safe code
- Fixing bugs with minimal changes
- Improving performance
- Explaining code when asked
- Following the existing project structure and conventions

---

## 📁 Repository Rules

- **Never delete files unless explicitly asked.**
- **Never refactor large parts of the project without confirmation.**
- **Always check existing code before writing new code.**
- **Prefer modifying existing code over creating new files.**
- Keep commits small and meaningful when using Git.
- Do not push directly without explicit confirmation.

---

## 💻 Tech Stack

| Layer | Technology | Version |
| ----- | ---------- | ------- |
| Framework | [Next.js](https://nextjs.org/) (App Router) | 16.3.0 |
| UI Library | [React](https://react.dev/) | 19.2.7 |
| Language | [TypeScript](https://www.typescriptlang.org/) | 5.x |
| Styling | [Tailwind CSS](https://tailwindcss.com/) | 4.x |
| Animations | [Motion](https://motion.dev/) | 12.x |
| Database & Auth | [Supabase](https://supabase.com/) (`@supabase/supabase-js` + `@supabase/ssr`) | 2.x / 0.12 |
| Validation | [Zod](https://zod.dev/) | 3.x |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) | 2.x |
| Icons | [Lucide React](https://lucide.dev/) | 0.575.0 |
| Markdown | `react-markdown` + `rehype-sanitize` | 10.x / 6.x |

---

## 🏗️ Project Architecture

> 📄 **Veri modeli:** `supabase_schema.sql` (tek kaynak). **Admin yapısı:** `src/components/admin/sections.ts` (bölüm config'leri, tek kaynak) + `src/components/admin/components/` (yeniden kullanılabilir CRUD parçaları). Büyük görevlerde önce bu dosyaları oku.

```text
.
├── supabase_schema.sql          # Full database schema with RLS policies (single source)
├── .env.example                 # Environment variable template
├── next.config.ts               # Next.js config + CSP/security headers
├── middleware.ts                # Auth middleware for /admin routes
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── page.tsx             # Homepage (Hero, WorkCard, certs marquee, recent posts)
│   │   ├── about/page.tsx       # About page
│   │   ├── works/page.tsx       # Portfolio works (+ project detail modal)
│   │   ├── blog/page.tsx        # Blog (+ post modal)
│   │   ├── certifications/      # Certification page
│   │   ├── credits/             # Tech credits page
│   │   ├── admin/page.tsx       # Admin panel (config-driven CRUD, auth protected)
│   │   ├── admin/login/page.tsx
│   │   ├── api/auth/login|logout/route.ts
│   │   ├── api/github/          # GitHub GraphQL contribution API
│   │   ├── api/og/...           # OG image routes
│   │   ├── feed.xml/, llms.txt/, sitemap.ts, robots.ts, manifest.ts
│   │   └── globals.css          # Tailwind v4 + theme tokens (--color-brand lime)
│   ├── components/
│   │   ├── admin/               # ★ Admin paneli (config-driven, TR-öncelikli)
│   │   │   ├── sections.ts      # Bölüm config'leri (tek kaynak)
│   │   │   ├── types.ts         # Field / SectionConfig / Junction / Gallery tipleri
│   │   │   ├── lib/             # languages (TR-first), errors, notifications, crud helpers
│   │   │   ├── components/
│   │   │   │   ├── ui/          # Yeniden kullanılabilir primitifler (input, modal, switch...)
│   │   │   │   ├── fields/      # Alan tipi başına input (markdown, image, role-list, gallery...)
│   │   │   │   ├── entity-form.tsx  # Genel form: alan→input, TR/EN/DE/ES sekmeleri, validasyon, tüm dilleri kaydet
│   │   │   │   ├── entity-list.tsx  # Arama, rozetler, sıralama, yayınla/gizle
│   │   │   │   ├── entity-manager.tsx # Bölüm için liste+form+onay modalını birleştirir
│   │   │   │   ├── language-tabs.tsx # TR→EN→DE→ES sekmeleri + eksik-çeviri rozetleri
│   │   │   │   ├── recent-images.tsx # "Son kullanılan görseller" seçici
│   │   │   │   ├── shell.tsx    # Sol sidebar + topbar (her zaman koyu, violet accent)
│   │   │   │   ├── dashboard.tsx # Bölüm sayıları + hızlı erişim
│   │   │   │   └── settings.tsx # Bakım modu
│   │   │   └── markdown-editor.tsx # Markdown textarea + canlı önizleme
│   │   ├── home/                # Hero, WorkCard, Skills, profile-sections, RecentPosts, ...
│   │   ├── navigation/top-nav.tsx # Pill navbar (Home/About/Works/Blog + lang/theme)
│   │   ├── ui/section-box.tsx   # Section box (title on top border)
│   │   ├── blog/, markdown/, motion/, json-ld.tsx, ...
│   ├── config/
│   │   ├── locales/             # Static UI translations (EN/TR/DE/ES)
│   │   ├── translations.ts      # Typed i18n dictionary
│   │   ├── site.ts              # siteConfig
│   │   └── user.ts              # Hardcoded user fallbacks
│   ├── context/
│   │   ├── language-context.tsx    # Global language provider
│   │   ├── site-data-context.tsx   # Supabase data cache
│   │   └── admin-error-context.tsx # RLS/auth error handling + 401 logout
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client singleton
│   │   ├── data.ts              # Server data fetching helpers (cache'li)
│   │   └── utils.ts             # cn(), sanitizeUrl(), validators
│   └── types/
│       └── index.ts             # Centralized TypeScript interfaces
```

### Public site bölümleri
- **Ana sayfa**: Hero (foto + "Hi!/I'm" + bio + sosyal + iletişim) → Deneyim (WorkCard) → Sertifika marquee → Son 3 Blog → Footer
- **Hakkımda**: Hero → Deneyim|Liderlik → Eğitim|Diller → Yetenekler|Sertifikalar
- **Çalışmalar**: 2 sütun kartlar + detay modalı
- **Blog**: tek sütun kartlar + post modalı
- Tüm bölümler `SectionBox` (başlık üst border'da) kullanır.

---

## 🧩 Admin Panel — Nasıl Çalışır & Nasıl Genişletilir

Admin paneli **config-driven**'dır: her içerik bölümü `src/components/admin/sections.ts` içindeki tek bir `SectionConfig` ile tanımlanır ve **hiçbir bölüme özel bileşen yazmadan** genel `entity-manager`/`entity-form`/`entity-list` tarafından render edilir. Yeni bölüm eklemek = bir config eklemek; CRUD, sıralama, yayınla/gizle, çeviri sekmeleri, validasyon ve bildirimler otomatik gelir.

### 🔑 Temel kavramlar

| Kavram | Dosya | Açıklama |
| ------ | ----- | -------- |
| `SectionConfig` | `sections.ts` | Bölüm tanımı (tablo, alanlar, özel davranışlar) |
| `Field` | `types.ts` | Alan tanımı (tip, zorunlu, çevrilebilir, kaynak tablo...) |
| `FieldType` | `types.ts` | `text · textarea · markdown · number · checkbox · select · multi_select · json_array · month_year · date · image_url · role_list` |
| `entity-manager.tsx` | `components/` | Liste + form + silme onayını bir bölüm için birleştirir (veri yükleme, CRUD, sıralama, yayınla) |
| `entity-form.tsx` | `components/` | Alan→input eşlemesi, TR/EN/DE/ES sekmeleri, validasyon, **tüm dilleri tek save'de yazar** |
| `entity-list.tsx` | `components/` | Arama, filtre, çeviri/yayın rozetleri, sıralama okları, düzenle/sil |
| `lib/crud.ts` | `lib/` | Tip güvenli Supabase işlemleri (`listRows`, `createRow`, `updateRow`, `deleteRow`, `reorderRows`, `setPublished`, `syncJunction`, `fetchGallery`, `fetchSourceOptions`) |
| `lib/languages.ts` | `lib/` | TR-first sıra (`LANG_ORDER`), `columnKey()`, `missingTranslations()` |
| `lib/errors.ts` | `lib/` | `classifyError()`, `isPermissionError()` — kullanıcıya açık Türkçe hata |
| `lib/notifications.tsx` | `lib/` | `AdminToaster` + `notify.{success,error,warning,loading,resolve}` |

### ➕ Yeni bölüm ekleme (adım adım)

1. **Veritabanı** (`supabase_schema.sql`): Tabloyu + `order_index` + `*_tr/_de/_es` çeviri sütunlarını + RLS politikalarını ekle. Dosyayı repo şemasıyla **%100 senkron tut**; canlı DB'de eksik sütun varsa (ör. `projects.category`) migration uygula — PostgREST yeni sütunu ancak DB'de gerçekten varsa görür.
2. **Config** (`sections.ts`): `SECTION_CONFIGS` dizisine ~15 satırlık bir `SectionConfig` ekle. `icon` **lucide-react bileşeninin kendisi**dir (string değil). `displayField` (listede başlık), `subtitleField?` (alt satır), `imageField?` (küçük resim) belirt.
3. **Tip** (`src/types/index.ts`): Varlık arayüzünü (örn. `MyEntity`) ekle — admin tipleri bundan türer.
4. **Doğrula**: `npm run lint` + `npm run build`; sonra dev'de o bölümün ekle/düzenle/sil/sırala akışını dene.

### 🧱 Field config referansı

| Özellik | Değerler | Açıklama |
| ------- | -------- | -------- |
| `type` | zorunlu | `FieldType` — hangi input render edileceğini belirler |
| `required` | `boolean` | Translatable ise **TR** değeri, değilse temel sütun kontrol edilir |
| `translatable` | `boolean` | `key` + `key_tr/_de/_es` sütunlarına yazılır. ⚠️ Sütun DB'de yoksa **işaretleme** (örn. `about_me.name` çevrilebilir değildir) |
| `options` | `{label,value}[]` | `select` için sabit seçenekler (değer DB'ye `value` olarak yazılır) |
| `sourceTable` + `sourceValueField` + `sourceLabelField` | `select`/`multi_select` | Seçenekler başka tablodan çekilir (örn. `linked_experience_id` → `experiences.company`) |
| `validate` | `"url"` \| `"email"` | `sanitizeUrl()` / `isValidEmail()`; boş değer geçerlidir |
| `isCurrentField` | `string` | `month_year` bitiş alanını bu checkbox açıkken devre dışı bırakır (örn. `end_date` ↔ `is_current`) |
| `textareaRows` | `number` | textarea/markdown yüksekliği |
| `fullWidth` | `boolean` | Form grid'inde tam satır |

### 🔌 SectionConfig özel davranışları

| Özellik | Ne yapar |
| ------- | -------- |
| `singleRow` | Liste yerine tek form (`about_me`) |
| `publishedField` | Yayınla/gizle toggle + rozet (`blogs.is_published`) |
| `filterField` | Liste filtre dropdown'ı (örn. `projects.category`) |
| `junction` | Çoktan-çoğa bağlantı (`certifications` ↔ `certification_skills`); `{ table, parentColumn, childColumn, sourceTable, sourceLabelField }` — kayıtta diff alıp junction'ı senkronlar |
| `gallery` | `project_images`/`blog_images` galerisi; `{ table, parentColumn }` — satırlar anında kaydedilir |

### 🌍 Çeviri & veri kuralları (entity-form)

- Sekme sırası **TR → EN → DE → ES**; form TR ile açılır.
- `translatable` alan → **tüm dil sütunları** (`key`, `key_tr`, `key_de`, `key_es`) tek save'de yazılır.
- `translatable` olmayan alan → **yalnızca temel sütun** (asla `key_tr` yazma — `end_date_de` hatası böyle doğmuştu).
- **EN fallback**: Temel (EN) sütunlar bazı tablolarda `NOT NULL`. EN boşsa, TR değeri temel sütuna yazılır (kullanıcı EN'i doldurana kadar görsel geri düşüş). Bu davranışı kaldırma.
- Zorunlu kontrol: `required + translatable` → TR boş olamaz; diğer diller isteğe bağlı ama boşsa sekme üzerinde "eksik çeviri" rozeti (kaydetmeyi engellemez).
- `role_list` (jsonb) tek dizi olarak `key` altında tutulur; başlık/açıklama `title_tr` vb. içinde, tarihler ortaktır.

### 🔔 Bildirim & hata kuralları

- Her CRUD işleminde `notify` kullan: `notify.loading("Kaydediliyor...")` → işlem sonrası `notify.resolve(id, msg, success)`.
- Hata mesajlarını **asla jenerik yazma**: `classifyError(error).message` → sebep açık (yetki, FK çakışması, duplicate, limit, network).
- RLS/401 hatasında `isPermissionError(error)` → `useAdminError().handleOperationError(error, operation)` (toast + otomatik çıkış).
- Yeni bir alan/bölüm eklerken hata ve yükleme state'lerini (skeleton/empty/toast) atlama.

### ⚠️ Dikkat edilecek tuzaklar

- **PostgREST schema cache**: DB'ye yeni sütun ekledikten sonra istek "Could not find the 'X' column of 'Y' in the schema cache" veriyorsa sütun canlı DB'de yok demektir → migration uygula (şema dosyasıyla senkron).
- **Dev'de middleware çalışmaz** (Next 16.3 Turbopack bug, GH #93328): root `middleware.ts` üretimde korur (`/admin` → 307 `/admin/login`); dev'de client-side `getSession` koruması devrededir. `middleware.ts`'i `proxy.ts`'e **taşıma** — bu sürümde root proxy tanınmıyor.
- **`next.config.ts`**: `/_next/static` `immutable` cache header'ı dev'de de uygulanır; tarayıcı eski chunk gösterebilir → test sırasında cache temizle/cache bypass ile reload yap.
- Admin her zaman koyu tema kullanır (`.dark` sarmalayıcı + `zinc`/violet); public site lime/brand temasındadır — admin'de public renkleri kullanma.

---

## 💡 Coding Style

- Use **clean and readable TypeScript**; avoid `any`.
- Prefer **functional components** and React Hooks.
- Keep functions **small, focused, and reusable**.
- Use the existing utility helpers:
  - `cn(...)` from `@/lib/utils` for class merging.
  - `sanitizeUrl()` for any user-provided URLs (XSS prevention).
  - `isValidEmail()` and `isValidImageUrl()` where appropriate.
- Use `@/` path aliases for imports from `src/`.
- Follow the existing naming convention:
  - Components: PascalCase (`info.tsx` exports `Info`)
  - Utilities/Hooks: camelCase
  - Types/Interfaces: PascalCase in `src/types/index.ts`
- All user-generated URLs **must** be sanitized before rendering.
- Prefer `useSyncExternalStore` over `useState`/`useEffect` pairs for client-only mount guards; it avoids hydration mismatches and extra renders.
- Avoid unnecessary complexity; prefer minimal, safe changes.

---

## 🌍 Multilingual System (i18n)

- The site supports **EN, TR, DE, ES**.
- Static UI strings live in `src/config/translations.ts`.
- Content translations are stored per-row in Supabase (e.g. `title_tr`, `bio_de`).
- Use `getLocalized(value, lang)` from `@/lib/data` for content fields.
- Default language is `"en"` — **ancak admin panelinde içerik girişi TR-önceliklidir**: formlar TR sekmesiyle açılır, zorunlu alan TR kontrol edilir, EN/DE/ES boşsa "eksik çeviri" rozeti görünür. DB temel sütunu EN'dir (`key`), çeviriler `key_tr/_de/_es`'te saklanır.

---

## ⚙️ Workflow Rules

When given a task:

1. **Read relevant files first** using the filesystem tools.
2. **Understand the existing architecture** before making changes.
3. **Plan changes before writing code.**
4. **Apply minimal, safe changes.**
5. **Explain what was changed** when done.
6. **Validate mentally** before marking complete. Run `npm run lint` and `npm run build` for verification before concluding.

---

## 🔒 Security & Database Integrity Rules

This project has a multi-layered security model. Do not weaken it.

- **Never** expose Supabase service-role keys or secrets in code.
- **Always** sanitize user-provided URLs with `sanitizeUrl()` before rendering.
- **Always** sanitize markdown content via `rehype-sanitize`.
- Admin routes (`/admin/*` except `/admin/login`) are protected by `middleware.ts` using HTTP-only secure cookies.
- CSP headers are generated dynamically in `next.config.ts` from `NEXT_PUBLIC_SUPABASE_URL`.
- Do not remove or disable RLS-related logic in `supabase_schema.sql`.
- Do not introduce new external scripts without updating CSP headers.
- 🗄️ **Database Schema Synchronization:** Any change, addition, or modification affecting the database structure, tables, functions, triggers, or Row Level Security (RLS) policies **must be documented in detail and explicitly updated within `supabase_schema.sql`**. Never apply database patches or direct production hotfixes without keeping the repository's schema file 100% in sync.

---

## 🧪 Testing & Local Verification Rules

- Test changes mentally before finalizing.
- Prefer automated checks when possible:
  - `npm run lint` for linting
  - `npm run build` for build verification
  - `npm run dev` for local manual testing
- Do not mark tasks as complete without validation.
- 🎭 **Local Playwright Execution:** When developing, testing, or debugging UI workflows locally, always run Playwright against the local dev server to execute End-to-End (E2E) verification. Ensure the local dev server is active and the feature is verified in headless or UI mode before concluding it works.

---

## 🚫 Forbidden Actions

- Do not overwrite configuration files (`next.config.ts`, `middleware.ts`, `tsconfig.json`, etc.) unless asked.
- Do not remove dependencies without explanation.
- Do not introduce new libraries without justification.
- Do not delete files unless explicitly asked.
- Do not refactor large parts of the codebase without confirmation.

---

## 🧩 Notes

- This project is AI-assisted and behaves like a senior software engineer.
- All content is admin-editable from `/admin`; public pages read from Supabase.
- Admin paneli config-driven'dır; **yeni bölüm/alın eklemeden önce "Admin Panel — Nasıl Çalışır & Nasıl Genişletilir" bölümünü oku** ve config'i bozma.
- Use Context7 MCP for up-to-date documentation on Next.js, React, Supabase, Tailwind, Motion, Zod, or other libraries when needed.
- For every database schema change, prefer updating `supabase_schema.sql` and documenting the migration steps.
- The repository has been renamed to `batuhdede.me`; the canonical GitHub URL is `https://github.com/batuhd/batuhdede.me`.
