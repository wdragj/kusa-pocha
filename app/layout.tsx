import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
            <head>
                <title>쿠사포차</title>
            </head>
            <body className={clsx("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
                <SessionProvider>
                    <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
                        <div className="relative flex flex-col h-screen">
                            <div className="fixed top-0 left-0 right-0 z-20">
                                <Navbar />
                            </div>
                            <main className="container pt-16 mx-auto max-w-7xl px-6">
                                {children}
                                <Analytics />
                                <SpeedInsights />
                            </main>
                            <footer className="mx-auto max-w-7xl px-6 flex flex-col items-center justify-center pt-9 pb-16">
                                <span className="text-default-600 text-primary text-xs text-center">
                                    Copyright © {new Date().getFullYear().toString()} Freddy (Yong Jun) Seo
                                </span>

                                <a href="mailto:wdragj@gmail.com" className="text-default-600 text-primary text-xs text-center mt-1">
                                    wdragj@gmail.com
                                </a>
                            </footer>
                            <div className="fixed bottom-0 left-0 right-0 z-10 py-3 flex-col items-center justify-center text-center bg-background">
                                <p className="text-sm">Venmo: @Nayoung-Cha</p>
                                <p className="text-sm">Zelle: kusa.uwmadison@gmail.com</p>
                            </div>
                        </div>
                    </Providers>
                </SessionProvider>
            </body>
        </html>
    );
}
