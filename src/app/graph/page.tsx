
'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database, Search, Filter, Network, ShieldAlert, GitBranch } from 'lucide-react';
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
      TAXPAYER: '#5AC2FF',
      INVOICE: '#4DE0E6',
      IRN: '#f59e0b',
      RETURN: '#10b981',
      PAYMENT: '#8b5cf6'
    };

    return {
      nodes: MOCK_GRAPH_DATA.nodes.map(n => ({
        ...n,
        color: n.riskLevel === 'CRITICAL' ? '#ef4444' : nodeColors[n.type] || '#fff',
        size: n.type === 'TAXPAYER' ? 8 : 4
      })),
      links: MOCK_GRAPH_DATA.links.map(l => ({
        ...l,
        label: l.type
      }))
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-3xl font-bold tracking-tight">Pramāṇa Graph Explorer</h1>
          <p className="text-muted-foreground">Deterministic traversal of tax flows, IRN linkage, and circular trading networks.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8 bg-card/50" placeholder="Search GSTIN or IRN..." />
          </div>
          <Button variant="secondary" className="gap-2">
            <Filter className="h-4 w-4" /> Filter Nodes
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-[600px] grid lg:grid-cols-4 gap-6">
        <div id="graph-container" className="lg:col-span-3 relative rounded-xl border graph-container overflow-hidden group shadow-2xl">
          <ForceGraph2D
            graphData={graphData}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="#1D2126"
            nodeLabel={(node: any) => `${node.type}: ${node.label}`}
            nodeColor="color"
            nodeRelSize={6}
            linkColor={() => 'rgba(255,255,255,0.15)'}
            linkDirectionalParticles={2}
            linkDirectionalArrowLength={3}
            linkDirectionalArrowRelPos={1}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.label;
              const fontSize = 10 / globalScale;
              ctx.font = `${fontSize}px Inter`;
              
              ctx.fillStyle = node.color;
              ctx.beginPath();
              ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI, false);
              ctx.fill();

              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.fillText(label, node.x - ctx.measureText(label).width / 2, node.y + node.size + 4);
            }}
          />
          
          <div className="absolute top-6 right-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase bg-black/40 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
            Knowledge Engine: ACTIVE • Nodes: {MOCK_GRAPH_DATA.nodes.length}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Network className="h-4 w-4 text-primary" />
                Traversal Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Topology State</p>
                <div className="flex items-center gap-2">
                   <p className="text-sm font-medium">Deterministic</p>
                   <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-[8px] h-4">SYNCED</Badge>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 space-y-3">
                 <div className="flex items-center gap-3 text-xs">
                    <div className="h-3 w-3 rounded bg-[#5AC2FF]" />
                    <span>Taxpayer Entity</span>
                 </div>
                 <div className="flex items-center gap-3 text-xs">
                    <div className="h-3 w-3 rounded bg-[#4DE0E6]" />
                    <span>Invoice Transaction</span>
                 </div>
                 <div className="flex items-center gap-3 text-xs">
                    <div className="h-3 w-3 rounded bg-[#f59e0b]" />
                    <span>IRN Node</span>
                 </div>
                 <div className="flex items-center gap-3 text-xs">
                    <div className="h-3 w-3 rounded bg-[#8b5cf6]" />
                    <span>Tax Payment</span>
                 </div>
              </div>
              <Button size="sm" className="w-full text-[11px] h-8 gap-2" variant="outline">
                <GitBranch className="h-3 w-3" /> Trace Lineage
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border border-destructive/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-destructive">
                <ShieldAlert className="h-4 w-4" /> Anomaly Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Isolation Forest detected a high-degree loop involving 3 shell entities in the JAN-24 period. IRN cancellations triggered on path traversal.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
