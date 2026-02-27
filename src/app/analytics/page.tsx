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
  FileText
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

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

  if (!mounted) return null;
  if (!healthData) return <div className="p-20 text-center font-bold text-primary animate-pulse uppercase tracking-widest">CALCULATING ANALYTICAL METRICS...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Pramāṇa Advanced Analytics</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary">Predictive Modeling</h1>
        </div>
        <Button variant="outline" className="border-border rounded-sm shadow-sm gap-2">
          <FileText className="h-4 w-4" /> Global Statistical Export
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="rounded-sm border-2 border-primary shadow-sm">
          <CardHeader className="bg-primary text-white py-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Health Index Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="text-6xl font-black text-primary">{healthData.score}</div>
            <div className="mt-4 px-4 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest">Composite Score</div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 rounded-sm border shadow-sm">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Risk Factor Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-border">
                {healthData.factors.map((factor, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-3 text-sm font-bold">
                      {factor.status === 'GOOD' ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-destructive" />}
                      {factor.label}
                    </div>
                    <Badge variant="outline" className={cn(
                      "rounded-sm text-[9px] font-extrabold uppercase px-3 py-1 tracking-widest",
                      factor.status === 'GOOD' ? 'border-green-600 text-green-700 bg-green-50' : 'border-destructive text-destructive bg-destructive/5'
                    )}>
                      {factor.status}
                    </Badge>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3 rounded-sm border shadow-sm">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Network Risk Propagation</CardTitle>
          </CardHeader>
          <CardContent className="pt-8 h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthData.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#1E2A38" strokeWidth={3} dot={{ fill: '#1E2A38', r: 5 }} />
                </LineChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-sm border shadow-sm flex flex-col">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-destructive">Anomaly Detection Loops</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
             <ScrollArea className="h-[400px]">
                <div className="divide-y divide-border">
                  {fraudClusters.map((cluster) => (
                    <div key={cluster.id} className="p-6 space-y-4 hover:bg-muted/30 transition-colors">
                       <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold text-destructive uppercase tracking-widest px-2 py-1 bg-destructive/5 border border-destructive/20 rounded-sm">
                            {cluster.severity} DETECTION
                          </span>
                          <ShieldAlert className="h-5 w-5 text-destructive" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-sm font-bold text-primary">{cluster.title}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">ID: {cluster.id}</p>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed">
                          <div className="space-y-1">
                             <p className="text-[9px] uppercase text-muted-foreground font-bold">Risk Nodes</p>
                             <p className="text-xs font-bold">{cluster.invoices.length} Entities</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[9px] uppercase text-destructive font-bold">Tax Gap</p>
                             <p className="text-xs font-bold text-destructive">₹{cluster.totalMismatch.toLocaleString()}</p>
                          </div>
                       </div>

                       <div className="pt-4 flex gap-2">
                          <Button variant="outline" className="flex-1 text-[10px] font-bold uppercase h-8 border-border rounded-sm hover:bg-primary hover:text-white" asChild>
                             <a href="https://selfservice.gst.gov.in/selfservice/" target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-2" /> Portal Report
                             </a>
                          </Button>
                          <Link href={`/audit/${cluster.id}`} className="flex-1">
                            <Button variant="default" className="w-full text-[10px] font-bold uppercase h-8 bg-primary rounded-sm shadow-sm">
                               <FileSearch className="h-3 w-3 mr-2" /> Audit View
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
    </div>
  );
}