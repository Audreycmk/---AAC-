import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Audrey Audrey Chung - AAC 輔助通訊",
  description: "為康復者設計的輔助和替代性溝通應用程式",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AAC 輔助通訊",
  },
  icons: {
    icon: "/ACC icon.png",
    apple: "/ACC icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1e3a5f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e3a5f" />
        <link rel="apple-touch-icon" href="/ACC icon.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
