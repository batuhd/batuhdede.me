"use client";

import { useState } from "react";
import { Copy, Check, Mail } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { ContactForm } from "@/components/home/contact-form";

export function ContactContent() {
  const { t, getLocalized } = useLanguage();
  const { contactEmails } = useSiteData();
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <div className="w-full max-w-[45rem] px-4 pb-24 sm:px-5 lg:px-0">
      <h1 className="text-4xl font-light tracking-tight text-foreground sm:text-5xl">
        {t("home.contact")}
      </h1>

      {contactEmails.length > 0 && (
        <div className="mt-8 space-y-3 border-b border-border pb-6">
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            {t("about.email")}
          </p>
          {contactEmails.map((ce) => (
            <div key={ce.email} className="flex items-center gap-2.5">
              <a
                href={`mailto:${ce.email}`}
                className="flex min-w-0 flex-1 items-start gap-2.5 transition-colors duration-150 hover:text-foreground"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0">
                  {getLocalized(ce, "label") && (
                    <span className="block truncate text-sm text-foreground">
                      {getLocalized(ce, "label")}
                    </span>
                  )}
                  <span className="block truncate text-sm text-muted-foreground">
                    {ce.email}
                  </span>
                </span>
              </a>
              <button
                type="button"
                onClick={() => handleCopyEmail(ce.email)}
                className="shrink-0 p-1.5 text-muted-foreground transition-colors duration-150 hover:text-foreground"
                aria-label={
                  copiedEmail === ce.email ? "Copied" : `Copy ${ce.email}`
                }
              >
                {copiedEmail === ce.email ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
