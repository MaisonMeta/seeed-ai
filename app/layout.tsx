import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import Header from "../components/Header";
import ThemeProvider from "../contexts/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "seeed.ai Multimodal Chat",
  description: "A lightweight, production-ready web app for seeed.ai with a simple multimodal chat interface, drag-and-drop prompt modules, advanced multi-image workflows, and a gallery, using Google Gemini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-brand-primary text-brand-text font-sans`}>
        <ThemeProvider>
          <AuthProvider>
            <div className="flex flex-col h-screen bg-brand-primary">
              <Header />
              <main className="flex-grow overflow-hidden">
                {children}
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
