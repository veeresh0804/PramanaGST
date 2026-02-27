import type { Metadata } from 'next';
import './globals.css';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'PramanaGST - Intelligent GST Reconciliation',
  description: 'AI-powered GST reconciliation and risk analytics platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-primary-foreground bg-background text-foreground">
        <div className="flex h-screen overflow-hidden">
          <MainSidebar />
          <main className="flex-1 overflow-y-auto bg-background p-8">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
