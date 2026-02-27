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
import { MOCK_GRAPH_DATA, MOCK_VENDORS, MOCK_INVOICES } from '../lib/mock-data';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CompanyTransactionPanel } from './company-transaction-panel';
import { Vendor, Invoice } from '@/domain/models/entities';

// Using dynamic import to prevent SSR issues with canvas-based react-force-graph
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function KnowledgeGraphPage() {
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendorInvoices, setVendorInvoices] = useState<Invoice[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
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
      SUPPLIER: '#0099CC',  // Cyan
      BUYER: '#1E2A38',     // Slate
      INVOICE: '#F1F5F9',   // Light Grey
      IRN: '#94A3B8',       // Slate Grey
      RETURN_PERIOD: '#E2E8F0', // Muted Blue
      PAYMENT: '#CBD5E1'    // Grey
    };

    const nodes = MOCK_GRAPH_DATA.nodes.map(n => ({
      ...n,
      color: nodeColors[n.type] || '#BDBDBD',
      strokeColor: n.riskLevel === 'CRITICAL' ? '#ef4444' : '#ffffff'
    }));

    return {
      nodes,
      links: MOCK_GRAPH_DATA.links.map(l => ({
        ...l,
        label: l.type.replace(/_/g, ' '),
        statusColor: l.status === 'RISK' ? '#ef4444' : l.status === 'WARNING' ? '#d97706' : '#94a3b8'
      }))
    };
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    setSelectedNode(node);
    
    // Check if it's a company node to open the detailed transaction overlay
    if (node.type === 'SUPPLIER' || node.type === 'BUYER' || node.type === 'ROOT_NODE') {
      const vendor = MOCK_VENDORS.find(v => v.gstin === node.id);
      if (vendor) {
        setSelectedVendor(vendor);
        // Filter invoices associated with this vendor
        const invoices = MOCK_INVOICES.filter(inv => inv.vendorGstin === vendor.gstin || inv.recipientGstin === vendor.gstin);
        setVendorInvoices(invoices);
        setIsPanelOpen(true);
      }
    }
  }, []);

  if (!mounted) return (
    <div className="flex items-center justify-center h-[600px] border bg-slate-50 animate-pulse">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Loading Network Engine...</p>
    </div>
  );

  return (
    <div className="space-y-8 h-full flex flex-col pb-10 animate-in fade-in duration-500 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Topology Explorer</span>
            <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">Relationship Intelligence</h1>
          <p className="text-muted-foreground font-medium">Fluid visualization of statutory links and transaction lineage.</p>
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
        <div id="graph-container" className="lg:col-span-3 relative border bg-white shadow-sm group min-h-[600px] overflow-hidden rounded-none">
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="#F8F9FA"
            nodeLabel={(node: any) => `${node.type}: ${node.label}`}
            nodeRelSize={10}
            linkColor={(link: any) => link.statusColor}
            linkWidth={1.5}
            linkDirectionalArrowLength={5}
            linkDirectionalArrowRelPos={1}
            linkCanvasObjectMode={() => 'after'}
            linkCanvasObject={(link: any, ctx, globalScale) => {
              const MAX_FONT_SIZE = 4;
              const start = link.source;
              const end = link.target;

              if (typeof start !== 'object' || typeof end !== 'object') return;

              const textPos = {
                x: start.x + (end.x - start.x) / 2,
                y: start.y + (end.y - start.y) / 2,
              };

              const relAngle = Math.atan2(end.y - start.y, end.x - start.x);

              const fontSize = Math.min(MAX_FONT_SIZE, 12 / globalScale);
              ctx.font = `${fontSize}px Inter`;
              const textWidth = ctx.measureText(link.label).width;
              const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

              ctx.save();
              ctx.translate(textPos.x, textPos.y);
              ctx.rotate(relAngle);

              ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.fillRect(-bckgDimensions[0] / 2, -bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = link.statusColor;
              ctx.fillText(link.label, 0, 0);
              ctx.restore();
            }}
            onNodeClick={handleNodeClick}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.label;
              const fontSize = 10 / globalScale;
              const radius = 12;
              
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
              ctx.fillStyle = node.color;
              ctx.fill();
              
              ctx.lineWidth = 2 / globalScale;
              ctx.strokeStyle = node.strokeColor;
              ctx.stroke();

              ctx.font = `${fontSize}px Inter`;
              ctx.fillStyle = node.type === 'INVOICE' || node.type === 'RETURN_PERIOD' ? '#1E293B' : '#FFFFFF';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              const words = label.split(' ');
              if (words.length > 1) {
                ctx.fillText(words[0], node.x, node.y - fontSize/2);
                ctx.fillText(words[1], node.x, node.y + fontSize/2);
              } else {
                ctx.fillText(label.length > 8 ? label.substring(0, 6) + '...' : label, node.x, node.y);
              }

              if (node.riskLevel === 'CRITICAL') {
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius + 2 + Math.sin(Date.now() / 200) * 2, 0, 2 * Math.PI);
                ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
                ctx.stroke();
              }
            }}
          />
          
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <Badge className="bg-primary text-white font-bold rounded-none px-3 py-1 text-[9px] uppercase tracking-widest shadow-sm">
              <Zap className="h-3 w-3 mr-1.5 text-accent" /> System Trace: Active
            </Badge>
          </div>

          <div className="absolute bottom-6 left-6 flex flex-col gap-2 bg-white/95 p-4 border border-slate-100 shadow-sm backdrop-blur-sm">
             <div className="flex items-center gap-2">
               <div className="h-3 w-3 rounded-full bg-[#003366]" />
               <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Entities (Supplier/Root)</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="h-3 w-3 rounded-full bg-[#F1F5F9] border border-slate-300" />
               <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Invoices</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="h-3 w-3 rounded-full bg-[#CBD5E1]" />
               <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Payments/Challans</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="h-3 w-3 rounded-full bg-[#E2E8F0]" />
               <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Returns/Filings</span>
             </div>
          </div>

          <Button variant="ghost" size="icon" className="absolute bottom-6 right-6 h-10 w-10 rounded-none bg-white shadow-sm border border-slate-200" onClick={() => graphRef.current?.zoomToFit(400)}>
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
                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center border", selectedNode.riskLevel === 'CRITICAL' ? "border-destructive/20 bg-destructive/5" : "border-primary/20 bg-primary/5")}>
                       {selectedNode.type === 'ROOT_NODE' ? <Building2 className="h-5 w-5 text-primary" /> : <Info className="h-5 w-5 text-slate-500" />}
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

                  {(selectedNode.type === 'SUPPLIER' || selectedNode.type === 'BUYER') && (
                    <Button 
                      className="w-full h-10 rounded-none bg-primary text-white font-bold text-[10px] uppercase tracking-widest shadow-md"
                      onClick={() => handleNodeClick(selectedNode)}
                    >
                      Open Intelligence Dossier <ChevronRight className="h-3 w-3 ml-2" />
                    </Button>
                  )}
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
                Deterministic traversal indicates circular trading clusters in Inbound Supply Chain.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Overlay Detail Panel */}
      {isPanelOpen && selectedVendor && (
        <CompanyTransactionPanel 
          vendor={selectedVendor} 
          invoices={vendorInvoices} 
          onClose={() => setIsPanelOpen(false)} 
        />
      )}
    </div>
  );
}
