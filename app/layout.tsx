import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Job Aggregator - ESN Île-de-France",
    description: "Offres d'emploi Analyste d'Exploitation",
    manifest: "/manifest.json",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>
                    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
