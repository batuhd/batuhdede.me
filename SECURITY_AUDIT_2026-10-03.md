# Security Audit — 2026-10-03

> ## 📌 DEVİŞ NOTU
>
> **Bu dosya repodadır ve repo `public` görünürlüktedir.** İçinde gerçek bir
> credential **yoktur**: yalnızca zaten sitede görünen admin e-postası, Supabase
> proje ref'i (istemci bundle'ında zaten açık) ve kullanılamayan kesik token
> öneki bulunur. Gerçek admin **auth UUID'si bilinçli olarak bu repoya
> yazılmadı** (aşağıdaki madde 2).
>
> **Bağlam:** Bu oturumda tam statik analiz + read-only canlı test + yerel production
> instance'ta agresif test + Playwright uçtan uca doğrulama yapıldı. 17 bulgu
> düzeltildi. Ardından 2. oturumda M-1 migration'ı canlıya uygulandı ve tüm
> bulgular commit edildi.

### ✅ Bekleyen işler — durum

| # | İş | Durum | Not |
| --- | --- | --- | --- |
| 1 | **`blogs` RLS politikası** — anon için `is_published = true` | ✅ **Uygulandı** | Migration `restrict_anon_blog_read_to_published`; ölçümle doğrulandı |
| 2 | **51 politikadaki `YOUR-USER-UUID-HERE` placeholder'ı** | ⏸️ **Bilinçli yapılmadı** | Repo `public`. Canlı DB'de gerçek UUID yazılı; repoda placeholder kalır |
| 3 | Admin şifresi rotasyonu | ⏳ Kullanıcıya ait | Sohbette paylaşıldı, loglara düştü |
| 4 | Değişiklikleri commit et | ✅ Yapıldı | 17 dosya + `docs/screenshots/` + bu rapor |

### 🔌 MCP notu

Supabase MCP `opencode.json` içinde bağlı (`✓ supabase connected`) ve
`apply_migration` / `execute_sql` araçları çalışır durumda.

Migration'lar artık **service-role anahtarına gerek kalmadan** MCP üzerinden
canlıya uygulanabiliyor.

### 🔑 Admin erişimi (test için)

- E-posta: `batuhdede@gmail.com`
- Şifre: bu oturumda kullanıcı tarafından paylaşıldı, **dosyaya yazılmadı.**
- Turnstile **localhost'ta çalışmıyor** (site key `localhost`'a izin vermiyor) →
  localhost'ta UI ile giriş testi yapılamıyor. Çözüm: production'da giriş yapıp
  session çerezini `context.addCookies()` ile localhost'a taşımak.
- Turnstile'ın **sunucu tarafında zorunlu** olduğu doğrulandı (`captcha_failed`).

### ✅ Commit edilen değişiklikler

```
M middleware.ts                          ← httpOnly zorlaması + çerez yeniden yazımı
M next.config.ts                         ← poweredByHeader, upgrade-insecure-requests
M src/app/layout.tsx                     ← async + fetchMaintenanceMode (SSR bakım)
M src/components/maintenance-guard.tsx   ← karar artık prop ile geliyor
M src/lib/data.ts                        ← languages.slug fix + is_published + fetchMaintenanceMode
M src/app/api/auth/login/route.ts        ← httpOnly, body limiti, x-forwarded-free, attemptsLeft kaldırıldı
M src/app/api/auth/logout/route.ts       ← httpOnly
M src/app/admin/page.tsx                 ← oturum kontrolü sunucuya taşındı
M src/app/admin/login/page.tsx           ← oturum kontrolü sunucuya taşındı
M src/components/admin/lib/crud.ts       ← /api/admin istemcisi (imzalar aynı)
M src/components/admin/components/settings.tsx
M src/components/admin/components/recent-images.tsx
M src/app/llms.txt/route.ts              ← yanlış "strict CSP" iddiası düzeltildi
M supabase_schema.sql                    ← M-1 blog politikası + idempotency DROP'ları
M README.md · M AGENTS.md · M .gitignore  ← dokümantasyon
A src/app/api/admin/route.ts             ← YENİ Route Handler
A docs/screenshots/                      ← 10 ekran görüntüsü
A SECURITY_AUDIT_2026-10-03.md           ← bu rapor
```

> `supabase_schema.sql`'deki admin UUID **placeholder olarak bırakıldı**
> (bilinçli karar, madde 2). Canlı DB'de gerçek UUID yazılıdır; 51 politika
> canlı ile birebir aynıdır, yalnızca dosya taşınabilir kalması için genel
> tutulmuştur.

**İlk turda commit edildi (`db1a9f6`):** `rss.ts`, `use-modal-history.ts`,
`markdown-renderer.tsx`, `profile-sections.tsx`, `project-detail.tsx`,
`gallery-field.tsx` ve bağımlılık güncellemeleri.

Doğrulama durumu: `npm run lint` → 0 hata (4 uyarı, önceden mevcut) ·
`npm run build` → 79/79 sayfa · `npm audit --omit=dev` → 0 açık.

---

