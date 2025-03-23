import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { QuoteProvider } from "@/contexts/QuoteContext";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });
export const playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuoteNote - Save and Discover Quotes",
  description: "Save your favorite quotes and discover them randomly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 dark:bg-slate-900 min-h-screen`}>
        <AuthProvider>
          <QuoteProvider>
            {children}
          </QuoteProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
