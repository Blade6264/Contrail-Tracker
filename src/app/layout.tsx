import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import {Providers} from "@/app/providers";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Contrail Tracker",
    description: "Generated by create next app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
            <Providers>
                {children}
            </Providers>
            </body>
        </html>
    );
}
