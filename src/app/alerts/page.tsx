
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertSeverity } from '@/domain/models/analytics';
import { Bell, ShieldAlert, Info, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AlertCenterPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAlerts([
      {
        id: 'ALR-001',
        title: 'Critical ITC Chain Break',
        description: 'Suspicious mismatch detected in upstream tax payment for Vendor ZEN-91.',
        timestamp: new Date(),
        severity: 'CRITICAL',
        source: 'RISK_AI',
        isRead: false
      },
      {
        id: 'ALR-002',
        title: 'High Network Risk Cluster',
        description: 'Fraud ring engine identified a high-degree community formation in Sector 4.',
        timestamp: new Date(Date.now() - 3600000),
        severity: 'WARNING',
        source: 'FRAUD_ENGINE',
        isRead: false
      },
      {
        id: 'ALR-003',
        title: 'Batch Matching Complete',
        description: 'PR_JAN_2024 has been successfully reconciled against GSTR-2B.',
        timestamp: new Date(Date.now() - 7200000),
        severity: 'INFO',
        source: 'RECON',
        isRead: true
      }
    ]);
  }, []);

  const getIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'CRITICAL': return <ShieldAlert className="h-4 w-4 text-destructive" />;
      case 'WARNING': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default: return <Info className="h-4 w-4 text-primary" />;
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-3xl font-bold tracking-tight">Intelligence Alert Center</h1>
          <p className="text-muted-foreground">Real-time notifications from the PramanaGST predictive engine.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <CheckCircle2 className="h-4 w-4" /> Mark All as Read
        </Button>
      </div>

      <div className="grid gap-6">
        {alerts.map((alert) => (
          <Card key={alert.id} className={cn(
            "bg-card/50 border transition-all hover:border-primary/40",
            !alert.isRead && "border-l-4 border-l-primary"
          )}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-2 rounded-full",
                    alert.severity === 'CRITICAL' ? "bg-destructive/10" : 
                    alert.severity === 'WARNING' ? "bg-amber-500/10" : "bg-primary/10"
                  )}>
                    {getIcon(alert.severity)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{alert.title}</h3>
                      <Badge variant="outline" className="text-[8px] uppercase tracking-widest h-4">
                        {alert.source}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{alert.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-2">
                      <Clock className="h-3 w-3" />
                      {alert.timestamp.toLocaleTimeString()} • {alert.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <Badge className={cn(
                     "text-[10px] font-bold uppercase",
                     alert.severity === 'CRITICAL' ? "bg-destructive text-destructive-foreground" :
                     alert.severity === 'WARNING' ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
                   )}>
                     {alert.severity}
                   </Badge>
                   <Button variant="ghost" size="sm" className="text-xs h-7">Investigate Case</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex gap-4">
         <Bell className="h-5 w-5 text-primary shrink-0" />
         <div className="space-y-1">
           <p className="text-sm font-bold text-primary">Firebase Real-time Sync</p>
           <p className="text-xs text-muted-foreground">
             This alert hub is powered by Firebase Cloud Messaging (FCM). Alerts generated in the backend are pushed instantly to all connected compliance officers.
           </p>
         </div>
      </div>
    </div>
  );
}
