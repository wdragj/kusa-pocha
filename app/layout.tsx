import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { SessionProvider } from "@/context/sessionContext";
import Navbar from "@/components/navbar/navbar";

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: {
        icon: "/favicon.ico",
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html suppressHydrationWarning lang="en">
            <head />
            <body className={clsx("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
                <SessionProvider>
                    <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
                        <div className="relative flex flex-col h-screen">
                            <Navbar />
                            <main className="container mx-auto max-w-7xl px-6 flex-grow">{children}</main>
                            <footer className="mx-auto max-w-7xl px-6 flex flex-col items-center justify-center py-3">
                                <span className="text-default-600 text-primary text-xs text-center">
                                    Copyright © {new Date().getFullYear().toString()} Freddy (Yong Jun) Seo
                                </span>

                                <a href="mailto:wdragj@gmail.com" className="text-default-600 text-primary text-xs text-center mt-1">
                                    wdragj@gmail.com
                                </a>
                            </footer>
                        </div>
                    </Providers>
                </SessionProvider>
            </body>
        </html>
    );
}
