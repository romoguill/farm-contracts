import { Toaster } from '@/components/ui/sonner';
import { TanstackQueryProvider } from '@/providers/tanstack-query';
import type { Metadata } from 'next';
import { Barlow } from 'next/font/google';
import './globals.css';

const mainFont = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
});

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
      <body className={`flex flex-col bg-[#FFF5E4] ${mainFont.className}`}>
        <TanstackQueryProvider>
          {children}
          <Toaster richColors />
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
