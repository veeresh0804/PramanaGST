'use client';

import React, { useEffect, useState } from 'react';
import { X, Building2, Zap, ShieldCheck, FileText, ShieldAlert, GitBranch, ArrowUpRight, CheckCircle2 } from 'lucide-react';
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
  
  // Calculate Ratios for display
  const totalPaid = invoices.reduce((acc, inv) => acc + ((inv.cgst + inv.sgst + inv.igst) * (inv.paymentCoverageRatio || 0)), 0);
  const coverageRatio = totalTax > 0 ? (totalPaid / totalTax) * 100 : 100;
  const itcRatio = totalTax > 0 ? (itcClaimed / totalTax) * 100 : 0;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-[100] border-l-4 border-l-primary flex flex-col animate-in slide-in-from-right duration-300">
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
              <Badge className="bg-white/10 text-white rounded-none border-none text-[8px] font-black">{vendor.registrationType || 'REGULAR'}</Badge>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10 rounded-none">
          <X className="h-6 w-6" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-8 space-y-10">
          
          {/* Risk Factors Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                Compliance Scorecard
              </h3>
              <Badge variant="outline" className={cn(
                "rounded-none text-[9px] font-black uppercase tracking-widest px-3 h-6",
                vendor.riskLevel === 'CRITICAL' ? "border-destructive text-destructive bg-destructive/5" :
                vendor.riskLevel === 'HIGH' ? "border-amber-600 text-amber-600 bg-amber-600/5" : "border-primary text-primary"
              )}>
                {vendor.riskLevel} PRIORITY
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-slate-100 bg-slate-50 space-y-2">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Payment Coverage</p>
                <div className="flex items-center justify-between">
                   <span className={cn("text-xl font-black", coverageRatio < 50 ? "text-destructive" : "text-primary")}>
                     {coverageRatio.toFixed(0)}%
                   </span>
                   {coverageRatio < 50 && <ShieldAlert className="h-4 w-4 text-destructive" />}
                </div>
              </div>
              <div className="p-4 border border-slate-100 bg-slate-50 space-y-2">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ITC Claim Ratio</p>
                <div className="flex items-center justify-between">
                   <span className={cn("text-xl font-black", itcRatio > 100 ? "text-destructive" : "text-accent")}>
                     {itcRatio.toFixed(0)}%
                   </span>
                   {itcRatio > 100 && <ArrowUpRight className="h-4 w-4 text-destructive" />}
                </div>
              </div>
              <div className="p-4 border border-slate-100 bg-slate-50 space-y-2">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Network Risk</p>
                <div className="flex items-center justify-between">
                   <span className="text-xl font-black text-primary">
                     {vendor.networkMetrics?.clusterRisk ? (vendor.networkMetrics.clusterRisk * 100).toFixed(0) : 0}%
                   </span>
                   <GitBranch className="h-4 w-4 text-slate-300" />
                </div>
              </div>
              <div className="p-4 border border-slate-100 bg-slate-50 space-y-2">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Composite Risk</p>
                <div className="flex items-center justify-between">
                   <span className="text-xl font-black text-slate-700">{vendor.riskScore}/100</span>
                   <ShieldCheck className="h-4 w-4 text-slate-300" />
                </div>
              </div>
            </div>
          </div>

          <section className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Transaction Audit Log
            </h3>
            <div className="border border-slate-200 rounded-none overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-[9px] font-black uppercase py-4">Invoice Ref</TableHead>
                    <TableHead className="text-[9px] font-black uppercase text-right">Value (₹)</TableHead>
                    <TableHead className="text-[9px] font-black uppercase text-center">Coverage</TableHead>
                    <TableHead className="text-[9px] font-black uppercase text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-primary">{inv.invoiceNumber}</span>
                          <span className="text-[8px] text-slate-400 font-mono">{inv.invoiceDate.toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-bold">
                        {inv.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn(
                          "rounded-none text-[8px] font-bold uppercase h-5",
                          (inv.paymentCoverageRatio || 0) < 0.5 ? "border-destructive text-destructive bg-destructive/5" : "border-green-600 text-green-600 bg-green-50"
                        )}>
                          {((inv.paymentCoverageRatio || 0) * 100).toFixed(0)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {inv.status === 'MATCHED' ? <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" /> : <ShieldAlert className="h-4 w-4 text-destructive ml-auto" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </div>
      </ScrollArea>
      
      <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">Statutory Decision Support Output</p>
        <Button className="h-10 rounded-none bg-primary text-white font-bold text-[10px] uppercase tracking-widest shadow-md">
          Download Full Report
        </Button>
      </div>
    </div>
  );
}