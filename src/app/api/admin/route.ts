import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Admin CRUD API'si — tüm veri erişimi sunucu tarafında.
 *
 * Neden var: Supabase SSR varsayılan olarak session çerezini `httpOnly: false`
 * ile yazıyor (`@supabase/ssr` DEFAULT_COOKIE_OPTIONS). Bu durumda sayfadaki
 * herhangi bir JS `document.cookie` ile refresh token'ı okuyabiliyor. Çerezi
 * `httpOnly` yapmak tarayıcı client'ını çalışmaz hale getirdiği için veri
 * erişimi buraya taşındı.
 *
 * Güvenlik:
 *  - `getUser()` ile JWT sunucuda doğrulanır (cookie'ye güvenilmez)
 *  - Sunucu client'ı KULLANICININ oturumu ile açılır; service-role KULLANILMAZ.
 *    Böylece RLS policies aynen geçerli kalır.
 *  - Tablolar ve kolon adları istemciden gelen serbest metin olarak SQL'e
 *    geçmez; hepsi sunucu tarafı izin listeleriyle doğrulanır.
 */

export const runtime = "nodejs";

/** supabase_schema.sql ile senkron 17 tablo. */
const ALLOWED_TABLES = new Set([
  "about_me",
  "section_order",
  "skill_categories",
  "project_categories",
  "blog_categories",
  "experiences",
  "educations",
  "languages",
  "activities",
  "certifications",
  "certification_skills",
  "projects",
  "project_images",
  "blogs",
  "blog_images",
  "social_links",
  "contact_emails",
]);

/** Sıralama yapılabilen kolonlar (PostgREST order/by injection koruması). */
const ALLOWED_ORDER_COLUMNS = new Set(["order_index", "created_at", "date"]);

/** reorder_items RPC'si DB tarafında da whitelist tutuyor. */
const REORDER_RPC_TABLES = new Set([
  "projects",
  "blogs",
  "experiences",
  "educations",
  "skill_categories",
  "languages",
  "activities",
  "certifications",
  "project_images",
  "blog_images",
  "project_categories",
  "blog_categories",
]);

/** Junction tabloları ve kolon çiftleri. */
const JUNCTION_SPECS: Record<string, { parentColumn: string; childColumn: string }> = {
  certification_skills: { parentColumn: "certification_id", childColumn: "skill_category_id" },
};

/** Galeri tabloları ve parent kolonları. */
const GALLERY_SPECS: Record<string, string> = {
  project_images: "project_id",
  blog_images: "blog_id",
};

/** Yayın durumu toggle edilebilen tek alan. */
const PUBLISH_FIELDS = new Set(["is_published"]);

function table(name: string): string {
  if (!ALLOWED_TABLES.has(name)) {
    throw new Error(`Erişim reddedildi: bilinmeyen tablo (${name})`);
  }
  return name;
}

function orderColumn(name: string | undefined): string {
  const col = name ?? "order_index";
  if (!ALLOWED_ORDER_COLUMNS.has(col)) {
    throw new Error(`Erişim reddedildi: geçersiz sıralama kolonu (${col})`);
  }
  return col;
}

const uuidish = z.string().uuid();
const idOrUuid = uuidish;

const opSchema = z.discriminatedUnion("op", [
  z.object({ op: z.literal("list"), table: z.string(), orderColumn: z.string().optional(), ascending: z.boolean().optional(), limit: z.number().int().min(1).max(500).optional() }),
  z.object({ op: z.literal("fetchSingle"), table: z.string() }),
  z.object({ op: z.literal("create"), table: z.string(), payload: z.record(z.unknown()) }),
  z.object({ op: z.literal("update"), table: z.string(), id: idOrUuid, payload: z.record(z.unknown()) }),
  z.object({ op: z.literal("delete"), table: z.string(), id: idOrUuid }),
  z.object({ op: z.literal("reorder"), table: z.string(), ids: z.array(uuidish).max(500) }),
  z.object({ op: z.literal("setPublished"), table: z.string(), id: idOrUuid, field: z.string(), next: z.boolean() }),
  z.object({ op: z.literal("fetchGallery"), table: z.string(), parentId: uuidish }),
  z.object({ op: z.literal("fetchJunctionChildren"), table: z.string(), parentId: uuidish }),
  z.object({ op: z.literal("syncJunction"), table: z.string(), parentId: uuidish, selectedChildIds: z.array(uuidish).max(1000) }),
  z.object({ op: z.literal("fetchSourceOptions"), table: z.string(), valueField: z.string().max(64), labelField: z.string().max(64) }),
  z.object({ op: z.literal("recentImages"), table: z.string(), column: z.string().max(64), limit: z.number().int().min(1).max(200).optional() }),
  z.object({ op: z.literal("getMaintenance") }),
  z.object({ op: z.literal("setMaintenance"), next: z.boolean() }),
]);

type Op = z.infer<typeof opSchema>;

async function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();

  // Yanıtta çerez yazmaya gerek yok (okuma koruması zaten httpOnly).
  const setAll = () => {};

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll,
    },
    cookieOptions: { path: "/", sameSite: "lax", httpOnly: true } as CookieOptions,
  });
}

