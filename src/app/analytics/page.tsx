'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { calculateGSTHealthScore } from '@/modules/analytics/health-scorer';
import { HealthScore } from '@/domain/models/analytics';
import { MOCK_INVOICES, MOCK_VENDORS } from '@/app/lib/mock-data';
import { 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  AlertCircle, 
  Network,
  ExternalLink,
  ShieldAlert,
  FileSearch,
  CheckCircle2,
  FileText,
  Lock,
  Stamp,
  ClipboardCheck,
  Zap,
  ArrowRightLeft
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  const { toast } = useToast();
  const [healthData, setHealthData] = useState<HealthScore | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    calculateGSTHealthScore().then(setHealthData);
  }, []);

  const fraudClusters = useMemo(() => {
    return [
      { 
        id: 'FRAUD-RING-72', 
        title: 'Shell Network Alpha-Gamma', 
        type: 'CIRCULAR_TRADING_LOOP',
        metrics: { symmetry: '98.2%', taxGap: '94%', window: '48h' },
        severity: 'CRITICAL',
        riskValue: 3540000
      },
      { 
        id: 'FRAUD-RING-91', 
        title: 'Zenith Cluster (Chain Break)', 
        type: 'ITC_CHAIN_BROKEN',
        metrics: { symmetry: 'N/A', taxGap: '100%', window: '72h' },
        severity: 'HIGH',
        riskValue: 272000
      }
    ];
  }, []);

  if (!mounted) return null;
  if (!healthData) return <div className="p-20 text-center font-bold text-primary animate-pulse uppercase tracking-widest">CALCULATING ANALYTICAL METRICS...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border pb-6 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Pramāṇa Advanced Analytics</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary">Intelligence & Readiness</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border rounded-none shadow-sm gap-2 h-10 text-[10px] font-bold uppercase tracking-widest" onClick={() => toast({ title: "Export Initiated" })}>
            <FileText className="h-4 w-4" /> Global Export
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="rounded-none border-t-4 border-t-primary shadow-sm bg-white">
          <CardHeader className="py-4 px-6 border-b">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">System Health Index</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="text-6xl font-black text-primary tracking-tighter">{healthData.score}</div>
            <div className="mt-4 px-4 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest">Composite Score</div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 rounded-none border-t-4 border-t-primary shadow-sm bg-white">
          <CardHeader className="py-4 px-6 border-b">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Risk-Weighted Loop Indicators</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-border">
                {healthData.factors.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                      <Zap className={cn("h-4 w-4", f.status === 'BAD' ? "text-destructive" : "text-accent")} />
                      {f.label}
                    </div>
                    <Badge className={cn("rounded-none text-[9px] font-black h-5 uppercase text-white", f.status === 'BAD' ? "bg-destructive" : f.status === 'CONCERNING' ? "bg-amber-600" : "bg-green-600")}>
                      {f.status}
                    </Badge>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3 rounded-none border-t-4 border-t-slate-800 shadow-sm bg-white">
          <CardHeader className="py-4 px-6 border-b">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Compliance Propagation Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-8 h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthData.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="score" stroke="#003366" strokeWidth={3} dot={{ fill: '#003366', r: 5 }} />
                </LineChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-none border-t-4 border-t-destructive shadow-sm flex flex-col bg-white">
          <CardHeader className="py-4 px-6 border-b">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-destructive">Risk-Weighted Anomaly Detection</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
             <ScrollArea className="h-[400px]">
                <div className="divide-y divide-border">
                  {fraudClusters.map((cluster) => (
                    <div key={cluster.id} className="p-6 space-y-4 hover:bg-slate-50 transition-colors">
                       <div className="flex justify-between items-start">
                          <span className="text-[9px] font-black text-destructive uppercase tracking-widest px-2 py-0.5 bg-destructive/5 border border-destructive/20 rounded-none">
                            {cluster.severity} DETECTION
                          </span>
                          <ArrowRightLeft className="h-5 w-5 text-destructive" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-sm font-bold text-primary tracking-tight">{cluster.title}</p>
                          <p className="text-[9px] text-muted-foreground font-mono font-bold">{cluster.type}</p>
                       </div>
                       
                       <div className="grid grid-cols-3 gap-2 py-3 border-y border-dashed">
                          <div className="text-center">
                             <p className="text-[8px] uppercase text-muted-foreground font-bold">Symmetry</p>
                             <p className="text-[10px] font-black text-slate-700">{cluster.metrics.symmetry}</p>
                          </div>
                          <div className="text-center border-x">
                             <p className="text-[8px] uppercase text-muted-foreground font-bold">Tax Gap</p>
                             <p className="text-[10px] font-black text-destructive">{cluster.metrics.taxGap}</p>
                          </div>
                          <div className="text-center">
                             <p className="text-[8px] uppercase text-muted-foreground font-bold">Window</p>
                             <p className="text-[10px] font-black text-slate-700">{cluster.metrics.window}</p>
                          </div>
                       </div>

                       <div className="pt-2 flex gap-2">
                          <Link href={`/audit/${cluster.id}`} className="flex-1">
                            <Button variant="default" className="w-full text-[9px] font-bold uppercase h-8 bg-primary rounded-none shadow-sm">
                               <FileSearch className="h-3 w-3 mr-2" /> Evidence Log
                            </Button>
                          </Link>
                       </div>
                    </div>
                  ))}
                </div>
             </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="p-8 bg-slate-900 text-white rounded-none shadow-xl border-l-8 border-l-accent relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldAlert className="h-32 w-32" />
         </div>
         <div className="flex flex-col md:flex-row md:items-center gap-6">
           <div className="h-16 w-16 rounded bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
             <ShieldCheck className="h-10 w-10 text-accent" />
           </div>
           <div className="space-y-2 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Pramana Compliance Certification</p>
              <h2 className="text-2xl font-black tracking-tight">Circular Trading Detection Audit</h2>
              <p className="text-sm text-white/60 leading-relaxed max-w-3xl">
                Loop identification is based on a weighted risk model: <strong>30% Tax Gap</strong>, <strong>25% Value Symmetry</strong>, and <strong>15% Time Proximity</strong>. The system ignores legitimate operational cycles and flags only those nodes showing artificial invoice rotation without economic substance.
              </p>
           </div>
         </div>
      </div>
    </div>
  );
}
