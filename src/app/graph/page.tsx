
'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database, Share2, Search, Filter, Network, ShieldAlert, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_GRAPH_DATA } from '../lib/mock-data';
import { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';

// Dynamic import for react-force-graph as it's client-side only
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
    return {
      nodes: MOCK_GRAPH_DATA.nodes.map(n => ({
        ...n,
        color: n.riskLevel === 'CRITICAL' ? '#ef4444' : n.riskLevel === 'HIGH' ? '#f59e0b' : '#5AC2FF',
        val: n.type === 'BUYER' ? 10 : 5
      })),
      links: MOCK_GRAPH_DATA.links.map(l => ({
        source: l.source,
        target: l.target,
        label: l.type
      }))
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-3xl font-bold tracking-tight">Enterprise Knowledge Graph</h1>
          <p className="text-muted-foreground">Exploring entity relationships, tax flow patterns, and circular trading networks.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8 bg-card/50" placeholder="Search entity or GSTIN..." />
          </div>
          <Button variant="secondary" className="gap-2">
            <Filter className="h-4 w-4" /> Filter Clusters
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
            nodeLabel="label"
            nodeColor="color"
            nodeRelSize={6}
            linkColor={() => 'rgba(255,255,255,0.1)'}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.01}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.label;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Inter`;
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

              ctx.fillStyle = node.color;
              ctx.beginPath();
              ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI, false);
              ctx.fill();

              ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
              ctx.fillText(label, node.x - textWidth / 2, node.y + 10);
            }}
          />
          
          <div className="absolute top-6 right-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase bg-black/40 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
            Live Nodes: {MOCK_GRAPH_DATA.nodes.length} • Latency: 14ms
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Network className="h-4 w-4 text-primary" />
                Network Intelligence
              </CardTitle>
              <CardDescription className="text-[10px]">Graph metrics derived from Neo4j engine.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Topology Health</p>
                <div className="flex items-center gap-2">
                   <p className="text-sm font-medium">Optimal Clustering</p>
                   <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-[8px] px-1 h-4">STABLE</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Active Communities</p>
                <div className="flex gap-2">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mb-1" />
                    <span className="text-[8px]">CORE</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-secondary mb-1" />
                    <span className="text-[8px]">V-NET</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-destructive mb-1" />
                    <span className="text-[8px]">RISK</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Anomaly Detection (Isolation Forest) has identified a high-degree cluster spanning 3 shell entities.
                </p>
              </div>
              <Button size="sm" className="w-full text-[11px] h-8" variant="outline">Run Lineage Trace</Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Share2 className="h-4 w-4 text-secondary" />
                Legend & Schema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-xs">
                <div className="h-4 w-4 rounded bg-primary/20 border border-primary flex items-center justify-center" />
                <span>Buyer Organization</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="h-4 w-4 rounded bg-secondary/20 border border-secondary flex items-center justify-center" />
                <span>Verified Vendor</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                 <ShieldAlert className="h-4 w-4 text-destructive" />
                <span>Suspicious Pattern</span>
              </div>
              <div className="mt-4 p-2 rounded bg-muted/20 border border-white/5">
                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Relationship Strength</p>
                <div className="flex items-center gap-1">
                  <div className="h-[1px] flex-1 bg-white/10" />
                  <div className="h-[2px] flex-1 bg-white/30" />
                  <div className="h-[3px] flex-1 bg-primary/50" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
