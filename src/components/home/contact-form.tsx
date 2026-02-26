"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { userConfig } from "@/config/user";
import { useLanguage } from "@/context/language-context";

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      if (!userConfig.contact.formspree || userConfig.contact.formspree.trim() === "") {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setStatus("success");
        form.reset();
        setTimeout(() => setStatus("idle"), 4000);
        return;
      }

      const res = await fetch(userConfig.contact.formspree, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        throw new Error("Failed");
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section className="space-y-4" id="contact">
      <h2 className="text-lg font-semibold tracking-tight">{t("home.contact")}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-muted-foreground"
            >
              {t("home.contact.name")}
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              autoComplete="name"
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10"
              placeholder={t("home.contact.namePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-muted-foreground"
            >
              {t("home.contact.email")}
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10"
              placeholder={t("home.contact.emailPlaceholder")}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="message"
            className="text-sm font-medium text-muted-foreground"
          >
            {t("home.contact.message")}
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            className="w-full resize-none rounded-lg border bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10"
            placeholder={t("home.contact.messagePlaceholder")}
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("home.contact.sending")}
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              {t("home.contact.sent")}
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {t("home.contact.send")}
            </>
          )}
        </button>
        {status === "error" && (
          <p className="text-sm text-destructive">
            {t("home.contact.error")}
          </p>
        )}
      </form>
    </section>
  );
}
