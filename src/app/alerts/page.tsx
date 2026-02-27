'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertSeverity } from '@/domain/models/analytics';
import { Bell, ShieldAlert, Info, AlertTriangle, Clock, CheckCircle2, ArrowRight, Activity, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AlertCenterPage() {
  const [alerts, setAlerts] = useState<(Alert & { link?: string })[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAlerts([
      {
        id: 'ALR-001',
        title: 'Critical ITC Chain Break',
        description: 'Suspicious mismatch detected in upstream tax payment for Vendor ZEN-91 (Zenith Marketing). Chain analysis halted at node N-44.',
        timestamp: new Date(),
        severity: 'CRITICAL',
        source: 'RISK_AI',
        isRead: false,
        link: '/investigate/INV-2024-003'
      },
      {
        id: 'ALR-002',
        title: 'High Network Risk Cluster',
        description: 'Fraud ring engine identified a high-degree circular trading loop in the Shell Network Alpha-Epsilon cluster.',
        timestamp: new Date(Date.now() - 3600000),
        severity: 'WARNING',
        source: 'FRAUD_ENGINE',
        isRead: false,
        link: '/investigate/INV-LOOP-001'
      },
      {
        id: 'ALR-003',
        title: 'Batch Matching Complete',
        description: 'PR_JAN_2024 has been successfully reconciled against GSTR-2B datasets. 1,240 records verified.',
        timestamp: new Date(Date.now() - 7200000),
        severity: 'INFO',
        source: 'RECON',
        isRead: true,
        link: '/analytics'
      },
      {
        id: 'ALR-004',
        title: 'Suspicious IRN Cancellation',
        description: 'Entity 29ABCDE... reported invoice PR-1029 then cancelled IRN 5af67... post-matching.',
        timestamp: new Date(Date.now() - 86400000),
        severity: 'CRITICAL',
        source: 'RISK_AI',
        isRead: false,
        link: '/investigate/INV-2024-001'
      }
    ]);
  }, []);

  const getIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'CRITICAL': return <ShieldAlert className="h-5 w-5 text-destructive" />;
      case 'WARNING': return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      default: return <Info className="h-5 w-5 text-primary" />;
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Node Status</span>
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-primary">Intelligence Alert Center</h1>
          <p className="text-muted-foreground font-medium">Predictive notifications from the Pramana deterministic graph engine.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 h-10 text-[10px] font-bold uppercase tracking-widest rounded-none border-primary/20 bg-white shadow-sm hover:bg-slate-50">
          <CheckCircle2 className="h-4 w-4" /> Mark All as Verified
        </Button>
      </div>

      <div className="grid gap-6">
        {alerts.map((alert) => (
          <Card key={alert.id} className={cn(
            "rounded-none border-l-4 transition-all hover:bg-slate-50 bg-white shadow-sm",
            alert.severity === 'CRITICAL' ? "border-l-destructive" : 
            alert.severity === 'WARNING' ? "border-l-amber-500" : "border-l-primary"
          )}>
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-stretch">
                 <div className={cn(
                   "p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100",
                   alert.severity === 'CRITICAL' ? "bg-destructive/5" : 
                   alert.severity === 'WARNING' ? "bg-amber-500/5" : "bg-primary/5"
                 )}>
                   {getIcon(alert.severity)}
                 </div>
                 <div className="p-6 flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-primary">{alert.title}</h3>
                      <Badge variant="outline" className="text-[8px] uppercase tracking-[0.2em] font-black h-5 rounded-none px-2 border-slate-200 text-slate-400">
                        {alert.source}
                      </Badge>
                      {!alert.isRead && <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />}
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{alert.description}</p>
                    <div className="flex items-center gap-4 pt-2">
                       <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <Clock className="h-3.5 w-3.5" />
                         {alert.timestamp.toLocaleTimeString()} • {alert.timestamp.toLocaleDateString()}
                       </div>
                       <div className="h-1 w-1 rounded-full bg-slate-300" />
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         NODE-REF: {alert.id}
                       </div>
                    </div>
                 </div>
                 <div className="p-6 flex flex-col items-center justify-center bg-slate-50/50 min-w-[200px]">
                    {alert.link && (
                      <Link href={alert.link} className="w-full">
                        <Button className="w-full h-10 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-none shadow-md hover:bg-primary/90">
                          Solve Case <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    )}
                 </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-8 bg-slate-900 text-white rounded-none shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap className="h-32 w-32" />
         </div>
         <div className="flex items-center gap-4 mb-4">
           <div className="h-10 w-10 rounded bg-white/10 flex items-center justify-center border border-white/20">
             <Bell className="h-6 w-6 text-accent" />
           </div>
           <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Pramana Push Notification Sync</p>
              <p className="text-xl font-black">Statutory Alert Streaming ACTIVE</p>
           </div>
         </div>
         <p className="text-sm text-white/70 max-w-2xl leading-relaxed font-medium">
           This intelligence hub is connected via high-priority secure push protocols. Alerts generated by the deterministic traversal engine are pushed instantly to all designated compliance officers in this jurisdiction.
         </p>
         <div className="mt-8 pt-8 border-t border-white/10 flex gap-6">
            <div className="space-y-1">
               <p className="text-[9px] font-black uppercase tracking-widest text-white/40">LATENCY</p>
               <p className="text-xs font-bold">12ms (OPTIMAL)</p>
            </div>
            <div className="space-y-1">
               <p className="text-[9px] font-black uppercase tracking-widest text-white/40">CONNECTED NODES</p>
               <p className="text-xs font-bold">GS-CENTRAL-CLUSTER-01</p>
            </div>
         </div>
      </div>
    </div>
  );
}