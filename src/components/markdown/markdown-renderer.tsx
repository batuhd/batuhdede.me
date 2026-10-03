"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkEmoji from "remark-emoji";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, ExternalLink } from "lucide-react";
import Image from "next/image";
import { cn, sanitizeUrl } from "@/lib/utils";

// Custom schema - className attribute izni ver
//
// `className` tum elementlere acikken markdown icine Tailwind utility
// sinifi enjekte edilebiliyordu (orn. `fixed inset-0 z-50`) -> CSS tabanli
// UI redress / sayfa bozma. Script calistirmaz (`style` hala `attributes`
// icinde degil), yine de izin listesi daraltilir.
//
// DIKKAT: hast-util-sanitize `className` degerini *tüm attribute string'i*
// olarak test eder ve yalnizca RegExp veya tam eslesme kabul eder — glob
// ("language-*") calismaz. Sadece bu pipeline'in urettigi siniflar
// (fenced code block `language-xxx`) izin listesinde.
const ALLOWED_CLASS_NAME =
  /^(?:language-[\w-]+|hljs|inline-code|prose|table|task-list-item|contains-task-list)$/;

const customSchema = {
  ...defaultSchema,
  attributes: {
    ...(defaultSchema.attributes || {}),
    "*": [
      ...(defaultSchema.attributes?.["*"] || []),
      ["className", ALLOWED_CLASS_NAME],
    ],
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

function MarkdownCode({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"code">) {
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
}

function MarkdownPre({ children }: React.ComponentPropsWithoutRef<"pre">) {
  return <>{children}</>;
}

function MarkdownLink({
  href,
  children,
}: React.ComponentPropsWithoutRef<"a">) {
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
}

function MarkdownImage({
  src,
  alt,
}: React.ComponentPropsWithoutRef<"img">) {
  const srcStr = typeof src === "string" ? src : "";
  const safeSrc = sanitizeUrl(srcStr);
  if (!safeSrc) return null;

  return (
    <figure className="my-6">
      <Image
        src={safeSrc}
        alt={alt || ""}
        width={0}
        height={0}
        sizes="100vw"
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
}

const headingClasses: Record<number, string> = {
  1: "text-3xl font-bold mt-8 mb-4 scroll-mt-24",
  2: "text-2xl font-semibold mt-6 mb-3 scroll-mt-24",
  3: "text-xl font-semibold mt-5 mb-2 scroll-mt-24",
  4: "text-lg font-semibold mt-4 mb-2 scroll-mt-24",
  5: "text-base font-semibold mt-4 mb-2 scroll-mt-24",
  6: "text-sm font-semibold mt-4 mb-2 scroll-mt-24",
};

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

interface MarkdownHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

function MarkdownHeading({ level, children }: MarkdownHeadingProps) {
  const text = String(children);
  const id = generateId(text);
  const Tag = `h${level}` as const;

  return (
    <Tag id={id} className={headingClasses[level]}>
      {children}
    </Tag>
  );
}

const baseMarkdownComponents = {
  code: MarkdownCode,
  pre: MarkdownPre,
  a: MarkdownLink,
  img: MarkdownImage,
};

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
  const [activeHeading, setActiveHeading] = useState<string>("");

  // Extract headings for TOC
  const headings = useMemo<TocItem[]>(() => {
    if (!showToc) return [];

    const extractedHeadings: TocItem[] = [];
    const lines = content.split("\n");

    lines.forEach((line) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = generateId(text);
        extractedHeadings.push({ id, text, level });
      }
    });

    return extractedHeadings;
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
            ...baseMarkdownComponents,
            h1: ({ children }) => <MarkdownHeading level={1}>{children}</MarkdownHeading>,
            h2: ({ children }) => <MarkdownHeading level={2}>{children}</MarkdownHeading>,
            h3: ({ children }) => <MarkdownHeading level={3}>{children}</MarkdownHeading>,
            h4: ({ children }) => <MarkdownHeading level={4}>{children}</MarkdownHeading>,
            h5: ({ children }) => <MarkdownHeading level={5}>{children}</MarkdownHeading>,
            h6: ({ children }) => <MarkdownHeading level={6}>{children}</MarkdownHeading>,
            p: ({ children }) => <p className="my-4 leading-7">{children}</p>,
            ul: ({ children }) => (
              <ul className="list-disc pl-6 my-4 space-y-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 my-4 space-y-1">{children}</ol>
            ),
            li: ({ children }) => <li className="leading-7">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground my-6">
                {children}
              </blockquote>
            ),
            hr: () => <hr className="my-8 border-border" />,
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
            strong: ({ children }) => (
              <strong className="font-bold text-foreground">{children}</strong>
            ),
            em: ({ children }) => <em className="italic">{children}</em>,
            del: ({ children }) => (
              <del className="line-through text-muted-foreground">
                {children}
              </del>
            ),
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
        components={baseMarkdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
