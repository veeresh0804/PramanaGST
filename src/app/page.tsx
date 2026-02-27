'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShieldAlert, 
  Database,
  Activity,
  Zap,
  Users,
  ChevronRight,
  FileText,
  ArrowUpRight,
  MoreHorizontal,
  CircleCheck,
  Bell,
  ArrowRight
} from 'lucide-react';
import { MOCK_VENDORS, MOCK_GRAPH_DATA, MOCK_INVOICES } from './lib/mock-data';
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
  Cell
} from 'recharts';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 260 });

  useEffect(() => {
    setMounted(true);
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 260
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const kpiData = [
    { 
      label: 'Rolling Payment Coverage', 
      value: '68.4%', 
      change: '-2.1%', 
      isPositive: false, 
      icon: <CircleCheck className="h-4 w-4 text-primary" />,
      bgColor: 'bg-primary/5'
    },
    { 
      label: 'ITC Discipline Index', 
      value: '91.2%', 
      change: '+4.5%', 
      isPositive: true, 
      icon: <Zap className="h-4 w-4 text-accent" />,
      bgColor: 'bg-accent/5'
    },
    { 
      label: 'Network Risk Score', 
      value: '42/100', 
      badge: 'High Risk Nodes: 3', 
      icon: <Users className="h-4 w-4 text-orange-600" />,
      bgColor: 'bg-orange-50'
    },
    { 
      label: 'Compliance Readiness', 
      value: '84.0%', 
      change: '+1.2%', 
      isPositive: true, 
      icon: <FileText className="h-4 w-4 text-green-600" />,
      bgColor: 'bg-green-50'
    }
  ];

  const chartData = [
    { name: 'Payment', value: 40, color: '#003366' },
    { name: 'ITC', value: 30, color: '#0099CC' },
    { name: 'Network', value: 20, color: '#f59e0b' },
    { name: 'IRN', value: 10, color: '#ef4444' },
  ];

  const highRiskVendors = useMemo(() => {
    return MOCK_VENDORS
      .filter(v => v.riskLevel === 'CRITICAL' || v.riskLevel === 'HIGH')
      .slice(0, 4);
  }, []);

  const recentAlerts = [
    { id: 1, title: 'Circular Trading Detected', source: 'FRAUD_ENGINE', time: '12m ago', severity: 'CRITICAL' },
    { id: 2, title: 'ITC Overclaim: Zenith Mkt', source: 'RISK_AI', time: '1h ago', severity: 'HIGH' },
    { id: 3, title: 'IRN Cancellation Warning', source: 'PORTAL_SYNC', time: '3h ago', severity: 'WARNING' },
  ];

  const previewGraphData = useMemo(() => {
    const nodeColors: Record<string, string> = {
      ROOT_NODE: '#003366',
      SUPPLIER: '#0099CC',
      BUYER: '#1E2A38',
      INVOICE: '#94A3B8',
    };

    const nodes = MOCK_GRAPH_DATA.nodes.slice(0, 15).map(n => ({
      ...n,
      color: nodeColors[n.type as keyof typeof nodeColors] || '#CBD5E1'
    }));

    const nodeIds = new Set(nodes.map(n => n.id));

    return { 
      nodes, 
      links: MOCK_GRAPH_DATA.links
        .filter(l => nodeIds.has(l.source as string) && nodeIds.has(l.target as string))
        .map(l => ({
          ...l,
          statusColor: l.status === 'RISK' ? '#ef4444' : l.status === 'WARNING' ? '#d97706' : '#CBD5E1'
        }))
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => (
          <Card key={idx} className="rounded-none border shadow-sm hover:shadow-md transition-shadow bg-white border-t-4 border-t-primary">
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className={cn("p-2 rounded-none", kpi.bgColor)}>
                  {kpi.icon}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{kpi.label}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-black text-slate-800 tracking-tight">{kpi.value}</span>
                {kpi.change && (
                  <Badge variant="outline" className={cn(
                    "rounded-none text-[9px] font-bold py-0.5 border-none",
                    kpi.isPositive ? "text-green-600 bg-green-50" : "text-destructive bg-destructive/5"
                  )}>
                    <ArrowUpRight className={cn("h-3 w-3 mr-0.5", !kpi.isPositive && "rotate-90")} />
                    {kpi.change}
                  </Badge>
                )}
                {kpi.badge && (
                  <Badge variant="outline" className="rounded-none text-[9px] font-bold py-0.5 text-orange-600 bg-orange-50 border-orange-200">
                    {kpi.badge}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Widget 1: Network Trace */}
        <Link href="/graph">
          <Card className="rounded-none border shadow-sm hover:shadow-md transition-all h-full bg-white relative overflow-hidden group">
            <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Network Topology Trace</CardTitle>
              </div>
              <Badge className="bg-primary text-white rounded-none text-[8px] h-4">LIVE TRACE</Badge>
            </CardHeader>
            <CardContent className="p-0 h-[260px] flex items-center justify-center bg-slate-50/30 overflow-hidden" ref={containerRef}>
              {mounted ? (
                <div className="w-full h-full pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                  <ForceGraph2D
                    graphData={previewGraphData}
                    width={dimensions.width}
                    height={260}
                    nodeRelSize={6}
                    linkWidth={1}
                    linkColor={(link: any) => link.statusColor}
                    nodeCanvasObject={(node: any, ctx, globalScale) => {
                      ctx.beginPath();
                      ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
                      ctx.fillStyle = node.color;
                      ctx.fill();
                      ctx.lineWidth = 1 / globalScale;
                      ctx.strokeStyle = '#ffffff';
                      ctx.stroke();
                    }}
                    enableNodeDrag={false}
                    enableZoomInteraction={false}
                    enablePanInteraction={false}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 animate-pulse">
                  <Activity className="h-8 w-8 text-slate-200" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Waking Graph Engine...</span>
                </div>
              )}
              <div className="absolute bottom-4 left-4 p-3 bg-white/95 border border-slate-100 backdrop-blur-sm shadow-sm">
                <p className="text-[9px] font-bold text-primary uppercase tracking-widest">GS-Node: Active</p>
                <p className="text-[8px] text-slate-500 font-medium">Click to enter explorer</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Widget 2: Compliance Analytics */}
        <Link href="/analytics">
          <Card className="rounded-none border shadow-sm hover:shadow-md transition-all h-full bg-white">
            <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Compliance Risk Analytics</CardTitle>
              </div>
              <Badge variant="outline" className="rounded-none text-[8px] h-4 border-slate-200 text-slate-400">V2.0</Badge>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[210px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', fontSize: '10px' }} />
                    <Bar dataKey="value" radius={[0, 0, 0, 0]} barSize={35}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 pt-3 border-t border-slate-100 justify-start">
                {chartData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[8px] font-bold text-slate-500 uppercase tracking-tighter">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: d.color }} /> {d.name} ({d.value}%)
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Widget 3: High-Priority Cases */}
        <Link href="/vendors">
          <Card className="rounded-none border shadow-sm hover:shadow-md transition-all h-full bg-white">
            <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-destructive" />
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-600">High-Priority Case Log</CardTitle>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {highRiskVendors.map((vendor, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-primary">{vendor.name}</span>
                      <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest">{vendor.gstin}</span>
                    </div>
                    <Badge className={cn(
                      "rounded-none text-[8px] font-black h-5 uppercase px-2",
                      vendor.riskLevel === 'CRITICAL' ? "bg-destructive" : "bg-amber-600"
                    )}>
                      {vendor.riskScore} PTS
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50/50 border-t">
                 <Button variant="ghost" className="w-full h-8 text-[9px] font-bold uppercase tracking-widest gap-2">
                    Review All Cases <ArrowRight className="h-3 w-3" />
                 </Button>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Widget 4: Intelligence Feed */}
        <Link href="/alerts">
          <Card className="rounded-none border shadow-sm hover:shadow-md transition-all h-full bg-white">
            <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-accent" />
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Intelligence Alert Feed</CardTitle>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                    <div className={cn(
                      "mt-1 h-1.5 w-1.5 rounded-full shrink-0",
                      alert.severity === 'CRITICAL' ? "bg-destructive" : alert.severity === 'HIGH' ? "bg-amber-500" : "bg-blue-500"
                    )} />
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-bold text-slate-700 leading-tight">{alert.title}</p>
                      <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>{alert.source}</span>
                        <span>•</span>
                        <span>{alert.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50/50 border-t">
                 <Button variant="ghost" className="w-full h-8 text-[9px] font-bold uppercase tracking-widest gap-2">
                    Open Alert Center <ArrowRight className="h-3 w-3" />
                 </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Statutory Footer Disclaimer */}
      <div className="p-8 bg-slate-900 text-white rounded-none shadow-xl border-l-8 border-l-accent relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldAlert className="h-32 w-32" />
         </div>
         <div className="flex flex-col md:flex-row md:items-center gap-6">
           <div className="h-16 w-16 rounded bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
             <CircleCheck className="h-10 w-10 text-accent" />
           </div>
           <div className="space-y-2 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Pramana Intelligence Unit</p>
              <h2 className="text-2xl font-black tracking-tight">Statutory Monitoring Status: ACTIVE</h2>
              <p className="text-sm text-white/60 leading-relaxed max-w-3xl">
                This dashboard presents a consolidated view of your compliance health. All metrics are calculated using the <strong>Multi-Factor Risk Model 2.0</strong>, which weights Payment Coverage at 40%, ITC Discipline at 30%, and Network Exposure at 20%.
              </p>
           </div>
         </div>
      </div>
    </div>
  );
}
