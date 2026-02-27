'use client';

import { useState, useMemo } from 'react';
import { MOCK_INVOICES, MOCK_VENDORS } from '@/app/lib/mock-data';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ShieldAlert, ArrowRight, Activity, FileText } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function InvestigationsListPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredInvoices = useMemo(() => {
    return MOCK_INVOICES.filter(inv => {
      const vendor = MOCK_VENDORS.find(v => v.gstin === inv.vendorGstin);
      const searchStr = `${inv.id} ${inv.invoiceNumber} ${vendor?.name || ''} ${inv.vendorGstin}`.toLowerCase();
      const matchesSearch = searchStr.includes(search.toLowerCase());
      const matchesStatus = filterStatus ? inv.status === filterStatus : true;
      return matchesSearch && matchesStatus;
    });
  }, [search, filterStatus]);

  const stats = useMemo(() => {
    const flagged = MOCK_INVOICES.filter(i => i.status === 'FLAGGED').length;
    const critical = MOCK_INVOICES.filter(i => i.riskScore > 85).length;
    const matchedCount = MOCK_INVOICES.filter(i => i.status === 'MATCHED').length;
    return { flagged, critical, matchedCount };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1 border-b border-slate-200 pb-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">Case Management Center</h1>
        <p className="text-muted-foreground font-medium">Active investigations and flagged transaction review using Pramāṇa intelligence.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white border p-6 shadow-sm border-t-4 border-t-destructive">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Flagged for Review</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-destructive">{stats.flagged}</span>
            <span className="text-[10px] text-muted-foreground font-bold mb-1.5">CASES PENDING</span>
          </div>
        </div>
        <div className="bg-white border p-6 shadow-sm border-t-4 border-t-primary">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Critical Priority</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-primary">{stats.critical}</span>
            <span className="text-[10px] text-muted-foreground font-bold mb-1.5">SCORE > 85</span>
          </div>
        </div>
        <div className="bg-white border p-6 shadow-sm border-t-4 border-t-accent">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Matched (Verified)</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-accent">{stats.matchedCount}</span>
            <span className="text-[10px] text-muted-foreground font-bold mb-1.5">AUTO-RESOLVED</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 border shadow-inner">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search Case, GSTIN, or Vendor..." 
            className="pl-9 bg-white border-border rounded-none shadow-sm h-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
           <Button 
            variant={filterStatus === null ? "default" : "outline"} 
            className="h-10 text-[10px] font-bold uppercase tracking-widest rounded-none"
            onClick={() => setFilterStatus(null)}
           >
            All
           </Button>
           <Button 
            variant={filterStatus === 'FLAGGED' ? "default" : "outline"} 
            className="h-10 text-[10px] font-bold uppercase tracking-widest rounded-none border-destructive/20 text-destructive hover:bg-destructive hover:text-white"
            onClick={() => setFilterStatus('FLAGGED')}
           >
            Flagged
           </Button>
           <Button 
            variant={filterStatus === 'MATCHED' ? "default" : "outline"} 
            className="h-10 text-[10px] font-bold uppercase tracking-widest rounded-none border-accent/20 text-accent hover:bg-accent hover:text-white"
            onClick={() => setFilterStatus('MATCHED')}
           >
            Matched
           </Button>
        </div>
      </div>

      <Card className="rounded-none border shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[150px] font-bold text-primary uppercase text-[10px] tracking-widest py-4">Invoice ID</TableHead>
              <TableHead className="font-bold text-primary uppercase text-[10px] tracking-widest">Vendor Context</TableHead>
              <TableHead className="font-bold text-primary uppercase text-[10px] tracking-widest">Filing Date</TableHead>
              <TableHead className="text-right font-bold text-primary uppercase text-[10px] tracking-widest">Statutory Value</TableHead>
              <TableHead className="text-center font-bold text-primary uppercase text-[10px] tracking-widest">Risk Index</TableHead>
              <TableHead className="font-bold text-primary uppercase text-[10px] tracking-widest">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => {
              const vendor = MOCK_VENDORS.find(v => v.gstin === invoice.vendorGstin);
              return (
                <TableRow key={invoice.id} className="hover:bg-slate-50 group border-b">
                  <TableCell className="font-mono text-xs font-bold text-slate-700">{invoice.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-primary">{vendor?.name || 'Unknown Entity'}</span>
                      <span className="text-[10px] text-muted-foreground font-mono font-bold">{invoice.vendorGstin}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-600">
                    {invoice.invoiceDate.toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </TableCell>
                  <TableCell className="text-right font-bold font-mono">
                    ₹{invoice.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className={cn(
                      "inline-flex items-center justify-center h-8 w-8 border font-bold text-xs",
                      invoice.riskScore > 80 ? "bg-destructive/10 text-destructive border-destructive/20" : 
                      invoice.riskScore > 50 ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-accent/10 text-accent border-accent/20"
                    )}>
                      {invoice.riskScore}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Link href={`/investigate/${invoice.id}`}>
                      <Button variant="outline" size="sm" className="h-8 gap-2 text-[10px] font-bold uppercase tracking-widest rounded-none border-primary/20 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        Solve Case <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredInvoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-24 text-center text-muted-foreground italic font-medium uppercase text-[10px] tracking-widest">
                  No cases found matching criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      
      <div className="flex items-center justify-center gap-6 py-6 opacity-40 grayscale pointer-events-none">
        <FileText className="h-8 w-8" />
        <Activity className="h-8 w-8" />
        <ShieldAlert className="h-8 w-8" />
        <div className="h-px flex-1 bg-slate-300" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">System Monitoring Hub: ACTIVE</span>
      </div>
    </div>
  );
}