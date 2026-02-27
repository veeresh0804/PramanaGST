
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  UploadCloud, 
  Search, 
  Database, 
  Settings,
  Activity,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Vendor Risk', icon: ShieldAlert, href: '/vendors' },
  { name: 'Investigation', icon: Search, href: '/investigate' },
  { name: 'Data Upload', icon: UploadCloud, href: '/upload' },
  { name: 'Knowledge Graph', icon: Database, href: '/graph' },
  { name: 'Analytics', icon: Activity, href: '/analytics' },
  { name: 'Alerts', icon: Bell, href: '/alerts' },
];

export function MainSidebar() {
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          <span className="font-headline text-xl font-bold tracking-tight text-foreground">
            Pramana<span className="text-primary">GST</span>
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-muted-foreground">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
