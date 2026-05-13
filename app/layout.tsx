import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "冰箱 · 食品临期管理",
  description: "拍照识别食品信息，提醒你及时食用。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
