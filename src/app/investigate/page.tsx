
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
import { Search, Filter, ShieldAlert, ArrowRight, Activity } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function InvestigationsListPage() {
  const [search, setSearch] = useState('');

  const filteredInvoices = useMemo(() => {
    return MOCK_INVOICES.filter(inv => {
      const vendor = MOCK_VENDORS.find(v => v.gstin === inv.vendorGstin);
      const searchStr = `${inv.id} ${inv.invoiceNumber} ${vendor?.name || ''} ${inv.vendorGstin}`.toLowerCase();
      return searchStr.includes(search.toLowerCase());
    });
  }, [search]);

  const stats = useMemo(() => {
    const flagged = MOCK_INVOICES.filter(i => i.status === 'FLAGGED').length;
    const critical = MOCK_INVOICES.filter(i => i.riskScore > 85).length;
    return { flagged, critical };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Case Management</h1>
        <p className="text-muted-foreground">Active investigations and flagged transaction review using Pramāṇa intelligence.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card/50 border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Flagged Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats.flagged}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Pending manual verification</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border border-primary/20 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Critical Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.critical}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Score &gt; 85/100</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-secondary">Matched Batch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">
              {MOCK_INVOICES.filter(i => i.status === 'MATCHED').length}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Deterministic reconciliation</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search Invoice, GSTIN, or Vendor..." 
            className="pl-8 bg-card/50" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filter Status
        </Button>
      </div>

      <Card className="bg-card/50 border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/10">
            <TableRow>
              <TableHead className="w-[150px]">Invoice ID</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Risk</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => {
              const vendor = MOCK_VENDORS.find(v => v.gstin === invoice.vendorGstin);
              return (
                <TableRow key={invoice.id} className="hover:bg-muted/5 group">
                  <TableCell className="font-mono text-xs">{invoice.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{vendor?.name || 'Unknown'}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{invoice.vendorGstin}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {invoice.invoiceDate.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ₹{invoice.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn(
                      "text-[10px]",
                      invoice.riskScore > 80 ? "text-destructive border-destructive/20" : 
                      invoice.riskScore > 50 ? "text-amber-500 border-amber-500/20" : "text-secondary border-secondary/20"
                    )}>
                      {invoice.riskScore}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "text-[10px] font-bold uppercase",
                      invoice.status === 'FLAGGED' ? "bg-destructive/10 text-destructive border-destructive/20" :
                      invoice.status === 'MATCHED' ? "bg-secondary/10 text-secondary border-secondary/20" :
                      "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/investigate/${invoice.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        Investigate <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
      
      <p className="text-center text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold pb-8">
        Pramāṇa System Node Status: Online • {filteredInvoices.length} Records Loaded
      </p>
    </div>
  );
}
