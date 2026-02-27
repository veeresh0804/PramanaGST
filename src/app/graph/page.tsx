'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Search, Filter, Network, ShieldAlert, GitBranch, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_GRAPH_DATA } from '../lib/mock-data';
import { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function KnowledgeGraphPage() {
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    setMounted(true);
    const updateDimensions = () => {
      const container = document.getElementById('graph-container');
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const graphData = useMemo(() => {
    const nodeColors: Record<string, string> = {
      TAXPAYER: '#6366f1', // Indigo
      INVOICE: '#94a3b8', // Slate
      IRN: '#0ea5e9', // Sky
      RETURN: '#10b981', // Emerald
      PAYMENT: '#f59e0b' // Amber
    };

    return {
      nodes: MOCK_GRAPH_DATA.nodes.map(n => ({
        ...n,
        color: n.riskLevel === 'CRITICAL' ? '#ef4444' : nodeColors[n.type] || '#6366f1',
        size: n.type === 'TAXPAYER' ? 12 : 8
      })),
      links: MOCK_GRAPH_DATA.links.map(l => ({
        ...l,
        label: l.type
      }))
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-10 h-full flex flex-col pb-10 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Relationship Explorer</h1>
          <p className="text-muted-foreground font-medium">Interactive Knowledge Graph for deterministic relationship traversal.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-12 h-12 w-80 bg-white rounded-2xl border-slate-100 shadow-sm focus:ring-primary" placeholder="Search entity node..." />
          </div>
          <Button variant="outline" className="rounded-2xl h-12 px-6 gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-[600px] grid lg:grid-cols-4 gap-8">
        <div id="graph-container" className="lg:col-span-3 relative rounded-3xl overflow-hidden bg-white shadow-xl shadow-slate-200/50 border border-slate-50 group">
          <ForceGraph2D
            graphData={graphData}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="transparent"
            nodeLabel={(node: any) => `${node.type}: ${node.label}`}
            nodeColor="color"
            nodeRelSize={8}
            linkColor={() => '#e2e8f0'}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.005}
            linkDirectionalArrowLength={6}
            linkDirectionalArrowRelPos={1}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.label;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px "Inter", sans-serif`;
              
              // Shadow for nodes
              ctx.shadowColor = 'rgba(0,0,0,0.1)';
              ctx.shadowBlur = 4;
              
              ctx.fillStyle = node.color;
              ctx.beginPath();
              if (node.type === 'TAXPAYER') {
                ctx.roundRect(node.x - node.size, node.y - node.size, node.size * 2, node.size * 2, 4);
              } else {
                ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI, false);
              }
              ctx.fill();
              
              ctx.shadowBlur = 0; // Reset shadow

              ctx.fillStyle = '#475569';
              ctx.fillText(label, node.x - ctx.measureText(label).width / 2, node.y + node.size + 10);
            }}
          />
          
          <div className="absolute top-8 left-8 flex items-center gap-3">
            <Badge className="bg-white/80 backdrop-blur-md text-primary font-bold border-slate-100 shadow-sm py-2 px-4 rounded-xl">
              SYSTEM STATUS: ACTIVE TRAVERSAL
            </Badge>
            <Badge variant="outline" className="bg-white/80 backdrop-blur-md text-slate-500 py-2 px-4 rounded-xl">
              NODES: {MOCK_GRAPH_DATA.nodes.length}
            </Badge>
          </div>

          <Button variant="ghost" size="icon" className="absolute bottom-8 right-8 h-12 w-12 rounded-2xl bg-white/80 backdrop-blur-md shadow-sm">
            <Maximize2 className="h-5 w-5 text-slate-600" />
          </Button>
        </div>

        <div className="space-y-8">
          <Card className="fancy-card bg-white p-2">
            <CardHeader className="p-6 border-b border-slate-50">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Node Legend</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                 {[
                   { label: 'Taxpayer Entity', color: 'bg-indigo-500', shape: 'rounded-sm' },
                   { label: 'Transaction Node', color: 'bg-slate-400', shape: 'rounded-full' },
                   { label: 'Tax Return', color: 'bg-emerald-500', shape: 'rounded-full' },
                   { label: 'Payment Node', color: 'bg-amber-500', shape: 'rounded-full' },
                   { label: 'High Risk Anomaly', color: 'bg-rose-500', shape: 'rounded-sm animate-pulse' },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 text-sm font-bold text-slate-600">
                      <div className={cn("h-4 w-4 shrink-0 shadow-sm", item.color, item.shape)} />
                      <span>{item.label}</span>
                   </div>
                 ))}
              </div>
              <div className="pt-6 border-t border-dashed">
                <Button className="w-full rounded-2xl h-12 font-bold shadow-lg shadow-primary/20">
                  <GitBranch className="h-4 w-4 mr-2" /> Trace Lineage
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="fancy-card bg-rose-50 border border-rose-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-rose-500">Anomaly Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed font-semibold text-rose-900/80">
                Recursive flow detected between 3 shell nodes. System suggests immediate isolation of ITC claims for this cluster.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
