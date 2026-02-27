import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowUpRight, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  TrendingUp 
} from 'lucide-react';
import { MOCK_VENDORS } from './lib/mock-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const highRiskVendors = MOCK_VENDORS.filter(v => v.riskLevel === 'HIGH' || v.riskLevel === 'CRITICAL');
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Compliance Dashboard</h1>
        <p className="text-muted-foreground">Overview of your GST reconciliation health and vendor risks.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,482</div>
            <p className="text-xs text-primary flex items-center gap-1 pt-1">
              <ArrowUpRight className="h-3 w-3" /> +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-secondary bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reconciliation Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-secondary flex items-center gap-1 pt-1">
              <TrendingUp className="h-3 w-3" /> Improved by 2.4%
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flagged Anomalies</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-destructive flex items-center gap-1 pt-1">
              <ArrowUpRight className="h-3 w-3" /> 5 new high-risk alerts
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 pt-1">
              Requires manual investigation
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-card/50 border">
          <CardHeader>
            <CardTitle className="font-headline">Recent Investigations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">INV-2024-00{i}</span>
                    <span className="text-xs text-muted-foreground">ABC Technologies Pvt Ltd</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 font-medium">
                      High Risk
                    </span>
                    <Link href={`/investigate/INV-2024-00${i}`} className="text-xs text-primary hover:underline font-medium">
                      Investigate
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-card/50 border">
          <CardHeader>
            <CardTitle className="font-headline">High-Risk Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {highRiskVendors.map((vendor) => (
                <div key={vendor.gstin} className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{vendor.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{vendor.gstin}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={cn(
                      "text-sm font-bold",
                      vendor.riskScore > 85 ? "text-destructive" : "text-amber-500"
                    )}>
                      {vendor.riskScore}/100
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Database(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
