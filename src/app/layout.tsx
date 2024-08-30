import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanstackQueryProvider } from '@/providers/tanstack-query';

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
      <body className={inter.className}>
        <TanstackQueryProvider>
          {children}
          <Toaster richColors />
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
