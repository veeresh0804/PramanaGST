'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  Maximize2, 
  ChevronRight, 
  Info, 
  ArrowLeftRight, 
  Building2, 
  ShieldAlert,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_GRAPH_DATA, MY_COMPANY_GSTIN } from '../lib/mock-data';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Using dynamic import to prevent SSR issues with canvas-based react-force-graph
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function KnowledgeGraphPage() {
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const graphRef = useRef<any>(null);

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
      ROOT_NODE: '#003366', // Deep Navy
      SUPPLIER: '#3a7ca5',  // Muted Teal
      BUYER: '#4682b4',     // Steel Blue
      INVOICE: '#f1f5f9',   // Light Neutral
      IRN: '#64748b',       // Slate Grey
      RETURN_PERIOD: '#94a3b8',
      PAYMENT: '#0099CC'
    };

    // Semi-tree layout logic for deterministic visualization
    const nodes = MOCK_GRAPH_DATA.nodes.map(n => {
      let fx = undefined;
      if (n.id === MY_COMPANY_GSTIN) fx = 0;
      else if (n.type === 'SUPPLIER') fx = -300;
      else if (n.type === 'BUYER') fx = 300;
      
      return {
        ...n,
        fx,
        color: nodeColors[n.type] || '#6366f1',
        strokeColor: n.riskLevel === 'CRITICAL' ? '#ef4444' : '#cbd5e1'
      };
    });

    return {
      nodes,
      links: MOCK_GRAPH_DATA.links.map(l => ({
        ...l,
        statusColor: l.status === 'RISK' ? '#ef4444' : l.status === 'WARNING' ? '#d97706' : '#16a34a'
      }))
    };
  }, []);

  if (!mounted) return (
    <div className="flex items-center justify-center h-[600px] border bg-slate-50 animate-pulse">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Loading Network Engine...</p>
    </div>
  );

  return (
    <div className="space-y-8 h-full flex flex-col pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Topology Explorer</span>
            <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">Relationship Intelligence</h1>
          <p className="text-muted-foreground font-medium">Deterministic traversal of statutory links and transaction lineage.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input className="pl-9 h-10 w-64 bg-white rounded-none border-slate-200 shadow-sm" placeholder="Search entity node..." />
          </div>
          <Button variant="outline" className="rounded-none h-10 px-4 gap-2 text-[10px] font-bold uppercase tracking-widest border-slate-200 bg-white">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-[600px] grid lg:grid-cols-4 gap-8">
        <div id="graph-container" className="lg:col-span-3 relative border bg-white shadow-sm group min-h-[600px]">
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="#F8FAFC"
            nodeLabel={(node: any) => `${node.type}: ${node.label}`}
            nodeRelSize={6}
            linkColor={(link: any) => link.statusColor}
            linkWidth={1.5}
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
            onNodeClick={(node) => setSelectedNode(node)}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.label;
              const fontSize = 11 / globalScale;
              ctx.font = `${fontSize}px "Inter", sans-serif`;
              
              const isRoot = node.type === 'ROOT_NODE';
              const size = isRoot ? 12 : 8;
              
              // Node shadow for Root
              if (isRoot) {
                ctx.shadowColor = 'rgba(0,0,0,0.1)';
                ctx.shadowBlur = 10;
              }

              // Sharp Node drawing
              ctx.fillStyle = node.color;
              ctx.strokeStyle = node.strokeColor;
              ctx.lineWidth = 1 / globalScale;
              
              const rectX = node.x - size;
              const rectY = node.y - size;
              const rectW = size * 2;
              const rectH = size * 2;
              
              ctx.beginPath();
              // Standard rect for maximum compatibility
              ctx.rect(rectX, rectY, rectW, rectH);
              ctx.fill();
              ctx.stroke();
              
              ctx.shadowBlur = 0;

              // Label handling
              const textWidth = ctx.measureText(label).width;
              ctx.fillStyle = 'rgba(255,255,255,0.8)';
              ctx.fillRect(node.x - textWidth/2 - 2, node.y + size + 2, textWidth + 4, fontSize + 4);

              ctx.fillStyle = isRoot ? '#003366' : '#475569';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'top';
              ctx.fillText(label, node.x, node.y + size + 4);

              // Risk Pulse
              if (node.riskLevel === 'CRITICAL') {
                ctx.beginPath();
                ctx.arc(node.x, node.y, size + 4 + Math.sin(Date.now() / 300) * 2, 0, 2 * Math.PI);
                ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
                ctx.stroke();
              }
            }}
          />
          
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <Badge className="bg-primary text-white font-bold rounded-none px-3 py-1 text-[9px] uppercase tracking-widest shadow-sm">
              <Zap className="h-3 w-3 mr-1.5 text-accent" /> System Trace: Active
            </Badge>
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-slate-500 rounded-none px-3 py-1 text-[9px] uppercase tracking-widest border-slate-200">
              Nodes: {MOCK_GRAPH_DATA.nodes.length} | Latency: 12ms
            </Badge>
          </div>

          <div className="absolute bottom-6 left-6 flex items-center gap-4 bg-white/90 backdrop-blur-sm p-4 border border-slate-100 shadow-sm">
             <div className="flex items-center gap-2">
               <div className="h-1 w-6 bg-[#16a34a]" />
               <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Compliant</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="h-1 w-6 bg-[#d97706]" />
               <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Warning</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="h-1 w-6 bg-[#ef4444]" />
               <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Risk</span>
             </div>
          </div>

          <Button variant="ghost" size="icon" className="absolute bottom-6 right-6 h-10 w-10 rounded-none bg-white shadow-sm border border-slate-200">
            <Maximize2 className="h-4 w-4 text-slate-600" />
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="rounded-none border shadow-sm bg-white overflow-hidden border-t-4 border-t-primary">
            <CardHeader className="p-5 border-b border-slate-50">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Node Properties</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {selectedNode ? (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-8 w-8 flex items-center justify-center border", selectedNode.riskLevel === 'CRITICAL' ? "border-destructive/20 bg-destructive/5" : "border-primary/20 bg-primary/5")}>
                       {selectedNode.type === 'ROOT_NODE' ? <Building2 className="h-4 w-4 text-primary" /> : <Info className="h-4 w-4 text-slate-500" />}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-primary">{selectedNode.label}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{selectedNode.type}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed">
                     <div className="space-y-1">
                        <p className="text-[9px] uppercase font-bold text-slate-400">Compliance</p>
                        <Badge variant="outline" className={cn(
                          "rounded-none text-[8px] font-black uppercase tracking-tighter",
                          selectedNode.riskLevel === 'CRITICAL' ? "border-destructive text-destructive" : 
                          selectedNode.riskLevel === 'HIGH' ? "border-amber-600 text-amber-600" : "border-green-600 text-green-600"
                        )}>
                          {selectedNode.riskLevel} LEVEL
                        </Badge>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] uppercase font-bold text-slate-400">Node ID</p>
                        <p className="text-[10px] font-mono font-bold truncate text-slate-600">{selectedNode.id}</p>
                     </div>
                  </div>

                  {selectedNode.type === 'INVOICE' && (
                    <div className="p-4 bg-slate-50 border border-slate-100 space-y-3">
                       <p className="text-[9px] font-black uppercase text-slate-400">Transaction Evidence</p>
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Filing Status</span>
                          <span className="font-bold text-green-600 uppercase text-[9px]">Reported</span>
                       </div>
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Value</span>
                          <span className="font-mono font-bold text-primary">₹{selectedNode.properties?.value?.toLocaleString()}</span>
                       </div>
                    </div>
                  )}

                  <Button className="w-full h-10 rounded-none bg-primary text-white font-bold text-[10px] uppercase tracking-widest shadow-md">
                    Open Intelligence Dossier <ChevronRight className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                   <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                      <ArrowLeftRight className="h-6 w-6 text-slate-300" />
                   </div>
                   <p className="text-xs text-slate-400 font-medium italic">Select a node to inspect statutory properties and graph metrics.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-none border shadow-sm bg-destructive/5 border-destructive/10 overflow-hidden">
            <CardHeader className="py-3 px-5 bg-destructive text-white">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em]">Compliance Warning</CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex gap-4">
              <ShieldAlert className="h-5 w-5 text-destructive shrink-0" />
              <p className="text-[10px] leading-relaxed font-bold text-destructive/80 italic">
                Recursive ITC flow detected between shell nodes. Deterministic traversal indicates circular trading clusters in Inbound Supply Chain.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
