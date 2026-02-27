'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, 
  Home,
  ShieldAlert,
  Search as SearchIcon,
  UploadCloud,
  Database,
  Activity,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Risk Intelligence', href: '/vendors', icon: ShieldAlert },
  { name: 'Investigations', href: '/investigate', icon: SearchIcon },
  { name: 'Data Center', href: '/upload', icon: UploadCloud },
  { name: 'Knowledge Graph', href: '/graph', icon: Database },
  { name: 'Advanced Analytics', href: '/analytics', icon: Activity },
  { name: 'Notifications', href: '/alerts', icon: Bell },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <header className="w-full flex flex-col no-print sticky top-0 z-50 shadow-sm">
      {/* Top beige bar */}
      <div className="official-header">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex flex-col cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner">GST</div>
              <span className="text-2xl font-bold text-slate-800 tracking-tight">PramanaGST</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Proof of Compliance Intelligence</span>
          </Link>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-slate-700">Goods and Services Tax</span>
          <span className="text-xs text-slate-500">Government of India Portal</span>
        </div>
      </div>

      {/* Deep blue navigation bar */}
      <nav className="official-nav">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center overflow-x-auto">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className={cn(
                  "nav-item whitespace-nowrap",
                  pathname === item.href && "bg-white/10 border-b-2 border-accent"
                )}
              >
                {item.name} <ChevronDown className="h-3 w-3 opacity-60" />
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Breadcrumbs-style status bar */}
      <div className="bg-white border-b px-10 py-2 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <Link href="/" className="hover:text-primary transition-colors">Pramana</Link>
          <span className="opacity-30">{'>'}</span>
          <span className="text-primary">
            {navItems.find(i => i.href === pathname)?.name || 'Case File'}
          </span>
          <div className="ml-auto flex items-center gap-4">
            <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> SYSTEM: ACTIVE</span>
            <span className="opacity-30">|</span>
            <span>NODE: GS-CENTRAL-01</span>
          </div>
        </div>
      </div>
    </header>
  );
}
