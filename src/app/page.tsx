'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp,
  Database,
  ArrowRight,
  Activity,
  Zap,
  Search,
  Users
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
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
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
    { name: 'Critical', value: MOCK_VENDORS.filter(v => v.riskLevel === 'CRITICAL').length, color: '#ef4444' },
    { name: 'High', value: MOCK_VENDORS.filter(v => v.riskLevel === 'HIGH').length, color: '#f59e0b' },
    { name: 'Medium', value: MOCK_VENDORS.filter(v => v.riskLevel === 'MEDIUM').length, color: '#6366f1' },
    { name: 'Low', value: MOCK_VENDORS.filter(v => v.riskLevel === 'LOW').length, color: '#10b981' },
  ], []);

  const kpis = [
    { label: 'Match Rate', value: `${stats.reconHealth.toFixed(0)}%`, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Volume', value: `₹${(stats.totalVolume / 10000000).toFixed(1)} Cr`, icon: Database, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Anomalies', value: stats.riskAnomalies, icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Active Nodes', value: MOCK_VENDORS.length, icon: Users, color: 'text-sky-500', bg: 'bg-sky-50' },
  ];

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
            Welcome back, Auditor
          </h1>
          <p className="text-muted-foreground font-medium">Here's your real-time compliance overview for January 2024.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-2xl border-indigo-100 hover:bg-indigo-50 transition-colors px-6">
            Generate Report
          </Button>
          <Button className="rounded-2xl shadow-xl shadow-primary/20 px-8">
            <Zap className="mr-2 h-4 w-4" /> Run Engine
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {kpis.map((stat, i) => (
          <Card key={i} className="fancy-card overflow-hidden">
            <CardContent className="p-8">
              <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-6", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-4xl font-black text-slate-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 fancy-card">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-lg font-bold text-slate-800">Compliance Efficiency Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-8 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { month: 'Aug', score: 72 }, { month: 'Sep', score: 75 }, { month: 'Oct', score: 70 },
                { month: 'Nov', score: 82 }, { month: 'Dec', score: 85 }, { month: 'Jan', score: stats.reconHealth }
              ]}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="fancy-card">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-lg font-bold text-slate-800">Risk Segmentation</CardTitle>
          </CardHeader>
          <CardContent className="p-8 h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskData} layout="vertical" margin={{left: 20}}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontWeight: 'bold', fill: '#64748b'}} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
         <Card className="fancy-card">
            <CardHeader className="p-8 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">Priority Investigations</CardTitle>
              <Link href="/investigate">
                <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 rounded-2xl">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-50">
                  {MOCK_INVOICES.filter(i => i.status === 'FLAGGED').slice(0, 4).map((inv) => (
                    <div key={inv.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center">
                            <ShieldAlert className="h-5 w-5 text-rose-500" />
                          </div>
                          <div className="flex flex-col">
                             <span className="font-bold text-slate-900">{inv.id}</span>
                             <span className="text-xs text-muted-foreground font-mono">{inv.vendorGstin}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="text-right">
                             <div className="font-bold">₹{inv.totalAmount.toLocaleString()}</div>
                             <Badge variant="outline" className="text-[10px] text-rose-500 border-rose-100 bg-rose-50/50">Risk: {inv.riskScore}</Badge>
                          </div>
                          <Link href={`/investigate/${inv.id}`}>
                            <Button size="sm" className="rounded-xl px-4 font-bold">Audit</Button>
                          </Link>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="fancy-card bg-primary text-white">
            <CardHeader className="p-8">
              <CardTitle className="text-lg font-bold text-white">Compliance Assistant</CardTitle>
              <p className="text-primary-foreground/70 text-sm">Powered by Pramana LLM</p>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
               <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-sm font-medium leading-relaxed italic">
                    "Detected a recursive flow in Cluster 72. Current evidence suggests a circular trading loop. Would you like me to draft a summary for the official portal?"
                  </p>
               </div>
               <div className="flex gap-4">
                  <Button className="flex-1 bg-white text-primary hover:bg-white/90 rounded-2xl font-bold">Draft Summary</Button>
                  <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-2xl font-bold">Dismiss</Button>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
