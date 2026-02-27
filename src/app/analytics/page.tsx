
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { calculateGSTHealthScore } from '@/modules/analytics/health-scorer';
import { HealthScore } from '@/domain/models/analytics';
import { 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  AlertCircle, 
  Network,
  ArrowUpRight
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
  Bar,
  Cell
} from 'recharts';
import { Badge } from '@/components/ui/badge';

export default function AnalyticsPage() {
  const [healthData, setHealthData] = useState<HealthScore | null>(null);

  useEffect(() => {
    calculateGSTHealthScore().then(setHealthData);
  }, []);

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
          <CardContent className="h-[300px]">
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

        <Card className="lg:col-span-3 bg-card/50 border shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Network className="h-5 w-5 text-secondary" />
              Circular Trading Loops
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20 relative">
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-destructive uppercase tracking-widest">Active Loop Found</span>
                      <ArrowUpRight className="h-4 w-4 text-destructive" />
                   </div>
                   <p className="text-sm font-medium">Loop ID: FRAUD-RING-72</p>
                   <p className="text-[10px] text-muted-foreground mt-1">Spans 4 Tier-3 vendors across 2 states.</p>
                   <div className="mt-3 flex gap-1">
                      <div className="h-1 flex-1 bg-destructive rounded-full" />
                      <div className="h-1 flex-1 bg-destructive rounded-full opacity-50" />
                      <div className="h-1 flex-1 bg-destructive rounded-full opacity-20" />
                   </div>
                </div>
                <div className="text-[11px] text-muted-foreground italic leading-relaxed">
                   AI Engine has detected 2 candidate fraud rings in the last batch upload. Pending Graph lineage verification.
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
