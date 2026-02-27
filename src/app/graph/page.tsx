import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Share2, Search, Info, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function KnowledgeGraphPage() {
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
          <Button variant="secondary">Run Pattern Analysis</Button>
        </div>
      </div>

      <div className="flex-1 min-h-[600px] grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 relative rounded-xl border graph-container overflow-hidden group">
          {/* Mock Graph Visualization Overlay */}
          <div className="absolute inset-0 p-8">
             <div className="relative w-full h-full">
                {/* Central Entity */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                   <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shadow-[0_0_30px_rgba(90,194,255,0.4)] animate-pulse">
                      <Database className="h-8 w-8 text-primary" />
                   </div>
                   <span className="text-xs font-bold bg-black/50 px-2 py-1 rounded backdrop-blur border border-white/10">ROOT_ORG</span>
                </div>

                {/* Satellite Entities */}
                <div className="absolute top-[20%] left-[30%] flex flex-col items-center gap-2 group/node cursor-pointer transition-transform hover:scale-110">
                   <div className="w-12 h-12 rounded-lg bg-secondary/20 border border-secondary flex items-center justify-center">
                      <span className="text-[10px] font-bold">V-102</span>
                   </div>
                   <span className="text-[8px] uppercase tracking-tighter opacity-70">Vendor: ABC Tech</span>
                </div>

                <div className="absolute bottom-[30%] right-[25%] flex flex-col items-center gap-2 group/node cursor-pointer transition-transform hover:scale-110">
                   <div className="w-12 h-12 rounded-lg bg-destructive/20 border border-destructive flex items-center justify-center">
                      <span className="text-[10px] font-bold">ITC-X</span>
                   </div>
                   <span className="text-[8px] uppercase tracking-tighter opacity-70">Flagged: Circular Claim</span>
                </div>

                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                   <line x1="50%" y1="50%" x2="33%" y2="25%" stroke="white" strokeWidth="1" strokeDasharray="4" />
                   <line x1="50%" y1="50%" x2="75%" y2="70%" stroke="white" strokeWidth="1" />
                </svg>
             </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 left-6 flex gap-2">
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-black/40 backdrop-blur border-white/10">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-black/40 backdrop-blur border-white/10">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-black/40 backdrop-blur border-white/10">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute top-6 right-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase bg-black/40 px-3 py-1 rounded-full border border-white/5">
            Active Nodes: 1,482
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Graph Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Topology Status</p>
                <p className="text-sm font-medium">Healthy Network</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Detected Communities</p>
                <div className="flex gap-2 pt-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="h-2 w-2 rounded-full bg-secondary" />
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  The graph currently shows a high clustering coefficient in your primary supply chain, indicating stable vendor relationships.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Share2 className="h-4 w-4 text-secondary" />
                Legend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded bg-primary/20 border border-primary" />
                <span>Primary Organization</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded bg-secondary/20 border border-secondary" />
                <span>Verified Vendors</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded bg-destructive/20 border border-destructive" />
                <span>Risk Anomalies</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
