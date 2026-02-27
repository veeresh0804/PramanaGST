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
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Vendor Risk Intelligence', icon: ShieldAlert, href: '/vendors' },
  { name: 'Case Management', icon: Search, href: '/investigate' },
  { name: 'Data Ingestion', icon: UploadCloud, href: '/upload' },
  { name: 'Knowledge Graph', icon: Database, href: '/graph' },
  { name: 'Predictive Analytics', icon: Activity, href: '/analytics' },
  { name: 'Alert Center', icon: Bell, href: '/alerts' },
];

export function MainSidebar() {
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-primary text-white">
      <div className="flex h-20 items-center border-b border-white/10 px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-white flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-xl">P</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-lg font-bold tracking-tight leading-none">
              PRAMANA
            </span>
            <span className="text-[10px] font-bold text-white/60 tracking-widest mt-1">
              GST INTELLIGENCE
            </span>
          </div>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-8 px-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 px-4 py-6 text-sm font-medium hover:bg-white/10 hover:text-white transition-all rounded-sm",
                  "border-transparent hover:border-white/20"
                )}
              >
                <item.icon className="h-5 w-5 opacity-70" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10 p-6 bg-black/10">
        <div className="flex items-center gap-3 px-2 mb-4">
           <div className="h-2 w-2 rounded-full bg-green-500"></div>
           <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">System Node: Active</span>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-4 px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-transparent">
          <Settings className="h-5 w-5 opacity-70" />
          System Settings
        </Button>
      </div>
    </div>
  );
}