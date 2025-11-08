import "./globals.css";
import React from "react";

export const metadata = {
  title: "SkillSense — AI Talent Identifier",
  description: "Discover hidden skills from resumes using AI embeddings"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="text-xl font-semibold">SkillSense</div>
              <nav className="text-sm text-gray-600">AI Talent Identifier</nav>
            </div>
          </header>

          <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
            {children}
          </main>

          <footer className="bg-white border-t mt-8">
            <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-500">
              © {new Date().getFullYear()} SkillSense • Built with ❤️
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
