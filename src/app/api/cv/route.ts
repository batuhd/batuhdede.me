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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const langResult = langSchema.safeParse(searchParams.get("lang") ?? "tr");
  const lang: Locale = langResult.success ? langResult.data : "tr";
  const download = searchParams.get("download") === "1";

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