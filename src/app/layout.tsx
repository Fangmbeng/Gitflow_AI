// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Multi-Agent Architecture System',
  description: 'AI-powered software architecture generation with financial analysis and risk assessment',
  keywords: ['AI', 'Architecture', 'Software Design', 'DevOps', 'Cloud Computing'],
  authors: [{ name: 'Multi-Agent Architecture Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}