**Hedef:** `batuhdede.me` · Next.js 16.3.8 · React 19.2 · Tailwind v4 · Supabase
**Yöntem:** Tam statik analiz (152 dosya) + production'da read-only dinamik test + yerel production instance'ta agresif test + Playwright uçtan uca doğrulama
**Kapsam dışı:** Yük/DoS testi, credential stuffing, yıkıcı yazma (geçici kayıtla test edildi ve silindi)
**Durum:** 17 bulgu düzeltildi ve doğrulandı · 2 bulgu bilinçli uygulanmadı · 1 bulgu "by design"

---

## Özet

| Seviye | Toplam | Düzeltildi | Kalan |
| --- | --- | --- | --- |
| HIGH | 2 | ✅ 2 | — |
| MEDIUM | 5 | ✅ 4 | M-1 migration uygulandı · M-5 "by design" |
| LOW | 12 | ✅ 10 | L-5 bilinçli uygulanmadı · L-12 bilinçli yerinde bırakıldı |
| INFO | 4 | ✅ 2 | 2 dokunulmadı (I-3, I-4) |
| **Toplam** | **23** | **18** | **5** |

**Doğrulama:** `npm run lint` → 0 hata · `npm run build` → 79/79 sayfa · `npm audit --omit=dev` → **0 açık** · Playwright ile uçtan uca admin CRUD testi · M-1 migration'ı canlıda ölçümle doğrulandı.

---

## HIGH

### H-1 · Oturum çerezleri `httpOnly` değildi ✅ DÜZELTİLDİ
**Konum:** `middleware.ts`, `src/app/api/auth/{login,logout}/route.ts`, `src/lib/supabase.ts`, `src/components/admin/lib/crud.ts`

**Kanıt (düzeltme öncesi, canlı):**
```js
// node_modules/@supabase/ssr/dist/main/utils/constants.js:4-11
DEFAULT_COOKIE_OPTIONS = { path:"/", sameSite:"lax", httpOnly: false, maxAge: 400*24*60*60 }
// cookies.js:390 → { ...DEFAULT_COOKIE_OPTIONS, ...cookieOptions, maxAge: DEFAULT.maxAge }
```
Proje `cookieOptions` içinde yalnızca `path`/`sameSite`/`secure` veriyordu → `httpOnly: false` korunuyordu. Çerez `base64url(session JSON)` olduğu için access + refresh token doğrudan okunabiliyordu.

Canlı doğrulama (Playwright, production oturumu):
```
cookie.httpOnly = false
document.cookie = "sb-pwxgbnacoopcnvckwofi-auth-token=base64-eyJhY2Nlc3NfdG9rZW4i..."
```

**Etki:** Siten üzerinde çalışan herhangi bir JS (gelecekteki XSS, ele geçirilmiş npm bağımlılığı, kötü niyetli eklenti) `document.cookie` ile admin oturumunu çalabilirdi. `rel="noopener"` ve CSP yardımcı olmaz — script same-origin.

**Dokümantasyon çelişkisi:** `AGENTS.md`, `README.md` ve `llms.txt` "HTTP-only secure cookies" iddiasında bulunuyordu.

**Düzeltme:**
1. `middleware.ts`, `api/auth/login`, `api/auth/logout` → `cookieOptions.httpOnly = true`
2. Yeni `src/app/api/admin/route.ts` — tüm admin veri erişimi sunucuda
   - `getUser()` ile JWT doğrulaması (cookie içeriğine güvenilmez)
   - Sunucu client'ı **kullanıcının oturumuyla** açılır; service-role kullanılmaz → RLS aynen geçerli
   - 17 tablo izin listesi, `order_index`/`created_at`/`date` sıralama allowlist'i, junction/gallery kolon sabitleri, tek izinli toggle alanı (`is_published`)
   - PostgREST hataları `code`/`message`/`details` ile taşınır → `classifyError()` çalışmaya devam eder
3. `crud.ts` ince istemciye dönüştü (dış imzalar değişmedi, 3 çağıran dosya güncellenmedi)
4. `settings.tsx`, `recent-images.tsx`, `admin/page.tsx`, `admin/login/page.tsx` sunucuya taşındı
5. **Mevcut oturumlar için zorlamalı çerez yazımı** — `maxAge` 400 gün olduğu için, doğrulanmış oturumda çerez değeri korunarak bayraklar `httpOnly` ile response'a yeniden yazılır

**Düzeltme sonrası doğrulama:**
```
Set-Cookie (login/logout):  sb-...-auth-token=; ... Secure; HttpOnly; SameSite=lax   ✅

Mevcut (httpOnly'süz) çerez ile test:
  başlangıç           httpOnly = false
  1 istek sonrası     httpOnly = true      ← middleware zorladı
  document.cookie     'sb-' YOK            ← JS artık okuyamıyor
  admin paneli        çalışıyor, e-posta görünüyor

Admin CRUD (gerçek session ile, uçtan uca):
  create 200 · update 200 · delete 200 · reorder 200 · setPublished 200 (off→on) ✅
  junction read/write-back 200 (no-op diff, değişmedi) ✅ · gallery 200 ✅
  UI'dan form kaydı → DB'ye yazdı ✅
  pg_catalog.pg_tables            → 403 42501 ✅
  orderColumn "id; DROP TABLE…"   → 403 42501 ✅
```

