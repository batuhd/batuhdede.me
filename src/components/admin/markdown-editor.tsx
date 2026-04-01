"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { HelpCircle, X } from "lucide-react";

// Custom schema - className attribute izni ver
const customSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes['*'] || []), 'className'],
  },
};

const inputClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const markdownGuide = [
  { syntax: "**metin**", description: "Kalın yazı", example: "**kalın**" },
  { syntax: "*metin*", description: "İtalik yazı", example: "*italik*" },
  { syntax: "# Başlık", description: "Büyük başlık (H1)", example: "# Ana Başlık" },
  { syntax: "## Başlık", description: "Orta başlık (H2)", example: "## Alt Başlık" },
  { syntax: "### Başlık", description: "Küçük başlık (H3)", example: "### Alt Başlık" },
  { syntax: "- eleman", description: "Sırasız liste", example: "- Birinci\n- İkinci" },
  { syntax: "1. eleman", description: "Sıralı liste", example: "1. Birinci\n2. İkinci" },
  { syntax: "[yazı](url)", description: "Link ekleme", example: "[GitHub](https://github.com)" },
  { syntax: "`kod`", description: "Satır içi kod", example: "`console.log()`" },
  { syntax: "```\nkod\n```", description: "Kod bloğu", example: "```javascript\nconsole.log('Merhaba');\n```" },
  { syntax: "| A | B |", description: "Tablo", example: "| Ad | Soyad |\n|----|----|\n| Ali | Veli |" },
  { syntax: "---", description: "Yatay çizgi", example: "---" },
  { syntax: "> alıntı", description: "Alıntı bloğu", example: "> Bu bir alıntıdır" },
  { syntax: "![alt](url)", description: "Resim ekleme", example: "![Logo](https://ornek.com/logo.png)" },
  { syntax: "<br>", description: "Yeni satır (boşluk)", example: "Satır 1<br>Satır 2" },
  { syntax: "İki boşluk + Enter", description: "Alt satıra geç", example: "Satır 1\nSatır 2" },
];

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value;
    const beforeText = text.substring(0, start);
    const selectedText = text.substring(start, end);
    const afterText = text.substring(end);
    
    const newValue = beforeText + before + selectedText + after + afterText;
    onChange(newValue);
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toolbarButtons = [
    { icon: 'B', title: 'Bold', action: () => insertMarkdown('**', '**') },
    { icon: 'I', title: 'Italic', action: () => insertMarkdown('*', '*') },
    { icon: 'H1', title: 'Heading 1', action: () => insertMarkdown('# ') },
    { icon: 'H2', title: 'Heading 2', action: () => insertMarkdown('## ') },
    { icon: '•', title: 'List', action: () => insertMarkdown('- ') },
    { icon: '1.', title: 'Numbered List', action: () => insertMarkdown('1. ') },
    { icon: '[ ]', title: 'Link', action: () => insertMarkdown('[', '](url)') },
    { icon: '`', title: 'Code', action: () => insertMarkdown('`', '`') },
    { icon: '```', title: 'Code Block', action: () => insertMarkdown('```\n', '\n```') },
    { icon: '|', title: 'Table', action: () => insertMarkdown('| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1 | Cell 2 |') },
    { icon: '---', title: 'Horizontal Rule', action: () => insertMarkdown('\n---\n') },
    { icon: '↵', title: 'New Line (BR)', action: () => insertMarkdown('<br>\n') },
  ];

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-muted/50 rounded-lg border">
        {toolbarButtons.map((btn, idx) => (
          <button
            key={idx}
            type="button"
            onClick={btn.action}
            title={btn.title}
            className="px-2 py-1 text-xs font-medium rounded hover:bg-background hover:shadow-sm transition-all border border-transparent hover:border-border"
          >
            {btn.icon}
          </button>
        ))}
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded transition-all",
            showPreview ? "bg-primary text-primary-foreground" : "hover:bg-background hover:shadow-sm border border-transparent hover:border-border"
          )}
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
        <button
          type="button"
          onClick={() => setShowGuide(true)}
          className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded hover:bg-background hover:shadow-sm border border-transparent hover:border-border text-muted-foreground hover:text-foreground transition-all"
          title="Markdown Kullanım Kılavuzu"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          Yardım
        </button>
      </div>

      {/* Editor */}
      <div className={cn("grid gap-4", showPreview ? "grid-cols-2" : "grid-cols-1")}>
        <textarea
          ref={textareaRef}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputClass, "min-h-[200px] font-mono text-sm")}
          placeholder={placeholder}
        />
        
        {/* Preview */}
        {showPreview && (
          <div className="min-h-[200px] p-4 rounded-md border bg-card overflow-auto prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown 
              rehypePlugins={[[rehypeSanitize, customSchema]]} 
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                h1: ({node, ...props}) => <h1 {...props} className="text-3xl font-bold mt-6 mb-4" />,
                h2: ({node, ...props}) => <h2 {...props} className="text-2xl font-bold mt-5 mb-3" />,
                h3: ({node, ...props}) => <h3 {...props} className="text-xl font-bold mt-4 mb-2" />,
                h4: ({node, ...props}) => <h4 {...props} className="text-lg font-bold mt-4 mb-2" />,
                h5: ({node, ...props}) => <h5 {...props} className="text-base font-bold mt-4 mb-2" />,
                h6: ({node, ...props}) => <h6 {...props} className="text-sm font-bold mt-4 mb-2" />,
                br: () => <br className="my-2" />,
              }}
            >
              {value || '*No content to preview*'}
            </ReactMarkdown>
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        <button
          type="button"
          onClick={() => setShowGuide(true)}
          className="text-primary hover:underline font-medium"
        >
          Markdown kullanım kılavuzunu gör →
        </button>
      </p>

      {/* Markdown Kullanım Kılavuzu Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-semibold">📚 Markdown Kullanım Kılavuzu</h3>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="rounded-full p-2 hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Blog yazılarınızı formatlamak için aşağıdaki Markdown komutlarını kullanabilirsiniz. 
                Toolbar'daki butonlara tıklayarak da bu komutları hızlıca ekleyebilirsiniz.
              </p>
              
              <div className="grid gap-3">
                {markdownGuide.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-muted/50 border items-center">
                    <div className="font-mono text-sm bg-background px-2 py-1 rounded border">
                      {item.syntax}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.description}
                    </div>
                    <div className="text-sm">
                      <ReactMarkdown 
                        rehypePlugins={[[rehypeSanitize, customSchema]]} 
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        components={{
                          h1: ({node, ...props}) => <h1 {...props} className="text-xl font-bold mt-3 mb-2" />,
                          h2: ({node, ...props}) => <h2 {...props} className="text-lg font-bold mt-3 mb-2" />,
                          h3: ({node, ...props}) => <h3 {...props} className="text-base font-bold mt-2 mb-1" />,
                          br: () => <br className="my-1" />,
                        }}
                      >
                        {item.example}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-semibold text-sm mb-2">💡 İpuçları:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Linkler otomatik olarak güvenli bir şekilde açılır (yeni sekmede)</li>
                  <li>Resimler için URL doğrulaması yapılır, güvenli olmayan resimler gösterilmez</li>
                  <li>HTML kullanımı güvenlik nedeniyle kısıtlanmıştır</li>
                  <li>Kod blokları için syntax highlighting desteklenir</li>
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
}
