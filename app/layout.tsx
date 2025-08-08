import './globals.css';
import Link from 'next/link';

export const metadata = { title: "Tre's Beats", description: 'Upload and sell beats' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl">Tre's Beats</Link>
            <nav className="space-x-4">
              <Link href="/">Store</Link>
              <Link href="/upload">Upload</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl p-4">{children}</main>
        <footer className="mt-12 border-t py-6 text-sm text-neutral-500 text-center">© {new Date().getFullYear()} Tre's Beats</footer>
      </body>
    </html>
  );
}