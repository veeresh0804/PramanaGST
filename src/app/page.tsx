import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowUpRight, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Database,
  ArrowRight
} from 'lucide-react';
import { MOCK_VENDORS, MOCK_INVOICES } from './lib/mock-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const highRiskVendors = MOCK_VENDORS.filter(v => v.riskLevel === 'HIGH' || v.riskLevel === 'CRITICAL');
  const flaggedInvoices = MOCK_INVOICES.filter(i => i.status === 'FLAGGED');
  
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
            <div className="text-2xl font-bold">{flaggedInvoices.length}</div>
            <p className="text-xs text-destructive flex items-center gap-1 pt-1">
              <ArrowUpRight className="h-3 w-3" /> Action required
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline">Recent Investigations</CardTitle>
            <Link href="/investigate">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {MOCK_INVOICES.map((invoice) => {
                const vendor = MOCK_VENDORS.find(v => v.gstin === invoice.vendorGstin);
                return (
                  <div key={invoice.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">{invoice.id}</span>
                      <span className="text-xs text-muted-foreground">{vendor?.name || 'Unknown Vendor'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full border font-medium",
                        invoice.status === 'FLAGGED' ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-secondary/10 text-secondary border-secondary/20"
                      )}>
                        {invoice.status}
                      </span>
                      <Link href={`/investigate/${invoice.id}`} className="text-xs text-primary hover:underline font-medium">
                        Investigate
                      </Link>
                    </div>
                  </div>
                );
              })}
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
