'use client';

import React, { useEffect } from 'react';
import { X, Building2, IndianRupee, Zap, ShieldCheck, FileText, Calendar, Hash } from 'lucide-react';
import { Vendor, Invoice } from '@/domain/models/entities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CompanyTransactionPanelProps {
  vendor: Vendor;
  invoices: Invoice[];
  onClose: () => void;
}

export function CompanyTransactionPanel({ vendor, invoices, onClose }: CompanyTransactionPanelProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const totalValue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalTax = invoices.reduce((acc, inv) => acc + (inv.cgst + inv.sgst + inv.igst), 0);
  const itcClaimed = invoices.reduce((acc, inv) => acc + (inv.itcClaimed || 0), 0);
  const avgCoverage = invoices.length > 0 
    ? (invoices.reduce((acc, inv) => acc + (inv.paymentCoverageRatio || 0), 0) / invoices.length) * 100 
    : 0;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-[100] border-l-4 border-l-primary flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-primary text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded bg-white/10 flex items-center justify-center border border-white/20">
            <Building2 className="h-6 w-6 text-accent" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight">{vendor.name}</h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-white/60 uppercase tracking-widest">{vendor.gstin}</span>
              <div className="h-1 w-1 rounded-full bg-white/40" />
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{vendor.registrationType || 'REGULAR'}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10 rounded-none">
          <X className="h-6 w-6" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-8 space-y-10">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-none space-y-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Transactions</p>
              <p className="text-xl font-black text-primary">{invoices.length}</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-none space-y-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Value</p>
              <p className="text-lg font-black text-primary">₹{(totalValue / 100000).toFixed(2)}L</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-none space-y-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Risk Score</p>
              <p className={cn(
                "text-xl font-black",
                vendor.riskScore > 75 ? "text-destructive" : vendor.riskScore > 50 ? "text-amber-600" : "text-accent"
              )}>{vendor.riskScore}/100</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-none space-y-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Compliance</p>
              <p className="text-xs font-bold text-slate-700">{avgCoverage.toFixed(0)}% COVERAGE</p>
            </div>
          </div>

          {/* Statutory Metrics */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Statutory Aggregate Metrics
            </h3>
            <div className="border border-slate-200 divide-y divide-slate-100 rounded-none overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-white hover:bg-slate-50 transition-colors">
                <span className="text-xs font-bold text-slate-500 uppercase">Tax Liability Identified</span>
                <span className="font-mono font-bold text-primary">₹{totalTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white hover:bg-slate-50 transition-colors">
                <span className="text-xs font-bold text-slate-500 uppercase">ITC Claimed by Recipient</span>
                <span className="font-mono font-bold text-accent">₹{itcClaimed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white hover:bg-slate-50 transition-colors">
                <span className="text-xs font-bold text-slate-500 uppercase">Risk Classification</span>
                <Badge variant="outline" className={cn(
                  "rounded-none text-[9px] font-black uppercase border tracking-widest",
                  vendor.riskLevel === 'CRITICAL' ? "border-destructive text-destructive bg-destructive/5" : "border-primary text-primary"
                )}>
                  {vendor.riskLevel} PRIORITY
                </Badge>
              </div>
            </div>
          </section>

          {/* Transaction Table */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Transaction History Log
            </h3>
            <div className="border border-slate-200 rounded-none overflow-hidden shadow-inner">
              <Table>
                <TableHeader className="bg-slate-100">
                  <TableRow className="border-b border-slate-200">
                    <TableHead className="text-[9px] font-black uppercase py-4">Invoice</TableHead>
                    <TableHead className="text-[9px] font-black uppercase">Statutory Value</TableHead>
                    <TableHead className="text-[9px] font-black uppercase">ITC Status</TableHead>
                    <TableHead className="text-[9px] font-black uppercase text-right">Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id} className="hover:bg-slate-50 group border-b border-slate-100 last:border-0">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-primary">{inv.invoiceNumber}</span>
                          <span className="text-[9px] text-slate-400 font-medium">
                            {inv.invoiceDate.toLocaleDateString('en-IN', { dateStyle: 'short' })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-slate-700">
                        ₹{inv.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "rounded-none text-[8px] font-bold uppercase px-2 h-5",
                          inv.status === 'MATCHED' ? "border-accent text-accent bg-accent/5" : "border-destructive text-destructive bg-destructive/5"
                        )}>
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={cn(
                          "inline-flex h-2 w-2 rounded-full",
                          inv.riskScore > 80 ? "bg-destructive animate-pulse" : inv.riskScore > 50 ? "bg-amber-500" : "bg-green-500"
                        )} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {invoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
                        No transactions found in this jurisdiction.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </div>
      </ScrollArea>

      <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">Deterministic statutory evidence log</p>
        <Button className="h-10 rounded-none bg-primary text-white font-bold text-[10px] uppercase tracking-widest shadow-md hover:bg-primary/90">
          Open Full Dossier
        </Button>
      </div>
    </div>
  );
}
