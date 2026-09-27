"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const EXAMPLES: Array<{ label: string; syntax: string; note?: string }> = [
  {
    label: "Başlık",
    syntax: `# Başlık 1
## Başlık 2
### Başlık 3`,
  },
  {
    label: "Kalın & İtalik",
    syntax: "**kalın metin**\n*italik metin*",
  },
  {
    label: "Madde listesi",
    syntax: "- Madde 1\n- Madde 2\n  - Alt madde",
  },
  {
    label: "Numaralı liste",
    syntax: "1. İlk adım\n2. İkinci adım",
  },
  {
    label: "Bağlantı",
    syntax: "[gösterilecek metin](https://example.com)",
  },
  {
    label: "Görsel",
    syntax: "![açıklama](https://ornek.com/resim.png)",
  },
  {
    label: "Alıntı",
    syntax: "> Bu bir alıntıdır",
  },
  {
    label: "Kod",
    syntax: "`inline kod`\n\n```js\nconst x = 1;\n```",
  },
  {
    label: "Tablo",
    syntax: "| Başlık | Açıklama |\n| ------ | -------- |\n| Satır 1 | Değer 1 |",
    note: "Tablo, başlık satırı ve ayraç çizgisi ile oluşturulur.",
  },
  {
    label: "Ayraç",
    syntax: "---",
  },
  {
    label: "Emoji",
    syntax: ":rocket: :fire: :heart:",
  },
];

/** Markdown yazım kılavuzu — açılır panel, markdown destekleyen tüm alanlarda gösterilir. */
export function MarkdownGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/60">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-medium text-zinc-300">
          <Info className="h-3.5 w-3.5 text-violet-400" />
          Markdown nasıl kullanılır?
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-zinc-500 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="space-y-3 border-t border-white/10 px-3 py-3">
          <p className="text-xs leading-relaxed text-zinc-500">
            Markdown, yazınıza başlık, liste ve vurgu eklemenin basit bir yoludur.
            Yazdığınız özel karakterler tarayıcıda otomatik olarak biçimlendirilir.
            İşte sık kullanılan kalıplar:
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {EXAMPLES.map((ex) => (
              <div
                key={ex.label}
                className="rounded-lg border border-white/5 bg-zinc-950/60 p-2.5"
              >
                <p className="mb-1 text-[11px] font-semibold text-zinc-400">
                  {ex.label}
                </p>
                <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-zinc-300">
                  {ex.syntax}
                </pre>
                {ex.note && (
                  <p className="mt-1 text-[10px] leading-snug text-zinc-500">
                    {ex.note}
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-500">
            İpucu: Yazarken “Önizleme” sekmesine geçerek sonucu anında
            görebilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
}