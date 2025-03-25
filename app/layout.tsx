import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Acvariu Interactiv",
  description: "Un joc simplu unde controlezi un pește într-un acvariu",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={inter.className}>
        <header className="bg-primary p-4 text-white">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Acvariu Interactiv</h1>
          </div>
        </header>
        {children}
        <footer className="bg-gray-100 p-4 mt-8">
          <div className="container mx-auto text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Acvariu Interactiv - Un proiect PWA
          </div>
        </footer>
      </body>
    </html>
  );
}

