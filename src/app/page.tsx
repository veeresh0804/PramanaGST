
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ArrowUpRight, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Database,
  ArrowRight,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { MOCK_VENDORS, MOCK_INVOICES } from './lib/mock-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';

const RISK_DISTRIBUTION_DATA = [
  { name: 'Low', value: 45, color: '#4DE0E6' },
  { name: 'Medium', value: 25, color: '#5AC2FF' },
  { name: 'High', value: 20, color: '#f59e0b' },
  { name: 'Critical', value: 10, color: '#ef4444' },
];

const TREND_DATA = [
  { month: 'Oct', matches: 88, anomalies: 12 },
  { month: 'Nov', matches: 91, anomalies: 8 },
  { month: 'Dec', matches: 85, anomalies: 15 },
  { month: 'Jan', matches: 94, anomalies: 6 },
];

export default function DashboardPage() {
  const highRiskVendors = MOCK_VENDORS.filter(v => v.riskLevel === 'HIGH' || v.riskLevel === 'CRITICAL');
  const flaggedInvoices = MOCK_INVOICES.filter(i => i.status === 'FLAGGED' || i.status === 'PARTIAL_MATCH');
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">Compliance Intelligence</h1>
        <p className="text-muted-foreground">Real-time risk aggregation and automated GST reconciliation insights.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary bg-card/50 backdrop-blur shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Matched Volume</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1.42 Cr</div>
            <p className="text-xs text-primary flex items-center gap-1 pt-1">
              <TrendingUp className="h-3 w-3" /> +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-secondary bg-card/50 backdrop-blur shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recon Health</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <div className="w-full bg-muted h-1 mt-2 rounded-full overflow-hidden">
              <div className="bg-secondary h-full" style={{ width: '94.2%' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive bg-card/50 backdrop-blur shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Risk Anomalies</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flaggedInvoices.length}</div>
            <p className="text-xs text-destructive flex items-center gap-1 pt-1">
              <AlertTriangle className="h-3 w-3" /> Immediate review
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-card/50 backdrop-blur shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending Audit</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 pt-1">
              Awaiting manual proof
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-card/50 border shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Reconciliation Trends
            </CardTitle>
            <CardDescription>Monthly GSTR-2B vs Purchase Register matching performance.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                <XAxis dataKey="month" stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1D2126', border: '1px solid #2d3748', borderRadius: '8px' }}
                  itemStyle={{ color: '#5AC2FF' }}
                />
                <Line type="monotone" dataKey="matches" stroke="#5AC2FF" strokeWidth={3} dot={{ fill: '#5AC2FF', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="anomalies" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-card/50 border shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Vendor Risk Distribution</CardTitle>
            <CardDescription>Breakdown of trading partners by AI risk tier.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={RISK_DISTRIBUTION_DATA}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {RISK_DISTRIBUTION_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1D2126', border: '1px solid #2d3748', borderRadius: '8px' }}
                  />
                </PieChart>
             </ResponsiveContainer>
             <div className="flex flex-col gap-2 pr-4">
                {RISK_DISTRIBUTION_DATA.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-card/50 border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline">High-Risk Cases</CardTitle>
            <Link href="/investigate">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Investigation Hub <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {MOCK_INVOICES.filter(i => i.status !== 'MATCHED').map((invoice) => {
                const vendor = MOCK_VENDORS.find(v => v.gstin === invoice.vendorGstin);
                return (
                  <div key={invoice.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">{invoice.id}</span>
                      <span className="text-xs text-muted-foreground">{vendor?.name || 'Unknown Vendor'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-widest",
                          invoice.status === 'FLAGGED' ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}
                      >
                        {invoice.status}
                      </Badge>
                      <Link href={`/investigate/${invoice.id}`} className="text-xs text-primary hover:underline font-medium">
                        Analyze
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-card/50 border shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Network Risk Scoring</CardTitle>
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
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">ML Score</span>
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