**Etkilenmeyenler:** `site-data-context.tsx` (14 sorgu) ve `hero.tsx` yalnızca **anon** okuma yapıyor; oturum çereziyle ilgisi yok.

---

### H-2 · Yayınlanmamış blog içeriği public HTML'e gömülüydü ✅ DÜZELTİLDİ
**Konum:** `src/lib/data.ts:403, 515, 567, 706`

**Kanıt (düzeltme öncesi build):**
```
/blog → 145008 byte
  initialBlogs prop    : 1
  'content_tr' alanı  : 14   ← 14 blogun TAM markdown çevirisi
  'is_published' alanı : 14
```
`fetchBlogData()` filtresiz `select("*")` çalıştırıyordu; filtre yalnızca client'ta (`blog-content.tsx:35`). `curl /blog | grep` ile tüm içerik alınıyordu.

Ayrıca `supabase_schema.sql:703` `blogs` için `USING (true)` politikasıyla anon key'e taslakları açıyordu.

**Düzeltilen 4 sorgu:**

| Satır | Fonksiyon | Kullanıcı |
| --- | --- | --- |
| `403` | `fetchAllData` | `/api/cv` |
| `515` | `fetchHomeData` | ana sayfa, about, llms.txt, sitemap, OG |
| `567` | `fetchBlogData` | `/blog`, `/blog/[slug]`, sitemap, llms.txt, OG |
| `706` | `fetchWorksData` | `/works`, `/works/[slug]`, sitemap, llms.txt, OG |

**Dürüstlük notu:** 14 blogun da yayında olması nedeniyle çıktı önce/sonra aynıydı (`content_tr` 14 → 14). Filtre kodda doğrulandı; ampirik fark yalnızca bir taslak satırı olduğunda görünür. Bu test kapsam dışıydı (production DB yazma gerektirir).

**Kalan:** `blog_images` (`:572`) filtrelenmedi — yalnızca görsel URL'leri sızar (düşük hassasiyet) ve PostgREST join'i gerektirir.

---

## MEDIUM

### M-1 · `blogs` RLS politikası `is_published` filtresiz ✅ DÜZELTİLDİ (migration uygulandı)
**Konum:** `supabase_schema.sql:702-711`

Migration `restrict_anon_blog_read_to_published` ile canlıya uygulandı:

```sql
DROP POLICY IF EXISTS "Public read" ON public.blogs;

-- anon (public okuma) artık yalnızca yayınlanmış yazıları görür
CREATE POLICY "Public read published blogs" ON public.blogs
  FOR SELECT TO anon USING (is_published = true);

-- Admin paneli taslakları da görmeli
CREATE POLICY "Authenticated read blogs" ON public.blogs
  FOR SELECT TO authenticated USING (true);
```

**Ölçümle doğrulama** (geçici taslak yazıldı → anon key ile okundu → silindi):

```
anon  ?is_published=eq.false          → []              ✅ taslak görünmüyor
anon  ?slug=eq.<taslak slug>          → []              ✅ içerik sızmıyor
anon  toplam yayınlanan (count=exact) → 0-13/14        ✅ 14 yazı, taslak hariç
anon  POST (insert)                   → 401            ✅ yazma reddedildi
anon  PATCH is_published=true         → 204, veri değişmedi  ✅ RLS satırı filtreledi
anon  DELETE                          → 204, veri değişmedi  ✅
authenticated (RLS rolü simülasyonu)  → 15/15, taslak dahil ✅ admin taslakları görebiliyor
```

> Şu an 0 taslak kayıt var. Yani migration aktif bir sızıntıyı kapatmadı, **gelecekte
> yapılacak taslakları** baştan engelledi.

---

### M-2 · OG route'ları cache'lenmiyordu ✅ DÜZELTİLDİ
**Kanıt (canlı, düzeltme öncesi):**
```
/api/og/blog #1  1.25s  x-vercel-cache: MISS
/api/og/blog #2  1.08s  x-vercel-cache: MISS   ← 2. istek de tam render
/api/og/blog #3  1.12s  x-vercel-cache: MISS
cache-control: public, max-age=0, must-revalidate
```
Her istek tam `fetch*Data()` + 1200×630 rasterizasyon yapıyordu.

**Düzeltme:** 3 route'a `export const revalidate = 3600` + `Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate=86400`.
**Doğrulama:** yerel instance → `s-maxage=3600` ✅

---

### M-3 · `/api/cv` cache-key kirliliği ✅ DÜZELTİLDİ
**Kanıt (düzeltme öncesi):**
```
?lang=en          → HIT  0.15s
?lang=en&cb=1     → MISS 1.06s   ← tam render
?lang=en&cb=2     → MISS 1.10s
?lang=en&cb=3     → MISS 0.87s
```
Cache anahtarı tam URL → rastgele parametre cache'i atlatıyor, her istekte 16 sorgu + React-PDF.

