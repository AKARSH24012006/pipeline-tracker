import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Pipeline — Internship application tracker", template: "%s · Pipeline" },
  description:
    "Pipeline tracks every internship and job application from wishlist to offer, with deadline alerts and response-rate stats. Built for students.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
