"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SimpleMarkdownRenderer } from "@/components/markdown/markdown-renderer";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Table,
  Minus,
  Eye,
  EyeOff,
  HelpCircle,
  X,
  Maximize2,
  Minimize2,
  Smile,
  Check,
  Copy,
  Columns,
  AlignLeft,
} from "lucide-react";

const inputClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

type ViewMode = "edit" | "preview" | "split";

// Emoji map for shortcodes
const emojiMap: Record<string, string> = {
  ":smile:": "😄",
  ":laugh:": "😂",
  ":wink:": "😉",
  ":heart:": "❤️",
  ":thumbsup:": "👍",
  ":thumbsdown:": "👎",
  ":fire:": "🔥",
  ":rocket:": "🚀",
  ":star:": "⭐",
  ":check:": "✅",
  ":x:": "❌",
  ":warning:": "⚠️",
  ":bulb:": "💡",
  ":book:": "📚",
  ":computer:": "💻",
  ":code:": "💻",
  ":phone:": "📱",
  ":email:": "📧",
  ":link:": "🔗",
  ":trophy:": "🏆",
  ":medal:": "🥇",
  ":calendar:": "📅",
  ":clock:": "🕐",
  ":idea:": "💡",
};

const markdownGuide = [
  {
    category: "Metin Formatlama",
    items: [
      { syntax: "**kalın**", result: "**kalın**", desc: "Kalın yazı" },
      { syntax: "*italik*", result: "*italik*", desc: "İtalik yazı" },
      {
        syntax: "~~üstü çizili~~",
        result: "~~üstü çizili~~",
        desc: "Üstü çizili",
      },
      { syntax: "`kod`", result: "`kod`", desc: "Satır içi kod" },
    ],
  },
  {
    category: "Başlıklar",
    items: [
      { syntax: "# H1", result: "# Başlık 1", desc: "Ana başlık" },
      { syntax: "## H2", result: "## Başlık 2", desc: "Alt başlık" },
      { syntax: "### H3", result: "### Başlık 3", desc: "Küçük başlık" },
    ],
  },
  {
    category: "Listeler",
    items: [
      {
        syntax: "- item",
        result: "- Madde 1\n- Madde 2",
        desc: "Sırasız liste",
      },
      {
        syntax: "1. item",
        result: "1. Birinci\n2. İkinci",
        desc: "Sıralı liste",
      },
      { syntax: "- [ ]", result: "- [ ] Görev", desc: "Checkbox" },
    ],
  },
  {
    category: "Diğer",
    items: [
      {
        syntax: "[link](url)",
        result: "[GitHub](https://github.com)",
        desc: "Link",
      },
      { syntax: "![alt](url)", result: "![Resim](/image.png)", desc: "Resim" },
      { syntax: "> quote", result: "> Alıntı", desc: "Alıntı" },
      { syntax: "---", result: "---", desc: "Yatay çizgi" },
      { syntax: "```code```", result: "```js\ncode\n```", desc: "Kod bloğu" },
    ],
  },
];

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  minHeight = "300px",
}: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [showGuide, setShowGuide] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const insertText = useCallback(
    (before: string, after: string = "", placeholderText: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = value;
      const selectedText = text.substring(start, end);
      const textToInsert = selectedText || placeholderText;

      const newValue =
        text.substring(0, start) +
        before +
        textToInsert +
        after +
        text.substring(end);

      onChange(newValue);

      // Restore focus and set cursor position
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + before.length + textToInsert.length;
        if (selectedText) {
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        } else {
          // Select the placeholder text
          textarea.setSelectionRange(
            start + before.length,
            start + before.length + textToInsert.length,
          );
        }
      }, 0);
    },
    [value, onChange],
  );

  const toolbarItems: Array<
    | { type: "divider" }
    | { icon: React.ElementType; label: string; action: () => void }
  > = [
    {
      icon: Bold,
      label: "Kalın",
      action: () => insertText("**", "**", "kalın metin"),
    },
    {
      icon: Italic,
      label: "İtalik",
      action: () => insertText("*", "*", "italik metin"),
    },
    { type: "divider" },
    {
      icon: Heading1,
      label: "Başlık 1",
      action: () => insertText("# ", "", "Başlık"),
    },
    {
      icon: Heading2,
      label: "Başlık 2",
      action: () => insertText("## ", "", "Başlık"),
    },
    {
      icon: Heading3,
      label: "Başlık 3",
      action: () => insertText("### ", "", "Başlık"),
    },
    { type: "divider" },
    { icon: List, label: "Liste", action: () => insertText("- ", "", "Madde") },
    {
      icon: ListOrdered,
      label: "Numaralı Liste",
      action: () => insertText("1. ", "", "Birinci"),
    },
    { type: "divider" },
    {
      icon: Link,
      label: "Link",
      action: () => insertText("[", "](https://)", "link"),
    },
    {
      icon: Image,
      label: "Resim",
      action: () => insertText("![", "](/image.png)", "açıklama"),
    },
    { type: "divider" },
    { icon: Code, label: "Kod", action: () => insertText("`", "`", "kod") },
    {
      icon: Quote,
      label: "Alıntı",
      action: () => insertText("> ", "", "Alıntı"),
    },
    {
      icon: Table,
      label: "Tablo",
      action: () =>
        insertText(
          "| Başlık 1 | Başlık 2 |\n|----------|----------|\n| Hücre 1  | Hücre 2  |",
          "",
          "",
        ),
    },
    {
      icon: Minus,
      label: "Çizgi",
      action: () => insertText("\n---\n", "", ""),
    },
  ];

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value;

    const newValue = text.substring(0, start) + emoji + text.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);

    setShowEmojiPicker(false);
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  const editorContent = (
    <div
      className={cn(
        "markdown-editor-container",
        isFullscreen && "fixed inset-0 z-50 bg-background p-4",
      )}
    >
      {/* Toolbar */}
      <div className="markdown-toolbar">
        {toolbarItems.map((item, idx) => {
          if ("type" in item) {
            return <div key={idx} className="markdown-toolbar-divider" />;
          }
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={item.action}
              className="markdown-toolbar-button"
              title={item.label}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}

        <div className="markdown-toolbar-divider" />

        {/* Emoji Picker Toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={cn(
              "markdown-toolbar-button",
              showEmojiPicker && "active",
            )}
            title="Emoji Ekle"
          >
            <Smile className="h-4 w-4" />
          </button>

          {showEmojiPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-card border rounded-lg shadow-lg z-50 grid grid-cols-5 gap-1 min-w-[200px]">
              {Object.entries(emojiMap).map(([code, emoji]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="p-2 hover:bg-muted rounded transition-colors text-lg"
                  title={code}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* View Mode Toggles */}
        <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("edit")}
            className={cn(
              "p-1.5 rounded text-xs font-medium transition-colors",
              viewMode === "edit"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            title="Sadece Edit"
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={cn(
              "p-1.5 rounded text-xs font-medium transition-colors",
              viewMode === "split"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            title="Split View"
          >
            <Columns className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={cn(
              "p-1.5 rounded text-xs font-medium transition-colors",
              viewMode === "preview"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            title="Sadece Preview"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="markdown-toolbar-divider" />

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="markdown-toolbar-button"
          title={isFullscreen ? "Küçült" : "Tam Ekran"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>

        {/* Copy Markdown */}
        <button
          type="button"
          onClick={copyMarkdown}
          className="markdown-toolbar-button"
          title="Markdown Kopyala"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>

        {/* Help */}
        <button
          type="button"
          onClick={() => setShowGuide(true)}
          className="markdown-toolbar-button"
          title="Yardım"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Area */}
      <div
        className={cn(
          "flex-1 min-h-0",
          viewMode === "split" && "grid md:grid-cols-2 gap-4",
        )}
      >
        {/* Editor */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div className="flex flex-col h-full">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={
                placeholder ||
                "Markdown yazmaya başlayın...\n\n# Başlık\n**kalın** *italik*\n- liste\n- öğesi"
              }
              className={cn(
                "markdown-editor-textarea flex-1",
                viewMode === "split" && "min-h-[400px]",
              )}
              style={{ minHeight }}
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={cn(
              "markdown-editor-preview",
              viewMode === "preview" && "min-h-[400px]",
            )}
          >
            {value ? (
              <SimpleMarkdownRenderer content={value} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <EyeOff className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">Önizleme için içerik yazın</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          {wordCount} kelime | {charCount} karakter
        </span>
        <button
          type="button"
          onClick={() => setShowGuide(true)}
          className="text-primary hover:underline"
        >
          Markdown Kılavuzu
        </button>
      </div>

      {/* Guide Modal */}
      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="bg-card border rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-semibold">📚 Markdown Kılavuzu</h3>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="rounded-full p-2 hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <p className="text-sm text-muted-foreground mb-6">
                Markdown, metinleri kolayca formatlamanıza olanak tanıyan basit
                bir işaretleme dilidir. Toolbar&apos;daki butonları kullanarak
                veya aşağıdaki syntax&apos;ları yazarak kullanabilirsiniz.
              </p>

              <div className="grid gap-6">
                {markdownGuide.map((section) => (
                  <div key={section.category}>
                    <h4 className="font-semibold text-sm mb-3 text-primary">
                      {section.category}
                    </h4>
                    <div className="grid gap-2">
                      {section.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-muted/50 border items-center text-sm"
                        >
                          <code className="font-mono text-xs bg-background px-2 py-1 rounded border">
                            {item.syntax}
                          </code>
                          <span className="text-muted-foreground">
                            {item.desc}
                          </span>
                          <SimpleMarkdownRenderer content={item.result} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-semibold text-sm mb-2">💡 İpuçları:</h4>
                <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li>Satır sonu için iki boşluk bırakıp Enter&apos;a basın</li>
                  <li>Linkler otomatik olarak güvenli bir şekilde açılır</li>
                  <li>
                    Kod bloklarında dil belirtmek için (örn: ```javascript)
                    kullanın
                  </li>
                  <li>
                    Emoji eklemek için emoji butonunu kullanın veya :smile:
                    yazın
                  </li>
                  <li>Tablolar otomatik olarak responsive olur</li>
                </ul>
              </div>
            </div>

            <div className="border-t px-6 py-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Anladım, kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={cn("w-full", isFullscreen && "contents")}
    >
      {editorContent}
    </div>
  );
}

// Standalone preview component for read-only display
export function MarkdownPreview({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={cn("prose prose-zinc dark:prose-invert max-w-none", className)}
    >
      <SimpleMarkdownRenderer content={content} />
    </div>
  );
}
