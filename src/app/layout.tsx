import type { Metadata } from 'next';
import './globals.css';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'PramanaGST - Official Compliance & Risk Intelligence',
  description: 'Government-grade GST reconciliation and financial intelligence platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/20 selection:text-primary bg-background text-foreground">
        <div className="flex h-screen overflow-hidden">
          <MainSidebar />
          <main className="flex-1 overflow-y-auto bg-background p-10">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}