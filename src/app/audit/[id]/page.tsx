
'use client';

import { useParams } from 'next/navigation';
import { MOCK_INVOICES, MOCK_VENDORS } from '@/app/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Printer, 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  Network,
  Calendar,
  Fingerprint,
  Stamp
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function AuditReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const auditData = useMemo(() => {
    const isCluster = id.startsWith('FRAUD-RING');
    let title = "Statutory Evidence Log";
    let invoices = [];
    let totalMismatch = 0;

    if (isCluster) {
      invoices = MOCK_INVOICES.filter(inv => inv.flags?.includes('CIRCULAR_TRADING_LOOP'));
      title = `Fraud Cluster Audit: ${id}`;
      totalMismatch = invoices.length * 18000; // Simulated logic
    } else {
      const inv = MOCK_INVOICES.find(i => i.id === id);
      if (inv) invoices = [inv];
      title = `Transaction Audit: ${id}`;
    }

    return { title, invoices, totalMismatch, isCluster };
  }, [id]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto space-y-6 no-print">
        <div className="flex items-center justify-between">
          <Link href="/analytics">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Intelligence
            </Button>
          </Link>
          <Button variant="default" size="sm" className="gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print Report
          </Button>
        </div>
      </div>

      {/* Audit Document */}
      <Card className="max-w-4xl mx-auto mt-8 bg-white text-slate-900 shadow-2xl overflow-hidden print:shadow-none print:mt-0">
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">P</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Pramāṇa Audit Service</h1>
            </div>
            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Deterministic Graph Intelligence Output</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs font-bold text-slate-400">REPORT NO.</p>
            <p className="font-mono text-lg">{id?.toUpperCase() || 'AUD-000'}</p>
          </div>
        </div>

        <CardContent className="p-12 space-y-10 relative">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
             <ShieldCheck className="w-[500px] h-[500px]" />
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Audit Generation Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <p>{new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Verification Fingerprint</p>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <Fingerprint className="h-4 w-4 text-slate-500" />
                  <p>SHA256: 8f9a2c...e41d8b2</p>
                </div>
              </div>
            </div>
            <div className="text-right flex flex-col items-end justify-center">
               <div className="p-4 border-2 border-slate-900 rounded bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-500 mb-1">CERTIFICATION STATUS</p>
                  <div className="flex items-center gap-2 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                    <span className="font-bold tracking-tight">VERIFIED EVIDENCE</span>
                  </div>
               </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-500" />
              Executive Summary
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">
              The Pramāṇa Intelligence engine has completed a deterministic traversal of the Knowledge Graph for the subject identified as <span className="font-bold">{id}</span>. Based on the relationship topology and statutory filing cross-references, the system has identified a high-probability risk cluster involving multiple shell entities and circular trading patterns.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Network className="h-5 w-5 text-slate-500" />
              Graph Traversal Evidence
            </h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">Entity Ref</th>
                    <th className="px-4 py-3 text-left">Observed Action</th>
                    <th className="px-4 py-3 text-right">Statutory Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {auditData.invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="px-4 py-3">
                        <p className="font-bold">{inv.id}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{inv.vendorGstin}</p>
                      </td>
                      <td className="px-4 py-3 italic text-slate-600 uppercase text-[10px]">
                        ISSUED -> REPORTED -> UNPAID
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold">
                        ₹{inv.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t">
                  <tr>
                    <td colSpan={2} className="px-4 py-3 text-right text-destructive">ESTIMATED TAX EVASION / MISMATCH</td>
                    <td className="px-4 py-3 text-right text-destructive font-mono">
                      ₹{auditData.totalMismatch.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Statutory Non-Compliance Flags
            </h2>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-destructive/5 border border-destructive/10 rounded">
                  <p className="font-bold text-xs uppercase mb-1">Pramāṇa Error 401</p>
                  <p className="text-xs text-slate-600 italic">Chain Break: Upstream vendor payment node missing in GSTR-3B filings for JAN-2024.</p>
               </div>
               <div className="p-4 bg-destructive/5 border border-destructive/10 rounded">
                  <p className="font-bold text-xs uppercase mb-1">Pramāṇa Error 702</p>
                  <p className="text-xs text-slate-600 italic">Circular Loop: Transaction path returns to Originating Entity within 15 days without value addition.</p>
               </div>
            </div>
          </section>

          <div className="pt-20 flex justify-between items-end border-t border-slate-100">
             <div className="space-y-2 opacity-50">
               <Stamp className="h-16 w-16" />
               <p className="text-[8px] font-mono">DIGITAL AUTHENTICATION CODE: 0X991A...B22C</p>
             </div>
             <div className="text-center space-y-1">
               <div className="w-48 border-b-2 border-slate-900 mx-auto mb-2"></div>
               <p className="font-bold text-sm">Automated Compliance Officer</p>
               <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Pramāṇa Intelligence Node</p>
             </div>
          </div>
        </CardContent>

        <div className="bg-slate-50 p-6 text-center text-[10px] text-slate-400 font-bold border-t italic">
          Disclaimer: This is a deterministic evidence log generated from graph analytics. It is intended for statutory compliance review.
        </div>
      </Card>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background-color: white !important; }
          main { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}
