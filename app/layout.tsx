import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Audrey Audrey Chung - AAC 輔助通訊",
  description: "為康復者設計的輔助和替代性溝通應用程式",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK">
      <body>
        {children}
      </body>
    </html>
  );
}
