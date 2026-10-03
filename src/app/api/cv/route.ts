import React from "react";
import { NextRequest } from "next/server";
import { z } from "zod";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { fetchAllData } from "@/lib/data";
import { translations, type Locale } from "@/config/translations";
import { buildCvData } from "@/lib/cv";
import { CvDocument } from "@/lib/cv/cv-document";

export const runtime = "nodejs";

const langSchema = z.enum(["tr", "en", "de", "es"]);

const CV_FILENAME = "Muhammed_Batuhan_DEDE_CV.pdf";

/**
 * PDF buffer'larini process ici onbellek.
 *
 * CDN cache anahtari tam URL'dir; `?cb=<rastgele>` eklemek cache'i
 * atlatip her istekte tam render (16 Supabase sorgusu + React-PDF)
 * tetikliyordu. Onbellek, pahali kismi her "yeni" anahtarda bile
 * tekrarlanmasini engeller. Anahtar yalnizca `lang` ve `download`
 * icerik belirleyen iki degerden olusur (sabit 4*2 kombinasyon).
 */
const bufferCache = new Map<string, Uint8Array>();

async function getCvBuffer(lang: Locale): Promise<Uint8Array> {
  const cached = bufferCache.get(lang);
  if (cached) return cached;

  const data = await fetchAllData();
  const cvData = buildCvData(data, lang);

  const t = (key: string) =>
    translations[lang][key] || translations.en[key] || key;

  const labels = {
    education: t("cv.education"),
    experience: t("cv.experience"),
    leadership: t("cv.leadership"),
    skills: t("cv.skills"),
    languages: t("cv.languages"),
    references: t("cv.references"),
  };

  const buffer = await renderToBuffer(
    React.createElement(CvDocument, {
      data: cvData,
      labels,
    }) as unknown as React.ReactElement<DocumentProps>,
  );

  const bytes = buffer as unknown as Uint8Array;

  // En fazla 4 dil olabilir; eski girisleri temizle.
  if (bufferCache.size >= 4) bufferCache.clear();
  bufferCache.set(lang, bytes);

  return bytes;
}

export async function GET(request: NextRequest) {
  const langResult = langSchema.safeParse(
    request.nextUrl.searchParams.get("lang") ?? "tr"
  );
  const lang: Locale = langResult.success ? langResult.data : "tr";
  const download = request.nextUrl.searchParams.get("download") === "1";

  const bytes = await getCvBuffer(lang);

  return new Response(bytes as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": download
        ? `attachment; filename="${CV_FILENAME}"`
        : `inline; filename="${CV_FILENAME}"`,
      "Cache-Control":
        "public, max-age=60, s-maxage=60, stale-while-revalidate=120",
      "Content-Length": String(bytes.byteLength),
    },
  });
}