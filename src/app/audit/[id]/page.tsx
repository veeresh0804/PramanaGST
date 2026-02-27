'use client';

import { useParams } from 'next/navigation';
import { MOCK_INVOICES } from '@/app/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Printer, 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  Network,
  Calendar,
  Fingerprint,
  Stamp,
  CheckCircle2,
  Lock,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function AuditReportPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [signTimestamp, setSignTimestamp] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDigitalSignature = () => {
    setIsSigning(true);
    // Simulate Aadhaar e-Sign / HSM signing process
    setTimeout(() => {
      setIsSigning(false);
      setIsSigned(true);
      setSignTimestamp(new Date().toISOString());
      toast({
        title: "Digital Signature Applied",
        description: "Report has been cryptographically signed by the Authorized Compliance Officer.",
      });
    }, 2000);
  };

  const auditData = useMemo(() => {
    let title = "Statutory Evidence Log";
    let invoices = [];
    let totalMismatch = 0;
    let issues = [
      { code: 'ERR-401', title: 'Chain Break', desc: 'Upstream vendor payment node missing in GSTR-3B filings.' },
      { code: 'ERR-702', title: 'Circular Loop', desc: 'Transaction path returns to Originating Entity without value addition.' }
    ];

    if (id === 'FRAUD-RING-72') {
      invoices = MOCK_INVOICES.filter(inv => inv.flags?.includes('CIRCULAR_TRADING_LOOP'));
      title = `Fraud Cluster Audit: Shell Network Alpha-Gamma`;
      totalMismatch = 3540000;
      issues = [
        { code: 'ERR-702', title: 'Circular Trading Loop', desc: 'Multi-node network identified where tax credits are cycling without commercial substance.' },
        { code: 'ERR-905', title: 'High-Velocity Trading', desc: 'Transaction volume exceeds reported operational capacity of involved shell nodes.' }
      ];
    } else if (id === 'FRAUD-RING-91') {
      invoices = MOCK_INVOICES.filter(inv => inv.id === 'INV-2024-003' || inv.flags?.includes('ITC_CHAIN_BROKEN'));
      title = `Fraud Cluster Audit: Zenith & ABC Cluster Analysis`;
      totalMismatch = 272000;
      issues = [
        { code: 'ERR-401', title: 'ITC Chain Break', desc: 'Direct upstream supplier (Zenith) has failed to remit tax liability for the reported period.' },
        { code: 'ERR-302', title: 'GSTR-2B Mismatch', desc: 'Recipient claiming ITC on invoices not present in the portal-generated 2B dataset.' }
      ];
    } else if (id === 'FRAUD-RING-105') {
      invoices = MOCK_INVOICES.filter(i => i.vendorGstin === '07KJHGF9876M1Z2' && i.status === 'PARTIAL_MATCH');
      title = `Transaction Audit: Nexus Supply Chain Cluster`;
      totalMismatch = 35400;
      issues = [
        { code: 'ERR-V105', title: 'Partial Statutory Match', desc: 'GSTR-1 exists but tax payment evidence is only partially recorded.' }
      ];
    } else {
      const inv = MOCK_INVOICES.find(i => i.id === id);
      if (inv) {
        invoices = [inv];
        title = `Transaction Audit: ${inv.id}`;
        totalMismatch = inv.riskScore > 70 ? inv.totalAmount * 0.18 : 0;
        if (inv.flags && inv.flags.length > 0) {
          issues = inv.flags.map((f, idx) => ({
            code: `ERR-V${100 + idx}`,
            title: f.replace(/_/g, ' '),
            desc: 'Specific risk marker triggered by graph relationship traversal.'
          }));
        }
      } else {
        title = "Audit Not Found";
      }
    }
    return { title, invoices, totalMismatch, issues };
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
          <div className="flex gap-2">
            {!isSigned ? (
              <Button 
                variant="default" 
                size="sm" 
                className="gap-2 bg-accent hover:bg-accent/90" 
                onClick={handleDigitalSignature}
                disabled={isSigning}
              >
                {isSigning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                {isSigning ? "Verifying..." : "Verify with Digital Signature"}
              </Button>
            ) : (
              <Badge className="bg-green-600 text-white gap-1.5 py-1.5 px-3 rounded-none">
                <CheckCircle2 className="h-3.5 w-3.5" /> Digitally Signed
              </Badge>
            )}
            <Button variant="outline" size="sm" className="gap-2 bg-white" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Print Report
            </Button>
          </div>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto mt-8 bg-white text-slate-900 shadow-2xl overflow-hidden print:shadow-none print:mt-0">
        <div className="bg-primary p-8 text-white flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-white flex items-center justify-center">
                <span className="text-primary font-bold">P</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Pramāṇa Audit Service</h1>
            </div>
            <p className="text-white/60 text-xs uppercase tracking-widest font-bold">Deterministic Graph Intelligence Output</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs font-bold text-white/60">REPORT NO.</p>
            <p className="font-mono text-lg">{id?.toUpperCase() || 'AUD-000'}</p>
          </div>
        </div>

        <CardContent className="p-12 space-y-10 relative">
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
               <div className={cn(
                 "p-4 border-2 rounded bg-slate-50",
                 isSigned ? "border-green-600" : "border-slate-900"
               )}>
                  <p className="text-[10px] font-bold text-slate-500 mb-1">CERTIFICATION STATUS</p>
                  <div className={cn("flex items-center gap-2", isSigned ? "text-green-600" : "text-primary")}>
                    {isSigned ? <CheckCircle2 className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                    <span className="font-bold tracking-tight">{isSigned ? "CERTIFIED E-SIGN" : "VERIFIED EVIDENCE"}</span>
                  </div>
                  {isSigned && <p className="text-[8px] font-mono mt-1 opacity-60">TS: {signTimestamp}</p>}
               </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-primary">
              <FileText className="h-5 w-5 text-slate-500" />
              Executive Summary
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">
              The Pramāṇa Intelligence engine has completed a deterministic traversal of the Knowledge Graph for the subject: <span className="font-bold">{auditData.title}</span>. Evidence traversal indicates specific risk propagation paths in the inbound supply chain.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Network className="h-5 w-5 text-slate-500" />
              Graph Traversal Evidence
            </h2>
            <div className="border border-slate-200 rounded-none overflow-hidden">
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
                        ISSUED {"->"} REPORTED {"->"} {inv.paymentCoverageRatio === 0 ? 'UNPAID' : inv.paymentCoverageRatio < 1 ? 'PARTIAL' : 'PAID'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold">
                        ₹{inv.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {auditData.invoices.length > 0 && (
                  <tfoot className="bg-slate-50 font-bold border-t">
                    <tr>
                      <td colSpan={2} className="px-4 py-3 text-right text-destructive">ESTIMATED TAX EVASION / MISMATCH</td>
                      <td className="px-4 py-3 text-right text-destructive font-mono">
                        ₹{auditData.totalMismatch.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Statutory Non-Compliance Flags
            </h2>
            <div className="grid grid-cols-2 gap-4">
               {auditData.issues.map((issue, idx) => (
                 <div key={idx} className="p-4 bg-destructive/5 border border-destructive/10">
                    <p className="font-bold text-xs uppercase mb-1">Pramāṇa {issue.code}</p>
                    <p className="text-sm font-bold text-slate-800 mb-1">{issue.title}</p>
                    <p className="text-xs text-slate-600 italic">{issue.desc}</p>
                 </div>
               ))}
            </div>
          </section>

          <div className="pt-20 flex justify-between items-end border-t border-slate-100">
             <div className="space-y-2 opacity-50">
               {isSigned ? <CheckCircle2 className="h-16 w-16 text-green-600" /> : <Stamp className="h-16 w-16" />}
               <p className="text-[8px] font-mono">DIGITAL AUTHENTICATION CODE: {isSigned ? "SIGNED_SECURE_0X99" : "PENDING_AUTH_STAMP"}</p>
             </div>
             <div className="text-center space-y-1">
               <div className="w-48 border-b-2 border-slate-900 mx-auto mb-2"></div>
               <p className="font-bold text-sm">Automated Compliance Officer</p>
               <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Pramāṇa Intelligence Node</p>
             </div>
          </div>
        </CardContent>

        <div className="bg-slate-50 p-6 text-center text-[10px] text-slate-400 font-bold border-t italic">
          Disclaimer: This is a deterministic evidence log generated from graph analytics.
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