/** Oturum doğrulaması: cookie içeriğine güvenilmez, JWT sunucuda doğrulanır. */
async function requireUser() {
  const sb = await getServerSupabase();
  if (!sb) return { sb: null, user: null };

  const {
    data: { user },
  } = await sb.auth.getUser();

  return { sb, user };
}

export async function GET() {
  const { user } = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  return NextResponse.json({
    user: { id: user.id, email: user.email ?? null },
  });
}

export async function POST(request: Request) {
  const { sb, user } = await requireUser();
  if (!sb || !user) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi" }, { status: 400 });
  }

  const parsed = opSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: `Geçersiz istek: ${parsed.error.issues.map((i) => i.message).join(", ")}` },
      { status: 400 }
    );
  }

  const op: Op = parsed.data;

  try {
    return await execute(sb, op);
  } catch (err) {
    return fail(err);
  }
}

/**
 * PostgREST/Supabase hatasını istemciye `code`/`message`/`details` ile
 * taşır. `classifyError()` ve `isPermissionError()` bu alanlara bakıyor;
 * düz bir mesaj göndermek admin panelindeki hata ayrımını bozardı.
 */
function fail(err: unknown) {
  const e = (err ?? {}) as Record<string, unknown>;

  if (typeof e.message === "string" && e.message.startsWith("Erişim reddedildi")) {
    return NextResponse.json(
      { error: { code: "42501", message: e.message, details: null, hint: null } },
      { status: 403 }
    );
  }

  const message =
    typeof e.message === "string" ? e.message : "Bilinmeyen sunucu hatası";

  return NextResponse.json(
    {
      error: {
        code: e.code ?? e.status ?? "500",
        message,
        details: e.details ?? null,
        hint: e.hint ?? null,
      },
    },
    { status: typeof e.status === "number" ? e.status : 500 }
  );
}

type Sb = NonNullable<Awaited<ReturnType<typeof getServerSupabase>>>;