**Düzeltme:** CDN cache anahtarı içerikten normalize edilemediği için **pahalı kısım process içi önbelleğe** alındı (`bufferCache`, anahtar yalnızca `lang` → sabit 4 giriş).

**Doğrulama:**
```
?lang=en&cb=386   → 0.759s  (soğuk render)
?lang=en&cb=16911 → 0.0035s ✅
?lang=en&cb=7856  → 0.0040s ✅
```
Cache-bypass saldırısı ~300× hızlandı.

---

### M-4 · Login rate limit bellek içi ve header'a güveniyordu ✅ DÜZELTİLDİ
**Kanıt (yerel, Vercel edge olmadan):**
```
IP rotasyonu (10.0.0.1..8)  → attemptsLeft hep 4   (kova yenileniyor, kilit YOK)
Sabit IP (6 deneme)         → 5'te kilitleniyor
IP rotasyonu + AYNI e-posta → 10'da kilitleniyor   ← per-e-posta kovası tuttu
```

**Önemli düzeltme:** Sınırsız brute-force **değil** — per-e-posta kovası 10/15dk ile sınırlıyor. Gerçek sorun bellek içi sayaçlar (cold start'ta sıfırlanır, serverless'ta instance başına ayrı) ve `attemptsLeft` sızıntısıydı.

**Vercel notu:** Canlıda `x-forwarded-for` spoof'unun **çalışmadığı** doğrulandı (Vercel edge header'ı eziyor). Bu koruma Vercel'e özgü.

**Düzeltilenler:**
| Değişiklik | Detay |
| --- | --- |
| `x-forwarded-for` güveni kaldırıldı | Artık yalnızca `x-vercel-forwarded-for` ve `x-real-ip` |
| `Map` boyut tavani | `MAX_TRACKED_KEYS = 10_000`, aşılırsa en eski girişler atılıyor |
| Request body limiti | `MAX_BODY_BYTES = 4 KB` → `413` |
| `attemptsLeft` kaldırıldı | Kalan hakket bilgisi sızıyordu; frontend kullanmıyordu |

**Doğrulama (yerel, spoof ile):**
```
ÖNCE:  x-forwarded-for: 10.9.1.1 → attemptsLeft 4
       x-forwarded-for: 10.9.2.2 → attemptsLeft 4   ← yeni kova, kilit YOK
SONRA: x-forwarded-for: 10.9.1.1 → "Invalid credentials."
       …
       x-forwarded-for: 10.9.5.5 → "Too many failed attempts"  ✅ kilitlendi
```

**Kalan risk:** Sayaçlar hâlâ bellek içi. Kalıcı store (Vercel KV / Upstash) önerilir.

---

### M-5 · `contact_emails` anon ile okunabiliyor ⏸️ **DÜZELTİLMEYECEK — "by design"**
Anon key ile 3 gerçek e-posta okunabiliyor. Ancak bunlar **site içeriğinin parçası**: `src/components/home/hero.tsx:236` public olarak render ediyor, ayrıca `page.tsx:39`, `about/page.tsx:57`, `lib/cv/index.ts:119` kullanıyor. Anon read'i kapatmak **siteyi kırar** — ve kullanıcının ifadesiyle bu e-postalar "insanların ulaşabilmesi için" siteye konmuş.

Bu bir açık değil, tasarım. Gerçek risk yalnızca toplu scraping. Karşı önlem istenirse: PostgREST view/RPC ile yalnızca render edilen alanları döndürmek.

---

## LOW

| # | Bulgu | Konum | Durum |
| --- | --- | --- | --- |
| L-1 | `next@16.3.0` RCE advisory'lerinde (`>=16.2.0 <16.3.6`) | `package.json` | ✅ **16.3.8**. İstismar edilemez (probe yansımadı, `<div>` render, DB değerleri) |
| L-2 | `sharp@0.35.3` (high, libheif) | — | ✅ `npm audit fix` |
| L-3 | `baseline-browser-mapping@2.10.40` (moderate) | — | ✅ `npm audit fix` |
| L-4 | `x-powered-by: Next.js` sızıyordu | `next.config.ts` | ✅ `poweredByHeader: false` — doğrulandı |
| L-5 | CSP `script-src 'unsafe-inline'` | `next.config.ts` | ⏸️ nonce uygulanamıyor (aşağıda) |
| L-6 | Rehype-sanitize tüm elementlerde `className` | `markdown-renderer.tsx` | ✅ RegExp allowlist — regresyon testli |
| L-7 | DB'den gelen 4 `href` `sanitizeUrl()`'dan geçmemiş | `profile-sections.tsx`, `project-detail.tsx` | ✅ `safeActivityLink`/`safeCertLink`/`safeProjectLink`/`safeProjectGithub` |
| L-8 | Galeri `image_url` doğrulamasız yazılıyordu | `gallery-field.tsx` | ✅ `sanitizeUrl()` + "Geçersiz URL" |
| L-9 | RSS `<link>`/`<guid>` slug'ı escape etmiyordu | `src/lib/rss.ts:62,64` | ✅ `escapeXml()` |
| L-10 | `decodeURIComponent()` `popstate` içinde throw ediyordu | `use-modal-history.ts:64` | ✅ try/catch |
| L-11 | `/api/github` yanıt cache header'ı yoktu | `api/github/route.ts` | ✅ `s-maxage=3600` |
| L-12 | Şemada placeholder admin UUID (51 policy) | `supabase_schema.sql` | ⏸️ **Bilinçli yerinde bırakıldı** — repo `public`. Canlı DB'de gerçek UUID yazılı, dosyada placeholder kalıyor |

