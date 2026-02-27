import type { Metadata } from 'next';
import './globals.css';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'PramanaGST - Official Intelligence Portal',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/20 selection:text-primary bg-background text-foreground">
        <div className="flex flex-col min-h-screen">
          <MainSidebar />
          <main className="flex-1 w-full bg-slate-50">
            <div className="max-w-7xl mx-auto py-10 px-6">
              {children}
            </div>
          </main>
          <footer className="bg-slate-800 text-white/60 py-10 px-6 border-t border-white/10">
             <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
                <div className="space-y-4">
                   <h4 className="text-white font-bold text-sm uppercase tracking-widest">About Pramana</h4>
                   <p className="text-xs leading-relaxed">Official GST Intelligence platform designed for statutory audit and relationship-based risk assessment in accordance with Government of India mandates.</p>
                </div>
                <div className="space-y-4">
                   <h4 className="text-white font-bold text-sm uppercase tracking-widest">Resources</h4>
                   <ul className="text-xs space-y-2">
                      <li className="hover:text-white cursor-pointer transition-colors">Audit Manual</li>
                      <li className="hover:text-white cursor-pointer transition-colors">Risk Algorithms</li>
                      <li className="hover:text-white cursor-pointer transition-colors">Network Data Schema</li>
                   </ul>
                </div>
                <div className="space-y-4">
                   <h4 className="text-white font-bold text-sm uppercase tracking-widest">Support</h4>
                   <ul className="text-xs space-y-2">
                      <li className="hover:text-white cursor-pointer transition-colors">Contact Support</li>
                      <li className="hover:text-white cursor-pointer transition-colors">System Status</li>
                      <li className="hover:text-white cursor-pointer transition-colors">Grievance Portal</li>
                   </ul>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center font-bold text-white">GST</div>
                   <p className="text-[10px] text-right">Copyright © 2024 Pramana Intelligence Unit<br/>Unique Intelligence Identification Authority</p>
                </div>
             </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
