# AI Agent Talimatları

Bu dosya, bu depoda çalışan AI agent'ların **nasıl davranacağını** tanımlar. Bir kod yazmadan önce ilgili bölümü oku.

---

## 🎯 Proje hedefi

Çok dilli (TR/EN/DE/ES) portfolyo sitesi + headless CMS. Tüm içerik `/admin` panelinden yönetilir; içerik değişikliği için kod değişikliği veya deploy gerekmez.

**Stack:** Next.js 16.3.8 (App Router, RSC) · React 19.2 · TypeScript (strict) · Tailwind v4 · Supabase · Motion

Agent'ın yardımcı olması beklenen alanlar: temiz ve tip-güvenli kod yazmak, minimal değişiklikle bug düzeltmek, performansı iyileştirmek, açıklandığında kodu anlatmak, mevcut proje yapısına ve kurallarına uymak.

---

## 📁 Depo kuralları

- **Dosya silme** — açıkça istenmedikçe hiçbir dosyayı silme
- **Büyük refactor** — projenin geniş bölümlerini onay almadan yeniden yazma
- **Önce oku** — yeni kod yazmadan önce mevcut kodu oku
- **Değiştir > oluştur** — mevcut dosyayı düzenlemeyi yeni dosya oluşturmaya tercih et
- **Küçük commit'ler** — anlamlı, birlikte çalışan değişiklikler
- **Push** — açık onay olmadan doğrudan push yapma
- **Config dosyaları** — `next.config.ts`, `middleware.ts`, `tsconfig.json` vb. sormadan ezme

---

## 💻 Teknoloji yığını

| Katman | Teknoloji | Sürüm |
| --- | --- | --- |
| Framework | Next.js (App Router) | 16.3.8 |
| UI | React | 19.2.7 |
| Dil | TypeScript | 5.x (`strict: true`) |
| Stil | Tailwind CSS | 4.x (CSS-first) |
| Animasyon | Motion | 12.x |
| Veritabanı & Auth | Supabase (`supabase-js` + `@supabase/ssr`) | 2.x / 0.12 |
| Doğrulama | Zod | 3.x |
| Bildirim | Sonner | 2.x |
| İkon | Lucide React | 0.575 |
| Markdown | `react-markdown` + `rehype-sanitize` | 10.x / 6.x |
| PDF | React-PDF | 4.9 |

> `package.json` tek kaynaktır; sürümü oradan oku.

---

## 🏗️ Proje mimarisi

