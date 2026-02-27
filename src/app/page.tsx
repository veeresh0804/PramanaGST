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
      label: 'Rolling Payment Coverage', 
      value: '68%', 
      change: '-5%', 
      isPositive: false, 
      icon: <CircleCheck className="h-4 w-4 text-blue-600" />,
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'ITC Discipline Index', 
      value: '92%', 
      change: '+12%', 
      isPositive: true, 
      icon: <Zap className="h-4 w-4 text-accent" />,
      bgColor: 'bg-accent/5'
    },
    { 
      label: 'Network Exposure', 
      value: '42%', 
      badge: 'Watchlist: 3', 
      icon: <Users className="h-4 w-4 text-orange-600" />,
      bgColor: 'bg-orange-50'
    },
    { 
      label: 'IRN Compliance', 
      value: '99.2%', 
      change: '+0.5%', 
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => (
          <Card key={idx} className="rounded-none border shadow-sm hover:shadow-md transition-shadow bg-white">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link href="/graph" className="group">
          <Card className="rounded-none border shadow-sm hover:shadow-md transition-all h-full bg-white relative overflow-hidden">
            <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Compliance Network Trace</CardTitle>
              </div>
              <Badge className="bg-primary text-white rounded-none text-[8px] h-4">REAL-TIME</Badge>
            </CardHeader>
            <CardContent className="p-0 h-[300px] flex items-center justify-center bg-slate-50/30 overflow-hidden" ref={containerRef}>
              {mounted ? (
                <div className="w-full h-full pointer-events-none opacity-80">
                  <ForceGraph2D
                    graphData={previewGraphData}
                    width={dimensions.width}
                    height={300}
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
              <div className="absolute bottom-4 left-4 p-3 bg-white/90 border border-slate-100 backdrop-blur-sm shadow-sm">
                <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Topology Active</p>
                <p className="text-[8px] text-slate-500 font-medium">Multi-hop traversal engaged</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/analytics" className="group">
          <Card className="rounded-none border shadow-sm hover:shadow-md transition-all h-full bg-white">
            <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Risk Model Distribution</CardTitle>
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
                    <Bar dataKey="value" radius={[0, 0, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-slate-100 justify-between">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase">
                  <div className="h-2 w-2 bg-[#003366]" /> Payment (40%)
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase">
                  <div className="h-2 w-2 bg-[#0099CC]" /> ITC (30%)
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase">
                  <div className="h-2 w-2 bg-[#f59e0b]" /> Network (20%)
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase">
                  <div className="h-2 w-2 bg-[#ef4444]" /> IRN (10%)
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}