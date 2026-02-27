'use client';

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
import { ShieldAlert, Info, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function VendorsPage() {
  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-2 duration-500 pb-10">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Pramāṇa Compliance Module</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary">Vendor Intelligence Hub</h1>
        </div>
        <div className="flex gap-4 items-center">
           <div className="relative">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input placeholder="Search GSTIN..." className="pl-9 h-10 w-64 bg-white border-border rounded-sm" />
           </div>
           <Button variant="outline" className="h-10 gap-2 border-border rounded-sm"><Filter className="h-4 w-4" /> Filter Risk</Button>
        </div>
      </div>

      <Card className="rounded-sm border shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-muted/20 py-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Verified Taxpayer Records</CardTitle>
            <div className="flex gap-4">
              <span className="text-[10px] font-bold">Total: {MOCK_VENDORS.length}</span>
              <span className="text-[10px] font-bold text-destructive">Critical Priority: {MOCK_VENDORS.filter(v => v.riskLevel === 'CRITICAL').length}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/5">
              <TableRow className="border-b">
                <TableHead className="font-bold text-primary uppercase text-[10px] tracking-widest">Entity Name</TableHead>
                <TableHead className="font-bold text-primary uppercase text-[10px] tracking-widest">GSTIN Node</TableHead>
                <TableHead className="text-center font-bold text-primary uppercase text-[10px] tracking-widest">Audit Score</TableHead>
                <TableHead className="font-bold text-primary uppercase text-[10px] tracking-widest">Compliance Status</TableHead>
                <TableHead className="text-right font-bold text-primary uppercase text-[10px] tracking-widest">Verification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_VENDORS.map((vendor) => (
                <TableRow key={vendor.gstin} className="hover:bg-muted/30 transition-colors border-b">
                  <TableCell className="font-bold text-sm py-5">{vendor.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{vendor.gstin}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      "text-sm font-bold",
                      vendor.riskScore > 75 ? "text-destructive" : vendor.riskScore > 50 ? "text-amber-600" : "text-slate-600"
                    )}>
                      {vendor.riskScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "rounded-sm text-[9px] font-extrabold px-3 py-1 uppercase border tracking-widest",
                      vendor.riskLevel === 'CRITICAL' && "border-destructive text-destructive bg-destructive/5",
                      vendor.riskLevel === 'HIGH' && "border-amber-600 text-amber-600 bg-amber-600/5",
                      vendor.riskLevel === 'MEDIUM' && "border-slate-400 text-slate-600 bg-slate-50",
                      vendor.riskLevel === 'LOW' && "border-green-600 text-green-700 bg-green-50",
                    )}>
                      {vendor.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Info className="h-4 w-4 opacity-50" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="bg-primary text-white border-none rounded-sm p-4 max-w-xs">
                          <div className="space-y-1">
                            <p className="font-bold text-[10px] uppercase tracking-widest text-white/60">Risk Rationale</p>
                            <p className="text-xs leading-relaxed">System detected a mismatch in tax remittance vs reported liability for the JAN-24 period. High network centrality identified.</p>
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
      
      <div className="bg-primary/5 border border-primary/10 p-6 rounded-sm flex gap-4">
         <ShieldAlert className="h-6 w-6 text-primary shrink-0" />
         <div className="space-y-1">
            <p className="text-sm font-bold text-primary">Regulatory Disclaimer</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Risk scores are generated using deterministic graph traversal and statistical anomaly detection algorithms. These figures serve as decision-support metrics and must be verified against statutory documents.
            </p>
         </div>
      </div>
    </div>
  );
}