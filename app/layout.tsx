import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GolfTracker — Score & Stats On Course",
  description: "Track your golf rounds in real-time. Score, distance, stats.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
