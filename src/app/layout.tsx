import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "A11y Testing Tool",
  description: "Dev-friendly accessibility scan (Playwright + axe-core)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <h1 className="title">A11y Testing Tool</h1>
            <p className="subtitle">
              Paste a URL → scan → get actionable results.
            </p>
            <ThemeToggle />
          </header>
          <main>{children}</main>
          <footer className="footer">
            <span>Built with Next.js • Playwright • axe-core</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