> 📄 **Veri modeli:** `supabase_schema.sql` (tek kaynak, RLS dahil)
> 🔐 **Admin yapısı:** `src/components/admin/sections.ts` (bölüm config'leri, tek kaynak)
> 📡 **Admin API:** `src/app/api/admin/route.ts` (sunucu tarafı CRUD)
> Büyük görevlerde önce bu dosyaları oku.

```text
.
├── supabase_schema.sql          # 17 tablo + 69 RLS politikası + trigger'lar
├── .env.example                 # Ortam değişkeni şablonu
├── next.config.ts               # CSP + güvenlik header'ları
├── middleware.ts                # /admin koruması + httpOnly çerez zorlama
├── opencode.json                # MCP sunucuları
│
└── src/
    ├── app/
    │   ├── page.tsx             # Ana sayfa
    │   ├── about/page.tsx
    │   ├── works/page.tsx · works/[slug]/page.tsx
    │   ├── blog/page.tsx · blog/[slug]/page.tsx
    │   ├── certifications/      # Liste + [slug] detay
    │   ├── credits/page.tsx
    │   ├── admin/page.tsx · admin/login/page.tsx
    │   ├── api/
    │   │   ├── admin/route.ts            # 🔐 Tüm admin CRUD
    │   │   ├── auth/login/route.ts       # Turnstile + rate limit
    │   │   ├── auth/logout/route.ts
    │   │   ├── cv/route.ts               # React-PDF
    │   │   ├── github/route.ts           # GraphQL proxy
    │   │   └── og/{blog,works,certifications}/route.tsx
    │   ├── feed.xml/ · feed-en.xml/ · llms.txt/
    │   ├── sitemap.ts · robots.ts · manifest.ts
    │   └── globals.css          # Tailwind v4 + sıcak palet token'ları
    │
    ├── components/
    │   ├── admin/               # ★ Config-driven admin (TR-öncelikli)
    │   │   ├── sections.ts      #   Bölüm config'leri (TEK KAYNAK)
    │   │   ├── types.ts         #   Field / SectionConfig / Junction / Gallery
    │   │   ├── lib/crud.ts      #   /api/admin istemcisi (ince)
    │   │   ├── lib/languages.ts #   TR-first sıra, columnKey()
    │   │   ├── lib/errors.ts    #   classifyError(), isPermissionError()
    │   │   ├── lib/notifications.tsx
    │   │   └── components/      #   entity-form · entity-list · entity-manager
    │   │                         #   language-tabs · fields/ · ui/ · shell
    │   ├── home/ · works/ · blog/ · navigation/
    │   ├── ui/section-box.tsx   # Başlık üst border'da
    │   └── markdown/markdown-renderer.tsx
    │
    ├── lib/
    │   ├── data.ts              # Sunucu veri katmanı (cache'li, RLS'li)
    │   ├── utils.ts             # cn() · sanitizeUrl() · slugify()
    │   └── cv/                  # PDF veri eşleme + React-PDF dokümanı
    │
    ├── config/
    │   ├── locales/{en,tr,de,es}.ts
    │   ├── translations.ts      # Tip'li UI çevirileri
    │   ├── site.ts · user.ts
    │
    ├── context/
    │   ├── language-context.tsx
    │   ├── site-data-context.tsx
    │   └── admin-error-context.tsx
    │
    └── types/index.ts           # Merkezi arayüzler
```

### Public site bölümleri

- **Ana sayfa:** Hero → Deneyim (WorkCard) → Sertifika marquee → Son 3 blog → Footer
- **Hakkımda:** Hero → Deneyim | Liderlik → Eğitim | Diller → Yetenekler | Sertifikalar
- **Çalışmalar:** 2 sütun kart + detay modalı
- **Blog:** tek sütun kart + post modalı

Tüm bölümler `SectionBox` ile çerçevelenir.

---

## 🧩 Admin paneli — nasıl çalışır, nasıl genişletilir

Admin paneli **config-driven**'dır. Her bölüm `src/components/admin/sections.ts` içindeki tek bir `SectionConfig` ile tanımlanır ve **hiçbir bölüme özel bileşen yazılmadan** genel `entity-manager` / `entity-form` / `entity-list` tarafından render edilir.

### 🔑 Temel kavramlar

| Kavram | Dosya | Açıklama |
| --- | --- | --- |
| `SectionConfig` | `sections.ts` | Bölüm tanımı (tablo, alanlar, özel davranışlar) |
| `Field` | `types.ts` | Alan tanımı (tip, zorunlu, çevrilebilir, kaynak tablo) |
| `FieldType` | `types.ts` | `text · textarea · markdown · number · checkbox · select · multi_select · json_array · month_year · date · image_url · role_list` |
| `entity-manager.tsx` | `components/` | Liste + form + silme onayını tek bileşende birleştirir |
| `entity-form.tsx` | `components/` | Alan→input eşlemesi, TR/EN/DE/ES sekmeleri, validasyon |
| `entity-list.tsx` | `components/` | Arama, rozetler, sıralama, yayınla/gizle |
| `lib/crud.ts` | `lib/` | `/api/admin` Route Handler'ını çağıran ince istemci |
| `lib/languages.ts` | `lib/` | TR-first sıra (`LANG_ORDER`), `columnKey()` |
| `lib/errors.ts` | `lib/` | `classifyError()`, `isPermissionError()` |
| `lib/notifications.tsx` | `lib/` | `AdminToaster` + `notify.{success,error,loading,resolve}` |

### 🔐 Admin veri erişimi

Admin, veritabanına **tarayıcıdan doğrudan bağlanmaz.** Tüm işlemler `POST /api/admin` üzerinden sunucuda yapılır.

```
Tarayıcı → /api/admin → getUser() (JWT doğrulama)
                      → tablo/kolon allowlist
                      → kullanıcının oturumuyla PostgREST → RLS
```

**Neden:** Oturum çerezi `httpOnly: true`; JS token'ı okuyamaz. Service-role key hiçbir yerde kullanılmaz, böylece RLS her zaman geçerli kalır.

**Yeni admin özelliği eklerken:** `crud.ts`'e bir fonksiyon ekle → `/api/admin/route.ts`'e `opSchema` ve `execute()` dallarını ekle. İzin listelerini (`ALLOWED_TABLES`, `ALLOWED_ORDER_COLUMNS`, `REORDER_RPC_TABLES`, `JUNCTION_SPECS`, `GALLERY_SPECS`, `PUBLISH_FIELDS`) güncelle.

### ➕ Yeni bölüm ekleme (adım adım)

1. **Veritabanı** — `supabase_schema.sql` içine tablo + `order_index` + `*_tr/_de/_es` sütunları + RLS politikalarını ekle. Dosyayı canlı DB ile **%100 senkron** tut. Canlı DB'de kolon yoksa migration uygula (PostgREST yeni sütunu ancak DB'de gerçekten varsa görür).
2. **Config** — `sections.ts` içindeki `SECTION_CONFIGS` dizisine ~15 satırlık `SectionConfig` ekle.
   - `icon` **lucide-react bileşeninin kendisi**dir (string değil)
   - `displayField` (liste başlığı), `subtitleField?`, `imageField?` belirt
