"use client";

import { useState } from "react";
import { z } from "zod";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { userConfig } from "@/config/user";
import { useLanguage } from "@/context/language-context";
import { HttpCat } from "@/components/http-cat";

type FormStatus = "idle" | "sending" | "success" | "error";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "home.contact.errorNameTooShort")
    .max(100, "home.contact.errorNameTooLong"),
  email: z
    .string()
    .email("home.contact.errorEmailInvalid")
    .max(254, "home.contact.errorEmailTooLong"),
  message: z
    .string()
    .min(10, "home.contact.errorMessageTooShort")
    .max(5000, "home.contact.errorMessageTooLong"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const STATUS_RESET_MS = 4000;

const inputStyles =
  "w-full rounded-lg border bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});
  const { t } = useLanguage();

  const resetStatus = () => setTimeout(() => setStatus("idle"), STATUS_RESET_MS);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    const result = contactSchema.safeParse(payload);
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      setFieldErrors({
        name: flat.name?.[0],
        email: flat.email?.[0],
        message: flat.message?.[0],
      });
      return;
    }

    setStatus("sending");

    try {
      if (
        !userConfig.contact.formspree ||
        userConfig.contact.formspree.trim() === ""
      ) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setStatus("success");
        form.reset();
        resetStatus();
        return;
      }

      const res = await fetch(userConfig.contact.formspree, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("success");
      form.reset();
      resetStatus();
    } catch {
      setStatus("error");
      resetStatus();
    }
  };

  return (
    <section className="space-y-4" id="contact">
      <h2 className="text-lg font-semibold tracking-tight">
        {t("home.contact")}
      </h2>
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
              aria-invalid={fieldErrors.name ? "true" : undefined}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              className={inputStyles}
              placeholder={t("home.contact.namePlaceholder")}
            />
            {fieldErrors.name && (
              <p id="name-error" className="text-sm text-destructive">
                {t(fieldErrors.name)}
              </p>
            )}
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
              aria-invalid={fieldErrors.email ? "true" : undefined}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              className={inputStyles}
              placeholder={t("home.contact.emailPlaceholder")}
            />
            {fieldErrors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {t(fieldErrors.email)}
              </p>
            )}
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
            aria-invalid={fieldErrors.message ? "true" : undefined}
            aria-describedby={
              fieldErrors.message ? "message-error" : undefined
            }
            className={`${inputStyles} resize-none`}
            placeholder={t("home.contact.messagePlaceholder")}
          />
          {fieldErrors.message && (
            <p id="message-error" className="text-sm text-destructive">
              {t(fieldErrors.message)}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 active:scale-[0.98]"
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
          <div className="flex items-center gap-3">
            <HttpCat status={422} className="max-w-[72px]" />
            <p className="text-sm text-destructive">
              {t("home.contact.error")}
            </p>
          </div>
        )}
      </form>
    </section>
  );
}
