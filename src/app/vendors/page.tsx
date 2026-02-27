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
import { MOCK_VENDORS, MOCK_INVOICES } from '../lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ShieldAlert, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CompanyTransactionPanel } from '../graph/company-transaction-panel';
import { Vendor } from '@/domain/models/entities';

export default function VendorsPage() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'riskScore'>('riskScore');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

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

  const vendorInvoices = useMemo(() => {
    if (!selectedVendor) return [];
    return MOCK_INVOICES.filter(inv => inv.vendorGstin === selectedVendor.gstin || inv.recipientGstin === selectedVendor.gstin);
  }, [selectedVendor]);

  const handleViewDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsPanelOpen(true);
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-destructive border-destructive/20 bg-destructive/5";
    if (score >= 60) return "text-amber-600 border-amber-500/20 bg-amber-500/5";
    if (score >= 40) return "text-primary border-primary/20 bg-primary/5";
    return "text-green-600 border-green-200 bg-green-50";
  };

  const getRiskLabel = (score: number) => {
    if (score >= 80) return "CRITICAL";
    if (score >= 60) return "HIGH";
    if (score >= 40) return "WATCHLIST";
    return "LOW";
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-2 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border pb-6 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Pramāṇa Compliance Module</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary">Vendor Intelligence Hub</h1>
          <p className="text-sm text-slate-500 font-medium">Multi-factor compliance analysis: Payment (40%), ITC (30%), Network (20%), IRN (10%).</p>
        </div>
        <div className="flex gap-3 items-center">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
             <Input 
               placeholder="Search GSTIN or Name..." 
               className="pl-9 h-10 w-full sm:w-64 bg-white border-border rounded-none shadow-sm" 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>
           <Button variant="outline" className="h-10 gap-2 border-border rounded-none bg-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
             <Filter className="h-4 w-4" /> Filter
           </Button>
        </div>
      </div>

      <Card className="rounded-none border shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50 py-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Compliance Scoring Ledger</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("text-[10px] font-bold uppercase tracking-widest h-8 px-3 rounded-none", sortField === 'name' && "bg-primary text-white")}
                onClick={() => setSortField('name')}
              >
                By Name
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("text-[10px] font-bold uppercase tracking-widest h-8 px-3 rounded-none", sortField === 'riskScore' && "bg-primary text-white")}
                onClick={() => setSortField('riskScore')}
              >
                By Risk
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-bold text-primary uppercase text-[10px] tracking-widest py-4">Entity Name</TableHead>
                <TableHead className="font-bold text-primary uppercase text-[10px] tracking-widest">GSTIN Node</TableHead>
                <TableHead className="text-center font-bold text-primary uppercase text-[10px] tracking-widest">Audit Score</TableHead>
                <TableHead className="font-bold text-primary uppercase text-[10px] tracking-widest">Risk Category</TableHead>
                <TableHead className="text-right font-bold text-primary uppercase text-[10px] tracking-widest pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.gstin} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-bold text-sm py-5">{vendor.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{vendor.gstin}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      "text-sm font-bold px-2 py-1 border shadow-inner inline-block min-w-[3rem]",
                      getRiskColor(vendor.riskScore)
                    )}>
                      {vendor.riskScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "rounded-none text-[9px] font-black px-3 py-1 uppercase border tracking-widest",
                      getRiskColor(vendor.riskScore)
                    )}>
                      {getRiskLabel(vendor.riskScore)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-[10px] font-bold uppercase rounded-none border-primary/20 hover:bg-primary hover:text-white"
                            onClick={() => handleViewDetails(vendor)}
                          >
                            View Case
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="bg-primary text-white border-none rounded-none p-4 max-w-xs">
                          <div className="space-y-2">
                            <p className="font-bold text-[10px] uppercase tracking-widest text-white/60">Risk Attribution</p>
                            <p className="text-xs font-medium">Payment Risk weighted at 40%. Loop involvement contributes +15% to network exposure.</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="p-6 bg-slate-900 text-white rounded-none flex gap-6 shadow-xl relative overflow-hidden">
         <ShieldAlert className="h-10 w-10 text-accent shrink-0" />
         <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Auditor Notice</p>
            <p className="text-sm font-black tracking-tight">Multi-Factor Risk Model 2.0 Enabled</p>
            <p className="text-[11px] text-white/60 leading-relaxed font-medium">
              Scores reflect 3-period rolling metrics. <strong>Payment Risk</strong> is primary. <strong>Network Risk</strong> is secondary. <strong>IRN/ITC</strong> act as compliance boosters.
            </p>
         </div>
      </div>

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