3. **Tip** — `src/types/index.ts` içine varlık arayüzünü ekle
4. **Kategori** — kaynak tablo gerekiyorsa `project_categories` / `blog_categories` gibi bir kategori tablosuna bağla
5. **Doğrula** — `npm run lint` + `npm run build`, sonra dev'de ekle/düzenle/sil/sırala akışını dene

### 🧱 Field config referansı

| Özellik | Değerler | Açıklama |
| --- | --- | --- |
| `type` | zorunlu | `FieldType` — hangi input render edileceğini belirler |
| `required` | `boolean` | Translatable ise **TR** değeri, değilse temel sütun kontrol edilir |
| `translatable` | `boolean` | `key` + `key_tr/_de/_es` sütunlarına yazılır. ⚠️ Sütun DB'de yoksa **işaretleme** |
| `options` | `{label,value}[]` | `select` için sabit seçenekler (DB'ye `value` yazılır) |
| `sourceTable` + `sourceValueField` + `sourceLabelField` | `select`/`multi_select` | Seçenekler başka tablodan çekilir |
| `validate` | `"url"` \| `"email"` | `sanitizeUrl()` / `isValidEmail()`; boş değer geçerlidir |
| `isCurrentField` | `string` | `month_year` bitiş alanını bu checkbox açıkken devre dışı bırakır |
| `textareaRows` | `number` | textarea/markdown yüksekliği |
| `fullWidth` | `boolean` | Form grid'inde tam satır |

### 🔌 SectionConfig özel davranışları

| Özellik | Ne yapar |
| --- | --- |
| `singleRow` | Liste yerine tek form (`about_me`) |
| `publishedField` | Yayınla/gizle toggle + rozet (`blogs.is_published`) |
| `filterField` | Liste filtre dropdown'ı (örn. `projects.category_id`) |
| `junction` | Çoktan-çoğa bağlantı (`certifications` ↔ `certification_skills`) |
| `gallery` | `project_images` / `blog_images` galerisi |

### 🌍 Çeviri ve veri kuralları (`entity-form`)

- Sekme sırası **TR → EN → DE → ES**; form TR ile açılır
- `translatable` alan → **tüm dil sütunları** tek save'de yazılır
- `translatable` olmayan alan → **yalnızca temel sütun** (asla `key_tr` yazma — `end_date_de` hatası böyle doğmuştu)
- **EN fallback:** Temel (EN) sütunlar bazı tablolarda `NOT NULL`. EN boşsa TR değeri temel sütuna yazılır (görsel geri düşüş). **Bu davranışı kaldırma.**
- Zorunlu kontrol: `required + translatable` → TR boş olamaz; diğer diller isteğe bağlı, boşsa "eksik çeviri" rozeti
- `role_list` (jsonb) tek dizi olarak `key` altında tutulur; başlık/açıklama `title_tr` vb. içinde, tarihler ortaktır

### 🔔 Bildirim ve hata kuralları

- Her CRUD işleminde `notify` kullan: `notify.loading("Kaydediliyor...")` → sonra `notify.resolve(id, msg, success)`
- Hata mesajını **asla jenerik yazma**: `classifyError(error).message` → sebep açık (yetki, FK çakışması, duplicate, limit, network)
- `isPermissionError(error)` → `useAdminError().handleOperationError(error, operation)` (toast + otomatik çıkış)
- Yeni alan/bölüm eklerken yüklenme durumlarını (skeleton/empty/toast) atlama

---

## 💡 Kod stili

- Temiz, okunabilir TypeScript; **`any` kullanma**
- Fonksiyonel bileşenler ve React Hooks
- Fonksiyonlar küçük, odaklı, yeniden kullanılabilir olsun
- Mevcut yardımcıları kullan:
  - `cn(...)` → `@/lib/utils` (sınıf birleştirme)
  - `sanitizeUrl()` → kullanıcı girdisi URL'ler için (XSS koruması)
  - `isValidEmail()` / `isValidImageUrl()` → uygun yerlerde
- `@/` yol alias'ını kullan (`src/`)
- İsimlendirme: bileşenler PascalCase (`info.tsx` → `Info`), fonksiyonlar camelCase, tipler PascalCode (`src/types/index.ts`)
- Kullanıcı girdisi olan tüm URL'ler render'dan önce sanitize edilmeli
- `useState`/`useEffect` çifti yerine `useSyncExternalStore` tercih et (hydration mismatch ve gereksiz render önler)
- Gereksiz karmaşıklıktan kaçın; minimal ve güvenli değişiklikler yap

---

## 🌍 Çok dillilik (i18n)

- **Diller:** EN, TR, DE, ES
- **Statik UI metinleri:** `src/config/locales/{en,tr,de,es}.ts`
- **İçerik çevirileri:** satır bazında Supabase'de (`title_tr`, `bio_de` …)
- **Okuma:** `getLocalized(value, lang)` → `@/lib/data`
- **Varsayılan dil `"en"`** — ancak **admin panelinde içerik girişi TR-önceliklidir**: formlar TR sekmesiyle açılır, zorunlu alan TR kontrol edilir, EN/DE/ES boşsa "eksik çeviri" rozeti görünür
- **DB temel sütunu EN'dir** (`key`); çeviriler `key_tr/_de/_es`'te saklanır

---

## 🔒 Güvenlik ve veritabanı bütünlüğü

Projede katmanlı bir güvenlik modeli var. **Zayıflatma.**

- **Service-role key veya secret'ları asla koda gömme.** Projede hiç kullanılmıyor; admin erişimi kullanıcının kendi oturumuyla yapılır
- Kullanıcı girdisi URL'lerini `sanitizeUrl()` ile sanitize et
- Markdown içeriğini `rehype-sanitize` ile sanitize et
- Admin rotaları (`/admin/*`, `/admin/login` hariç) `middleware.ts` ile korunur; çerezler `httpOnly` + `secure`
- `/api/admin` Route Handler'ı `getUser()` ile doğrular ve tablo/kolon allowlist'i uygular
- CSP `next.config.ts` içinde `NEXT_PUBLIC_SUPABASE_URL`'den dinamik üretilir
- `supabase_schema.sql` içindeki RLS mantığını kaldırma veya zayıflatma
- Yeni dış script eklerken CSP header'larını güncelle
- 🗄️ **Şema senkronizasyonu:** Veritabanı yapısını, tabloları, fonksiyonları, trigger'ları veya RLS politikalarını etkileyen **her** değişiklik `supabase_schema.sql` içinde ayrıntılı belgelenmelidir. Canlıya patch/hotfix uygulamadan önce repodaki şema dosyasıyla %100 senkron olduğundan emin ol

---

## 🧪 Test ve doğrulama kuralları

- Değişiklikleri tamamlamadan önce zihninde test et
- Otomatik kontrolleri tercih et: `npm run lint`, `npm run build`
- Test sırasında production'a yazma yapma; geçici kayıtla test edip temizle
- 🎭 **Yerel Playwright doğrulaması:** UI akışları geliştirirken, test ederken veya hata ayıklarken Playwright'ı **yerel dev sunucusuna karşı** çalıştır. Özellikle admin CRUD akışı (giriş → bölüm aç → kaydet → sil → sırala) mutlaka uçtan uca doğrulanmalı
- Bir düzeltmenin gerçekten çalıştığını **çalıştırarak** kanıtla; sadece build'e bakmakla yetinme

---

## ⚠️ Dikkat edilecek tuzaklar

- **PostgREST şema cache'i:** DB'ye yeni kolon ekledikten sonra "Could not find the 'X' column" hatası geliyorsa kolon canlı DB'de yok demektir → migration uygula. Varsa `NOTIFY pgrst, 'reload schema';`
- **Dev'de middleware çalışmaz** (Next 16.3 Turbopack bug, [GH #93328](https://github.com/vercel/next.js/issues/93328)): root `middleware.ts` üretimde korur (307 `/admin` → `/admin/login`); dev'de client-side koruma devrededir. **`middleware.ts`'i `proxy.ts`'e taşıma** — bu sürümde root proxy tanınmıyor
- **`next.config.ts`:** `/_next/static` `immutable` cache header'ı **yalnızca production**'da uygulanır (dev'de `no-cache`). Test sırasında yine de cache temizle / hard reload yap
- **`npm run dev` ile admin korumasını test etme.** Production build + `npm run start` kullan
- **Client-side filtreler güvenlik sınırı değildir.** `is_published` gibi kontroller hem sunucu tarafında `.eq(...)` ile hem de RLS ile uygulanmalı
- **Markdown `className`:** `hast-util-sanitize` glob (`"language-*"`) desteklemez, `className`'ı tüm attribute string'i olarak test eder ve yalnızca RegExp/tam eşleşme kabul eder. RegExp kullan
- **Admin her zaman koyu tema kullanır** (`.dark` sarmalayıcı + `zinc`/`violet`); public site **sıcak palet** (maroon `#632626` / brick `#9d5353` / tan `#bf8b67` / cream `#dacc96`). `--brand` tema duyarlıdır (açık: tan, koyu: cream). Admin'de public renklerini kullanma

---

## 🚫 Yasak işlemler

- `next.config.ts`, `middleware.ts`, `tsconfig.json` gibi config dosyalarını **sorulmadan** ezme
- Gerekçesiz bağımlılık kaldırma
- Gerekçesiz yeni kütüphane ekleme
- Açıkça istenmedikçe dosya silme
- Onay almadan projenin geniş bölümlerini refactor etme

---

## ⚙️ İş akışı

1. **İlgili dosyaları oku** (filesystem araçlarıyla)
2. **Mevcut mimariyi anla** — değişiklik yapmadan önce
3. **Değişiklikleri planla** — kod yazmadan önce
4. **Minimal ve güvenli değişiklikler uygula**
5. **Bittiğinde neyi neden değiştirdiğini açıkla**
6. **Tamamlamadan önce doğrula:** `npm run lint` **ve** `npm run build` çalıştır

---

## 🧩 Notlar

- Bu proje AI destekli geliştirilir ve kıdemli bir yazılım mühendisi gibi davranmayı hedefler
- Tüm içerik `/admin` üzerinden düzenlenebilir; public sayfalar Supabase'den okur
- Admin paneli config-driven'dır — **yeni bölüm/alan eklemeden önce bu dosyanın admin bölümünü oku** ve config'i bozma
- Upstream kütüphanelerin güncel dokümantasyonu için **Context7 MCP**'yi kullan (Next.js, React, Supabase, Tailwind, Motion, Zod…)
- Supabase MCP ile canlı DB'yi inceleyebilirsin (`opencode mcp list` → bağlı olmalı)
- Kanonik GitHub URL: `https://github.com/batuhd/batuhdede.me`