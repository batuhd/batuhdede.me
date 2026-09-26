"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Markdown editörü — Yaz / Önizleme sekmeleri.
 * Önizleme rehype-sanitize ile güvenli hale getirilmiş MarkdownRenderer'ı kullanır.
 */
export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [mode, setMode] = useState<"write" | "preview">("write");

  return (
    <div className="space-y-2">
      <div className="flex w-fit gap-1 rounded-xl border border-white/10 bg-zinc-900 p-1">
        {(["write", "preview"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              mode === m
                ? "bg-violet-600 text-white"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
            )}
          >
            {m === "write" ? "Yaz" : "Önizleme"}
          </button>
        ))}
      </div>

      {mode === "write" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={12}
          placeholder={placeholder ?? "Markdown yazın..."}
          aria-label="Markdown içerik"
          className="w-full resize-y rounded-xl border border-white/10 bg-zinc-950 px-3.5 py-3 font-mono text-sm leading-relaxed text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-violet-500/60"
        />
      ) : (
        <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <MarkdownRenderer content={value || "_Önizleme için içerik bekleniyor..._"} />
          </div>
        </div>
      )}
    </div>
  );
}