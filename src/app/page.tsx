'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Database,
  ArrowRight,
  Activity,
  AlertTriangle,
  Zap,
  FileText,
  Search
} from 'lucide-react';
import { MOCK_VENDORS, MOCK_INVOICES } from './lib/mock-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart,
  Line,
  BarChart,
  Bar
} from 'recharts';
import { useMemo } from 'react';

export default function DashboardPage() {
  const stats = useMemo(() => {
    const totalVolume = MOCK_INVOICES.reduce((acc, inv) => acc + inv.totalAmount, 0);
    const riskAnomalies = MOCK_INVOICES.filter(inv => inv.status === 'FLAGGED').length;
    const matchedCount = MOCK_INVOICES.filter(inv => inv.status === 'MATCHED').length;
    const reconHealth = (matchedCount / MOCK_INVOICES.length) * 100;
    return { totalVolume, riskAnomalies, reconHealth };
  }, []);

  const riskData = useMemo(() => [
    { name: 'Critical', value: MOCK_VENDORS.filter(v => v.riskLevel === 'CRITICAL').length },
    { name: 'High', value: MOCK_VENDORS.filter(v => v.riskLevel === 'HIGH').length },
    { name: 'Medium', value: MOCK_VENDORS.filter(v => v.riskLevel === 'MEDIUM').length },
    { name: 'Low', value: MOCK_VENDORS.filter(v => v.riskLevel === 'LOW').length },
  ], []);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Pramāṇa Administrative Portal</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary">Executive Summary</h1>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="border-border rounded-sm shadow-sm gap-2">
             <FileText className="h-4 w-4" /> Export Report
           </Button>
           <Button className="rounded-sm shadow-sm gap-2 bg-primary text-white">
             <Search className="h-4 w-4" /> Global Search
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: 'RECONCILIATION VOLUME', value: `₹${(stats.totalVolume / 10000000).toFixed(2)} CR`, icon: Database, trend: 'Baseline Normal', color: 'border-primary' },
          { label: 'MATCH RATE', value: `${stats.reconHealth.toFixed(1)}%`, icon: CheckCircle2, trend: '+0.4% from avg', color: 'border-slate-500' },
          { label: 'RISK ANOMALIES', value: stats.riskAnomalies, icon: ShieldAlert, trend: 'Immediate Action Required', color: 'border-destructive' },
          { label: 'VENDOR ENTITIES', value: MOCK_VENDORS.length, icon: Activity, trend: 'Verified Active', color: 'border-slate-400' },
        ].map((stat, i) => (
          <Card key={i} className={cn("rounded-sm border-t-4 shadow-sm", stat.color)}>
            <CardHeader className="pb-2">
              <span className="text-[10px] font-extrabold text-muted-foreground tracking-widest uppercase">{stat.label}</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-wide flex items-center gap-1">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-sm border shadow-sm">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-sm font-bold uppercase tracking-widest">Compliance Performance (6-Month Trend)</CardTitle>
          </CardHeader>
          <CardContent className="pt-8 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { month: 'Aug', score: 72 }, { month: 'Sep', score: 75 }, { month: 'Oct', score: 70 },
                { month: 'Nov', score: 82 }, { month: 'Dec', score: 85 }, { month: 'Jan', score: stats.reconHealth }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="stepAfter" dataKey="score" stroke="#1E2A38" strokeWidth={2} dot={{ r: 4, fill: '#1E2A38' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-sm border shadow-sm">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-sm font-bold uppercase tracking-widest">Entity Risk Stratification</CardTitle>
          </CardHeader>
          <CardContent className="pt-8 h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#1E2A38" fontSize={10} fontVariant="bold" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1E2A38" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
         <Card className="rounded-sm border shadow-sm">
            <CardHeader className="border-b bg-muted/20 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-widest">Urgent Compliance Flags</CardTitle>
              <Link href="/investigate">
                <Button variant="link" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:no-underline">View All Records</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-border">
                  {MOCK_INVOICES.filter(i => i.status === 'FLAGGED').slice(0, 5).map((inv) => (
                    <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-primary">{inv.id}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{inv.vendorGstin}</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="text-right">
                             <div className="text-xs font-bold">₹{inv.totalAmount.toLocaleString()}</div>
                             <div className="text-[9px] uppercase font-bold text-destructive">Risk Score: {inv.riskScore}</div>
                          </div>
                          <Link href={`/investigate/${inv.id}`}>
                            <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold uppercase border-border hover:bg-primary hover:text-white rounded-sm">Investigate</Button>
                          </Link>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="rounded-sm border shadow-sm">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-sm font-bold uppercase tracking-widest">Administrative Audit Trail</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
               <div className="space-y-6">
                  {[
                    { action: 'Manual Verification Requested', ref: 'INV-2024-001', time: '14:22:01' },
                    { action: 'Batch Reconciliation Sync', ref: 'PR_JAN_24', time: '12:05:44' },
                    { action: 'Fraud Cluster Identified', ref: 'RING-ALPHA', time: '09:30:12' },
                    { action: 'GSTR-2B Data Ingested', ref: 'B-12902', time: '08:45:00' },
                  ].map((log, i) => (
                    <div key={i} className="flex gap-4 items-start">
                       <div className="h-2 w-2 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                       <div className="flex-1">
                          <p className="text-xs font-bold text-primary">{log.action}</p>
                          <p className="text-[10px] text-muted-foreground">Reference: {log.ref}</p>
                       </div>
                       <span className="text-[10px] font-mono text-muted-foreground">{log.time}</span>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}