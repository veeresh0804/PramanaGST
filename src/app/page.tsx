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
} from 'lucide-react';
import { MOCK_VENDORS, MOCK_GRAPH_DATA } from './lib/mock-data';
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

// Dynamically import force graph for the dashboard preview
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 300 });

  useEffect(() => {
    setMounted(true);
    
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const kpiData = [
    { 
      label: 'Invoices Reconciled', 
      value: '18,450', 
      change: '+92%', 
      isPositive: true, 
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'High Risk Vendors', 
      value: '124', 
      change: '+15%', 
      isPositive: false, 
      icon: <Users className="h-4 w-4 text-red-600" />,
      bgColor: 'bg-red-50'
    },
    { 
      label: 'ITC Mismatches', 
      value: '356', 
      badge: '₹8.7 Cr Exposure', 
      icon: <ShieldAlert className="h-4 w-4 text-orange-600" />,
      bgColor: 'bg-orange-50'
    },
    { 
      label: 'Tax Discrepancies', 
      value: '₹12.3 Cr', 
      change: '+20%', 
      isPositive: false, 
      icon: <CircleCheck className="h-4 w-4 text-rose-600" />,
      bgColor: 'bg-rose-50'
    }
  ];

  const chartData = [
    { name: '72', value: 72, color: '#10b981' },
    { name: '214', value: 214, color: '#f59e0b' },
    { name: '582', value: 582, color: '#ef4444' },
  ];

  // Simplified graph data for the preview
  const previewGraphData = useMemo(() => {
    const nodeColors: Record<string, string> = {
      ROOT_NODE: '#003366',
      SUPPLIER: '#0099CC',
      BUYER: '#1E2A38',
      INVOICE: '#94A3B8',
      RETURN_PERIOD: '#E2E8F0',
      IRN: '#CBD5E1',
    };

    const nodes = MOCK_GRAPH_DATA.nodes.map(n => ({
      ...n,
      color: nodeColors[n.type as keyof typeof nodeColors] || '#CBD5E1'
    }));

    return { 
      nodes, 
      links: MOCK_GRAPH_DATA.links.map(l => ({
        ...l,
        statusColor: l.status === 'RISK' ? '#ef4444' : l.status === 'WARNING' ? '#d97706' : '#CBD5E1'
      }))
    };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => (
          <Card key={idx} className="rounded-sm border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className={cn("p-2 rounded-sm", kpi.bgColor)}>
                  {kpi.icon}
                </div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{kpi.label}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-black text-slate-800 tracking-tight">{kpi.value}</span>
                {kpi.change && (
                  <Badge variant="outline" className={cn(
                    "rounded-none text-[10px] font-bold py-0.5",
                    kpi.isPositive ? "text-green-600 bg-green-50 border-green-200" : "text-red-600 bg-red-50 border-red-200"
                  )}>
                    <ArrowUpRight className={cn("h-3 w-3 mr-0.5", !kpi.isPositive && "rotate-90")} />
                    {kpi.change}
                  </Badge>
                )}
                {kpi.badge && (
                  <Badge variant="outline" className="rounded-none text-[10px] font-bold py-0.5 text-orange-600 bg-orange-50 border-orange-200">
                    {kpi.badge}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Network Overview Widget */}
        <Link href="/graph" className="group">
          <Card className="rounded-sm border shadow-sm hover:shadow-md transition-all h-full bg-white relative overflow-hidden group-hover:border-primary/40">
            <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-600">Network Overview</CardTitle>
              </div>
              <Badge className="bg-primary/5 text-primary border-primary/20 rounded-none text-[8px] h-4">LIVE</Badge>
            </CardHeader>
            <CardContent className="p-0 h-[300px] flex items-center justify-center bg-slate-50/30 overflow-hidden" ref={containerRef}>
              {mounted ? (
                <div className="w-full h-full pointer-events-none">
                  <ForceGraph2D
                    graphData={previewGraphData}
                    width={dimensions.width}
                    height={300}
                    nodeRelSize={5}
                    linkWidth={1}
                    linkColor={(link: any) => link.statusColor}
                    nodeCanvasObject={(node: any, ctx, globalScale) => {
                      ctx.beginPath();
                      ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
                      ctx.fillStyle = node.color;
                      ctx.fill();
                      
                      // Node border
                      ctx.lineWidth = 1.5 / globalScale;
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
              
              <div className="absolute bottom-4 left-4 p-3 bg-white/80 border border-slate-100 backdrop-blur-sm shadow-sm pointer-events-none">
                <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Cluster Topology</p>
                <p className="text-[8px] text-slate-500 font-medium">Deterministic statutory traversal</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* ITC Risk Summary Widget */}
        <Link href="/analytics" className="group">
          <Card className="rounded-sm border shadow-sm hover:shadow-md transition-all h-full bg-white group-hover:border-primary/40">
            <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-600">ITC Risk Summary</CardTitle>
              </div>
              <MoreHorizontal className="h-4 w-4 text-slate-300" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[240px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                  <span className="font-mono text-xs">₹6.1 cr</span> High Risk Exposure
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                  <Badge className="bg-orange-500 text-white rounded-none text-[8px] h-4">48</Badge> Suspicious Entities
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                  <Badge className="bg-red-500 text-white rounded-none text-[8px] h-4">23</Badge> Compliance Alerts
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Top High Risk Vendors Widget */}
        <Link href="/vendors" className="group">
          <Card className="rounded-sm border shadow-sm hover:shadow-md transition-all h-full bg-white group-hover:border-primary/40">
            <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-primary" />
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-600">Top High Risk Vendors</CardTitle>
              </div>
              <MoreHorizontal className="h-4 w-4 text-slate-300" />
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-[11px]">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-slate-400 font-bold">
                    <th className="px-6 py-3 text-left">Vendor Name</th>
                    <th className="px-6 py-3 text-center">Compliance Score</th>
                    <th className="px-6 py-3 text-right">ITC Exposure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: 'ABC Traders', score: '28%', exposure: '₹ 2.4 Cr', color: 'text-red-600' },
                    { name: 'XYZ Enterprises', score: '35%', exposure: '₹ 1.8 Cr', color: 'text-orange-600' },
                    { name: 'PQR Solutions', score: '41%', exposure: '₹ 1.3 Cr', color: 'text-orange-600' },
                  ].map((v, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700">{v.name}</td>
                      <td className={cn("px-6 py-4 text-center font-bold", v.color)}>{v.score}</td>
                      <td className="px-6 py-4 text-right">
                        <Badge className="bg-green-100 text-green-700 border-green-200 rounded-none text-[9px] font-bold">
                          {v.exposure}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 flex justify-center border-t border-slate-100">
                <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest rounded-none border-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  View All <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Recent Alerts Widget */}
        <Link href="/alerts" className="group">
          <Card className="rounded-sm border shadow-sm hover:shadow-md transition-all h-full bg-white group-hover:border-primary/40">
            <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-600">Recent Alerts</CardTitle>
              </div>
              <MoreHorizontal className="h-4 w-4 text-slate-300" />
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-[11px]">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-slate-400 font-bold">
                    <th className="px-6 py-3 text-left">Alert Type</th>
                    <th className="px-6 py-3 text-left">Details</th>
                    <th className="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { type: 'Invoice Not Reported', details: 'Supplier XYZ: Missing GSTR-1 Entry', status: 'High Risk', variant: 'bg-red-500' },
                    { type: 'ITC Overclaimed', details: 'ABC Traders: Excess ITC Claimed', status: 'Critical', variant: 'bg-rose-600' },
                    { type: 'Tax Payment Pending', details: 'PQR Solutions: Tax Not Paid', status: 'Medium', variant: 'bg-green-600' },
                  ].map((a, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700">{a.type}</td>
                      <td className="px-6 py-4 text-slate-500 italic font-medium">{a.details}</td>
                      <td className="px-6 py-4 text-right">
                        <Badge className={cn("text-white rounded-none text-[8px] uppercase tracking-widest font-black h-5 px-2 border-none", a.variant)}>
                          {a.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 flex justify-center border-t border-slate-100">
                <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest rounded-none border-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  View All <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>

      </div>
    </div>
  );
}