### L-5 · CSP nonce neden uygulanamadı (test edilerek)
Varsayım yerine ölçüldü:

```
1) CSP next.config.ts'te iken  → middleware nonce CSP'sini EZİYOR
2) CSP sadece middleware'de   → prerender sayfalara ULAŞMIYOR
                                (x-nextjs-prerender: 1, header response'a konmuyor)
3) Nonce = istek başına farklı değer; statik HTML ile birlikte
   matematiksel olarak çalışamaz.
```

Nonce kullanmak 79 sayfanın tamamını dynamic'e çevirirdi (statik prerender + ISR kaybı, TTFB ve sunucu maliyeti artışı — SEO/performance kaybı kesin). Buna karşılık korunan şey, mevcut haliyle **erişilebilir bir XSS sink'i olmayan** bir uygulama katmanı.

**Uygulanan sertleştirmeler:**
- `upgrade-insecure-requests` eklendi
- HSTS `max-age=31536000; includeSubDomains` (zaten vardı)
- **Dokümantasyondaki yanlış iddia düzeltildi:** `llms.txt` "strict Content-Security-Policy", README "Strict CSP" → gerçeği yansıtacak şekilde. Gerekçe `next.config.ts` içine yorum olarak yazıldı.

Birincil XSS savunması uygulama katmanında: `sanitizeUrl()` + `rehype-sanitize` + `dangerouslySetInnerHTML` yalnızca `<` → `\u003c` escape'li JSON-LD'de.

### L-6 regresyon testi
`hast-util-sanitize` `className` değerini **tüm attribute string'i** olarak test eder ve **yalnızca RegExp veya tam eşleşme** kabul eder — glob (`"language-*"`) çalışmaz. İlk denemede bu kaçırıldı; RegExp'e çevirilip izole test edildi:

```
✅ KORUNDU   language-bash                 {"className":["language-bash"]}
✅ KORUNDU   language-js                   {"className":["language-js"]}
✅ KORUNDU   language-c++                  {"className":["language-c++"]}
✅ ENGELLENDİ fixed inset-0 z-50 (Tailwind) {"className":[]}
✅ ENGELLENDİ hidden                        {"className":[]}
✅ ENGELLENDİ javascript: link / data: img / onerror / style  →  soyuldu
```
Kod bloklarının `language-xxx` sınıfı korunuyor → syntax highlighting bozulmuyor.

---

## INFO

### I-1 · Bakım modu içeriği HTML'e gömüyordu ✅ DÜZELTİLDİ
`MaintenanceGuard` bir **client component**'tı ve `loaded` beklediği için SSG/pre-render HTML'inde `children` (tüm site içeriği) render ediliyordu. Bakım modunda bile `curl` ile tüm içerik alınabiliyor, arama motorları indeksleyebiliyor ve kullanıcı ekranda içerik→bakım ekranı geçişi yaşıyordu.

**Düzeltme:** `fetchMaintenanceMode()` (`data.ts`) ile karar **sunucuda** veriliyor; `layout.tsx` async oldu ve değeri `MaintenanceGuard`'a prop olarak geçiyor. Guard artık `loaded` beklemiyor.

**Doğrulama:** 79 sayfa hâlâ `○ (Static)` + ISR 1dk — statik mimari bozulmadı. 1 dakikalık revalidate penceresi bakım değişikliğinin yayılma süresidir.

> **Önceki yanlış iddiam:** "Bakım modu ana sayfayı kapatamaz" demiştim, **bu yanlıştı**. `MaintenanceGuard` `<main>{children}</main>`'in üstünde, yani sayfaların kendi `initialData`'lı provider'larının dışında; layout seviyesindeki provider'ı okuyor. Bakım modu tüm sayfalarda doğru çalışıyordu.

### I-2 · `languages.slug` kolonu yok — 194 hata/gün ⭐ DÜZELTİLDİ
**Kaynak:** `~/İndirilenler/supabase_logs.json` (217 kayıt, 2026-10-02 → 10-03)

```
[194x] column languages.slug does not exist
[ 23x] new row violates row-level security policy   ← bu testlerin kendi INSERT denemeleri
```

`src/lib/data.ts:587,719` `languages` tablosundan `slug` kolonunu seçiyordu; kolon **tabloda hiç yok** (gerçek kolonlar: `id, name, level, name_tr, name_de, name_es, order_index, created_at`). Repo şemasında da yok → kalıcı hata, şema drift değil.

