
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
  ArrowUpRight,
  FileWarning,
  ExternalLink,
  IndianRupee,
  ShieldAlert,
  ChevronRight,
  Loader2
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

export default function AnalyticsPage() {
  const { toast } = useToast();
  const [healthData, setHealthData] = useState<HealthScore | null>(null);
  const [mounted, setMounted] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    calculateGSTHealthScore().then(setHealthData);
  }, []);

  const handleDownloadAudit = (clusterId: string) => {
    setGeneratingId(clusterId);
    toast({
      title: "Pramāṇa Audit Engine",
      description: "Extracting graph evidence and IRN cross-references...",
    });

    // Simulate audit generation delay
    setTimeout(() => {
      setGeneratingId(null);
      toast({
        title: "Audit Report Generated",
        description: `Deterministic evidence log for ${clusterId} is ready for download.`,
      });
      // In a production environment, this would trigger a window.open to a PDF stream
    }, 2500);
  };

  // Detect Fraud Clusters from Mock Data
  const fraudClusters = useMemo(() => {
    const loopInvoices = MOCK_INVOICES.filter(inv => inv.flags?.includes('CIRCULAR_TRADING_LOOP'));
    
    // Group into clusters (simplified logic for demonstration)
    const clusters = [
      {
        id: 'FRAUD-RING-72',
        title: 'Shell Network Alpha-Epsilon',
        invoices: loopInvoices.filter(i => i.id.startsWith('INV-LOOP')),
        totalMismatch: 900000, 
        severity: 'CRITICAL'
      },
      {
        id: 'FRAUD-RING-91',
        title: 'Zenith Cluster',
        invoices: loopInvoices.filter(i => i.id === 'INV-2024-003'),
        totalMismatch: 36000,
        severity: 'HIGH'
      }
    ].filter(c => c.invoices.length > 0);

    return clusters;
  }, []);

  if (!mounted) return null;
  if (!healthData) return <div className="p-8 text-center animate-pulse">Calculating Intelligence Metrics...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Predictive Analytics</h1>
        <p className="text-muted-foreground">Advanced GST health scoring and fraud ring pattern recognition.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 bg-card/50 border-primary/20 border-2">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">GST Health Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="relative h-32 w-32 flex items-center justify-center">
               <svg className="h-full w-full rotate-[-90deg]">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
                  <circle 
                    cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    className="text-primary" 
                    strokeDasharray={364}
                    strokeDashoffset={364 - (364 * healthData.score) / 100}
                  />
               </svg>
               <span className="absolute text-3xl font-bold">{healthData.score}</span>
            </div>
            <p className="mt-4 text-xs font-medium text-primary uppercase tracking-widest">Composite Index</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-card/50 border shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Scoring Factors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthData.factors.map((factor, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-white/5">
                <div className="flex items-center gap-3">
                  {factor.status === 'GOOD' ? <ShieldCheck className="h-4 w-4 text-secondary" /> : <AlertCircle className="h-4 w-4 text-destructive" />}
                  <span className="text-sm font-medium">{factor.label}</span>
                </div>
                <Badge variant={factor.status === 'GOOD' ? 'secondary' : 'destructive'} className="text-[10px] font-bold">
                  {factor.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-card/50 border shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Risk Propagation Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthData.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                  <XAxis dataKey="month" stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1D2126', border: '1px solid #2d3748', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="score" stroke="#5AC2FF" strokeWidth={3} dot={{ fill: '#5AC2FF', r: 4 }} />
                </LineChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-card/50 border shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Network className="h-5 w-5 text-secondary" />
              Circular Trading Loops
            </CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-destructive">
              {fraudClusters.length} Suspicious Flows Detected
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
             <ScrollArea className="h-[360px] pr-4">
               <div className="space-y-4">
                  {fraudClusters.map((cluster) => (
                    <div key={cluster.id} className="p-4 rounded-lg bg-destructive/5 border border-destructive/20 relative group hover:bg-destructive/10 transition-colors">
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-destructive uppercase tracking-widest">
                            {cluster.severity} RISK
                          </span>
                          <ShieldAlert className="h-4 w-4 text-destructive" />
                       </div>
                       <p className="text-sm font-bold">{cluster.title}</p>
                       <p className="text-[10px] text-muted-foreground font-mono">ID: {cluster.id}</p>
                       
                       <div className="mt-4 grid grid-cols-2 gap-4 border-t border-destructive/20 pt-4">
                          <div className="space-y-1">
                             <p className="text-[9px] uppercase text-muted-foreground font-bold">Volume</p>
                             <p className="text-xs font-mono">₹{cluster.invoices.reduce((acc, i) => acc + i.totalAmount, 0).toLocaleString()}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[9px] uppercase text-destructive font-bold">Tax Mismatch</p>
                             <p className="text-xs font-mono text-destructive">₹{cluster.totalMismatch.toLocaleString()}</p>
                          </div>
                       </div>

                       <div className="mt-4 flex flex-col gap-2">
                          <Button variant="outline" className="w-full text-[10px] h-7 gap-2 bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive hover:text-white" asChild>
                             <a href="https://selfservice.gst.gov.in/selfservice/" target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" /> File Complaint
                             </a>
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="w-full text-[10px] h-7 gap-2 border border-white/5 font-bold"
                            onClick={() => handleDownloadAudit(cluster.id)}
                            disabled={generatingId === cluster.id}
                          >
                             {generatingId === cluster.id ? (
                               <Loader2 className="h-3 w-3 animate-spin" />
                             ) : (
                               <FileWarning className="h-3 w-3" />
                             )}
                             {generatingId === cluster.id ? 'Analyzing...' : 'Audit PDF'}
                          </Button>
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
