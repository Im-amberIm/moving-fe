import type { Metadata } from "next";
import GNB from "@/components/layout/GNB";
import localFont from "next/font/local";
import "./globals.css";
import QuoteGNB from "@/components/layout/QuoteGNB";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "무빙",
  description: "이사 소비자와 이사 전문가 매칭 서비스",
  icons: {
    icon: "/public/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} font-pretendard antialiased`}>
        <GNB />
        <QuoteGNB />
        <div className="max-w-[1400px] px-5 mx-auto">{children}</div>
      </body>
    </html>
  );
}
