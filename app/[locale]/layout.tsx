import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import React from 'react';
import { routing } from '@/libs/i18nNavigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ThemeDirectionType } from "@/utlis/types/settings.type";
import { ClientDirectionProvider } from "@/utlis/providers/client-direction-provider";
import { ThemeProvider } from "@/utlis/providers/theme-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Lift & Eat",
    description: "Nutrition platform supported by AI",
    icons: {
        icon: "/favicon.ico",
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#F7FBF1" },
        { media: "(prefers-color-scheme: dark)", color: "#0b0f0a" },
    ],
};

export default async function RootLayout(props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await props.params;
    if (!routing.locales.includes(locale)) {
        notFound();
    }

    setRequestLocale(locale);

    // setup direction with radix ui
    const dir: ThemeDirectionType = locale === 'ar' ? 'rtl' : 'ltr';

    // Using internationalization in Client Components
    const messages = await getMessages();

    return (
        <html lang={locale} dir={dir} suppressHydrationWarning>
            <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ClientDirectionProvider dir={dir}>
                    <NextIntlClientProvider
                        locale={locale}
                        messages={messages}
                    >
                        <ThemeProvider
                            attribute="class"
                            enableSystem
                            disableTransitionOnChange
                        >
                            {props.children}
                        </ThemeProvider>
                    </NextIntlClientProvider>
                </ClientDirectionProvider>
            </body>
        </html>
    );
}
