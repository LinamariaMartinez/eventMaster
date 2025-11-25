import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

// Temporarily using system fonts due to Google Fonts connection issues during build
// To re-enable Google Fonts, uncomment the following lines and comment out the fontConfig below:
// import { Inter, Playfair_Display } from "next/font/google";
// const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: 'swap' });
// const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: 'swap' });

// Using system fonts as fallback
const inter = {
  className: "font-sans",
  variable: "--font-inter",
  style: {
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
};

const playfair = {
  className: "font-serif",
  variable: "--font-playfair",
  style: { fontFamily: 'Georgia, "Times New Roman", Times, serif' },
};

export const metadata: Metadata = {
  title: "Event Master",
  description:
    "Diseñamos experiencias brutales. Gestión profesional de eventos con invitaciones digitales automáticas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
