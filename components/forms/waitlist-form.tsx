"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "use-intl";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email(),
  consent: z.boolean().optional(),
});

export type WaitlistFormValues = z.infer<typeof schema>;

type WaitlistFormProps = {
  source?: string;
  compact?: boolean;
  className?: string;
};

export function WaitlistForm({ source = "hero", compact = false, className }: WaitlistFormProps) {
  const t = useTranslations("Waitlist");
  const locale = useLocale();
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = React.useState<string>("");
  const joinWaitlist = useMutation(api.mutations.waitlist.joinWaitlist);

  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", consent: true },
    mode: "onSubmit",
  });

  async function onSubmit(values: WaitlistFormValues) {
    setStatus("loading");
    setMessage("");

    if (!values.consent) {
      setStatus("error");
      setMessage(t("consentError"));
      return;
    }

    try {
      const result = await joinWaitlist({
        email: values.email,
        locale,
        source,
        ip_address: undefined, // Client-side doesn't have access to IP
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      });

      if (result.status === "updated") {
        setStatus("error");
        setMessage(t("disposableError")); // Réutilise le message d'erreur existant
        return;
      }

      setStatus("success");
      setMessage(t("success"));
      form.reset({ email: "", consent: true });

      // Analytics (Plausible / GTM)
      if (typeof window !== 'undefined') {
        try {
          // Plausible
          // @ts-expect-error - Plausible global not typed
          if (window.plausible) {
            // @ts-expect-error - Plausible global not typed
            window.plausible('waitlist_signup', { props: { locale, source } });
          }
          // GTM / dataLayer
          // @ts-expect-error - GTM dataLayer global not typed
          window.dataLayer = window.dataLayer || [];
          // @ts-expect-error - GTM dataLayer global not typed
          window.dataLayer.push({
            event: 'waitlist_signup',
            locale,
            source,
          });
        } catch {}
      }
    } catch (e: unknown) {
      setStatus("error");
      setMessage(dataMessage((e as Error)?.message) || t("error"));
    }
  }

  function dataMessage(m?: string) {
    if (!m) return "";
    if (m.toLowerCase().includes("disposable")) return t("disposableError");
    if (m.toLowerCase().includes("too many")) return t("rateLimit");
    return "";
  }

  const isLoading = status === "loading";

  return (
    <div className={cn("w-full", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid gap-3", compact ? "grid-cols-1 md:grid-cols-[1fr_auto] items-start" : "max-w-xl mx-auto")}
          aria-describedby="waitlist-status" aria-live="polite">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">{t("emailLabel")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    autoComplete="email"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className={cn(compact ? "md:mt-0" : "w-full")}>{isLoading ? t("loading") : t("cta")}</Button>

          <FormField
            control={form.control}
            name="consent"
            render={({ field }) => (
              <FormItem className={cn("col-span-full", compact ? "md:col-span-2" : "") }>
                <div className="flex items-start gap-2 text-sm">
                  <input id="consent" type="checkbox" checked={!!field.value} onChange={field.onChange} className="mt-1" />
                  <FormLabel htmlFor="consent" className="cursor-pointer">
                    {t("consent")}
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div id="waitlist-status" role="status" className={cn("mt-2 text-sm", status === "success" ? "text-green-600" : status === "error" ? "text-destructive" : "text-muted-foreground")}> {message} </div>
    </div>
  );
}

export default WaitlistForm;