**Etki (sessiz):** PostgREST hata döndürür ama Supabase JS istisna atmaz → `langsRes.data = null` → `entityMap.languages` her zaman boş. `/blog/[slug]` ve `/works/[slug]` sayfalarında bir blog/projeye bağlı **"İlgili Dil" bloğu hiç görünmüyordu.**

**Düzeltme:** `select("id, name, level, name_tr, name_de, name_es")` — `entityMap` yalnızca `id` + `name` + çeviriler kullanıyor.
**Doğrulama:** canlı DB'de sorgu artık 3 dil döndürüyor ✅

### I-3 · Bakım modu prod'da `initialData` yüzünden… (düzeltildi, I-1'e bak)
`layout.tsx`'in verdiği `initialData` `isMaintenance` taşımıyordu. I-1 düzeltmesi bunu da ortadan kaldırdı (karar artık doğrudan layout'ta).

### I-4 · Diğer INFO (dokunulmadı)
| Bulgu | Not |
| --- | --- |
| Ölü kod + ReDoS şekilli regex | `stripHtml`, `truncateText`, `isValidImageUrl` → **sıfır çağrı yeri**. Silinebilir |
| `getLocalized` iki kopyası farklı boş-değer semantiği | `data.ts:809` vs `language-context.tsx:72-85` |
| `SiteDataProvider` sayfa başına 14 client-side sorgu | `site-data-context.tsx:84-194`; `initialData` verilmediği için. Not: bunlar **anon** okuma — oturum çereziyle ilgisi yok, H-1 kapsamı dışında |

---

## Test ederek ÇÜRÜTÜLENLER

| İddia | Test | Sonuç |
| --- | --- | --- |
| `/admin` auth bypass — alg=none, sahte cookie, `Bearer` spoof | 6 varyant | ❌ 307→login |
| `x-forwarded-user` / `x-user-id` / `x-remix-user` spoof | 5 header | ❌ 307→login |
| HTTP method confusion (`PUT`/`PATCH`/`DELETE`/`OPTIONS`) | 6 method | ❌ 307→login |
| Path traversal (`/admin%2f`, `/./admin`, `/api/../admin`) | 14 varyant | ❌ login'e redirect |
| IDOR (sayısal id, `undefined`, `null`, SQLi, XSS) | 12 varyant | ❌ 404 |
| `/api/og/blog?slug=../../etc/passwd` | — | ❌ 200 ama default görsel |
| CORS credential'li origin | `Origin: evil.example` | ❌ ACAO header yok |
| Host header injection | `Host: evil.example` | ❌ yanıtta 0 geçiş |
| ReDoS / 20.000 karakterlik girdi | — | ❌ 431 |
| CL+TE request smuggling | — | ❌ 400 |
| Supabase OpenAPI spec / GraphQL / Auth settings | apikey'siz | ❌ 401 |
| **Anon `x-forwarded-for` ile rate-limit atlatma (Vercel'de)** | canlı | ❌ edge header'ı eziyor |
| **Sınırsız brute-force (IP rotasyonu ile)** | yerel | ❌ per-e-posta kovası 10'da durduruyor |
| **Supabase CAPTCHA sunucu tarafında zorunlu mu** | `auth/v1/token` | ✅ EVET — `captcha_failed`. Turnstile secret'ı projede tutulmuyor, doğrulama Supabase Dashboard'da |
| Anon INSERT — 17 tablo | canlı | ❌ 17/17 `42501` |
| Anon UPDATE | canlı | ❌ 204, veri değişmedi |
| Anon RPC `reorder_items` | canlı | ❌ `42501` |
| JSON-LD `dangerouslySetInnerHTML` | statik | ❌ `<` → `\u003c` |
| PostgREST/`.or()`/`.filter()` enjeksiyonu | statik | ❌ kod tabanında hiç yok |
| Path traversal (`readFileSync`) | statik | ❌ 4 çağrı da sabit yol |
| SSRF | statik | ❌ tüm `fetch` hedefleri sabit |
| `sanitizeUrl()` bypass (kontrol karakteri, `java\tscript:`) | statik | ❌ hepsi `null`'a düşüyor |
| Markdown XSS | statik | ❌ iki bağımsız katman |

---

## Canlı DB migration'ı — ✅ UYGULANDI (bu bölüm kayıt için korundu)

Service-role anahtarına gerek kalmadan **Supabase MCP** ile uygulandı.
Uygulanan migration: **`restrict_anon_blog_read_to_published`** (yalnızca `blogs`
SELECT politikası; yazma politikalarına dokunulmadı).

### Adım 0 — Mevcut durumu doğrula (önce oku, sonra yaz)

```sql
-- (a) Gerçek UUID nedir?
SELECT id, email FROM auth.users;

-- (b) Politikaların mevcut hali
SELECT policyname, cmd, roles, qual
FROM pg_policies WHERE tablename = 'blogs';

-- (c) Placeholder kaç yerde var?
SELECT count(*) FROM pg_policies
WHERE schemaname = 'public' AND qual LIKE '%YOUR-USER-UUID-HERE%';

-- (d) Şema dosyası ile canlı DB senkron mu?
SELECT column_name, data_type FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'languages'
ORDER BY ordinal_position;
-- languages: id, name, level, name_tr, name_de, name_es, order_index, created_at
```

> ⚠️ **`languages` tablosunda `slug` kolonu YOK** (I-2 bulgusu). Repo şemasıyla da
> uyumlu. `information_schema` ile teyit et; çıkarsa kod tarafı düzeltilmeli.

### Adım 1 — `blogs` SELECT politikasını daralt

```sql
DROP POLICY IF EXISTS "Public read" ON public.blogs;

-- anon (public okuma) artık yalnızca yayınlanmış yazıları görür
CREATE POLICY "Public read published blogs" ON public.blogs
  FOR SELECT TO anon USING (is_published = true);

-- Admin paneli taslakları da görmeli
CREATE POLICY "Authenticated read blogs" ON public.blogs
  FOR SELECT TO authenticated USING (true);
```

### Adım 2 — Gerçek admin UUID'sini 51 politikaya yaz ⏸️ YAPILMADI (bilinçli)

Bu adım **canlı DB için zaten yapılmış durumda**: canlı DB'deki 51 `Admin *`
politikasının tamamı gerçek admin UUID'sini içeriyor (bu oturumda
`pg_policies` üzerinden doğrulandı, placeholder sayısı = 0).