async function execute(sb: Sb, op: Op) {
  const ok = (data: unknown) => NextResponse.json({ data });

  switch (op.op) {
    case "list": {
      const t = table(op.table);
      const col = orderColumn(op.orderColumn);
      let q = sb.from(t).select("*").order(col, { ascending: op.ascending ?? true });
      if (op.limit) q = q.limit(op.limit);
      const { data, error } = await q;
      if (error) throw error;
      return ok(data);
    }

    case "fetchSingle": {
      const { data, error } = await sb.from(table(op.table)).select("*").limit(1);
      if (error) throw error;
      return ok(data?.[0] ?? null);
    }

    case "create": {
      const { data, error } = await sb
        .from(table(op.table))
        .insert(op.payload)
        .select()
        .single();
      if (error) throw error;
      return ok(data);
    }

    case "update": {
      const { data, error } = await sb
        .from(table(op.table))
        .update(op.payload)
        .eq("id", op.id)
        .select()
        .single();
      if (error) throw error;
      return ok(data);
    }

    case "delete": {
      const { data, error } = await sb.from(table(op.table)).delete().eq("id", op.id).select().single();
      if (error) throw error;
      return ok(data);
    }

    case "reorder": {
      const t = table(op.table);
      if (REORDER_RPC_TABLES.has(t)) {
        const { error } = await sb.rpc("reorder_items", {
          p_table: t,
          p_ids: op.ids,
          p_indices: op.ids.map((_, i) => i),
        });
        if (error) throw error;
        return ok(null);
      }
      for (let i = 0; i < op.ids.length; i++) {
        const { error } = await sb.from(t).update({ order_index: i }).eq("id", op.ids[i]);
        if (error) throw error;
      }
      return ok(null);
    }

    case "setPublished": {
      if (!PUBLISH_FIELDS.has(op.field)) {
        throw new Error(`Erişim reddedildi: geçersiz alan (${op.field})`);
      }
      const { data, error } = await sb
        .from(table(op.table))
        .update({ [op.field]: op.next })
        .eq("id", op.id)
        .select()
        .single();
      if (error) throw error;
      return ok(data);
    }

    case "fetchGallery": {
      const parentColumn = GALLERY_SPECS[op.table];
      if (!parentColumn) throw new Error(`Erişim reddedildi: geçersiz galeri tablosu (${op.table})`);
      const { data, error } = await sb
        .from(table(op.table))
        .select("*")
        .eq(parentColumn, op.parentId)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return ok(data);
    }

    case "fetchJunctionChildren": {
      const spec = JUNCTION_SPECS[op.table];
      if (!spec) throw new Error(`Erişim reddedildi: geçersiz junction tablosu (${op.table})`);
      const { data, error } = await sb
        .from(table(op.table))
        .select(spec.childColumn)
        .eq(spec.parentColumn, op.parentId);
      if (error) throw error;
      return ok(
        (data ?? []).map((r) =>
          String((r as unknown as Record<string, unknown>)[spec.childColumn])
        )
      );
    }

    case "syncJunction": {
      const spec = JUNCTION_SPECS[op.table];
      if (!spec) throw new Error(`Erişim reddedildi: geçersiz junction tablosu (${op.table})`);
      const { parentColumn, childColumn } = spec;

      const { data: existing, error: fetchError } = await sb
        .from(table(op.table))
        .select(childColumn)
        .eq(parentColumn, op.parentId);
      if (fetchError) throw fetchError;

      const rows = (existing ?? []) as unknown as Record<string, unknown>[];
      const current = new Set(rows.map((r) => String(r[childColumn])));
      const wanted = new Set(op.selectedChildIds);

      const toAdd = op.selectedChildIds.filter((id) => !current.has(id));
      const toRemove = rows
        .filter((r) => !wanted.has(String(r[childColumn])))
        .map((r) => String(r[childColumn]));

      if (toAdd.length > 0) {
        const { error } = await sb
          .from(table(op.table))
          .insert(toAdd.map((id) => ({ [parentColumn]: op.parentId, [childColumn]: id })));
        if (error) throw error;
      }
      if (toRemove.length > 0) {
        const { error } = await sb
          .from(table(op.table))
          .delete()
          .eq(parentColumn, op.parentId)
          .in(childColumn, toRemove);
        if (error) throw error;
      }
      return ok(null);
    }

    case "fetchSourceOptions": {
      const { data, error } = await sb
        .from(table(op.table))
        .select("*")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return ok(
        (data ?? []).map((row) => {
          const r = row as unknown as Record<string, unknown>;
          return { value: String(r[op.valueField] ?? ""), label: String(r[op.labelField] ?? "") };
        })
      );
    }

    case "recentImages": {
      const { data, error } = await sb
        .from(table(op.table))
        .select(op.column)
        .limit(op.limit ?? 50);
      if (error) throw error;
      const urls = (data ?? [])
        .map((r) => String((r as unknown as Record<string, unknown>)[op.column] ?? ""))
        .filter(Boolean);
      return ok([...new Set(urls)].reverse());
    }

    case "getMaintenance": {
      const { data, error } = await sb
        .from("section_order")
        .select("section_id")
        .eq("section_id", "maintenance_mode")
        .maybeSingle();
      if (error) throw error;
      return ok(!!data);
    }

    case "setMaintenance": {
      if (op.next) {
        const { data: existing } = await sb
          .from("section_order")
          .select("section_id")
          .eq("section_id", "maintenance_mode")
          .maybeSingle();
        if (!existing) {
          const { error } = await sb
            .from("section_order")
            .insert({ section_id: "maintenance_mode", order_index: -1 });
          if (error) throw error;
        }
      } else {
        const { error } = await sb
          .from("section_order")
          .delete()
          .eq("section_id", "maintenance_mode");
        if (error) throw error;
      }
      return ok(null);
    }
  }
}