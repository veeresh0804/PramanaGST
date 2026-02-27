import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  UploadCloud, 
  Search, 
  Database, 
  Settings,
  Activity,
  Bell,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Risk Intelligence', icon: ShieldAlert, href: '/vendors' },
  { name: 'Investigations', icon: Search, href: '/investigate' },
  { name: 'Data Center', icon: UploadCloud, href: '/upload' },
  { name: 'Knowledge Graph', icon: Database, href: '/graph' },
  { name: 'Advanced Analytics', icon: Activity, href: '/analytics' },
  { name: 'Notifications', icon: Bell, href: '/alerts' },
];

export function MainSidebar() {
  return (
    <div className="flex h-screen w-72 flex-col bg-white border-r px-6 py-8">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-indigo-400 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
          <Sparkles className="text-white h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-headline text-xl font-extrabold tracking-tight text-slate-900">
            Pramana
          </span>
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
            GST Intelligence
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-4 px-4 py-6 text-sm font-semibold rounded-2xl group transition-all duration-200",
                "hover:bg-primary/5 hover:text-primary"
              )}
            >
              <item.icon className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
              {item.name}
            </Button>
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-8 border-t space-y-4">
        <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-2xl border border-primary/10">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">System Health</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-600">Active Node 0xAF2</span>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-4 px-4 py-2 text-sm font-medium text-slate-500 rounded-2xl hover:bg-slate-50">
          <Settings className="h-5 w-5 opacity-70" />
          Settings
        </Button>
      </div>
    </div>
  );
}