Yapılmayan kısım `supabase_schema.sql` dosyasındaki placeholder'ı gerçek değerle
değiştirmekti. **Bilinçli olarak yapılmadı:** repo `public` görünürlükte ve gerçek
auth UUID'sini kalıcı olarak yayımlamak kimlik ifşasıdır. Dosya placeholder
olarak kaldı; canlı ile fark yalnızca bu değerde ve AGENTS.md'nin taşınabilirlik
amacıyla çelişmemesi bilinçli bir tercih.

Aşağıdaki blok, kendi kurulumunda placeholder kalan bir clone için referansdır:

```sql
DO $$
DECLARE
  admin_uuid uuid := 'BURAYA_GERCEK_UUID';  -- (a) sorgusundan
  r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname FROM pg_policies
    WHERE schemaname = 'public' AND qual LIKE '%YOUR-USER-UUID-HERE%'
  LOOP
    EXECUTE format('DROP POLICY %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    EXECUTE format('CREATE POLICY %I ON %I.%I FOR SELECT USING ((SELECT auth.uid()) = %L)',
                   r.policyname, r.schemaname, r.tablename, admin_uuid::text);
    EXECUTE format('CREATE POLICY %I ON %I.%I FOR INSERT WITH CHECK ((SELECT auth.uid()) = %L)',
                   r.policyname, r.schemaname, r.tablename, admin_uuid::text);
    EXECUTE format('CREATE POLICY %I ON %I.%I FOR UPDATE USING ((SELECT auth.uid()) = %L)',
                   r.policyname, r.schemaname, r.tablename, admin_uuid::text);
    EXECUTE format('CREATE POLICY %I ON %I.%I FOR DELETE USING ((SELECT auth.uid()) = %L)',
                   r.policyname, r.schemaname, r.tablename, admin_uuid::text);
  END LOOP;
END $$;
```

> Bu blok `INSERT`/`UPDATE`/`DELETE` politikası olmayan tablolar için hata verir
> (aynı isim üç kez oluşmaya çalışır). Daha güvenli yol: `supabase_schema.sql`
> dosyasını düzenleyip **dosyayı tamamen yeniden uygulamak** (DROP POLICY IF EXISTS
> içerdiği için idempotent).

**Sonra `supabase_schema.sql` dosyasını gerçek UUID ile güncelle** — AGENTS.md
"şema dosyası canlı DB ile %100 senkron olmalı" kuralı gereği.

### Adım 3 — Doğrulama

```bash
# (a) Taslak görünmemeli
curl -s "$SUPABASE_URL/rest/v1/blogs?select=title&is_published=eq.false" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY"
# → []  beklenir

# (b) Yayınlanmış görünmeli
curl -s "$SUPABASE_URL/rest/v1/blogs?select=title&is_published=eq.true&limit=2" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY"
# → 2 satır beklenir

# (c) Anon yazma hâlâ reddedilmeli
curl -s -o /dev/null -w "%{http_code}\n" -X POST "$SUPABASE_URL/rest/v1/blogs" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" -d '{"title":"probe"}'
# → 401 (42501 policy) beklenir
```

Ardından **admin panelini gerçekten test et** (`/admin` → bir bölüm aç → kaydet →
sil). Politika yanlışlıkla daralırsa admin paneli boş görünür.

Migration sonrası gerçekten yapılanlar:

```
(a) anon taslak filtresi        → []                      ✅
(b) anon yayınlananlar          → 0-13/14                 ✅
(c) anon INSERT (blogs)         → 401                     ✅
    anon PATCH is_published     → 204, veri DEĞİŞMEDİ     ✅ (RLS satırı filtreledi)
    anon DELETE                 → 204, veri DEĞİŞMEDİ     ✅
    authenticated rolü          → 15/15, taslak dahil      ✅
    geçici taslak satırı        → silindi (14 kayıt, 0 taslak) ✅
```

