import { Toaster } from '@/components/ui/sonner';
import { TanstackQueryProvider } from '@/providers/tanstack-query';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Farm - Contracts',
  description: 'Manage your contracts. Easy.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`flex flex-col ${inter.className}`}>
        <TanstackQueryProvider>
          {children}
          <Toaster richColors />
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
