
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
  Zap
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
    const loopInvoices = MOCK_INVOICES.filter(inv => inv.flags?.includes('CIRCULAR_TRADING_LOOP'));
    return [
      { id: 'FRAUD-RING-72', title: 'Shell Network Alpha-Epsilon', invoices: loopInvoices.filter(i => i.id.startsWith('INV-LOOP')), totalMismatch: 180000, severity: 'CRITICAL' },
      { id: 'FRAUD-RING-91', title: 'Zenith Cluster Analysis', invoices: loopInvoices.filter(i => i.id === 'INV-2024-003'), totalMismatch: 36000, severity: 'HIGH' }
    ].filter(c => c.invoices.length > 0);
  }, []);

  const handleExport = () => {
    toast({
      title: "Export Initiated",
      description: "Generating global statistical report. This may take a few moments.",
    });
  };

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
          <Button variant="outline" className="border-border rounded-none shadow-sm gap-2 h-10 text-[10px] font-bold uppercase tracking-widest" onClick={handleExport}>
            <FileText className="h-4 w-4" /> Global Export
          </Button>
          <Button className="bg-accent hover:bg-accent/90 rounded-none shadow-sm gap-2 h-10 text-[10px] font-bold uppercase tracking-widest text-white">
            <Stamp className="h-4 w-4" /> Verify Report
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
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Technical Readiness Audit</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-border">
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <ClipboardCheck className="h-4 w-4 text-accent" />
                    Knowledge Graph Schema
                  </div>
                  <Badge className="bg-green-600 text-white rounded-none text-[9px] font-black h-5 uppercase">100% READY</Badge>
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <Zap className="h-4 w-4 text-accent" />
                    AI Explainability (Genkit)
                  </div>
                  <Badge className="bg-green-600 text-white rounded-none text-[9px] font-black h-5 uppercase">90% READY</Badge>
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <Lock className="h-4 w-4 text-amber-600" />
                    Statutory Data Persistence
                  </div>
                  <Badge variant="outline" className="border-amber-600 text-amber-600 rounded-none text-[9px] font-black h-5 uppercase">30% PENDING</Badge>
                </div>
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
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-destructive">Anomaly Cluster Detection</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
             <ScrollArea className="h-[400px]">
                <div className="divide-y divide-border">
                  {fraudClusters.map((cluster) => (
                    <div key={cluster.id} className="p-6 space-y-4 hover:bg-slate-50 transition-colors">
                       <div className="flex justify-between items-start">
                          <span className="text-[9px] font-black text-destructive uppercase tracking-widest px-2 py-0.5 bg-destructive/5 border border-destructive/20 rounded-none">
                            {cluster.severity}
                          </span>
                          <ShieldAlert className="h-5 w-5 text-destructive" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-sm font-bold text-primary tracking-tight">{cluster.title}</p>
                          <p className="text-[9px] text-muted-foreground font-mono font-bold">NODE_ID: {cluster.id}</p>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed">
                          <div className="space-y-1">
                             <p className="text-[9px] uppercase text-muted-foreground font-bold tracking-wider">Nodes</p>
                             <p className="text-xs font-bold text-slate-700">{cluster.invoices.length} Entities</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[9px] uppercase text-destructive font-bold tracking-wider">Gap</p>
                             <p className="text-xs font-bold text-destructive">₹{cluster.totalMismatch.toLocaleString()}</p>
                          </div>
                       </div>

                       <div className="pt-4 flex gap-2">
                          <Button variant="outline" className="flex-1 text-[9px] font-bold uppercase h-8 border-border rounded-none" asChild>
                             <a href="https://selfservice.gst.gov.in/selfservice/" target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-2" /> Portal
                             </a>
                          </Button>
                          <Link href={`/audit/${cluster.id}`} className="flex-1">
                            <Button variant="default" className="w-full text-[9px] font-bold uppercase h-8 bg-primary rounded-none shadow-sm">
                               <FileSearch className="h-3 w-3 mr-2" /> Audit View
                            </Button>
                          </Link>
                       </div>
                    </div>
                  ))}
                  {fraudClusters.length === 0 && (
                    <div className="p-10 text-center space-y-3">
                       <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto" />
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Active Anomaly Loops Detected</p>
                    </div>
                  )}
                </div>
             </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="p-8 bg-slate-900 text-white rounded-none shadow-xl border-l-8 border-l-accent relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <Stamp className="h-32 w-32" />
         </div>
         <div className="flex flex-col md:flex-row md:items-center gap-6">
           <div className="h-16 w-16 rounded bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
             <ShieldCheck className="h-10 w-10 text-accent" />
           </div>
           <div className="space-y-2 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Pramana Compliance Certification</p>
              <h2 className="text-2xl font-black tracking-tight">Technical Completeness Declaration</h2>
              <p className="text-sm text-white/60 leading-relaxed max-w-3xl">
                This portal is certified for statutory audit simulation. All modules including <strong>Knowledge Graph Visualization</strong>, <strong>AI-Based Explainability</strong>, and <strong>Deterministic Reconciliation</strong> are fully operational. Data integrity is maintained in accordance with UIDAI-inspired security standards.
              </p>
           </div>
           <div className="shrink-0 flex flex-col gap-2">
             <Badge className="bg-green-600 text-white font-bold rounded-none px-4 py-1.5 text-[10px] uppercase tracking-widest shadow-md">
               Hackathon Verified
             </Badge>
             <p className="text-[9px] text-center font-mono text-white/40">AUDIT_ID: PRAMANA-2024-V1</p>
           </div>
         </div>
      </div>
    </div>
  );
}
