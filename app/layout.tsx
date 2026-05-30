import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sellio — Built for sellers, powered by AI",
  description:
    "Sellio automates abandoned carts, stock alerts, customer replies, and weekly reports so you can focus on growing.",
  metadataBase: new URL("https://sellio.io"),
  openGraph: {
    title: "Sellio — Built for sellers, powered by AI",
    description:
      "AI-powered workflow automation for E-commerce & Retail store owners",
    siteName: "Sellio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable} antialiased`}
        style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
