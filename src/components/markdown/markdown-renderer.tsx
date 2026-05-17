"use client";

import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkEmoji from "remark-emoji";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, ExternalLink } from "lucide-react";
import { cn, sanitizeUrl } from "@/lib/utils";

// Custom schema - className attribute izni ver
const customSchema = {
  ...defaultSchema,
  attributes: {
    ...(defaultSchema.attributes || {}),
    "*": [...(defaultSchema.attributes?.["*"] || []), "className"],
  },
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "div",
    "span",
    "br",
    "img",
    "a",
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "em",
    "strong",
    "del",
    "hr",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "sup",
    "sub",
  ],
};

interface CodeBlockProps {
  language: string;
  value: string;
}

function CodeBlock({ language, value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-language">{language || "text"}</span>
        <button
          onClick={copyToClipboard}
          className={cn("code-block-copy", copied && "copied")}
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          fontSize: "0.875rem",
          lineHeight: "1.6",
        }}
        showLineNumbers
        lineNumberStyle={{
          minWidth: "2.5rem",
          paddingRight: "1rem",
          color: "#6c7086",
          textAlign: "right",
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
  showToc?: boolean;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function MarkdownRenderer({
  content,
  className,
  showToc = false,
}: MarkdownRendererProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>("");

  // Extract headings for TOC
  useEffect(() => {
    if (!showToc) return;

    const extractedHeadings: TocItem[] = [];
    const lines = content.split("\n");

    lines.forEach((line) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        extractedHeadings.push({ id, text, level });
      }
    });

    setHeadings(extractedHeadings);
  }, [content, showToc]);

  // Scroll spy for TOC
  useEffect(() => {
    if (!showToc || headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px" },
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings, showToc]);

  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Generate ID for heading
  const generateId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  return (
    <div className={cn("relative", className)}>
      {/* Table of Contents */}
      {showToc && headings.length > 0 && (
        <nav className="hidden xl:block fixed right-8 top-24 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto p-4 bg-card border rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold mb-3 text-foreground">
            On this page
          </h3>
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li key={heading.id}>
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className={cn(
                    "w-full text-left text-sm py-1 px-2 rounded transition-colors",
                    "hover:bg-muted",
                    heading.level === 1 && "font-medium",
                    heading.level === 2 && "pl-4",
                    heading.level >= 3 && "pl-6 text-muted-foreground",
                    activeHeading === heading.id &&
                      "bg-primary/10 text-primary font-medium",
                  )}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Markdown Content */}
      <div
        className={cn(
          "prose prose-zinc dark:prose-invert max-w-none",
          showToc && "xl:mr-72",
        )}
      >
        <ReactMarkdown
          rehypePlugins={[[rehypeSanitize, customSchema]]}
          remarkPlugins={[remarkGfm, remarkBreaks, remarkEmoji]}
          components={{
            // Headings with IDs for TOC
            h1: ({ children }) => {
              const text = String(children);
              const id = generateId(text);
              return (
                <h1
                  id={id}
                  className="text-3xl font-bold mt-8 mb-4 scroll-mt-24"
                >
                  {children}
                </h1>
              );
            },
            h2: ({ children }) => {
              const text = String(children);
              const id = generateId(text);
              return (
                <h2
                  id={id}
                  className="text-2xl font-semibold mt-6 mb-3 scroll-mt-24"
                >
                  {children}
                </h2>
              );
            },
            h3: ({ children }) => {
              const text = String(children);
              const id = generateId(text);
              return (
                <h3
                  id={id}
                  className="text-xl font-semibold mt-5 mb-2 scroll-mt-24"
                >
                  {children}
                </h3>
              );
            },
            h4: ({ children }) => {
              const text = String(children);
              const id = generateId(text);
              return (
                <h4
                  id={id}
                  className="text-lg font-semibold mt-4 mb-2 scroll-mt-24"
                >
                  {children}
                </h4>
              );
            },
            h5: ({ children }) => {
              const text = String(children);
              const id = generateId(text);
              return (
                <h5
                  id={id}
                  className="text-base font-semibold mt-4 mb-2 scroll-mt-24"
                >
                  {children}
                </h5>
              );
            },
            h6: ({ children }) => {
              const text = String(children);
              const id = generateId(text);
              return (
                <h6
                  id={id}
                  className="text-sm font-semibold mt-4 mb-2 scroll-mt-24"
                >
                  {children}
                </h6>
              );
            },

            // Paragraphs
            p: ({ children }) => <p className="my-4 leading-7">{children}</p>,

            // Links with security
            a: ({ href, children }) => {
              const safeHref = sanitizeUrl(href || "");
              if (!safeHref) return <>{children}</>;

              const isExternal = safeHref.startsWith("http");

              return (
                <a
                  href={safeHref}
                  className="text-primary hover:underline underline-offset-2 inline-flex items-center gap-1 transition-opacity hover:opacity-80"
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  {children}
                  {isExternal && <ExternalLink className="h-3 w-3" />}
                </a>
              );
            },

            // Code blocks with syntax highlighting
            code: ({ className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";
              const value = String(children).replace(/\n$/, "");

              if (match) {
                return <CodeBlock language={language} value={value} />;
              }

              return (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              );
            },

            // Preformatted text wrapper
            pre: ({ children }) => <>{children}</>,

            // Images
            img: ({ src, alt }) => {
              const srcStr = typeof src === "string" ? src : "";
              const safeSrc = sanitizeUrl(srcStr);
              if (!safeSrc) return null;

              return (
                <figure className="my-6">
                  <img
                    src={safeSrc}
                    alt={alt || ""}
                    className="rounded-lg max-w-full h-auto mx-auto"
                    loading="lazy"
                  />
                  {alt && (
                    <figcaption className="text-center text-sm text-muted-foreground mt-2">
                      {alt}
                    </figcaption>
                  )}
                </figure>
              );
            },

            // Lists
            ul: ({ children }) => (
              <ul className="list-disc pl-6 my-4 space-y-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 my-4 space-y-1">{children}</ol>
            ),
            li: ({ children }) => <li className="leading-7">{children}</li>,

            // Blockquotes
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground my-6">
                {children}
              </blockquote>
            ),

            // Horizontal rule
            hr: () => <hr className="my-8 border-border" />,

            // Tables
            table: ({ children }) => (
              <div className="overflow-x-auto my-6">
                <table className="w-full text-sm border-collapse">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="border-b-2 border-border">{children}</thead>
            ),
            tbody: ({ children }) => <tbody>{children}</tbody>,
            tr: ({ children }) => (
              <tr className="border-b border-border last:border-0">
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th className="py-3 px-4 text-left font-semibold">{children}</th>
            ),
            td: ({ children }) => <td className="py-3 px-4">{children}</td>,

            // Strong and emphasis
            strong: ({ children }) => (
              <strong className="font-bold text-foreground">{children}</strong>
            ),
            em: ({ children }) => <em className="italic">{children}</em>,
            del: ({ children }) => (
              <del className="line-through text-muted-foreground">
                {children}
              </del>
            ),

            // Line breaks
            br: () => <br />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// Simple version without TOC for smaller content
export function SimpleMarkdownRenderer({
  content,
  className,
}: Omit<MarkdownRendererProps, "showToc">) {
  return (
    <div
      className={cn("prose prose-zinc dark:prose-invert max-w-none", className)}
    >
      <ReactMarkdown
        rehypePlugins={[[rehypeSanitize, customSchema]]}
        remarkPlugins={[remarkGfm, remarkBreaks, remarkEmoji]}
        components={{
          code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const value = String(children).replace(/\n$/, "");

            if (match) {
              return <CodeBlock language={language} value={value} />;
            }

            return <code className="inline-code">{children}</code>;
          },
          pre: ({ children }) => <>{children}</>,
          a: ({ href, children }) => {
            const safeHref = sanitizeUrl(href || "");
            if (!safeHref) return <>{children}</>;

            const isExternal = safeHref.startsWith("http");

            return (
              <a
                href={safeHref}
                className="text-primary hover:underline underline-offset-2 inline-flex items-center gap-1"
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              >
                {children}
                {isExternal && <ExternalLink className="h-3 w-3" />}
              </a>
            );
          },
          img: ({ src, alt }) => {
            const srcStr = typeof src === "string" ? src : "";
            const safeSrc = sanitizeUrl(srcStr);
            if (!safeSrc) return null;

            return (
              <img
                src={safeSrc}
                alt={alt || ""}
                className="rounded-lg my-4 max-w-full h-auto"
                loading="lazy"
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
