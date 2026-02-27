'use client';

import { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_VENDORS } from '../lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ShieldAlert, Info, Search, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function VendorsPage() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'riskScore'>('riskScore');

  const filteredVendors = useMemo(() => {
    return MOCK_VENDORS
      .filter(v => 
        v.name.toLowerCase().includes(search.toLowerCase()) || 
        v.gstin.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortField === 'riskScore') return b.riskScore - a.riskScore;
        return a.name.localeCompare(b.name);
      });
  }, [search, sortField]);

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-2 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border pb-6 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Pramāṇa Compliance Module</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary">Vendor Intelligence Hub</h1>
          <p className="text-sm text-slate-500 font-medium">Statutory verification of taxpayer entities and risk profiling.</p>
        </div>
        <div className="flex gap-3 items-center">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
             <Input 
               placeholder="Search GSTIN or Name..." 
               className="pl-9 h-10 w-full sm:w-64 bg-white border-border rounded-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm" 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>
           <Button variant="outline" className="h-10 gap-2 border-border rounded-none bg-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
             <Filter className="h-4 w-4" /> Filter
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
         <div className="bg-white border p-6 shadow-sm border-t-4 border-t-primary">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Verified</p>
            <p className="text-3xl font-extrabold text-primary">{MOCK_VENDORS.length}</p>
         </div>
         <div className="bg-white border p-6 shadow-sm border-t-4 border-t-destructive">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Critical Priority</p>
            <p className="text-3xl font-extrabold text-destructive">{MOCK_VENDORS.filter(v => v.riskLevel === 'CRITICAL').length}</p>
         </div>
         <div className="bg-white border p-6 shadow-sm border-t-4 border-t-amber-500">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">High Risk</p>
            <p className="text-3xl font-extrabold text-amber-600">{MOCK_VENDORS.filter(v => v.riskLevel === 'HIGH').length}</p>
         </div>
         <div className="bg-white border p-6 shadow-sm border-t-4 border-t-green-600">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Avg Score</p>
            <p className="text-3xl font-extrabold text-slate-700">
              {Math.round(MOCK_VENDORS.reduce((a, b) => a + b.riskScore, 0) / MOCK_VENDORS.length)}
            </p>
         </div>
      </div>

      <Card className="rounded-none border shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50 py-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Verified Taxpayer Registry</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("text-[10px] font-bold uppercase tracking-widest h-8 px-3 rounded-none", sortField === 'name' && "bg-primary text-white hover:bg-primary/90")}
                onClick={() => setSortField('name')}
              >
                Sort Name
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("text-[10px] font-bold uppercase tracking-widest h-8 px-3 rounded-none", sortField === 'riskScore' && "bg-primary text-white hover:bg-primary/90")}
                onClick={() => setSortField('riskScore')}
              >
                Sort Score
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-b">
                <TableHead className="font-bold text-primary uppercase text-[10px] tracking-[0.15em] py-4">Entity Name</TableHead>
                <TableHead className="font-bold text-primary uppercase text-[10px] tracking-[0.15em]">GSTIN Node</TableHead>
                <TableHead className="text-center font-bold text-primary uppercase text-[10px] tracking-[0.15em]">Audit Score</TableHead>
                <TableHead className="font-bold text-primary uppercase text-[10px] tracking-[0.15em]">Compliance Status</TableHead>
                <TableHead className="text-right font-bold text-primary uppercase text-[10px] tracking-[0.15em] pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.gstin} className="hover:bg-slate-50 transition-colors border-b">
                  <TableCell className="font-bold text-sm py-5">{vendor.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{vendor.gstin}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      "text-sm font-bold px-2 py-1 border shadow-inner inline-block min-w-[3rem]",
                      vendor.riskScore > 75 ? "text-destructive border-destructive/20 bg-destructive/5" : 
                      vendor.riskScore > 50 ? "text-amber-600 border-amber-500/20 bg-amber-500/5" : "text-slate-600 border-slate-200"
                    )}>
                      {vendor.riskScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "rounded-none text-[9px] font-extrabold px-3 py-1 uppercase border tracking-widest",
                      vendor.riskLevel === 'CRITICAL' && "border-destructive text-destructive bg-destructive/5",
                      vendor.riskLevel === 'HIGH' && "border-amber-600 text-amber-600 bg-amber-600/5",
                      vendor.riskLevel === 'MEDIUM' && "border-slate-400 text-slate-600 bg-slate-50",
                      vendor.riskLevel === 'LOW' && "border-green-600 text-green-700 bg-green-50",
                    )}>
                      {vendor.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase rounded-none border-primary/20 hover:bg-primary hover:text-white transition-all">
                            View Details
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="bg-primary text-white border-none rounded-none p-4 max-w-xs shadow-xl">
                          <div className="space-y-2">
                            <p className="font-bold text-[10px] uppercase tracking-widest text-white/60">Risk Rationale</p>
                            <p className="text-xs leading-relaxed font-medium">System detected a mismatch in tax remittance vs reported liability for the JAN-24 period. High network centrality identified with {vendor.networkMetrics?.degreeCentrality} connected nodes.</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
              {filteredVendors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-24 text-center text-muted-foreground italic font-medium uppercase text-[10px] tracking-widest">
                    No taxpayer records found matching query: "{search}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="bg-primary/5 border border-primary/10 p-6 rounded-none flex gap-4 shadow-sm">
         <ShieldAlert className="h-6 w-6 text-primary shrink-0" />
         <div className="space-y-1">
            <p className="text-sm font-bold text-primary uppercase tracking-wider">Regulatory Verification Notice</p>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Risk scores are generated using deterministic graph traversal and statistical anomaly detection algorithms. These figures serve as decision-support metrics and must be verified against primary statutory documents.
            </p>
         </div>
      </div>
    </div>
  );
}