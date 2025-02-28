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
import Image from "@heroui/react";

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
                            <div className="fixed bottom-0 left-0 right-0 z-20 py-3 flex-col items-center justify-center text-center bg-background">
                                <div className="flex flex-row justify-center items-center">
                                    <img alt="Venmo icon" src="https://img.icons8.com/?size=100&id=RNX6EQh4jsBo&format=png&color=000000" width={20} />
                                    <p className="text-sm pl-1">Nayoung-Cha</p>
                                </div>
                                <div className="flex flex-row justify-center items-center">
                                    <img alt="Zelle icon" src="https://img.icons8.com/?size=100&id=Iirw95F6Nl9c&format=png&color=000000" width={24} />
                                    <p className="text-sm pl-1">kusa.uwmadison@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </Providers>
                </SessionProvider>
            </body>
        </html>
    );
}
