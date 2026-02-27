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
      TAXPAYER: '#1E2A38', // Deep Navy
      INVOICE: '#4A5568', // Slate
      IRN: '#2D3748', // Charcoal
      RETURN: '#718096', // Light Slate
      PAYMENT: '#4A5568'
    };

    return {
      nodes: MOCK_GRAPH_DATA.nodes.map(n => ({
        ...n,
        color: n.riskLevel === 'CRITICAL' ? '#991b1b' : nodeColors[n.type] || '#1E2A38',
        size: n.type === 'TAXPAYER' ? 10 : 6
      })),
      links: MOCK_GRAPH_DATA.links.map(l => ({
        ...l,
        label: l.type
      }))
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 h-full flex flex-col pb-10">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Pramāṇa Relationship Engine</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary">Knowledge Graph</h1>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 h-10 w-64 border-border rounded-sm shadow-sm" placeholder="Search Node Reference..." />
          </div>
          <Button variant="outline" className="h-10 border-border rounded-sm shadow-sm gap-2">
            <Filter className="h-4 w-4" /> Traversal Filters
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-[600px] grid lg:grid-cols-4 gap-8">
        <div id="graph-container" className="lg:col-span-3 relative rounded-sm border shadow-inner overflow-hidden graph-container group">
          <ForceGraph2D
            graphData={graphData}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="#F8FAFC"
            nodeLabel={(node: any) => `${node.type}: ${node.label}`}
            nodeColor="color"
            nodeRelSize={6}
            linkColor={() => '#cbd5e1'}
            linkDirectionalParticles={1}
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.label;
              const fontSize = 11 / globalScale;
              ctx.font = `${fontSize}px "Inter", sans-serif`;
              
              ctx.fillStyle = node.color;
              ctx.beginPath();
              if (node.type === 'TAXPAYER') {
                ctx.rect(node.x - node.size, node.y - node.size, node.size * 2, node.size * 2);
              } else {
                ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI, false);
              }
              ctx.fill();

              ctx.fillStyle = '#1E2A38';
              ctx.fillText(label, node.x - ctx.measureText(label).width / 2, node.y + node.size + 8);
            }}
          />
          
          <div className="absolute top-6 left-6 text-[10px] font-bold tracking-[0.2em] text-primary uppercase bg-white border border-border px-4 py-2 shadow-sm">
            STATUS: ACTIVE TRAVERSAL • NODES: {MOCK_GRAPH_DATA.nodes.length}
          </div>
        </div>

        <div className="space-y-8">
          <Card className="rounded-sm border shadow-sm bg-white">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-primary">Network Metadata</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-1">
                <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Logic State</p>
                <div className="flex items-center gap-2">
                   <p className="text-sm font-bold text-primary">Deterministic</p>
                   <Badge className="bg-green-600 text-white border-none text-[8px] h-4 uppercase rounded-sm">Verified</Badge>
                </div>
              </div>
              <div className="pt-6 border-t border-dashed space-y-4">
                 <div className="flex items-center gap-3 text-xs font-bold text-primary">
                    <div className="h-3 w-3 bg-[#1E2A38] rounded-sm" />
                    <span>Taxpayer Entity</span>
                 </div>
                 <div className="flex items-center gap-3 text-xs font-bold text-primary">
                    <div className="h-3 w-3 bg-[#4A5568] rounded-full" />
                    <span>Transaction Node</span>
                 </div>
                 <div className="flex items-center gap-3 text-xs font-bold text-destructive">
                    <div className="h-3 w-3 bg-[#991b1b] rounded-sm" />
                    <span>High Risk Anomaly</span>
                 </div>
              </div>
              <Button size="sm" className="w-full text-[10px] font-bold uppercase h-9 bg-primary text-white rounded-sm shadow-sm">
                <GitBranch className="h-4 w-4 mr-2" /> Trace Lineage
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-sm border-2 border-destructive/20 shadow-sm bg-destructive/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-destructive">System Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] leading-relaxed font-bold text-destructive/80 italic">
                A recursive path detected between 3 shell nodes in Sector 4. Manual intervention required for IRN cancellation audit.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}