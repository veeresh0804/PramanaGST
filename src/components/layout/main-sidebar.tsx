'use client';

import Link from 'next/link';
import { 
  ChevronDown, 
  Search, 
  Globe, 
  User,
  LayoutDashboard,
  ShieldAlert,
  Search as SearchIcon,
  UploadCloud,
  Database,
  Activity,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const navItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Risk Intelligence', href: '/vendors' },
  { name: 'Investigations', href: '/investigate' },
  { name: 'Data Center', href: '/upload' },
  { name: 'Knowledge Graph', href: '/graph' },
  { name: 'Advanced Analytics', href: '/analytics' },
  { name: 'Notifications', href: '/alerts' },
];

export function MainSidebar() {
  return (
    <header className="w-full flex flex-col no-print">
      {/* Top beige bar */}
      <div className="official-header">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
             <div className="flex items-center gap-2">
               <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">GST</div>
               <span className="text-2xl font-bold text-slate-800 tracking-tight">PramanaGST</span>
             </div>
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Proof of Compliance</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-slate-700">Goods and Services Tax</span>
          <span className="text-xs text-slate-500">Government of India Intelligence Portal</span>
        </div>
      </div>

      {/* Deep blue navigation bar */}
      <nav className="official-nav">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className="nav-item">
                {item.name} <ChevronDown className="h-3 w-3 opacity-60" />
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <Input 
                placeholder="Search..." 
                className="h-8 bg-transparent border-white/20 text-white placeholder:text-white/50 text-xs rounded-none w-48 focus-visible:ring-0 focus-visible:border-white"
              />
              <div className="bg-sky-500 h-8 px-2 flex items-center cursor-pointer">
                <span className="text-xs font-bold text-white uppercase">Go</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/80 hover:text-white cursor-pointer px-2 py-3">
              <User className="h-4 w-4" />
              <span className="text-xs font-medium">Profile</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs-style status bar */}
      <div className="bg-white border-b px-10 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <span>Pramana</span>
          <span>&gt;</span>
          <span className="text-primary">Official Dashboard</span>
        </div>
      </div>
    </header>
  );
}
