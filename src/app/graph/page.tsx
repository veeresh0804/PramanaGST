
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database, Share2, Search, Info, ZoomIn, ZoomOut, Maximize2, Network, ShieldAlert, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_GRAPH_DATA } from '../lib/mock-data';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function KnowledgeGraphPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
        <div className="lg:col-span-3 relative rounded-xl border graph-container overflow-hidden group shadow-2xl">
          {/* Mock Interactive Graph Visualization */}
          <div className="absolute inset-0 p-8 flex items-center justify-center">
             <div className="relative w-full h-full">
                {/* Connections (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Lines would normally be rendered from data. Here we mock some key paths. */}
                  <g className="stroke-white/10" strokeWidth="1">
                    <line x1="50%" y1="50%" x2="25%" y2="25%" className="animate-pulse" />
                    <line x1="50%" y1="50%" x2="75%" y2="25%" />
                    <line x1="50%" y1="50%" x2="25%" y2="75%" strokeDasharray="4" />
                    <line x1="50%" y1="50%" x2="75%" y2="75%" className="stroke-destructive/40" strokeWidth="2" />
                    <line x1="75%" y1="75%" x2="90%" y2="60%" className="stroke-destructive/40" />
                  </g>
                </svg>

                {/* Nodes */}
                {/* Center Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                   <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shadow-[0_0_40px_rgba(90,194,255,0.4)] animate-pulse cursor-pointer">
                      <Database className="h-8 w-8 text-primary" />
                   </div>
                   <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold bg-black/50 px-2 py-1 rounded backdrop-blur border border-white/10 uppercase tracking-tighter">
                      ROOT_ORG
                   </div>
                </div>

                {/* Satellite Nodes */}
                <div className="absolute top-[25%] left-[25%] group/node cursor-pointer">
                   <div className="w-12 h-12 rounded-lg bg-secondary/20 border border-secondary flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(77,224,230,0.2)]">
                      <span className="text-[10px] font-bold">V-102</span>
                   </div>
                   <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[8px] uppercase tracking-tighter">Verified Vendor</div>
                </div>

                <div className="absolute bottom-[25%] right-[25%] group/node cursor-pointer">
                   <div className="w-12 h-12 rounded-lg bg-destructive/20 border border-destructive flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                      <ShieldAlert className="h-5 w-5 text-destructive" />
                   </div>
                   <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] uppercase tracking-tighter text-destructive font-bold">ANOMALY_DET_01</div>
                </div>

                <div className="absolute top-[25%] right-[25%] group/node cursor-pointer">
                   <div className="w-10 h-10 rounded-full bg-muted/40 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-[8px] font-bold">INV-A</span>
                   </div>
                </div>

                <div className="absolute bottom-[40%] right-[10%] group/node cursor-pointer">
                   <div className="w-10 h-10 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-[8px] font-bold text-destructive">ITC-X</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 left-6 flex gap-2">
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-black/40 backdrop-blur border-white/10 hover:bg-black/60">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-black/40 backdrop-blur border-white/10 hover:bg-black/60">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-black/40 backdrop-blur border-white/10 hover:bg-black/60">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute top-6 right-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase bg-black/40 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
            Live Nodes: 1,482 • Latency: 42ms
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
                  Anomaly Detection (Isolation Forest) has identified a high-degree cluster spanning 3 shell entities in the northern region.
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
                <div className="h-4 w-4 rounded bg-primary/20 border border-primary flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                <span>Root Organization</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="h-4 w-4 rounded bg-secondary/20 border border-secondary flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                </div>
                <span>Verified Trading Hub</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="h-4 w-4 rounded bg-destructive/20 border border-destructive flex items-center justify-center">
                   <ShieldAlert className="h-2.5 w-2.5 text-destructive" />
                </div>
                <span>Suspicious Pattern (ML)</span>
              </div>
              <div className="mt-4 p-2 rounded bg-muted/20 border border-white/5">
                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Relationship Strength</p>
                <div className="flex items-center gap-1">
                  <div className="h-[1px] flex-1 bg-white/10" />
                  <div className="h-[2px] flex-1 bg-white/30" />
                  <div className="h-[3px] flex-1 bg-primary/50 shadow-[0_0_5px_rgba(90,194,255,0.3)]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