**Anon yazma engeli (tüm 17 tablo) veri yazmadan doğrulandı** — `pg_policies`
gruplaması: `INSERT` 17/17, `UPDATE` 17/17, `DELETE` 17/17 politikası
`auth.uid()`'ye kilitli, **açık olan 0**. (Bu turda 17 tabloya POST denendi ve
17/17 reddedildi; ancak dönen `400` şema doğrulamasıydı, RLS'e ulaşılmadan —
bu yüzden asıl kanıt politika gruplamasıdır.)

**Admin paneli testi:** Oturumlu uçtan uca CRUD doğrulaması bu oturumda
tekrarlanmadı (Turnstile localhost'ta çalışmıyor, admin şifresi elde değil).
Ancak panelin blog listesi `/api/admin` üzerinden **kullanıcının oturumuyla**
(anon değil) okur; `Authenticated read blogs` politikası taslakları açtığı için
panel boş görünmez. Tarayıcıyla teyit etmek istersen: `/admin` → Blog → bir yazıyı
gizle (`is_published = false`) → sayfayı yenile → listede görünmeye devam etmeli.

---

## ⚠️ Doğrulanamayan / kalan noktalar

| Konu | Durum | Not |
| --- | --- | --- |
| H-2 filtresinin ampirik farkı | 🟡 Kısmen | PostgREST seviyesi kanıtlandı (anon taslak → `[]`). Render edilen HTML seviyesi **test edilmedi**: production hâlâ bu commit'i çalıştırmıyor, ISR 1 dk. Deploy sonrası teyit edilmeli |
| `blog_images` filtresi | ⏳ Yapılmadı | Yalnızca görsel URL'leri sızar; PostgREST join'i gerektiriyor |
| 17 tablo anon yazma engeli | ✅ Doğrulandı | `pg_policies`: 51 yazma politikasının tamamı `auth.uid()` kilitli, açık 0 |
| Admin paneli taslak listeleme (oturumlu) | ✅ RLS düzeyinde doğrulandı | Tarayıcıda teyit isteniyorsa aşağıdaki 3 adım |
| CSP nonce (L-5) | ⏸️ Bilinçli uygulanmadı | Statik prerender ile uyumsuz. Gerekçe `next.config.ts` içinde |
| Kalıcı rate-limit store (M-4) | ⏳ Yapılmadı | Bellek içi sayaçlar cold start'ta sıfırlanır. Vercel KV önerilir |
| `SiteDataProvider` 14 sorgu | ⏳ Dokunulmadı | Anon okuma; H-1 kapsamı dışı |
| Ölü kod (`stripHtml` vb.) | ⏳ Dokunulmadı | Sıfır çağrı yeri; silinebilir |
| `getLocalized` iki kopyası | ⏳ Dokunulmadı | Boş-değer semantiği farklı |

---

## 🆕 Bu oturumda bulunan, kayda geçirilmesi gereken nokta

### Çerez yazımı `maxAge` taşımıyor → oturum çerezi session cookie'e dönüşüyor
**Konum:** `middleware.ts:79-87` (httpOnly'ya zorlama bloğu)

```ts
response.cookies.set(cookie.name, cookie.value, {
  path: "/", httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});   // ← maxAge yok
```

`@supabase/ssr` varsayılanı `maxAge: 400 gün` yazar. Zorlama bloğu çerezi
**değerini koruyup bayrakları yeniden yazdığı** için `maxAge` verilmediğinde
tarayıcı çerezi **session cookie** olarak tanımlar → tarayıcı tamamen
kapatıldığında admin oturumu düşer (yeniden giriş gerekir).

Bu **güvenlik açığı değil**, tam tersine daha katı bir davranış; ancak
`H-1`'in amacı (bayrak düzeltmesi) sırasında farkında olunmadan bir **UX
regresyonu** getirilmiş olabilir. Düzeltmek için tek satır:

```ts
maxAge: 400 * 24 * 60 * 60,   // @supabase/ssr ile aynı davranış
```

Bu oturumda ölçülmedi: blok yalnızca **geçerli oturumla** `/admin/*` isteğinde
çalışıyor ve Turnstile localhost'ta çalışmadığı için geçerli oturum üretilemedi.
Kullanıcı kararı: session cookie bırakılsın mı, `maxAge` geri eklensin mi.

---

## Kaynaklar

- `Web Application Pentesting/Vulnerabilities/Unsecured API Endpoints/README.md`
- `Web Application Pentesting/Vulnerabilities/Security Header Missing/README.md`
- `Web Application Pentesting/Vulnerabilities/IDOR/readme.md`
- `Secure Code Review/README.md` · `DevSecOps/SCA-Assessment.md`
- `node_modules/@supabase/ssr` kaynak kodu (H-1 kanıtı)
- Next.js resmi CSP nonce dokümantasyonu (L-5 denemesi)
- https://github.com/advisories/GHSA-vcvr-r3jv-pc5j
- https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html