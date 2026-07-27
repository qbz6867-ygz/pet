import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;

  return {
    title: "宠物健康助手",
    description: "记录宠物的每一天，让健康与陪伴都有迹可循。",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "宠物健康助手",
      description: "记录每一天，守护每一份健康",
      images: [{ url: image, width: 1200, height: 630, alt: "宠物健康助手" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "宠物健康助手",
      description: "记录每一天，守护每一份健康",
      images: [image],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
